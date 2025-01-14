<?php
// Konfiguracja połączenia z bazą danych
$servername = "localhost";
$username = "root"; // Nazwa użytkownika bazy danych
$password = ""; // Hasło użytkownika bazy danych
$dbname = "ParkingSystem"; // Nazwa bazy danych

// Nawiązywanie połączenia z bazą
$conn = new mysqli($servername, $username, $password, $dbname);

// Sprawdzanie połączenia
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Pobranie parametru ID miasta, jeśli jest podany
$city_id = isset($_GET['city_id']) ? (int)$_GET['city_id'] : 0;

// Zapytanie SQL do pobrania parkingów z filtrem lub bez
if ($city_id > 0) {
    $sql = "SELECT 
                p.ID_Parkingu, 
                p.Nazwa, 
                p.Lokalizacja, 
                p.Liczba_Miejsc - (
                    SELECT COUNT(*) 
                    FROM Rezerwacja r 
                    WHERE r.ID_Parkingu = p.ID_Parkingu 
                    AND r.Status = 'Confirmed' 
                    AND r.Data_Wygasniecia > NOW()
                ) AS AvailableSpots, 
                p.Typ 
            FROM Parking p 
            WHERE p.ID_Miasta = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $city_id);
} else {
    $sql = "SELECT 
                p.ID_Parkingu, 
                p.Nazwa, 
                p.Lokalizacja, 
                p.Liczba_Miejsc - (
                    SELECT COUNT(*) 
                    FROM Rezerwacja r 
                    WHERE r.ID_Parkingu = p.ID_Parkingu 
                    AND r.Status = 'Confirmed' 
                    AND r.Data_Wygasniecia > NOW()
                ) AS AvailableSpots, 
                p.Typ 
            FROM Parking p";
    $stmt = $conn->prepare($sql);
}


$stmt->execute();
$result = $stmt->get_result();

// Tablica na wyniki
$parkings = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $parkings[] = $row;
    }
}

// Zwracanie danych w formacie JSON
header('Content-Type: application/json');
echo json_encode($parkings);

// Zamknięcie połączenia
$stmt->close();
$conn->close();
?>