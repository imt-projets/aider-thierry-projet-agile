import { Interfaces } from "@/interfaces";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { getDataOptionsPath } from "./data-options";

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