import { FastifyReply, FastifyRequest } from "fastify";
import { ReplyHelper } from "./reply.helper";
import { enums } from "@/enums";

export const routeHandler = (
    handler: (req: FastifyRequest, res: FastifyReply) => Promise<unknown>
) => {
    return async (req: FastifyRequest, res: FastifyReply) => {
        try {
            console.log("Request received:", req.method, req.url);
            await handler(req, res);
        } catch (error) {
            console.error("Error in route handler:", error);
            ReplyHelper.error(res, enums.StatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error");
            throw error;
        }
    };
}