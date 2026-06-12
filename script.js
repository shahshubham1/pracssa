let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const container = document.getElementById("product-container");
const cartCount = document.getElementById("cart-count");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");

/* TOAST */
function showToast(msg){
toast.innerText = msg;
toast.style.display = "block";
setTimeout(()=> toast.style.display="none",2000);
}

/* CART */
function updateCart(){
localStorage.setItem("cart", JSON.stringify(cart));
cartCount.innerText = cart.length;
}
updateCart();

function addToCart(product){
cart.push(product);
updateCart();
showToast("Added to cart 🛒");
}

/* WISHLIST */
function toggleWish(product){
wishlist.push(product);
localStorage.setItem("wishlist", JSON.stringify(wishlist));
showToast("Added to wishlist ❤️");
}

/* LOAD PRODUCTS */
async function loadProducts(){
const res = await fetch("products.json");
products = await res.json();
display(products);
}
loadProducts();

/* DISPLAY */
function display(list){
container.innerHTML = "";

list.forEach(p=>{
const div = document.createElement("div");
div.className="card";

div.innerHTML=`
<img src="${p.image}">
<div class="card-content">
<h3>${p.name}</h3>
<p class="price">₹${p.price}</p>

<button class="btn add">Add to Cart</button>
<button class="wishlist-btn">♡</button>
<button class="btn">Quick View</button>
</div>
`;

div.querySelector(".add").onclick=()=>addToCart(p);
div.querySelector(".wish").onclick=()=>toggleWish(p);
div.querySelector(".btn:last-child").onclick=()=>openModal(p);

container.appendChild(div);
});
}

/* SEARCH */
searchInput.addEventListener("input",()=>{
const val = searchInput.value.toLowerCase();
display(products.filter(p=>p.name.toLowerCase().includes(val)));
});

/* FILTER */
document.querySelectorAll(".filter-btn").forEach(btn=>{
btn.onclick=()=>{
const cat = btn.innerText;
if(cat==="All") display(products);
else display(products.filter(p=>p.category===cat));
}
});

/* MODAL */
function openModal(p){
modal.style.display="flex";
document.getElementById("modal-body").innerHTML=`
<h2>${p.name}</h2>
<img src="${p.image}" style="width:100%">
<p>${p.description}</p>
<h3>₹${p.price}</h3>
`;
}

function closeModal(){
modal.style.display="none";
}
