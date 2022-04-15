const modelScrap = require('./models')
const productScrap = require('./products')

const ModelsModel = require('./models/Model')
const DetailsModel = require('./models/Specs')

const knex = require("./knex");
const { uuid } = require('uuidv4');
const BASE_URL = 'https://www.motorcyclespecs.co.za/'

async function models(factory) {
  const factoryDb = await knex().from('Manufactories').select('*').where('name', factory).first()
  console.log(factoryDb, ' factopry')
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
  const modelDb = await knex().from('Models').select('*').where('name', model).first()
  console.log(modelDb, ' models')
  const details = await productScrap.details(BASE_URL + modelDb.custom)
  // await Promise.all(modelList.map(async item => {
    // const { year, name } = item;
    // const fixName = name.replace(/&quot;/gm, '"').trim()
    const detailsDb = await knex().from('Details').select('*').where('name', modelDb.detailsId).first()

    if (!detailsDb) {
      // module for save images
      const galleryId = uuid();
      await DetailsModel.create({
        detailsId: modelDb.detailsId,
        name: modelDb.name,
        // years: JSON.stringify(yearsArray(year.replace(/-$/, ''))),
        description: details.description,
        specs: details.specs,
        galleryId: galleryId
      }).catch(e => { console.error(e, ' ERRERr'); return; })
      console.log('add: ', fixName)
    }

    // return
  // }))
  console.log('finished !')
  return;
}

models('Yamaha')
.catch(error => {
  console.log(error)
  process.exit(1);
});
