import { FastifyReply, FastifyRequest } from "fastify";
import { entities } from "@/entities";
import { Repository } from "typeorm";
import { ReplyHelper } from "@/helpers";
import { enums } from "@/enums";

export const getHierarchy = async (
    request : FastifyRequest, 
    reply : FastifyReply, 
    repository : Repository<entities.Structure>
) => {

    // TODO SPRINT 2: Add icon in relationnal entity, and then update this model:
    const schools = await repository.find({
        where: { type: entities.StructureTypeEnum.SCHOOL },
        select: {
            id: true,
            name: true,
            type: true,
            children: {
                id: true,
                name: true,
                type: true,
                children: {
                    id: true,
                    name: true,
                    type: true,
                    items: {
                        id: true,
                        name: true
                    }
                }
            }
        },
        relations: {
            children: {
                children: {
                    items: true
                }
            }
        }
    });

    ReplyHelper.send(reply, enums.StatusCode.OK, schools);
}