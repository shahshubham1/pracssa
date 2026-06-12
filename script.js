let allProducts = [];

fetch('products.json')
.then(response => response.json())
.then(products => {

```
allProducts = products;

displayProducts(products);

document
.getElementById('searchInput')
.addEventListener('keyup', searchProducts);
```

})
.catch(error => {

```
document.getElementById('product-container').innerHTML =
'<h2 style="text-align:center;color:red;">Products could not be loaded.</h2>';

console.error(error);
```

});

function displayProducts(products){

```
const container =
document.getElementById('product-container');

container.innerHTML = '';

products.forEach(product => {

    container.innerHTML += `
    <div class="card">

        <img src="${product.image}"
             alt="${product.name}"
             onerror="this.src='https://via.placeholder.com/400x500?text=Product+Image'">

        <div class="card-content">

            <span class="category">
            ${product.category}
            </span>

            <h3>${product.name}</h3>

            <div class="price">
            ₹${product.price}
            </div>

            <p>${product.description}</p>

            <a class="buy-btn"
            target="_blank"
            href="https://wa.me/918660165085?text=Hello, I am interested in ${encodeURIComponent(product.name)}">
            Order on WhatsApp
            </a>

        </div>

    </div>
    `;
});
```

}

function filterProducts(category){

```
if(category === 'All'){
    displayProducts(allProducts);
    return;
}

const filtered =
allProducts.filter(
product => product.category === category
);

displayProducts(filtered);
```

}

function searchProducts(){

```
const keyword =
document.getElementById('searchInput')
.value
.toLowerCase();

const filtered =
allProducts.filter(product =>
product.name.toLowerCase().includes(keyword)
);

displayProducts(filtered);
```

}
