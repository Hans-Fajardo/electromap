async function checkAuth() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "/index.html";
    return;
  }

  try {
    const response = await fetch("/php/validate_token.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();

    if (!result.valid) {
      localStorage.removeItem("authToken");
      window.location.replace = "/index.html";
    } else {
      const userRole = result.role;
      const userName = result.username;
      const userId = result.userId;

      const userNameContainer = document.querySelector('.profile-information h2');
      const userIdContainer = document.querySelector('.profile-information p')


      if (userNameContainer && userIdContainer) {
          document.querySelector('.profile-information h2').textContent = userName;
          document.querySelector('.profile-information p').textContent = `Employee ID: ${userId}`;
      }

      if (userRole === "admin") {
        const pendingContributionsSection = document.getElementById("pendingContributionsSection");
        const activePinpointsSection = document.getElementById("activePinpointsSection");
        const checkUsersSection = document.getElementById("checkUsersSection");
        if(activePinpointsSection) {
          pendingContributionsSection.style.display = "block";
          activePinpointsSection.style.display = "block";
          checkUsersSection.style.display = "block";
        }
      }
    }
  } catch (error) {
    console.error("Token validation failed:", error);
    window.location.href = "/index.html";
  }
}

checkAuth();
