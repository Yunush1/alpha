import { ObjectType, Field, ID, InputType } from "type-graphql";
import { ObjectId } from "mongodb";
import { Accounts } from "../../entities/school/Accounts";
import { Permmissions } from "../../entities/permission/Permmissions";
import { Admins } from "../../entities/school/Admins";
import { AdminType } from "./AdminType";

@InputType('LocationInput')
export class LocationInput {
    @Field()
    country: string;

    @Field()
    city: string;

    @Field()
    address: string;

    @Field()
    postal_code: string;

    @Field()
    latitude: string;

    @Field()
    longitude: string;
}

@ObjectType()
export class Location {
    @Field()
    country: string;

    @Field()
    city: string;

    @Field()
    address: string;

    @Field()
    postal_code: string;

    @Field()
    latitude: string;

    @Field()
    longitude: string;
}

@InputType('ContactInput')
export class ContactInput {
    @Field()
    phone: string;

    @Field()
    email: string;
}

@ObjectType()
export class Contact {
    @Field()
    phone: string;

    @Field()
    email: string;
}

@ObjectType()
export class SchoolType {
    @Field(() => ID)
    _id: ObjectId;

    @Field()
    school_name: string;

    @Field(() => AdminType, { nullable: true })
    admins: AdminType;

    @Field({ nullable: true })
    school_code: string;

    @Field({ nullable: true })
    school_establishment_date: Date;
    
    @Field({ nullable: true })
    school_registration_code: string;

    @Field(() => Location, { nullable: true })
    locations: Location;

    @Field(() => Contact, { nullable: true })
    contacts: Contact;

    @Field()
    capacity: string;
} 