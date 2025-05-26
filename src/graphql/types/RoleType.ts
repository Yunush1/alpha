import { ObjectType, Field, ID } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class RoleType {
    @Field(() => ID)
    _id: ObjectId;

    @Field()
    role: string;
} 