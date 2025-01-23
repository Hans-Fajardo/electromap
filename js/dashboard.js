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
  // style: "streets-v2",
  // style: "streets-v2-dark",
  center: [120.810966, 14.843328], // starting position [lng, lat]
  zoom: 10, // starting zoom
  pitch: 0,
});

const customIconPath = "../assets/PinLogo.png";
const informationModal = document.querySelector(".informationModal");
const infoMeterNumber = document.getElementById("infoMeterNumber");
const infoLocation = document.getElementById("infoLocation");
const infoDateAdded = document.getElementById("infoDateAdded");
const infoContributedBy = document.getElementById("infoContributedBy");
const infoImage = document.getElementById("infoImage");
const driveModeDestinationList = document.getElementById(
  "driveModeDestinationList"
);
const addStopsButton = document.getElementById("addStops");
let inNavigation = false;
let allRoutings = [];
let initialPoint = null;
let stopCounter = 0;

map.on("click", resetModalInfo);

function resetModalInfo() {
  informationModal.style.transform = `translate(-50%, 200%)`;
  infoMeterNumber.innerText = "";
  infoLocation.innerText = "";
  infoDateAdded.innerText = "";
  infoContributedBy.innerText = "";
  infoImage.src = "";
}

fetch("../php/fetch_pinpoints.php")
  .then((response) => response.json())
  .then((data) => {
    const bounds = new maptilersdk.LngLatBounds();

    data.forEach((pinpoint) => {
      bounds.extend([pinpoint.longitude, pinpoint.latitude]);

      const customIcon = document.createElement("img");
      customIcon.src = customIconPath;
      customIcon.style.width = "2.5rem";
      customIcon.style.height = "2.5rem";

      const marker = new maptilersdk.Marker({ element: customIcon })
        .setLngLat([pinpoint.longitude, pinpoint.latitude])
        .addTo(map);

      customIcon.addEventListener("click", (event) => {
        if (!isDriveMode) {
          event.stopPropagation();
          informationModal.style.transform = `translate(-50%, 0)`;
          infoMeterNumber.innerText = pinpoint.meterNumber;
          infoLocation.innerText = `Location: ${pinpoint.latitude}, ${pinpoint.longitude}`;
          infoDateAdded.innerText = `Date Added: ${formatDate(
            pinpoint.createdAt
          )}`;
          infoContributedBy.innerText = `Contributed By: ${pinpoint.contributedBy}`;
          infoImage.src = `../uploads/${pinpoint.pointImage}`;
          const navigateBtn = document.getElementById("navigateBtn");
          navigateBtn.replaceWith(navigateBtn.cloneNode(true)); // Clear existing listeners
          const newNavigateBtn = document.getElementById("navigateBtn");

          newNavigateBtn.querySelector("p").innerText = "Navigate";

          if (inNavigation && pinpoint.pointId != initialPoint) {
            newNavigateBtn.style.display = "flex";
            newNavigateBtn.querySelector("p").innerText = "Add to Navigation";
          }

          if (inNavigation && pinpoint.pointId == initialPoint) {
            newNavigateBtn.style.display = "none";
          }

          newNavigateBtn.addEventListener("click", () => {
            initialPoint = pinpoint.pointId;
            allRoutings.push({
              latitude: pinpoint.latitude,
              longitude: pinpoint.longitude,
            });
            stopCounter++;

            const stopItem = document.createElement("li");
            console.log(allRoutings);
            stopItem.innerHTML = `${pinpoint.meterNumber} ${
              stopCounter > 1
                ? "<button class='removeStopBtn'>Remove</button>"
                : "<button class='removeStopBtn' hidden>Remove</button>"
            }`;
            driveModeDestinationList.appendChild(stopItem);

            stopItem
              .querySelector(".removeStopBtn")
              .addEventListener("click", () => {
                stopItem.remove();
                allRoutings = allRoutings.filter(
                  (route) =>
                    route.latitude !== pinpoint.latitude ||
                    route.longitude !== pinpoint.longitude
                );
                stopCounter--;
                startNavigation(allRoutings);
              });

            informationModal.style.transform = `translate(-50%, 200%)`;
            inNavigation = true;

            startNavigation(allRoutings);
          });
        }
      });
    });

    // Adjust the map view to fit all pinpoints
    // if (!bounds.isEmpty()) {
    //     map.fitBounds(bounds, { padding: 50 });
    // } else {
    //     console.warn("No pinpoints to display.");
    // }
    // map.rotateTo(120);
    // map.setPitch(60);
  })
  .catch((error) => console.error("Error fetching pinpoints:", error));

let userLongitude = "";
let userLatitude = "";
let userMarker;
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      hideLocationPrompt();
      userLongitude = position.coords.longitude;
      userLatitude = position.coords.latitude;

      const userIcon = document.createElement("img");
      userIcon.src = "../assets/myPosition.svg";
      userIcon.style.width = "2rem";
      userIcon.style.height = "2rem";

      userMarker = new maptilersdk.Marker({ element: userIcon })
        .setLngLat([userLongitude, userLatitude])
        .addTo(map);

      const userCoordinates = [
        position.coords.longitude,
        position.coords.latitude,
      ];
      map.setCenter(userCoordinates);
      map.setZoom(14);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        console.log("Location access denied.");
      } else {
        console.log("Error accessing location:", error.message);
      }
      showLocationPrompt();
    },
    { enableHighAccuracy: true }
  );
} else {
  alert("Geolocation is not supported by your browser.");
}

function showLocationPrompt() {
  document.getElementById("location-prompt").style.display = "flex";
}

function hideLocationPrompt() {
  document.getElementById("location-prompt").style.display = "none";
}

document.getElementById("retry-location").addEventListener("click", () => {
  hideLocationPrompt();
  checkLocation();
});

function formatDate(dateString) {
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  return formattedDate;
}

// document.addEventListener('keydown', (event) => {
//     const currentRotation = map.getBearing();
//     const currentPitch = map.getPitch();
//     if (event.key === 'ArrowUp') {
//         map.setPitch(Math.min(currentPitch + 5, 60)); // Increase tilt
//     } else if (event.key === 'ArrowDown') {
//         map.setPitch(Math.max(currentPitch - 5, 0)); // Decrease tilt
//     } else if (event.key === 'ArrowLeft') {
//         map.rotateTo(currentRotation - 5); // Rotate counterclockwise
//     } else if (event.key === 'ArrowRight') {
//         map.rotateTo(currentRotation + 5); // Rotate clockwise
//     }
// });

addStopsButton.addEventListener("click", () => {
  document.getElementById("searchBar").value = "";
  document.querySelector(".enterDriveModeContainer").style.transform =
    "translateY(-200%)";
});

document.getElementById("searchBar").addEventListener("input", function () {
  informationModal.style.transform = `translate(-50%, 200%)`;
  infoMeterNumber.innerText = "";
  infoLocation.innerText = "";
  infoDateAdded.innerText = "";
  infoContributedBy.innerText = "";
  infoImage.src = "";

  if (this.value.trim().length > 0) {
    searchMeterNumbers(this.value.trim());
  } else {
    document.getElementById("resultsContainer").innerHTML = "";
    document.getElementById("results").style.display = "none";
  }
});

async function searchMeterNumbers(query) {
  try {
    const response = await fetch("/php/search_pinpoints.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchQuery: query }),
    });

    const data = await response.json();

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
    results.forEach((result) => {
      const li = document.createElement("li");
      li.textContent = `Meter Number: ${result.meterNumber}`;

      const svgIcon = document.createElement("img");
      svgIcon.src = "../assets/chevron-upperLeft.svg";
      li.appendChild(svgIcon);

      container.appendChild(li);

      li.addEventListener("click", () => {
        focusOnPinpoint(result.latitude, result.longitude);
        informationModal.style.transform = `translate(-50%, 0)`;
        infoMeterNumber.innerText = result.meterNumber;
        infoLocation.innerText = `Location: ${result.latitude}, ${result.longitude}`;
        infoDateAdded.innerText = `Date Added: ${formatDate(result.createdAt)}`;
        infoContributedBy.innerText = `Contributed By: ${result.contributedBy}`;
        infoImage.src = `../uploads/${result.pointImage}`;
        const navigateBtn = document.getElementById("navigateBtn");
        navigateBtn.replaceWith(navigateBtn.cloneNode(true)); // Clear existing listeners
        const newNavigateBtn = document.getElementById("navigateBtn");

        newNavigateBtn.querySelector("p").innerText = "Navigate";

        if (inNavigation && result.pointId != initialPoint) {
          newNavigateBtn.style.display = "flex";
          newNavigateBtn.querySelector("p").innerText = "Add to Navigation";
        }

        if (inNavigation && result.pointId == initialPoint) {
          newNavigateBtn.style.display = "none";
        }

        newNavigateBtn.addEventListener("click", () => {
          initialPoint = result.pointId;
          allRoutings.push({
            latitude: result.latitude,
            longitude: result.longitude,
          });
          stopCounter++;

          const stopItem = document.createElement("li");
          console.log(allRoutings);
          stopItem.innerHTML = `${result.meterNumber} ${
            stopCounter > 1
              ? "<button class='removeStopBtn'>Remove</button>"
              : "<button class='removeStopBtn' hidden>Remove</button>"
          }`;
          driveModeDestinationList.appendChild(stopItem);

          stopItem
            .querySelector(".removeStopBtn")
            .addEventListener("click", () => {
              stopItem.remove();
              allRoutings = allRoutings.filter(
                (route) =>
                  route.latitude !== result.latitude ||
                  route.longitude !== result.longitude
              );
              stopCounter--;
              startNavigation(allRoutings);
            });

          informationModal.style.transform = `translate(-50%, 200%)`;
          inNavigation = true;

          startNavigation(allRoutings);
        });
      });
    });
  } else {
    container.innerHTML = "<li>No results found.</li>";
  }
}

function focusOnPinpoint(latitude, longitude) {
  map.setCenter([longitude, latitude]);
  map.setZoom(18);
}

function startNavigation(allRoutes) {
  const start = [parseFloat(userLongitude), parseFloat(userLatitude)];
  updateRoute(start, allRoutes);
}

document.getElementById("results").addEventListener("click", () => {
  document.getElementById("results").style.display = "none";
});
