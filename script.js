let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("product-container");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cart-count");

/* =========================
   CART FUNCTIONS
========================= */

function updateCart() {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function addToCart(product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    alert(`${product.name} added to cart 🛒`);
}

/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {
    try {
        const res = await fetch("products.json");
        products = await res.json();
        displayProducts(products);
        updateCart();
    } catch (error) {
        console.error("Error loading products:", error);
        container.innerHTML = `
            <h3 style="text-align:center;color:red;">
                Unable to load products
            </h3>
        `;
    }
}

/* =========================
   DISPLAY PRODUCTS
========================= */

function displayProducts(list) {
    container.innerHTML = "";

    if (!list || list.length === 0) {
        container.innerHTML = `
            <h3 style="text-align:center;">
                No products found
            </h3>
        `;
        return;
    }

    list.forEach(product => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}"
                onerror="this.src='images/no-image.jpg'">

            <div class="card-content">

                <span class="category">${product.category}</span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="price">₹${product.price}</div>

                <button class="cart-btn-item">
                    🛒 Add to Cart
                </button>

            </div>
        `;

        card.querySelector(".cart-btn-item").addEventListener("click", () => {
            addToCart(product);
        });

        container.appendChild(card);
    });
}

/* =========================
   SEARCH FUNCTION
========================= */

searchInput.addEventListener("input", () => {
    const text = searchInput.value.toLowerCase();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(text)
    );

    displayProducts(filtered);
});

/* =========================
   CATEGORY FILTER
========================= */

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        const category = btn.textContent.trim();

        if (category === "All") {
            displayProducts(products);
        } else {
            const filtered = products.filter(
                p => p.category === category
            );
            displayProducts(filtered);
        }

    });
});

/* =========================
   CART SYNC
========================= */

window.addEventListener("storage", () => {
    updateCart();
});

/* =========================
   INIT
========================= */

loadProducts();
updateCart();

/* =========================
   USER SYSTEM
========================= */

function checkUser() {
    const userBox = document.getElementById("user-box");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (userBox && user) {
        userBox.innerHTML = `
            👤 ${user.name}
        `;
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

checkUser();

/* =========================
   PROFILE DROPDOWN
========================= */

function setupProfile() {
    const box = document.getElementById("profile-box");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!box) return;

    if (!user) {
        box.innerHTML = `
            <a href="auth.html" class="profile-btn">👤 Sign In</a>
        `;
        return;
    }

    box.innerHTML = `
        <button class="profile-btn" onclick="toggleDropdown()">
            👤 ${user.name}
        </button>

        <div class="dropdown" id="dropdown">
            <a href="#">My Profile</a>
            <a href="#" onclick="openOrders()">📦 My Orders</a>
            <a href="#" onclick="logoutUser()">🚪 Sign Out</a>
        </div>
    `;
}

function toggleDropdown() {
    const dd = document.getElementById("dropdown");
    if (!dd) return;

    dd.style.display = dd.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function(e){
    const box = document.getElementById("profile-box");
    const dd = document.getElementById("dropdown");

    if (!box || !dd) return;

    if (!box.contains(e.target)) {
        dd.style.display = "none";
    }
});

function logoutUser() {
    localStorage.removeItem("currentUser");
    location.reload();
}

/* =========================
   ORDER HISTORY SYSTEM (NEW)
========================= */

function openOrders() {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let html = "";

    if (orders.length === 0) {
        html = "<p style='text-align:center'>No orders yet</p>";
    } else {
        orders.reverse().forEach(order => {

            let items = order.items.map(i =>
                `<li>${i.name} - ₹${i.price}</li>`
            ).join("");

            html += `
                <div style="
                    background:#fff;
                    padding:15px;
                    margin-bottom:10px;
                    border-radius:10px;
                    box-shadow:0 2px 10px rgba(0,0,0,0.1);
                ">
                    <h4>Order ID: ${order.orderId}</h4>
                    <p>Date: ${order.date}</p>
                    <p>Total: ₹${order.total}</p>
                    <ul>${items}</ul>
                </div>
            `;
        });
    }

    const panel = document.createElement("div");
    panel.id = "orders-panel";
    panel.innerHTML = `
        <div style="
            position:fixed;
            top:0;left:0;
            width:100%;height:100%;
            background:rgba(0,0,0,0.6);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:9999;
        ">
            <div style="
                background:white;
                width:90%;
                max-width:500px;
                padding:20px;
                border-radius:10px;
                max-height:80vh;
                overflow:auto;
            ">
                <h2>📦 My Orders</h2>
                ${html}
                <br>
                <button onclick="closeOrders()" style="
                    padding:10px 15px;
                    background:red;
                    color:white;
                    border:none;
                    border-radius:8px;
                ">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(panel);
}

function closeOrders() {
    const panel = document.getElementById("orders-panel");
    if (panel) panel.remove();
}

setupProfile();
