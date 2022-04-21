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

  const { data: list } = await axios('https://www.e-insportline.pl/akcesoria-motocyklowe?f=avail:1&page=1-50');
  const dom = parser.parseFromString(list)

  const linkselement = dom.getElementsByClassName('product').map(i => {

    const href = i.getElementsByTagName('a')[0].attributes.find(i => i.name === 'href')

    return `${href.value}`;
  })
  const links = linkselement.filter(Boolean)

  return links
}
async function product(link) {
  const parser = new DomParser

  const { data: page } = await axios(link);
  const dom = parser.parseFromString(page)
  const title = dom.getElementsByTagName('h1')[0].textContent.replace('&amp;', '&')
  const descrem =dom.getElementsByClassName('other_content_wrap')[0].innerHTML
  const description = dom.getElementsByClassName('tabs-content')[0].innerHTML
    .toString()
    .replace(descrem, '')
    .replace(/<a.+(?=">)">/gm, '')
    .replace(/<\/a>/gm, '')
    .replace(/\t|\r/gm, '')
    .replace(/<button.*\n.+\n.+/gm, '')
    .replace(/\n/gm, '').trim()


  const factory = 'from title' //dom.getElementsByAttribute('itemprop', 'brand')[0].innerHTML

  const breadcrumbs = dom.getElementById('crumbs').getElementsByTagName('a')
  const category = breadcrumbs.map(i => i.innerHTML)
  const images = dom.getElementById('owl_detail').getElementsByTagName('a').map(img => {
    console.log(img.attributes)
    return img.attributes[1].value.replace('/zoom.php?img=','https://www.e-insportline.pl')
  })

  const price = dom.getElementsByClassName('detail_price_row')[0].getElementsByTagName('strong')[0].innerHTML

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
product('https://www.e-insportline.pl/35800/rekawice-motocyklowe-w-tec-supreme-evo/czarno-zielony').catch(error => {
  console.log(error)
  process.exit(1);
});
