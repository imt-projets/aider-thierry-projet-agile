import { Entity, Column, ManyToMany} from "typeorm";
import { EntityBase } from "../core";
import { Item } from "./item.entity";   

@Entity()
export class Supplier extends EntityBase {
    @Column()
    supplierId!: number;
    
    @Column()
    name!: string;

    @ManyToMany(() => Item, (item) => item.suppliers)
    items!: Item[];
}   