import { Arg, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { SchoolType, LocationInput, ContactInput, Location, Contact } from "../types/SchoolType";
import { AppDataSource } from "../../data-source";
import { Schools } from "../../entities/school/Schools";
import { ObjectId } from "mongodb";
import { Admins } from "../../entities/school/Admins";
import { decodeToken } from "../../utils/hashpassword";
import { AuthResponse } from "../types/AuthType";
import {generateToken} from '../../utils/hashpassword'
import { generateSchoolCode } from "../../utils/generateSchoolCode";
export interface Context {
    req: {
        headers: {
            authorization?: string;
        };
    };
}

@Resolver(of => SchoolType)
export class SchoolResolver {
    private schoolRepository = AppDataSource.getRepository(Schools);
    private adminRepository = AppDataSource.getRepository(Admins);

    private convertToLocation(input: LocationInput): Location {
        return {
            country: input.country,
            city: input.city,
            address: input.address,
            postal_code: input.postal_code,
            latitude: input.latitude,
            longitude: input.longitude
        };
    }

    private convertToContact(input: ContactInput): Contact {
        return {
            phone: input.phone,
            email: input.email
        };
    }

    @Query(() => [SchoolType])
    async schools(): Promise<SchoolType[]> {
        const schools = await this.schoolRepository.find({
            relations: ["admins", "accounts"]
        });
        return schools as any as SchoolType[];
    }

    @Query(() => SchoolType, { nullable: true })
    async school(@Arg("id") id: string): Promise<SchoolType | null> {
        const school = await this.schoolRepository.findOne({
            where: { _id: new ObjectId(id) },
            relations: ["admins", "accounts"]
        });
        return school as any as SchoolType;
    }

    @Mutation(() => AuthResponse)
    async createSchool(
        @Ctx() context: Context,
        @Arg("name") name: string,
        @Arg("school_code") school_code: string,
        @Arg("school_registration_code") school_registration_code: string,
        @Arg("locations") locations: LocationInput,
        @Arg("contacts") contacts: ContactInput,
        @Arg("capacity") capacity: string,
        @Arg("est_date") est_date:Date
    ): Promise<AuthResponse> {
        // Check for authorization header
        const authHeader = context.req.headers.authorization;
        if (!authHeader) {
            throw new Error("Authorization header is required");
        }

        // Extract and verify token
        let admin: Admins | null = null;
        const token = authHeader.split(" ")[1]; // Remove "Bearer " prefix
        try {
            const decodedToken = await decodeToken(token);
            if (decodedToken?.id!) {
                admin = await this.adminRepository.findOne({where: {_id: new ObjectId(decodedToken.id! as string)}});
                if (!admin) {
                    throw new Error("Admin not found");
                }
                if(admin.role.role !== "ADMIN"){
                    throw new Error("You are not authorized to create a school");
                }
            }
        } catch (error) {
            console.log(error);
            throw new Error("Invalid or expired token");
        }
        const unique_code = generateSchoolCode(name,school_registration_code,est_date.getFullYear().toString());
       
      
        const school = this.schoolRepository.create({
            school_name: name,
            school_code: unique_code,
            school_registration_code,
            locations: this.convertToLocation(locations),
            contacts: this.convertToContact(contacts),
            capacity,
            admins: admin,
            school_establishment_date:est_date
        });
        
        const savedSchool = await this.schoolRepository.save(school);
        await this.adminRepository.save({_id:admin!._id,schools:[{_id:savedSchool._id}]});
        return {
            status: 200,
            code: unique_code,
            message: "School created successfully",
            data: savedSchool as any as SchoolType,
            token: token
        };
    }

    @Mutation(() => SchoolType)
    async updateSchool(
        @Arg("id") id: string,
        @Arg("name", { nullable: true }) name?: string,
        @Arg("school_code", { nullable: true }) school_code?: string,
        @Arg("school_registration_code", { nullable: true }) school_registration_code?: string,
        @Arg("locations", { nullable: true }) locations?: LocationInput,
        @Arg("contacts", { nullable: true }) contacts?: ContactInput,
        @Arg("capacity", { nullable: true }) capacity?: string,
        @Arg("admin_id", { nullable: true }) admin_id?: string
    ): Promise<SchoolType> {
        const school = await this.schoolRepository.findOneBy({ _id: new ObjectId(id) });
        if (!school) {
            throw new Error("School not found");
        }
        
        if (name) school.school_name = name;
        if (school_code) school.school_code = school_code;
        if (school_registration_code) school.school_registration_code = school_registration_code;
        if (locations) school.locations = this.convertToLocation(locations);
        if (contacts) school.contacts = this.convertToContact(contacts);
        if (capacity) school.capacity = capacity;

        if (admin_id) {
            const admin = await this.adminRepository.findOneBy({ _id: new ObjectId(admin_id) });
            if (!admin) {
                throw new Error("Admin not found");
            }
            school.admins = admin;
        }

        const updatedSchool = await this.schoolRepository.save(school);
        return updatedSchool as any as SchoolType;
    }

    @Mutation(()=>AuthResponse)
    async verifySchool(
        @Arg("school_code") school_code:string
    ):Promise<AuthResponse>{
        const school = await this.schoolRepository.findOneBy({school_code});
        if(!school){
            throw new Error("School not found");
        }
        const unique_code = generateSchoolCode(school.school_name,school.school_registration_code,school.school_establishment_date.getFullYear().toString());
         
        const token = await generateToken({id: school._id.toString()});
        return {
            status: 200,
            message: "School verified successfully",
            code: unique_code,
            token: token
        };
        
    }


    @Mutation(() => Boolean)
    async deleteSchool(@Arg("id") id: string): Promise<boolean> {
        const result = await this.schoolRepository.delete({ _id: new ObjectId(id) });
        return result.affected ? result.affected > 0 : false;
    }
}

