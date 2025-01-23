<?php
include 'db.php';

session_start();
if (!isset($_SESSION['email'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$userEmail = $_SESSION['email'];

$sql = "SELECT * FROM pinpoints WHERE contributedBy = ? AND isApproved = 0";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['error' => 'Failed to prepare SQL statement']);
    exit;
}

$stmt->bind_param("s", $userEmail);
$stmt->execute();

$result = $stmt->get_result();

$data = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($data);

$stmt->close();
$conn->close();
?>
