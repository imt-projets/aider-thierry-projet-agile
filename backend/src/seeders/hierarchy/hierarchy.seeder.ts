import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { entities } from "@/entities";

export class HierarchySeeder extends Seeder {
    async run(dataSource: DataSource) {

        const schoolRepository = dataSource.getRepository(entities.School);
        const buildingRepository = dataSource.getRepository(entities.Building);
        const roomRepository = dataSource.getRepository(entities.Room);
        
        const school = schoolRepository.create({
            name : "IMT Atlantique"
        })
        
        await schoolRepository.save(school);

        const buildingA = buildingRepository.create({
            name: "Bâtiment A",
            parent: school,
        });

        const buildingB = buildingRepository.create({
            name: "Bâtiment B",
            parent: school,
        });

        await buildingRepository.save([buildingA, buildingB]);

        const roomA1 = roomRepository.create({ name: "Salle A101", parent: buildingA });
        const roomA2 = roomRepository.create({ name: "Salle A102", parent: buildingA });

        const roomB1 = roomRepository.create({ name: "Salle B201", parent: buildingB });
        const roomB2 = roomRepository.create({ name: "Salle B202", parent: buildingB });

        await roomRepository.save([roomA1, roomA2, roomB1, roomB2]);
    }
}