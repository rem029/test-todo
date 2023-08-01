import "dotenv/config";
import { Knex } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DB,
    port: Number(process.env.DB_PORT) || 5433,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: __dirname + "/src/migrations",
  },
  seeds: {
    directory: __dirname + "/src/seeds",
  },
};

export default config;
