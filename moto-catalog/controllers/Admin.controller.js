const knex = require("../knex");
const factoryModel = require("../models/Manufactory")
const ImageServices = require("../services/image.service")
const detailsModel = require("../models/Details")

const fs = require("fs");

exports.manufactories = async (req, res) => {
  const manufactories = await knex.from('Manufactories').orderBy('name')

  res.render('admin/manufactories', { manufactories });
};
exports.home = async (req, res) => {
  const manufactories = await knex.from('Manufactories').count('id as count').first()
  const models = await knex.from('Models').count('modelId as count').first()
  const details = await knex.from('Details').count('detailsId as count').first()


  res.render('admin/index', { manufactories: manufactories.count, models: models.count, details: details.count   });
};
exports.manufactoriesModify = async (req, res) => {
  const logo = await ImageServices.factoryLogo(req.body.logo, `${(req.body.name)}-logo`)
    .catch(e => res.json('bad request image head'));

    await factoryModel.update({
      id: req.params.id,
      name: req.body.name,
      logo: logo.original
    })
  res.render('admin/success');
};
exports.details = async (req, res) => {
  const details = await knex.from('Details')
  .select(knex.raw('Details.created_at, Details.detailsId, Details.specs, LENGTH(Details.specs) as len'))
  .where('specs', 'LIKE', `%${req.query.name}%`)
  .orderBy('len', 'desc').limit(100)

  const specs = details.map(i => {
    return {
      created_at: i.created_at,
      specs: JSON.parse(i.specs),
      id: i.detailsId,
      specsL: i.len
    }
  })
  res.render('admin/specs', { details: specs });
};
exports.editSpecs = async (req, res) => {
  const details = await knex.from('Details').where('detailsId', req.params.id).first()

  res.render('admin/specs/editSpecs', { specs: details });
};
exports.editSpecsSave = async (req, res) => {
  console.log(req.params, req.body)
  await detailsModel.update({
    detailsId: req.params.id,
    specs: req.body.specs
  })
res.render('admin/success');
};
