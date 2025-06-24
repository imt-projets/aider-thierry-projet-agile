import { environment, getDatabaseOptions } from "@/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from 'typeorm-extension'
import { HierarchySeeder } from "./hierarchy";
import { UserSeeder } from "./user"; 
import { User } from "@/services/user";
import { InventoryToConfirmSeeder } from "./inventoryToConfirm/inventoryToConfirm.seeder";

const initializeSeeder = async () => {
    const options : DataSourceOptions & SeederOptions = {
        ...getDatabaseOptions(environment),
        seeds: [HierarchySeeder, UserSeeder, InventoryToConfirmSeeder],
    }

    const dataSource = await new DataSource(
        options
    ).initialize();

    await dataSource.synchronize(true);
    await runSeeders(dataSource);

    console.log("Successfully seeded the database");
    await dataSource.destroy();
    console.log("Successfully closed the database connection");
    process.exit();
}

initializeSeeder();