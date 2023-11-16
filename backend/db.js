const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1/inotebook"

const connectToMongo = () =>{
    mongoose.connect(mongoURI)
    console.log("connect to Mongo successfully");
}

module.exports = connectToMongo;