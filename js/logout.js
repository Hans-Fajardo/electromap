document.getElementById("logoutBtn").addEventListener("click", async () => {
    const token = localStorage.getItem("authToken");

    try {
        await fetch("../php/logout.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        localStorage.removeItem("authToken");
        localStorage.removeItem("email");

        window.location.replace = "../index.html";
    } catch (error) {
        console.error("Logout failed:", error);
    }
});
