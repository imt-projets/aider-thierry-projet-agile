import { Interfaces } from "../../interfaces";
import { DataSource } from "typeorm";
import { User } from "../../entities/user";
import { Item } from "src/entities/Item";
import { ItemType } from "src/entities/ItemType";
import { Comment } from "src/entities/Comment";
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
                entities: [User, Item, ItemType, Comment],
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