import { entities } from "@/entities";
import { enums } from "@/enums";
import { ReplyHelper } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "typeorm";

export const getItems = async (
    _ : FastifyRequest, 
    reply : FastifyReply, 
    repositories: {
        primary: Repository<entities.Item>,
    }
) => {
    const itemRepository = repositories.primary;

    const items = await itemRepository.find({})

    ReplyHelper.send(reply, enums.StatusCode.OK, items);
}


export interface ItemByIdParams {
    id : string;
}

export const getItemById = async (
    request: FastifyRequest<{ Params : ItemByIdParams}>,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.Item>,
    }
) => {
    const itemRepository = repositories.primary;
    const { id } = request.params;

    if (!id) 
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required to find an item")

    const item = await itemRepository.findOne({ where: { id } });

    if (!item) 
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "Item not found" );
    
    ReplyHelper.send(reply, enums.StatusCode.OK, item);
}
