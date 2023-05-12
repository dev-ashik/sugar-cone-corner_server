const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MOMGODB_URL)
        console.log(`Connected To Mongodb Database ${connect.connection.host}`); 
    } catch(error) {
        console.log(`Error in Mongodb ${error}`)
    }
}

module.exports = connectDB;