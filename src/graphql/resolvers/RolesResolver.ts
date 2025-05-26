import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Roles } from "../../entities/permission/Roles";
import { AppDataSource } from "../../data-source";
import { RoleType } from "../types/RoleType";
import { ObjectId } from "mongodb";

@Resolver(of => RoleType)
export class RolesResolver {
    private roleRepository = AppDataSource.getRepository(Roles);

    @Query(() => [RoleType])
    async roles(): Promise<RoleType[]> {
        const roles = await this.roleRepository.find();
        return roles as any as RoleType[];
    }

    @Query(() => RoleType, { nullable: true })
    async role(@Arg("id") id: string): Promise<RoleType | null> {
        const role = await this.roleRepository.findOneBy({ _id: new ObjectId(id) });
        return role as any as RoleType;
    }

    @Mutation(() => RoleType)
    async createRole(@Arg("name") name: string): Promise<RoleType> {
        const role = this.roleRepository.create({ role: name });
        const savedRole = await this.roleRepository.save(role);
        return savedRole as any as RoleType;
    }
}