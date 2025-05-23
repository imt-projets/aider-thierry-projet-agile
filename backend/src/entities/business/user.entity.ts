import { Entity, Column, OneToMany} from "typeorm";
import { Comment } from "./comment.entity";
import { EntityBase } from "../core";
import { IsEmail } from "class-validator";

@Entity()
export class User extends EntityBase {
    @Column()
    firstname!: string;

    @Column()
    lastname!: string;

    @Column()
    password!: string;

    @Column()
    @IsEmail()
    email!: string;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment[];
}