<?php
session_start();

// Sprawdzenie, czy użytkownik jest zalogowany
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id']; // ID zalogowanego użytkownika
$input = json_decode(file_get_contents("php://input"), true);

// Pobieranie danych pojazdu z żądania
$nr_rejestracyjny = $input['nr_rejestracyjny'] ?? '';
$marka = $input['marka'] ?? '';
$model = $input['model'] ?? '';
$typ = $input['typ'] ?? '';

// Walidacja danych
if (empty($nr_rejestracyjny) || empty($marka) || empty($model) || empty($typ)) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

// Połączenie z bazą danych
$conn = new mysqli("localhost", "root", "", "ParkingSystem");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Dodawanie pojazdu do tabeli
$stmt = $conn->prepare("INSERT INTO Pojazd (ID_Uzytkownika, Nr_Rejestracyjny, Marka, Model, Typ) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $user_id, $nr_rejestracyjny, $marka, $model, $typ);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Vehicle added successfully"]);
} else {
    echo json_encode(["error" => "Failed to add vehicle", "details" => $conn->error]);
}

$stmt->close();
$conn->close();
?>
