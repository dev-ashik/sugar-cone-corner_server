const slugify = require('slugify')
const categoryModel = require("../models/categoryModel");


const cteateCategoryController = async (req, res) => {
    try {
        const {name} = req.body;
        console.log(name)
        if(!name) {
            return res.status(401).send({
                message: "name is required"
            })
        }
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory) {
            return res.status(401).send({
                message: "Category Already exisits"
            })
        }

        const category = await new categoryModel({name, slug:slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: "new category created.",
            category
        })

    } catch(error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Category",
            error
        })
    }
}

const updateCategoryController = async (req, res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new: true})
        res.status(200).send({
            success: true,
            message: "Category successfully updated",
            category
        })
    } catch (error) {   
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating category"
        })
    }
}


// get all categorys
const categoryController = async (req, res) => {
    try {
        const categorys = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All category list",
            categorys
        })
    } catch(error) {
        console.log(error);
        res.status(404).send({
            success: false,
            message: "Error while getting all categories",
            error
        })
    }
}


// get single categorys
const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({slug: req.params.slug});
        res.status(200).send({
            success: true,
            message: "successfully get single category",
            category
        })
    } catch(error) {
        console.log(error);
        res.status(404).send({
            success: false,
            message: "Error while getting single category",
            error
        })
    }
}

// delete category
const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "successfully deleted",
        })
    } catch(error) {
        console.log(error);
        res.status(404).send({
            success: false,
            message: "Error while deleteing category",
            error
        })
    }
}



module.exports = {cteateCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController };