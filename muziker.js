const axios = require('axios');
const DomParser = require('dom-parser');

async function links() {
  var websiteId = 100546009;
  var trackingServerDomain = 'www.anrdoezrs.net';
  var generateLinkOnLoad = true;
  var publisherId = 6019981;
  var sid = undefined;
  var debug = false;
  console.log('STARTARTA')

  const parser = new DomParser
  const categories = ['motocyklowe-oleje-filtry-smary', 'kaski-motocyklowe-integralne', 'kaski-motocyklowe-szczekowe']

  const { data: list } = await axios('https://www.muziker.pl/motocyklowe-oleje-filtry-smary?per=60&page=4');
  const dom = parser.parseFromString(list)
  const pagcount = dom.getElementsByClassName('paginate-count')[0].innerHTML;

  const condition = pagcount.match(/(\d+(?= z))|((?<=z )\d+)/g)
  // console.log(condition[0] === condition[1])

  const linkselement = dom.getElementsByClassName('link-overlay').map(i => {
    const dostepnosc = i.getElementsByClassName('tile-footer')[0]
    const ret = dostepnosc ? dostepnosc.textContent.trim() : null;

    const href = i.attributes.find(i => i.name === 'href')

    return ret !== 'Długoterminowo niedostępne' ? `https://muziker.pl${href.value}` : null;
  })
  const links = linkselement.filter(Boolean)
  const products = [];
  for (const link of links) {
    const getProduct = await product(link)
    products.push(getProduct)
  }
  return products
}
async function product(link) {
  const parser = new DomParser

  const { data: page } = await axios(link);
  const dom = parser.parseFromString(page)
  const title = dom.getElementsByTagName('h1')[0].innerHTML.replace('&amp;', '&')
  const description = dom.getElementsByClassName('description')[0].innerHTML
    .toString()
    .replace('<p class="auto-translated-information-text"><i>To jest automatyczne tłumaczenie wygenerowane przez software:</i></p><p> Zapasowy olej przekładniowy 80W-90 GL-5, numer części 99000-22930-046, to oryginalna część Suzuki, co oznacza, że jest dokładnie taka sama, jak ta zamontowana fabrycznie, gdy pojazd był nowy </p>', '')
    .replace(/<a.+(?=">)">/gm, '')
    .replace(/<\/a>/gm, '')
    .replace(/<button.*\n.+\n.+/gm, '')

  const factory = dom.getElementsByClassName('img-fluid d-flex align-items-center')[0].attributes.find(i => i.name === 'title').value;
  const breadcrumbs = dom.getElementsByClassName('breadcrumbs')[0].getElementsByClassName('underline-link')
  const category = breadcrumbs.map(i => i.innerHTML)
  const images = dom.getElementsByTagName('ul')[0].getElementsByTagName('img').map(image => {
    const src = image.attributes.find(i => i.name === 'src')
    return src.value
  })
  const status = dom.getElementsByClassName('shadow-box')[0].textContent.match('Dostępny na magazynie')
  const price = dom.getElementsByAttribute('data-original-price-value', '*')[0].attributes[2].value
  category ? category.shift() : []

  const product = {
    title,
    description,
    price,
    factory,
    category,
    images,
    status: status ? 'Aktywna' : 'Niekatywna'
  }
  return product;
}
links().catch(error => {
  console.log(error)
  process.exit(1);
});
