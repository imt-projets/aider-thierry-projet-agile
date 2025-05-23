import { Interfaces } from "@/interfaces";
import { DataSource } from "typeorm";
import { getDatabaseOptions } from "./options";

export class DatabaseConfiguration {
    public static async initializeDatabaseFromEnvironmentVariables(
        environment: Interfaces.Environment,
    ) {
        try {
            const orm = await new DataSource(
                {
                    ...getDatabaseOptions(environment), 
                    logging: ['error']
                }
            ).initialize();

            console.log('Database initialized successfully');

            return orm;
        } catch (error) {
            console.error(error);
            throw new Error('Database connection error');
        }
    }
}