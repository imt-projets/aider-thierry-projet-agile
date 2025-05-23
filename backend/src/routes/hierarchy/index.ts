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

    const schoolRepository : Repository<entities.School>  = orm.getRepository(entities.School)


    fastify.get('', routeHandler((req, res) => services.Hierarchy.getHierarchy(req,res, schoolRepository)))
}

export default hierarchy;