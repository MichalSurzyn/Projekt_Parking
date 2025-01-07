<?php
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' || !isset($_SESSION['userId'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$userId = $_SESSION['userId'];
$vehicleId = $_GET['id'] ?? null;

if (!$vehicleId) {
    echo json_encode(["success" => false, "message" => "Vehicle ID is required."]);
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

$sql = "DELETE FROM Pojazd WHERE ID_Pojazdu = ? AND ID_Uzytkownika = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param("ii", $vehicleId, $userId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>