// Wywołanie na starcie
/*
fetchAndDisplayCities();
fetchAndDisplayParkings();
setInterval(fetchAndDisplayParkings, 5000);
*/
document
  .getElementById("parking-ul")
  .addEventListener("click", function (event) {
    if (event.target.tagName === "LI") {
      // Pobierz nazwę parkingu
      const parkingName = event.target.textContent.split(" - ")[0];
      document.getElementById("reservation-parking-name").textContent =
        parkingName;

      // Wywołaj funkcję pobierającą pojazdy użytkownika i wypełniającą pole wyboru
      loadUserVehicles();

      // Pokaż formularz rezerwacji
      document.getElementById("reservation-form").classList.remove("hidden");
    }
  });
