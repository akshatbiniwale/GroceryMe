// jshint esversion:10
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/gmDB")
    .then(() => {
        console.log("MongoDb4 connected");
    })
    .catch((error) => {
        console.log("MongoDb4 failed to connect: ", error);
    });

const orderSchema = new mongoose.Schema({
    oID:{
        type:Number,
        required: false
    },
    cID:{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    rID:{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    pID:[{
        type: Object,
        required: false 
    }],
    payStatus:{
        type: Boolean,
        required: false
    }
});

const order = new mongoose.model("orders", orderSchema);

module.exports = order;