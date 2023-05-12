const express = require("express");
const { requireSingIn, isAdmin } = require("../middlewares/authMiddleware");
const { cteateCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } = require("../controllers/categoryController");
const router = express.Router();


// create-category
router.post('/create-category', requireSingIn, isAdmin, cteateCategoryController)

// update category
router.put('/update-category/:id', requireSingIn, isAdmin, updateCategoryController)

// get all category
router.get('/get-categories', categoryController)

// get single category
router.get('/single-category/:slug', singleCategoryController)

// delete category
router.delete('/delete-category/:id', requireSingIn, isAdmin, deleteCategoryController)


module.exports = router;