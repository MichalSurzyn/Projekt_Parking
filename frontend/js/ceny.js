// Fetch and calculate parking price based on user input
function calculateParkingPrice() {
  const endDateInput = document.getElementById('reservation-date-end')
  const parkingId = document.getElementById('reservation-parking-id').value
  const priceElement = document.getElementById('calculated-price')
  const priceType = document.querySelector(
    'input[name="price_type"]:checked'
  ).value

  console.log('End date input value:', endDateInput.value)
  console.log('Parking ID:', parkingId)
  console.log('Price type:', priceType)

  // Check if inputs are filled
  if (!endDateInput.value || !parkingId) {
    priceElement.textContent = 'Price: '
    return
  }

  const startDate = new Date() // Set start date to now
  const endDate = new Date(endDateInput.value)

  if (startDate >= endDate) {
    alert('End date must be later than start date.')
    priceElement.textContent = 'Price: '
    return
  }

  const durationInHours = (endDate - startDate) / (1000 * 60 * 60) // Convert milliseconds to hours
  console.log('Duration in hours:', durationInHours)

  fetch(`../backend/php/get_pricing.php?parking_id=${parkingId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Pricing data:', data)
      if (data.success && Array.isArray(data.pricing)) {
        const pricing = data.pricing
        let price = 0

        if (priceType === 'Za godzinę') {
          // Calculate price per hour
          const hourlyRate = pricing.find(
            (rate) => rate.Typ_Ceny === 'Za godzinę'
          )
          if (hourlyRate) {
            price = Math.ceil(durationInHours) * parseFloat(hourlyRate.Cena)
          }
        } else if (priceType === 'Za dzień') {
          // Calculate price per day
          const dailyRate = pricing.find((rate) => rate.Typ_Ceny === 'Za dzień')
          if (dailyRate) {
            const days = Math.ceil(durationInHours / 24)
            price = days * parseFloat(dailyRate.Cena)
          }
        } else if (priceType === 'Za miesiąc') {
          // Calculate price per month
          const monthlyRate = pricing.find(
            (rate) => rate.Typ_Ceny === 'Za miesiąc'
          )
          if (monthlyRate) {
            const months = Math.ceil(durationInHours / (24 * 30))
            price = months * parseFloat(monthlyRate.Cena)
          }
        }

        console.log('Calculated price:', price)
        priceElement.textContent = `Price: ${price.toFixed(2)} PLN`

        // Add calculated price to a hidden input field in the form
        let priceInput = document.getElementById('reservation-price')
        if (!priceInput) {
          priceInput = document.createElement('input')
          priceInput.type = 'hidden'
          priceInput.id = 'reservation-price'
          priceInput.name = 'price'
          reservationForm.appendChild(priceInput)
        }
        priceInput.value = price.toFixed(2)
      } else {
        console.error('Invalid pricing data:', data)
        priceElement.textContent = 'Price: '
        alert('Could not fetch pricing data.')
      }
    })
    .catch((error) => {
      console.error('Error fetching pricing data:', error)
      priceElement.textContent = 'Price: '
      alert('Error fetching pricing data.')
    })
}

// Add event listener to calculate price when date inputs change
const endDateInput = document.getElementById('reservation-date-end')
if (endDateInput) {
  console.log('Adding event listener to endDateInput')
  endDateInput.addEventListener('change', calculateParkingPrice)
} else {
  console.error('End date input element not found')
}

// Add event listener to calculate price when price type changes
const priceTypeInputs = document.querySelectorAll('input[name="price_type"]')
priceTypeInputs.forEach((input) => {
  input.addEventListener('change', calculateParkingPrice)
})

// Add event listener to handle form submission
const reservationForm = document.getElementById('reservation-form')
if (reservationForm) {
  // Define the form submission handler
  function handleFormSubmit(event) {
    event.preventDefault() // Prevent default form submission

    const formData = new FormData(reservationForm)

    // Debugging: log form data
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

    fetch('../backend/php/make_reservation.php', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const reservationId = data.reservationId
          const amount = formData.get('price')
          window.location.href = `payment.html?reservation_id=${reservationId}&amount=${amount}`
        } else {
          alert('Reservation failed: ' + data.message)
        }
      })
      .catch((error) => {
        console.error('Error making reservation:', error)
        alert('Error making reservation.')
      })
  }

  // Ensure only one event listener is attached
  reservationForm.addEventListener('submit', (event) => {
    if (event.currentTarget.hasAttribute('data-handled')) return
    event.currentTarget.setAttribute('data-handled', 'true')
    handleFormSubmit(event)
  })
} else {
  console.error('Reservation form element not found')
}
