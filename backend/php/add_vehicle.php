<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['userId'])) {
    echo json_encode(["success" => false, "message" => "Użytkownik nie jest zalogowany."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['nrRejestracyjny'], $data['marka'], $data['model'], $data['typ'])) {
    echo json_encode(["success" => false, "message" => "Wszystkie pola są wymagane."]);
    exit();
}

$nrRejestracyjny = $data['nrRejestracyjny'];
$marka = $data['marka'];
$model = $data['model'];
$typ = $data['typ'];
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

$stmt = $conn->prepare("INSERT INTO Pojazd (ID_Uzytkownika, Nr_Rejestracyjny, Marka, Model, Typ) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $userId, $nrRejestracyjny, $marka, $model, $typ);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Pojazd został dodany."]);
} else {
    echo json_encode(["success" => false, "message" => "Błąd podczas dodawania pojazdu."]);
}

$stmt->close();
$conn->close();
?>
