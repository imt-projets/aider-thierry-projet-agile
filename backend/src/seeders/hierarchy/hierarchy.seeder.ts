import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { entities } from "@/entities";

export class HierarchySeeder extends Seeder {
    async run(dataSource: DataSource) {
        const structureRepository = dataSource.getRepository(entities.Structure);
        const itemTypeRepository = dataSource.getRepository(entities.ItemType);
        const itemRepository = dataSource.getRepository(entities.Item);

        // SCHOOL
        const school = structureRepository.create({
            name: "IMT Atlantique",
            type: entities.StructureTypeEnum.SCHOOL,
        });
        const school2 = structureRepository.create({
            name: "IMT Nord Europe",
            type: entities.StructureTypeEnum.SCHOOL,
        });
        await structureRepository.save([school, school2]);
        
        // BUILDING
        const buildingA = structureRepository.create({
            name: "A",
            type: entities.StructureTypeEnum.BUILDING,
            parent: school,
        });
        const buildingB = structureRepository.create({
            name: "B",
            type: entities.StructureTypeEnum.BUILDING,
            parent: school,
        });
        await structureRepository.save([buildingA, buildingB]);

        // ROOM
        const roomA1 = structureRepository.create({
            name: "A101",
            type: entities.StructureTypeEnum.ROOM,
            parent: buildingA,
        });
        const roomA2 = structureRepository.create({
            name: "A102",
            type: entities.StructureTypeEnum.ROOM,
            parent: buildingA,
        });
        const roomB1 = structureRepository.create({
            name: "B201",
            type: entities.StructureTypeEnum.ROOM,
            parent: buildingB,
        });
        const roomB2 = structureRepository.create({
            name: "B202",
            type: entities.StructureTypeEnum.ROOM,
            parent: buildingB,
        });
        await structureRepository.save([roomA1, roomA2, roomB1, roomB2]);

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
                serialNumber: "456123",
                inventoryNumber: "24324",
                orderNumber: "349843",
                model: "ADDE"
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
                serialNumber: "123456",
                inventoryNumber: "24325",
                orderNumber: "349822",
                model: "LACK"
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
                serialNumber: "123465",
                inventoryNumber: "24326",
                orderNumber: "349811",
                model: "EB-X41"
                
            }),
        ];

        await itemRepository.save(items);
    }
}