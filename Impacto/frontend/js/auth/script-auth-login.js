function handleLogin(event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("password").value.trim();
    let role = document.getElementById("role").value;

    if (email === "" || pass === "" || role === "") {
        alert("Please fill all fields");
        return false;
    }

    // Redirect based on role
    if (role === "admin") window.location.href = "../../Admin/index-admin-dashborad.html";
    if (role === "donor") window.location.href = "../../Donors/Donors-dashboard.html";
    if (role === "ngo") window.location.href = "../../NGO/ngo-dashboard.html";
    if (role === "customer") window.location.href = "../../Public-User/index-public-home.html";
    if (role === "courier") window.location.href = "../../Delivary-Courier/courier-dashboard.html";

    return true;
}
