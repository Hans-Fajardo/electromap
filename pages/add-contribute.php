<?php
session_start();

if (!isset($_SESSION['userId'])) {
    header("Location: /index.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Add Contribution | Electro Map</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script
      defer
      src="https://cdn.maptiler.com/maptiler-sdk-js/v2.3.0/maptiler-sdk.umd.js"
    ></script>
    <link
      href="https://cdn.maptiler.com/maptiler-sdk-js/v2.3.0/maptiler-sdk.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/css/app.css?v=1.0.5" />
    <link rel="stylesheet" href="/css/alert.css?v=1.0.5" />
    <link rel="manifest" href="/manifest.json?v=1.0.5" />
    <script defer src="../js/checkAuth.js?v=1.0.5"></script>
    <script defer type="module" src="../js/contribute.js?v=1.0.5"></script>
    <script defer type="module" src="../js/alert.js?v=1.0.5"></script>
  </head>
  <body id="contributeBody">
    <div id="choosePinLocation">
      <p>Drag to choose your location</p>
    </div>

    <div id="map-container"></div>

    <div id="choose-location-btn">Choose Location</div>

    <div class="navbar">
      <ul>
        <li>
          <div onclick="NavigateTo('contribute')" class="active-link">
            <img src="../assets/contributeIcon.svg" alt="contribute-icon" />
            <p>Contribute</p>
          </div>
        </li>
        <li>
          <div onclick="NavigateTo('dashboard')">
            <img src="../assets/homeIconInactive.svg" alt="dashboard-icon" />
            <p>Explore</p>
          </div>
        </li>
        <li>
          <div onclick="NavigateTo('settings')">
            <img src="../assets/profileIconInactive.svg" alt="settings-icon" />
            <p>Profile</p>
          </div>
        </li>
      </ul>
    </div>

    <div id="popupContainer">
      <div class="pullUpBar">
        <div class="pullUpBarUI"></div>
      </div>
      <div class="meterNumberContainer">
        <input
          type="text"
          id="meterNumberInput"
          placeholder="Input meter number"
          required
          aria-autocomplete="none"
        />
        <button type="submit" id="addBtn">Add</button>
      </div>
      <div class="imageContainer">
        <div class="imageOverlay"><p>Click me to add Image</p></div>
        <video id="cameraFeed" autoplay muted style="display: none"></video>
        <button id="switchCameraBtn" style="display: none">
          <img src="../assets/switchCameraIcon.svg" alt="switch-camera" />
        </button>
        <button id="captureBtn" style="display: none">
          <img
            src="../assets/captureIcon.svg"
            alt="capture-icon"
            width="24"
            height="24"
          />
        </button>
        <canvas
          id="capturedImage"
          width="200"
          height="150"
          style="display: none"
        ></canvas>
        <img id="previewImage" alt="Preview" style="display: none" />
      </div>
    </div>

    <script defer>
      let isAdding = true;
    </script>
  </body>
</html>
