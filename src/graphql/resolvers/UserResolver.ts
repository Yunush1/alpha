import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { UserType } from "../types/UserType";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import { ObjectId } from "mongodb";
import { AuthResponse } from "../types/AuthType";
import * as jwt from 'jsonwebtoken';
import { Context } from "./SchoolResolver";
import { Roles } from "../../entities/permission/Roles";
import { StudentStandard } from "../../entities/school/StudentStandard";
import { decodeToken, generateToken, verifyToken } from "../../utils/hashpassword";
import { HttpError } from "../../utils/httpError";
import { Schools } from "../../entities/school/Schools";
@Resolver(of => UserType)
export class UserResolver {
    private userRepository = AppDataSource.getRepository(User);
    private roleRepository = AppDataSource.getRepository(Roles);
    private studentStanderedRepository = AppDataSource.getRepository(StudentStandard);
    private schoolRepository = AppDataSource.getRepository(Schools);
    @Query(() => [UserType])
    async users(): Promise<UserType[]> {
        const users = await this.userRepository.find({
            relations: ["permissions"]
        });
        return users as any as UserType[];
    }

    @Query(() => UserType, { nullable: true })
    async user(@Arg("id") id: string): Promise<UserType | null> {
        const user = await this.userRepository.findOne({
            where: { _id: new ObjectId(id) },
            relations: ["permissions"]
        });
        return user as any as UserType;
    }

    @Mutation(() => AuthResponse)
    async createUser(
        @Ctx() ctx: Context,
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("phone") phone: string,
        @Arg("firstname") firstname: string,
        @Arg("lastname") lastname: string,
        @Arg("age") age: number,
        @Arg("standard") standard: string,
        @Arg("section") section: string,
        @Arg("roll_number") roll_number: string,
        @Arg("startSession") startSession: Date,
        @Arg("endSession") endSession: Date,
        @Arg("is_active") is_active: boolean

    ): Promise<AuthResponse> {
        try {
            const authHeader = ctx.req.headers.authorization;
            if (!authHeader) {
                throw new Error("Authorization header is required");
            }
    
            // Extract and verify token
       
            const auth = authHeader.split(" ")[1]; // Remove "Bearer " prefix
            const verified = verifyToken(auth);
            if(!verified){
                throw new HttpError(401, "Unauthorized");
            }
            const decoded = await decodeToken(auth);
            const school = await this.schoolRepository.findOneBy({_id:new ObjectId(decoded._id! as string)});
            if(!school){
                throw new HttpError(401, "You are not authorized to create a user");
            }  


            const role = await this.roleRepository.findOneBy({role:"USER"});
            const studentStandered = await this.studentStanderedRepository.save({
                standard:standard,
            section:section,
            roll_number:roll_number,
            startSession:startSession,
            endSession:endSession,
            is_active:is_active
        })
        const user = this.userRepository.create({
            firstname:firstname,
            lastname:lastname,
            age:age,
            email:email,
            password:password,
            phone:phone,
            is_active:false,
            role,
            schools:[{_id:school._id}],
            studentStandard:[{_id:studentStandered._id}]
        });

        const savedUser = await this.userRepository.save(user);

        let token = await generateToken({
            id:savedUser._id.toString(),
            email:savedUser.email,
            role:savedUser.role.role
        });

        return {
            status: 200,
            message: "User created successfully",
            data: savedUser as any as UserType,
            token:token
        };
        } catch (error) {
            console.error("Error creating user:", error);
            throw new HttpError(500, "Error creating user");
        }
    }

    @Mutation(() => UserType)
    async updateUser(
        @Arg("id") id: string,
        @Arg("firstname", { nullable: true }) firstname?: string,
        @Arg("lastname", { nullable: true }) lastname?: string,
        @Arg("age", { nullable: true }) age?: number
    ): Promise<UserType> {
        const user = await this.userRepository.findOneBy({ _id: new ObjectId(id) });
        if (!user) {
            throw new Error("User not found");
        }

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (age) user.age = age;

        const updatedUser = await this.userRepository.save(user);
        return updatedUser as any as UserType;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg("id") id: string): Promise<boolean> {
        const result = await this.userRepository.delete({ _id: new ObjectId(id) });
        return result.affected ? result.affected > 0 : false;
    }
} 