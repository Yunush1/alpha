import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { StandardType, CreateStandardInput, UpdateStandardInput } from "../types/StandardType";
import { AppDataSource } from "../../data-source";
import { ObjectId } from "mongodb";
import { HttpError } from "../../utils/httpError";
import { User } from "../../entities/User";
import { StudentStandard } from "../../entities/school/StudentStandard";
@Resolver(of => StandardType)
export class StandardResolver {
    private standardRepository = AppDataSource.getRepository(StudentStandard);
    private userRepository = AppDataSource.getRepository(User);

    @Query(() => [StandardType])
    async standards(): Promise<StandardType[]> {
        try {
            const standards = await this.standardRepository.find({
                relations: ["user"]
            });
            return standards as any as StandardType[];
        } catch (error) {
            console.error("Error fetching standards:", error);
            throw new HttpError(500, "Error fetching standards");
        }
    }

    @Query(() => StandardType, { nullable: true })
    async standard(@Arg("id") id: string): Promise<StandardType | null> {
        try {
            const standard = await this.standardRepository.findOne({
                where: { _id: new ObjectId(id) },
                relations: ["user"]
            });

            if (!standard) {
                throw new HttpError(404, "Standard not found");
            }

            return standard as any as StandardType;
        } catch (error) {
            console.error("Error fetching standard:", error);
            throw new HttpError(error.status || 500, error.message || "Error fetching standard");
        }
    }

    @Mutation(() => StandardType)
    async createStandard(
        @Arg("input") input: CreateStandardInput
    ): Promise<StandardType> {
        try {
            let user = null;
            if (input.user_id) {
                user = await this.userRepository.findOne({
                    where: { _id: new ObjectId(input.user_id) }
                });
                if (!user) {
                    throw new HttpError(404, "User not found");
                }
            }

            const standard = this.standardRepository.create({
                standard: input.standard,
                section: input.section,
                roll_number: input.roll_number,
                is_active: input.is_active,
                startSession: input.startSession,
                endSession: input.endSession,
                user: user,
            });

            const savedStandard = await this.standardRepository.save(standard);
            return savedStandard as any as StandardType;
        } catch (error) {
            console.error("Error creating standard:", error);
            throw new HttpError(error.status || 500, error.message || "Error creating standard");
        }
    }

    @Mutation(() => StandardType)
    async updateStandard(
        @Arg("id") id: string,
        @Arg("input") input: UpdateStandardInput
    ): Promise<StandardType> {
        try {
            const standard = await this.standardRepository.findOne({
                where: { _id: new ObjectId(id) },
                relations: ["user"]
            });

            if (!standard) {
                throw new HttpError(404, "Standard not found");
            }

            if (input.user_id) {
                const user = await this.userRepository.findOne({
                    where: { _id: new ObjectId(input.user_id) }
                });
                if (!user) {
                    throw new HttpError(404, "User not found");
                }
                standard.user = user;
            }

            if (input.standard) standard.standard = input.standard;
            if (input.section) standard.section = input.section;
            if (input.roll_number) standard.roll_number = input.roll_number;
            if (typeof input.is_active !== 'undefined') standard.is_active = input.is_active;
            if (input.startSession) standard.startSession = input.startSession;
            if (input.endSession) standard.endSession = input.endSession;

            const updatedStandard = await this.standardRepository.save(standard);
            return updatedStandard as any as StandardType;
        } catch (error) {
            console.error("Error updating standard:", error);
            throw new HttpError(error.status || 500, error.message || "Error updating standard");
        }
    }

    @Query(() => [StandardType])
    async studentStandards(@Arg("userId") userId: string): Promise<StandardType[]> {
        try {
            const standards = await this.standardRepository.find({
                where: { user: { _id: new ObjectId(userId) } },
                relations: ["user"],
                order: { startSession: "DESC" }
            });
            return standards as any as StandardType[];
        } catch (error) {
            console.error("Error fetching student standards:", error);
            throw new HttpError(500, "Error fetching student standards");
        }
    }

    @Mutation(() => Boolean)
    async deleteStandard(@Arg("id") id: string): Promise<boolean> {
        try {
            const result = await this.standardRepository.delete({ _id: new ObjectId(id) });
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            console.error("Error deleting standard:", error);
            throw new HttpError(500, "Error deleting standard");
        }
    }
}