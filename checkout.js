let cart = JSON.parse(localStorage.getItem("cart")) || [];
let shipping = JSON.parse(localStorage.getItem("shipping")) || {};

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

    // CART ITEMS
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

    // TOTAL
    const totalDiv = document.createElement("div");
    totalDiv.className = "total";
    totalDiv.innerHTML = `Total: ₹${total}`;
    container.appendChild(totalDiv);

    // SHIPPING FORM
    const form = document.createElement("form");

    form.innerHTML = `
        <h3>🚚 Shipping Details</h3>

        <input type="text" id="name" placeholder="Full Name" required value="${shipping.name || ""}">
        <input type="text" id="phone" placeholder="Phone Number" required value="${shipping.phone || ""}">
        <input type="text" id="address" placeholder="Address" required value="${shipping.address || ""}">
        <input type="text" id="city" placeholder="City" required value="${shipping.city || ""}">
        <input type="text" id="state" placeholder="State" required value="${shipping.state || ""}">
        <input type="text" id="pincode" placeholder="Pincode" required value="${shipping.pincode || ""}">

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

        // VALIDATION
        if (shippingData.phone.length !== 10) {
            alert("Enter valid 10-digit phone number");
            return;
        }

        // SAVE SHIPPING
        localStorage.setItem("shipping", JSON.stringify(shippingData));

        // CREATE MESSAGE
        let message = "🛒 *New Order - Shyam Creation*%0A%0A";

        cart.forEach(p => {
            message += `• ${p.name} - ₹${p.price}%0A`;
        });

        message += `%0ATotal: ₹${total}%0A%0A`;

        message += `🚚 *Shipping Details*%0A`;
        message += `Name: ${shippingData.name}%0A`;
        message += `Phone: ${shippingData.phone}%0A`;
        message += `Address: ${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.pincode}`;

        const url = `https://wa.me/918660165085?text=${message}`;

        window.open(url, "_blank");
    });

    container.appendChild(form);
}

renderCart();
