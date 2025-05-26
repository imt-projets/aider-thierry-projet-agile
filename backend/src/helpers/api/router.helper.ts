import { entities } from "@/entities";
import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { routeHandler } from "./routes.helper";

type MethodType = "GET" | "POST" | "PUT" | "DELETE";

interface RoutesConfig {
    method: MethodType;
    url : URL | string;
    handlerName : string;
}

type ServiceMethods<T extends ObjectLiteral> = {
	[key: string]: (req: FastifyRequest, res: FastifyReply, repository: Repository<T>) => Promise<any>;
};

interface CrudPluginOptions<Entity extends ObjectLiteral, Service extends  ServiceMethods<Entity>> {
  entity: EntityTarget<Entity>;
  service: Service;
  routes: RoutesConfig[];
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
	S extends ServiceMethods<T>
>({
	entity,
	service,
	routes,
}: CrudPluginOptions<T,S> 
): FastifyPluginAsync => {

  return async (fastify: FastifyInstance) => {

    if (!fastify.hasDecorator("orm")) {
    	throw new Error("ORM is not registered!");
    }
    
    const repository: Repository<T> = fastify.orm.getRepository(entity);

    for (const route of routes) {
     	const handlerFn = service[route.handlerName];

      	fastify.route({
			method: route.method,
			url: route.url.toString(),
			handler: routeHandler((req, res) => handlerFn(req, res, repository)),
		});
    }
  };
};