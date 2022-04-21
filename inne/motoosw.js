const axios = require('axios');
const DomParser = require('dom-parser');

async function links() {
  console.log('STARTARTA')

  const parser = new DomParser

  const { data: list } = await axios('https://www.motoosw.pl/motocykle/');
  const dom = parser.parseFromString(list)
  const pagcount = dom.getElementsByClassName('pages')[0].innerHTML;
  const condition = pagcount.match(/(\d+(?= z))|((?<=z )\d+)/g)
  // console.log(condition[0] === condition[1])

  const links = dom.getElementsByClassName('TZ-Vehicle-Grid').map(i => {
    // const ret = dostepnosc ? dostepnosc.textContent.trim() : null;
    return i.getElementsByClassName('Vehicle-Title')[0].getElementsByTagName('a')[0].attributes.find(i => i.name === 'href')
  })
  const products = [];
  // for (const link of links) {
  //   const getProduct = await product(link)
  //   products.push(getProduct)
  // }
  return products
}
async function product() {
  const parser = new DomParser

  const { data: page } = await axios('https://www.motoosw.pl/inventory/honda-cbr-125-r-10/');
  const dom = parser.parseFromString(page)
  const title = dom.getElementsByTagName('h1')[0].innerHTML.replace('&amp;', '&')

  const description = dom.getElementById('vehicle_overview').innerHTML.toString()
    // .replace('<p class="auto-translated-information-text"><i>To jest automatyczne tłumaczenie wygenerowane przez software:</i></p><p> Zapasowy olej przekładniowy 80W-90 GL-5, numer części 99000-22930-046, to oryginalna część Suzuki, co oznacza, że jest dokładnie taka sama, jak ta zamontowana fabrycznie, gdy pojazd był nowy </p>', '')
    // .replace(/<a.+(?=">)">/gm, '')
    // .replace(/<\/a>/gm, '')
    // .replace(/<button.*\n.+\n.+/gm, '')
  console.log(description)

  const images = dom.getElementById('carousel').getElementsByTagName('img').map(image => {
    const src = image.attributes.find(i => i.name === 'src')
    return src.value.replace('-300x200','')
  })
  console.log(images)

  const price = dom.getElementsByClassName('pcd-price')[0].textContent.replace('&nbsp;zł', '').replace(/ /gm, '')
  console.log(price)

  const specs = dom.getElementsByClassName('pcd-specs')
  console.log(specs[0].getElementsByTagName('span')[0].innerHTML, specs[1].innerHTML)

  const factory = specs[0].getElementsByTagName('span')[0].innerHTML.trim()
  const model = specs[1].getElementsByTagName('span')[0].innerHTML.trim()

  const year = specs[2].getElementsByTagName('span')[0].innerHTML.trim()

  const breadcrumbs = dom.getElementsByClassName('breadcrumbs')
  const category = breadcrumbs.map(i => i.innerHTML)
  // const status = dom.getElementsByClassName('shadow-box')[0]

  // category ? category.shift() : []

  const product = {
    title,
    description,
    price,
    factory,
    model,
    year,
    category,
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
