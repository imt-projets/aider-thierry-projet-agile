import { enums } from "@/enums";
import { FastifyReply } from "fastify";

export class ReplyHelper {
    
    static send(reply: FastifyReply, statusCode : enums.StatusCode, data: unknown) {
        reply.status(statusCode).send({
            status: "success",
            data
        });
    }

    static error(reply: FastifyReply, statusCode : enums.StatusCode, message: string) {
        reply.status(statusCode).send({
            message
        });
    }
}