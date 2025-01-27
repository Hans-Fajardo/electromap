<?php
require_once "db.php";

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

session_start();
if (!isset($_SESSION['email'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$userEmail = $_SESSION['email'];

$response = ["success" => false, "message" => "", "results" => []];

if ($data && isset($data['searchQuery'])) {
    $searchQuery = '%' . $data['searchQuery'] . '%';

    $stmt = $conn->prepare("SELECT * FROM pinpoints WHERE meterNumber LIKE ? AND isApproved = 0 AND contributedBy = ?");
    $stmt->bind_param("ss", $searchQuery, $userEmail);
    $stmt->execute();
    $result = $stmt->get_result();

    $results = [];
    while ($row = $result->fetch_assoc()) {
        $results[] = $row;
    }

    if (count($results) > 0) {
        $response['success'] = true;
        $response['results'] = $results;
    } else {
        $response['message'] = "No results found.";
    }

    $stmt->close();
} else {
    $response['message'] = "Invalid request data.";
}

echo json_encode($response); // Return the response as JSON
?>
