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

// Zapytanie SQL do pobrania parkingów
$sql = "SELECT ID_Parkingu, Nazwa, Lokalizacja, Liczba_Miejsc, Typ FROM Parking";
$result = $conn->query($sql);

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
$conn->close();
?>
