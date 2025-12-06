// Preview profile image when selected
document.getElementById("imgInput").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        document.getElementById("previewImage").src = URL.createObjectURL(file);
    }
});

// Save profile button
function saveProfile(event) {
    event.preventDefault();

    alert("Profile updated successfully!");

    // ممكن هنا تضيف API أو LocalStorage حسب شغلك
}
