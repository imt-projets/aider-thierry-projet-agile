import { Entity, Column, ManyToOne} from "typeorm";
import { Item } from "./item.entity";
import { User } from "./user.entity";
import { EntityBase } from "../core";
@Entity()
export class Comment extends EntityBase {

    @Column()
    content!: string

    @Column()
    date!: Date

    @ManyToOne(() => Item, (item) => item.comments)
    item!: Item

    @ManyToOne(() => User, (user) => user.comments)
    user!: User

}