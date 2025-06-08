import { Entity, Column } from "typeorm";
import { EntityBase } from "../core";
import { InventoryType } from "@/enums"

type Mapping= {
    itemType: string;
    itemsList?: string[];
    removedItem?: string[];
    newRoom?: string;
    newRoomName?: string;
};

@Entity()
export class InventoryToConfirm extends EntityBase {
    @Column()
    type!: InventoryType;

    @Column()
    room!: string;

    @Column()
    roomName!: string;

    @Column({ type: 'timestamp' })
    date!: Date;

    @Column({ type: 'jsonb' })
    mapping!: Mapping[];
}
