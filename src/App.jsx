import React, { useState, useEffect } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { Middle } from "./components/Middle";
import { End } from "./components/End";

const weatherCodeText = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

const getWeatherText = (code) => weatherCodeText[code] || "Cloudy";
const cToF = (c) => Math.round((c * 9) / 5 + 32);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchCity, setSearchCity] = useState("Dhaka");
  const [isCelsius, setIsCelsius] = useState(true);

  const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

  const mapOpenMeteoResponse = (location, weather) => {
    const baseLocation = {
      name: location.name || searchCity,
      country: location.country || "",
      localtime: weather.current_weather?.time
        ? weather.current_weather.time.replace("T", " ")
        : new Date().toISOString().slice(0, 19).replace("T", " "),
      localtime_epoch: weather.current_weather?.time
        ? Math.floor(new Date(weather.current_weather.time).getTime() / 1000)
        : Math.floor(Date.now() / 1000),
    };

    const hourly = weather.hourly || {};
    const daily = weather.daily || {};
    const currentTempC = weather.current_weather?.temperature ?? 0;
    const currentHumidity = hourly.relativehumidity_2m?.[0] ?? 0;
    const currentUv = daily.uv_index_max?.[0] ?? 0;
    
    // Fixed: Handles Open-Meteo windspeed formatting safely
    const currentWindKph = weather.current_weather?.windspeed
      ? Math.round(weather.current_weather.windspeed)
      : 0;
    const currentCode = weather.current_weather?.weathercode ?? 0;

    const forecastday = (daily.time || []).slice(0, 2).map((date, idx) => ({
      date,
      date_epoch: Math.floor(new Date(date).getTime() / 1000),
      day: {
        maxtemp_c: daily.temperature_2m_max?.[idx] ?? 0,
        mintemp_c: daily.temperature_2m_min?.[idx] ?? 0,
        maxtemp_f: cToF(daily.temperature_2m_max?.[idx] ?? 0),
        mintemp_f: cToF(daily.temperature_2m_min?.[idx] ?? 0),
        daily_chance_of_rain: daily.precipitation_probability_max?.[idx] ?? 0,
        condition: {
          text: getWeatherText(daily.weathercode?.[idx] ?? 0),
          icon: "",
        },
      },
      astro: {
        sunrise: daily.sunrise?.[idx] ? daily.sunrise[idx].split("T")[1] : "",
        sunset: daily.sunset?.[idx] ? daily.sunset[idx].split("T")[1] : "",
      },
      // Safely chunking hourly array allocations down to single daily buckets
      hour: (hourly.time || []).slice(idx * 24, (idx + 1) * 24).map((time, hourIdx) => {
        const globalIdx = idx * 24 + hourIdx;
        return {
          time: time.replace("T", " "),
          temp_c: hourly.temperature_2m?.[globalIdx] ?? 0,
          temp_f: cToF(hourly.temperature_2m?.[globalIdx] ?? 0),
          condition: {
            text: getWeatherText(hourly.weathercode?.[globalIdx] ?? 0),
            icon: "",
          },
        };
      }),
    }));

    return {
      location: baseLocation,
      current: {
        temp_c: currentTempC,
        temp_f: cToF(currentTempC),
        feelslike_c: hourly.apparent_temperature?.[0] ?? currentTempC,
        feelslike_f: cToF(hourly.apparent_temperature?.[0] ?? currentTempC),
        humidity: currentHumidity,
        uv: currentUv,
        wind_kph: currentWindKph,
        condition: {
          text: getWeatherText(currentCode),
          icon: "",
        },
      },
      forecast: {
        forecastday,
      },
    };
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        if (API_KEY) {
          const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
              searchCity
            )}&days=2&aqi=no&alerts=no`
          );

          if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const message =
              errorBody?.error?.message || response.statusText ||
              "Unable to fetch weather data. Please check your API key and city name.";
            throw new Error(message);
          }

          const data = await response.json();
          setWeatherData(data);
          return;
        }

        const locationResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            searchCity
          )}&count=1`
        );

        if (!locationResponse.ok) {
          throw new Error("Unable to resolve city location.");
        }

        const locationData = await locationResponse.json();
        const place = locationData.results?.[0];

        if (!place) {
          throw new Error("City not found. Please verify spelling.");
        }

        // Fixed query string parameters to match Open-Meteo structural mapping arrays
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=2`
        );

        if (!weatherResponse.ok) {
          throw new Error("Unable to fetch weather data from Open-Meteo.");
        }

        const openMeteoData = await weatherResponse.json();
        setWeatherData(mapOpenMeteoResponse(place, openMeteoData));
      } catch (error) {
        console.error("Error connecting to Weather API:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [searchCity, API_KEY]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSearchSubmit = (city) => {
    if (city.trim()) setSearchCity(city);
  };

  const toggleUnit = (unit) => {
    if (unit === "C") setIsCelsius(true);
    if (unit === "F") setIsCelsius(false);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#060C1A] flex items-center justify-center text-white font-mono tracking-wider">
        Loading SkySense Datastreams...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen bg-[#060C1A] flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <p className="text-red-400 text-lg font-semibold">{error}</p>
        <button 
          onClick={() => setSearchCity("Dhaka")}
          className="px-4 py-2 bg-[#0072ff] rounded-xl hover:bg-[#005ccc] transition-all text-sm font-medium"
        >
          Reset to Dhaka
        </button>
      </div>
    );
  }

  return (
    <div className={`w-screen min-h-screen pt-[30px] overflow-x-hidden relative select-none transition-colors duration-300 ${
      isDarkMode ? "bg-[#060C1A]" : "bg-[#F4F6F9]"
    }`}>
      <Sidebar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      
      <div className="flex justify-between pl-[118px] h-full items-stretch">
        <Middle 
          isDarkMode={isDarkMode} 
          apiData={weatherData} 
          isCelsius={isCelsius}
          onSearchSubmit={handleSearchSubmit}
          onUnitToggle={toggleUnit}
        />
        <End 
          isDarkMode={isDarkMode} 
          apiData={weatherData} 
          isCelsius={isCelsius}
        />
      </div>
    </div>
  );
}

export default App;
