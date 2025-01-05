document.addEventListener('DOMContentLoaded', () => {
  const vehicleFormContainer = document.getElementById('vehicleFormContainer')
  const vehicleListContainer = document.getElementById('vehicleListContainer')
  const vehicleList = document.getElementById('vehicleList')
  const addVehicleForm = document.getElementById('addVehicleForm')

  // Sprawdź, czy użytkownik jest zalogowany
  fetch('../backend/php/check_login.php')
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        vehicleFormContainer.style.display = 'block'
        vehicleListContainer.style.display = 'block'
        loadVehicles() // Załaduj pojazdy użytkownika
      } else {
        vehicleFormContainer.style.display = 'none'
        vehicleListContainer.style.display = 'none'
      }
    })
    .catch((error) => console.error('Błąd podczas sprawdzania sesji:', error))

  // Obsługa formularza dodawania pojazdów
  addVehicleForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(addVehicleForm)
    fetch('../backend/php/add_vehicle.php', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Pojazd został dodany!')
          addVehicleForm.reset()
          loadVehicles() // Odśwież listę pojazdów
        } else {
          alert('Błąd: ' + data.message)
        }
      })
      .catch((error) => console.error('Błąd podczas dodawania pojazdu:', error))
  })

  // Funkcja ładowania pojazdów użytkownika
  function loadVehicles() {
    fetch('../backend/php/get_vehicles.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          vehicleList.innerHTML = '' // Wyczyść listę
          data.vehicles.forEach((vehicle) => {
            const listItem = document.createElement('li')
            listItem.textContent = `${vehicle.Marka} ${vehicle.Model} (${vehicle.Nr_Rejestracyjny}) - ${vehicle.Typ}`
            vehicleList.appendChild(listItem)
          })
        } else {
          alert('Błąd podczas ładowania pojazdów: ' + data.message)
        }
      })
      .catch((error) =>
        console.error('Błąd podczas ładowania pojazdów:', error)
      )
  }
})
