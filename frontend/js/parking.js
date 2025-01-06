// Pobieranie danych parkingów z backendu
function fetchAndDisplayParkings() {
  fetch('../backend/php/get_parkings.php')
    .then((response) => response.json())
    .then((parkings) => {
      const parkingList = document.getElementById('parking-ul')
      parkingList.innerHTML = ''

      parkings.forEach((parking) => {
        const li = document.createElement('li')
        li.textContent = `${parking.Nazwa} - ${parking.Lokalizacja} - Available spots: ${parking.Liczba_Miejsc} (${parking.Typ})`
        li.dataset.parkingId = parking.ID_Parkingu // Dodaj ID parkingu do dataset
        li.dataset.parkingName = parking.Nazwa // Dodaj nazwę parkingu
        li.addEventListener('click', openReservationModal) // Obsługa kliknięcia
        parkingList.appendChild(li)
      })
    })
    .catch((error) => console.error('Error fetching parking data:', error))
}

// Funkcja otwierająca modal z formularzem rezerwacji
function openReservationModal(event) {
  const parkingId = event.currentTarget.dataset.parkingId
  const parkingName = event.currentTarget.dataset.parkingName

  const modal = document.getElementById('reservation-modal')
  const parkingNameDisplay = document.getElementById('reservation-parking-name')
  const parkingIdInput = document.getElementById('reservation-parking-id')

  parkingNameDisplay.textContent = `Parking: ${parkingName}`
  parkingIdInput.value = parkingId // Przekazanie ID parkingu do ukrytego pola formularza
  modal.classList.remove('hidden') // Pokaż modal
}
