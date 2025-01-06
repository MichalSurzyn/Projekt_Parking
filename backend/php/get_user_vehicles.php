<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['userId'])) {
    echo json_encode([]);
    exit();
}

$userId = $_SESSION['userId'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "parkingsystem";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT ID_Pojazdu, NrRejestracyjny, Marka, Model FROM Pojazd WHERE ID_Uzytkownika = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$vehicles = [];
while ($row = $result->fetch_assoc()) {
    $vehicles[] = $row;
}

echo json_encode($vehicles);

echo json_encode($vehicles, JSON_PRETTY_PRINT);
exit();


$stmt->close();
$conn->close();
?>
