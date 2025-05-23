import { Entity, Column, ManyToOne, OneToMany} from "typeorm";
import { ItemType } from "./itemType.entity";
import { Comment } from "./comment.entity";
import { EntityBase } from "./entity.base";

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

    @OneToMany(() => Comment, (comment) => comment.id)
    comments!: Comment[];

    @ManyToOne(() => ItemType, (itemType) => itemType.id)
    itemType!: ItemType;
}