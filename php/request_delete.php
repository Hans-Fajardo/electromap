<?php
include 'db.php';

if (isset($_POST['pointId'])) {
    $pointId = intval($_POST['pointId']);

    try {
        $query = "UPDATE pinpoints SET requestDelete = 1 WHERE pointId = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $pointId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode([
                "status" => "success",
                "message" => "Request to delete the pin was successfully updated."
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "No matching pointId found or already updated."
            ]);
        }

        $stmt->close();
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "pointId is required."
    ]);
}

$conn->close();
