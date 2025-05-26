import { ObjectType, Field, ID, InputType } from "type-graphql";
import { ObjectId } from "mongodb";
import { UserType } from "./UserType";

@ObjectType()
export class StandardType {
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

    @Field(() => UserType, { nullable: true })
    user: UserType;
}

@InputType()
export class CreateStandardInput {
    @Field()
    standard: string;

    @Field()
    section: string;

    @Field()
    roll_number: string;

    @Field({ defaultValue: true })
    is_active: boolean;

    @Field()
    startSession: Date;

    @Field()
    endSession: Date;

    @Field({ nullable: true })
    user_id?: string;
}

@InputType()
export class UpdateStandardInput {
    @Field({ nullable: true })
    standard?: string;

    @Field({ nullable: true })
    section?: string;

    @Field({ nullable: true })
    roll_number?: string;

    @Field({ nullable: true })
    is_active?: boolean;

    @Field({ nullable: true })
    startSession?: Date;

    @Field({ nullable: true })
    endSession?: Date;

    @Field({ nullable: true })
    user_id?: string;
} 