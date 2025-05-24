import { Entity, ManyToOne, OneToMany } from "typeorm";
import { OrganizationalEntityBase } from "../core/organizational-entity.base";
import { Building } from "./building.entity";
import { Item } from "../business";

@Entity()
export class Room extends OrganizationalEntityBase {
    
    @ManyToOne(() => Building, (b) => b.rooms)
    parent!: Building;

    @OneToMany(() => Item, (item) => item.room)
    items!: Item[]
}