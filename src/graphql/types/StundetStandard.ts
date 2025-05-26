import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { UserType } from "./UserType";
@ObjectType()
export class StudentStandardType {
    @Field(() => ID)
    _id: ObjectId;

    @Field()
    standard: string;

    @Field()
    section: string;

    @Field()
    roll_number: string;

    @Field()
    is_active: boolean;

    @Field()
    startSession: Date;

    @Field()
    endSession: Date;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => UserType)
    user: UserType;
    
}