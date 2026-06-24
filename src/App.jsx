import React, { useState, useEffect } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { Middle } from "./components/Middle";
import { End } from "./components/End";

const weatherCodeText = {
  0: "Clear", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle",
  53: "Moderate drizzle", 55: "Dense drizzle", 56: "Light freezing drizzle",
  57: "Dense freezing drizzle", 61: "Slight rain", 63: "Moderate rain",
  65: "Heavy rain", 66: "Light freezing rain", 67: "Heavy freezing rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
  77: "Snow grains", 80: "Rain showers", 81: "Moderate rain showers",
  82: "Violent rain showers", 85: "Snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
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

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Location Coordinates via Open-Meteo Geocoding API
        const locationResponse = await fetch(
          `https://open-meteo.com{encodeURIComponent(searchCity)}&count=1`
        );

        if (!locationResponse.ok) {
          throw new Error("Unable to contact geocoding network.");
        }

        const locationData = await locationResponse.json();
        const place = locationData.results?.[0];

        if (!place) {
          throw new Error("City not found. Please check your spelling.");
        }

        // 2. Fetch Complete Weather Parameters safely from Open-Meteo Forecast API
        const weatherResponse = await fetch(
          `https://open-meteo.com{place.latitude}&longitude=${place.longitude}&current_weather=true&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,weathercode,visibility,pressure_msl&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=3`
        );

        if (!weatherResponse.ok) {
          throw new Error("Failed to receive weather data streams.");
        }

        const openMeteoData = await weatherResponse.json();
        
        const hourly = openMeteoData.hourly || {};
        const daily = openMeteoData.daily || {};
        const currentTempC = openMeteoData.current_weather?.temperature ?? 0;

        // 3. Map Open-Meteo response arrays cleanly to mimic standard WeatherAPI layout payloads
        const mockPayload = {
          location: {
            name: place.name,
            country: place.country || "Global",
            localtime: openMeteoData.current_weather?.time?.replace("T", " ") || "2026-06-24 12:00",
          },
          current: {
            temp_c: currentTempC,
            temp_f: cToF(currentTempC),
            feelslike_c: hourly.apparent_temperature?.[0] ?? currentTempC,
            feelslike_f: cToF(hourly.apparent_temperature?.[0] ?? currentTempC),
            humidity: hourly.relativehumidity_2m?.[0] ?? 60,
            uv: daily.uv_index_max?.[0] ?? 5,
            wind_kph: Math.round(openMeteoData.current_weather?.windspeed ?? 0),
            vis_km: (hourly.visibility?.[0] ?? 10000) / 1000,
            pressure_mb: hourly.pressure_msl?.[0] ?? 1013,
            condition: {
              text: getWeatherText(openMeteoData.current_weather?.weathercode ?? 0),
              icon: ""
            }
          },
          forecast: {
            forecastday: (daily.time || []).map((date, idx) => {
              const startIdx = idx * 24;
              return {
                date,
                day: {
                  maxtemp_c: daily.temperature_2m_max?.[idx] ?? 0,
                  mintemp_c: daily.temperature_2m_min?.[idx] ?? 0,
                  maxtemp_f: cToF(daily.temperature_2m_max?.[idx] ?? 0),
                  mintemp_f: cToF(daily.temperature_2m_min?.[idx] ?? 0),
                  daily_chance_of_rain: daily.precipitation_probability_max?.[idx] ?? 0,
                  condition: {
                    text: getWeatherText(daily.weathercode?.[idx] ?? 0),
                    icon: ""
                  }
                },
                astro: {
                  sunrise: daily.sunrise?.[idx] ? daily.sunrise[idx].split("T")[1] : "06:00 AM",
                  sunset: daily.sunset?.[idx] ? daily.sunset[idx].split("T")[1] : "06:00 PM"
                },
                hour: (hourly.time || []).slice(startIdx, startIdx + 24).map((t, hIdx) => {
                  const globalIdx = startIdx + hIdx;
                  return {
                    time: t.replace("T", " "),
                    temp_c: hourly.temperature_2m?.[globalIdx] ?? 0,
                    temp_f: cToF(hourly.temperature_2m?.[globalIdx] ?? 0),
                    condition: {
                      text: getWeatherText(hourly.weathercode?.[globalIdx] ?? 0),
                      icon: ""
                    }
                  };
                })
              };
            })
          }
        };

        setWeatherData(mockPayload);
      } catch (err) {
        console.error("Pipeline failure:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [searchCity]);

  const toggleTheme = () => setIsDarkMode((p) => !p);
  const handleSearchSubmit = (city) => city.trim() && setSearchCity(city);
  const toggleUnit = (u) => setIsCelsius(u === "C");

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
          Reset Demo
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
        <Middle isDarkMode={isDarkMode} apiData={weatherData} isCelsius={isCelsius} onSearchSubmit={handleSearchSubmit} onUnitToggle={toggleUnit} />
        <End isDarkMode={isDarkMode} apiData={weatherData} isCelsius={isCelsius} />
      </div>
    </div>
  );
}

export default App;
