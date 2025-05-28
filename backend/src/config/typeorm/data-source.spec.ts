import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DatabaseConfiguration } from "./data-source";
import { DataSource } from "typeorm";
import { Interfaces } from "@/interfaces";

vi.mock('typeorm', () => {
  return {
    DataSource: vi.fn().mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue("mockDataSourceInstance"),
    })),
  };
});

vi.mock("./options", () => ({
  getDatabaseOptions: vi.fn(() => ({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "user",
    password: "pass",
    database: "testdb",
    synchronize: true,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
  })),
}));

describe("DatabaseConfiguration", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const mockEnv: Interfaces.Environment = {
        dbHost: "localhost",
        dbPort: 5432,
        dbUser: "user",
        dbPassword: "pass",
        dbName: "testdb",
        port: 3000,
    };

    it("should initialize database and return the DataSource instance", async () => {
        const result = await DatabaseConfiguration.initializeDatabaseFromEnvironmentVariables(mockEnv);

        expect(DataSource).toHaveBeenCalled();

        const mockInstance = (DataSource as any).mock.results[0].value;
        expect(mockInstance.initialize).toHaveBeenCalled();

        expect(result).toBe("mockDataSourceInstance");
    });

    // TODO (ADD TEST WHEN ERROR)
});
