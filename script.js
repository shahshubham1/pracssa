let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("product-container");
const searchInput = document.getElementById("searchInput");

function updateCart() {
    document.getElementById("cart-count").textContent = cart.length;
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
    cart.push(product);
    updateCart();
    alert(product.name + " added to cart 🛒");
}

async function loadProducts() {
    const res = await fetch("products.json");
    products = await res.json();
    displayProducts(products);
    updateCart();
}

function displayProducts(list) {
    container.innerHTML = "";

    list.forEach(product => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${product.image}" onerror="this.src='images/no-image.jpg'">

            <div class="card-content">

                <span class="category">${product.category}</span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="price">₹${product.price}</div>

                <button class="cart-btn">🛒 Add to Cart</button>

                <a class="buy-btn" target="_blank"
                href="https://wa.me/918660165085?text=I want to order ${encodeURIComponent(product.name)}">
                Order on WhatsApp
                </a>

            </div>
        `;

        card.querySelector(".cart-btn").addEventListener("click", () => {
            addToCart(product);
        });

        container.appendChild(card);
    });
}

// SEARCH
searchInput.addEventListener("input", () => {
    const text = searchInput.value.toLowerCase();

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(text)
    );

    displayProducts(filtered);
});

// FILTER
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        const cat = btn.textContent.trim();

        if (cat === "All") {
            displayProducts(products);
        } else {
            displayProducts(products.filter(p => p.category === cat));
        }
    });
});

loadProducts();
