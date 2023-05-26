// jshint esversion:10
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/gmDB")
    .then(() => {
        console.log("MongoDb1 connected");
    })
    .catch((error) => {
        console.log("MongoDb1 failed to connect: ", error);
    });

const LogInSchema = new mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    uname:{
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
    cid:{
        type: String,
        required: false
    },
});

const customer = new mongoose.model("customers", LogInSchema);

module.exports = customer;