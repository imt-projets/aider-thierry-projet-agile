import { describe, it, expect, vi } from "vitest";
import { routeHandler } from "./routes.helper";
import { ReplyHelper } from "./reply.helper";
import { enums } from "@/enums";
import { FastifyReply, FastifyRequest } from "fastify";

describe("routeHandler", () => {
  it("should call the handler with req and res", async () => {
    const dummyHandler = vi.fn(async (req, res) => {
      return "ok";
    });
    const req = { method: "GET", url: "/test" } as FastifyRequest;
    const res = {} as FastifyReply;

    const wrappedHandler = routeHandler(dummyHandler);

    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await wrappedHandler(req, res);

    expect(dummyHandler).toHaveBeenCalledWith(req, res);
    expect(consoleLogSpy).toHaveBeenCalledWith("Request received:", "GET", "/test");

    consoleLogSpy.mockRestore();
  });

  it("should call ReplyHelper.error and throw if handler throws", async () => {
    const error = new Error("fail");
    const dummyHandler = vi.fn(async () => {
      throw error;
    });
    const req = { method: "POST", url: "/fail" } as FastifyRequest;
    const res = {} as FastifyReply;

    const errorSpy = vi.spyOn(ReplyHelper, "error").mockImplementation(() => {});

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const wrappedHandler = routeHandler(dummyHandler);

    await expect(wrappedHandler(req, res)).rejects.toThrow(error);

    expect(dummyHandler).toHaveBeenCalledWith(req, res);
    expect(errorSpy).toHaveBeenCalledWith(res, enums.StatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error in route handler:", error);
    expect(consoleLogSpy).toHaveBeenCalledWith("Request received:", "POST", "/fail");

    errorSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });
});