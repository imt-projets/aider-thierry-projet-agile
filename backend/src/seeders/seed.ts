import { environment, getDatabaseOptions } from "@/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from 'typeorm-extension'
import { HierarchySeeder } from "./hierarchy";


const initializeSeeder = async () => {

    const options : DataSourceOptions & SeederOptions = {
        ...getDatabaseOptions(environment),
        seeds: [HierarchySeeder]
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