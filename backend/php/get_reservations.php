<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['userId'])) {
    echo json_encode(["success" => false, "message" => "Użytkownik nie jest zalogowany."]);
    exit();
}

$userId = $_SESSION['userId'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ParkingSystem";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Błąd połączenia z bazą danych."]);
    exit();
}

$sql = "SELECT r.ID_Rezerwacji, p.Nazwa AS ParkingName, v.Marka AS VehicleName, r.Data_Rezerwacji AS StartDate, r.Data_Wygasniecia AS EndDate, r.Status 
        FROM Rezerwacja r
        JOIN Parking p ON r.ID_Parkingu = p.ID_Parkingu
        JOIN Pojazd v ON r.ID_Pojazdu = v.ID_Pojazdu
        WHERE r.ID_Uzytkownika = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Błąd zapytania: " . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$reservations = [];
while ($row = $result->fetch_assoc()) {
    $reservations[] = $row;
}

echo json_encode(["success" => true, "reservations" => $reservations]);

$stmt->close();
$conn->close();
?>