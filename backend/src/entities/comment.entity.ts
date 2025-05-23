import { Entity, Column, ManyToOne} from "typeorm";
import { Item } from "./item.entity";
import { User } from "./user.entity";
import { EntityBase } from "./entity.base";
@Entity()
export class Comment extends EntityBase {

    @Column()
    content!: string

    @Column()
    date!: Date

    @ManyToOne(() => Item, (item) => item.id)
    item!: Item

    @ManyToOne(() => User, (user) => user.id)
    user!: User

}