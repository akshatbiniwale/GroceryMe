let img = null

function showAlert(success) {
    if (success)
        alert('Item added successfully!');

}

function toggleDropdown() {
    var dropdown = document.querySelector(".dropdown");
    dropdown.classList.toggle("hidden");
}

document.getElementById("img").addEventListener("change", (e) => {
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
        img = reader.result
    }
})


document.getElementById("productform").addEventListener("submit", async (e) => {
    e.preventDefault()
    const productData = {
        item_name: document.getElementById("itemname").value,
        price: document.getElementById("price").value,
        desc: document.getElementById("product_desc").value,
        image: img
    }
    try {
        const { data } = await axios.post("http://localhost:5252/upload_item", productData, { headers: { "Content-Type": "multipart/form-data" } })
        showAlert(data.success)
        location.reload();
    } catch (err) {
        console.log(err.response)
    }
})

function customerRegDisplay() {
    axios.get("http://localhost:5252/kiranaDisplay").then(function (response) {
        var len = response.data.arr.length;
        for (var i = 0; i < len; i++) {
            var name = response.data.arr[i].fname;
            var contact = response.data.arr[i].number;
            var address = response.data.arr[i].address;
            var email = response.data.arr[i].mail;

            document.getElementById('table-body-kirana').innerHTML += `
                <tr>
                    <td class="column1">${name}</td>
                    <td class="column2">${contact}</td>
                    <td class="column3">${email}</td>
                    <td class="column4">${address}</td>
                </tr>
            `;
        }
    }).catch(error => console.log("error : ", error));
}
customerRegDisplay();

function uploadedDisplay() {
    axios.get("http://localhost:5252/itemDisplayRet").then(function (response) {
        var len = response.data.products.length;
        for (var i = 0; i < len; i++) {
            const item_name = response.data.products[i].item_name;
            const price = response.data.products[i].price;
            const desc = response.data.products[i].desc;
            const image = response.data.products[i].image.url;

            document.getElementById('table-body-items-uploaded').innerHTML += `
                <tr>
                    <td class="column1"><img class="image-uploaded" src=${image} height="2px"></td>
                    <td class="column2">${item_name}</td>
                    <td class="column3">₹${price}/kg</td>
                    <td class="column4">${desc}</td>
                </tr>
            `;
        }
    }).catch(error => console.log("error : ", error));
}
uploadedDisplay();

function uploadKiranaPurchase() {
    axios.get("http://localhost:5252/kiranaPurchase").then(function (response) {
        var len = response.data.finalBechaKirana.length;
        for (var i = 0; i < len; i++) {
            const cust_name = response.data.finalBechaKirana[i].customerName.fname;
            const item_name = response.data.finalBechaKirana[i].productPurchased.item_name;
            const quantity = response.data.finalBechaKirana[i].quantity;
            const total = response.data.finalBechaKirana[i].totalPrice;

            document.getElementById('table-body-kirana-purchase').innerHTML += `
                <tr>
                    <td class="column1">${cust_name}</td>
                    <td class="column2">${item_name}</td>
                    <td class="column3">${quantity}</td>
                    <td class="column4">₹${total}</td>
                </tr>
            `;
        }
    }).catch(error => console.log("error : ", error));
}

uploadKiranaPurchase();

function uploadNormalPurchase() {
    axios.get("http://localhost:5252/kiranaPurchase").then(function (response) {
        var len = response.data.finalBechaNormal.length;
        for (var i = 0; i < len; i++) {
            const cust_name = response.data.finalBechaNormal[i].customerName.fname;
            const item_name = response.data.finalBechaNormal[i].productPurchased.item_name;
            const quantity = response.data.finalBechaNormal[i].quantity;
            const total = response.data.finalBechaNormal[i].totalPrice;

            document.getElementById('table-body-normal-purchase').innerHTML += `
                <tr>
                    <td class="column1">${cust_name}</td>
                    <td class="column2">${item_name}</td>
                    <td class="column3">${quantity}</td>
                    <td class="column4">₹${total}</td>
                </tr>
            `;
        }
    }).catch(error => console.log("error : ", error));
}

uploadNormalPurchase();