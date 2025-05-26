import { ObjectType, Field, createUnionType } from "type-graphql";
import { AdminType } from "./AdminType";
import { UserType } from "./UserType";
import { SchoolType } from "./SchoolType";

export const AuthDataUnion = createUnionType({
    name: "AuthData", // the name of the GraphQL union
    types: () => [AdminType, UserType] as const,
    resolveType: value => {
        if ("role" in value) {
            return AdminType;
        }
        if ("age" in value) {
            return UserType;
        }
        return undefined;
    },
});

@ObjectType()
export class AuthResponse {
    @Field()
    status: number;

    @Field()
    message: string;

    @Field({ nullable: true })
    code?: string;

    @Field(() => AuthDataUnion)
    data?: AdminType | UserType | SchoolType;

    @Field()
    token: string;
} 