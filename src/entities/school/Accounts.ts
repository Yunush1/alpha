import { Entity, ObjectIdColumn, ObjectId, Column, ManyToOne, OneToMany } from "typeorm"
import { Schools } from "./Schools"
import { Admins } from "./Admins"
@Entity({name:'Accounts'})
export class Accounts {

    @ObjectIdColumn()
    _id:ObjectId

    @Column()
    account_name:string
    
    @ManyToOne(()=>Schools,(school)=>school.accounts)
    school:Schools

    @ManyToOne(()=>Admins,(admin)=>admin.account)
    admins:Admins

    @Column()
    account_number:string

    @Column()
    account_type:string

    @Column()
    account_status:string

    @Column()
    account_balance:string

    @Column()
    account_currency:string

    account_description:string

    @Column()
    account_created_at:string

    @Column()
    account_updated_at:string

    @Column()
    account_is_active:boolean

    @Column()
    account_ifsc_code:string

}