// Obsługa formularza logowania
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Zatrzymanie domyślnego działania formularza

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    fetch('../backend/php/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Login successful!");

                // Ukryj przyciski Login/Register
                document.getElementById("login-link").style.display = "none";
                document.getElementById("register-link").style.display = "none";

                // Pokaż przycisk Logout
                const logoutButton = document.createElement("a");
                logoutButton.id = "logout-link";
                logoutButton.textContent = "Logout";
                logoutButton.href = "#";
                logoutButton.addEventListener("click", logout);
                document.querySelector("nav").appendChild(logoutButton);

                // Pokaż sekcję zarządzania pojazdami
                document.getElementById("vehicle-management").classList.remove("hidden");
                fetchUserVehicles();
            } else {
                alert(data.message || "Invalid login credentials.");
            }
        })
        .catch(error => console.error("Error during login:", error));
});

// Obsługa wylogowania
function logout() {
    fetch('../backend/php/logout.php')
        .then(() => {
            alert("Logged out successfully.");
            location.reload(); // Odśwież stronę
        })
        .catch(error => console.error("Error during logout:", error));
}

// Sprawdzenie, czy użytkownik jest zalogowany
fetch('../backend/php/check_login.php')
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            // Ukryj Login/Register, pokaż Logout
            document.getElementById("login-link").style.display = "none";
            document.getElementById("register-link").style.display = "none";

            const logoutButton = document.createElement("a");
            logoutButton.id = "logout-link";
            logoutButton.textContent = "Logout";
            logoutButton.href = "#";
            logoutButton.addEventListener("click", logout);
            document.querySelector("nav").appendChild(logoutButton);

            // Pokaż sekcję zarządzania pojazdami
            document.getElementById("vehicle-management").classList.remove("hidden");
            fetchUserVehicles();
        } else {
            document.getElementById("vehicle-management").classList.add("hidden");
        }
    })
    .catch(error => console.error("Error checking login status:", error));

// Pobieranie listy pojazdów użytkownika
function fetchUserVehicles() {
    fetch('../backend/php/get_vehicles.php')
        .then(response => response.json())
        .then(vehicles => {
            const vehicleList = document.getElementById("vehicle-list");
            vehicleList.innerHTML = ""; // Wyczyszczenie listy pojazdów

            vehicles.forEach(vehicle => {
                const li = document.createElement("li");
                li.textContent = `${vehicle.Nr_Rejestracyjny} - ${vehicle.Marka} ${vehicle.Model} (${vehicle.Typ})`;

                // Dodaj przycisk do zmiany aktywnego pojazdu
                const selectButton = document.createElement("button");
                selectButton.textContent = "Set Active";
                selectButton.addEventListener("click", () => changeActiveVehicle(vehicle.ID_Pojazdu));

                li.appendChild(selectButton);
                vehicleList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching vehicles:", error));
}

// Dodawanie nowego pojazdu
document.getElementById("add-vehicle-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
        nr_rejestracyjny: document.getElementById("nr_rejestracyjny").value,
        marka: document.getElementById("marka").value,
        model: document.getElementById("model").value,
        typ: document.getElementById("typ").value
    };

    fetch('../backend/php/add_vehicle.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert(result.message);
                fetchUserVehicles(); // Odśwież listę pojazdów
            } else {
                alert("Error adding vehicle: " + result.error);
            }
        })
        .catch(error => console.error("Error adding vehicle:", error));
});

// Zmiana aktywnego pojazdu
function changeActiveVehicle(vehicleId) {
    fetch('../backend/php/change_vehicle.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_pojazdu: vehicleId })
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert(result.message);
            } else {
                alert("Error changing vehicle: " + result.error);
            }
        })
        .catch(error => console.error("Error changing vehicle:", error));
}

// Pobieranie danych parkingów z backendu
function fetchAndDisplayParkings() {
    fetch('../backend/php/get_parkings.php')
        .then(response => response.json())
        .then(parkings => {
            const parkingList = document.getElementById("parking-ul");
            parkingList.innerHTML = ""; // Czyścimy listę parkingów

            parkings.forEach(parking => {
                const li = document.createElement("li");
                li.textContent = `${parking.Nazwa} - ${parking.Lokalizacja} - Available spots: ${parking.Liczba_Miejsc} (${parking.Typ})`;
                parkingList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching parking data:", error));
}

// Wywołanie na starcie
fetchAndDisplayParkings();
setInterval(fetchAndDisplayParkings, 5000); // Aktualizacja co 5 sekund

// Obsługa modali
const loginModal = document.getElementById("login-form");
const registerModal = document.getElementById("register-form");
const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const closeButtons = document.querySelectorAll(".close-modal");

loginLink.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
});

registerLink.addEventListener("click", () => {
    registerModal.classList.remove("hidden");
});

closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        loginModal.classList.add("hidden");
        registerModal.classList.add("hidden");
    });
});
