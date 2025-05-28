import { describe, it, expect, vi } from "vitest";
import { ReplyHelper } from "./reply.helper";
import { enums } from "@/enums";
import { FastifyReply } from "fastify";

const reply = {
    send: vi.fn().mockReturnThis(),
    status: vi.fn()
} as unknown as FastifyReply

describe("ReplyHelper", () => {

    it("should send a success response with status code OK", async () => {
        ReplyHelper.send(reply, enums.StatusCode.OK, {})   
        
        expect(reply.send).toHaveBeenCalledWith({
            status: "success",
            data: {}
        });

        expect(reply.status).toHaveBeenCalledWith(enums.StatusCode.OK);
    });


    it("should send an error response with status code INTERNAL_SERVER_ERROR", async () => {
        const errorMessage = "Error";
        ReplyHelper.error(reply, enums.StatusCode.INTERNAL_SERVER_ERROR, errorMessage);

        expect(reply.send).toHaveBeenCalledWith({
            message: errorMessage
        });

        expect(reply.status).toHaveBeenCalledWith(enums.StatusCode.INTERNAL_SERVER_ERROR);
    });
})