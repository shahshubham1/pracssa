/* =====================================
   SHYAM CREATION
   MAIN SCRIPT
   PART 1
===================================== */

/* =====================================
   STORAGE
===================================== */

let products = [];

let cart =
JSON.parse(
localStorage.getItem("cart")
) || [];

let wishlist =
JSON.parse(
localStorage.getItem("wishlist")
) || [];

/* =====================================
   DOM ELEMENTS
===================================== */

const productContainer =
document.getElementById(
"product-container"
);

const searchInput =
document.getElementById(
"searchInput"
);

const cartCount =
document.getElementById(
"cart-count"
);

const wishlistCount =
document.getElementById(
"wishlist-count"
);

const sortSelect =
document.getElementById(
"sortSelect"
);

const profileBox =
document.getElementById(
"profile-box"
);

/* MODALS */

const productModal =
document.getElementById(
"productModal"
);

const modalBody =
document.getElementById(
"modalBody"
);

const closeModalBtn =
document.getElementById(
"closeModal"
);

const wishlistPanel =
document.getElementById(
"wishlistPanel"
);

const wishlistItems =
document.getElementById(
"wishlistItems"
);

const wishlistBtn =
document.getElementById(
"wishlist-btn"
);

const closeWishlist =
document.getElementById(
"closeWishlist"
);

const ordersModal =
document.getElementById(
"ordersModal"
);

const ordersList =
document.getElementById(
"ordersList"
);

const closeOrders =
document.getElementById(
"closeOrders"
);

/* =====================================
   COUNTERS
===================================== */

function updateCounters(){

let totalQty = 0;

cart.forEach(item=>{

totalQty += item.qty;

});

if(cartCount){

cartCount.textContent =
totalQty;

}

if(wishlistCount){

wishlistCount.textContent =
wishlist.length;

}

}

/* =====================================
   CART SYSTEM
===================================== */

function saveCart(){

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

updateCounters();

}

function addToCart(product){

const existing =
cart.find(
item => item.id === product.id
);

if(existing){

existing.qty++;

}else{

cart.push({

id: product.id,
name: product.name,
price: product.price,
image: product.image,
category: product.category,
description: product.description,
qty: 1

});

}

saveCart();

displayProducts(products);

}

function increaseQty(id){

const item =
cart.find(
p => p.id === id
);

if(!item) return;

item.qty++;

saveCart();

displayProducts(products);

}

function decreaseQty(id){

const index =
cart.findIndex(
p => p.id === id
);

if(index === -1) return;

if(cart[index].qty > 1){

cart[index].qty--;

}else{

cart.splice(index,1);

}

saveCart();

displayProducts(products);

}

/* =====================================
   WISHLIST SYSTEM
===================================== */

function saveWishlist(){

localStorage.setItem(
"wishlist",
JSON.stringify(wishlist)
);

updateCounters();

renderWishlist();

}

function toggleWishlist(product){

const exists =
wishlist.find(
item => item.id === product.id
);

if(exists){

wishlist =
wishlist.filter(
item => item.id !== product.id
);

}else{

wishlist.push(product);

}

saveWishlist();

displayProducts(products);

}

function renderWishlist(){

if(!wishlistItems) return;

wishlistItems.innerHTML = "";

if(wishlist.length === 0){

wishlistItems.innerHTML = `

<div style="
padding:20px;
text-align:center;
">

No items in wishlist

</div>

`;

return;

}

wishlist.forEach(product=>{

const div =
document.createElement("div");

div.style.padding = "15px";
div.style.borderBottom =
"1px solid #eee";

div.innerHTML = `

<h4>
${product.name}
</h4>

<p>
₹${product.price}
</p>

<button
onclick="addToCartFromWishlist(${product.id})">

Add To Cart

</button>

`;

wishlistItems.appendChild(div);

});

}

function addToCartFromWishlist(id){

const product =
wishlist.find(
p => p.id === id
);

if(!product) return;

addToCart(product);

}

/* =====================================
   PRODUCT MODAL
===================================== */

function openProductModal(product){

if(!productModal) return;

modalBody.innerHTML = `

<div class="modal-product">

<img
src="${product.image}"
alt="${product.name}"
style="
width:100%;
max-height:400px;
object-fit:cover;
border-radius:10px;
">

<h2>
${product.name}
</h2>

<p>
${product.description}
</p>

<h3>
₹${product.price}
</h3>

<button
onclick="addToCartById(${product.id})"
style="
padding:12px 20px;
border:none;
background:#ff4081;
color:white;
border-radius:8px;
cursor:pointer;
">

Add To Cart

</button>

</div>

`;

productModal.style.display =
"flex";

}

function addToCartById(id){

const product =
products.find(
p => p.id === id
);

if(product){

addToCart(product);

}

}

if(closeModalBtn){

closeModalBtn.addEventListener(
"click",
()=>{

productModal.style.display =
"none";

}
);

}

window.addEventListener(
"click",
(e)=>{

if(e.target === productModal){

productModal.style.display =
"none";

}

}
);

/* =====================================
   PRODUCT LOADING
===================================== */

async function loadProducts(){

try{

const response =
await fetch("data/products.json");

if(!response.ok){

throw new Error(
"Unable to load products"
);

}

products =
await response.json();

displayProducts(products);

}
catch(error){

console.error(error);

if(productContainer){

productContainer.innerHTML = `

<div style="
text-align:center;
padding:50px;
">

<h3>
Unable to load products
</h3>

<p>
Please check products.json
</p>

</div>

`;

}

}

}

/* =====================================
   PRODUCT RENDERING
===================================== */

function displayProducts(productList){

if(!productContainer) return;

productContainer.innerHTML = "";

if(!productList ||
productList.length === 0){

productContainer.innerHTML = `

<div style="
text-align:center;
padding:40px;
grid-column:1/-1;
">

<h3>
No products found
</h3>

</div>

`;

return;

}

productList.forEach(product=>{

const cartItem =
cart.find(
item => item.id === product.id
);

const qty =
cartItem ? cartItem.qty : 0;

const wishlisted =
wishlist.some(
item => item.id === product.id
);

const card =
document.createElement("div");

card.className = "card";

card.innerHTML = `

<div
class="product-image-wrapper"
style="
position:relative;
">

<img
src="${product.image}"
alt="${product.name}"
loading="lazy"
onerror="this.src='images/no-image.jpg'">

${
qty > 0
?
`
<span class="cart-badge">
${qty}
</span>
`
:
""
}

<button
class="wishlist-heart"
data-id="${product.id}"
style="
position:absolute;
top:10px;
left:10px;
width:50px;
height:50px;
background:white;
box-shadow:0 4px 15px rgba(0,0,0,.15);
border:none;
border-radius:50%;
cursor:pointer;
font-size:18px;
">

${wishlisted ? "❤️" : "🤍"}

</button>

</div>

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

${
qty === 0
?
`
<button
class="modern-cart-btn"
data-id="${product.id}">

🛒 Add To Cart

</button>
`
:
`
<div class="qty-controls">

<button
class="minus-btn"
data-id="${product.id}">

➖

</button>

<span class="qty-number">

${qty}

</span>

<button
class="plus-btn"
data-id="${product.id}">

➕

</button>

</div>
`
}

<button
class="modern-view-btn"
data-view="${product.id}">

👁 Quick View

</button>

</div>

`;

productContainer.appendChild(card);

});

/* =====================================
   EVENTS
===================================== */

bindProductEvents();

}

/* =====================================
   PRODUCT EVENTS
===================================== */

function bindProductEvents(){

/* ADD CART */

document
.querySelectorAll(
".add-cart-btn"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const id =
Number(
btn.dataset.id
);

const product =
products.find(
p => p.id === id
);

if(product){

addToCart(product);

}

}
);

});

/* PLUS */

document
.querySelectorAll(
".plus-btn"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const id =
Number(
btn.dataset.id
);

increaseQty(id);

}
);

});

/* MINUS */

document
.querySelectorAll(
".minus-btn"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const id =
Number(
btn.dataset.id
);

decreaseQty(id);

}
);

});

/* QUICK VIEW */

document
.querySelectorAll(
".quick-view-btn"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const id =
Number(
btn.dataset.view
);

const product =
products.find(
p => p.id === id
);

if(product){

openProductModal(
product
);

}

}
);

});

/* WISHLIST */

document
.querySelectorAll(
".wishlist-heart"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const id =
Number(
btn.dataset.id
);

const product =
products.find(
p => p.id === id
);

if(product){

toggleWishlist(
product
);

}

}
);

});

}

/* =====================================
   SEARCH
===================================== */

if(searchInput){

searchInput.addEventListener(
"input",
()=>{

const keyword =
searchInput.value
.toLowerCase()
.trim();

const filtered =
products.filter(
product =>

product.name
.toLowerCase()
.includes(keyword)

||

product.category
.toLowerCase()
.includes(keyword)

||

product.description
.toLowerCase()
.includes(keyword)

);

displayProducts(
filtered
);

}
);

}

/* =====================================
   CATEGORY FILTERS
===================================== */

const filterButtons =
document.querySelectorAll(
".filter-btn"
);

filterButtons.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

filterButtons.forEach(
b => b.classList.remove(
"active"
)
);

btn.classList.add(
"active"
);

const category =
btn.textContent.trim();

if(category === "All"){

displayProducts(
products
);

return;

}

const filtered =
products.filter(
product =>
product.category ===
category
);

displayProducts(
filtered
);

}
);

});

/* =====================================
   SORTING
===================================== */

if(sortSelect){

sortSelect.addEventListener(
"change",
()=>{

let sorted =
[...products];

switch(
sortSelect.value
){

case "low":

sorted.sort(
(a,b)=>
a.price -
b.price
);

break;

case "high":

sorted.sort(
(a,b)=>
b.price -
a.price
);

break;

case "name":

sorted.sort(
(a,b)=>

a.name.localeCompare(
b.name
)

);

break;

default:

sorted =
[...products];

}

displayProducts(
sorted
);

}
);

}

/* =====================================
   PROFILE SYSTEM
===================================== */

function setupProfile(){

if(!profileBox) return;

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
class="checkout-btn">

👤 Sign In

</a>

`;

return;

}

profileBox.innerHTML = `

<div
style="
position:relative;
">

<button
id="profileButton"
style="
padding:10px 15px;
border:none;
border-radius:30px;
background:#111;
color:white;
cursor:pointer;
">

👤 ${user.name}

</button>

<div
id="profileDropdown"
style="
display:none;
position:absolute;
top:50px;
right:0;
background:white;
min-width:220px;
border-radius:12px;
box-shadow:0 5px 20px rgba(0,0,0,.15);
overflow:hidden;
z-index:9999;
">

<button
id="myOrdersBtn"
style="
width:100%;
padding:12px;
border:none;
background:white;
text-align:left;
cursor:pointer;
">

📦 My Orders

</button>

<button
id="logoutBtn"
style="
width:100%;
padding:12px;
border:none;
background:white;
text-align:left;
cursor:pointer;
">

🚪 Logout

</button>

</div>

</div>

`;

bindProfileEvents();

}

function bindProfileEvents(){

const profileButton =
document.getElementById(
"profileButton"
);

const dropdown =
document.getElementById(
"profileDropdown"
);

if(profileButton){

profileButton.addEventListener(
"click",
()=>{

dropdown.style.display =
dropdown.style.display ===
"block"
?
"none"
:
"block";

}
);

}

document.addEventListener(
"click",
(e)=>{

if(
profileButton &&
dropdown &&
!profileButton.contains(
e.target
) &&
!dropdown.contains(
e.target
)
){

dropdown.style.display =
"none";

}

}
);

const logoutBtn =
document.getElementById(
"logoutBtn"
);

if(logoutBtn){

logoutBtn.addEventListener(
"click",
logoutUser
);

}

const myOrdersBtn =
document.getElementById(
"myOrdersBtn"
);

if(myOrdersBtn){

myOrdersBtn.addEventListener(
"click",
openOrdersModal
);

}

}

function logoutUser(){

localStorage.removeItem(
"currentUser"
);

location.reload();

}

/* =====================================
   ORDER HISTORY
===================================== */

function openOrdersModal(){

if(!ordersModal) return;

let orders =
JSON.parse(
localStorage.getItem(
"orders"
)
) || [];

ordersList.innerHTML = "";

if(orders.length === 0){

ordersList.innerHTML = `

<div style="
padding:20px;
text-align:center;
">

No orders found

</div>

`;

}else{

orders
.slice()
.reverse()
.forEach(order=>{

let itemsHtml = "";

order.items.forEach(item=>{

itemsHtml += `

<li>

${item.name}
x${item.qty}

-
₹${item.price * item.qty}

</li>

`;

});

const card =
document.createElement(
"div"
);

card.style.marginBottom =
"15px";

card.style.padding =
"15px";

card.style.border =
"1px solid #eee";

card.style.borderRadius =
"10px";

card.innerHTML = `

<h3>

${order.orderId}

</h3>

<p>

Status:
<strong>

${order.status || "Processing"}

</strong>

</p>

<p>

Date:
${order.date}

</p>

<p>

Total:
₹${order.total}

</p>

<ul>

${itemsHtml}

</ul>

`;

ordersList.appendChild(
card
);

});

}

ordersModal.style.display =
"flex";

}

if(closeOrders){

closeOrders.addEventListener(
"click",
()=>{

ordersModal.style.display =
"none";

}
);

}

window.addEventListener(
"click",
(e)=>{

if(
e.target === ordersModal
){

ordersModal.style.display =
"none";

}

}
);

/* =====================================
   WISHLIST PANEL
===================================== */

if(wishlistBtn){

wishlistBtn.addEventListener(
"click",
()=>{

wishlistPanel.classList.add(
"active"
);

renderWishlist();

}
);

}

if(closeWishlist){

closeWishlist.addEventListener(
"click",
()=>{

wishlistPanel.classList.remove(
"active"
);

}
);

}

/* =====================================
   GLOBAL HELPERS
===================================== */

window.addToCartById =
addToCartById;

window.addToCartFromWishlist =
addToCartFromWishlist;

/* =====================================
   STORAGE SYNC
===================================== */

window.addEventListener(
"storage",
()=>{

cart =
JSON.parse(
localStorage.getItem(
"cart"
)
) || [];

wishlist =
JSON.parse(
localStorage.getItem(
"wishlist"
)
) || [];

updateCounters();

renderWishlist();

displayProducts(
products
);

}
);

/* =====================================
   INITIALIZATION
===================================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

updateCounters();

renderWishlist();

setupProfile();

loadProducts();

}
);

/* =====================================
   END OF FILE
===================================== */
