import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { services } from "@/services";
import { entities } from "@/entities";
import { Repository } from "typeorm";

const hierarchy : FastifyPluginAsync = async (fastify : FastifyInstance) => {

    if (!fastify.hasDecorator('orm')) {
        throw new Error('ORM is not registered!');
    }

    const orm = fastify.orm;

    const schoolRepository : Repository<entities.School>  = orm.getRepository(entities.School)


    fastify.get('/', (req, res) => services.Hierarchy.getHierarchy(req,res, schoolRepository))
}

export default hierarchy;