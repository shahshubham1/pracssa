/* ===================================
   SHYAM CREATION
   MAIN SCRIPT
=================================== */

let products = [];

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

/* ===================================
   ELEMENTS
=================================== */

const productContainer =
document.getElementById("product-container");

const searchInput =
document.getElementById("searchInput");

const sortSelect =
document.getElementById("sortSelect");

const cartCount =
document.getElementById("cart-count");

const wishlistCount =
document.getElementById("wishlist-count");

/* ===================================
   COUNTERS
=================================== */

function updateCounters() {

    let totalQty = 0;

    cart.forEach(item => {
        totalQty += item.qty;
    });

    if(cartCount){
        cartCount.textContent = totalQty;
    }

    if(wishlistCount){
        wishlistCount.textContent =
        wishlist.length;
    }
}

/* ===================================
   LOAD PRODUCTS
=================================== */

async function loadProducts(){

    try{

        const response =
        await fetch("data/products.json");

        products =
        await response.json();

        displayProducts(products);

    }catch(error){

        console.error(error);

        productContainer.innerHTML = `
        <h3 style="
        text-align:center;
        color:red;
        ">
        Failed to load products
        </h3>
        `;
    }

}

/* ===================================
   DISPLAY PRODUCTS
=================================== */

function displayProducts(productList){

    productContainer.innerHTML = "";

    if(productList.length === 0){

        productContainer.innerHTML = `
        <h3 style="
        text-align:center;
        ">
        No products found
        </h3>
        `;

        return;
    }

    productList.forEach(product => {

        const inWishlist =
        wishlist.some(
            item => item.id === product.id
        );

        const card =
        document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <button
            class="wishlist-btn"
            data-id="${product.id}">
            ${inWishlist ? "❤️" : "🤍"}
            </button>

            <img
            src="${product.image}"
            alt="${product.name}"
            onerror="this.src='images/no-image.jpg'">

            <div class="card-content">

                <span class="category">
                ${product.category}
                </span>

                <h3>
                ${product.name}
                </h3>

                <p>
                ${product.description}
                </p>

                <div class="price">
                ₹${product.price}
                </div>

                <div class="card-actions">

                    <button
                    class="add-cart">
                    Add To Cart
                    </button>

                    <button
                    class="quick-view">
                    View
                    </button>

                </div>

            </div>
        `;

        /* CART */

        card
        .querySelector(".add-cart")
        .addEventListener("click", () => {

            addToCart(product);

        });

        /* MODAL */

        card
        .querySelector(".quick-view")
        .addEventListener("click", () => {

            openProductModal(product);

        });

        /* WISHLIST */

        card
        .querySelector(".wishlist-btn")
        .addEventListener("click", () => {

            toggleWishlist(product);

        });

        productContainer.appendChild(card);

    });

}

/* ===================================
   CART
=================================== */

function addToCart(product){

    const existing =
    cart.find(
        item => item.id === product.id
    );

    if(existing){

        existing.qty++;

    }else{

        cart.push({

            ...product,

            qty:1

        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCounters();

    alert(
        product.name +
        " added to cart"
    );

}

/* ===================================
   WISHLIST
=================================== */

function toggleWishlist(product){

    const index =
    wishlist.findIndex(
        item => item.id === product.id
    );

    if(index > -1){

        wishlist.splice(index,1);

    }else{

        wishlist.push(product);

    }

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    updateCounters();

    displayProducts(products);

}

/* ===================================
   SEARCH
=================================== */

if(searchInput){

searchInput.addEventListener(
"input",
() => {

    const value =
    searchInput.value.toLowerCase();

    const filtered =
    products.filter(product =>

        product.name
        .toLowerCase()
        .includes(value)

        ||

        product.category
        .toLowerCase()
        .includes(value)

        ||

        product.description
        .toLowerCase()
        .includes(value)

    );

    displayProducts(filtered);

});

}

/* ===================================
   FILTERS
=================================== */

document
.querySelectorAll(".filter-btn")
.forEach(button => {

button.addEventListener(
"click",
() => {

document
.querySelectorAll(".filter-btn")
.forEach(btn => {

btn.classList.remove(
"active"
);

});

button.classList.add(
"active"
);

const category =
button.textContent.trim();

if(category === "All"){

displayProducts(products);

}else{

const filtered =
products.filter(product =>

product.category === category

);

displayProducts(filtered);

}

});

});

/* ===================================
   SORT
=================================== */

if(sortSelect){

sortSelect.addEventListener(
"change",
() => {

const value =
sortSelect.value;

let sorted =
[...products];

if(value === "low"){

sorted.sort(
(a,b)=>
a.price-b.price
);

}

if(value === "high"){

sorted.sort(
(a,b)=>
b.price-a.price
);

}

if(value === "name"){

sorted.sort(
(a,b)=>
a.name.localeCompare(
b.name
)
);

}

displayProducts(sorted);

});

}

/* ===================================
   PRODUCT MODAL
=================================== */

function openProductModal(product){

const modal =
document.getElementById(
"productModal"
);

const body =
document.getElementById(
"modalBody"
);

if(!modal || !body){
return;
}

body.innerHTML = `

<img
src="${product.image}"
style="
width:100%;
max-height:400px;
object-fit:cover;
border-radius:10px;
">

<h2 style="
margin-top:15px;
">
${product.name}
</h2>

<p style="
margin:10px 0;
">
${product.description}
</p>

<div class="price">
₹${product.price}
</div>

<button
id="modalCartBtn"
class="add-cart"
style="
width:100%;
margin-top:10px;
">
Add To Cart
</button>

`;

modal.style.display =
"block";

document
.getElementById(
"modalCartBtn"
)
.addEventListener(
"click",
() => {

addToCart(product);

}
);

}

/* CLOSE MODAL */

const closeModal =
document.getElementById(
"closeModal"
);

if(closeModal){

closeModal.addEventListener(
"click",
() => {

document.getElementById(
"productModal"
).style.display = "none";

});

}

window.addEventListener(
"click",
(event)=>{

const modal =
document.getElementById(
"productModal"
);

if(event.target === modal){

modal.style.display =
"none";

}

});

/* ===================================
   PROFILE
=================================== */

function setupProfile(){

const profileBox =
document.getElementById(
"profile-box"
);

if(!profileBox){
return;
}

const user =
JSON.parse(
localStorage.getItem(
"currentUser"
)
);

if(!user){

profileBox.innerHTML = `
<a
href="auth.html"
class="profile-btn">
Sign In
</a>
`;

return;
}

profileBox.innerHTML = `

<div style="
position:relative;
">

<button
class="profile-btn"
id="profileButton">

👤 ${user.name}

</button>

<div
class="dropdown"
id="dropdown">

<a href="#">
My Profile
</a>

<a href="#"
onclick="showOrders()">

📦 My Orders

</a>

<a href="#"
onclick="logoutUser()">

🚪 Logout

</a>

</div>

</div>

`;

const button =
document.getElementById(
"profileButton"
);

button.addEventListener(
"click",
()=>{

const dropdown =
document.getElementById(
"dropdown"
);

dropdown.style.display =
dropdown.style.display ===
"block"
?
"none"
:
"block";

});

}

/* ===================================
   LOGOUT
=================================== */

function logoutUser(){

localStorage.removeItem(
"currentUser"
);

location.reload();

}

window.logoutUser =
logoutUser;

/* ===================================
   ORDERS
=================================== */

function showOrders(){

const modal =
document.getElementById(
"ordersModal"
);

const list =
document.getElementById(
"ordersList"
);

let orders =
JSON.parse(
localStorage.getItem(
"orders"
)
) || [];

if(orders.length === 0){

list.innerHTML =
"<p>No orders yet</p>";

}else{

let html = "";

[...orders]
.reverse()
.forEach(order=>{

html += `

<div style="
padding:15px;
margin-bottom:15px;
border:1px solid #eee;
border-radius:10px;
">

<h4>
${order.orderId}
</h4>

<p>
${order.date}
</p>

<p>
₹${order.total}
</p>

</div>

`;

});

list.innerHTML =
html;

}

modal.style.display =
"block";

}

window.showOrders =
showOrders;

/* CLOSE ORDERS */

const closeOrders =
document.getElementById(
"closeOrders"
);

if(closeOrders){

closeOrders.addEventListener(
"click",
()=>{

document.getElementById(
"ordersModal"
).style.display =
"none";

});

}

/* ===================================
   INIT
=================================== */

updateCounters();
setupProfile();
loadProducts();
