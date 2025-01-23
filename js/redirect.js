async function redirectIfLoggedIn() {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
        const response = await fetch("./php/validate_token.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (result.valid) {
            window.location.href = "/pages/dashboard.html";
        }
    } catch (error) {
        console.error("Token validation failed:", error);
    }
}

redirectIfLoggedIn();
