// Pobieranie listy pojazdów użytkownika
function fetchUserVehicles() {
  fetch('../backend/php/get_vehicles.php')
    .then((response) => response.json())
    .then((vehicles) => {
      const vehicleList = document.getElementById('vehicle-list')
      vehicleList.innerHTML = ''

      vehicles.forEach((vehicle) => {
        const li = document.createElement('li')
        li.textContent = `${vehicle.Nr_Rejestracyjny} - ${vehicle.Marka} ${vehicle.Model} (${vehicle.Typ})`

        const selectButton = document.createElement('button')
        selectButton.textContent = 'Set Active'
        selectButton.addEventListener('click', () =>
          changeActiveVehicle(vehicle.ID_Pojazdu)
        )

        li.appendChild(selectButton)
        vehicleList.appendChild(li)
      })
    })
    .catch((error) => console.error('Error fetching vehicles:', error))
}

// Dodawanie nowego pojazdu
document
  .getElementById('add-vehicle-form')
  .addEventListener('submit', function (event) {
    event.preventDefault()

    const data = {
      nr_rejestracyjny: document.getElementById('nr_rejestracyjny').value,
      marka: document.getElementById('marka').value,
      model: document.getElementById('model').value,
      typ: document.getElementById('typ').value,
    }

    fetch('../backend/php/add_vehicle.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert(result.message)
          fetchUserVehicles()
        } else {
          alert('Error adding vehicle: ' + result.error)
        }
      })
      .catch((error) => console.error('Error adding vehicle:', error))
  })

// Zmiana aktywnego pojazdu
function changeActiveVehicle(vehicleId) {
  fetch('../backend/php/change_vehicle.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_pojazdu: vehicleId }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert(result.message)
      } else {
        alert('Error changing vehicle: ' + result.error)
      }
    })
    .catch((error) => console.error('Error changing vehicle:', error))
}
