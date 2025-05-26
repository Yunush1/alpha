import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { PermissionType } from "../types/PermissionType";
import { AppDataSource } from "../../data-source";
import { Permmissions} from '../../entities/permission/Permmissions'
import { ObjectId } from "mongodb";

@Resolver(of => PermissionType)
export class PermissionsResolver {

    private permissionRepository = AppDataSource.getRepository(Permmissions);

    @Query(() => [PermissionType])
    async permissions(): Promise<PermissionType[]> {
        return await this.permissionRepository.find();
    }

    @Query(() => PermissionType, { nullable: true })
    async permission(@Arg("id") id: string): Promise<PermissionType | null> {
        return await this.permissionRepository.findOneBy({ _id: new ObjectId(id) });
    }

    @Mutation(() => PermissionType)
    async createPermission(@Arg("name") name: string): Promise<PermissionType> {
        console.log(name); // name is a string it is comming from the graphql schema
        const permission = this.permissionRepository.create({ name: name});
        console.log(permission); // permission is an object of type Permmissions but does not create name field
        const savedPermission = await this.permissionRepository.save(permission);
        console.log(savedPermission); // savedPermission is an object of type Permmissions with name field
        return savedPermission as any as PermissionType;
    }

    @Mutation(() => PermissionType)
    async updatePermission(@Arg("id") id: string, @Arg("name") name: string): Promise<PermissionType> {
        const permission = await this.permissionRepository.findOneBy({ _id: new ObjectId(id) });
        if (!permission) {
            throw new Error("Permission not found");
        }
        permission.name = name;
        return await this.permissionRepository.save(permission);
    }

    @Mutation(() => Boolean)
    async deletePermission(@Arg("id") id: string): Promise<boolean> {
        const permission = await this.permissionRepository.findOneBy({ _id: new ObjectId(id) });
        if (!permission) {
            throw new Error("Permission not found");
        }
        await this.permissionRepository.delete(permission);
        return true;
    }

}

