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
        parkingList.appendChild(li)
      })
    })
    .catch((error) => console.error('Error fetching parking data:', error))
}
