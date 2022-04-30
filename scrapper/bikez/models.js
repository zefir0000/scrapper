const axios = require('axios');
const DomParser = require('dom-parser');

async function modelsOld(link) {
  console.log('START MODELS')

  let con = true
  let items = [];
  let years = [];
  let linki = [];
  let corelink = link

  do {
    console.log('LINK:', `${corelink}`)
    const parser = new DomParser
    const data = await axios.request({
      method: 'GET',
      url: `${corelink}`,
      responseType: 'arraybuffer',
      reponseEncoding: 'binary'
    }).catch(e => ({ data: { status: 404 } }));;
    const decoder = new TextDecoder('ISO-8859-1');

    if (data.status === 200) {

      let list = decoder.decode(data.data)
      const dom = parser.parseFromString(list)
      const nextPage = hrefNextPage ? hrefNextPage.attributes.find(i => i.name === 'href').value : null;

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

      corelink = 'https://www.motorcyclespecs.co.za/bikes/' + nextPage
    } else { con = false }
  } while (con)

  const models = linki.flatMap(item => item).flatMap(item => item);
  console.log(models.length)

  return models
}
async function models(link) {
  const parser = new DomParser

  const data = await axios.request({
    method: 'GET',
    url: `${link}`,
    responseType: 'arraybuffer',
    reponseEncoding: 'binary'
  }).catch(e => ({ data: { status: 404 } }));;
  const decoder = new TextDecoder('ISO-8859-1');
  let list = decoder.decode(data.data)
  const dom = parser.parseFromString(list)
  const modelList = dom.getElementsByClassName('zebra')[0].getElementsByTagName('a').map(item => {
    const link = item.attributes.find(i => i.name === 'href')?.value;
    const name = item.textContent.replace(/\n|\t/g, '').replace('&amp;', '&').trim()
    // console.log(name)
    if (/\.\.\/motorcycles\//.test(link)){
    return {
      link: link.replace('../models', 'https://bikez.com/models'),
      name: name.replace(/motorcycles/i, '').trim()
    }} else { return null}
  }).filter(Boolean)

  console.log(modelList)

}

models('https://bikez.com/models/access_models.php').catch(error => {
  console.log(error)
  process.exit(1);
});