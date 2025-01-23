<?php
require_once "db.php";

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

$response = ["success" => false, "message" => "", "results" => []];

if ($data && isset($data['searchQuery'])) {
    $searchQuery = '%' . $data['searchQuery'] . '%';

    $stmt = $conn->prepare("SELECT * FROM pinpoints WHERE meterNumber LIKE ? AND isApproved = 1");
    $stmt->bind_param("s", $searchQuery);
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
