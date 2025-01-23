<?php
require 'db.php';

header('Content-Type: application/json');

session_start();
if (!isset($_SESSION['email'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$userEmail = $_SESSION['email'];

$query = "SELECT * FROM pinpoints WHERE isApproved = 0 AND contributedBy = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $userEmail);
$stmt->execute();
$result = $stmt->get_result();

$pins = [];
while ($row = $result->fetch_assoc()) {
    $pins[] = $row;
}

echo json_encode($pins);
?>
