
const knex = require("../moto-catalog/knex");
const slugConverter = require('../moto-catalog/helpers/slugConverter')
const translate = require('translate');

async function worker() {

  const list = await knex('Models').orderBy('modelId')
    .join('Details', { 'Models.detailsId': 'Details.detailsId' })
  for (step = 0; step < list.length; step++) {
    try {
      const item = list[step]
      console.log(step, item.modelId)
      const specs = JSON.parse(item.specs)
      const year = specs.find(item => item[0] === 'Year')[1]
      const years = yearsArray(year);
      const name1 = specs.find(item => item[0] === 'Make Model')
      const name = name1 ? name1[1].replace(item.manufactory, '').trim() : item.name;

      await knex('Models').where({ modelId: item.modelId })
        .update({
          years: JSON.stringify(years),
          name,
          search: `${item.manufactory} ${name} ${years.join(' ')}`,
          slug: slugConverter(`${name}-${year}`)
        })
      console.log(step, JSON.stringify(years),
        name,
        `${item.manufactory} ${name} ${years.join(' ')}`,
        slugConverter(name))
    } catch (e) {
      console.log(e)
    }
  }
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

async function workerTranslate() {

  const list = await knex('Details').orderBy('detailsId')
  for (step = 0; step < list.length; step++) {
    try {
      const item = list[step]
      const descEn = item.description
      const descPl = await translate(descEn, { to: 'pl' }).catch(err => {
        console.error(err)
      })

      await knex('Details').where({ detailsId: item.detailsId })
        .update({
          descriptionPl: descPl,

        })
      console.log(step, item.detailsId)
    } catch (e) {
      console.log(e)
    }
  }
}

workerTranslate()
  .catch(error => {
    console.log(error)
    // process.exit(1);
  });
