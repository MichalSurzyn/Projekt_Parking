document.addEventListener('DOMContentLoaded', () => {
  const paymentHistoryList = document.getElementById('paymentHistoryList')
  const paymentFilter = document.getElementById('payment-filter')

  // Sprawdź, czy użytkownik jest zalogowany
  fetch('../backend/php/check_login.php')
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        fetchAndDisplayPaymentHistory() // Załaduj historię płatności użytkownika
      } else {
        window.location.href = 'index.html' // Przekieruj na stronę główną, jeśli nie jest zalogowany
      }
    })
    .catch((error) => console.error('Błąd podczas sprawdzania sesji:', error))

  // Funkcja ładowania historii płatności użytkownika
  function fetchAndDisplayPaymentHistory() {
    fetch('../backend/php/get_payment_history.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          paymentHistoryList.innerHTML = '' // Wyczyść istniejącą listę

          data.payments.forEach((payment) => {
            const li = document.createElement('li')
            li.textContent = `Reservation ID: ${payment.ID_Rezerwacji}, Status: ${payment.Status_Platnosci}, Date: ${payment.Data_Platnosci}, Type: ${payment.Rodzaj}, Last Modified: ${payment.Data_Modyfikacji}`
            li.dataset.status = payment.Status_Platnosci // Dodaj status jako atrybut danych
            paymentHistoryList.appendChild(li)
          })

          applyFilter() // Zastosuj filtr po załadowaniu płatności
        } else {
          console.error('Error fetching payment history:', data.message)
        }
      })
      .catch((error) => console.error('Error fetching payment history:', error))
  }

  // Funkcja filtrowania płatności
  function applyFilter() {
    const filterValue = paymentFilter.value
    const payments = paymentHistoryList.querySelectorAll('li')

    payments.forEach((payment) => {
      if (filterValue === 'all' || payment.dataset.status === filterValue) {
        payment.style.display = 'block'
      } else {
        payment.style.display = 'none'
      }
    })
  }

  // Obsługa zmiany filtra
  paymentFilter.addEventListener('change', applyFilter)
})
