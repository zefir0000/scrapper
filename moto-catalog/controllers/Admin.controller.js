const knex = require("../knex");
const factoryModel = require("../models/Manufactory")
const ImageServices = require("../services/image.service")
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
  //   fs.mkdir(path.join(__dirname, 'public'), (err) => {
  //     if (err) {
  //         return console.error(err);
  //     }
  //     console.log('Directory created successfully!');
  // });
    await factoryModel.update({
      id: req.params.id,
      name: req.body.name,
      logo: logo.original
    })
  res.render('admin/success');
};
