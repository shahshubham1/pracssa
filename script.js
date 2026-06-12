let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("product-container");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cart-count");

/* =========================
   CART FUNCTIONS
========================= */

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function addToCart(product) {
    cart.push(product);
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

        // ADD TO CART EVENT
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
   INIT
========================= */

loadProducts();
