import { entities } from "@/entities";
import { enums } from "@/enums";
import { ReplyHelper } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "typeorm";

export const getAllInventoryToConfirm = async (
    _: FastifyRequest,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.InventoryToConfirm>,
    }
) => {
    const itemRepository = repositories.primary;

    const items = await itemRepository.find({
        order: {
            date: 'DESC'
        }
    });

    ReplyHelper.send(reply, enums.StatusCode.OK, items);
}