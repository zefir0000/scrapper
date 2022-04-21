
const knex = require("../knex");
const { viewModelStat } = require("../services/stats.service")

exports.home = async (req, res) => {
  const clientCount = await knex.from('Models').count()

  const factories = await knex.from('Manufactories').select('Manufactories.name', 'Manufactories.logo').count('name as count')
    .orderBy('count', 'desc')
    .join('Stats', { 'Manufactories.name': 'Stats.manufactoryId' }).groupBy('name', 'logo')
    .limit(20)

  const recent = await knex.from('Models')
    .select('Models.modelId', 'Details.detailsId', 'Gallery.images', 'Models.slug', 'Models.name', 'Models.years', 'Models.manufactory')
    .count('name as count')
    .orderBy('count', 'desc')
    .groupBy('name', 'modelId', 'detailsId', 'images', 'slug', 'years', 'manufactory')
    .join('Stats', { 'Models.modelId': 'Stats.modelId' })
    .join('Details', { 'Models.detailsId': 'Details.detailsId' })
    .join('Gallery', { 'Details.galleryId': 'Gallery.galleryId' })
    .limit(12)

  const response = recent.map(item => ({ ...item, images: JSON.parse(item.images), years: JSON.parse(item.years) }))

  res.render('index', { count: clientCount[0]['count(*)'], factories: factories, recent: response });
};

exports.motocykl = async (req, res) => {
  const moto = await knex.from('Models').where('slug', req.params.slug)
    .join('Details', { 'Models.detailsId': 'Details.detailsId' })
    .join('Gallery', { 'Details.galleryId': 'Gallery.galleryId' })
    .first()

  viewModelStat({ modelId: moto.modelId, manufactoryId: moto.manufactory })

  res.render('motocykl', { moto: { ...moto, specs: JSON.parse(moto.specs), images: JSON.parse(moto.images) } });
};

exports.search = async (req, res) => {
  const offset = req.query.offset || 0;
  const limit = 24
  // let phrases = req.query.nazwa.toLowerCase().split(' ');
  // phrases.map((e, i) => {
  //   if (i == 0) {
  //     input = name ? `AND title COLLATE UTF8_GENERAL_CI like '%${e}%'` : '';
  //   } else {
  //     input = input + ` AND title COLLATE UTF8_GENERAL_CI like '%${e}%'`
  //   }
  // })
  // input = input + ''
  const recent = await knex.from('Models')
    .select('Models.modelId', 'Details.detailsId', 'Gallery.images', 'Models.slug', 'Models.name', 'Models.years', 'Models.manufactory')

    .where('search', 'LIKE', `%${req.query.nazwa}%`)
    .orderBy('name')
    .join('Details', { 'Models.detailsId': 'Details.detailsId' })
    .join('Gallery', { 'Details.galleryId': 'Gallery.galleryId' })
    .limit(limit).offset(offset)

  const response = recent.map(item => ({ ...item, images: JSON.parse(item.images), years: JSON.parse(item.years) }))

  const { count } = await knex.from('Models')
    .where('search', 'LIKE', `%${req.query.nazwa}%`)
    .count('modelId as count').first()
    
  res.render('wyszukaj', { recent: response, hasNext: count > Number(offset) + limit })
};
