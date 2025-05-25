import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { services } from "@/services";
import { entities } from "@/entities";
import { Repository } from "typeorm";
import { routeHandler } from "@/helpers";

const structure : FastifyPluginAsync = async (fastify : FastifyInstance) => {

    if (!fastify.hasDecorator('orm')) {
        throw new Error('ORM is not registered!');
    }

    const orm = fastify.orm;

    const structureRepository : Repository<entities.Structure>  = orm.getRepository(entities.Structure)

    // TODO: Add others structure entity
    fastify.get('/schools', routeHandler((req, res) => services.getSchools(req,res, structureRepository)))
}

export default structure;