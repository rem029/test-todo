import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("todos", (table) => {
    table.text("description");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("todos", (table) => {
    table.dropColumn("description");
  });
}
