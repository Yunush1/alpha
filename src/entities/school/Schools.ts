import { Entity, ObjectIdColumn, ObjectId, Column, Table, ManyToOne, OneToMany } from "typeorm"
import { Admins } from "./Admins"
import { User } from "../User"
import { Accounts } from "./Accounts"

@Entity({ name: 'Schools' })
export class Schools {

    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    school_name: string

    @Column()
    school_code: string

    @Column()
    school_registration_code: string

    @Column()
    school_establishment_date: Date

    @Column('json')
    locations: {
        country: string
        city: string
        address: string
        postal_code: string
        latitude: string
        longitude: string
    }

    @Column('json')
    contacts: {
        phone: string
        email: string
    }

    @Column()
    capacity: string

    @ManyToOne(()=>Admins,(admin)=>admin.schools)
    admins: Admins

    @ManyToOne(()=>User,(user)=>user.schools)
    user: User[]

    @OneToMany(()=>Accounts,(account)=>account.school)
    accounts: Accounts[]

}