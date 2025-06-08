import { entities } from "@/entities";
import { enums } from "@/enums";
import { ReplyHelper } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "typeorm";
import { services } from "@/services";
import { InventoryType } from "@/enums/inventory-type.enum";

interface Repositories {
    primary: Repository<entities.InventoryToConfirm>;
    item: Repository<entities.Item>;
    structure: Repository<entities.Structure>;
}

interface InventoryToConfirmByIdParams {
    id: string;
}

interface ValidateInventoryBody {
    ids: string[];
}

const handleMoveItem = async (
    inventory: entities.InventoryToConfirm,
    reply: FastifyReply,
    repositories: Repositories
): Promise<boolean> => {
    for (const mapping of inventory.mapping) {
        for (const itemId of mapping.itemsList || []) {
            try {
                await services.Item.updateItemRoomFromInventoryId(
                    { params: { inventoryNumber: itemId }, body: { id: mapping.newRoom } } as any,
                    reply,
                    { primary: repositories.item, structure: repositories.structure }
                );
            } catch (error) {
                console.error(`Error moving item ${itemId}:`, error);
                return false;
            }
        }
    }
    return true;
};

const handleInventoryRoom = async (
    inventory: entities.InventoryToConfirm,
    itemIds: string[],
    reply: FastifyReply,
    repositories: Repositories
): Promise<boolean> => {
    if (itemIds.length === 0) return true;

    try {
        await services.Structure.editItemsInRoomFromInventoryId(
            { params: { id: inventory.room }, body: { ids: itemIds } } as any,
            reply,
            { primary: repositories.structure, item: repositories.item }
        );
        return true;
    } catch (error) {
        console.error("Error updating room inventory:", error);
        return false;
    }
};

export const getAllInventoryToConfirm = async (
    _: FastifyRequest,
    reply: FastifyReply,
    repositories: Pick<Repositories, 'primary'>
) => {
    const items = await repositories.primary.find({
        order: { date: 'DESC' }
    });
    ReplyHelper.send(reply, enums.StatusCode.OK, items);
};

export const deleteInventoryToConfirm = async (
    request: FastifyRequest<{ Params: InventoryToConfirmByIdParams }>,
    reply: FastifyReply,
    repositories: Pick<Repositories, 'primary'>
) => {
    const { id } = request.params;

    if (!id) {
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required to delete an inventory");
    }

    const inventory = await repositories.primary.findOne({ where: { id } });
    if (!inventory) {
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "Inventory not found");
    }

    await repositories.primary.remove(inventory);
    ReplyHelper.send(reply, enums.StatusCode.OK, { message: "Inventory deleted successfully" });
};

export const validateInventoryToConfirm = async (
    request: FastifyRequest<{ 
        Params: InventoryToConfirmByIdParams,
        Body: ValidateInventoryBody
    }>,
    reply: FastifyReply,
    repositories: Repositories
) => {
    const { id } = request.params;
    const { ids } = request.body;

    if (!id) {
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required to validate an inventory");
    }

    const inventory = await repositories.primary.findOne({ where: { id } });
    if (!inventory) {
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "Inventory not found");
    }

    try {
        const isSuccessful = inventory.type === InventoryType.MOVE_ITEM
            ? await handleMoveItem(inventory, reply, repositories)
            : await handleInventoryRoom(inventory, ids, reply, repositories);

        if (isSuccessful) {
            await repositories.primary.remove(inventory);
            ReplyHelper.send(reply, enums.StatusCode.OK, { message: "Inventory validated successfully" });
        } else {
            ReplyHelper.error(reply, enums.StatusCode.INTERNAL_SERVER_ERROR, "Some operations failed during inventory validation");
        }
    } catch (error) {
        console.error("Error validating inventory:", error);
        ReplyHelper.error(reply, enums.StatusCode.INTERNAL_SERVER_ERROR, "Error validating inventory");
    }
};