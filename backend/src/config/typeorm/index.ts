import path from "path";
import { Interfaces } from "../../interfaces";
import { DataSource } from "typeorm";

type AllFieldsAreStrings<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
};

interface Directories {
    entitiesPath : string;
    migrationsPath : string;
}

const getDataOptionsPath = () : AllFieldsAreStrings<Directories> => {
    return {
        entitiesPath: path.join(__dirname, '../../entities/**.{js,ts}'),
        migrationsPath: "TODO : Add migrations"
    }
}

export class DatabaseConfiguration {
    public static async initializeDatabaseFromEnvironmentVariables(
        environment: Interfaces.Environment,
    ) {
        try {

            const { entitiesPath, migrationsPath } = getDataOptionsPath()

            const orm = await new DataSource({
                type: "postgres",
                host: environment.dbHost,
                port: environment.dbPort,
                username: environment.dbUser,
                password: environment.dbPassword,
                database: environment.dbName,
                synchronize: true,
                logging: true,
                entities: [entitiesPath],
                subscribers: [],
                migrations: [],
            }).initialize();

            console.log('Database initialized successfully');

            return orm;
        } catch (error) {
            console.error(error);
            throw new Error('Database connection error');
        }
    }
}