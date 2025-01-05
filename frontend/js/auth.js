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
        console.log('Response data:', data) // Debugowanie odpowiedzi
        if (data.success) {
          /*alert(
            `Login successful! Logged in as: ${data.firstName} ${data.lastName}`
          )
          */
          // Wyświetlenie imienia i nazwiska na stronie
          //const userInfo = document.createElement('p')
          //userInfo.id = 'user-info'
          //userInfo.textContent = `Zalogowano jako: ${data.firstName} ${data.lastName}`
          //document.body.prepend(userInfo)

          document.getElementById('login-link').style.display = 'none'
          document.getElementById('register-link').style.display = 'none'

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
