/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('Manufactories', function (table) {
      table.uuid('id').primary()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
      table.string("name")
    })
    .createTable('Models', function (table) {
      table.uuid('modelId').primary()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
      table.string("name")
      table.string('manufactory')
      table.text('years')
      table.string('galleryId')
      table.string('specsId')
      table.text('description')
    })
    .createTable('Gallery', function (table) {
      table.uuid('galleryId').primary()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
      table.text("images")
    })
    .createTable('Specs', function (table) {
      table.uuid('specsId').primary()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
      table.text("specs")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
