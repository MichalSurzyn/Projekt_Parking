// Dodanie funkcji do pobierania listy miast
function fetchAndDisplayCities() {
  fetch("../backend/php/get_cities.php")
    .then((response) => response.json())
    .then((cities) => {
      const cityDropdown = document.getElementById("city-filter");

      // Dodanie opcji "Wszystkie miasta"
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "All Cities";
      cityDropdown.appendChild(defaultOption);

      // Dodanie miast do listy rozwijanej
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.ID_Miasta;
        option.textContent = city.Nazwa;
        cityDropdown.appendChild(option);
      });

      // Obsługa zmiany filtra miast
      cityDropdown.addEventListener("change", () => {
        const selectedCityId = cityDropdown.value;
        fetchAndDisplayParkings(selectedCityId);
      });
    })
    .catch((error) => console.error("Error fetching cities data:", error));
}

// Modyfikacja funkcji pobierania parkingów, aby obsługiwała filtrację po mieście
function fetchAndDisplayParkings(cityId = "") {
  const url = cityId
    ? `../backend/php/get_parkings.php?city_id=${cityId}`
    : "../backend/php/get_parkings.php";

  fetch(url)
    .then((response) => response.json())
    .then((parkings) => {
      const parkingList = document.getElementById("parking-ul");
      parkingList.innerHTML = "";

      parkings.forEach((parking) => {
        const li = document.createElement("li");
        li.textContent = `${parking.Nazwa} - ${parking.Lokalizacja} - Available spots: ${parking.Liczba_Miejsc} (${parking.Typ})`;
        li.dataset.parkingId = parking.ID_Parkingu; // ID parkingu
        li.dataset.parkingName = parking.Nazwa; // Nazwa parkingu
        li.addEventListener("click", openReservationModal);
        parkingList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching parking data:", error));
}

// Zmodyfikowana funkcja automatycznej aktualizacji parkingów
function updateParkingList() {
  const cityDropdown = document.getElementById("city-filter");
  const selectedCityId = cityDropdown.value;
  fetchAndDisplayParkings(selectedCityId);
}

// Wywołanie funkcji pobierania miast i parkingów po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayCities();
  fetchAndDisplayParkings();
  setInterval(updateParkingList, 5000); // Aktualizacja parkingów co 5 sekund, z zachowaniem filtra
});

function openReservationModal(event) {
  const parkingId = event.target.dataset.parkingId;
  const parkingName = event.target.dataset.parkingName;

  // Ustaw nazwę parkingu w formularzu
  document.getElementById("reservation-parking-name").textContent = parkingName;
  document.getElementById("reservation-parking-id").value = parkingId;

  // Pobierz cennik dla wybranego parkingu
  fetch(`../backend/php/get_pricing.php?parking_id=${parkingId}`)
    .then((response) => response.json())
    .then((data) => {
      const pricingSection = document.getElementById(
        "reservation-parking-pricing"
      );
      pricingSection.innerHTML = ""; // Wyczyść poprzedni cennik

      if (data.success && Array.isArray(data.pricing)) {
        const pricingList = document.createElement("ul");
        pricingList.style.listStyleType = "none"; // Usuń znaczniki listy, jeśli są niepotrzebne
        pricingList.style.padding = "0"; // Usuń dodatkowe odstępy

        data.pricing.forEach((rate) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${rate.Typ_Ceny}: ${rate.Cena} PLN`;
          pricingList.appendChild(listItem);
        });

        pricingSection.appendChild(pricingList);
      } else {
        pricingSection.textContent = "No pricing available.";
      }
    })
    .catch((error) => {
      console.error("Error fetching pricing data:", error);
      document.getElementById("reservation-parking-pricing").textContent =
        "Error fetching pricing.";
    });

  // Pokaż modal z formularzem rezerwacji
  document.getElementById("reservation-modal").classList.remove("hidden");
}
