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

    // TODO SPRINT 2: Add icon in relationnal entity, and then update this model:
    const hierarchy = await repository.find({
        select: {
            id: true,
            name: true,
            buildings: {
                id: true,
                name: true,
                rooms: {
                    id: true,
                    name: true,
                    items: {
                        id: true,
                        name: true
                    }
                }
            }
        },
        relations: {
            buildings: {
                rooms: {
                    items: true
                }
            }
        }
    });

    ReplyHelper.send(reply, enums.StatusCode.OK, hierarchy);
}