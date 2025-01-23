<?php
require 'db.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $token = $input['token'] ?? '';

    $stmt = $conn->prepare("SELECT userId, username, role FROM user WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        echo json_encode([
            "valid" => true,
            "username" => $user['username'],
            "userId" => $user['userId'],
            "role" => $user['role']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["valid" => false]);
    }
}
?>
