fetch("products.json")
.then(response => response.json())
.then(products => {

  const container = document.getElementById("product-container");

  products.forEach(product => {

    container.innerHTML += `
      <div class="card">
        <img src="${product.image}" alt="${product.name}">
        <div class="card-content">
          <h3>${product.name}</h3>
          <div class="price">₹${product.price}</div>
          <p>${product.description || ""}</p>

          <a
            class="buy-btn"
            href="https://wa.me/918660165085?text=I want to buy ${encodeURIComponent(product.name)}"
            target="_blank">
            Order on WhatsApp
          </a>

        </div>
      </div>
    `;
  });

})
.catch(error => {
  console.error("Error:", error);
});
