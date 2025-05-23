import { FastifyReply, FastifyRequest } from "fastify";
import { entities } from "@/entities";
import { Repository } from "typeorm";
import { ReplyHelper } from "@/helpers";
import { enums } from "@/enums";

export const getHierarchy = async (
    request : FastifyRequest, 
    reply : FastifyReply, 
    repository : Repository<entities.School>
) => {

    const hierarchy = await repository.find({
        relations : ["buildings", "buildings.rooms"]
    })

    ReplyHelper.send(reply, enums.StatusCode.OK, hierarchy);
}