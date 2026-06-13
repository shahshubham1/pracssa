let isLogin = true;

/* =========================
ELEMENTS
========================= */

const title =
document.getElementById("formTitle");

const nameInput =
document.getElementById("name");

const emailInput =
document.getElementById("email");

const passwordInput =
document.getElementById("password");

const submitBtn =
document.getElementById("submitBtn");

const toggleBtn =
document.getElementById("toggleMode");

const errorMsg =
document.getElementById("errorMsg");

const successMsg =
document.getElementById("successMsg");

/* =========================
HELPERS
========================= */

function showError(message){

errorMsg.style.display = "block";
successMsg.style.display = "none";

errorMsg.textContent = message;

}

function showSuccess(message){

successMsg.style.display = "block";
errorMsg.style.display = "none";

successMsg.textContent = message;

}

function clearMessages(){

errorMsg.style.display = "none";
successMsg.style.display = "none";

}

/* =========================
TOGGLE MODE
========================= */

toggleBtn.addEventListener(
"click",
()=>{

clearMessages();

isLogin = !isLogin;

if(isLogin){

title.textContent =
"Sign In";

submitBtn.textContent =
"Sign In";

toggleBtn.textContent =
"Create New Account";

nameInput.style.display =
"none";

}else{

title.textContent =
"Create Account";

submitBtn.textContent =
"Create Account";

toggleBtn.textContent =
"Already have an account?";

nameInput.style.display =
"block";

}

}
);

/* =========================
AUTH
========================= */

submitBtn.addEventListener(
"click",
()=>{

clearMessages();

const name =
nameInput.value.trim();

const email =
emailInput.value.trim();

const password =
passwordInput.value.trim();

let users =
JSON.parse(
localStorage.getItem(
"users"
)
) || [];

if(!email || !password){

showError(
"Please fill all required fields"
);

return;

}

/* LOGIN */

if(isLogin){

const user =
users.find(u =>

u.email === email &&
u.password === password

);

if(!user){

showError(
"Invalid email or password"
);

return;

}

localStorage.setItem(
"currentUser",
JSON.stringify(user)
);

showSuccess(
"Login successful"
);

setTimeout(()=>{

window.location.href =
"index.html";

},1000);

return;

}

/* REGISTER */

if(!name){

showError(
"Please enter your name"
);

return;

}

if(password.length < 6){

showError(
"Password must be at least 6 characters"
);

return;

}

const exists =
users.find(
u => u.email === email
);

if(exists){

showError(
"Account already exists"
);

return;

}

const newUser = {

id: Date.now(),

name,
email,
password

};

users.push(newUser);

localStorage.setItem(
"users",
JSON.stringify(users)
);

showSuccess(
"Account created successfully"
);

setTimeout(()=>{

isLogin = true;

title.textContent =
"Sign In";

submitBtn.textContent =
"Sign In";

toggleBtn.textContent =
"Create New Account";

nameInput.style.display =
"none";

clearMessages();

},1200);

});
