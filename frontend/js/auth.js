// Obsługa logowania
document
  .getElementById('login-form')
  .addEventListener('submit', function (event) {
    event.preventDefault()
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value

    fetch('../backend/php/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          document.getElementById('login-link').style.display = 'none'
          document.getElementById('register-link').style.display = 'none'

          const logoutButton = document.createElement('a')
          logoutButton.id = 'logout-link'
          logoutButton.textContent = 'Logout'
          logoutButton.href = '#'
          logoutButton.addEventListener('click', logout)
          document.querySelector('nav').appendChild(logoutButton)

          // Odświeżenie strony
          window.location.reload()
        } else {
          alert(data.message || 'Invalid login credentials.')
        }
      })
      .catch((error) => console.error('Error during login:', error))
  })

// Obsługa rejestracji
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#register-form2')
  const messageBox = document.querySelector('#register-message')

  if (!form) {
    console.error('Form element not found.')
    return
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault()

    const formData = new FormData(form)

    fetch('../backend/php/register.php', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        messageBox.textContent = data
        if (data.includes('successful')) {
          messageBox.style.color = 'green'
          form.reset() // Wyczyść pola formularza po pomyślnej rejestracji
        } else {
          messageBox.style.color = 'red'
        }
      })
      .catch((error) => {
        messageBox.textContent = 'An error occurred.'
        messageBox.style.color = 'red'
        console.error('Error:', error)
      })
  })
})

// Obsługa wylogowania
function logout() {
  fetch('../backend/php/logout.php')
    .then(() => {
      alert('Logged out successfully.')
      location.reload()
    })
    .catch((error) => console.error('Error during logout:', error))
}

// Sprawdzenie, czy użytkownik jest zalogowany
fetch('../backend/php/check_login.php')
  .then((response) => response.json())
  .then((data) => {
    if (data.loggedIn) {
      document.getElementById('login-link').style.display = 'none'
      document.getElementById('register-link').style.display = 'none'

      const logoutButton = document.createElement('a')
      logoutButton.id = 'logout-link'
      logoutButton.textContent = 'Logout'
      logoutButton.href = '#'
      logoutButton.addEventListener('click', logout)
      document.querySelector('nav').appendChild(logoutButton)

      // Wyświetl imię i nazwisko użytkownika na stronie
      const userInfo = document.getElementById('kto_to')
      userInfo.textContent = `Zalogowano jako: ${data.firstName} ${data.lastName}`
    }
  })
  .catch((error) => console.error('Error checking login status:', error))

document
  .getElementById('reservation-modal')
  .addEventListener('open', loadUserVehicles)

// Ładowanie pojazdów użytkownika do formularza rezerwacji
function loadUserVehicles() {
  fetch('../backend/php/get_vehicles.php')
    .then((response) => response.json())
    .then((data) => {
      if (data.success && Array.isArray(data.vehicles)) {
        const vehicles = data.vehicles
        const vehicleList = document.getElementById('vehicle-list')
        vehicleList.innerHTML = ''

        vehicles.forEach((vehicle) => {
          const vehicleContainer = document.createElement('div')

          const radio = document.createElement('input')
          radio.type = 'radio'
          radio.name = 'vehicle_id'
          radio.value = vehicle.ID_Pojazdu
          radio.required = true

          const label = document.createElement('label')
          label.textContent = `${vehicle.Marka} ${vehicle.Model} (${vehicle.Nr_Rejestracyjny})`
          label.prepend(radio)

          vehicleContainer.appendChild(label)
          vehicleList.appendChild(vehicleContainer)
        })
      } else {
        console.error('Invalid response structure:', data)
      }
    })
    .catch((error) => console.error('Error fetching user vehicles:', error))
}

// Obsługa zamykania modalu
document.querySelectorAll('.close-modal').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('.modal').classList.add('hidden')
  })
})

// Obsługa formularza rezerwacji
document
  .getElementById('reservation-form')
  .addEventListener('submit', function (event) {
    event.preventDefault()

    const formData = new FormData(this)

    fetch('../backend/php/make_reservation.php', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Reservation successful!')
          this.closest('.modal').classList.add('hidden')
        } else {
          alert('Reservation failed: ' + data.message)
        }
      })
      .catch((error) => console.error('Error making reservation:', error))
  })

// Dodaj obsługę przycisków "Your Reservations" i "Your Profile"
document
  .getElementById('reservations-link')
  .addEventListener('click', (event) => {
    event.preventDefault()
    fetch('../backend/php/check_login.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn) {
          window.location.href = 'reservations.html'
        } else {
          document.getElementById('login-form').classList.remove('hidden')
        }
      })
      .catch((error) => console.error('Error checking login status:', error))
  })

document
  .getElementById('user-profile-link')
  .addEventListener('click', (event) => {
    event.preventDefault()
    fetch('../backend/php/check_login.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn) {
          window.location.href = 'profile.html'
        } else {
          document.getElementById('login-form').classList.remove('hidden')
        }
      })
      .catch((error) => console.error('Error checking login status:', error))
  })
