import path from "path";
import { Interfaces } from "@/interfaces";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

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

export const getDatabaseOptions = (environment : Interfaces.Environment) : PostgresConnectionOptions => {

    const { entitiesPath, migrationsPath } = getDataOptionsPath()

    return {
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
    }
}