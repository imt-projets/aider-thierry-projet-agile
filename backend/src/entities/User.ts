import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"
import { Comment } from "./Comment"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    firstname!: string

    @Column()
    lastname!: string

    @Column()
    password!: string

    @Column()
    email!: string

    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment[]
}