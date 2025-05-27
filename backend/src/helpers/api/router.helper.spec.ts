import { createRouterConfig } from "@/helpers";
import { FastifyInstance } from "fastify";
import { describe, it, expect, vi } from "vitest";

describe("createRouterConfig", () => {
  it("should register routes with correct handler and repository", async () => {
    const fakeRepository = {};

    const dummyHandler = vi.fn(async (req, res, repo) => {
      expect(repo).toBe(fakeRepository);
      return "handler result";
    });

    const plugin = createRouterConfig({
      entity: class DummyEntity {},
      service: { dummyHandler },
      routes: [
            { 
                method: "GET", 
                url: "/", 
                handlerName: "dummyHandler" 
            }
        ],
    });

    const fastifyMock = {
      hasDecorator: vi.fn(() => true),
      orm: { getRepository: vi.fn(() => fakeRepository) },
      route: vi.fn(),
    };

    await plugin(fastifyMock as unknown as FastifyInstance, {});

    expect(fastifyMock.hasDecorator).toHaveBeenCalledWith("orm");
    expect(fastifyMock.orm.getRepository).toHaveBeenCalledWith(
      expect.any(Function)
    );

    expect(fastifyMock.route).toHaveBeenCalledTimes(1);

    const routeConfig = fastifyMock.route.mock.calls[0][0];
    expect(routeConfig.method).toBe("GET");
    expect(routeConfig.url).toBe("/");

    const mockReq = {};
    const mockRes = {};

    await routeConfig.handler(mockReq, mockRes);
    expect(dummyHandler).toHaveBeenCalledWith(mockReq, mockRes, fakeRepository);
  });

  it("should throw if orm is not registered", async () => {
    const plugin = createRouterConfig({
      entity: class DummyEntity {},
      service: {},
      routes: [],
    });

    const fastifyMock = {
      hasDecorator: vi.fn(() => false),
    };

    await expect(plugin(fastifyMock as unknown as FastifyInstance, {})).rejects.toThrow("ORM is not registered!");
  });
});


