function fetchAndDisplayVehicles() {
  fetch('../backend/php/get_vehicles.php')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const vehicleSelect = document.getElementById('vehicleSelect')
        vehicleSelect.innerHTML = '' // Wyczyść istniejącą listę

        data.vehicles.forEach((vehicle) => {
          const option = document.createElement('option')
          option.value = vehicle.ID_Pojazdu
          option.textContent = `${vehicle.Marka} ${vehicle.Model} (${vehicle.Numer_Rejestracyjny})`
          vehicleSelect.appendChild(option)
        })
      } else {
        console.error('Error fetching vehicles:', data.message)
      }
    })
    .catch((error) => console.error('Error fetching vehicles:', error))
}
