let cart =
JSON.parse(localStorage.getItem("cart")) || [];

const container =
document.getElementById("cart-container");

function saveCart() {

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

}

function renderCart() {

container.innerHTML = "";

if(cart.length === 0){

container.innerHTML = `
<div class="empty">

<h2>
Your cart is empty
</h2>

<p>
Add products before checkout.
</p>

</div>
`;

return;

}

let total = 0;

cart.forEach((item,index)=>{

const subtotal =
item.price * item.qty;

total += subtotal;

const div =
document.createElement("div");

div.className = "cart-item";

div.innerHTML = `

<div>

<h3>
${item.name}
</h3>

<p>
₹${item.price}
</p>

</div>

<div class="qty-box">

<button
class="qty-btn minus">

-
</button>

<span>
${item.qty}
</span>

<button
class="qty-btn plus">

+
</button>

</div>

<div>

<strong>

₹${subtotal}

</strong>

</div>

<button
class="remove-btn">

Remove

</button>

`;

div
.querySelector(".plus")
.addEventListener(
"click",
()=>{

cart[index].qty++;

saveCart();
renderCart();

});

div
.querySelector(".minus")
.addEventListener(
"click",
()=>{

if(cart[index].qty > 1){

cart[index].qty--;

saveCart();
renderCart();

}

});

div
.querySelector(".remove-btn")
.addEventListener(
"click",
()=>{

cart.splice(index,1);

saveCart();
renderCart();

});

container.appendChild(div);

});

/* TOTAL */

const totalDiv =
document.createElement("div");

totalDiv.className = "total";

totalDiv.innerHTML = `
Total: ₹${total}
`;

container.appendChild(totalDiv);

/* SUMMARY */

const summary =
document.createElement("div");

summary.className =
"order-summary";

summary.innerHTML = `

<h3>
Order Summary
</h3>

<p>
Items:
${cart.length}
</p>

<p>
Grand Total:
₹${total}
</p>

`;

container.appendChild(summary);

/* FORM */

const form =
document.createElement("form");

form.innerHTML = `

<h2>
Shipping Details
</h2>

<input
id="name"
placeholder="Full Name"
required>

<input
id="phone"
placeholder="Phone Number"
required>

<input
id="address"
placeholder="Address"
required>

<input
id="city"
placeholder="City"
required>

<input
id="state"
placeholder="State"
required>

<input
id="pincode"
placeholder="Pincode"
required>

<button
class="checkout-btn">

Place Order

</button>

`;

form.addEventListener(
"submit",
function(e){

e.preventDefault();

const phone =
document
.getElementById("phone")
.value
.trim();

const pincode =
document
.getElementById("pincode")
.value
.trim();

if(phone.length !== 10){

alert(
"Enter valid 10 digit phone number"
);

return;

}

if(pincode.length !== 6){

alert(
"Enter valid pincode"
);

return;

}

const shipping = {

name:
document.getElementById(
"name"
).value,

phone,

address:
document.getElementById(
"address"
).value,

city:
document.getElementById(
"city"
).value,

state:
document.getElementById(
"state"
).value,

pincode

};

const orderId =
"SC-" +
Date.now();

let orders =
JSON.parse(
localStorage.getItem(
"orders"
)
) || [];

orders.push({

orderId,

items:cart,

total,

shipping,

status:"Processing",

date:
new Date()
.toLocaleString()

});

localStorage.setItem(
"orders",
JSON.stringify(orders)
);

/* WHATSAPP */

let message =
`🛒 New Order - Shyam Creation\n\n`;

message +=
`Order ID: ${orderId}\n\n`;

cart.forEach(item=>{

message +=
`• ${item.name} x${item.qty} = ₹${item.price * item.qty}\n`;

});

message +=
`\nTotal: ₹${total}\n\n`;

message +=
`Customer:\n`;

message +=
`${shipping.name}\n`;

message +=
`${shipping.phone}\n`;

message +=
`${shipping.address}\n`;

message +=
`${shipping.city}, ${shipping.state}\n`;

message +=
`${shipping.pincode}`;

localStorage.removeItem(
"cart"
);

window.open(

`https://wa.me/918660165085?text=${encodeURIComponent(message)}`,

"_blank"

);

container.innerHTML = `

<div style="
text-align:center;
padding:40px;
">

<h2>
✅ Order Placed
</h2>

<p>
Order ID:
<strong>
${orderId}
</strong>
</p>

<br>

<a href="index.html"
class="back-btn">

Continue Shopping

</a>

</div>

`;

});

container.appendChild(form);

}

renderCart();
