<?php
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit();
}

if (!isset($_SESSION['userId'])) {
    echo json_encode(["success" => false, "message" => "User not logged in."]);
    exit();
}

$userId = $_SESSION['userId'];
$data = json_decode(file_get_contents("php://input"), true);

$firstname = $data['firstname'] ?? null;
$lastname = $data['lastname'] ?? null;
$phone = $data['phone'] ?? null;
$nip = $data['nip'] ?? null;

if (!$firstname || !$lastname) {
    echo json_encode(["success" => false, "message" => "First name and last name are required."]);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ParkingSystem";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "UPDATE Uzytkownik SET Imie = ?, Nazwisko = ?, Telefon = ?, NIP = ? WHERE ID_Uzytkownika = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssi", $firstname, $lastname, $phone, $nip, $userId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Profile updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update profile."]);
}

$stmt->close();
$conn->close();
?>