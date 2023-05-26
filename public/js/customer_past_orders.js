function pastOrders() {
    axios.get("http://localhost:5252/kiranaPurchase").then(function (response) {
    var arr = response.data.arrB;
    var content = ``
    for(var i=0; i < arr.length; i++){
        var order_id = arr[i].oID.oID
        var total_price = arr[i].total_price
        content += `
        <div class="container">
            <div class="row">
                <div class="col-1 orderId">
                    # ${order_id}
                </div>
                <div class="col-8">
        `
        for(var j=0; j < arr[i].item.length; j++){
            var shop_name = arr[i].item[j].item_shop.sname
            var item_name = arr[i].item[j].item_name.item_name
            var item_image = arr[i].item[j].item_image.image.url
            var item_price = arr[i].item[j].item_price
            var item_quantity = arr[i].item[j].item_quantity
            var item_type = arr[i].item[j].item_type
            content+= `
                    <div class="row">
                    <div class="col-2 retailerName">
                        ${shop_name}
                    </div>
                    <div class="col-2" class="item-image-box">
                        <img src="${item_image}" class="item-image">
                    </div>
                    <div class="col-6">
                        <div class="row innerRow">
                            <div class="col-12 innerRow">
                                ${item_name}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6 innerRow">
                                Price: ₹ ${item_price}
                            </div>
                            <div class="col-6 innerRow">
                                Quantity: ${item_quantity}
                            </div>
                        </div>
                    </div>
                    <div class="col-2 itemTy">
                        ${item_type}
                    </div>
                </div>
            `
        }
        content += `
                </div>
                <div class="col-3">
                    ₹ ${total_price}
                </div>
            </div>
        </div>
        <hr>
        `
    }

    document.getElementById("past-cart").innerHTML += content;

    }).catch(error => console.log("error : ", error));
}
pastOrders();