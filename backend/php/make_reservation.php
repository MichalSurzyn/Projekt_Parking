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
$endDate = $_POST['end_date'] ?? null;
$priceType = $_POST['price_type'] ?? 'Za godzinę'; // Default to hourly
$price = $_POST['price'] ?? 0.00;

if (!$parkingId || !$vehicleId || !$endDate || !$price) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}

$startDate = date('Y-m-d H:i:s'); // Set start date to now

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ParkingSystem";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "INSERT INTO Rezerwacja (ID_Uzytkownika, ID_Parkingu, ID_Pojazdu, Data_Rezerwacji, Data_Wygasniecia, Typ_Ceny, Cena, Status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param("iiisssd", $userId, $parkingId, $vehicleId, $startDate, $endDate, $priceType, $price);

if ($stmt->execute()) {
    $reservationId = $stmt->insert_id;

    // Dodaj rekord do tabeli platnosc
    $paymentSql = "INSERT INTO Platnosc (ID_Rezerwacji, Status_Platnosci, Data_Platnosci, Rodzaj, Data_Modyfikacji) 
                   VALUES (?, 'Pending', NOW(), 'Standardowa', NOW())";
    $paymentStmt = $conn->prepare($paymentSql);
    if ($paymentStmt) {
        $paymentStmt->bind_param("i", $reservationId);
        $paymentStmt->execute();
        $paymentStmt->close();
    }

    echo json_encode(["success" => true, "reservationId" => $reservationId]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>