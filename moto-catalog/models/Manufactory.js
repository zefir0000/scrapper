const knex = require("../knex.js");

const TABLE_GALLERY = 'Manufactories';

module.exports.create = async (data) => {
  return await knex.from(TABLE_GALLERY)
    .insert({
      id: data.id,
      name: data.name
  }).catch(e => { return { status: 'fail', error: e } })
};
module.exports.update = async (data) => {
  return await knex.from(TABLE_GALLERY)
    .where({ id: data.id })
    .update({
      name: data.name
  }).catch(e => { return { status: 'fail', error: e } })
};
