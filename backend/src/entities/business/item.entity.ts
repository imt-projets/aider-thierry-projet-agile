import { Entity, Column, ManyToOne, OneToMany, ManyToMany} from "typeorm";
import { ItemType } from "./itemType.entity";
import { Comment } from "./comment.entity";
import { Supplier } from "./supplier.entity";
import { EntityBase } from "../core";

@Entity()
export class Item extends EntityBase {
    @Column()
    name!: string;

    @Column()
    price!: number;

    @Column()
    description!: string;

    @Column()
    lifetime!: number;

    @Column()
    brand!: string;

    @OneToMany(() => Comment, (comment) => comment.item)
    comments!: Comment[];

    @ManyToOne(() => ItemType, (itemType) => itemType.items)
    itemType!: ItemType;

    @ManyToMany(() => Supplier, (supplier) => supplier.items)
    suppliers!: Supplier[];
}