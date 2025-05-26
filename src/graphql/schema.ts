import { buildSchema } from "type-graphql";
import { AdminResolver } from "./resolvers/AdminResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { SchoolResolver } from "./resolvers/SchoolResolver";
import { PermissionsResolver } from "./resolvers/PermissionsResolver";
import { RolesResolver } from "./resolvers/RolesResolver";
import { StandardResolver } from "./resolvers/StandardResolver";

export const createSchema = async () => {
    return await buildSchema({
        resolvers: [AdminResolver, UserResolver, SchoolResolver, PermissionsResolver, RolesResolver, StandardResolver],
        emitSchemaFile: true,
        validate: false,
        authChecker: ({ context: { req } }) => {
            return !!req.headers.authorization;
        },
    });
}; 