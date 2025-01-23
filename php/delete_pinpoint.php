<?php
include 'db.php';

if (isset($_POST['pointId'])) {
    $pointId = $_POST['pointId'];

    $sql = "SELECT pointImage FROM pinpoints WHERE pointId = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $pointId);
    $stmt->execute();
    $stmt->bind_result($pointImage);
    $stmt->fetch();
    $stmt->close();

    if ($pointImage) {
        $imagePath = "../uploads/" . $pointImage;

        if (file_exists($imagePath)) {
            unlink($imagePath);
        }
    }

    $deleteSql = "DELETE FROM pinpoints WHERE pointId = ?";
    $deleteStmt = $conn->prepare($deleteSql);
    $deleteStmt->bind_param("i", $pointId);
    if ($deleteStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Pinpoint and image deleted']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete pinpoint']);
    }

    $deleteStmt->close();
}

$conn->close();
?>
