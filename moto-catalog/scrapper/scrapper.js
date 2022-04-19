const modelScrap = require('./models')
const productScrap = require('./products')
const slugConverter = require('../helpers/slugConverter')
const randomString = require('../helpers/randomString')
const ModelsModel = require('../models/Model')
const DetailsModel = require('../models/Details')
const GalleryModel = require('../models/Gallery')

const knex = require("../knex");
const { uuid } = require('uuidv4');
const BASE_URL = 'https://www.motorcyclespecs.co.za/'

async function models() {
  const factoriesDb = await knex().from('Manufactories').select('*')
  await Promise.all(factoriesDb.map(async factoryDb => {

    const modelList = await modelScrap.models(BASE_URL + factoryDb.custom)
    await Promise.all(modelList.map(async item => {
      const { year, name } = item;
      const fixName = name.replace(/&quot;/gm, '"').trim()
      const modelDb = await knex().from('models').select('*').where('name', fixName).first()
      if (!modelDb) {
        await ModelsModel.create({
          modelId: uuid(),
          name: fixName,
          years: JSON.stringify(yearsArray(year.replace(/-$/, ''))),
          manufactory: factoryDb.name,
          custom: item.link,
          detailsId: uuid()
        }).catch(e => { console.error(e, ' ERRERr'); return; })
        console.log('add: ', fixName)
      }
      return
    }))
  }))
  console.log('finished !')
  return;
}
function yearsArray(year) {
  let years = [year.slice(0, 4)]

  if (year.length != 4) {
    let iterYear = Number(year.slice(0, 4))
    let x = year.match(/(?<=\D)\d\d\b/)
    let toPush;
    do {
      toPush = `${++iterYear}`
      years.push(toPush)

    } while (x && x[0].toString() != toPush.toString().slice(2, 4))
  }
  return years
}

async function details(model) {
  const offset = 0
  const modelDb = await knex('Models').select('*').limit(50000).offset(offset)
  const asd = await Promise.all(await modelDb.map(async (item, index) => {
    // for (let i = 0; i < modelDb.length; i++) {
    // let item = modelDb[i]
    const detailsDb = await knex('Details').select('*').where('detailsId', item.detailsId).first()

    if (!detailsDb) {
      const details = await productScrap.details(BASE_URL + item.custom.replace('../', ''))

      const slug = slugConverter(item.name) + randomString(6);
      const galleryId = await productScrap.saveImages(details.images, slug)

      await DetailsModel.create({
        detailsId: item.detailsId,
        name: item.name,
        description: details.description,
        specs: JSON.stringify(details.tableSpecs),
        galleryId: galleryId
      }).catch(e => { console.error(e, ' ERRERr'); return; })
      console.log(index, modelDb.length ,' add details for: ', item.name)
    } else ( console.log(index, modelDb.length))
  // }
  }));
console.log('finished')
  return;
}

details()
  .catch(error => {
    console.log(error)
    // process.exit(1);
  });
