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
  currentFacingMode = (currentFacingMode === "environment") ? "user" : "environment";
  startCamera(currentFacingMode);
}

captureBtn.addEventListener("click", captureImage);
document.querySelector(".imageOverlay").addEventListener("click", () => {startCamera(currentFacingMode)});
switchCameraBtn.addEventListener("click", switchCamera);

document.getElementById("addBtn").addEventListener("click", async () => {
  const meterNumber = document.getElementById("meterNumberInput").value.trim();
  const latitude = marker.getLngLat().lat;
  const longitude = marker.getLngLat().lng;
  const userEmail = localStorage.getItem('email');

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
