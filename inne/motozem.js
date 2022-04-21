const axios = require('axios');
const DomParser = require('dom-parser');
// https://www.kqzyfj.com/click-100546009-13161071?url=https%3A%2F%2Fwww.e-insportline.pl%2Fwsparcie-klienta
async function links() {
  var websiteId = 100546009;
  var trackingServerDomain = 'www.anrdoezrs.net';
  var generateLinkOnLoad = true;
  var publisherId = 6019981;
  var sid = undefined;
  var debug = false;
  console.log('STARTARTA')

  const parser = new DomParser
  const categories = ['odziez-motocyklowa', 'czesci-motocyklowe-i-akcesoria', 'czesci-motocyklowe']

  const { data: list } = await axios('https://www.motozem.pl/odziez-motocyklowa?iPage=112');
  const dom = parser.parseFromString(list)
  const pagcount = dom.getElementsByClassName('pages')[0];
  const listPage = pagcount.getElementsByTagName('li')
  const lastpage = listPage[listPage.length-1].textContent.trim()

  console.log(lastpage)

  const linkselement = dom.getElementsByClassName('single-product').map(i => {
    const dostepnosc = i.getElementsByClassName('stock')[0]

    const ret = dostepnosc ? dostepnosc.textContent.trim() : null;
    const href = i.getElementsByTagName('a')[0].attributes.find(i => i.name === 'href')

    return ret === 'Na stanie' || ret === 'Magazyn zew.' ? `${href.value}` : null;
  })
  const links = linkselement.filter(Boolean)
  console.log(links)
  const products = [];
  // for (const link of links) {
  //   const getProduct = await product(link)
  //   products.push(getProduct)
  // }
  return products
}
async function product(link) {
  const parser = new DomParser

  const { data: page } = await axios(link);
  const dom = parser.parseFromString(page)
  const title = dom.getElementsByTagName('h1')[0].innerHTML.replace('&amp;', '&')
  console.log(title)
  const description = dom.getElementsByClassName('info-container')[0].innerHTML
    .toString()
    // .replace('<p class="auto-translated-information-text"><i>To jest automatyczne tłumaczenie wygenerowane przez software:</i></p><p> Zapasowy olej przekładniowy 80W-90 GL-5, numer części 99000-22930-046, to oryginalna część Suzuki, co oznacza, że jest dokładnie taka sama, jak ta zamontowana fabrycznie, gdy pojazd był nowy </p>', '')
    .replace(/<a.+(?=">)">/gm, '')
    .replace(/<\/a>/gm, '')
    .replace(/<button.*\n.+\n.+/gm, '')
    .replace(/\n/gm, '').trim()


  const factory = dom.getElementsByAttribute('itemprop', 'brand')[0].innerHTML

  //dom.getElementsByClassName('info-container')
  const breadcrumbs = dom.getElementsByClassName('breadcrumbs')[0].getElementsByTagName('a')
  const category = breadcrumbs.map(i => i.innerHTML)
  const images =
  page.match(/(?<="imgBig":)"(.*?)"/gm)

  const price = dom.getElementsByAttribute('itemprop', 'price')[0].innerHTML.replace(',','.')

  const product = {
    title,
    description,
    price,
    factory,
    category,
    images,
    status: 'Aktywna'
  }
  console.log(product)
  return product;
}
product('https://www.motozem.pl/integralny-kask-motocyklowy-cassida-integral-3-0-czarny-matowy/').catch(error => {
  console.log(error)
  process.exit(1);
});
