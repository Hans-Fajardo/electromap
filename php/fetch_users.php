<?php
include 'db.php';

header('Content-Type: application/json');

session_start();

if (!isset($_SESSION['email'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$userEmail = $_SESSION['email'];

$sql = "SELECT userId, username, email, role FROM user WHERE email != ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['error' => 'SQL error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("s", $userEmail);
$stmt->execute();
$result = $stmt->get_result();

$users = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode($users);

$stmt->close();
$conn->close();
