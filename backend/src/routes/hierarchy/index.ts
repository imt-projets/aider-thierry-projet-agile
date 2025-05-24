import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { services } from "@/services";
import { entities } from "@/entities";
import { Repository } from "typeorm";
import { routeHandler } from "@/helpers";

const hierarchy : FastifyPluginAsync = async (fastify : FastifyInstance) => {

    if (!fastify.hasDecorator('orm')) {
        throw new Error('ORM is not registered!');
    }

    const orm = fastify.orm;

    const structureRepository : Repository<entities.Structure>  = orm.getRepository(entities.Structure)

    fastify.get('', routeHandler((req, res) => services.Hierarchy.getHierarchy(req,res, structureRepository)))
}

export default hierarchy;