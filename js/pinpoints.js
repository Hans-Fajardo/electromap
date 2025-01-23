document.addEventListener("DOMContentLoaded", () => {
  maptilersdk.config.apiKey = "AvvtWmjKMOylu3JWL40T";

  const isLightMode = localStorage.getItem("lightMode");
  let lightMode;

  if (isLightMode == "false") {
    document.body.classList.add("dark-mode");
  }

  if (isLightMode == "false") {
    lightMode = "streets-v2-dark";
  } else {
    lightMode = "streets-v2";
  }

  const pendingContributionsList = document.getElementById(
    "pendingContributions"
  );
  const activePinpointsList = document.getElementById("activePinpoints");
  const deletePendingContributionsList = document.getElementById(
    "deletePendingContributions"
  );
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmYesBtn = document.getElementById("confirmYesBtn");
  const confirmNoBtn = document.getElementById("confirmNoBtn");

  const pinInfoModalBg = document.querySelector(".pinInfoModalBackground");
  const pinInfoModal = document.querySelector(".pinInfoModal");
  const pinInfoCloseBtn = document.getElementById("pinInfoCloseBtn");

  const infoMeterNumber = document.getElementById("infoMeterNumber");
  const infoLocation = document.getElementById("infoLocation");
  const infoDateAdded = document.getElementById("infoDateAdded");
  const infoContributedBy = document.getElementById("infoContributedBy");
  const infoImage = document.getElementById("infoImage");

  const sendRequest = async (url, method = "GET", body = null) => {
    const options = { method };
    if (body) {
      options.headers = { "Content-Type": "application/x-www-form-urlencoded" };
      options.body = new URLSearchParams(body);
    }
    const response = await fetch(url, options);
    return response.json();
  };

  const fetchPendingPinpoints = async () => {
    if (pendingContributionsList) {
      const pinpoints = await sendRequest("../php/fetch_pending_pinpoints.php");
      pendingContributionsList.innerHTML = "";
      if (pinpoints.length > 0) {
        pinpoints.forEach((pin) => renderPendingPin(pin));
      } else {
        pendingContributionsList.innerHTML =
          "<li>No pending contributions</li>";
      }
    }
  };

  const fetchActivePinpoints = async () => {
    if (activePinpointsList) {
      const pinpoints = await sendRequest("../php/fetch_pinpoints.php");
      activePinpointsList.innerHTML = "";
      if (pinpoints.length > 0) {
        pinpoints.forEach((pin) => renderActivePin(pin));
      } else {
        activePinpointsList.innerHTML = "<li>No active pinpoints</li>";
      }
    }
  };

  const fetchDeletePendingPinpoints = async () => {
    if (deletePendingContributionsList) {
      const deletePending = await sendRequest("../php/fetch_contributed_pinpoints.php");
      deletePendingContributionsList.innerHTML = "";
      if (deletePending.length > 0) {
        console.log(deletePending)
        deletePending.forEach((pin) => renderDeletePendingPin(pin));
      } else {
        deletePendingContributionsList.innerHTML =
          "<li>No contributions yet</li>";
      }
    }
  };

  const renderPendingPin = (pin) => {
    const listItem = document.createElement("li");
    listItem.textContent = pin.meterNumber || `Pinpoint #${pin.pointId}`;

    const settingsContainer = document.createElement("div");
    settingsContainer.style.position = "relative";

    const settingsButton = document.createElement("img");
    settingsButton.src = "../assets/burgerIcon.svg";
    settingsButton.alt = "Settings";
    settingsButton.style.width = "2rem";
    settingsButton.style.cursor = "pointer";
    settingsButton.classList.add("settingsIcon");

    const dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add("dropdownMenu");
    dropdownMenu.style.display = "none";

    const viewOption = document.createElement("li");
    viewOption.textContent = "View";
    viewOption.addEventListener("click", () => {
      dropdownMenu.style.display = "none";
      pinInfoModalBg.style.display = "block";
      infoMeterNumber.innerText = `Meter Number: ${pin.meterNumber}`;
      infoLocation.innerText = `Location: ${pin.latitude}, ${pin.longitude}`;
      infoDateAdded.innerText = `Date Added: ${pin.createdAt}`;
      infoContributedBy.innerText = `Contributed By: ${pin.contributedBy}`;
      infoImage.src = `/uploads/${pin.pointImage}`;

      const customIconPath = "../assets/PinLogo.png";
      const customIcon = document.createElement("img");
      customIcon.src = customIconPath;
      customIcon.style.width = "2.5rem";
      customIcon.style.height = "2.5rem";

      const map = new maptilersdk.Map({
        container: "infoMap",
        style: lightMode,
        center: [pin.longitude, pin.latitude],
        zoom: 18,
        pitch: 0,
      });

      const marker = new maptilersdk.Marker({ element: customIcon })
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(map);
    });

    const acceptOption = document.createElement("li");
    acceptOption.textContent = "Accept";
    acceptOption.addEventListener("click", async () => {
      await handlePinAction("../php/accept_pinpoint.php", pin.pointId);
      await fetchPendingPinpoints();
      await fetchActivePinpoints();
    });

    const denyOption = document.createElement("li");
    denyOption.textContent = "Deny";
    denyOption.addEventListener("click", () => {
      showConfirmationModal(async () => {
        await handlePinAction("../php/delete_pinpoint.php", pin.pointId);
        await fetchPendingPinpoints();
      });
      dropdownMenu.style.display = "none";
    });

    dropdownMenu.append(viewOption, acceptOption, denyOption);
    settingsContainer.append(settingsButton, dropdownMenu);
    listItem.appendChild(settingsContainer);
    pendingContributionsList.appendChild(listItem);

    settingsButton.addEventListener("click", () => {
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!settingsContainer.contains(e.target)) {
        dropdownMenu.style.display = "none";
      }
    });
  };

  const renderActivePin = (pin) => {
    const listItem = document.createElement("li");
    listItem.textContent = pin.meterNumber || `Pinpoint #${pin.pointId}`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("removeBtn");
    removeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      showConfirmationModal(async () => {
        await handlePinAction("../php/delete_pinpoint.php", pin.pointId);
        await fetchActivePinpoints();
      });
    });

    listItem.addEventListener("click", () => {
      pinInfoModalBg.style.display = "block";
      infoMeterNumber.innerText = `Meter Number: ${pin.meterNumber}`;
      infoLocation.innerText = `Location: ${pin.latitude}, ${pin.longitude}`;
      infoDateAdded.innerText = `Date Added: ${pin.createdAt}`;
      infoContributedBy.innerText = `Contributed By: ${pin.contributedBy}`;
      infoImage.src = `/uploads/${pin.pointImage}`;

      const customIconPath = "../assets/PinLogo.png";
      const customIcon = document.createElement("img");
      customIcon.src = customIconPath;
      customIcon.style.width = "2.5rem";
      customIcon.style.height = "2.5rem";

      const map = new maptilersdk.Map({
        container: "infoMap",
        style: lightMode,
        center: [pin.longitude, pin.latitude],
        zoom: 18,
        pitch: 0,
      });

      const marker = new maptilersdk.Marker({ element: customIcon })
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(map);
    });

    listItem.appendChild(removeButton);
    activePinpointsList.appendChild(listItem);
  };

  const renderDeletePendingPin = (pin) => {
    const listItem = document.createElement("li");
    listItem.textContent = pin.meterNumber || `Pinpoint #${pin.pointId}`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("removeBtn");
    removeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      showConfirmationModal(async () => {
        await handlePinAction("../php/delete_pinpoint.php", pin.pointId);
        await fetchDeletePendingPinpoints();
      });
    });

    listItem.addEventListener("click", () => {
      pinInfoModalBg.style.display = "block";
      infoMeterNumber.innerText = `Meter Number: ${pin.meterNumber}`;
      infoLocation.innerText = `Location: ${pin.latitude}, ${pin.longitude}`;
      infoDateAdded.innerText = `Date Added: ${pin.createdAt}`;
      infoContributedBy.innerText = `Contributed By: ${pin.contributedBy}`;
      infoImage.src = `/uploads/${pin.pointImage}`;

      const customIconPath = "../assets/PinLogo.png";
      const customIcon = document.createElement("img");
      customIcon.src = customIconPath;
      customIcon.style.width = "2.5rem";
      customIcon.style.height = "2.5rem";

      const map = new maptilersdk.Map({
        container: "infoMap",
        style: lightMode,
        center: [pin.longitude, pin.latitude],
        zoom: 18,
        pitch: 0,
      });

      const marker = new maptilersdk.Marker({ element: customIcon })
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(map);
    });

    listItem.appendChild(removeButton);
    deletePendingContributionsList.appendChild(listItem);
  };

  const showConfirmationModal = (onConfirm) => {
    confirmationModal.style.display = "flex";

    const confirmYesHandler = async () => {
      await onConfirm();
      confirmationModal.style.display = "none";
      confirmYesBtn.removeEventListener("click", confirmYesHandler);
    };

    confirmYesBtn.addEventListener("click", confirmYesHandler);
    confirmNoBtn.addEventListener(
      "click",
      () => {
        confirmationModal.style.display = "none";
      },
      { once: true }
    );
  };

  const handlePinAction = async (url, pointId) => {
    try {
      const result = await sendRequest(url, "POST", { pointId });
      if (result.status !== "success") {
        alert(result.message || "Action failed. Please try again.");
      }
    } catch (error) {
      console.error(`Error with action at ${url}:`, error);
      alert("An error occurred. Please try again.");
    }
  };

  pinInfoModalBg.addEventListener("click", () => {
    pinInfoModalBg.style.display = "none";
  });

  pinInfoCloseBtn.addEventListener("click", () => {
    pinInfoModalBg.style.display = "none";
  });

  pinInfoModal.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  const pendingSearch = document.getElementById("pendingSearch");
  const activeSearch = document.getElementById("activeSearch");
  const deletePendingSearch = document.getElementById("deletePendingSearch");

  const filterPendingContributions = () => {
    const searchTerm = pendingSearch.value.toLowerCase();
    const listItems = pendingContributionsList.querySelectorAll("li");

    listItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  };

  const filterActivePinpoints = () => {
    const searchTerm = activeSearch.value.toLowerCase();
    const listItems = activePinpointsList.querySelectorAll("li");

    listItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  };

  const filterDeletePendingSearch = () => {
    const searchTerm = deletePendingSearch.value.toLowerCase();
    const listItems = deletePendingContributionsList.querySelectorAll("li");

    listItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  };

  if(pendingSearch)
    pendingSearch.addEventListener("input", filterPendingContributions);

  if(activeSearch)
    activeSearch.addEventListener("input", filterActivePinpoints);

  if(deletePendingSearch)
    deletePendingSearch.addEventListener("input", filterDeletePendingSearch);

  fetchPendingPinpoints();
  fetchActivePinpoints();
  fetchDeletePendingPinpoints();
});
