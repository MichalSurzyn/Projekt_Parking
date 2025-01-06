function fetchAndDisplayParkings() {
  fetch('../backend/php/get_parkings.php')
    .then((response) => response.json())
    .then((parkings) => {
      const parkingList = document.getElementById('parking-ul')
      parkingList.innerHTML = ''

      parkings.forEach((parking) => {
        const li = document.createElement('li')
        li.textContent = `${parking.Nazwa} - ${parking.Lokalizacja} - Available spots: ${parking.Liczba_Miejsc} (${parking.Typ})`
        li.dataset.parkingId = parking.ID_Parkingu // ID parkingu
        li.dataset.parkingName = parking.Nazwa // Nazwa parkingu
        li.addEventListener('click', openReservationModal)
        parkingList.appendChild(li)
      })
    })
    .catch((error) => console.error('Error fetching parking data:', error))
}

function openReservationModal(event) {
  const parkingId = event.target.dataset.parkingId
  const parkingName = event.target.dataset.parkingName

  // Ustaw nazwę parkingu w formularzu
  document.getElementById('reservation-parking-name').textContent = parkingName
  document.getElementById('reservation-parking-id').value = parkingId

  // Pobierz cennik dla wybranego parkingu
  fetch(`../backend/php/get_pricing_for_parking.php?parking_id=${parkingId}`)
    .then((response) => response.json())
    .then((data) => {
      const pricingSection = document.getElementById(
        'reservation-parking-pricing'
      )
      pricingSection.innerHTML = '' // Wyczyść poprzedni cennik

      if (data.success && Array.isArray(data.pricing)) {
        const pricingList = document.createElement('ul')
        pricingList.style.listStyleType = 'none' // Usuń znaczniki listy, jeśli są niepotrzebne
        pricingList.style.padding = '0' // Usuń dodatkowe odstępy

        data.pricing.forEach((rate) => {
          const listItem = document.createElement('li')
          listItem.textContent = `${rate.Typ_Ceny}: ${rate.Cena} PLN`
          pricingList.appendChild(listItem)
        })

        pricingSection.appendChild(pricingList)
      } else {
        pricingSection.textContent = 'No pricing available.'
      }
    })
    .catch((error) => {
      console.error('Error fetching pricing data:', error)
      document.getElementById('reservation-parking-pricing').textContent =
        'Error fetching pricing.'
    })

  // Pokaż modal z formularzem rezerwacji
  document.getElementById('reservation-modal').classList.remove('hidden')
}

// // Funkcja otwierająca modal z formularzem rezerwacji
// function openReservationModal(event) {
//   const parkingId = event.currentTarget.dataset.parkingId
//   const parkingName = event.currentTarget.dataset.parkingName

//   const modal = document.getElementById('reservation-modal')
//   const parkingNameDisplay = document.getElementById('reservation-parking-name')
//   const parkingIdInput = document.getElementById('reservation-parking-id')

//   parkingNameDisplay.textContent = `Parking: ${parkingName}`
//   parkingIdInput.value = parkingId // Przekazanie ID parkingu do ukrytego pola formularza
//   modal.classList.remove('hidden') // Pokaż modal
// }
