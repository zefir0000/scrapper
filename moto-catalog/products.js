const axios = require('axios');
const DomParser = require('dom-parser');
const FactoryModel = require('./models/Manufactory')
const { uuid } = require('uuidv4');
const knex = require("./knex");

module.exports.details = async (link) => {

// async function product(link, title, detailsId) {
  const parser = new DomParser
  //'https://www.motorcyclespecs.co.za/model/ktm/ktm_125_exc%206%20day%2011.htm'
  const { data: page } = await axios.request({
    method: 'GET',
    url: link,
    responseType: 'arraybuffer',
    reponseEncoding: 'binary'
  });
  const decoder = new TextDecoder('ISO-8859-1');
  let html = decoder.decode(page)
  const dom = parser.parseFromString(html.match(/#BeginEditable "Main(.*?)#EndEditable/gms)[0])
  const domForDesc = html.match(/#BeginEditable "Main(.*?)#EndEditable/gms)[0]
    .replace(/(<.table>(.*?)<.table>)|(\(adsbygoogle = window.adsbygoogle \|\| \[\]\).push\({}\);)|(\n|\s{2})|(<!-- #EndEditable)|(&nbsp;)|(#BeginEditable "Main%20Content" -->)/gms, '').trim() //dom.getElementsByTagName('p').map(desc => {

  const description = domForDesc
    .replace(/<p(.*?)>/gms, '%p%')
    .replace(/<\/p>/gms, '%/p%')
    .replace(/<(.*?)>/gms, '')
    .replace(/%p%/gm, '<p class="desc">')
    .replace(/%\/p%/gm, '</p>')
    .replace(/(\t)/gm, ' ');

  const table = dom.getElementsByTagName('table')[1].innerHTML
  const tableSpecs = table.match(/<tr(.*?)(?=<tr)/gms).map(tr => {
    return `${tr}<`.match(/(?<=>)(.*?)(?=<)|<td/gms).map(a => {
      const ret = a.replace(/\n|\s\s|&nbsp;/g, '').replace('&quot;', '"').replace(/\\t/g, ' ')

      return ret === '' || ret === '\t' ? null : ret;
    }).filter(Boolean);

  }).map(item => item.join().replace(/,/g, '').replace('\t', '').split('<td').filter(Boolean))

  const images = dom.getElementsByTagName('img').map(image => {
    const src = image.attributes.find(i => i.name === 'src')

    return /\.\.\/Gallery/gm.test(src.value) ? src.value.replace('../..', 'https://www.motorcyclespecs.co.za') : null;
  }).filter(Boolean)
  
  const product = {
    description,
    tableSpecs,
    images,
  }

  console.log(product, ' product')

  return product;
}
// models().catch(error => {
//   console.log(error)
//   process.exit(1);
// });
