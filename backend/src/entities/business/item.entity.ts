import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from "typeorm";
import { ItemType } from "./itemType.entity";
import { Comment } from "./comment.entity";
import { Supplier } from "./supplier.entity";
import { EntityBase } from "../core";
import { Structure } from "../organizational";

export enum ItemStateTypeEnum {
    NEW = "Neuf",
    GOOD = "Bon",
    FAIR = "Moyen",
    PENDING_DESTRUCTION = "En attente de destruction",
    DESTROYED = "Détruit"
}

@Entity()
export class Item extends EntityBase {
    @Column()
    name!: string;

    @Column()
    serialNumber!: string;

    @Column({unique: true})
    inventoryNumber!: string;

    @Column()
    orderNumber!: string;

    @Column()
    price!: number;

    @Column()
    description!: string;

    @Column()
    warrantyEndDate!: Date;

    @Column()
    endOfLifeDate!: Date;

    @Column()
    brand!: string;

    @Column()
    model!: string; 

    @Column({
        type: "enum",
        enum: ItemStateTypeEnum
    })
    state!: ItemStateTypeEnum

    @OneToMany(() => Comment, (comment) => comment.item)
    comments!: Comment[];

    @ManyToOne(() => ItemType, (itemType) => itemType.items)
    itemType!: ItemType;

    @ManyToMany(() => Supplier, (supplier) => supplier.items)
    suppliers!: Supplier[];

    @ManyToOne(() => Structure, (room) => room.children)
    room!: Structure
}