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
        fetchAndDisplayVehicles() // Załaduj pojazdy użytkownika
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
          fetchAndDisplayVehicles() // Odśwież listę pojazdów
        } else {
          alert('Błąd: ' + data.message)
        }
      })
      .catch((error) => console.error('Błąd podczas dodawania pojazdu:', error))
  })

  // Funkcja ładowania pojazdów użytkownika
  function fetchAndDisplayVehicles() {
    fetch('../backend/php/get_vehicles.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const vehicleList = document.getElementById('vehicleList')
          vehicleList.innerHTML = '' // Wyczyść istniejącą listę

          data.vehicles.forEach((vehicle) => {
            const li = document.createElement('li')
            li.textContent = `${vehicle.Marka} ${vehicle.Model} (${vehicle.Nr_Rejestracyjny})`
            const deleteButton = document.createElement('button')
            deleteButton.classList.add('button-delete')
            deleteButton.textContent = 'Delete'
            deleteButton.addEventListener('click', () => {
              deleteVehicle(vehicle.ID_Pojazdu)
            })
            li.appendChild(deleteButton)
            vehicleList.appendChild(li)
          })
        } else {
          console.error('Error fetching vehicles:', data.message)
        }
      })
      .catch((error) => console.error('Error fetching vehicles:', error))
  }

  function deleteVehicle(vehicleId) {
    fetch(`../backend/php/delete_vehicle.php?id=${vehicleId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          fetchAndDisplayVehicles() // Odśwież listę pojazdów
        } else {
          console.error('Error deleting vehicle:', data.message)
        }
      })
      .catch((error) => console.error('Error deleting vehicle:', error))
  }

  document
    .getElementById('addVehicleForm')
    .addEventListener('submit', (event) => {
      event.preventDefault()

      const formData = new FormData(event.target)
      const data = {}
      formData.forEach((value, key) => {
        data[key] = value
      })

      fetch('../backend/php/add_vehicle.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            fetchAndDisplayVehicles() // Odśwież listę pojazdów
            event.target.reset()
          } else {
            console.error('Error adding vehicle:', data.message)
          }
        })
        .catch((error) => console.error('Error adding vehicle:', error))
    })
})
