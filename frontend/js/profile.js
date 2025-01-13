document.addEventListener('DOMContentLoaded', () => {
  const updateProfileForm = document.getElementById('updateProfileForm')
  const changePasswordForm = document.getElementById('changePasswordForm')

  // Pobierz dane użytkownika i wypełnij formularz
  fetch('../backend/php/get_user_profile.php')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const user = data.user
        document.getElementById('firstname').value = user.Imie
        document.getElementById('lastname').value = user.Nazwisko
        document.getElementById('phone').value = user.Telefon
        document.getElementById('nip').value = user.NIP
      } else {
        alert('Failed to load user profile: ' + data.message)
      }
    })
    .catch((error) => console.error('Error loading user profile:', error))

  // Obsługa formularza aktualizacji profilu
  updateProfileForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(updateProfileForm)
    const data = Object.fromEntries(formData.entries())

    fetch('../backend/php/update_user_profile.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Profile updated successfully!')
        } else {
          alert('Failed to update profile: ' + data.message)
        }
      })
      .catch((error) => console.error('Error updating profile:', error))
  })

  // Obsługa formularza zmiany hasła
  changePasswordForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(changePasswordForm)
    const data = Object.fromEntries(formData.entries())

    fetch('../backend/php/change_password.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Password changed successfully!')
          changePasswordForm.reset()
        } else {
          alert('Failed to change password: ' + data.message)
        }
      })
      .catch((error) => console.error('Error changing password:', error))
  })
})
