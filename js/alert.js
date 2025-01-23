class Alert {
  static show(message, type = "success") {
    let alertContainer = document.getElementById("alertContainer");
    if (!alertContainer) {
      alertContainer = document.createElement("div");
      alertContainer.id = "alertContainer";
      alertContainer.style.position = "fixed";
      alertContainer.style.top = "20px";
      alertContainer.style.right = "20px";
      alertContainer.style.zIndex = "9999";
      alertContainer.style.display = "flex";
      alertContainer.style.flexDirection = "column";
      alertContainer.style.gap = "10px";
      document.body.appendChild(alertContainer);
    }

    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.style.position = "relative";
    alert.style.padding = "15px 20px";
    alert.style.borderRadius = "5px";
    alert.style.fontSize = "16px";
    alert.style.fontWeight = "500";
    alert.style.color = "#fff";
    alert.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    alert.style.opacity = "0";
    alert.style.transform = "translateY(-20px)";
    alert.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    alert.style.marginRight = "1rem";
    alert.textContent = message;

    if (type === "success") {
      alert.style.backgroundColor = "#4CAF50";
    } else if (type === "error") {
      alert.style.backgroundColor = "#F44336";
    } else {
      alert.style.backgroundColor = "#333";
    }

    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "1rem";
    closeButton.style.fontSize = "2rem";
    closeButton.style.background = "none";
    closeButton.style.border = "none";
    closeButton.style.color = "#fff";
    closeButton.style.cursor = "pointer";

    closeButton.addEventListener("click", () => {
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-20px)";
      alert.addEventListener("transitionend", () => {
        alert.remove();
        if (alertContainer.childElementCount === 0) {
          alertContainer.remove();
        }
      });
    });

    alert.appendChild(closeButton);

    alertContainer.appendChild(alert);

    requestAnimationFrame(() => {
      alert.style.opacity = "1";
      alert.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-20px)";
      alert.addEventListener("transitionend", () => {
        alert.remove();
        if (alertContainer.childElementCount === 0) {
          alertContainer.remove();
        }
      });
    }, 4000);
  }
}

// Usage example:
// Alert.show("Your action was successful!", "success");
// Alert.show("Something went wrong!", "error");

export default Alert;
