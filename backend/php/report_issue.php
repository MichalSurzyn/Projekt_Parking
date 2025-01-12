<?php
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit();
}

if (!isset($_SESSION['userId'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$parkingId = $_POST['parking_id'] ?? null;
$description = $_POST['description'] ?? null;
$userId = $_SESSION['userId'];

if (!$parkingId || !$description) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
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

$sql = "INSERT INTO Zgloszenie (ID_Uzytkownika, ID_Parkingu, Opis_Problemu, Status_Zgloszenia, Data_Zgloszenia) VALUES (?, ?, ?, 'Pending', NOW())";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param("iis", $userId, $parkingId, $description);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>