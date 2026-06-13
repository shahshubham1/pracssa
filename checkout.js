const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
    alert("Please sign in first");
    window.location.href = "auth.html";
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cart-container");

// GLOBAL TOTAL
let total = 0;

function renderCart() {

    if (!container) {
        console.error("cart-container not found");
        document.body.innerHTML = `<h3 style="text-align:center;margin-top:50px">
            Checkout error: cart container missing
        </h3>`;
        return;
    }

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

    total = 0;

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
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            pincode: document.getElementById("pincode").value
        };

        let orderId = "ORD" + Date.now();

        let message = `🛒 New Order - Shyam Creation\n`;
        message += `Order ID: ${orderId}\n\n`;

        cart.forEach(p => {
            message += `• ${p.name} - ₹${p.price}\n`;
        });

        message += `\nTotal: ₹${total}\n\n`;

        message += `🚚 Shipping Details:\n`;
        message += `Name: ${shippingData.name}\n`;
        message += `Phone: ${shippingData.phone}\n`;
        message += `Address: ${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}`;

        const url = `https://wa.me/918660165085?text=${encodeURIComponent(message)}`;

        try {
            container.innerHTML = `
                <h2 style="text-align:center;margin-top:50px;">
                    ✅ Redirecting to WhatsApp...
                </h2>
            `;

            localStorage.removeItem("cart");
            cart = [];

            window.open(url, "_blank");

        } catch (err) {
            alert("WhatsApp failed to open");
            console.error(err);
        }

        renderCart();
    });

    container.appendChild(form);
}

renderCart();
