// jshint esversion:10
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/gmDB")
    .then(() => {
        console.log("MongoDb4 connected");
    })
    .catch((error) => {
        console.log("MongoDb4 failed to connect: ", error);
    });

const KiranaRegSchema = new mongoose.Schema({
    cID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"customer",
        required: false
    },
    rID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"retailer",
        required: false
    }
});

const kirana = new mongoose.model("Kirana", KiranaRegSchema);

module.exports = kirana;