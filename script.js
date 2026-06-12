let products = [];
let currentCategory = "All";

const container = document.getElementById("product-container");
const searchInput = document.getElementById("searchInput");
const productCount = document.getElementById("productCount");

async function loadProducts() {
    try {
        const response = await fetch("products.json");
        products = await response.json();

        displayProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);

        container.innerHTML = `
            <h3 style="text-align:center;color:red;">
                Unable to load products
            </h3>
        `;
    }
}

function displayProducts(productList) {

    container.innerHTML = "";

    productCount.textContent = productList.length;

    if (productList.length === 0) {
        container.innerHTML = `
            <h3 style="text-align:center;">
                No products found
            </h3>
        `;
        return;
    }

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.src='images/no-image.jpg'"
            >

            <div class="card-content">

                <span class="category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="price">
                    ₹${product.price}
                </div>

                <a
                    class="buy-btn"
                    target="_blank"
                    href="https://wa.me/918660165085?text=Hello%20Shyam%20Creation,%20I%20want%20to%20order%20${encodeURIComponent(product.name)}"
                >
                    Order on WhatsApp
                </a>

            </div>
        `;

        container.appendChild(card);
    });
}

function filterProducts(category) {

    currentCategory = category;

    let filtered = products;

    if (category !== "All") {
        filtered = products.filter(
            product => product.category === category
        );
    }

    const searchText = searchInput.value.toLowerCase();

    if (searchText) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchText)
        );
    }

    displayProducts(filtered);
}

searchInput.addEventListener("input", () => {

    const searchText = searchInput.value.toLowerCase();

    let filtered = products;

    if (currentCategory !== "All") {
        filtered = filtered.filter(
            product => product.category === currentCategory
        );
    }

    filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchText)
    );

    displayProducts(filtered);
});

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

        filterProducts(button.textContent.trim());

    });

});

loadProducts();
