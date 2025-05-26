import { Resolver, Query, Mutation, Arg, Ctx, ID } from "type-graphql";
import { AdminType, CreateAdminInput } from "../types/AdminType";
import { Admins } from "../../entities/school/Admins";
import { AppDataSource } from "../../data-source";
import { ObjectId } from "mongodb";
import * as bcrypt from "bcrypt";
import { AuthResponse } from "../types/AuthType";
import { generateToken, decodeToken } from "../../utils/hashpassword";
import { Roles } from "../../entities/permission/Roles";
import { Context } from "./SchoolResolver";
import { HttpError } from "../../utils/httpError";
@Resolver(of => AdminType)
export class AdminResolver {
    private adminRepository = AppDataSource.getRepository(Admins);
    private roleRepository = AppDataSource.getRepository(Roles);


    @Query(() => [AdminType])
    async admins(): Promise<AdminType[]> {
        const admins = await this.adminRepository.find({
            relations: ["role", "schools"]
        });
        return admins as any as AdminType[];
    }

    @Query(() => AdminType, { nullable: true })
    async admin(@Arg("id") id: string): Promise<AdminType | null> {

        try {
            const admin = await this.adminRepository.findOne({
                where: { _id: new ObjectId(id) },
                relations: ["role", "schools"]
            });

            if (!admin) {
                throw new HttpError(404, "Admin not found");
            }

            return admin as any as AdminType;
        } catch (error) {
            console.error("Error fetching admin:", error);
            throw new HttpError(error.status, error.message);
        }
    }

    @Mutation(() => AuthResponse)
    async createAdmin(
        @Arg("input") input: CreateAdminInput
    ): Promise<AuthResponse> {
        try {
            // Check if admin with email already exists
            const existingAdmin = await this.adminRepository.findOne({
                where: { email: input.email }
            });

            if (existingAdmin) {
                throw new HttpError(400, "Admin with this email already exists");
            }

            let hashedPassword = await bcrypt.hash(input.password, 10);
            const admin = this.adminRepository.create({
                firstname: input.firstname,
                lastname: input.lastname,
                email: input.email,
                password: hashedPassword,
                phone: input.phone
            });

            const savedAdmin = await this.adminRepository.save(admin);
            const token = await generateToken({ id: savedAdmin._id.toString(),role:savedAdmin.role.role });

            return {
                status: 201,
                message: "Admin created successfully",
                data: savedAdmin as any as AdminType,
                token
            };
        } catch (error) {
            console.error("Error creating admin:", error);
            throw new HttpError(
                error.status || 500,
                error.message || "Error creating admin"
            );
        }
    }

    @Mutation(() => AdminType)
    async updateAdmin(
        @Ctx() context: Context,
        @Arg("firstname", { nullable: true }) firstname?: string,
        @Arg("lastname", { nullable: true }) lastname?: string,
        @Arg("email", { nullable: true }) email?: string,
        @Arg("phone", { nullable: true }) phone?: string,
        @Arg("role_name", { nullable: true }) role_name?: string
    ): Promise<AdminType> {
        const authHeader = context.req.headers.authorization;
        if (!authHeader) {
            throw new Error("Unauthorized");
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = await decodeToken(token);
        const admin = await this.adminRepository.findOneBy({ _id: new ObjectId(decodedToken.id! as string) });
        const role = await this.roleRepository.findOneBy({ role:role_name});
        if (!admin) {
            throw new HttpError(404, "Admin not found");
        }

        if (firstname) admin.firstname = firstname;
        if (lastname) admin.lastname = lastname;
        if (email) admin.email = email;
        if (phone) admin.phone = phone;
        if (role) admin.role = role;

        const updatedAdmin = await this.adminRepository.save(admin);
        return updatedAdmin as any as AdminType;
    }

    @Mutation(() => Boolean)
    async deleteAdmin(@Arg("id") id: string): Promise<boolean> {
        const result = await this.adminRepository.delete({ _id: new ObjectId(id) });
        return result.affected ? result.affected > 0 : false;
    }
} 