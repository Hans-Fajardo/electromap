let routeLayerId = "route";
let routeShadowLayerId = "route-shadow";
let orientationEventListener = null;
let isDriveMode = false;
let drivingDestinationLongitude = null;
let drivingDestinationLatitude = null;
let drivingRoutes = [];
let distanceInMeters = 0.0;
let intervalId = null;
let myCurrentLocation;

function updateRoute(start, allRoutes) {
  // drivingDestinationLongitude = end[0];
  // drivingDestinationLatitude = end[1];
  drivingRoutes = allRoutes;
  if (!isDriveMode) {
    document.querySelector(
      ".enterDriveModeContainer"
    ).style.transform = `translateY(calc(-80% + ${allRoutes.length * 38}px))`;
  } else {
    document.querySelector(
      ".enterDriveModeContainer"
    ).style.transform = `translateY(calc(-100%)`;
  }

  const routeCoordinates = allRoutes
    .map((route) => `${route.longitude},${route.latitude}`)
    .join(";");
  // const osrmApiUrl = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
  const osrmApiUrl = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${routeCoordinates}?overview=full&geometries=geojson`;

  fetch(osrmApiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Route data:", data);

      const routeGeoJSON = data.routes[0].geometry;
      distanceInMeters = data.routes[0].distance;

      const distanceString =
        distanceInMeters < 1000
          ? `${distanceInMeters.toFixed(2)} m`
          : `${(distanceInMeters / 1000).toFixed(2)} km`;

      if (map.getLayer(routeLayerId)) {
        map.removeLayer(routeLayerId);
      }
      if (map.getLayer(routeShadowLayerId)) {
        map.removeLayer(routeShadowLayerId);
      }

      if (map.getSource(routeLayerId)) {
        map.removeSource(routeLayerId);
      }

      map.addSource(routeLayerId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: routeGeoJSON,
        },
      });

      map.addLayer({
        id: routeShadowLayerId,
        type: "line",
        source: routeLayerId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "rgba(56, 99, 238, 0.2)",
          "line-width": 10,
        },
      });

      map.addLayer({
        id: routeLayerId,
        type: "line",
        source: routeLayerId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#000080",
          "line-opacity": 0.8,
          "line-width": 5,
        },
      });

      document.getElementById(
        "drivingModeDistance"
      ).innerText = `Distance: ${distanceString}`;

      const coordinates = routeGeoJSON.coordinates;

      if (!isDriveMode) {
        const bounds = coordinates.reduce(
          (bounds, coord) => bounds.extend(coord),
          new maptilersdk.LngLatBounds(coordinates[0], coordinates[0])
        );

        map.fitBounds(bounds, { padding: 100 });
      }
    })
    .catch((error) => console.error("Error fetching route:", error));
}

document.getElementById("cancelDriveModeBtn").addEventListener("click", () => {
  inNavigation = false;
  allRoutings = [];
  drivingRoutes = [];
  stopCounter = 0;
  driveModeDestinationList.innerHTML = "";
  document.getElementById("searchBar").value = "";
  document.getElementById("enterDriveModeBtn").style.backgroundColor =
    "#2ddc33";
  document.getElementById("enterDriveModeBtn").innerText = "Start Driving";
  driveModeDestinationList.style.display = "block";
  addStopsButton.style.display = "block";
  // drivingDestinationLongitude = null;
  // drivingDestinationLongitude = null;
  informationModal.style.transform = `translate(-50%, 200%)`;
  const newNavigateBtn = document.getElementById("navigateBtn");
  newNavigateBtn.querySelector("p").innerText = "Navigation";
  if (isDriveMode) {
    console.log("Stopped Driving");
    isDriveMode = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    console.log("Drive mode stopped.");
  }
  document.querySelector(".enterDriveModeContainer").style.transform =
    "translateY(-200%)";
  const userCoordinates = [userLongitude, userLatitude];

  disableOrientationUpdates();

  map.easeTo({
    pitch: 0,
    center: userCoordinates,
    zoom: 18,
    duration: 500,
    easing: (t) => t,
  });

  if (map.getLayer(routeLayerId)) {
    map.removeLayer(routeLayerId);
  }
  if (map.getLayer(routeShadowLayerId)) {
    map.removeLayer(routeShadowLayerId);
  }

  if (map.getSource(routeLayerId)) {
    map.removeSource(routeLayerId);
  }
});

document.getElementById("enterDriveModeBtn").addEventListener("click", () => {
  console.log("Entering Drive Mode...");
  document.querySelector(".enterDriveModeContainer").style.transform =
    "translateY(-100%)";
  document.getElementById("enterDriveModeBtn").style.backgroundColor =
    "#b0b0b0";
  document.getElementById("enterDriveModeBtn").innerText = "Driving";
  driveModeDestinationList.style.display = "none";
  addStopsButton.style.display = "none";
  const userCoordinates = [userLongitude, userLatitude];
  map.easeTo({
    pitch: 60,
    center: userCoordinates,
    zoom: 18,
    duration: 500,
    easing: (t) => t,
  });
  // const myDestination = [
  //   parseFloat(drivingDestinationLongitude),
  //   parseFloat(drivingDestinationLatitude),
  // ];

  setTimeout(() => {
    enableOrientationUpdates();
    if (!isDriveMode) {
      isDriveMode = true;
      intervalId = setInterval(() => {
        console.log(distanceInMeters);
        console.log(intervalId);
        if (distanceInMeters <= 50 && drivingRoutes.length > 0) {
          console.log("You have reached your destination!");

          // Remove the reached route
          drivingRoutes.shift();

          if (drivingRoutes.length > 0) {
            // Update route for the next destination
            console.log("Proceeding to the next destination...");
            updateRoute(myCurrentLocation, drivingRoutes);
          } else {
            // No more routes, exit driving mode
            console.log("All destinations reached!");
            document.getElementById("cancelDriveModeBtn").click();
          }
        } else if (drivingRoutes.length === 0) {
          // If there are no remaining routes, stop driving mode
          console.log("No more routes to navigate.");
          clearInterval(intervalId);
          isDriveMode = false;
        }
        //function while driving
        startDriving();
        if (myCurrentLocation && drivingRoutes) {
          updateRoute(myCurrentLocation, drivingRoutes);
        }
      }, 2000);
    }
  }, 700);
});

function enableOrientationUpdates() {
  if (window.DeviceOrientationEvent) {
    orientationEventListener = (event) => {
      const compassHeading = calculateCompassHeading(
        event.alpha,
        event.beta,
        event.gamma
      );

      if (compassHeading !== null) {
        map.setBearing(compassHeading);

        document.getElementById(
          "rotation"
        ).innerText = `Rotation: ${compassHeading.toFixed(2)}°`;
      }
    };

    window.addEventListener("deviceorientation", orientationEventListener);
  } else {
    alert("Device orientation is not supported by your device.");
  }
}

function disableOrientationUpdates() {
  if (orientationEventListener) {
    window.removeEventListener("deviceorientation", orientationEventListener);
    map.setBearing(0);
    orientationEventListener = null;
  }
}

function calculateCompassHeading(alpha, beta, gamma) {
  if (alpha === null || beta === null || gamma === null) {
    return null;
  }

  const alphaRad = (alpha * Math.PI) / 180;
  const betaRad = (beta * Math.PI) / 180;
  const gammaRad = (gamma * Math.PI) / 180;

  const cA = Math.cos(alphaRad);
  const sA = Math.sin(alphaRad);
  const cB = Math.cos(betaRad);
  const sB = Math.sin(betaRad);
  const cG = Math.cos(gammaRad);
  const sG = Math.sin(gammaRad);

  const compassHeading =
    Math.atan2(-sA * cB - cA * sB * sG, cA * cB - sA * sB * sG) *
    (180 / Math.PI);

  return (compassHeading + 360) % 360;
}

function startDriving() {
  navigator.geolocation.watchPosition(
    function (position) {
      const userCurrentLongitude = position.coords.longitude;
      const userCurrentLatitude = position.coords.latitude;

      myCurrentLocation = [userCurrentLongitude, userCurrentLatitude];

      if (userMarker) {
        userMarker.setLngLat(myCurrentLocation);
      } else {
        userMarker = new maptilersdk.Marker({ element: userIcon })
          .setLngLat(myCurrentLocation)
          .addTo(map);
      }

      map.setCenter(myCurrentLocation);
    },
    function (error) {
      console.error("Error getting location:", error.message);
      alert("Unable to retrieve location. Please enable location services.");
    },
    { enableHighAccuracy: true }
  );
}
