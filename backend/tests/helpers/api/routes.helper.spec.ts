import { routeHandler } from "../../../src/helpers/api/routes.helper";
import { ReplyHelper } from "../../../src/helpers/api/reply.helper";
import { enums } from "../../../src/enums";
import { FastifyReply, FastifyRequest } from "fastify";

describe("routeHandler", () => {
  it("should call the handler with req and res", async () => {
    const dummyHandler = jest.fn(async (req, res) => {
      return "ok";
    });
    const req = { method: "GET", url: "/test" } as FastifyRequest;
    const res = {} as FastifyReply;

    const wrappedHandler = routeHandler(dummyHandler);

    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await wrappedHandler(req, res);

    expect(dummyHandler).toHaveBeenCalledWith(req, res);
    expect(consoleLogSpy).toHaveBeenCalledWith("Request received:", "GET", "/test");

    consoleLogSpy.mockRestore();
  });

  it("should call ReplyHelper.error and throw if handler throws", async () => {
    const error = new Error("fail");
    const dummyHandler = jest.fn(async () => {
      throw error;
    });
    const req = { method: "POST", url: "/fail" } as FastifyRequest;
    const res = {} as FastifyReply;

    const errorSpy = jest.spyOn(ReplyHelper, "error").mockImplementation(() => {});

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

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