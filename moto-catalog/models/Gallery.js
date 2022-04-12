const knex = require("../knex.js");

const TABLE_GALLERY = 'Gallery';

module.exports.create = async (data) => {
  return await knex.from(TABLE_GALLERY)
    .insert({
      galleryId: data.galleryId,
      images: data.images,
  }).catch(e => { return { status: 'fail', error: e } })
};
module.exports.update = async (data) => {
  return await knex.from(TABLE_GALLERY)
    .where({ galleryId: data.galleryId })
    .update({
      images: data.images,
  }).catch(e => { return { status: 'fail', error: e } })
};
