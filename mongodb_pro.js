// jshint esversion:10
const mongoose = require("mongoose");
const fs = require("fs");

mongoose.connect("mongodb://127.0.0.1/gmDB")
    .then(() => {
        console.log("MongoDb3 connected");
    })
    .catch((error) => {
        console.log("MongoDb3 failed to connect: ", error);
    });

const ItemAddSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        url: String,
        public_id: String
    },
    pID: {
        type: String,
        required: false
    },
    retailer: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"retailer",
        required: false
    }
});

const addItems = mongoose.model("addItems", ItemAddSchema);

module.exports = addItems;