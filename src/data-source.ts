import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv"

dotenv.config()

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGODB_URI,
    synchronize: true,
    logging: false,
    entities: [__dirname + '/entities/**/*.ts'],
    migrations: [],
    subscribers: [],
})
