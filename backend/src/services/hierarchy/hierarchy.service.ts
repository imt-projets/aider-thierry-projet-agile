import { FastifyReply, FastifyRequest } from "fastify";
import { entities } from "@/entities";
import { Repository } from "typeorm";
import { ReplyHelper } from "@/helpers";
import { enums } from "@/enums";

export const getHierarchy = async (
    request : FastifyRequest, 
    reply : FastifyReply, 
    repositories: {
        primary: Repository<entities.Structure>,
    }
) => {
    const hierarchyRepository = repositories.primary;
    // TODO SPRINT 2: Add icon in relationnal entity, and then update this model:
    const schools = await hierarchyRepository.find({
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
                        name: true,
                        inventoryNumber: true,
                        serialNumber: true
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