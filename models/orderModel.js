const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "products",
        required: true,
      },
    ],
    payment: {
        type: Number,
        required: true,
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: 'Not Process',
      enum: ['Not Process', 'Processing', 'Shipped', 'deliverd', 'cancel']
    },
    address: {
      type: String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
