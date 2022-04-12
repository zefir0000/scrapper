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
      table.text("custom")
    })
    .createTable('Models', function (table) {
      table.uuid('modelId').primary()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
      table.string("name")
      table.string('manufactory')
      table.text('years')
      table.string('detailsId')
      table.text("custom")
    })
    .createTable('Gallery', function (table) {
      table.uuid('galleryId').primary()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
      table.text("images")
    })
    .createTable('Details', function (table) {
      table.uuid('detailsId').primary()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
      table.text("specs")
      table.text('description')
      table.string('galleryId')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
