function validateRegister() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("password").value.trim();
    let role = document.getElementById("role").value;

    if (name === "" || email === "" || pass === "" || role === "") {
        alert("Please fill all fields");
        return false;
    }

    alert("Account created successfully!");
    window.location.href = "login.html";
    return false;
}
