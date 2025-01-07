<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
$mysqli = new mysqli('localhost', 'root', '', 'parkingsystem');
if ($mysqli->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed."]));
}

// Logout handler
if (isset($_GET['logout'])) {
    session_unset(); // Usuwa wszystkie zmienne sesji
    session_destroy(); // Niszczy sesję
    echo json_encode(["success" => true]);
    exit();
}


// Check if admin is logged in
if (isset($_SESSION['admin_id'])) {
    $adminId = $_SESSION['admin_id'];
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email'], $_POST['password'])) {
    // Login handler
    $email = $_POST['email'];
    $password = $_POST['password'];

    $query = "SELECT * FROM administrator WHERE Email = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();

    if ($admin && password_verify($password, $admin['Haslo'])) {
        $_SESSION['admin_id'] = $admin['ID_Administratora'];
        echo json_encode(["success" => true, "admin_id" => $admin['ID_Administratora']]);
        exit();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid credentials."]);
        exit();
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
    exit();
}

// Load dashboard
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($adminId)) {
    $parkingsQuery = "SELECT * FROM parking WHERE ID_Administratora = ?";
    $stmt = $mysqli->prepare($parkingsQuery);
    $stmt->bind_param('i', $adminId);
    $stmt->execute();
    $parkings = $stmt->get_result();

    $response = [];
    while ($parking = $parkings->fetch_assoc()) {
        $pricesQuery = "SELECT * FROM cennik WHERE ID_Parkingu = ?";
        $priceStmt = $mysqli->prepare($pricesQuery);
        $priceStmt->bind_param('i', $parking['ID_Parkingu']);
        $priceStmt->execute();
        $prices = $priceStmt->get_result()->fetch_all(MYSQLI_ASSOC);

        $parking['cennik'] = $prices;
        $response[] = $parking;
    }

    echo json_encode(["success" => true, "parkings" => $response]);
    exit();
}


// Aktualizacja parkingu
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'], $_POST['name'], $_POST['location'], $_POST['type'])) {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $location = $_POST['location'];
    $type = $_POST['type'];

    $updateParkingQuery = "UPDATE parking SET Nazwa = ?, Lokalizacja = ?, Typ = ? WHERE ID_Parkingu = ?";
    $stmt = $mysqli->prepare($updateParkingQuery);
    $stmt->bind_param('sssi', $name, $location, $type, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update parking."]);
    }
    exit();
}

// Aktualizacja cennika
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'], $_POST['hourlyRate'], $_POST['dailyRate'], $_POST['monthlyRate'])) {
    $id = $_POST['id'];
    $hourlyRate = $_POST['hourlyRate'];
    $dailyRate = $_POST['dailyRate'];
    $monthlyRate = $_POST['monthlyRate'];

    $updatePricingQuery = "UPDATE cennik SET CenaZaH = ?, CenaZaDzien = ?, CenaZaMiesiac = ? WHERE ID_Cennika = ?";
    $stmt = $mysqli->prepare($updatePricingQuery);
    $stmt->bind_param('dddi', $hourlyRate, $dailyRate, $monthlyRate, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update pricing."]);
    }
    exit();
}

?>
