// Fetch and calculate parking price based on user input
function calculateParkingPrice() {
  const startDateInput = document.getElementById('reservation-date-start')
  const endDateInput = document.getElementById('reservation-date-end')
  const parkingId = document.getElementById('reservation-parking-id').value

  // Check if inputs are filled
  if (!startDateInput.value || !endDateInput.value || !parkingId) {
    //alert('Please fill all the fields to calculate the price.')
    return
  }

  const startDate = new Date(startDateInput.value)
  const endDate = new Date(endDateInput.value)

  if (startDate >= endDate) {
    alert('End date must be later than start date.')
    return
  }

  const durationInHours = (endDate - startDate) / (1000 * 60 * 60) // Convert milliseconds to hours

  fetch(`../backend/php/get_pricing.php?parking_id=${parkingId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success && Array.isArray(data.pricing)) {
        const pricing = data.pricing
        let price = 0

        if (durationInHours < 24) {
          // Calculate price per hour
          const hourlyRate = pricing.find(
            (rate) => rate.Typ_Ceny === 'Za godzinę'
          )
          if (hourlyRate) {
            price = Math.ceil(durationInHours) * parseFloat(hourlyRate.Cena)
          }
        } else if (durationInHours >= 24 && durationInHours < 720) {
          // Calculate price per day
          const dailyRate = pricing.find((rate) => rate.Typ_Ceny === 'Za dzień')
          if (dailyRate) {
            const days = Math.ceil(durationInHours / 24)
            price = days * parseFloat(dailyRate.Cena)
          }
        } else {
          // Calculate price per month
          const monthlyRate = pricing.find(
            (rate) => rate.Typ_Ceny === 'Za miesiąc'
          )
          if (monthlyRate) {
            const months = Math.ceil(durationInHours / (24 * 30))
            price = months * parseFloat(monthlyRate.Cena)
          }
        }

        alert(`Cena za parking: ${price.toFixed(2)} PLN`)
      } else {
        console.error('Invalid pricing data:', data)
        alert('Could not fetch pricing data.')
      }
    })
    .catch((error) => {
      console.error('Error fetching pricing data:', error)
      alert('Error fetching pricing data.')
    })
}

// Add event listener to calculate price when date inputs change
const startDateInput = document.getElementById('reservation-date-start')
const endDateInput = document.getElementById('reservation-date-end')
if (startDateInput && endDateInput) {
  ;[startDateInput, endDateInput].forEach((input) => {
    input.addEventListener('change', calculateParkingPrice)
  })
}
