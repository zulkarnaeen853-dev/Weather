import React, { useState, useEffect } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { Middle } from "./components/Middle";
import { End } from "./components/End";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace with your actual free API key from weatherapi.com
  const API_KEY = "YOUR_WEATHERAPI_KEY"; 
  const CITY = "Dhaka";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Requests a 1-day forecast containing the full 24-hour array matching the timezone
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&days=1&aqi=no&alerts=no`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error connecting to Weather API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#060C1A] flex items-center justify-center text-white">
        Loading SkySense Datastreams...
      </div>
    );
  }

  return (
    <div className={`w-screen h-screen pt-[30px] overflow-hidden relative select-none transition-colors duration-300 ${
      isDarkMode ? "bg-[#060C1A]" : "bg-[#F4F6F9]"
    }`}>
      <Sidebar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      
      <div className="flex justify-between pl-[118px] h-full items-stretch">
        {/* Pass the live data down into your dashboard elements */}
        <Middle isDarkMode={isDarkMode} apiData={weatherData} />
        <End isDarkMode={isDarkMode} apiData={weatherData} />
      </div>
    </div>
  );
}

export default App;
