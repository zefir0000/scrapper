const knex = require("../knex.js");

const TABLE = 'Manufactories';

module.exports.create = async (data) => {
  return await knex.from(TABLE)
    .insert({
      id: data.id,
      name: data.name,
      custom: data.custom
  }).catch(e => { return { status: 'fail', error: e } })
};
module.exports.update = async (data) => {
  return await knex.from(TABLE)
    .where({ id: data.id })
    .update({
      name: data.name,
      custom: data.custom,
      logo: data.logo
  }).catch(e => { return { status: 'fail', error: e } })
};
