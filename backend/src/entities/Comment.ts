import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm"
import { Item } from "./Item"
import { User } from "./user"

@Entity()
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    content!: string

    @Column()
    date!: Date

    @ManyToOne(() => Item, (item) => item.id)
    item!: Item

    @ManyToOne(() => User, (user) => user.id)
    user!: User

}