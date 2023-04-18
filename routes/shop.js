const express = require('express')
const path = require('path');
const router = express.Router()
const isAuth = require('../middleware/is-auth')
const shopController = require('../controllers/shop')

router.get('/', shopController.getIndex)
router.get('/products', shopController.getShop)
router.get('/products/:productID', shopController.getProduct);
router.post('/cart', isAuth, shopController.postCart);
router.get('/cart', isAuth, shopController.getCart)
router.post('/create-order', isAuth, shopController.postOrder)
router.post('/delete-item',isAuth, shopController.postDeleteItem)
router.get('/orders', isAuth, shopController.getOrders)

module.exports = router