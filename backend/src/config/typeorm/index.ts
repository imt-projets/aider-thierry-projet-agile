import { Interfaces } from "../../interfaces";
import { DataSource } from "typeorm";

export class DatabaseConfiguration {
    public static async initializeDatabaseFromEnvironmentVariables(
        environment: Interfaces.Environment,
    ) {
        try {
            const orm = await new DataSource({
                type: "postgres",
                host: environment.dbHost,
                port: environment.dbPort,
                username: environment.dbUser,
                password: environment.dbPassword,
                database: environment.dbName,
                synchronize: true,
                logging: true,
                entities: [],
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