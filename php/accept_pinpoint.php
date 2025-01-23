<?php
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['pointId']) && !empty($_POST['pointId'])) {
        $pointId = intval($_POST['pointId']);

        $sql = "UPDATE pinpoints SET isApproved = 1 WHERE pointId = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("i", $pointId);

            if ($stmt->execute()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "Pinpoint approved successfully.",
                ]);
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Failed to approve the pinpoint.",
                ]);
            }

            $stmt->close();
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to prepare the database query.",
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid or missing pointId.",
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method. Use POST.",
    ]);
}

$conn->close();
?>
