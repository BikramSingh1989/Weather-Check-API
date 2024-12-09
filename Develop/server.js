// @ts-nocheck
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Initialize dotenv configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// OpenWeather API endpoint
const API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = process.env.OPENWEATHER_API_KEY; // Store API key in .env file

app.use(express.json());

// Route to fetch weather data for a city
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;

  try {
    // Fetch weather data from OpenWeather API
    const response = await axios.get(API_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', // Using 'metric' for Celsius temperatures
      },
    });

    const weatherData = response.data;

    // Parse current weather data
    const currentWeather = {
      name: weatherData.city.name,
      date: new Date(),
      icon: weatherData.list[0].weather[0].icon,
      description: weatherData.list[0].weather[0].description,
      temp: weatherData.list[0].main.temp,
      humidity: weatherData.list[0].main.humidity,
      windSpeed: weatherData.list[0].wind.speed,
    };

    // Parse 5-day forecast 
    const forecast = weatherData.list.filter((_, index) => index % 8 === 0).map(item => ({
      date: new Date(item.dt * 1000), // Convert timestamp to Date object
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      temp: item.main.temp,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }));

    // Return the weather data as JSON
    res.json({ currentWeather, forecast });

  } catch (error) {
    console.error("Error fetching weather data: ", error);
    res.status(500).json({ message: "Error fetching weather data." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
