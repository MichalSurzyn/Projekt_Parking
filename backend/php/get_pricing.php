<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit();
}

$parkingId = $_GET['parking_id'] ?? null;

if (!$parkingId) {
    echo json_encode(["success" => false, "message" => "Parking ID is required."]);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ParkingSystem";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT Typ_Ceny, Cena FROM Cennik WHERE ID_Parkingu = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param("i", $parkingId);
$stmt->execute();
$result = $stmt->get_result();

$pricing = [];
while ($row = $result->fetch_assoc()) {
    $pricing[] = $row;
}

if (count($pricing) > 0) {
    echo json_encode(["success" => true, "pricing" => $pricing]);
} else {
    echo json_encode(["success" => false, "message" => "No pricing found for the given parking ID."]);
}

$stmt->close();
$conn->close();
?>
