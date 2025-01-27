function goToPendingContributions() {
  window.location.href = "/pages/pending-contributions.php";
}

function goToActivePinpoints() {
  window.location.href = "/pages/active-pinpoints.php";
}

function goToCheckUsers() {
  window.location.href = "/pages/check-users.php";
}

document
  .getElementById("pendingContributionsSection")
  .addEventListener("click", goToPendingContributions);
document
  .getElementById("activePinpointsSection")
  .addEventListener("click", goToActivePinpoints);
document
  .getElementById("checkUsersSection")
  .addEventListener("click", goToCheckUsers);

const lightToggle = document.getElementById("light-toggle");

window.onload = () => {
  const storedSetting = localStorage.getItem("lightMode");
  if (storedSetting === "true") {
    lightToggle.checked = true;
  } else if (storedSetting === "false") {
    lightToggle.checked = false;
    document.body.classList.add("dark-mode");
  }
};

lightToggle.addEventListener("change", () => {
  localStorage.setItem("lightMode", lightToggle.checked);
  document.body.classList.toggle("dark-mode");
});
