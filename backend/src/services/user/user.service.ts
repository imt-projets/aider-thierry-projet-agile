import { entities } from "@/entities";
import { enums } from "@/enums";
import { ReplyHelper } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "typeorm";

export const getUsers = async (
    _: FastifyRequest,
    reply: FastifyReply,
    repository: Repository<entities.User>
) => {
    const users = await repository.find();
    ReplyHelper.send(reply, enums.StatusCode.OK, users);
};

interface UserByIdParams {
    id: string;
}

export const getUserById = async (
    request: FastifyRequest<{ Params: UserByIdParams }>,
    reply: FastifyReply,
    repository: Repository<entities.User>
) => {
    const { id } = request.params;

    if (!id)
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required to find a user");

    const user = await repository.findOne({ where: { id } });

    if (!user)
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "User not found");

    ReplyHelper.send(reply, enums.StatusCode.OK, user);
};

export const createUser = async (
    request: FastifyRequest,
    reply: FastifyReply,
    repository: Repository<entities.User>
) => {
    const { firstname, lastname, email, password } = request.body as Partial<entities.User>;

    if (!firstname || !lastname || !email || !password)
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Missing required fields");

    const user = repository.create({ firstname, lastname, email, password });

    try {
        const savedUser = await repository.save(user);
        ReplyHelper.send(reply, enums.StatusCode.CREATED, savedUser);
    } catch (err) {
        ReplyHelper.error(reply, enums.StatusCode.INTERNAL_SERVER_ERROR, "Error saving user");
    }
};

export const updateUser = async (
    request: FastifyRequest<{ Params: UserByIdParams }>,
    reply: FastifyReply,
    repository: Repository<entities.User>
) => {
    const { id } = request.params;
    const data = request.body as Partial<entities.User>;

    if (!id)
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required");

    await repository.update(id, data);
    const updated = await repository.findOne({ where: { id } });

    if (!updated)
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "User not found after update");

    ReplyHelper.send(reply, enums.StatusCode.OK, updated);
};

export const deleteUser = async (
    request: FastifyRequest<{ Params: UserByIdParams }>,
    reply: FastifyReply,
    repository: Repository<entities.User>
) => {
    const { id } = request.params;

    if (!id)
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required");

    await repository.delete(id);
    ReplyHelper.send(reply, enums.StatusCode.NO_CONTENT, id);
}
