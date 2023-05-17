const { default: slugify } = require("slugify");
const productModel = require("../models/productModel");
const fs = require("fs");
const categoryModel = require("../models/categoryModel");
const orderModel = require("../models/orderModel");
var jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "category is required" });
      case !photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is required and should be less then 1mb" });
    }
    const product = await new productModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(207).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

// get all products
const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      quantity: products.length,
      message: "All product",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// get single product
const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while geting single product",
      error,
    });
  }
};

// get photo
const productPhotoController = async (req, res) => {
    try {
        const product = await productModel
          .findById(req.params.pid).select("photo")
          if(product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
          }
       
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error while geting photo",
          error,
        });
      }
};


// delete product
const deleteProductController = async (req, res) => {
    try {
      const {pid} = req.params;
      await productModel.findByIdAndDelete(pid).select("-photo")
      res.status(200).send({
        success: true,
        message: "Product sucessfully deleted"
      }) 
       
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error while deleteing product",
          error,
        });
      }
};

// update product
const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "category is required" });
      case !photo?.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is required and should be less then 1mb" });
    }
    const {pid} = req.params;
    const product = await productModel.findByIdAndUpdate(pid, {
      ...req.fields, slug: slugify(name)
    }, {new: true})
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(207).send({
      success: true,
      message: "Product updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating product",
      error,
    });
  }
};


//
const productFiltersController = async (req, res) => {
  try{
    const {checked, priceRange} = req.body;
    let args = {}
    if(checked.length > 0) {
      args.category = checked;
    }
    if(priceRange.length) {
      args.price = {$gte: priceRange[0], $lte: priceRange[1]};
    }
    console.log(args)
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products
    })

  } catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while filtering product",
      error,
    });
  }
}

const productSerarchController = async (req, res) => {
  try{
    const { keyword } = req.params
    const result = await productModel.find({
      $or: [
        {name: {$regex: keyword, $options:"i"}},
        {description: {$regex: keyword, $options:"i"}}
      ]
    }).select("-photo")
    res.json(result);

  } catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while searching product",
      error,
    });
  }
}

const relatedproductController = async (req, res) => {
  try{
    const { pid, cId } = req.params;
    const products = await productModel.find({
      category: cId,
      _id: {$ne: pid}
    }).select("-photo").limit(3).populate("category")
    res.status(200).send({
      success: true,
      message: "product founded",
      products
    })

  } catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while finding related products",
      error,
    });
  }
}

const productCategoryController = async (req, res) => {
  try{
    const { slug } = req.params;
    const category = await categoryModel.findOne({slug})
    const products = await productModel.find({category}).populate('category')
    res.status(200).send({
      success: true,
      message: "products and category founded",
      category,
      products
    })

  } catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while geting product",
      error,
    });
  }
}

const checkoutController = async (req, res) => {
  
  // console.log(totalPrice, address, phone, token, products, auth);
  try{
    const { name, phone, address, totalPrice, token, products, auth} = req.body;

    // let totalPrice = 0
    // products.map(product => {
    //   totalPrice += product.price
    // })

    const decode = jwt.verify(
      auth.token,
      process.env.JWT_SECRET
    );
    const {_id} = decode

    let user = {...auth.user , _id}

    // req.user = decode;
    const order = new orderModel({
      name,
      products,
      phone,
      address,
      payment: totalPrice,
      buyer: user,
    }).save()

    res.status(200).send({
      success: true,
      message: "payment successful"

    })
  } catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "payment failed",
      error,
    });
  }
}


const ordersController = async (req, res) => {
  try{
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const {_id} = decode;

    const user = await userModel.findById(_id);
    const orders = await orderModel.find({buyer: user._id}).populate("products", "-photo");

    res.status(200).send({
      success: true,
      message: "order successful",
      orders
    })
  } catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while geting order",
      error,
    });
  }
}


const getAllOrdersController = async (req, res) => {
  try{
    const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({createdAt: "-1"});

    res.status(200).send({
      success: true,
      message: "all orders",
      orders
    })
  } catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while geting all orders",
      error,
    });
  }
}

const orderStatusUpdateController = async (req, res) => {
  try{
    const {orderId} = req.params;
    const {status} = req.body;

    const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new: true})

    res.status(200).send({
      success: true,
      message: "order status have been changed",
    })
  } catch(error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while changeing status",
      error,
    });
  }
}








module.exports = {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  productSerarchController,
  relatedproductController,
  productCategoryController,
  checkoutController,
  ordersController,
  getAllOrdersController,
  orderStatusUpdateController
};
