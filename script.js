let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const container = document.getElementById("product-container");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cart-count");
const modal = document.getElementById("modal");

/* =========================
   TOAST
========================= */

function showToast(message) {

    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";

        toast.style.position = "fixed";
        toast.style.bottom = "30px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = "#333";
        toast.style.color = "#fff";
        toast.style.padding = "12px 20px";
        toast.style.borderRadius = "30px";
        toast.style.zIndex = "99999";

        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

/* =========================
   CART
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

    showToast(`${product.name} added to cart 🛒`);
}

/* =========================
   WISHLIST
========================= */

function toggleWishlist(product, button) {

    const exists = wishlist.find(item => item.id === product.id);

    if (exists) {

        wishlist = wishlist.filter(item => item.id !== product.id);

        button.classList.remove("active");
        button.innerHTML = "♡";

        showToast("Removed from Wishlist");

    } else {

        wishlist.push(product);

        button.classList.add("active");
        button.innerHTML = "♥";

        showToast("Added to Wishlist ❤️");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

/* =========================
   MODAL
========================= */

function openModal(product) {

    modal.style.display = "flex";

    document.getElementById("modal-body").innerHTML = `
        <img src="${product.image}"
             style="width:100%;border-radius:12px;margin-bottom:15px;">

        <h2>${product.name}</h2>

        <p style="margin:10px 0;">
            ${product.description}
        </p>

        <h3 style="color:#ff4081;margin:15px 0;">
            ₹${product.price}
        </h3>

        <button
            style="
            width:100%;
            padding:12px;
            border:none;
            background:#ff9800;
            color:white;
            border-radius:10px;
            cursor:pointer;
            font-weight:600;"
            id="modal-add-cart">
            🛒 Add To Cart
        </button>
    `;

    document
        .getElementById("modal-add-cart")
        .addEventListener("click", () => {
            addToCart(product);
        });
}

function closeModal() {
    modal.style.display = "none";
}

/* CLICK OUTSIDE MODAL */

window.addEventListener("click", (e) => {

    if (e.target === modal) {
        closeModal();
    }

});

/* =========================
   DISPLAY PRODUCTS
========================= */

function displayProducts(list) {

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `
            <h3 style="text-align:center;">
                No Products Found
            </h3>
        `;

        return;
    }

    list.forEach(product => {

        const isWishlisted =
            wishlist.some(item => item.id === product.id);

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.src='images/no-image.jpg'">

            <button class="wishlist-btn ${isWishlisted ? "active" : ""}">
                ${isWishlisted ? "♥" : "♡"}
            </button>

            <div class="card-content">

                <span class="category">
                    ${product.category}
                </span>

                <h3 style="margin-top:10px;">
                    ${product.name}
                </h3>

                <p style="margin:10px 0;">
                    ${product.description}
                </p>

                <div class="price">
                    ₹${product.price}
                </div>

                <div class="card-buttons">

                    <button class="cart-btn-item">
                        🛒 Add to Cart
                    </button>

                    <button class="view-btn">
                        👁 Quick View
                    </button>

                </div>

            </div>
        `;

        const wishlistBtn =
            card.querySelector(".wishlist-btn");

        wishlistBtn.addEventListener("click", () => {
            toggleWishlist(product, wishlistBtn);
        });

        card
            .querySelector(".cart-btn-item")
            .addEventListener("click", () => {
                addToCart(product);
            });

        card
            .querySelector(".view-btn")
            .addEventListener("click", () => {
                openModal(product);
            });

        container.appendChild(card);
    });
}

/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

    try {

        const response =
            await fetch("products.json");

        products = await response.json();

        displayProducts(products);

        updateCart();

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <h3 style="
            text-align:center;
            color:red;">
                Unable to load products
            </h3>
        `;
    }
}

/* =========================
   SEARCH
========================= */

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const text =
            searchInput.value.toLowerCase();

        const filtered = products.filter(product =>
            product.name
                .toLowerCase()
                .includes(text)
        );

        displayProducts(filtered);
    });
}

/* =========================
   CATEGORY FILTERS
========================= */

document.addEventListener("click", (e) => {

    if (
        e.target.classList.contains("filter-btn")
    ) {

        const category =
            e.target.textContent.trim();

        if (category === "All") {

            displayProducts(products);

        } else {

            const filtered =
                products.filter(product =>
                    product.category === category
                );

            displayProducts(filtered);
        }
    }
});

/* =========================
   INIT
========================= */

loadProducts();
updateCart();
