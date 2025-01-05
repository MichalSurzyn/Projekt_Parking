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
$dbpassword = "";
$dbname = "ParkingSystem";

$conn = new mysqli($servername, $username, $dbpassword, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Błąd połączenia z bazą danych."]);
    exit();
}

$stmt = $conn->prepare("SELECT ID_Pojazdu, Nr_Rejestracyjny, Marka, Model, Typ FROM Pojazd WHERE ID_Uzytkownika = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$vehicles = [];
while ($row = $result->fetch_assoc()) {
    $vehicles[] = $row;
}

echo json_encode(["success" => true, "vehicles" => $vehicles]);

$stmt->close();
$conn->close();
?>
