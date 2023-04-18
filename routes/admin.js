const express = require('express')
const path = require('path');
const router = express.Router()
const isAuth = require('../middleware/is-auth')
const adminController = require('../controllers/admin')

router.get('/add-product', isAuth, adminController.getAddProduct)
router.get('/adminproduct-list', isAuth, adminController.getAdminProduct)
router.post('/add-product', isAuth, adminController.postAddProduct)
router.get('/edit-product/:productID', isAuth, adminController.getEditProduct)
router.post('/edit-product',isAuth, adminController.postEditProduct)
router.post('/delete-product', isAuth,adminController.postDeleteProduct)

module.exports = router;
