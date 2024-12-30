// Obsługa modali
const loginModal = document.getElementById('login-form')
const registerModal = document.getElementById('register-form')
const loginLink = document.getElementById('login-link')
const registerLink = document.getElementById('register-link')
const closeButtons = document.querySelectorAll('.close-modal')

loginLink.addEventListener('click', () => {
  loginModal.classList.remove('hidden')
})

registerLink.addEventListener('click', () => {
  registerModal.classList.remove('hidden')
})

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    loginModal.classList.add('hidden')
    registerModal.classList.add('hidden')
  })
})
