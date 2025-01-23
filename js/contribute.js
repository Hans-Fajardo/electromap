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
centerMarkerIcon.style.zIndex = "9999";
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
    addBtn.style.display = "block";
    popupContainer.style.transform = `translateY(100%)`;
    choosePinLocation.style.display = "block";
    isPicking = true;
    meterNumberInput.removeAttribute("readonly");
    meterNumberInput.value = "";
    previewImage.value = "";
    previewImage.style.display = "none";
    document.querySelector(".imageOverlay").style.display = "flex";
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

        const meterNumberContainer = document.querySelector(
          ".meterNumberContainer"
        );
        let removeBtn = document.getElementById("removeBtn");

        if (!removeBtn) {
          removeBtn = document.createElement("button");
          removeBtn.id = "removeBtn";
          removeBtn.textContent = "Remove";

          meterNumberContainer.appendChild(removeBtn);
        } else {
          removeBtn.style.display = "block";
        }

        const confirmationModal = document.getElementById("confirmationModal");
        const confirmYesBtn = document.getElementById("confirmYesBtn");
        const confirmNoBtn = document.getElementById("confirmNoBtn");

        removeBtn.addEventListener("click", () => {
          confirmationModal.style.display = "flex";
        });

        confirmYesBtn.addEventListener("click", async () => {
          try {
            const pointId = pin.pointId;
            const response = await fetch("/php/delete_pinpoint.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({ pointId: pointId }),
            });

            const result = await response.json();

            if (result.status === "success") {
              console.log(result.message);
              userPinMarker.remove();
              addBtn.style.display = "block";
              popupContainer.style.transform = `translateY(100%)`;
              choosePinLocation.style.display = "block";
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

        popupContainer.style.transform = "translateY(0)";
        choosePinLocation.style.display = "none";
      });
    });
  } catch (error) {
    console.error("Error loading user pins:", error);
  }
}

loadUserPins();
