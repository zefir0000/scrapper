const modelScrap = require('./models')
const ModelsModel = require('./models/Model')
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

models('Yamaha')
.catch(error => {
  console.log(error)
  process.exit(1);
});
