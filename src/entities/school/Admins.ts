import { Entity, ObjectIdColumn, ObjectId, Column, ManyToOne, OneToMany } from "typeorm";
import { Roles } from "../permission/Roles";  // Correct import path
import { Schools } from "./Schools";
import { Accounts } from "./Accounts";
@Entity({ name: 'Admins' }) // Make sure it's decorated with @Entity()
export class Admins {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;


    @ManyToOne(() => Roles, (role) => role.admins)
    role: Roles;  // Correct relation

    @OneToMany(()=>Schools,(school)=>school.admins)
    schools:Schools[]

    @OneToMany(()=>Accounts,(account)=>account.admins)
    account:Accounts[]

}
