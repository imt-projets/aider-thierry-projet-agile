import { enums } from "@/enums";
import { FastifyReply } from "fastify";

export class ReplyHelper {
    
    static send(reply: FastifyReply, statusCode : enums.StatusCode, data: unknown) {
        reply.send({
            status: "success",
            data
        }).status(statusCode);
    }

    static error(reply: FastifyReply, statusCode : enums.StatusCode, message: string) {
        reply.send({
            message
        }).status(statusCode);
    }
}