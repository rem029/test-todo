import path from "path";
import { Knex } from "knex";
import KnexConnect from "knex";

const knexFile = path.join(__dirname, "../../knexfile.ts");

const config: Knex.Config = require(knexFile).default;

const knex = KnexConnect(config);

export default knex;
