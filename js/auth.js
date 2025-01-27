function showModal(message) {
  console.log("showModal called with message:", message);
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modalMessage");
  modalMessage.textContent = message;
  modal.style.display = "flex";

  setTimeout(() => {
    closeModal();
  }, 3000);
}

function closeModal() {
  modal.style.display = "none";
}

if (document.getElementById("loginForm")) {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("./php/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          localStorage.setItem("authToken", result.token);
          localStorage.setItem("email", email);
          window.location.replace("../pages/dashboard.php");
        } else {
          console.log(result.message);
          showModal(result.message);
        }
      } catch (error) {
        console.log(error);
        showModal(error);
      }
    });
}

if (document.getElementById("registerForm")) {
  document
    .getElementById("registerForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      try {
        const response = await fetch("/php/register.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password, confirmPassword }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          window.location.href = "/index.php";
        } else {
          console.log(result.message);
          showModal(result.message);
        }
      } catch (error) {
        console.log(error);
        showModal(error);
      }
    });
}
