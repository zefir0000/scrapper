const knex = require("../knex.js");

const TABLE_GALLERY = 'Specs';

module.exports.create = async (data) => {
  return await knex.from(TABLE_GALLERY)
    .insert({
      specsId: data.specsId,
      specs: data.specs
  }).catch(e => { return { status: 'fail', error: e } })
};
module.exports.update = async (data) => {
  return await knex.from(TABLE_GALLERY)
    .where({ specsId: data.specsId })
    .update({
      specs: data.specs
  }).catch(e => { return { status: 'fail', error: e } })
};
