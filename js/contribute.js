maptilersdk.config.apiKey = "AvvtWmjKMOylu3JWL40T";

const isLightMode = localStorage.getItem("lightMode");
let lightMode;

if (isLightMode == "false") {
  lightMode = "streets-v2-dark";
} else {
  lightMode = "streets-v2";
}

const map = new maptilersdk.Map({
  container: "map-container",
  style: lightMode,
  center: [120.810966, 14.843328], // starting position [lng, lat]
  zoom: 10, // starting zoom
  pitch: 0,
});

const popupContainer = document.getElementById("popupContainer");
const pullUpBar = document.querySelector(".pullUpBar");
const choosePinLocation = document.getElementById("choosePinLocation");
const chooseLocationBtn = document.getElementById("choose-location-btn");

const customIconPath = "../assets/PinLogo.png";
let marker = null;

const centerMarkerIcon = document.createElement("img");
centerMarkerIcon.src = customIconPath;
centerMarkerIcon.style.width = "2rem";
centerMarkerIcon.style.height = "2rem";
centerMarkerIcon.style.position = "absolute";
centerMarkerIcon.style.top = "50%";
centerMarkerIcon.style.left = "50%";
centerMarkerIcon.style.transform = "translate(-50%, -50%)";
centerMarkerIcon.style.pointerEvents = "none";
centerMarkerIcon.style.zIndex = "990";
document.body.appendChild(centerMarkerIcon);

let isDragging = false;
let startY = 0;
let currentY = 0;
let containerY = 0;
const snapThreshold = 100;
const dragAmplifier = 1.2;
let isPicking = true;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    const userLongitude = position.coords.longitude;
    const userLatitude = position.coords.latitude;

    const userCoordinates = [userLongitude, userLatitude];
    map.setCenter(userCoordinates);
    map.setZoom(17);
  });
} else {
  alert("Geolocation is not supported by your browser.");
}

// map.on("click", function (e) {
//   if (isPicking) {
//     const latLng = e.lngLat;

//     if (!marker) {
//       const clickedIcon = document.createElement("img");
//       clickedIcon.src = customIconPath;
//       clickedIcon.style.width = "2rem";
//       clickedIcon.style.height = "2rem";
//       choosePinLocation.style.display = "none";

//       marker = new maptilersdk.Marker({ element: clickedIcon })
//         .setLngLat([latLng.lng, latLng.lat])
//         .addTo(map);
//     } else {
//       marker.setLngLat([latLng.lng, latLng.lat]);
//     }

//     const clickedPopup = new maptilersdk.Popup({ offset: 25 }).setHTML(
//       `<strong>Latitude:</strong> ${latLng.lat}<br><strong>Longitude:</strong> ${latLng.lng}`
//     );
//     marker.setPopup(clickedPopup);
//     marker.togglePopup();

//     popupContainer.style.transform = "translateY(0)";
//   }
// });

function onDragStart(e) {
  isDragging = true;
  startY = e.touches ? e.touches[0].clientY : e.clientY;
  containerY =
    parseInt(popupContainer.style.transform.replace(/[^\d.-]/g, ""), 10) || 0;
  pullUpBar.style.cursor = "grabbing";
}

function onDragMove(e) {
  if (!isDragging) return;

  currentY = e.touches ? e.touches[0].clientY : e.clientY;
  let deltaY = (currentY - startY) * dragAmplifier;

  if (Math.abs(deltaY) < 3) return;

  const newY = Math.max(0, containerY + deltaY);
  popupContainer.style.transform = `translateY(${newY}px)`;
}

function onDragEnd() {
  if (!isDragging) return;
  isDragging = false;

  const popupHeight = popupContainer.getBoundingClientRect().height;
  const currentTransform =
    parseInt(popupContainer.style.transform.replace(/[^\d.-]/g, ""), 10) || 0;

  if (currentTransform > snapThreshold) {
    stopCamera();
    addBtn.style.display = "block";
    popupContainer.style.transform = `translateY(100%)`;
    if (isAdding) {
      choosePinLocation.style.display = "block";
    }
    isPicking = true;
    meterNumberInput.removeAttribute("readonly");
    meterNumberInput.value = "";
    previewImage.value = "";
    previewImage.style.display = "none";
    document.querySelector(".imageOverlay").style.display = "flex";
    cameraFeed.style.display = "none";
    captureBtn.style.display = "none";
    switchCameraBtn.style.display = "none";
    isCaptured = false;

    if (document.getElementById("removeBtn")) {
      document.getElementById("removeBtn").style.display = "none";
    }

    if (marker) {
      marker.remove();
      marker = null;
    }
  } else {
    popupContainer.style.transform = `translateY(0)`;
  }

  pullUpBar.style.cursor = "grab";
}

pullUpBar.addEventListener("mousedown", onDragStart);
pullUpBar.addEventListener("touchstart", onDragStart);

document.addEventListener("mousemove", onDragMove);
document.addEventListener("touchmove", onDragMove);

document.addEventListener("mouseup", onDragEnd);
document.addEventListener("touchend", onDragEnd);

if (chooseLocationBtn) {
  chooseLocationBtn.addEventListener("click", () => {
    const centerCoords = map.getCenter();

    if (!marker) {
      // Create a new marker if it doesn't exist
      const userMarkerIcon = document.createElement("img");
      userMarkerIcon.src = customIconPath;
      userMarkerIcon.style.width = "2rem";
      userMarkerIcon.style.height = "2rem";

      marker = new maptilersdk.Marker({ element: userMarkerIcon })
        .setLngLat([centerCoords.lng, centerCoords.lat])
        .addTo(map);
    } else {
      // Update the position of the existing marker
      marker.setLngLat([centerCoords.lng, centerCoords.lat]);
    }

    popupContainer.style.transform = "translateY(0)";
  });
}

//Load all pins
async function loadUserPins() {
  try {
    const response = await fetch("/php/fetch_user_pins.php");
    const pins = await response.json();

    if (pins.error) {
      console.error(pins.error);
      return;
    }

    pins.forEach((pin) => {
      const userPinIcon = document.createElement("img");
      userPinIcon.src = "/assets/pinIcon.svg";
      userPinIcon.style.width = "2rem";
      userPinIcon.style.height = "2rem";

      const userPinMarker = new maptilersdk.Marker({ element: userPinIcon })
        .setLngLat([pin.longitude, pin.latitude])
        .addTo(map);

      userPinMarker.getElement().addEventListener("click", () => {
        showPin(pin);
      });
    });
  } catch (error) {
    console.error("Error loading user pins:", error);
  }
}

function showPin(pin) {
  addBtn.style.display = "none";
  isPicking = false;
  const meterNumberInput = document.getElementById("meterNumberInput");
  meterNumberInput.value = pin.meterNumber || "";
  meterNumberInput.setAttribute("readonly", "true");

  const previewImage = document.getElementById("previewImage");
  if (pin.pointImage) {
    const imagePath = `../uploads/${pin.pointImage}`;
    previewImage.src = imagePath;
    previewImage.style.display = "block";
    document.querySelector(".imageOverlay").style.display = "none";
    captureBtn.style.display = "none";
    switchCameraBtn.style.display = "none";
    cameraFeed.style.display = "none";
  } else {
    previewImage.style.display = "none";
  }

  if (!isAdding) {
    const meterNumberContainer = document.querySelector(
      ".meterNumberContainer"
    );

    const existingRemoveBtn = document.getElementById("removeBtn");
    if (existingRemoveBtn) {
      existingRemoveBtn.remove();
    }

    const removeBtn = document.createElement("button");
    removeBtn.id = "removeBtn";
    if (pin.requestDelete == 0) {
      removeBtn.textContent = "Remove";
    } else {
      removeBtn.style.backgroundColor = "#a0a0a0";
      removeBtn.textContent = "Requesting";
    }

    meterNumberContainer.appendChild(removeBtn);

    const confirmationModal = document.getElementById("confirmationModal");
    const confirmYesBtn = document.getElementById("confirmYesBtn");
    const confirmNoBtn = document.getElementById("confirmNoBtn");

    if (pin.requestDelete == 0) {
      removeBtn.addEventListener("click", () => {
        confirmationModal.style.display = "flex";
      });
    }

    confirmYesBtn.addEventListener("click", async () => {
      try {
        const pointId = pin.pointId;
        const response = await fetch("/php/request_delete.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ pointId: pointId }),
        });

        const result = await response.json();

        if (result.status === "success") {
          userPinMarker.remove();
          addBtn.style.display = "block";
          popupContainer.style.transform = `translateY(100%)`;
          if (isAdding) {
            choosePinLocation.style.display = "block";
          }
          isPicking = true;
          meterNumberInput.removeAttribute("readonly");
          meterNumberInput.value = "";
          previewImage.value = "";
          previewImage.style.display = "none";
          document.querySelector(".imageOverlay").style.display = "flex";
          removeBtn.style.display = "none";
        } else {
          console.error("Failed to delete pinpoint:", result.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        confirmationModal.style.display = "none";
      }
    });

    confirmationModal.addEventListener("click", () => {
      confirmationModal.style.display = "none";
    });

    confirmNoBtn.addEventListener("click", () => {
      confirmationModal.style.display = "none";
    });
  }

  popupContainer.style.transform = "translateY(0)";

  if (isAdding) {
    choosePinLocation.style.display = "none";
  }
}

loadUserPins();

import Alert from "./alert.js";

const cameraFeed = document.getElementById("cameraFeed");
const captureBtn = document.getElementById("captureBtn");
const canvas = document.getElementById("capturedImage");
const previewImage = document.getElementById("previewImage");
const switchCameraBtn = document.getElementById("switchCameraBtn");
let isCaptured = false;

let stream;
let currentFacingMode = "environment";

async function startCamera(facingMode) {
  console.log("Camera Started!");
  document.querySelector(".imageOverlay").style.display = "none";
  canvas.value = "";
  previewImage.value = "";
  canvas.style.display = "none";

  const constraints = {
    video: {
      facingMode: facingMode,
    },
  };

  try {
    cameraFeed.style.display = "block";
    captureBtn.style.display = "block";
    switchCameraBtn.style.display = "block";
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    cameraFeed.srcObject = stream;
  } catch (error) {
    console.error("Error accessing the camera:", error);
    Alert.show(
      "Unable to access the camera. Please ensure camera permissions are enabled.",
      "error"
    );
  }
}

function captureImage() {
  const context = canvas.getContext("2d");
  canvas.style.display = "block";
  canvas.width = cameraFeed.videoWidth;
  canvas.height = cameraFeed.videoHeight;
  context.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/png");
  previewImage.src = imageData;
  previewImage.style.display = "block";

  isCaptured = true;

  captureBtn.style.display = "none";
  switchCameraBtn.style.display = "none";
  canvas.style.display = "none";
  cameraFeed.style.display = "none";

  stopCamera();
}

function stopCamera() {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  }
}

function switchCamera() {
  currentFacingMode =
    currentFacingMode === "environment" ? "user" : "environment";
  startCamera(currentFacingMode);
}

captureBtn.addEventListener("click", captureImage);
document.querySelector(".imageOverlay").addEventListener("click", () => {
  startCamera(currentFacingMode);
});
switchCameraBtn.addEventListener("click", switchCamera);

document.getElementById("addBtn").addEventListener("click", async () => {
  const meterNumber = document.getElementById("meterNumberInput").value.trim();
  const latitude = marker.getLngLat().lat;
  const longitude = marker.getLngLat().lng;
  const userEmail = localStorage.getItem("email");

  const canvas = document.getElementById("capturedImage");
  const imageData = canvas.toDataURL("image/png");

  if (!meterNumber || !latitude || !longitude || !imageData || !isCaptured) {
    Alert.show("Please fill in all fields and capture an image.", "error");
    return;
  }

  const data = {
    meterNumber: meterNumber,
    latitude: latitude,
    longitude: longitude,
    image: imageData,
    email: userEmail,
  };

  try {
    const response = await fetch("/php/add_pinpoint.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log(responseText);

    try {
      const result = JSON.parse(responseText);
      if (result.success) {
        Alert.show("Pinpoint added successfully!", "success");
        document.getElementById("meterNumberInput").value = "";
        document.getElementById("capturedImage").style.display = "none";
        document.getElementById("previewImage").style.display = "none";
        popupContainer.style.transform = `translateY(100%)`;
        document.querySelector(".imageOverlay").style.display = "flex";
        choosePinLocation.style.display = "block";
        isCaptured = false;
        loadUserPins();

        if (marker) {
          marker.remove();
          marker = null;
        }
      } else {
        Alert.show(`Failed to add pinpoint: ${result.message}`, "error");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      Alert.show("An error occurred while processing the response.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

if (!isAdding) {
  document.getElementById("searchBar").addEventListener("input", function () {
    if (this.value.trim().length > 0) {
      searchMeterNumbers(this.value.trim());
    } else {
      document.getElementById("resultsContainer").innerHTML = "";
      document.getElementById("results").style.display = "none";
      centerMarkerIcon.style.display = "block";
    }
  });

  async function searchMeterNumbers(query) {
    try {
      const response = await fetch("/php/search_delete_pinpoints.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery: query }),
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        displayResults(data.results);
      } else {
        document.getElementById("resultsContainer").innerHTML =
          "<li>No results found.</li>";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while searching.");
    }
  }

  function displayResults(results) {
    const container = document.getElementById("resultsContainer");
    container.innerHTML = "";

    if (results.length > 0) {
      document.getElementById("results").style.display = "block";
      centerMarkerIcon.style.display = "none";
      results.forEach((result) => {
        const li = document.createElement("li");
        li.textContent = `Meter Number: ${result.meterNumber}`;

        const svgIcon = document.createElement("img");
        svgIcon.src = "../assets/chevron-upperLeft.svg";
        li.appendChild(svgIcon);

        container.appendChild(li);

        li.addEventListener("click", () => {
          showPin(result);
        });
      });
    } else {
      container.innerHTML = "<li>No results found.</li>";
    }
  }

  document.getElementById("results").addEventListener("click", () => {
    document.getElementById("results").style.display = "none";
    centerMarkerIcon.style.display = "block";
  });
}
