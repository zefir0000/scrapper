
const knex = require("../moto-catalog/knex");
const slugConverter = require('../moto-catalog/helpers/slugConverter')

module.exports.worker = async () => {
  const list = await knex('Models')
    .join('Details', { 'Models.detailsId': 'Details.detailsId' })

  for (step = 0; step < list.length; step++) {
    const item = list[step]
    const spec = JSON.parse(item.spec)
    const years = yearsArray(spec.find(item => item[0] === 'Year'))[1];
    const name = spec.find(item => item[0] === 'Model Factory')[1];

    await knex.where({ modelId: item.modelId })
      .update({
        years,
        name,
        search: `${item.manufactory} ${name} ${years.join(' ')}`,
        slug: slugConverter(name)
      })
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

worker()
  .catch(error => {
    console.log(error)
    // process.exit(1);
  });