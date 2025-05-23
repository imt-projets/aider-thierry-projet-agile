import { Column, Entity, OneToMany } from "typeorm";
import { OrganizationalEntityBase } from "../core/organizational-entity.base";
import { Building } from "./building.entity";


@Entity()
export class School extends OrganizationalEntityBase {

    @OneToMany(() => Building, (building) => building.parent)
    buildings!: Building[]
}