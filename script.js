function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "f0b9a524d07449c474ea5b8549fa74dd";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const resultDiv = document.getElementById("weatherResult");

  if (city === "") {
    resultDiv.innerHTML = `<p style="color:red;">Please enter a city name.</p>`;
    resultDiv.classList.add("show");
    document.body.className = "";
    return;
  }

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      const forecast = data.list[0]; // First 3-hour forecast
      const weatherMain = forecast.weather[0].main.toLowerCase();
      const weatherDesc = forecast.weather[0].description;
      const temperature = forecast.main.temp;
      const humidity = forecast.main.humidity;
      const rainVolume = forecast.rain && forecast.rain["3h"] ? forecast.rain["3h"] : 0;

      let interpretedWeather = "Unknown";
      if (rainVolume > 0 || weatherDesc.includes("rain") || weatherDesc.includes("shower")) {
        interpretedWeather = "Rainy";
      } else if (weatherDesc.includes("clear")) {
        interpretedWeather = "Clear";
      } else if (weatherDesc.includes("cloud")) {
        interpretedWeather = "Cloudy";
      } else if (weatherDesc.includes("snow")) {
        interpretedWeather = "Snowy";
      } else if (weatherDesc.includes("mist") || weatherDesc.includes("fog")) {
        interpretedWeather = "Misty";
      }

      const weatherIcons = {
        clear: "☀️",
        clouds: "☁️",
        rain: "🌧️",
        drizzle: "🌦️",
        thunderstorm: "⛈️",
        snow: "❄️",
        mist: "🌫️"
      };

      const icon = weatherIcons[weatherMain] || "🌡️";
      document.body.className = weatherMain;

      resultDiv.innerHTML = `
        <h2>${icon} ${data.city.name}, ${data.city.country}</h2>
        <p>Forecast in next 3 hours:</p>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Weather: ${interpretedWeather} (${weatherDesc})</p>
        <p>Rain volume: ${rainVolume} mm</p>
        <p>Last updated: ${new Date().toLocaleTimeString()}</p>
      `;
      resultDiv.classList.remove("show");
      setTimeout(() => resultDiv.classList.add("show"), 10);
    })
    .catch((error) => {
      document.body.className = "";
      resultDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
      resultDiv.classList.add("show");
    });
}

document.getElementById("cityInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

window.onload = () => {
  document.getElementById("cityInput").focus();
};
