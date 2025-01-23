document.addEventListener("DOMContentLoaded", () => {
  const isLightMode = localStorage.getItem("lightMode");

  if (isLightMode == "false") {
    document.body.classList.add("dark-mode");
  }
  const userProfileList = document.getElementById("userProfiles");
  let selectedUserId = null;
  let selectedRole = null;

  const sendRequest = async (url, method = "GET", body = null) => {
    const options = { method };
    if (body) {
      options.headers = { "Content-Type": "application/x-www-form-urlencoded" };
      options.body = new URLSearchParams(body);
    }
    try {
      const response = await fetch(url, options);
      return response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUserList = async () => {
    const users = await sendRequest("/php/fetch_users.php");
    userProfileList.innerHTML = "";
    if (users && users.length > 0) {
      users.forEach((user) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${user.username} (${user.email})</span>
          <select class="role-dropdown" data-user-id="${user.userId}">
            <option value="user" ${
              user.role === "user" ? "selected" : ""
            }>User</option>
            <option value="admin" ${
              user.role === "admin" ? "selected" : ""
            }>Admin</option>
          </select>
        `;
        userProfileList.appendChild(li);
      });

      document.querySelectorAll(".role-dropdown").forEach((dropdown) =>
        dropdown.addEventListener("change", (event) => {
          selectedUserId = event.target.getAttribute("data-user-id");
          selectedRole = event.target.value;

          const modal = document.getElementById("confirmationModal");
          modal.style.display = "flex";
        })
      );
    } else {
      userProfileList.innerHTML = "<li>No other users</li>";
    }
  };

  const confirmYesBtn = document.getElementById("confirmYesBtn");
  const confirmNoBtn = document.getElementById("confirmNoBtn");
  const modal = document.getElementById("confirmationModal");

  confirmYesBtn.addEventListener("click", async () => {
    if (selectedUserId && selectedRole) {
      const response = await sendRequest("/php/update_user_role.php", "POST", {
        userId: selectedUserId,
        role: selectedRole,
      });

      if (response.success) {
        fetchUserList();
      } else {
        alert("Failed to update role: " + response.error);
      }
    }
    modal.style.display = "none";
  });

  confirmNoBtn.addEventListener("click", () => {
    const dropdown = document.querySelector(
      `.role-dropdown[data-user-id="${selectedUserId}"]`
    );
    if (dropdown) {
      dropdown.value = dropdown.querySelector(`[selected]`).value;
    }
    modal.style.display = "none";
  });

  fetchUserList();

  const userListSearch = document.getElementById("userListSearch");

  const filterUserList = () => {
    const searchTerm = userListSearch.value.toLowerCase();
    const listItems = userProfileList.querySelectorAll("li");

    listItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  };

  userListSearch.addEventListener("input", filterUserList);

});
