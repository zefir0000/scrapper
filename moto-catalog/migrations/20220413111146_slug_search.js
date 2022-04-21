/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
      .table('Models', function (table) {
        table.string('slug')
        table.string('search')
        table.text('specPl').defaultTo('[]')
        table.text('descriptionPl').defaultTo(null)
      })
      .table('Manufactories', function (table) {
        table.string('logo')
      })
      .createTable('Stats', function (table) {
        table.uuid('statId').primary()
        table.uuid('modelId').defaultTo(null)
        table.uuid('manufactoryId').defaultTo(null)
        table.timestamp('created_at').defaultTo(knex.fn.now())
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

};
