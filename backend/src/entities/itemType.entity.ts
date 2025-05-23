import { Entity, Column, OneToMany } from "typeorm";
import { Item } from "./item.entity";
import { EntityBase } from "./entity.base";


@Entity()
export class ItemType extends EntityBase {
    @Column()
    name!: string;

    @Column()
    description!: string;

    @OneToMany(() => Item, (item) => item.itemType)
    items!: Item[];
}