const axios = require('axios');
const DomParser = require('dom-parser');
var fs = require('fs');

async function manufactures() {
  console.log('STARTARTA')

  const parser = new DomParser

  const { data: list } = await axios('https://www.motorcyclespecs.co.za/Manufacturer.htm');

  const dom = parser.parseFromString(list)

  const manufacturesList = dom.getElementById('table702').getElementsByTagName('a').map(i => {
    return {
      link: i.attributes.find(i => i.name === 'href').value,
      name: i.textContent.replace(/\n|\t/g, '').replace('&amp;', '&')
    }
  })
  console.log(manufacturesList)

  return manufacturesList
}
async function models() {
  console.log('STARTARTA')

  const parser = new DomParser
  let page = 1
  let con = true
  let modelList = []
  let items = [];
  let years = [];
  let linki = [];
  let html = 'html'
  do {
    const data = await axios(`https://www.motorcyclespecs.co.za/bikes/KTM${page === 1 ? '' : page}.${html}`).catch(e => ({ data: { status: 404 } }));
    if (data.status === 200) {
      html = 'html'

      const list = data.data
      const tables = list.match(/(?<=border="5")(.*?)<\/table>/gs)
      const modelList = await Promise.all(tables.map(tab => {
        const table1 = parser.parseFromString(tab);
        const row = table1.getElementsByTagName('tr').flatMap(tr => {

          items = tr.getElementsByTagName('a').map(i => {
            const link = i.attributes.find(i => i.name === 'href').value
            return /\.\.\/model/.test(link) ? {
              link,
              name: i.textContent.replace(/\n|\t/g, '').replace('&amp;', '&').replace('&nbsp;', ' ')
            } : null
          }).filter(Boolean)
          years = tr.getElementsByTagName('font').map(i => {
            const year = i.textContent
            return /^(\d{4}\d\d|\d\d\d\d)/gms.test(year) && year.length < 15 ?
              year.replace(/\n/g, '').trim()
              : null
          }).filter(Boolean)
          return years && items && years.length && items.length ? {
            name: items[0].name,
            link: items[0].link,
            year: years[0]
          } : undefined

        }).filter(Boolean)
        const result = [...new Map(row.map(item => [item['link'], item])).values()]
        return result
      }))
      linki.push(modelList.flatMap(item => item))
      page++
    } else { console.log('htm'); if (html === 'html') { html = 'htm' } else { con = false } }
  } while (con)
  console.log(linki.flatMap(item => item).flatMap(item => item), linki.flatMap(item => item).flatMap(item => item).length)
  return modelList

}

async function product() {
  const parser = new DomParser
  const { data: page } = await axios.request({
    method: 'GET',
    url: 'https://www.motorcyclespecs.co.za/model/ktm/ktm_125_exc%206%20day%2011.htm',
    responseType: 'arraybuffer',
    reponseEncoding: 'binary'
  });
  const decoder = new TextDecoder('ISO-8859-1');
  let html = decoder.decode(page)
  const dom = parser.parseFromString(html.match(/#BeginEditable "Main(.*?)#EndEditable/gms)[0])
  const title = '' //title; from props dom.getElementsByTagName('title')[0].innerHTML.replace('&amp;', '&')
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

  const year = ''//year(function) from props specs[2].getElementsByTagName('span')[0].innerHTML.trim()

  const images = dom.getElementsByTagName('img').map(image => {
    const src = image.attributes.find(i => i.name === 'src')

    return /\.\.\/Gallery/gm.test(src.value) ? src.value.replace('../..', 'https://www.motorcyclespecs.co.za') : null;
  }).filter(Boolean)

  const product = {
    title: tableSpecs[0][1],
    description: description,
    tableSpecs,
    year,
    images,
  }

  console.log(product, ' product')

  return product;
}
product().catch(error => {
  console.log(error)
  process.exit(1);
});
