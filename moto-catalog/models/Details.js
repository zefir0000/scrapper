const knex = require("../knex.js");

const TABLE_GALLERY = 'Details';

module.exports.create = async (data) => {
  return await knex.from(TABLE_GALLERY)
    .insert({
      detailsId: data.detailsId,
      specs: data.specs,
      galleryId: data.galleryId,
      description: data.description

  }).catch(e => { return { status: 'fail', error: e } })
};
module.exports.update = async (data) => {
  return await knex.from(TABLE_GALLERY)
    .where({ detailsId: data.detailsId })
    .update({
      specs: data.specs,
      galleryId: data.galleryId,
      description: data.description

  }).catch(e => { return { status: 'fail', error: e } })
};
