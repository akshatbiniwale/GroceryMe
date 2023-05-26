function showSuccessAlert() {
    const trueKirana = new URLSearchParams(window.location.search);
    if (trueKirana.get('success') === 'true') {
        alert('Registered Successfully');
        location.replace("http://localhost:5252/customer/customer_html/ui.html#shops-around");
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    var addToCartButtons = document.getElementsByClassName('btn-primary');
    for (var i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].addEventListener("click", addToCartClicked);
    }
    var removeCartItemButtons = document.getElementsByClassName('delete-btn');
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        removeCartItemButtons[i].addEventListener("click", removeCartItem);
    }
    document.getElementById('proceed-checkout').addEventListener('click', sendItems);
}

function removeCartItem(event) {
    console.log(this.event + " was clicked for delete.");
    var buttonClicked = event.target;
    buttonClicked.closest('.new-product-cart').remove();
    updateCartTotal();
}

function addToCartClicked(event) {
    console.log(this.event + " was clicked for add.");
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('card-title')[0].innerText;
    var price = shopItem.getElementsByClassName('price-item')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('card-img-top')[0].src;
    var prodID = shopItem.getElementsByClassName('hide-prodID')[0].innerHTML;

    addItemToCart(title, price, imageSrc, prodID, event);
}

function addItemToCart(title, price, imageSrc, prodID, event) {
    var cartItemNames = document.getElementsByClassName('cart-item-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            var button = event.target;
            button.innerHTML = "Already added";
            setTimeout(function (event) {
                button.innerHTML = "Add to cart";
            }, 1000);
            return;
        }
    }

    var cartRowContents = `
    <div class="new-product-cart">
        <div class="row row-cart cart-item-title">
        <p>${title}</p>
        <p class="hidden cart-hide-productID">${prodID}</p>
        </div>
        <div class="row row-cart each-item">
            <div class="col-4 car-item-style">
                <img class="cart-item-image" src="${imageSrc}" width="70px" height="70px">
            </div>
            <div class="col-8">
                <div class="row row-cart">
                    <p>₹<span class="cart-price">${price}</span>/kg</p>
                </div>
                <div class="row row-cart">
                    <div class="col-6">
                        <input class="cart-quantity-input" type="number" value="1" min="1">
                    </div>
                    <div class="col-6">
                        <button class="btn delete-btn"><i class="fa fa-trash btn-sm"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    const container = document.getElementById('item-container');
    container.innerHTML += cartRowContents;
    console.log("Item added!");

    ready();

    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (var i = 0; i < quantityInputs.length; i++) {
        quantityInputs[i].addEventListener('change', updateCartTotal);
    }
    updateCartTotal();
}


function updateCartTotal() {
    ready();
    var cartItems = document.getElementsByClassName('new-product-cart');
    if (cartItems.length !== 0) {
        var totalCart = 0;
        for (var i = 0; i < cartItems.length; i++) {
            var itemPrice = cartItems[i].getElementsByClassName('cart-price')[0];
            var itemValue = cartItems[i].getElementsByClassName('cart-quantity-input')[0];
            totalCart += parseInt(itemPrice.innerHTML.trim()) * parseInt(itemValue.value);
        }
        document.getElementsByClassName('cart-total-price')[0].innerHTML = '₹' + totalCart;
    }
    if (cartItems.length === 0) {
        document.getElementsByClassName('cart-total-price')[0].innerHTML = '₹ 0';
    }
}

function sendItems() {
    ready();
    var cart = [];
    var cartItems = document.getElementsByClassName('new-product-cart');
    for (var i = 0; i < cartItems.length; i++) {
        var itemPrice = cartItems[i].getElementsByClassName('cart-price')[0].innerText;
        var itemValue = cartItems[i].getElementsByClassName('cart-quantity-input')[0].value;
        var itemTitle = cartItems[i].getElementsByClassName('cart-item-title')[0].innerText;
        var itemSrc = cartItems[i].getElementsByClassName('cart-item-image')[0].src;
        var itemID = cartItems[i].getElementsByClassName('cart-hide-productID')[0].innerText;
        var itemDetails = {
            title: itemTitle,
            price: itemPrice,
            imageSrc: itemSrc,
            quantity: itemValue,
            itemID: itemID
        };
        cart.push(itemDetails);
    }
    localStorage.setItem('new-product-cart', JSON.stringify(cart));
}

function toggleDropdown() {
    var dropdown = document.querySelector(".dropdown");
    dropdown.classList.toggle("hidden");
}

var nameProd;

$("#cartout").click(function () {
    $(".rt").toggleClass("col-2");
    $(".rt").toggleClass("hidden");
    $(".lf").toggleClass("col-10");
    $(".lf").toggleClass("col-12");
});

var temp_pID;

function itemNewDisplay() {
    axios.get("http://localhost:5252/itemDisplay").then(function (response) {
        var len = response.data.products.length;
        for (var i = 0; i < len; i++) {
            const item_name = response.data.products[i].item_name;
            const price = response.data.products[i].price;
            const desc = response.data.products[i].desc;
            const image = response.data.products[i].image.url;
            const shopName = response.data.products[i].retailer.sname;
            const pID = response.data.products[i]._id;

            document.getElementById('shops-around').innerHTML += `
                <div class="card col-2 addCard">
                    <img src=${image} class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title addItemName">${item_name}</h5>
                        <p class="addItemShopName">${shopName}</p>
                        <p class="card-text addItemPrice">₹<span class="price-item">${price}</span>/kg</p>
                        <p class="card-desc">${desc}</p>
                        <button href="#" class="btn btn-primary" id="btn1">Add to Cart</button>
                        <form action="/kirana-reg?sname=${shopName}" method="post">
                            <button href="#" class="btn btn-primary kirana-btn">Kirana Register</button>
                        </form>
                        <p class="hidden hide-prodId">${pID}</p>
                    </div>
                </div>
            `;
        }
        ready();
        showSuccessAlert();
    }).catch(error => console.log("error : ", error));
}

// function customerDetailsDisplay(){
//     axios.get("http://localhost:5252/customerDetailsDisplay").then(function(response){
//         var len = response.data. ;
//     })
// }