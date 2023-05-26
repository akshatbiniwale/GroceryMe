const express = require("express");
const bodyParser = require("body-parser");
const requestModule = require("request");
const https = require("https");
const mysql = require("mysql");
const path = require("path");
const hbs = require("hbs");
const templatePath = path.join(__dirname, '../templates');
const customer = require("./mongodb_cus");
const token = require("random-web-token");
const app = express();
const retailer = require("./mongodb_ret");
const product = require("./mongodb_pro");
const multer = require('multer');
const apiKey = require("./apiKeys")
const cookieParser = require("cookie-parser");
const kirana = require("./mongodb_kirana");
const orderDet = require("./mongodb_order");
const { types } = require("util");

const upload = multer();

var cID = token.genSync("extra", 8);
var pID = token.genSync("extra", 9);
var rID = token.genSync("extra", 6);

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/customer/customer_html", function (req, res) {
    res.sendFile(__dirname + "/customer/customer_html/login.html");
});

app.get("/retailer/retailer_html", function (req, res) {
    res.sendFile(__dirname + "/retailer/retailer_html/login.html");
});

app.get("/customer/customer_html/register.html", function (req, res) {
    res.sendFile(__dirname + "/customer/customer_html/register.html");
});

app.get("/retailer/retailer_html/register.html", function (req, res) {
    res.sendFile(__dirname + "/retailer/retailer_html/register.html");
});

app.get("/customer/customer_html/checkout.html", function (req, res) {
    res.sendFile(__dirname + "/customer/customer_html/checkout.html");
});

app.get("/customer/customer_html/ui.html", function (req, res) {
    res.sendFile(__dirname + "/customer/customer_html/ui.html");
});

app.get("/retailer/retailer_html/ui.html", function (req, res) {
    res.sendFile(__dirname + "/retailer/retailer_html/ui.html");
});

app.get("/customer/customer_html/orders.html", function (req, res) {
    res.sendFile(__dirname + "/customer/customer_html/orders.html");
});

app.get("/customer/customer_html/profile.html", function (req, res) {
    res.sendFile(__dirname + "/customer/customer_html/profile.html");
});

// Customer Mongo Connect

app.post("/customer_login", async function (req, res) {
    try {
        const check = await customer.findOne({ mail: req.body.input_mail });
        const temp_cID = await customer.findOne({ mail: req.body.input_mail });
        if (check.pass === req.body.input_pass) {
            res.cookie("customerId", temp_cID._id).sendFile(__dirname + "/customer/customer_html/ui.html");
        }
        else {
            res.redirect('/customer/customer_html?success=false');
        }
    }
    catch {
        console.log("Invalid Credentials");
    }
});

app.post("/customer_register", async function (req, res) {
    const data = {
        fname: req.body.input_name,
        uname: req.body.input_username,
        number: req.body.input_number,
        address: req.body.input_address,
        mail: req.body.input_mail,
        pass: req.body.input_pass,
        cid: cID
    };

    await customer.insertMany([data]);

    res.sendFile(__dirname + "/customer/customer_html/login.html");
});

// Retailer Mongo Connect

app.post("/retailer_register", async function (req, res) {
    const dataRet = {
        fname: req.body.input_name,
        sname: req.body.input_shopname,
        number: req.body.input_number,
        address: req.body.input_address,
        mail: req.body.input_mail,
        pass: req.body.input_pass,
        rid: rID
    };

    await retailer.insertMany([dataRet]);

    res.sendFile(__dirname + "/retailer/retailer_html/login.html");
});

app.post("/retailer_login", async function (req, res) {
    try {
        const check = await retailer.findOne({ mail: req.body.input_mail });
        if (check.pass === req.body.input_pass) {
            const temp_rID = await retailer.findOne({ mail: req.body.input_mail });
            res.cookie("retailerId", temp_rID._id).sendFile(__dirname + "/retailer/retailer_html/ui.html");
        }
        else {
            res.redirect('/retailer/retailer_html?success=false');
        }
    }
    catch {
        console.log("Invalid Credentials");
    }
});

// Retailer Side Product Upload
app.post("/upload_item", upload.single('img'), async function (req, res) {
    const { retailerId } = req.cookies;
    const response = await apiKey.uploader.upload(req.body.image, { folder: "additems" })
    const dataPro = {
        item_name: req.body.item_name,
        price: req.body.price,
        desc: req.body.desc,
        image: {
            url: response.secure_url,
            public_id: response.public_id
        },
        pID: pID,
        retailer: retailerId
    };

    await product.insertMany([dataPro]);

    res.status(200).json({
        success: true
    })
});

//fetching data for customer
app.get("/itemDisplay", async (req, res) => {
    const products = await product.find().populate("retailer");
    res.status(200).json({ success: true, products: products });
});

//fetching data for retailer
app.get("/kiranaDisplay", async (req, res) => {
    const { retailerId } = req.cookies;
    const kiranas = await kirana.find({ rID: retailerId }, { cID: 1, _id: 0 });
    const arr = [];
    for (var i = 0; i < kiranas.length; i++) {
        arr.push(await customer.findOne({ _id: kiranas[i].cID }, { fname: 1, mail: 1, number: 1, address: 1, _id: 0 }));
    }
    res.status(200).json({ success: true, arr });
});

app.get("/itemDisplayRet", async (req, res) => {
    const { retailerId } = req.cookies;
    const products = await product.find({ retailer: retailerId });
    res.status(200).json({ success: true, products: products });
});

app.post("/kirana-reg", async (req, res) => {
    const { customerId } = req.cookies;
    const { sname } = req.query;
    const retailerID = await retailer.findOne({ sname: sname }, { _id: 1, rid: 0 });
    const dataKirana = {
        cID: customerId,
        rID: retailerID
    }
    await kirana.insertMany([dataKirana]);
    res.redirect('/customer/customer_html/ui.html?success=true');
});

app.post("/finalOrder", async (req, res) => {
    const { customerId } = req.cookies;
    const { arr, oID } = req.body;
    const orderData = {
        oID: oID,
        cID: customerId,
        pID: arr
    };
    await orderDet.insertMany([orderData]);
});

app.get("/kiranaPurchase", async (req, res) => {
    const { retailerId } = req.cookies;
    const { customerId } = req.cookies;
    const kiranaPurchased = await orderDet.find();

    const arrKirPurCust = [];
    var arrKirPur = [];
    var prodQ = [];
    for (var i = 0; i < await kiranaPurchased.length; i++) {
        for (var j = 0; j < await kiranaPurchased[i].pID.length; j++) {
            arrKirPur.push(kiranaPurchased[i].pID[j].prodID);
            prodQ.push(kiranaPurchased[i].pID[j].quantity)
        }
        const dataPurchase = {
            custID: kiranaPurchased[i].cID,
            prodIDs: arrKirPur,
            prodQ: prodQ
        }
        arrKirPurCust.push(dataPurchase);
        arrKirPur = [];
        prodQ = [];
    }

    const retNeBecheProdID = await product.find({ retailer: retailerId }, { _id: 1 })

    const mereCust = [];
    for (var i = 0; i < retNeBecheProdID.length; i++) {
        for (var j = 0; j < await kiranaPurchased.length; j++) {
            for (var k = 0; k < await kiranaPurchased[j].pID.length; k++) {
                if (retNeBecheProdID[i]._id == arrKirPurCust[j].prodIDs[k]) {
                    const data = {
                        customerID: arrKirPurCust[j].custID,
                        productID: retNeBecheProdID[i]._id,
                        productQuantity: arrKirPurCust[j].prodQ[k]
                    }
                    mereCust.push(data)
                }
            }
        }
    }

    const mereCustKirana = [];
    const mereCustNormal = [];

    for (var i = 0; i < retNeBecheProdID.length; i++) {
        for (var j = 0; j < await kiranaPurchased.length; j++) {
            for (var k = 0; k < await kiranaPurchased[j].pID.length; k++) {
                if (retNeBecheProdID[i]._id == arrKirPurCust[j].prodIDs[k]) {
                    const data = {
                        customerID: arrKirPurCust[j].custID,
                        productID: retNeBecheProdID[i]._id,
                        productQuantity: arrKirPurCust[j].prodQ[k]
                    }
                    if (await kirana.findOne({ cID: arrKirPurCust[j].custID, rID: retailerId }) != null) {
                        mereCustKirana.push(data);
                    }
                    else {
                        mereCustNormal.push(data);
                    }
                }
            }
        }
    }

    const finalBechaKirana = [];
    for (var i = 0; i < mereCustKirana.length; i++) {
        var priceOfItem = await product.findOne({ _id: mereCustKirana[i].productID }, { price: 1, _id: 0 });
        var cost = priceOfItem.price;
        {
            $toInt: cost
        }
        var quantityOfItem = mereCustKirana[i].productQuantity;
        var totalPrice = cost * quantityOfItem;

        const data = {
            customerName: await customer.findOne({ _id: mereCustKirana[i].customerID }, { fname: 1, _id: 0 }),
            productPurchased: await product.findOne({ _id: mereCustKirana[i].productID }, { item_name: 1, _id: 0 }),
            quantity: mereCustKirana[i].productQuantity,
            totalPrice: totalPrice
        }
        finalBechaKirana.push(data);
    }

    const finalBechaNormal = [];
    for (var i = 0; i < mereCustNormal.length; i++) {
        var priceOfItem = await product.findOne({ _id: mereCustNormal[i].productID }, { price: 1, _id: 0 });
        var cost = priceOfItem.price;
        {
            $toInt: cost
        }
        var quantityOfItem = Number(mereCustNormal[i].productQuantity);
        var totalPrice = cost * quantityOfItem;

        const data = {
            customerName: await customer.findOne({ _id: mereCustNormal[i].customerID }, { fname: 1, _id: 0 }),
            productPurchased: await product.findOne({ _id: mereCustNormal[i].productID }, { item_name: 1, _id: 0 }),
            quantity: Number(mereCustNormal[i].productQuantity),
            totalPrice: totalPrice
        }
        finalBechaNormal.push(data);
    }

    const mereOrdersRet = [];
    for (var i = 0; i < arrKirPurCust.length; i++) {
        if (arrKirPurCust[i].custID == customerId) {
            var len = arrKirPurCust[i].prodIDs.length;
            for (var j = 0; j < len; j++) {
                const prodRetId = await product.findOne({ _id: arrKirPurCust[i].prodIDs[j] }, { retailer: 1, _id: 0 });
                mereOrdersRet.push(prodRetId);
            }
        }
    }

    var flagRetArray = [];

    const checkKir = await kirana.find({cID: customerId}, {rID: 1, _id:0})
    for(var j=0; j<mereOrdersRet.length; j++){
        for(var i=0; i<checkKir.length; i++){
            if(checkKir[i].rID.toString() == mereOrdersRet[j].retailer.toString()){
                flagRetArray.push(1);
                j++;
                break;
            }
        }
        flagRetArray.push(0);
    }  

    const mereOrdersID = await orderDet.find({ cID: customerId }, { oID: 1, _id: 0 });
    var myFlagKirana = 0;
    var sumCost = 0;

    var arrA = [], arrB = [];
    for (var i = 0; i < arrKirPurCust.length; i++) {
        if (arrKirPurCust[i].custID == customerId) {
            var len = arrKirPurCust[i].prodIDs.length;
            for (var j = 0; j < len; j++) {
                var val = await product.findOne({ _id: arrKirPurCust[i].prodIDs[j] }, { retailer: 1, _id: 0 })
                var priItem = await product.findOne({ _id: arrKirPurCust[i].prodIDs[j] }, { price: 1, _id: 0 });
                priItem = priItem.price;
                var priQ = Number(arrKirPurCust[i].prodQ[j]);
                if(flagRetArray[i+j] == 1){
                    myFlagKirana = "Kirana";
                }else{
                    myFlagKirana = "Normal"
                }
                const data = {
                    item_name: await product.findOne({ _id: arrKirPurCust[i].prodIDs[j] }, { item_name: 1, _id: 0 }),
                    item_price: priItem,
                    item_image: await product.findOne({ _id: arrKirPurCust[i].prodIDs[j] }, { image: 1, _id: 0 }),
                    item_quantity: priQ,
                    item_shop: await retailer.findOne({_id: val.retailer}, {_id: 0, sname: 1}),
                    item_type: myFlagKirana
                }
                arrA.push(data);
                sumCost = sumCost + priItem*priQ;
            }
        }
        myFunction(arrA, mereOrdersID[i], sumCost);
        sumCost = 0;
        arrA = [];
    }

    function myFunction(arr, key, pri){
        const orderDetailsObj = {
            oID: key,
            item: arr,
            total_price: pri
        }
        arrB.push(orderDetailsObj);
    }

    res.status(200).json({ success: true, mereCustNormal: mereCustNormal, finalBechaKirana: finalBechaKirana, finalBechaNormal: finalBechaNormal, arrKirPurCust: arrKirPurCust, arrB: arrB });
});

app.get("/custData", async (req, res) => {
    const { customerId } = req.cookies;
    const details = await customer.findOne({ _id: customerId });
    res.status(200).json({ success: true, details: details });
});

app.listen(5252, function () {
    console.log("This server is live on port 5252");
});