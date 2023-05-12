const express = require("express");
const { requireSingIn, isAdmin } = require("../middlewares/authMiddleware");
const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFiltersController, productSerarchController, relatedproductController, productCategoryController, checkoutController, ordersController, getAllOrdersController, orderStatusUpdateController } = require("../controllers/productController");
// express-formidable used to image upload
const formidableMiddleware = require('express-formidable');


const router = express.Router();


// routes
router.post('/create-product', requireSingIn, isAdmin, formidableMiddleware(), createProductController)

// update product
router.put('/update-product/:pid', requireSingIn, isAdmin, formidableMiddleware(), updateProductController)

// get products
router.get('/products', getProductController)


// single products
router.get('/products/:slug', getSingleProductController)


// get photo
router.get('/product-photo/:pid', productPhotoController)

// delete product
router.delete('/delete-product/:pid',requireSingIn, isAdmin,  deleteProductController)

// filter product
router.post('/product-filters', productFiltersController)

// search product
router.get('/search/:keyword', productSerarchController)

// related product
router.get('/related-product/:pid/:cId', relatedproductController)

// category wise product
router.get('/product-category/:slug', productCategoryController)

// product checkout
router.post('/product-checkout', requireSingIn, checkoutController)

// get orders
router.get('/orders', requireSingIn, ordersController)

// get all orders
router.get('/all-orders', requireSingIn, isAdmin, getAllOrdersController)

// orders status update
router.put('/order-status-update/:orderId', requireSingIn, isAdmin, orderStatusUpdateController)


module.exports = router;