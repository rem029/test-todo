import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("todos").del();

  await knex("todos").insert([
    { title: "Complete the REST API project", completed: false },
    { title: "Read a book", completed: false },
    { title: "Go for a walk", completed: true },
  ]);
}
