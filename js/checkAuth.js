async function checkAuth() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "/index.php";
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
    
    if (
      !result.valid ||
      localStorage.getItem("email") == null ||
      typeof localStorage.getItem("email") == "undefined"
    ) {
      localStorage.removeItem("authToken");
      window.location.replace = "/index.php";
    } else {
      const userRole = result.role;
      const userName = result.username;
      const userId = result.userId;

      const userNameContainer = document.querySelector(
        ".profile-information h2"
      );
      const userIdContainer = document.querySelector(".profile-information p");

      if (userNameContainer && userIdContainer) {
        document.querySelector(".profile-information h2").textContent =
          userName;
        document.querySelector(
          ".profile-information p"
        ).textContent = `Employee ID: ${userId}`;
      }

      if (userRole === "admin") {
        const pendingContributionsSection = document.getElementById(
          "pendingContributionsSection"
        );
        const activePinpointsSection = document.getElementById(
          "activePinpointsSection"
        );
        const checkUsersSection = document.getElementById("checkUsersSection");
        if (activePinpointsSection) {
          pendingContributionsSection.style.display = "block";
          activePinpointsSection.style.display = "block";
          checkUsersSection.style.display = "block";
        }
      }
    }
  } catch (error) {
    console.error("Token validation failed:", error);
    window.location.replace = "/index.php";
  }
}

checkAuth();

function NavigateTo(pageToNavigate) {
  window.location.href = `./${pageToNavigate}.php`;
}

async function LogoutSession() {
  const token = localStorage.getItem("authToken");

  try {
    await fetch("/php/logout.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    localStorage.removeItem("authToken");
    localStorage.removeItem("email");

    window.location.href = "/index.php";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
