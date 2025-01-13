document.addEventListener('DOMContentLoaded', () => {
  const reservationListContainer = document.getElementById(
    'reservationListContainer'
  )
  const reservationList = document.getElementById('reservationList')
  const historyPaymentButton = document.getElementById('history-payment-button')

  // Sprawdź, czy użytkownik jest zalogowany
  fetch('../backend/php/check_login.php')
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        fetchAndDisplayReservations() // Załaduj rezerwacje użytkownika
      } else {
        window.location.href = 'index.html' // Przekieruj na stronę główną, jeśli nie jest zalogowany
      }
    })
    .catch((error) => console.error('Błąd podczas sprawdzania sesji:', error))

  // Funkcja ładowania rezerwacji użytkownika
  function fetchAndDisplayReservations() {
    fetch('../backend/php/get_reservations.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          reservationList.innerHTML = '' // Wyczyść istniejącą listę

          data.reservations.forEach((reservation) => {
            const li = document.createElement('li')
            li.textContent = `Parking: ${reservation.ParkingName}, Vehicle: ${reservation.VehicleName}, Start: ${reservation.StartDate}, End: ${reservation.EndDate}, Price: ${reservation.Cena}, Status: ${reservation.Status}`
            reservationList.appendChild(li)
          })
        } else {
          console.error('Error fetching reservations:', data.message)
        }
      })
      .catch((error) => console.error('Error fetching reservations:', error))
  }

  // Obsługa przycisku "History Payment"
  historyPaymentButton.addEventListener('click', () => {
    window.location.href = 'payment_history.html'
  })
})
