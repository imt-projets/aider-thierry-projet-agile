import { Column, Entity } from "typeorm";
import { EntityBase } from "./entity.base";

@Entity()
export abstract class OrganizationalEntityBase extends EntityBase {

    @Column()
    name! : string;
}