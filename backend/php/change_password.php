<?php
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit();
}

if (!isset($_SESSION['userId'])) {
    echo json_encode(["success" => false, "message" => "User not logged in."]);
    exit();
}

$userId = $_SESSION['userId'];
$data = json_decode(file_get_contents("php://input"), true);

$currentPassword = $data['currentPassword'] ?? null;
$newPassword = $data['newPassword'] ?? null;
$confirmNewPassword = $data['confirmNewPassword'] ?? null;

if (!$currentPassword || !$newPassword || !$confirmNewPassword) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}

if ($newPassword !== $confirmNewPassword) {
    echo json_encode(["success" => false, "message" => "New passwords do not match."]);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ParkingSystem";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "SELECT Haslo FROM Uzytkownik WHERE ID_Uzytkownika = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->bind_result($hashedPassword);
$stmt->fetch();
$stmt->close();

if (!password_verify($currentPassword, $hashedPassword)) {
    echo json_encode(["success" => false, "message" => "Current password is incorrect."]);
    $conn->close();
    exit();
}

$newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
$sql = "UPDATE Uzytkownik SET Haslo = ? WHERE ID_Uzytkownika = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $newHashedPassword, $userId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Password changed successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to change password."]);
}

$stmt->close();
$conn->close();
?>