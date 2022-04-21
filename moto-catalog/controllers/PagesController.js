
const knex = require("../knex");
// const fs = require('fs');
// const encryptor = require('simple-encryptor')('trolololo84746dupa');
// const ClientsModels = require('../../models/ClientsModel')
// const PlacesModels = require('../../models/travel/PlacesModel')
// const RoadsModels = require('../../models/travel/RoadsModel')
// const SeoCategoryModels = require('../../models/SEO/CategoryModel')
// const SeoFactoryModels = require('../../models/SEO/FactoryModel')
// const ImageServices = require('../../services/ServicesImage')
// const SendEmail = require('../../services/SendMail')
// const randomString = require('../../helper/RandomString')
// const slugConverter = require('../../helper/SlugConverter')
// const uuidv4 = require('uuid').v4;
// const Random = require('../../helper/RandomString')
// const MailTemplate = require('../../common/mailTemplate')
const images = `["/Images-Catalog/100-SportfRh1as-0.Jpg","/Images-Catalog/100-SportfRh1as-1.Jpg","/Images-Catalog/100-SportfRh1as-2.Jpg","/Images-Catalog/100-SportfRh1as-3.Jpg","/Images-Catalog/100-SportfRh1as-4.Jpg","/Images-Catalog/100-SportfRh1as-5.Jpg"]`
const moto = `{ "ModelId": "5364a588-774f-4a0e-A325-5f7df7528568", "Created_at": "2022-04-16T14:33:40.000Z", "Updated_at": null, "Name": "100 Sport", "Manufactory": "Ducati", "DetailsId": "75591e4f-Ee94-4624-8e32-B42103652fdd", "Custom": "../Model/Ducati/Ducati_100_Sport_58.Html", "Specs": [["Make Model", "Ducati 100 Sport"], ["Year", "1958 - 60"], ["Engine", "Four Stroke Single-Cylinder OHCshaft And Bevel Gears Exhaust Valve"], ["Capacity", "98 Cc / 6.0 Cu In"], ["Bore X Stroke", "49 X 52 Mm"], ["Compression Ratio", "9.0:1"], ["CoolingSystem", "Air Cooled "], ["Lubrication System", "Forced Oil Sump"], ["Induction", "Dell'Orto MA18B"], ["Ignition", "Battery Coil 6V 40W Generator"], ["Spark Plug", "Marelli CW260N"], ["Battery", "SAFA 3L3 13.5 Ah"], ["Starting", "Kick"], ["Max Power", "6 KW / 8 Hp @ 8000 Rpm"], ["Clutch", "Wet Multi-Plate"], ["Primary Drive Ratio", "3.00:1"], ["Transmission", "4 Speed"], ["Gear Ratios", "1st 2.75 / 2nd 1.65 / 3rd 1.18 / 4th 0.97:1"], ["FinalDrive", "Chain"], ["FinalDrive Ratio", "3.066:1"], ["Frame", "Single Tube Open Cradle Frame In Tubular Steel"], ["Front Suspension", "Hydraulically Damped Telescopic Forks Marzocci"], ["Rear Suspension", "Swingarm Dual Shocks 3-Way Adjustable"], ["Front Brakes", "Drum Amadori"], ["Rear Brakes", "Drum Amadori"], ["Front Tyre", "2.50 -17 CEAT"], ["Rear Tyre", "2.75 -17 CEAT"], ["Dimensions", "Length:1910 Mm / 72.2 InWidth: 580 Mm / 22.8 InTHeight: 920 Mm / 36.2 In"], ["Wheelbase", "1320 Mm / 52.0 In In"], ["Seat Height", "750 Mm / 29.5 In"], ["Dry Weight", "100 Kg / 220 Lbs"], ["Fuel Capacity", "17 L / 4.5 US Gal / 3.7 Imp Gal"]], "Description": "asd", "GalleryId": "1f8ca766-4178-463b-83d7-5aa1b978e553" }`
exports.home = async (req, res) => {
  const clientCount = await knex.from('Models').count()

  const factories = await knex.from('Manufactories').orderBy('name')
    .limit(20)
  const recent = await knex.from('Models').orderBy('name')
    .join('Details', { 'Models.detailsId': 'Details.detailsId' })
    .join('Gallery', { 'Details.galleryId': 'Gallery.galleryId' })
    .limit(9)
  const response = recent.map(item => ({ ...item, images: JSON.parse(item.images), years: JSON.parse(item.years) }))

  res.render('index', { count: clientCount[0]['count(*)'], factories: factories, recent: response }) //, { offersCount: offersCount[0]['count(*)'], clientCount: clientCount[0]['count(*)'], noWer: offersCountNoWer[0]['count(*)'], totalView: viewCount[0].total });
};
exports.motocykl = async (req, res) => {
  const moto = await knex.from('Models').where('name', req.params.slug)
    .join('Details', {'Models.detailsId': 'Details.detailsId'})
    .join('Gallery', {'Details.galleryId': 'Gallery.galleryId'})
    .first()

  res.render('motocykl', { moto:{ ...moto, specs: JSON.parse(moto.specs), images: JSON.parse(moto.images) }});
};
exports.search = async (req, res) => {

  const recent = await knex.from('Models').where('name', 'LIKE', `%${req.query.nazwa}%`
    ).orderBy('name')
    .join('Details', {'Models.detailsId': 'Details.detailsId'})
    .join('Gallery', {'Details.galleryId': 'Gallery.galleryId'})
    .limit(24)
  const response = recent.map(item => ({...item, images: JSON.parse(item.images), years: JSON.parse(item.years)}))

  res.render('wyszukaj', { recent: response }) //, { offersCount: offersCount[0]['count(*)'], clientCount: clientCount[0]['count(*)'], noWer: offersCountNoWer[0]['count(*)'], totalView: viewCount[0].total });
};
// exports.offers = async (req, res) => {
//   const offersKnex = knex.from('Offers')
//   .where('title', 'like', `%${req.query.name || ''}%`)
//   .select('Offers.id', 'Offers.title', 'Offers.created_at', 'Offers.price', 'Offers.category', 'Offers.favour',
//   'Offers.sellerId', 'Offers.typeOffer', 'Offers.location', 'Offers.sellerStatus', 'Offers.status',
//   'Offers.viewCount', 'Gallery.urlsLarges', 'Offers.slug')
//     .join('Gallery', {'Offers.galleryId': 'Gallery.id'})
//     .orderBy([{ column: req.query.sortBy || 'Offers.updated_at', order: req.query.sortBy === 'category' ? 'asc' : 'desc' }, { column: 'Offers.created_at', order: 'desc' }])
//     .limit(250)
//   if (req.query.offerType) {
//     offersKnex.andWhere('typeOffer', req.query.offerType)
//   }
//   if (req.query.weryfikacja) {
//     offersKnex.where('status', req.query.weryfikacja)
//   }
//   if (req.query.category) {
//     offersKnex.where('category','LIKE', req.query.category == 'undefined' ? '' : '%'+req.query.category+'%')
//   }
//   if (req.query.factory) {
//     offersKnex.where('factory', req.query.category == 'undefined' ? '' : req.query.factory)
//   }
//   if (req.query.sellerStatus) {
//     offersKnex.where('sellerStatus', req.query.sellerStatus == 'undefined' ? '' : req.query.sellerStatus)
//   }
//   if (req.query.pasujeDo) {
//     offersKnex.where('description', 'like', '%Pasuje do:%').andWhere('pasujeDo', null)
//   }
//   const offers = await offersKnex
//   offers.forEach(offer => {
//     offer.exist = 'no';
//     offer.galleryId = offer.urlsLarges.length > 10 ? JSON.parse(offer.urlsLarges)[0] : ''
//     offer.created_at = offer.created_at.toLocaleDateString()

//   })

//   res.render('pages/offers', { offers, urlApp: process.env.URL_FRONT });
// };
// exports.promote = async (req, res) => {

//   const offersKnex = knex.from('Offers').where('title', 'like', `%${req.query.name || ''}%`)
//   .select('Offers.id', 'Offers.title', 'Offers.created_at', 'Offers.price', 'Offers.category', 'Offers.favour',
//   'Offers.sellerId', 'Offers.typeOffer', 'Offers.location', 'Offers.sellerStatus', 'Offers.status', 'Offers.viewCount', 'Gallery.urlsLarges')
//     .join('Gallery', {'Offers.galleryId': 'Gallery.id'})
//     .orderBy([
//       { column: 'typeOffer', order: 'asc' },
//       { column: 'category', order: 'asc' },
//       { column: 'created_at', order: 'desc' }
//     ]).limit(250).andWhere('favour', 'promote')

//   const offers = await offersKnex
//   offers.forEach(offer => {
//     offer.exist = 'no';
//     offer.galleryId = offer.urlsLarges.length > 10 ? JSON.parse(offer.urlsLarges)[0] : ''
//     offer.created_at = offer.created_at.toLocaleDateString()

//   })
//   res.render('pages/promote', { offers, urlApp: process.env.URL_FRONT });
// };
// // action buttons
// exports.offersStatus = async (req, res) => {

//   await knex('Offers').where({ id: req.params.id }).update({ status: req.body.status })
//   res.render('pages/success')
// };

// exports.deleteOffer = async (req, res) => {
//   const offer = await knex('Offers').where({ id: req.params.id }).first()
//   await knex('Gallery').where({ id: offer.galleryId }).del()

//   await knex('Offers').where({ id: req.params.id }).del()
//   res.render('pages/success')
// };

// exports.sellerStatus = async (req, res) => {

//   await knex('Offers').where({ id: req.params.id }).update({ sellerStatus: req.body.sellerStatus })
//   res.render('pages/success')

// };

// exports.sendMailAccept = async (req, res) => {
//   const offer = await knex.from('Offers').select('Offers.sellerId', 'Clients.id', 'Offers.slug', 'Clients.email')
//     .leftJoin('Clients', function () {
//       this.on('Offers.sellerId', '=', 'Clients.id')
//     }).where('Offers.id', req.params.id)
//   const message = MailTemplate.approvedMail.message.replace(/:link_to_offer/mg, `https://www.moto-trade.pl/oferta/${offer[0].slug}`)
//   await SendEmail.sendCustomMail(MailTemplate.approvedMail.title, message, offer[0].email).catch(e => { console.error(e) })
//   res.render('pages/success')
// }


// exports.clients = async (req, res) => {

//   const clients = await knex.from('Clients').orderBy('created_at', 'desc').limit(250)
//   res.render('pages/clients', { clients, urlApp: process.env.APP_URL });
// };

// exports.clientDel = async (req, res) => {
//   await knex('Clients').where({ id: req.params.id }).del()
//   const offers = await knex('Offers').where({ sellerId: req.params.id }).select('Offers.galleryId')
//   await knex('Gallery').whereIn('id', offers.map(e => e.galleryId)).del()
//   await knex('Offers').where({ sellerId: req.params.id }).del()

//   res.render('pages/success')
// }

// exports.functions = async (req, res) => {
//   clientIds = [
//     '466f63b3-03a0-4541-843c-5deab9ce4403', // pp motocykle
//     '0c7532f7-9c76-4828-8c4c-ee1c7c3ebb50', //seko
//     'fd2003a5-e624-46ed-b43f-81be91f09101', // sokol
//     '88d0700f-6fc1-4d3e-8045-28273a01e6f5', // enduro
//     '103745e4-b3f6-4dae-968f-cbe99f24b01a', // willinger
//     'e0589cbf-6e62-49b3-a302-73b213547460', // lublin motocykle
//     'ce2f36c8-d07d-4ddc-b924-6ac61bef1021', // gazda bmw
//     'ce72cdc3-3e27-4a11-8bb3-7f0c237fa3b0', // Eororider katowice
//     'dfeda278-975b-4190-8f1f-525d03537052', // auto-max
//     'fd03f6bd-8879-4efd-bbdf-7b12d58230f4' // Moto-OSW

//   ]
//   const data = clientIds.map(clientId => fs.readFileSync('clients/' + clientId + '.txt', { encoding: 'utf8', flag: 'r' }));
//   const clients = data.map(item => ({
//     date: item.substring(0, 10),
//     status: /Finished!/i.test(item) ? 'Finished' : 'Procesing',
//   }))
//   res.render('pages/functions', {
//     clients
//   });
// };

// exports.reviews = async (req, res) => {
//   const reviewsData = await knex('Reviews')
//     .orderBy('created_at', 'desc').limit(100)
//   const fromClientsIds = [...new Set(reviewsData.map(item => { return item.fromClient }))];
//   const forClientsIds = [...new Set(reviewsData.map(item => { return item.forClient }))];

//   const forClients = await knex('Clients').select('Clients.id', 'Clients.name')
//     .whereIn('id', forClientsIds)
//   const fromClients = await knex('Clients').select('Clients.id', 'Clients.name')
//     .whereIn('id', fromClientsIds)

//   const reviews = reviewsData.map(item => {
//     return {
//       ...item,
//       forClient: forClients.find(e => e.id === item.forClient) || { name: 'NaN' },
//       fromClient: fromClients.find(e => e.id === item.fromClient) || { name: 'NaN' }
//     }
//   })
//   res.render('pages/reviews', { reviews });
// };

// exports.reviewsApprove = async (req, res) => {
//   await knex('Reviews').where({ id: req.params.id }).update({ status: 'approved' })
//   res.render('pages/success')
// };
// exports.reviewsDelete = async (req, res) => {
//   await knex('Reviews').where({ id: req.params.id }).del()

//   res.render('pages/success')
// };

// exports.clientOffers = async (req, res) => {
//   const data = fs.readFileSync('clients/' + req.params.id + '.txt', { encoding: 'utf8', flag: 'r' });
//   const offers = await knex.from('Offers')
//   .select('Offers.id', 'Offers.title', 'Offers.created_at', 'Offers.price', 'Offers.category', 'Offers.favour',
//   'Offers.sellerId', 'Offers.typeOffer', 'Offers.location', 'Offers.sellerStatus',
//   'Offers.status', 'Offers.viewCount', 'Gallery.urlsLarges', 'Offers.extId', 'Offers.slug')
//   .where('sellerId', req.params.id)
//     .join('Gallery', {'Offers.galleryId': 'Gallery.id'})
//     .orderBy(['sellerStatus', { column: 'Offers.created_at', order: 'desc' }])
//     .limit(500)
//   offers.forEach(offer => {
//     offer.exist = false;
//     offer.galleryId = offer.urlsLarges.length > 10 ? JSON.parse(offer.urlsLarges)[0] : ''
//     offer.created_at = offer.created_at.toLocaleDateString()
//     if (data.match(offer.extId)) {
//       offer.exist = true;
//     }
//   })
//   res.render('pages/client', {
//     offers,
//     urlApp: process.env.APP_URL,
//     date: data.substring(0, 10),
//     status: /Finished!/i.test(data) ? 'Finished' : 'Procesing',
//     clientId: req.params.id
//   });
// };

// exports.createClientPage = async (req, res) => {
//   res.render('create/createClient');
// };

// exports.getOffer = async (req, res) => {
//   const offer = await knex.from('Offers').where('id', req.params.id)

//   res.render('editPage/editOfferDesc', { baseUrl: process.env.URL_FRONT, offer: offer[0] });
// };
// exports.updateDescOffer = async (req, res) => {
//   await knex('Offers').where({ id: req.params.id }).update(
//     {
//       title: req.body.name,
//       description: req.body.description,
//       pasujeDo: req.body.pasujeDo,
//       category: req.body.category || null,
//       phone: req.body.phone,
//       capacity: req.body.capacity,
//       power: req.body.power,
//       factory: req.body.factory,
//       year: req.body.year
//     })

//   res.render('pages/success')
// }

// exports.updateFavourOffer = async (req, res) => {
//   await knex('Offers').where({ id: req.params.id }).update({ favour: req.body.favour || null })

//   res.render('pages/success')
// }

// exports.createClient = async (req, res) => {

//   const { name, email, pass, phone, localization, lat, lng } = req.body
//   const passEncrypt = encryptor.encrypt(pass)

//   const mailVeriff = Random(15);
//   const id = uuidv4().toString()
//   await ClientsModels.create({
//     id: id,
//     name: name,
//     email: email,
//     password: passEncrypt,
//     phone: phone,
//     lat: lat,
//     lng: lng,
//     localization: localization,
//     mailVeriff: mailVeriff,
//     accountType: 'create',
//   });
//   res.redirect('/admin/clients')
// };
// // konkurs
// exports.konkursList = async (req, res) => {
//   const list = await knex.from('Places')
//   res.render('pages/places', { items: list })
// }
// exports.konkursConfirm = async (req, res) => {
//   await knex('Konkurs').where({ id: req.params.id }).update('confirmation', 'true')
//   res.render('pages/success')
// }
// exports.konkursDelete = async (req, res) => {
//   await knex('Konkurs').where({ id: req.params.id }).del()
//   res.render('pages/success')

// }
// // Places
// exports.placesCreatePage = async (req, res) => {
//   res.render('create/createPlace');
// };

// exports.placesCreate = async (req, res) => {

//   const { title, type, lat, lng, city, description, images, userId, additionalInfo } = req.body

//   await PlacesModels.create({
//     id: uuidv4().toString(),
//     title: title,
//     type: type,
//     lat: lat,
//     lng: lng,
//     city: city,
//     description: description,
//     images: images,
//     userId: userId,
//     additionalInfo: additionalInfo,
//   });
//   res.redirect('/admin/places')
// };

// exports.placesList = async (req, res) => {
//   const list = await knex.from('Places')

//   const response = list.map(item => {
//     console.log(item.images)
//     return {
//       ...item,
//       images: JSON.parse(item.images)
//     }
//   })
//   res.render('pages/places', { items: response })
// }

// exports.roadsCreatePage = async (req, res) => {
//   res.render('create/createRoad');
// };

// exports.roadsCreate = async (req, res) => {

//   const { title, type, cities, countries, places, durationTime, durationLength, description, images, userId, additionalInfo } = req.body

//   await RoadsModels.create({
//     id: uuidv4().toString(),
//     title: title,
//     type: type,
//     cities: cities,
//     countries: countries,
//     places: places,
//     durationTime: durationTime,
//     durationLength: durationLength,
//     description: description,
//     images: images,
//     userId: userId,
//     additionalInfo: additionalInfo,
//   });
//   res.redirect('/admin/roads')
// };

// exports.roadsList = async (req, res) => {
//   const list = await knex.from('Roads')
//   res.render('pages/roads', { items: list })
// }

// // SEOCategory
// exports.SeoCategoryCreatePage = async (req, res) => {
//   res.render('create/createSeoCategory');
// };

// exports.SeoCategoryCreate = async (req, res) => {

//   const { category,
//     description,
//     head,
//     metaTitle,
//     metaDescription,
//     headImage
//   } = req.body
//   const imageFileHead = await ImageServices(headImage, `category-${slugConverter(category)}-${randomString(6)}`)
//     .catch(e => res.json('bad request image head'));

//   await SeoCategoryModels.create({
//     id: uuidv4().toString(),
//     category,
//     description,
//     head,
//     metaTitle,
//     metaDescription,
//     headImage: imageFileHead ? imageFileHead.original : '',
//   }).catch(e => res.json('bad request'));
//   res.redirect('/admin/seo-category')
// };

// exports.SeoCategoryList = async (req, res) => {
//   const list = await knex.from('SEOCategory').orderBy('category')

//   res.render('pages/seo-category', { items: list })
// }
// exports.SeoCategoryEditPage = async (req, res) => {
//   const items = await knex.from('SEOCategory').where('id', req.params.id)

//   res.render('editPage/editSeoCategory', { item: items[0] });
// };
// exports.SeoCategoryEdit = async (req, res) => {

//   const { category,
//     description,
//     head,
//     metaTitle,
//     metaDescription,
//     headImage
//   } = req.body
//   let imageFileHead = { original: headImage || '' }
//   if (/^http/.test(headImage)) {
//     imageFileHead = await ImageServices(headImage, `category-${slugConverter(category)}-${randomString(6)}`)
//       .catch(e => res.json('bad request image head'));
//   }


//   await SeoCategoryModels.update({
//     id: req.params.id,
//     category,
//     description,
//     head,
//     metaTitle,
//     metaDescription,
//     headImage: imageFileHead ? imageFileHead.original : '',
//   }).catch(e => res.json('bad request'));
//   res.redirect('/admin/seo-category')
// };
// // SEOFactory
// exports.SeoFactoryCreatePage = async (req, res) => {
//   res.render('create/createSeoFactory');
// };

// exports.SeoFactoryCreate = async (req, res) => {

//   const { factory, description, image, head } = req.body
//   const imageFile = await ImageServices(image, `factory-${slugConverter(factory)}-${randomString(6)}`)
//     .catch(e => res.json('bad request image'));

//   await SeoFactoryModels.create({
//     id: uuidv4().toString(),
//     factory,
//     description,
//     image: imageFile ? imageFile.original : '',
//     head
//   }).catch(e => res.json('bad request'));
//   res.redirect('/admin/seo-factory')
// };

// exports.SeoFactoryList = async (req, res) => {
//   const list = await knex.from('SEOFactory').orderBy('factory')

//   res.render('pages/seo-factory', { items: list })
// }
// exports.SeoFactoryEditPage = async (req, res) => {
//   const items = await knex.from('SEOFactory').where('id', req.params.id)

//   res.render('editPage/editSeoFactory', { item: items[0] });
// };
// exports.SeoFactoryEdit = async (req, res) => {
//   const { factory, description, image, head } = req.body
//   let imageFile = { original: image || '' }
//   if (/^http/.test(image)) {
//     imageFile = await ImageServices(image, `factory-${slugConverter(factory)}-${randomString(6)}`)
//       .catch(e => res.json('bad request image'));
//   }

//   await SeoFactoryModels.update({
//     id: req.params.id,
//     factory,
//     description,
//     image: imageFile ? imageFile.original : '',
//     head
//   }).catch(e => res.json('bad request'));
//   res.redirect('/admin/seo-factory')
// };
