import { entities } from "@/entities";
import { enums } from "@/enums";
import { ReplyHelper } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { FindManyOptions, Repository } from "typeorm";


const getStructureFromType = async (
    repository : Repository<entities.Structure>, 
    type: entities.StructureTypeEnum,
    options: FindManyOptions<entities.Structure> = {}
) : Promise<entities.Structure[]> => {
    return await repository.find({
        ...options,
        where: { ...(options.where || {}), type }
    });
}

export const getSchools = async (
    _ : FastifyRequest, 
    reply : FastifyReply, 
    repository : Repository<entities.Structure>
) => {

    const schools = await getStructureFromType(
        repository,
        entities.StructureTypeEnum.SCHOOL
    );

    ReplyHelper.send(reply, enums.StatusCode.OK, schools);
}