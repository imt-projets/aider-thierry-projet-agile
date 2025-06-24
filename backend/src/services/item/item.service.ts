import { entities } from "@/entities";
import { enums } from "@/enums";
import { ReplyHelper } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { FindOptionsWhere, IsNull, Not, Repository } from "typeorm";


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


export interface ItemPaginationParams {
    page: string;
}

export const getItemsPaginationTable = async (
    request: FastifyRequest<{Params: ItemPaginationParams}>, 
    reply : FastifyReply, 
    repositories: {
        primary: Repository<entities.Item>,
    }
) => {
    const itemRepository = repositories.primary;

    const page = parseInt(request.params.page) || 1;

    const pageCount = 8;
    const skip = (page-1) * pageCount;


    const itemsProperties = await itemRepository.findAndCount({
        skip,
        take: pageCount,
        relations: { room: true }
    })

    ReplyHelper.send(reply, enums.StatusCode.OK, { items : itemsProperties[0], count: itemsProperties[1] });

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

export interface ItemByInventoryNumberParams {
    inventoryNumber : entities.Item["inventoryNumber"];
}

export const getItemByInventoryNumber = async (
    request: FastifyRequest<{ Params : ItemByInventoryNumberParams }>,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.Item>,
    }
) => {
    const itemRepository = repositories.primary;
    const { inventoryNumber } = request.params;

    if (!inventoryNumber) 
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Inventory number is required to find an item")

    const item = await itemRepository.findOne({ 
        where: { inventoryNumber },
        relations: ['room', 'itemType']
    });

    if (!item) 
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "Item not found" );
    
    ReplyHelper.send(reply, enums.StatusCode.OK, item);
}

export interface UpdateItemRoomBody {
    id: entities.Structure["id"];
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

export const getItemsRoomStats = async (
    _: FastifyRequest,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.Item>
    }
) => {
    const itemRepository = repositories.primary;

    const nb_items_ok = await itemRepository.count({
        where: { room: { id: Not(IsNull()) } }
    });

    const nb_items_no_rooms = await itemRepository.count({
        where: { room: IsNull() }
    });

    return ReplyHelper.send(reply, enums.StatusCode.OK, {
        ok: nb_items_ok,
        no_rooms: nb_items_no_rooms
    });
}



export interface createItemRequestBody {
    item : entities.Item,
    properties : {
        nb_occurance: number;
    }
}


export const createItem = async (
    request: FastifyRequest<{Body: createItemRequestBody}>,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.Item>
    }
) => {
    const itemRepository = repositories.primary;

    const { item, properties } = request.body;

    const from = parseInt(item.inventoryNumber);
    const to = from+properties.nb_occurance;

    const itemsToSave : entities.Item[] = []

    for (let i = from; i < to; i++) {
        const { id, ...itemData } = item as entities.Item;
        itemData.inventoryNumber = i.toString();
        const newItem = itemRepository.create(itemData);
        itemsToSave.push(newItem);
    }

    const savedItems = await itemRepository.save(itemsToSave);

    return ReplyHelper.send(reply, enums.StatusCode.CREATED, savedItems);
}