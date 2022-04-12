const knex = require("../knex.js");

const TABLE_GALLERY = 'Models';

module.exports.create = async (data) => {
  return await knex.from(TABLE_GALLERY)
    .insert({
      modelId: data.modelId,
      name: data.name,
      manufactory: data.manufactory,
      years: data.years,
      detailsId: data.detailsId,
      custom: data.custom

  }).catch(e => { return { status: 'fail', error: e } })
};
module.exports.update = async (data) => {
  return await knex.from(TABLE_GALLERY)
    .where({ modelId: data.modelId })
    .update({
      name: data.name,
      manufactory: data.manufactory,
      years: data.years,
      detailsId: data.detailsId,
      custom: data.custom

  }).catch(e => { return { status: 'fail', error: e } })
};
