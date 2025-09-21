const apiKey = '69e8a1237c314f51d333b70d50f61a2d';
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const cityNameElem = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const globeIcon = document.querySelector('.globe-icon');

// Change background based on temperature
function setBackgroundByTemperature(temp) {
  if (temp >= 30) document.body.style.background = 'linear-gradient(to right, #ff416c, #ff4b2b)';
  else if (temp >= 20) document.body.style.background = 'linear-gradient(to right, #f7971e, #ffd200)';
  else if (temp >= 10) document.body.style.background = 'linear-gradient(to right, #56ccf2, #2f80ed)';
  else document.body.style.background = 'linear-gradient(to right, #373b44, #4286f4)';
}

// Display weather data
function displayWeather(data) {
  cityNameElem.textContent = `${data.name}, ${data.sys.country}`;
  weatherDescription.textContent = data.weather[0].description;
  const temp = data.main.temp.toFixed(1);
  temperature.textContent = temp;
  humidity.textContent = data.main.humidity;
  windSpeed.textContent = data.wind.speed;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;
  setBackgroundByTemperature(parseFloat(temp));
  weatherResult.style.display = 'block';
}

// Display error messages
function showError(message) {
  weatherResult.style.display = 'block';
  cityNameElem.textContent = message;
  weatherIcon.src = '';
  weatherDescription.textContent = '';
  temperature.textContent = '';
  humidity.textContent = '';
  windSpeed.textContent = '';
}

// Fetch weather from OpenWeatherMap
async function fetchWeather(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather data not found');
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

// Get weather by city
function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

// Get weather by coordinates
function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

// Handle form submit (Enter key or button)
document.getElementById('weatherForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return alert('Please enter a city name');
  getWeather(city);
});

// Handle globe icon click (live location)
globeIcon.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('Geolocation not supported by your browser.');
    return;
  }

  globeIcon.style.animationPlayState = 'paused';
  showError('Fetching your location...');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      getWeatherByCoords(latitude, longitude);
      globeIcon.style.animationPlayState = 'running';
    },
    (err) => {
      console.error(err);
      showError('Unable to retrieve your location. Please enter a city manually.');
      globeIcon.style.animationPlayState = 'running';
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});
