<?php
require 'db.php';
session_start();

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
    $password = $input['password'];

    $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $token = bin2hex(random_bytes(16));
            $_SESSION['email'] = $user['email'];
            $_SESSION['userId'] = $user['userId'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];

            $stmt = $conn->prepare("UPDATE user SET token = ? WHERE userId = ?");
            $stmt->bind_param("si", $token, $user['userId']);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "message" => "Login successful.",
                "token" => $token
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid password."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "User not found."]);
    }
}
