import { Interfaces } from "../../../src/interfaces";
import { validateEnv } from "../../../src/config";

describe("validateEnv", () => {

    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
        process.env = { ...ORIGINAL_ENV };
    });

    afterEach(() => {
        process.env = ORIGINAL_ENV;
    });

    it("should return a valid environment", () => {

        process.env.DB_HOST = 'localhost';
        process.env.DB_PORT = '5432';
        process.env.DB_NAME = 'test_db';
        process.env.DB_USER = 'user';
        process.env.DB_PASSWORD = 'pass';
        process.env.PORT = '3000';

        const result = validateEnv();

        expect(result).toEqual<Interfaces.Environment>({
            dbHost: 'localhost',
            dbPort: 5432,
            dbName: 'test_db',
            dbUser: 'user',
            dbPassword: 'pass',
            port: 3000,
        });
        
    });


    it('should throw an error when a required variable is missing', () => {
        delete (process.env as any).DB_HOST;

        expect(() => validateEnv()).toThrowError(
            /The following environment variables are missing: DB_HOST/
        );
    });
});
