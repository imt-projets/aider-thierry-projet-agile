import { entities } from "@/entities";
import { StructureTypeEnum } from "@/entities/organizational";
import { enums } from "@/enums";
import { ReplyHelper } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { FindManyOptions, In, Repository } from "typeorm";


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
    repositories: { primary: Repository<entities.Structure> }
) => {
    const structureRepository = repositories.primary

    const schools = await getStructureFromType(
        structureRepository,
        entities.StructureTypeEnum.SCHOOL
    );

    ReplyHelper.send(reply, enums.StatusCode.OK, schools);
}

export const getRooms = async (
    _ : FastifyRequest, 
    reply : FastifyReply, 
    repositories: { primary: Repository<entities.Structure> }
) => {
    const structureRepository = repositories.primary

    const rooms = await getStructureFromType(
        structureRepository,
        entities.StructureTypeEnum.ROOM
    );

    ReplyHelper.send(reply, enums.StatusCode.OK, rooms);
}

export interface RoomFromInventoryIdParams {
    name : string;
}

export interface EditItemsInRoom {
    ids: entities.Item["id"][]
}

export const getRoomFromInventoryId = async (
    request: FastifyRequest<{Params : RoomFromInventoryIdParams }>,
    reply : FastifyReply,
    repositories: { primary: Repository<entities.Structure> }
) => {
    const structureRepository = repositories.primary
    const { name } = request.params;

    if (!name) 
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required to find an item");

    const room = await structureRepository.findOne({
        where: {
            type: StructureTypeEnum.ROOM,
            name: name
        },
        relations: ['items', 'items.itemType']
    })

    if (!room) 
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "Room not found");

    ReplyHelper.send(reply, enums.StatusCode.OK, room);
}

export interface RoomFromIdParams {
    id : string;
}

export const editItemsInRoomFromInventoryId = async (
    request: FastifyRequest<{
        Params: RoomFromIdParams,
        Body: EditItemsInRoom
    }>,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.Structure>,
        item: Repository<entities.Item>
    }
) => {
    const structureRepository = repositories.primary;
    const itemRepository = repositories.item;
  
    const { id } = request.params;

    if (!id) 
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required to find an item");

    const room = await structureRepository.findOne({
        where: {
            type: StructureTypeEnum.ROOM,
            id: id
        },
        relations: {
            items: true
        }
    })

    if (!room) 
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "Room not found");

    const { ids: itemIds } = request.body;

    const items = await itemRepository.find({
        where: { inventoryNumber: In(itemIds) }
    });

    if (items.length !== itemIds.length) {
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Some item IDs are invalid.");
    }
    
    room.items = items;
    
    const updatedRoom = await structureRepository.save(room);

    return ReplyHelper.send(reply, enums.StatusCode.OK, updatedRoom);
}