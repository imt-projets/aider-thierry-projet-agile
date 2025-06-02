import { entities } from "@/entities";
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";
import { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { routeHandler } from "./routes.helper";

type MethodType = "GET" | "POST" | "PUT" | "DELETE";

interface RoutesConfig {
    method: MethodType;
    url : URL | string;
    handlerName : string;
    preHandler? : preHandlerHookHandler | preHandlerHookHandler[],
    schema?: {
        body?: object;
        querystring?: object;
        params?: object;
        headers?: object;
        response?: {
            [statusCode: number]: object;
        };
    };
}


type ServiceMethods<T extends ObjectLiteral> = {
  	[key: string]: (
		req: FastifyRequest<any>,
		res: FastifyReply,
		repositories: {
			primary: Repository<T>;
			[key: string]: Repository<any>;
		}
  	) => Promise<any>;
};

interface RouterOptions<
  	Entity extends ObjectLiteral, 
  	Service = ServiceMethods<Entity>
> {
	entity: EntityTarget<Entity>;
	service: Service;
	routes: RoutesConfig[];
	extraRepositories?: { 
		[key: string]: EntityTarget<any> 
	};
}

/**
 * Dynamically generates a Fastify plugin to expose custom CRUD routes
 * for a given TypeORM entity and its associated service.
 *
 * @template T - The TypeORM entity type.
 * @template S - The service type, which must be an object whose methods match the route handlers.
 *
 * @param options.entity - The target TypeORM entity.
 * @param options.service - The service containing methods to be used as route handlers.
 * @param options.routes - The route configuration (method, url, handlerName).
 *
 * @returns A Fastify plugin ready to be registered.
 *
 * @example
 * createRouterConfig<Item, typeof ItemService>({
 *   entity: Item,
 *   service: ItemService,
 *   routes: [
 *     { method: "GET", url: "/", handlerName: "getItems" },
 *     { method: "GET", url: "/:id", handlerName: "getItemById" }
 *   ]
 * })
 */
export const createRouterConfig = <
	T extends ObjectLiteral,
	S = ServiceMethods<T>
>({
	entity,
	service,
	routes,
	extraRepositories = {},
}: RouterOptions<T, S>): FastifyPluginAsync => {
	return async (fastify: FastifyInstance) => {
		if (!fastify.hasDecorator("orm")) {
		throw new Error("ORM is not registered!");
		}

		const primaryRepository: Repository<T> = fastify.orm.getRepository(entity);

		const repositories = {
			primary: primaryRepository,
			...Object.fromEntries(
				Object.entries(extraRepositories).map(([key, entity]) => [
					key,
					fastify.orm.getRepository(entity)
				])
			)
		};

		for (const route of routes) {
			const handlerFn = (service as ServiceMethods<T>)[route.handlerName];

		fastify.route({
			method: route.method,
			url: route.url.toString(),
			...(route.preHandler && { preHandler: route.preHandler }),
			...(route.schema && { schema: route.schema }),
			handler: routeHandler(
				(req, res) => handlerFn(req, res, repositories)
			),
		});
		}
	};
};
