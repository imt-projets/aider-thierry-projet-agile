import { getDatabaseOptions } from "./options";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Interfaces } from "@/interfaces";

vi.mock('./data-options', () => {
    return {
        getDataOptionsPath: vi.fn(() => ({
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