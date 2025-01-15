<?php
header('Content-Type: text/html; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    $input = json_decode(file_get_contents('php://input'), true);
    $startDate = $input['startDate'] ?? '';
    $endDate = $input['endDate'] ?? '';

    if (!$startDate || !$endDate) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid date range']);
        exit;
    }

    try {
        $pdo = new PDO('mysql:host=localhost;dbname=parkingsystem', 'root', '');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "SELECT * FROM rezerwacja WHERE Data_Rezerwacji BETWEEN :startDate AND :endDate";
        $stmt = $pdo->prepare($query);
        $stmt->execute(['startDate' => $startDate, 'endDate' => $endDate]);

        $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $totalPrice = 0;
        $paymentTypes = ['Za godzinę' => 0, 'Za dzień' => 0, 'Za miesiąc' => 0];

        foreach ($reservations as $reservation) {
            $totalPrice += $reservation['Cena'];
            $paymentTypes[$reservation['Typ_Ceny']]++;
        }

        $filename = "report_{$startDate}_to_{$endDate}.csv";
        $file = fopen('php://output', 'w');

        header('Content-Type: text/csv');
        header("Content-Disposition: attachment; filename={$filename}");

        // fputcsv($file, [
        //     'ID_Rezerwacji', 'ID_Uzytkownika', 'ID_Parkingu', 'ID_Pojazdu', 
        //     'Data_Rezerwacji', 'Data_Wygasniecia', 'Cena', 'Status', 
        //     'Data_Modyfikacji', 'Typ_Ceny'
        // ]);

        // foreach ($reservations as $row) {
        //     fputcsv($file, $row);
        // }

        fputcsv($file, []); // Empty line
        fputcsv($file, ['Total Price', $totalPrice]);
        fputcsv($file, ['Hourly Payments', $paymentTypes['Za godzinę']]);
        fputcsv($file, ['Daily Payments', $paymentTypes['Za dzień']]);
        fputcsv($file, ['Monthly Payments', $paymentTypes['Za miesiąc']]);

        fclose($file);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to generate report: ' . $e->getMessage()]);
    }
}
?>