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

$sql = "SELECT p.ID_Platnosci, p.ID_Rezerwacji, p.Status_Platnosci, p.Data_Platnosci, p.Rodzaj, p.Data_Modyfikacji
        FROM Platnosc p
        JOIN Rezerwacja r ON p.ID_Rezerwacji = r.ID_Rezerwacji
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

$payments = [];
while ($row = $result->fetch_assoc()) {
    $payments[] = $row;
}

echo json_encode(["success" => true, "payments" => $payments]);

$stmt->close();
$conn->close();
?>