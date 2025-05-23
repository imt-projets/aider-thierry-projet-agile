import { Entity, ManyToOne } from "typeorm";
import { OrganizationalEntityBase } from "../core/organizational-entity.base";
import { Building } from "./building.entity";

@Entity()
export class Room extends OrganizationalEntityBase {
    
    @ManyToOne(() => Building, (b) => b.children)
    parent!: Building;
}