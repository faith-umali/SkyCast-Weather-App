const apiKey = "f0b9a524d07449c474ea5b8549fa74dd";

const weatherResult = document.getElementById("weatherResult");
const forecastDiv = document.getElementById("forecast");
const loading = document.getElementById("loading");
const tip = document.getElementById("tip");
const historyList = document.getElementById("historyList");
const favoriteList = document.getElementById("favoriteList");
const clock = document.getElementById("clock");
const greeting = document.getElementById("greeting");

// ================= CLOCK =================
setInterval(() => {
    clock.innerText = new Date().toLocaleString();
}, 1000);

// ================= GREETING =================
function setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) greeting.innerText = "Good Morning 🌞";
    else if (hour < 18) greeting.innerText = "Good Afternoon ☀️";
    else greeting.innerText = "Good Evening 🌙";
}
setGreeting();

// ================= WEATHER =================
function getWeather(cityOverride) {
    const city = cityOverride || document.getElementById("cityInput").value.trim();
    if (!city) return;

    loading.style.display = "block";

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => res.json())
        .then(data => {

            loading.style.display = "none";

            const current = data.list[0];

            const iconCode = current.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            const sunrise = new Date(data.city.sunrise * 1000);
            const sunset = new Date(data.city.sunset * 1000);

            // MAIN WEATHER CARD
            weatherResult.innerHTML = `
                <h2>📍 ${data.city.name}, ${data.city.country}</h2>
                <img src="${iconUrl}">
                <h2>${current.main.temp}°C</h2>
                <p>${current.weather[0].description}</p>

                <div class="cards">
                    <div>🌡 ${current.main.feels_like}°C <br>Feels Like</div>
                    <div>💧 ${current.main.humidity}% <br>Humidity</div>
                    <div>🌬 ${current.wind.speed} km/h <br>Wind</div>
                    <div>🔵 ${current.main.pressure} hPa <br>Pressure</div>
                </div>

                <div class="sun">
                    🌅 ${sunrise.toLocaleTimeString()} <br>
                    🌇 ${sunset.toLocaleTimeString()}
                </div>
            `;

            // TIP SYSTEM
            generateTip(current.weather[0].main);

            // 5 DAY FORECAST
            generateForecast(data.list);

            // HISTORY
            saveHistory(data.city.name);

        })
        .catch(() => {
            weatherResult.innerHTML = "😥 City not found";
            loading.style.display = "none";
        });
}

// ================= FORECAST =================
function generateForecast(list) {
    forecastDiv.innerHTML = "<h3>📅 5-Day Forecast</h3>";

    for (let i = 0; i < list.length; i += 8) {
        const item = list[i];

        const icon = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

        const date = new Date(item.dt * 1000).toDateString();

        forecastDiv.innerHTML += `
            <div class="forecast-card">
                <p>${date}</p>
                <img src="${iconUrl}">
                <p>${item.main.temp}°C</p>
            </div>
        `;
    }
}

// ================= LOCATION =================
function getLocation() {
    navigator.geolocation.getCurrentPosition(pos => {

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                getWeather(data.name);
            });

    });
}

// ================= TIP SYSTEM =================
function generateTip(type) {
    let message = "";

    if (type === "Rain") message = "☔ Bring umbrella";
    else if (type === "Clouds") message = "☁ Cloudy vibes today";
    else if (type === "Clear") message = "😎 Sunny day!";
    else if (type === "Thunderstorm") message = "⚡ Stay indoors";
    else message = "🌤 Have a nice day!";

    tip.innerText = message;
}

// ================= HISTORY =================
function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("history") || "[]");

    history.unshift(city);
    history = [...new Set(history)].slice(0, 5);

    localStorage.setItem("history", JSON.stringify(history));

    renderHistory();
}

function renderHistory() {
    let history = JSON.parse(localStorage.getItem("history") || "[]");

    historyList.innerHTML = history
        .map(c => `<li onclick="getWeather('${c}')">📍 ${c}</li>`)
        .join("");
}

// ================= FAVORITES =================
function addFavorite(city) {
    let fav = JSON.parse(localStorage.getItem("fav") || "[]");

    fav.push(city);
    fav = [...new Set(fav)];

    localStorage.setItem("fav", JSON.stringify(fav));

    renderFav();
}

function renderFav() {
    let fav = JSON.parse(localStorage.getItem("fav") || "[]");

    favoriteList.innerHTML = fav
        .map(c => `<li onclick="getWeather('${c}')">⭐ ${c}</li>`)
        .join("");
}

// INIT
renderHistory();
renderFav();
