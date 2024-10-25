// Глобальні змінні
let watchId = null; // Ідентифікатор для відслідковування місцезнаходження
const collegeCoords = { lat: 50.4501, lon: 30.5234 }; // Координати коледжу (наприклад, Київ)
let map; // Глобальна змінна для збереження екземпляра карти

document.addEventListener("DOMContentLoaded", () => {
  const locationInfo = document.getElementById("location-info");
  const distanceInfo = document.getElementById("distance-info");

  // Отримати поточне місцезнаходження
  document.getElementById("get-location-btn").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(displayLocation, showError);
    } else {
      locationInfo.textContent = "Ваш браузер не підтримує Geolocation.";
    }
  });

  // Відслідковувати місцезнаходження в реальному часі
  document.getElementById("watch-location-btn").addEventListener("click", () => {
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(displayLocation, showError);
    } else {
      locationInfo.textContent = "Ваш браузер не підтримує Geolocation.";
    }
  });

  // Зупинити відслідковування
  document.getElementById("clear-watch-btn").addEventListener("click", () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      locationInfo.textContent = "Відслідковування зупинено.";
    }
  });

  // Відображення місця на карті і розрахунок дистанції
  function displayLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    const userCoords = { lat, lon };

    locationInfo.textContent = `Широта: ${lat}, Довгота: ${lon} (Точність: ${accuracy} метрів)`;

    // Розрахунок дистанції до коледжу
    const distance = computeDistance(userCoords, collegeCoords);
    distanceInfo.textContent = `Відстань до коледжу: ${distance.toFixed(2)} км`;

    // Відображення карти
    showMap(lat, lon);
  }

  // Функція для обробки помилок
  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        locationInfo.textContent = "Користувач відхилив запит на геолокацію.";
        break;
      case error.POSITION_UNAVAILABLE:
        locationInfo.textContent = "Інформація про місцезнаходження недоступна.";
        break;
      case error.TIMEOUT:
        locationInfo.textContent = "Час запиту на геолокацію вичерпано.";
        break;
      default:
        locationInfo.textContent = "Сталася невідома помилка.";
        break;
    }
  }

  // Розрахунок дистанції за формулою гаверсинуса
  function computeDistance(startCoords, endCoords) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Радіус Землі в км
    const dLat = toRad(endCoords.lat - startCoords.lat);
    const dLon = toRad(endCoords.lon - startCoords.lon);
    const lat1 = toRad(startCoords.lat);
    const lat2 = toRad(endCoords.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Відображення карти з використанням Leaflet
  function showMap(lat, lon) {
    if (map) {
      map.remove(); // Видаляємо попередню карту, якщо вона існує
    }

    // Створюємо нову карту
    map = L.map("map").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Додаємо маркер на карті
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("Ви тут!")
      .openPopup();
  }
});
