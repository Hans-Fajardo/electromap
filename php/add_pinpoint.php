<?php
require_once "db.php";
session_start();
if (!isset($_SESSION['email'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

$response = ["success" => false, "message" => ""];

if ($data) {
    $meter_number = $data['meterNumber'];
    $latitude = $data['latitude'];
    $longitude = $data['longitude'];
    $image = $data['image'];
    if($_SESSION['email'] == null) {
        $contributedBy = $data['email'];
    } else {
        $contributedBy = $_SESSION['email'];
    }

    if (!$meter_number || !$latitude || !$longitude || !$image) {
        $response['message'] = "Invalid input data.";
        echo json_encode($response);
        exit;
    }

    $image_parts = explode(";base64,", $image);
    $image_type = str_replace("data:image/", "", $image_parts[0]);
    $image_base64 = base64_decode($image_parts[1]);

    $image_file_name = uniqid("pinpoint_", true) . "." . $image_type;
    $image_file_path = "../uploads/" . $image_file_name;

    if (!is_dir("../uploads")) {
        mkdir("../uploads", 0777, true);
    }

    if (!file_put_contents($image_file_path, $image_base64)) {
        $response['message'] = "Failed to save the image.";
        echo json_encode($response);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO pinpoints (meterNumber, latitude, longitude, pointImage, contributedBy) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sddss", $meter_number, $latitude, $longitude, $image_file_name, $contributedBy);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Pinpoint added successfully.";
    } else {
        $response['message'] = "Database error: " . $stmt->error;
    }

    $stmt->close();
} else {
    $response['message'] = "Invalid request data.";
}

echo json_encode($response);
