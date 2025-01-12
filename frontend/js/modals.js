// Obsługa modali
const loginModal = document.getElementById('login-form')
const registerModal = document.getElementById('register-form')
const profileModal = document.getElementById('profile-modal') // Dodaj ten element
const reportIssueModal = document.getElementById('report-issue-modal') // Dodaj ten element
const loginLink = document.getElementById('login-link')
const registerLink = document.getElementById('register-link')
const profileLink = document.getElementById('profile-link') // Dodaj ten element
const closeButtons = document.querySelectorAll('.close-modal')

loginLink.addEventListener('click', () => {
  loginModal.classList.remove('hidden')
})

registerLink.addEventListener('click', () => {
  registerModal.classList.remove('hidden')
})

profileLink.addEventListener('click', () => {
  // Sprawdź, czy użytkownik jest zalogowany
  fetch('../backend/php/check_login.php')
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        profileModal.classList.remove('hidden')
        fetchAndDisplayVehicles() // Wywołaj funkcję pobierającą pojazdy użytkownika
      } else {
        loginModal.classList.remove('hidden') // Wyświetl modal logowania
      }
    })
    .catch((error) => console.error('Error checking login status:', error))
})

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    loginModal.classList.add('hidden')
    registerModal.classList.add('hidden')
    profileModal.classList.add('hidden') // Dodaj ten element
    reportIssueModal.classList.add('hidden') // Dodaj ten element
    document.getElementById('issue-description').value = '' // Resetuj textarea
  })
})
