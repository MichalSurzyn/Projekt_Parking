<?php
session_start();

// Sprawdzenie, czy użytkownik jest zalogowany
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$input = json_decode(file_get_contents("php://input"), true);

// Pobranie ID pojazdu z żądania
$vehicle_id = $input['id_pojazdu'] ?? 0;

// Połączenie z bazą danych
$conn = new mysqli("localhost", "root", "", "ParkingSystem");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Aktualizacja ID_Pojazdu w tabeli Uzytkownik
$stmt = $conn->prepare("UPDATE Uzytkownik SET ID_Pojazdu = ? WHERE ID_Uzytkownika = ?");
$stmt->bind_param("ii", $vehicle_id, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Vehicle changed successfully"]);
} else {
    echo json_encode(["error" => "Failed to change vehicle", "details" => $conn->error]);
}

$stmt->close();
$conn->close();
?>
