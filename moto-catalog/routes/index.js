const express = require('express');
const router = express.Router();
// const multer = require('multer');

const PagesController = require('../controllers/PagesController');
// const MotoController = require('../controllers/MotoController');
// const OfferController = require('../controllers/OfferController')
// const ClientsController = require('../controllers/ClientsController')
// const ReviewController = require('../controllers/ReviewController')
// const CategoryController = require('../controllers/CategoryController')
// const MotorcycleController = require('../controllers/MotorcycleController')
// const ImageController = require('../controllers/ImageController');
// const ViewCountController = require('../controllers/ViewCountController');
// const ApplicationsController = require('../controllers/ApplicationsController');
// const VinController = require('../controllers/Vin.controller');

// const { midWare, midWareLong, midWareRefresh, offerRefresh, midWareLongBody, clientRefresh } = require('../middlewares/redis.middleware');
// const upload = multer();

router.get('/', PagesController.home);
router.get('/motocykl/:slug', PagesController.motocykl);
router.get('/wyszukaj', PagesController.search);

// inne
// router.get('/test', ApplicationsController.muziker)
// router.get('/test2', MotorcycleController.motorcycleList)

// // moto oferty
// router.get('/otoMoto/fetch', MotoController.updateOffers)
// router.get('/96moto/fetch', MotoController.update96motoOffers)
// router.get('/osw/fetch', MotoController.updateOswOffers)

// //categories
// router.get('/factory', midWareLong, CategoryController.factory)
// router.get('/categories', midWareLong, CategoryController.categories)
// router.get('/motorcycleList', MotorcycleController.motorcycleList)
// router.get('/footerData', midWareLong, CategoryController.footerData)
// router.get('/cities', midWareLong, CategoryController.cities)
// router.get('/factory/refresh', midWareRefresh, CategoryController.factory)
// router.get('/categories/refresh', midWareRefresh, CategoryController.categories)
// router.get('/motorcycleList/refresh', midWareRefresh, MotorcycleController.motorcycleList)
// router.get('/footerData/refresh', midWareRefresh, CategoryController.footerData)
// router.get('/cities/refresh', midWareRefresh, CategoryController.cities)

// // offers
// router.get('/offers', midWare, OfferController.getList)
// router.get('/offer/:slug', midWareLong, OfferController.getOne)
// router.get('/offeredit/:slug', OfferController.getOne)
// router.post('/offer', upload.any('files', 10), OfferController.create)
// router.patch('/offer/:id', upload.any('files', 10), offerRefresh, OfferController.update)
// router.post('/offer/:id/status',offerRefresh, OfferController.updateSellerStatus)
// router.get('/offers/recomendations', midWare, OfferController.recomendations)
// router.get('/offers/recomendations/refresh', midWareRefresh, OfferController.recomendations)

// router.get('/offers/simillar', midWare, OfferController.simillar)

// router.get('/offers/motorcycleOffers', OfferController.motorcycleOffers)
// router.get('/offers/image/:name', ImageController.getImage)

// // statistic
// router.get('/stat/offerView/:id', ViewCountController.addView)

// // clinets
// router.post('/client', midWareLongBody, ClientsController.getById)
// router.post('/client/createClientGoogle', ClientsController.createClientGoogle)
// router.post('/client/createClientFacebook', ClientsController.createClientFacebook)

// router.get('/client/phone/:id/:offerId', ClientsController.getPhone)
// router.get('/client/show/:id', midWareLong,  ClientsController.showClient)
// router.post('/createAccount', ClientsController.createAccount)
// router.post('/clientVerify', ClientsController.verifyMail)
// router.patch('/client/:id', clientRefresh, ClientsController.update)
// router.post('/clients/:id/avatar', clientRefresh, upload.any('files', 1), ClientsController.saveAvatar)

// // reviwes
// router.post('/review', ReviewController.create)
// router.get('/review/listFor', midWare, ReviewController.getListForClients)
// router.get('/review/listFrom', midWare, ReviewController.getListFromClients)
// router.delete('/review/:id', ReviewController.delete)

// // contact
// router.post('/sendemail', ClientsController.sendEmail)

// // decode Vin
// router.get('/decodeVin', VinController.decode)

// konkurs
// router.get('/konkurs/getList', KonkursController.getList)
// router.post('/konkurs/create', upload.any('files', 1), KonkursController.create)
// router.post('/konkurs/likeImage/:id', KonkursController.likeImage)
// router.post('/konkurs', KonkursController.sendEmail)

module.exports = router;
