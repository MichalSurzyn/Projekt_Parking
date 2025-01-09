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

// Zapytanie SQL do pobrania miast
$sql = "SELECT ID_Miasta, Nazwa FROM Miasto";
$result = $conn->query($sql);

// Tablica na wyniki
$cities = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $cities[] = $row;
    }
}

// Zwracanie danych w formacie JSON
header('Content-Type: application/json');
echo json_encode($cities);

// Zamknięcie połączenia
$conn->close();
?>
