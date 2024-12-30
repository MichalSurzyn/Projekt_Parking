<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Credentials: true");

echo json_encode($_SESSION);

// Sprawdzenie, czy użytkownik jest zalogowany
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Połączenie z bazą danych
$conn = new mysqli("localhost", "root", "", "ParkingSystem");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Pobieranie listy pojazdów użytkownika
$stmt = $conn->prepare("SELECT * FROM Pojazd WHERE ID_Uzytkownika = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$vehicles = [];
while ($row = $result->fetch_assoc()) {
    $vehicles[] = $row;
}

echo json_encode($vehicles);

$stmt->close();
$conn->close();
?>
