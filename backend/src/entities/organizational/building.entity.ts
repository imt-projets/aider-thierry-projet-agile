import { Entity, ManyToOne, OneToMany } from "typeorm";
import { OrganizationalEntityBase } from "../core/organizational-entity.base";
import { School } from "./school.entity";
import { Room } from "./room.entity";

@Entity()
export class Building extends OrganizationalEntityBase {

    @ManyToOne(() => School, (school) => school.buildings)
    parent!: School;

    @OneToMany(() => Room, (room) => room.parent)
    rooms!: Room[]
}