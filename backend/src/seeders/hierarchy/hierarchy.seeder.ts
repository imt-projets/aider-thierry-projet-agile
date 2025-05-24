import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { entities } from "@/entities";

export class HierarchySeeder extends Seeder {
    async run(dataSource: DataSource) {

        const schoolRepository = dataSource.getRepository(entities.School);
        const buildingRepository = dataSource.getRepository(entities.Building);
        const roomRepository = dataSource.getRepository(entities.Room);
        const itemTypeRepository = dataSource.getRepository(entities.ItemType);
        const itemRepository = dataSource.getRepository(entities.Item);


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


        const chairType = itemTypeRepository.create({ name: "Chaise", description: "Objet pour s’asseoir" });
        const tableType = itemTypeRepository.create({ name: "Table", description: "Surface pour poser des choses" });
        const projectorType = itemTypeRepository.create({ name: "Projecteur", description: "Appareil de projection" });
        await itemTypeRepository.save([chairType, tableType, projectorType]);


        const now = new Date();
        const addYears = (years: number) => {
            const date = new Date(now);
            date.setFullYear(date.getFullYear() + years);
            return date;
        };

        const items = [
            itemRepository.create({
                name: "Chaise",
                description: "Chaise en plastique",
                price: 25,
                warrantyEndDate: addYears(2),
                endOfLifeDate: addYears(5),
                brand: "Ikea",
                room: roomA1,
                itemType: chairType,
                suppliers: [],
            }),
            itemRepository.create({
                name: "Table",
                description: "Table en bois",
                price: 75,
                warrantyEndDate: addYears(3),
                endOfLifeDate: addYears(7),
                brand: "Ikea",
                room: roomA1,
                itemType: tableType,
                suppliers: [],
            }),
            itemRepository.create({
                name: "Projecteur",
                description: "Projecteur HD",
                price: 300,
                warrantyEndDate: addYears(3),
                endOfLifeDate: addYears(6),
                brand: "Epson",
                room: roomB2,
                itemType: projectorType,
                suppliers: [],
            }),
        ];

        await itemRepository.save(items);
    }
}