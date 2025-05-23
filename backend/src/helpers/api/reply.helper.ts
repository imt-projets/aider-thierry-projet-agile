import { FastifyReply } from "fastify";

export class ReplyHelper {
    static send(reply: FastifyReply,statusCode : number, data: unknown) {
        reply.send({
            status: "success",
            data
        }).status(statusCode);
    }

    static error(reply: FastifyReply, statusCode : number, message: string) {
        reply.send({
            message
        }).status(statusCode);
    }
}