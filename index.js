const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
var morgan = require('morgan');
var cors = require('cors')
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');




// middlewares
const app = express();
app.use(morgan('dev'));
app.use(cors());

// database Connected
connectDB()

// to read json 
app.use(express.json());



// rest api
app.get('/', (req, res) => {
  res.send('Server is runing..')
})


// all routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/category", categoryRoute)
app.use("/api/v1/product", productRoute)



const port = process.env.PORT || 8000
app.listen( port, () => {
  console.log(`server running on ${process.env.MODE} mode on port ${port}`)
})

