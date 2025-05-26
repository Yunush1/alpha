import { ObjectType, Field, ID } from "type-graphql";
import { ObjectId } from "mongodb";
import { PermissionType } from "./PermissionType";
import { SchoolType } from "./SchoolType";
import { AdminType } from "./AdminType";
import { RoleType } from "./RoleType";
import { StudentStandardType } from "./StundetStandard";
@ObjectType()
export class UserType {
    @Field(() => ID)
    _id: ObjectId;

    @Field()
    firstname: string;

    @Field()
    lastname: string;

    @Field()
    age: number;

    @Field()
    email: string;

    @Field()
    phone: string;

    @Field()
    password: string;

    @Field()
    is_active: boolean;
    @Field(() => [SchoolType],{nullable:true})
    schools: SchoolType[];

    @Field(() => [AdminType],{nullable:true})
    role: RoleType;

    @Field(() => [PermissionType],{nullable:true})
    permissions: PermissionType[];

    @Field(() => [StudentStandardType],{nullable:true})
    studentStandard: StudentStandardType[];
} 

