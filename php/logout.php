<?php
require 'db.php';
session_start();

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $token = $input['token'] ?? '';

    // Invalidate the token in the database
    $stmt = $conn->prepare("UPDATE user SET token = NULL WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();

    echo json_encode(["message" => "Logout successful."]);
    exit();
}
?>
