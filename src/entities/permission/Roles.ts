import { Entity, ObjectIdColumn, ObjectId, Column, OneToMany } from "typeorm";
import { Admins } from "../school/Admins"; // Correct import path
import { User } from "../User";

@Entity({ name: 'Roles' })
export class Roles {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    role: string;

    @OneToMany(() => Admins, (admin) => admin.role)
    admins: Admins[]; 

    @OneToMany(()=>User,(user)=>user.role)
    user:User[]
}
