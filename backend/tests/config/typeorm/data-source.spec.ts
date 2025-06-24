import { DatabaseConfiguration } from "../../../src/config/typeorm/data-source";
import { DataSource } from "typeorm";
import { Interfaces } from "../../../src/interfaces";

jest.mock('typeorm', () => {
	return {
		DataSource: jest.fn().mockImplementation(() => ({
			initialize: jest.fn().mockResolvedValue("mockDataSourceInstance"),
		})),
	};
});

jest.mock("../../../src/config/typeorm/options", () => ({
	getDatabaseOptions: jest.fn(() => ({
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
	let consoleLogSpy: ReturnType<typeof jest.spyOn>;
	let consoleErrorSpy: ReturnType<typeof jest.spyOn>;

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
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
