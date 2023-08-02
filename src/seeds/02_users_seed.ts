import { Knex } from "knex";
import bcrypt from "bcrypt";

const saltRounds = Number(process.env.SALT_ROUND) || 10;

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();

  const username = "admin";
  const password = "admin";
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await knex("users").insert([{ username, password: hashedPassword }]);
}
