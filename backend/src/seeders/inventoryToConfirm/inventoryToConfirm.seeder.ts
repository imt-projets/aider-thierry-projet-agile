import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { entities } from "@/entities";
import { InventoryType } from "@/enums"

export class InventoryToConfirmSeeder extends Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const inventoryRepository = dataSource.getRepository(entities.InventoryToConfirm);
        const itemTypeRepository = dataSource.getRepository(entities.ItemType);

        const meubleType = await itemTypeRepository.findOne({ where: { name: "Chaise" } });
        const materielType = await itemTypeRepository.findOne({ where: { name: "Projecteur" } });

        if (!meubleType || !materielType) {
            throw new Error("Les types d'items nécessaires n'ont pas été trouvés dans la base de données");
        }

        const inventories = [
            inventoryRepository.create({
                type: InventoryType.INVENTAIRE_SALLE,
                room: "J142",
                date: new Date(),
                mapping: [
                    {
                        itemType: meubleType.name,
                        itemsList: ["45678", "56789", "09576"],
                        removedItem: ["chaise1", "table2"]
                    }
                ]
            }),
            inventoryRepository.create({
                type: InventoryType.MOVE_ITEM,
                room: "J142",
                date: new Date(),
                mapping: [
                    {
                        itemType: meubleType.name,
                        newRoom: "B110"
                    }
                ]
            }),
            inventoryRepository.create({
                type: InventoryType.INVENTAIRE_SALLE,
                room: "J143",
                date: new Date(),
                mapping: [
                    {
                        itemType: materielType.name,
                        itemsList: ["12345", "12346"],
                        removedItem: ["23456"]
                    }
                ]
            })
        ];

        await inventoryRepository.save(inventories);
        console.log("Inventaires à confirmer insérés avec succès !");
    }
}
