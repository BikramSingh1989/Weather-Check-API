// @ts-nocheck
const searchBtn = document.querySelector('#search');
const cityInput = document.querySelector('input');

searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) return alert('Please enter a city name');

    try {
        const response = await fetch(`http://localhost:3001/weather?city=${city}`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();

        updateWeatherDashboard(data);
    } catch (error) {
        console.error(error);
        alert('Could not fetch weather data');
    }
});

function updateWeatherDashboard(data) {
    console.log(data); // Update the DOM elements
}
