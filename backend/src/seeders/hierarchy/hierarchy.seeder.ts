import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { entities } from "@/entities";
import { ItemStateTypeEnum } from "@/entities/business";

export class HierarchySeeder extends Seeder {
    async run(dataSource: DataSource) {
        const structureRepository = dataSource.getRepository(entities.Structure);
        const itemTypeRepository = dataSource.getRepository(entities.ItemType);
        const itemRepository = dataSource.getRepository(entities.Item);
        const commentRepository = dataSource.getRepository(entities.Comment);

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
        const buildingJ = structureRepository.create({
            name: "J",
            type: entities.StructureTypeEnum.BUILDING,
            parent: school,
        });
        const buildingB = structureRepository.create({
            name: "B",
            type: entities.StructureTypeEnum.BUILDING,
            parent: school,
        });
        await structureRepository.save([buildingJ, buildingB]);

        // ROOM
        const roomJ142 = structureRepository.create({
            name: "J142",
            type: entities.StructureTypeEnum.ROOM,
            parent: buildingJ,
        });
        const roomJ144 = structureRepository.create({
            name: "J144",
            type: entities.StructureTypeEnum.ROOM,
            parent: buildingJ,
        });
        const roomJ145 = structureRepository.create({
            name: "J145",
            type: entities.StructureTypeEnum.ROOM,
            parent: buildingJ,
        });
        const roomB110 = structureRepository.create({
            name: "B110",
            type: entities.StructureTypeEnum.ROOM,
            parent: buildingB,
        });
        const roomTest = structureRepository.create({
            name: "65833254",
            type: entities.StructureTypeEnum.ROOM,
            parent: buildingB,
        });
        await structureRepository.save([roomJ142, roomJ144, roomJ145, roomB110, roomTest]);

        const chairType = itemTypeRepository.create({ name: "Chaise", description: "Objet pour s’asseoir" });
        const tableType = itemTypeRepository.create({ name: "Table", description: "Surface pour poser des choses" });
        const projectorType = itemTypeRepository.create({ name: "Projecteur", description: "Appareil de projection" });
        const wifiAccess = itemTypeRepository.create({ name: "Borne Wi-Fi", description: "Permet d'accéder à l'intranet de l'école" });

        await itemTypeRepository.save([chairType, tableType, projectorType, wifiAccess]);


        const now = new Date();
        const addYears = (years: number) => {
            const date = new Date(now);
            date.setFullYear(date.getFullYear() + years);
            return date;
        };

        // AMPHITHEATER
        const amphitheater = structureRepository.create({
            name: "Amphithéâtre",
            type: entities.StructureTypeEnum.AMPHITHEATER,
            parent: buildingJ,
        });

        await structureRepository.save(amphitheater);
        // COMMENTS
        const comment1 = commentRepository.create({
            content: "C'est une salle très agréable pour les cours.",
            date: new Date(),
            item: null, // No item associated with this comment
            user: null, // No user associated with this comment
        });

        const comment2 = commentRepository.create({
            content: "Le projecteur est un peu vieux mais fonctionne encore.",
            date: new Date(),
            item: null, // No item associated with this comment
            user: null, // No user associated with this comment
        });

        await commentRepository.save([comment1, comment2]);

        // J142
        const items = [
            // première chaise J142
            itemRepository.create({
                name: "Chaise",
                description: "Chaise en plastique",
                price: 25,
                warrantyEndDate: addYears(2),
                endOfLifeDate: addYears(5),
                brand: "Ikea",
                room: roomJ142,
                itemType: chairType,
                suppliers: [],
                serialNumber: "456123",
                inventoryNumber: "25520",
                orderNumber: "349843",
                model: "ADDE",
                comments: [comment1, comment2],
                state: ItemStateTypeEnum.NEW
            }),
            // première table J142
            itemRepository.create({
                name: "Table",
                description: "Table avec armature bleu et plateau de travail composite",
                price: 75,
                warrantyEndDate: addYears(3),
                endOfLifeDate: addYears(7),
                brand: "Ikea",
                room: roomJ142,
                itemType: tableType,
                suppliers: [],
                serialNumber: "123456",
                inventoryNumber: "26300",
                orderNumber: "349822",
                model: "LACK",
                state: ItemStateTypeEnum.FAIR
            }),

            // PROJECTEUR J142
            itemRepository.create({
                name: "Projecteur",
                description: "Projecteur HD",
                price: 300,
                warrantyEndDate: addYears(3),
                endOfLifeDate: addYears(6),
                brand: "Epson",
                room: roomJ142,
                itemType: projectorType,
                suppliers: [],
                serialNumber: "123465",
                inventoryNumber: "25136",
                orderNumber: "349811",
                model: "EB-X41",
                state: ItemStateTypeEnum.GOOD
            }),

            // table professeur J142
            itemRepository.create({
                name: "Table",
                description: "Double table (bureau professeur) avec armature bleu et plateau de travail composite",
                price: 75,
                warrantyEndDate: addYears(3),
                endOfLifeDate: addYears(7),
                brand: "Ikea",
                room: roomJ142,
                itemType: tableType,
                suppliers: [],
                serialNumber: "123456",
                inventoryNumber: "25626",
                orderNumber: "349822",
                model: "LACK",
                state: ItemStateTypeEnum.GOOD
            }),


            // PREMIERE CHAISE J144
            itemRepository.create({
                name: "Chaise",
                description: "Chaise en plastique",
                price: 25,
                warrantyEndDate: addYears(2),
                endOfLifeDate: addYears(5),
                brand: "Ikea",
                room: roomJ144,
                itemType: chairType,
                suppliers: [],
                serialNumber: "456123",
                inventoryNumber: "25293",
                orderNumber: "349843",
                model: "ADDE",
                state: ItemStateTypeEnum.NEW
            }),


            // PREMIERE TABLE J144
            itemRepository.create({
                name: "Table",
                description: "Table avec armature bleu et plateau de travail composite",
                price: 75,
                warrantyEndDate: addYears(3),
                endOfLifeDate: addYears(7),
                brand: "Ikea",
                room: roomJ144,
                itemType: tableType,
                suppliers: [],
                serialNumber: "123456",
                inventoryNumber: "26404",
                orderNumber: "349822",
                model: "LACK",
                state: ItemStateTypeEnum.PENDING_DESTRUCTION
            }),

            // PROJECTEUR J144
            itemRepository.create({
                name: "Projecteur",
                description: "Projecteur HD",
                price: 300,
                warrantyEndDate: addYears(3),
                endOfLifeDate: addYears(6),
                brand: "Epson",
                room: roomJ144,
                itemType: projectorType,
                suppliers: [],
                serialNumber: "123465",
                inventoryNumber: "25141",
                orderNumber: "349811",
                model: "EB-X41",
                state: ItemStateTypeEnum.FAIR
            }),

            // wifi access J142
            itemRepository.create({
                name: "Borne Wi-FI",
                description: "La borne wifi de la J142",
                price: 300,
                warrantyEndDate: addYears(2),
                endOfLifeDate: addYears(15),
                brand: "Epson",
                room: roomJ142,
                itemType: wifiAccess,
                suppliers: [],
                serialNumber: "12346589",
                inventoryNumber: "29627",
                orderNumber: "3498113242",
                model: "AR119",
                state: ItemStateTypeEnum.GOOD
            }),
            itemRepository.create({
                name: "Test",
                description: "La borne wifi de la J142",
                price: 300,
                warrantyEndDate: addYears(2),
                endOfLifeDate: addYears(15),
                brand: "Epson",
                room: roomTest,
                itemType: wifiAccess,
                suppliers: [],
                serialNumber: "12346589",
                inventoryNumber: "65833254",
                orderNumber: "3498113242",
                model: "AR119",
                state: ItemStateTypeEnum.GOOD
            })
        ];

        await itemRepository.save(items);
    }
}