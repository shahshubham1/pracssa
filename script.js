fetch("products.json")
  .then(response => response.json())
  .then(products => {

    let container = document.getElementById("product-container");

    products.forEach(product => {

      container.innerHTML += `
        <div class="card">

          <img src="${product.image}" alt="${product.name}">

          <div class="card-content">

            <h3>${product.name}</h3>

            <div class="price">₹${product.price}</div>

            <a
              class="buy-btn"
              href="https://wa.me/918660165085?text=I want to buy ${encodeURIComponent(product.name)}"
              style="
                display:block;
                text-align:center;
                text-decoration:none;
                background:#ff4081;
                color:white;
                padding:12px;
                border-radius:8px;
              "
            >
              Order on WhatsApp
            </a>

          </div>

        </div>
      `;
    });

  })
  .catch(error => {
    console.error("Error loading products:", error);
  });
