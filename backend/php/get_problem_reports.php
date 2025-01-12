<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$adminId = $_SESSION['admin_id'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ParkingSystem";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "
    SELECT z.ID_Zgloszenia, p.Nazwa AS Nazwa_Parkingu, z.Opis_Problemu, z.Data_Zgloszenia
    FROM Zgloszenie z
    JOIN admin_parking ap ON z.ID_Parkingu = ap.ID_Parkingu
    JOIN Parking p ON z.ID_Parkingu = p.ID_Parkingu
    WHERE ap.ID_Administratora = ? AND z.Status_Zgloszenia = 'Pending'
";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param("i", $adminId);
$stmt->execute();
$result = $stmt->get_result();

$problems = [];
while ($row = $result->fetch_assoc()) {
    $problems[] = $row;
}

echo json_encode(["success" => true, "problems" => $problems]);

$stmt->close();
$conn->close();
?>