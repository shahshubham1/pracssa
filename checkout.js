let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cart-container");

function renderCart() {

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty">
                🛒 Your cart is empty
                <br><br>
                <a href="index.html">Go Shopping</a>
            </div>
        `;
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p class="price">₹${item.price}</p>
            </div>

            <button class="remove-btn">Remove</button>
        `;

        div.querySelector(".remove-btn").addEventListener("click", () => {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });

        container.appendChild(div);
    });

    // TOTAL SECTION
    const totalDiv = document.createElement("div");
    totalDiv.className = "total";
    totalDiv.innerHTML = `Total: ₹${total}`;
    container.appendChild(totalDiv);

    // WHATSAPP ORDER BUTTON
    const message = cart.map(p => `• ${p.name} - ₹${p.price}`).join("%0A");

    const checkoutBtn = document.createElement("a");
    checkoutBtn.className = "checkout-btn";
    checkoutBtn.target = "_blank";
    checkoutBtn.href = `https://wa.me/918660165085?text=Hello Shyam Creation,%0AI want to order:%0A${message}%0A%0ATotal: ₹${total}`;

    checkoutBtn.innerText = "Place Order on WhatsApp";

    container.appendChild(checkoutBtn);
}

renderCart();
