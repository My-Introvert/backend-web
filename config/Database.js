import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  hostname: process.env.APP_HOSTNAME_BE,
  dialect: process.env.DB_DIALECT,
});

export default db;
