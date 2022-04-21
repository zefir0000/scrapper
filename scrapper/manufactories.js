const axios = require('axios');
const DomParser = require('dom-parser');
const FactoryModel = require('../models/Manufactory')
const { uuid } = require('uuidv4');
const knex = require("../knex");

async function manufactures() {
  console.log('START MANUFACTURIES')

  const parser = new DomParser
  const { data: page } = await axios.request({
    method: 'GET',
    url: 'https://www.motorcyclespecs.co.za/Manufacturer.htm',
    responseType: 'arraybuffer',
    reponseEncoding: 'binary'
  });
  const decoder = new TextDecoder('ISO-8859-1');
  let html = decoder.decode(page)
  const dom = parser.parseFromString(html)

  const manufacturesList = dom.getElementById('table702').getElementsByTagName('a').map(i => {
    const link = i.attributes.find(i => i.name === 'href').value;
    const name = i.textContent.replace(/\n|\t/g, '').replace('&amp;', '&').trim()
    return link && name ? {
      link,
      name
    } : null
  }).filter(Boolean)
  await Promise.all(manufacturesList.map(async factory => {
    const factoryDb = await knex().from('Manufactories').select('*').where('name', factory.name).first()
    if (!factoryDb) {
      await FactoryModel.create({
        id: uuid(),
        name: factory.name,
        custom: factory.link
      }).catch(e => { console.error(e, ' ERRERr'); return; })
    }
    return
  }))
  return manufacturesList
}
manufactures().catch(error => {
  console.log(error)
  process.exit(1);
});
