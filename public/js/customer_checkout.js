function getItems() {
    var temp = localStorage.getItem('new-product-cart');
    var obj = JSON.parse(temp);
    var sum = 0;
    console.log(obj);
    for (var i = 0; i < obj.length; i++) {
        var itemPrice = obj[i].price;
        var itemValue = obj[i].quantity;
        var itemTitle = obj[i].title;
        var itemSrc = obj[i].imageSrc;

        var cartRowContents = `
        <div class="row">
            <div class="col-4 get-product-item">
                <img class="itemPic" src="${itemSrc}" height="110px" alt="">
            </div>
            <div class="col-8 comm-sty"> 
                <div class="itemTitle">${itemTitle}</div>
                <div class="row">
                    <div class="col-6 itemQuantity">Quantity: ${itemValue}</div>
                    <div class="col-6 itemPrice">₹ ${itemPrice}/kg</div>
                </div>
            </div>
        </div>
        `;

        const container = document.getElementsByClassName('get-products-cart')[0];
        container.innerHTML += cartRowContents;

        var cartRowTotal = `
        <div class="row prod-tot">
            <div class="col-4 prod-tot-plus">+</div>
            <div class="col-8 prod-tot-val">₹ ${itemValue * itemPrice}</div>
        </div>
        `;

        const totalContainer = document.getElementsByClassName('get-product-total')[0];
        totalContainer.innerHTML += cartRowTotal;

        sum += itemValue * itemPrice;
    }
    var finalCont = `
    <hr>
    <div class="tot">₹ ${sum}</div>
    `;

    const contFinal = document.getElementsByClassName('get-product-total')[0];
    contFinal.innerHTML += finalCont;
}

getItems();

function expiry() {
    var monthDropdown = document.getElementById("expiry-month");
    for (var i = 1; i <= 12; i++) {
        var month = ("0" + i).slice(-2);
        var option = document.createElement("option");
        option.value = month;
        option.text = month;
        monthDropdown.appendChild(option);
    }

    var yearDropdown = document.getElementById("expiry-year");
    var currentYear = new Date().getFullYear();
    for (var i = currentYear; i <= currentYear + 10; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        yearDropdown.appendChild(option);
    }
}

expiry();

function initializePaymentOptions() {
    document.getElementById('ccdc').classList.add("active-btn");
    document.getElementById('cc').classList.remove("visually-hidden");

    document.getElementById('upiid').addEventListener('click', function () {
        togglePaymentOption(this, 'upi');
    });

    document.getElementById('nbing').addEventListener('click', function () {
        togglePaymentOption(this, 'nb');
    });

    document.getElementById('cod').addEventListener('click', function () {
        togglePaymentOption(this, 'cash');
    });

    document.getElementById('ccdc').addEventListener('click', function () {
        togglePaymentOption(this, 'cc');
    });
}

function togglePaymentOption(button, paymentOption) {
    document.querySelectorAll('.btn').forEach(function (el) {
        el.classList.remove('active-btn');
    });
    button.classList.add('active-btn');

    document.querySelectorAll('.payment-form').forEach(function (el) {
        if (el.id === paymentOption) {
            el.classList.remove('visually-hidden');
        } else {
            el.classList.add('visually-hidden');
        }
    });
}

function customerData() {
    axios.get("http://localhost:5252/custData").then(function (response) {
        var cust_name = response.data.details.fname;
        var pnumber = response.data.details.number;
        var email = response.data.details.mail;
        var address = response.data.details.address;
        document.getElementById('user-dets').innerHTML += `
            <div class="user-name">Name: ${cust_name}</div>
            <div class="phone-number">Contact: ${pnumber}</div>
            <div class="mail-id">Mail Address: ${email}</div>
            <div class="user-address">Address: ${address}</div>
            <div class="">Country: India</div>
        `;
        console.log(response.data.details.address)

    }).catch(error => console.log("error : ", error));
}
customerData();

initializePaymentOptions();


document.getElementById('back-shop').addEventListener('click', function () {
    localStorage.clear();
    window.location = "/customer/customer_html/ui.html";
});

document.getElementById('place-order').addEventListener('click', purchasedDB);

function purchasedDB() {
    var randOID = Math.floor((Math.random() * 10000) + 1);
    var oid = `
    <h1>Purchase Confirmed!</h1>
    <br>
    <h5>Your order id: #${randOID}</h5>
    `;
    const oFinal = document.getElementsByClassName('order-id')[0];
    oFinal.innerHTML = oid;

    const pushDB = JSON.parse(localStorage.getItem('new-product-cart'));
    var len = pushDB.length;
    const arrUp = [];
    for (var i = 0; i < len; i++) {
        var upData = {
            price: pushDB[i].price,
            title: pushDB[i].title,
            quantity: pushDB[i].quantity,
            prodID: pushDB[i].itemID
        }
        arrUp.push(upData);
    }
    axios.post('http://localhost:5252/finalOrder', {
        arr: arrUp,
        oID: randOID
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    localStorage.clear();
}


// document.getElementByClassName('user-name').innerHTML = `Name: ${cust_name}`;
//         document.getElementByClassName('phone-number').innerHTML = `Contact: ${pnumber}`;
//         document.getElementByClassName('mail-id').innerHTML = `Mail Address: ${email}`;
//         document.getElementByClassName('user-address').innerHTML = `Address: ${address}`;