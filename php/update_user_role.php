<?php
include 'db.php';

header('Content-Type: application/json');

session_start();

if (!isset($_SESSION['email'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

if (!isset($_POST['userId']) || !isset($_POST['role'])) {
    echo json_encode(['error' => 'Invalid data provided']);
    exit;
}

$userId = $_POST['userId'];
$newRole = $_POST['role'];

if (!in_array($newRole, ['user', 'admin'])) {
    echo json_encode(['error' => 'Invalid role']);
    exit;
}

$sql = "UPDATE user SET role = ? WHERE userId = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'SQL error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("si", $newRole, $userId);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Failed to update role']);
}

$stmt->close();
$conn->close();
