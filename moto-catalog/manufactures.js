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
    } else { console.log('htm'); if(html === 'html') { html = 'htm'} else { con = false } }
  } while (con)
  console.log(linki.flatMap(item => item).flatMap(item => item), linki.flatMap(item => item).flatMap(item => item).length)
  return modelList

}

async function product() {
  const parser = new DomParser

  const { data: page } = await axios('https://www.motorcyclespecs.co.za/model/beneli/benelli_900_sei%2078.htm');
  const dom = parser.parseFromString(page.match(/#BeginEditable "Main(.*?)#EndEditable/gms)[0])
  const title = '' //dom.getElementsByTagName('title')[0].innerHTML.replace('&amp;', '&')

  const description = '' //dom.getElementsByTagName('p').map(desc => {
    // console.log(desc.textContent.trim().replace(/\s\s/gm, ''))
  // })
  // .replace('<p class="auto-translated-information-text"><i>To jest automatyczne tłumaczenie wygenerowane przez software:</i></p><p> Zapasowy olej przekładniowy 80W-90 GL-5, numer części 99000-22930-046, to oryginalna część Suzuki, co oznacza, że jest dokładnie taka sama, jak ta zamontowana fabrycznie, gdy pojazd był nowy </p>', '')
  // .replace(/<a.+(?=">)">/gm, '')
  // .replace(/<\/a>/gm, '')
  // .replace(/<button.*\n.+\n.+/gm, '')
  // console.log(description)



  const specs = dom.getElementsByTagName('table')[1].getElementsByTagName('tr').map(tr => {
    const label = tr.getElementsByTagName('td')[0].textContent.trim().replace(/\s\s/gm, '')
    const value = tr.getElementsByTagName('td')[1].textContent.trim().replace(/\s\s/gm, '')
    // console.log(tr.innerHTML.trim().replace(/\s\s/gm, ''))
    // console.log(label, value)
  })
  const table = dom.getElementsByTagName('table')[1].innerHTML
const tableParse = table.match(/<tr(.*?)(?=<tr)/gms).map(tr => {
  console.log(tr)
  console.log(`${tr}<`.match(/(?<=>)(.*?)(?=<)/gms).map(a => {
    const ret = a.replace(/\n|\s\s|&nbsp;/g,'').replace('&quot;', '"').replace(/\\t/g, ' ')
    return ret === '' || ret === '\t' ? null : ret;
  }).filter(Boolean), '%%%%')
  // const content = parser.parseFromString(tr).getElementsByTagName('td').map(td => {
    // console.log(td.innerHTML)
    // const label = td.getElementsByTagName('td')[0].textContent.trim().replace(/\s\s/gm, '')
    // const value = td.getElementsByTagName('td')[1].textContent.trim().replace(/\s\s/gm, '')
    // console.log(tr.innerHTML.trim().replace(/\s\s/gm, ''))
    // console.log(label, value)
  // })
})
// console.log(tableParse, ' %%%')
  // const factory = specs[0].getElementsByTagName('span')[0].innerHTML.trim()
  // const model = specs[1].getElementsByTagName('span')[0].innerHTML.trim()

  const year = ''//specs[2].getElementsByTagName('span')[0].innerHTML.trim()

  const breadcrumbs = dom.getElementsByClassName('breadcrumbs')
  // const category = breadcrumbs.map(i => i.innerHTML)
  // const status = dom.getElementsByClassName('shadow-box')[0]

  // category ? category.shift() : []

  const images = dom.getElementsByTagName('img').map(image => {
    const src = image.attributes.find(i => i.name === 'src')

    return /\.\.\/Gallery/gm.test(src.value) ? src.value.replace('../..', 'https://www.motorcyclespecs.co.za') : null ;
  }).filter(Boolean)
  const product = {
    title,
    description,
    // factory,
    // model,
    year,
    // category,
    images,
    // status: status ? 'Aktywna' : 'Niekatywna'
  }
  console.log(product, ' product')
  return product;
}
product().catch(error => {
  console.log(error)
  process.exit(1);
});
