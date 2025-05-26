import { Entity, ObjectIdColumn, ObjectId, Column, Table, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Permmissions } from "./permission/Permmissions"
import { Roles } from "./permission/Roles"
import { Schools } from "./school/Schools"
import { StudentStandard } from "./school/StudentStandard"

@Entity({name:'Users'})
export class User {

    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column({unique:true})
    email: string

    @Column()
    password: string

    @Column()
    phone: string

    @Column()
    age: number

    @Column({default:false})
    is_active: boolean

    @OneToMany(()=>Schools,(school)=>school.user)
    schools:Schools[]

    @OneToMany(()=>Permmissions,(permission)=>permission.user)
    permmissions:Permmissions[]

    @OneToMany(()=>Roles,(role)=>role.user)
    role:Roles

    @OneToMany(()=>StudentStandard,(studentStandard)=>studentStandard.user)
    studentStandard:StudentStandard[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
