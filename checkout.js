let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cart-container");

function renderCart() {

    if (!container) return;

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

    const totalDiv = document.createElement("div");
    totalDiv.className = "total";
    totalDiv.innerHTML = `Total: ₹${total}`;
    container.appendChild(totalDiv);

    // SHIPPING FORM
    const form = document.createElement("form");

    form.innerHTML = `
        <h3>🚚 Shipping Details</h3>

        <input id="name" placeholder="Full Name" required>
        <input id="phone" placeholder="Phone" required>
        <input id="address" placeholder="Address" required>
        <input id="city" placeholder="City" required>
        <input id="state" placeholder="State" required>
        <input id="pincode" placeholder="Pincode" required>

        <button class="checkout-btn">Place Order on WhatsApp</button>
    `;

    form.addEventListener("submit", function(e){
        e.preventDefault();

        const shippingData = {
            name: name.value,
            phone: phone.value,
            address: address.value,
            city: city.value,
            state: state.value,
            pincode: pincode.value
        };

        let orderId = "ORD" + Date.now();

        let message = `🛒 New Order\nOrder ID: ${orderId}\n\n`;

        cart.forEach(p => {
            message += `• ${p.name} - ₹${p.price}\n`;
        });

        message += `\nTotal: ₹${total}\n\n`;
        message += `Shipping:\n${shippingData.name}\n${shippingData.phone}\n${shippingData.address}`;

        const url = `https://wa.me/918660165085?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");
    });

    container.appendChild(form);
}

renderCart();
