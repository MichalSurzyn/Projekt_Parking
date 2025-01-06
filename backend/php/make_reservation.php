<?php
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['userId'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$userId = $_SESSION['userId'];
$parkingId = $_POST['parking_id'] ?? null;
$vehicleId = $_POST['vehicle_id'] ?? null;
$startDate = $_POST['start_date'] ?? null;
$endDate = $_POST['end_date'] ?? null;

if (!$parkingId || !$vehicleId || !$startDate || !$endDate) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ParkingSystem";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO Rezerwacja (ID_Uzytkownika, ID_Parkingu, ID_Pojazdu, Data_Rezerwacji, Data_Wygasniecia, Cena, Status) 
        VALUES (?, ?, ?, ?, ?, 0.00, 'Pending')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iiiss", $userId, $parkingId, $vehicleId, $startDate, $endDate);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
