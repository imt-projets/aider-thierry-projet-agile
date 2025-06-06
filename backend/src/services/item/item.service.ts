import { entities } from "@/entities";
import { enums } from "@/enums";
import { ReplyHelper } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "typeorm";


export interface ItemByIdParams {
    id : entities.Item["id"];
}

export interface ItemByInventoryNumberParams {
    inventoryNumber : entities.Item["inventoryNumber"];
}

export interface UpdateItemRoomBody {
    id: entities.Structure["id"];
}

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

export const getItemsWithRooms = async (
    _: FastifyRequest,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.Item>
    }
) => {
    const itemRepository = repositories.primary;

    const items = await itemRepository.find({ relations: { room: true }})

    ReplyHelper.send(reply, enums.StatusCode.OK, items);
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

export const updateItemRoomFromInventoryId = async (
    request: FastifyRequest<{ 
        Params : ItemByInventoryNumberParams,
        Body: UpdateItemRoomBody
    }>,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.Item>,
        structure: Repository<entities.Structure>
    } 
) => {
    const itemRepository = repositories.primary;
    const structureRepository = repositories.structure;

    const { inventoryNumber } = request.params;
    const { id: roomId } = request.body;

    if (!inventoryNumber) 
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "inventoryNumber is required to update room item")

    if (!roomId) {
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Room ID is required.");
    }

    const item = await itemRepository.findOne({ where: { inventoryNumber } });

    if (!item) 
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "Item not found" );
    
    const room = await structureRepository.findOne({
        where: { id: roomId }   
    })
      
    if (!room) {
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "Room not found.");
    }

    item.room = room;

    const updatedItem = await itemRepository.save(item);

    return ReplyHelper.send(reply, enums.StatusCode.OK, updatedItem);

}