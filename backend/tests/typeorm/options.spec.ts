import { getDatabaseOptions } from "../../src/config/typeorm/options";
import { Interfaces } from "../../src/interfaces";

jest.mock('../../src/config/typeorm/data-options', () => {
    return {
        getDataOptionsPath: jest.fn(() => ({
            entitiesPath: 'mock/entities',
            migrationsPath: 'mock/migrations',
        }))
    };
});

const mockEnv : Interfaces.Environment = {
    dbHost: 'localhost',
    dbPort: 5432,
    dbUser: 'user',
    dbPassword: 'pass',
    dbName: 'testdb',
    port: 3000,
};

describe('options', () => {
    it ('getDatabaseOptions', () => {
        const options = getDatabaseOptions(mockEnv);

        expect(options).toMatchObject({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "user",
            password: "pass",
            database: "testdb",
            synchronize: true,
            logging: true,
            entities: ['mock/entities'],
            migrations: [], 
            subscribers: [],
        });

    })
})