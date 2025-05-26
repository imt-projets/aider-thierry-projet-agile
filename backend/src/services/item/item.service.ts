import { entities } from "@/entities";
import { enums } from "@/enums";
import { ReplyHelper } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "typeorm";

export const getItems = async (
    _ : FastifyRequest, 
    reply : FastifyReply, 
    repository : Repository<entities.Item>
) => {

    const items = await repository.find({})

    ReplyHelper.send(reply, enums.StatusCode.OK, items);
}

export const getItemById = async (
    request: FastifyRequest,
    reply: FastifyReply,
    repository: Repository<entities.Item>
) => {
    const id = (request.params as any).id;
    const item = await repository.findOne({ where: { id } });

    if (!item) {
        return ReplyHelper.send(reply, enums.StatusCode.NOT_FOUND, { message: "Item not found" });
    }

    ReplyHelper.send(reply, enums.StatusCode.OK, item);
}
