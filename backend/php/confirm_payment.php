<?php
header('Content-Type: application/json');
session_start();

if (!isset($_GET['reservation_id'])) {
    echo json_encode(["success" => false, "message" => "Reservation ID is required."]);
    exit();
}

$reservationId = $_GET['reservation_id'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ParkingSystem";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "UPDATE Rezerwacja SET Status = 'Confirmed' WHERE ID_Rezerwacji = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param("i", $reservationId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>