// Function to handle the city search
function handleCitySearch() {
  const cityInput = document.getElementById('city-input') as HTMLInputElement;
  const cityName = cityInput.value.trim();

  if (cityName === '') {
    alert('Please enter a valid city name.');
    return;
  }

  // Fetch the weather data for the city
  fetchWeather(cityName);
}

// Function to fetch the weather data for the given city
async function fetchWeather(city: string) {
  try {
    const response = await fetch(`/weather/${city}`);
    if (!response.ok) {
      throw new Error('Weather data not found for this city!');
    }
    const data = await response.json();

    if (!data || !data.currentWeather) {
      alert('Weather data not found for this city!');
      return;
    }

    // Display the weather information
    displayWeather(data);

    // Update the search history
    updateSearchHistory(city);
  } catch (error: unknown) {
    // Handle error with a type guard
    if (error instanceof Error) {
      alert(error.message); // Safely access 'message' property
    } else {
      alert('An unknown error occurred.');
    }
  }
}

// Function to display the weather information
function displayWeather(data: { 
  currentWeather: { 
    name: string | null; 
    temp: number; 
    humidity: number; 
    windSpeed: number; 
  }; 
  forecast: Array<{ 
    date: string | number | Date; 
    temp: number; 
  }>; 
}) {
  const cityNameElement = document.getElementById('city-name');
  if (cityNameElement && data.currentWeather.name) {
    cityNameElement.textContent = data.currentWeather.name;
  }

  const temperatureElement = document.getElementById('temperature');
  if (temperatureElement) {
    temperatureElement.textContent = `${data.currentWeather.temp}°C`;
  }

  const humidityElement = document.getElementById('humidity');
  if (humidityElement) {
    humidityElement.textContent = `Humidity: ${data.currentWeather.humidity}%`;
  }

  const windSpeedElement = document.getElementById('windspeed');
  if (windSpeedElement) {
    windSpeedElement.textContent = `Wind Speed: ${data.currentWeather.windSpeed} m/s`;
  }

  // Display the 5-day forecast
  const forecastContainer = document.getElementById('forecast');
  if (forecastContainer) {
    data.forecast.forEach((day, index) => {
      const forecastDayElement = document.getElementById(`forecast-day-${index}`);
      if (forecastDayElement) {
        const date = new Date(day.date);
        forecastDayElement.textContent = `${date.toDateString()} - ${day.temp}°C`;
      }
    });
  }
}

// Function to update the search history
async function updateSearchHistory(city: string) {
  try {
    // Add city to the search history
    const response = await fetch('/add-history', {
      method: 'POST',
      body: JSON.stringify({ city }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to update search history');
    }

    // Fetch and display the updated search history
    const historyResponse = await fetch('/search-history');
    const history = await historyResponse.json();

    // Update the search history UI
    const historyContainer = document.getElementById('search-history');
    if (historyContainer) {
      historyContainer.innerHTML = ''; // Clear previous search history
      history.forEach((city: string | null) => {
        if (city) {
          const cityItem = document.createElement('li');
          cityItem.textContent = city;
          cityItem.onclick = () => fetchWeather(city); // Fetch weather for clicked city
          historyContainer.appendChild(cityItem);
        }
      });
    }
  } catch (error: unknown) {
    // Handle error with a type guard
    if (error instanceof Error) {
      alert(error.message); // Safely access 'message' property
    } else {
      alert('An unknown error occurred.');
    }
  }
}

// Add event listener to the search button
const searchButton = document.getElementById('search-button');
if (searchButton) {
  searchButton.addEventListener('click', handleCitySearch);
}

// Optionally, allow the user to press "Enter" to trigger the search
const cityInput = document.getElementById('city-input');
if (cityInput) {
  cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleCitySearch();
    }
  });
}
