let isLogin = true;

function toggleMode() {
    isLogin = !isLogin;

    document.getElementById("title").innerText = isLogin ? "Sign In" : "Sign Up";
    document.querySelector(".toggle").innerText = isLogin ? "Create new account" : "Already have account";

    document.getElementById("name").style.display = isLogin ? "none" : "block";
}

function handleAuth() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
        // SIGN IN
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            alert("Invalid credentials");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Login successful");
        window.location.href = "index.html";

    } else {
        // SIGN UP
        const exists = users.find(u => u.email === email);

        if (exists) {
            alert("User already exists");
            return;
        }

        const newUser = { name, email, password };
        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));
        alert("Account created");
        toggleMode();
    }
}
