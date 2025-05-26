import { ObjectType, Field, ID, InputType } from "type-graphql";
import { ObjectId } from "mongodb";
import { RoleType } from "./RoleType";
import { SchoolType } from "./SchoolType";

@InputType()
export class CreateAdminInput {
    @Field()
    firstname: string;

    @Field()
    lastname: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    phone: string;
}

@ObjectType()
export class AdminType {
    @Field(() => ID)
    _id: ObjectId;

    @Field()
    firstname: string;

    @Field()
    lastname: string;

    @Field()
    email: string;

    @Field()
    phone: string;

    @Field(() => RoleType, { nullable: true })
    role: RoleType;

    @Field(() => [SchoolType], { nullable: true })
    schools: SchoolType[];
} 