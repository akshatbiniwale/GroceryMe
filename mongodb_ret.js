// jshint esversion:10
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/gmDB")
    .then(() => {
        console.log("MongoDb2 connected");
    })
    .catch((error) => {
        console.log("MongoDb2 failed to connect: ", error);
    });

const LogInSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    sname:{
        type: String,
        required: true
    },
    number:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    mail:{
        type: String,
        required: true
    },
    pass:{
        type: String,
        required: true
    },
    rid:{
        type: String,
        required: false
    }
});

const retailer = new mongoose.model("retailer", LogInSchema);

module.exports = retailer;