import { entities } from "@/entities";
import { enums } from "@/enums";
import { ReplyHelper } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { Repository } from "typeorm";

export const getUsers = async (
    _: FastifyRequest,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.User>,
    }
) => {
    const userRepository = repositories.primary;

    const users = await userRepository.find();
    ReplyHelper.send(reply, enums.StatusCode.OK, users);
};

interface UserByIdParams {
    id: string;
}

export const getUserById = async (
    request: FastifyRequest<{ Params: UserByIdParams }>,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.User>,
    }
) => {
    const userRepository = repositories.primary;
    const { id } = request.params;

    if (!id)
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required to find a user");

    const user = await userRepository.findOne({ where: { id } });

    if (!user)
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "User not found");

    ReplyHelper.send(reply, enums.StatusCode.OK, user);
};

export const createUser = async (
    request: FastifyRequest,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.User>,
    }
) => {
    const userRepository = repositories.primary;
    const { firstname, lastname, email, password } = request.body as Partial<entities.User>;

    if (!firstname || !lastname || !email || !password)
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Missing required fields");

    const user = userRepository.create({ firstname, lastname, email, password });

    try {
        const savedUser = await userRepository.save(user);
        ReplyHelper.send(reply, enums.StatusCode.CREATED, savedUser);
    } catch (err) {
        ReplyHelper.error(reply, enums.StatusCode.INTERNAL_SERVER_ERROR, "Error saving user");
    }
};

export const updateUser = async (
    request: FastifyRequest<{ Params: UserByIdParams }>,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.User>,
    }
) => {
    const userRepository = repositories.primary;
    const { id } = request.params;
    const data = request.body as Partial<entities.User>;

    if (!id)
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required");

    await userRepository.update(id, data);
    const updated = await userRepository.findOne({ where: { id } });

    if (!updated)
        return ReplyHelper.error(reply, enums.StatusCode.NOT_FOUND, "User not found after update");

    ReplyHelper.send(reply, enums.StatusCode.OK, updated);
};

export const deleteUser = async (
    request: FastifyRequest<{ Params: UserByIdParams }>,
    reply: FastifyReply,
    repositories: {
        primary: Repository<entities.User>,
    }
) => {
    const userRepository = repositories.primary;
    const { id } = request.params;

    if (!id)
        return ReplyHelper.error(reply, enums.StatusCode.BAD_REQUEST, "Id is required");

    await userRepository.delete(id);
    ReplyHelper.send(reply, enums.StatusCode.NO_CONTENT, id);
}
