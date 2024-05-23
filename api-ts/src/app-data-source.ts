import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "pass123",
    database: "rocket_lab",
    entities: ["src/entities/*.ts"],
    logging: true,
    synchronize: false,
})
