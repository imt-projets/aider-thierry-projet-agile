import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { OrganizationalEntityBase } from "../core";
import { Item } from "../business";

export enum StructureTypeEnum {
    SCHOOL = "school",
    BUILDING = "building",
    ROOM = "room",
    AMPHITHEATER = "amphitheater",
}

@Entity()
export class Structure extends OrganizationalEntityBase {

    @Column({
        type: "enum",
        enum: StructureTypeEnum
    })
    type!: StructureTypeEnum;

    @ManyToOne(() => Structure, (structure) => structure.children, { nullable: true })
    parent?: Structure;

    @OneToMany(() => Structure, (structure) => structure.parent)
    children!: Structure[];

    // This relation only exist for room
    @OneToMany(() => Item, (item) => item.room)
    items!: Item[];
}