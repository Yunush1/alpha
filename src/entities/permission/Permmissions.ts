import { Column, Entity, ManyToOne, ObjectId, ObjectIdColumn } from "typeorm";
import { User } from "../User";

@Entity({ name: 'Permissions' })
export class Permmissions {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    name: string

    @ManyToOne(() => User, (user) => user.permmissions)
    user: User
}