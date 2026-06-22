import React, { useState, useEffect } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { Middle } from "./components/Middle";
import { End } from "./components/End";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dynamic application state variables
  const [searchCity, setSearchCity] = useState("Dhaka");
  const [isCelsius, setIsCelsius] = useState(true);

  // Sign up for a free key at weatherapi.com and paste it here
  const API_KEY = "YOUR_WEATHERAPI_KEY"; 

  useEffect(() => {
    const fetchWeather = async () => {
      if (!API_KEY || API_KEY === "YOUR_WEATHERAPI_KEY") {
        setError("Please enter a valid weatherapi.com API key in App.jsx");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Fetches a 2-day forecast to correctly show current hours and look ahead to tomorrow
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchCity}&days=2&aqi=no&alerts=no`
        );
        
        if (!response.ok) {
          throw new Error("City not found. Please verify spelling.");
        }
        
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error connecting to Weather API:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [searchCity]); // Re-fetches whenever the user changes the city selection

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
    <div className={`w-screen h-screen pt-[30px] overflow-hidden relative select-none transition-colors duration-300 ${
      isDarkMode ? "bg-[#060C1A]" : "bg-[#F4F6F9]"
    }`}>
      <Sidebar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      
      <div className="flex justify-between pl-[118px] h-full items-stretch">
        {/* Pass down search states, unit metrics, and raw JSON data fields */}
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
