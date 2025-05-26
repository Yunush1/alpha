import { ObjectType, Field, ID } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class PermissionType {
    @Field(() => ID)
    _id: ObjectId;

    @Field()
    name?: string;
} 