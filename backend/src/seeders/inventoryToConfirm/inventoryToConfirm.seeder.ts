import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { entities } from "@/entities";
import { InventoryType } from "@/enums";

export class InventoryToConfirmSeeder extends Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const inventoryRepository = dataSource.getRepository(entities.InventoryToConfirm);
    const itemTypeRepository = dataSource.getRepository(entities.ItemType);
    const structureRepository = dataSource.getRepository(entities.Structure);

    const roomJ142 = await structureRepository.findOne({ where: { name: "J142" } });
    const roomJ144 = await structureRepository.findOne({ where: { name: "J144" } });
    const roomB110 = await structureRepository.findOne({ where: { name: "B110" } });

    if (!roomJ142 || !roomJ144 || !roomB110) {
      throw new Error("Certaines salles n'ont pas été trouvées dans la base de données");
    }

    const findOrCreateItemType = async (name: string, description: string) => {
      let type = await itemTypeRepository.findOne({ where: { name } });
      if (!type) {
        type = itemTypeRepository.create({ name, description });
        await itemTypeRepository.save(type);
      }
      return type;
    };

    const chairType = await findOrCreateItemType("Chaise", "Siège individuel");
    const tableType = await findOrCreateItemType("Table", "Surface pour poser des choses");
    const projectorType = await findOrCreateItemType("Projecteur", "Appareil de projection");
    const wifiAccessType = await findOrCreateItemType("Borne Wi-Fi", "Accès réseau sans fil");

    const inventories = [
      inventoryRepository.create({
        type: InventoryType.INVENTAIRE_SALLE,
        room: roomJ142.id,
        roomName: roomJ142.name,
        date: new Date(),
        mapping: [
          {
            itemType: chairType.name,
            itemsList: ["25520"],
            removedItem: ["25293"]
          },
          {
            itemType: tableType.name,
            itemsList: ["26300", "25626"],
            removedItem: ["26404"]
          },
          {
            itemType: projectorType.name,
            itemsList: ["25136"],
            removedItem: ["25141"]
          },
          {
            itemType: wifiAccessType.name,
            itemsList: ["29627"],
            removedItem: []
          }
        ]
      }),

      inventoryRepository.create({
        type: InventoryType.MOVE_ITEM,
        room: roomJ142.id,
        roomName: roomJ142.name,
        date: new Date(),
        mapping: [
          {
            itemType: chairType.name,
            newRoom: roomB110.id,
            newRoomName: roomB110.name,
            itemsList: ["25520"]
          }
        ]
      }),

      inventoryRepository.create({
        type: InventoryType.INVENTAIRE_SALLE,
        room: roomJ144.id,
        roomName: roomJ144.name,
        date: new Date(),
        mapping: [
          {
            itemType: chairType.name,
            itemsList: ["25293"],
            removedItem: []
          },
          {
            itemType: tableType.name,
            itemsList: ["26404"],
            removedItem: []
          },
          {
            itemType: projectorType.name,
            itemsList: ["25141"], 
            removedItem: []
          }
        ]
      })
    ];

    await inventoryRepository.save(inventories);
    console.log("Inventaires à confirmer insérés avec succès !");
  }
}