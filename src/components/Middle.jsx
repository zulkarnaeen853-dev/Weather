import {
  Cloud,
  CloudLightning,
  CloudSun,
  MapPin,
  Search,
  Sun,
} from "lucide-react";
import React, { useState } from "react";
import temp from "../assets/section 1.png";

export const Middle = ({ isDarkMode, apiData }) => {
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Extract current weather data from API
  const currentTemp = apiData?.current?.temp_c || 26;
  const currentFeelsLike = apiData?.current?.feelslike_c || 26;
  const highTemp = apiData?.forecast?.forecastday?.[0]?.day?.maxtemp_c || 27;
  const lowTemp = apiData?.forecast?.forecastday?.[0]?.day?.mintemp_c || 10;

  const handleTemperatureUnitToggle = () => {
    setIsFahrenheit((prev) => !prev);
  };

  const hourlyForecast = [
    { time: "1PM", temp: 20, icon: CloudSun },
    { time: "2PM", temp: 21, icon: CloudSun },
    { time: "3PM", temp: 20, icon: CloudSun },
    { time: "4PM", temp: 19, icon: CloudSun },
    { time: "5PM", temp: 18, icon: CloudSun },
    { time: "6PM", temp: 18, icon: CloudSun },
    { time: "7PM", temp: 15, icon: CloudSun },
  ];

  return (
    <div>
      {/* Main Panel Display Viewport Container */}
      <main className="w-full pl-[75px] pr-[30px] transition-all h-[calc(100vh-60px)]">
        {/* Search Bar Container */}
        <div
          className={`pt-[16.5px] pb-[16.5px] pl-[22px] flex gap-6 rounded-[50px] w-[670px] mb-17 transition-colors duration-300 border ${
            isDarkMode 
              ? "bg-[#0E1421] border-slate-900/40 text-white" 
              : "bg-white border-slate-200 text-black shadow-sm"
          }`}
        >
          <Search
            className={`w-5 h-5 ${isDarkMode ? "text-slate-500 hover:text-[#742BEC]" : "text-slate-400 hover:text-[#742BEC]"}`}
          />

          <input
            type="text"
            placeholder="Search City...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`text-[14px] font-normal bg-transparent outline-none w-full ${isDarkMode ? "!text-white/90 placeholder:text-gray-500" : "!text-[#0E1421] placeholder:text-gray-400"}`}
          />
        </div>

        {/* Weather Main Card Container */}
        <div
          className={`w-[870px] h-[370px] rounded-[32px] relative overflow-hidden select-none shadow-2xl mb-20 transition-colors duration-300 ${
            isDarkMode ? "bg-transparent" : "bg-white border border-slate-200" 
          }`}
        >
          {/* Background Asset Overlay Layer (Only visible in Dark Mode) */}
          {isDarkMode && (
            <img
              src={temp}
              alt="Dashboard Card Background Skin Graphics Asset"
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            />
          )}

          {/* Foreground UI Components Content Container */}
          <div className="relative z-10 w-full h-full p-[31px] flex flex-col justify-between">
            {/* Top Meta Controls Row */}
            <div className="flex items-center justify-between mb-8.5">
              {/* Location Badge */}
              <div className="w-40 h-10 bg-[#742BEC] rounded-[50px] flex items-center gap-[13px] px-[13px]">
                <MapPin className="w-5 h-5 text-white" />
                <h2 className="font-normal text-[16px] text-white">
                  Bangladesh
                </h2>
              </div>

              {/* F/C Unit Toggle Switcher */}
              <div
                onClick={handleTemperatureUnitToggle}
                className={`w-[78px] h-[34px] backdrop-blur-sm rounded-full p-[3px] flex items-center relative cursor-pointer select-none border transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-[#060C1A]/80 border-white/5"
                    : "bg-slate-200 border-slate-300/50"
                }`}
              >
                <div
                  className={`absolute inset-0 flex justify-between px-3.5 items-center text-[13px] font-bold pointer-events-none transition-colors ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  <span>F</span>
                  <span>C</span>
                </div>
                <div
                  className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[13px] font-bold shadow-md transition-all duration-300 z-10 ${
                    isFahrenheit ? "translate-x-0" : "translate-x-[44px]"
                  } ${isDarkMode ? "bg-white text-black" : "bg-[#742BEC] text-white"}`}
                >
                  {isFahrenheit ? "F" : "C"}
                </div>
              </div>
            </div>
            
            {/* Core Layout Data Wrapper Split */}
            <div className="flex justify-between items-end">
              {/* Left Side: Readings Figures */}
              <div className="flex flex-col">
                <h1
                  className={`text-[40px] font-medium tracking-tight leading-none transition-colors ${
                    isDarkMode ? "text-white" : "text-[#0E1421]"
                  }`}
                >
                  Monday
                </h1>
                <p
                  className={`text-[16px] font-normal mb-8.5 transition-colors ${
                    isDarkMode ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  24 Dec, 2023
                </p>

                <div
                  className={`text-[64px] font-medium tracking-tighter leading-none flex items-start transition-colors ${
                    isDarkMode ? "text-white" : "text-[#0E1421]"
                  }`}
                >
                  {isFahrenheit ? Math.round((currentTemp * 9) / 5 + 32) : Math.round(currentTemp)}
                  <span className="text-[64px] font-medium mt-2 ml-0.5">
                    {isFahrenheit ? "°F" : "°C"}
                  </span>
                </div>
                <p
                  className={`text-[16px] font-normal mt-2 transition-colors ${
                    isDarkMode ? "text-white/80" : "text-slate-500"
                  }`}
                >
                  {isFahrenheit 
                    ? `High: ${Math.round((highTemp * 9) / 5 + 32)} Low: ${Math.round((lowTemp * 9) / 5 + 32)}`
                    : `High: ${Math.round(highTemp)} Low: ${Math.round(lowTemp)}`
                  }
                </p>
              </div>

              {/* Right Side: Hero Visual Illustration */}
              <div className="flex flex-col items-end text-right">
                <div className="relative w-44 h-32 mb-2 flex items-center justify-center">
                  <div className="absolute top-0 right-3">
                    <Sun className="w-[84px] h-[84px] text-[#FFB800] fill-[#FFB800]" />
                  </div>

                  <div className="absolute bottom-0 right-0 drop-shadow-2xl">
                    <Cloud
                      className={`w-[110px] h-[110px] stroke-[1.5] transition-all ${
                        isDarkMode
                          ? "text-[#717684] fill-[#3A3F4D]/90"
                          : "text-slate-400 fill-slate-100/90"
                      }`}
                    />
                  </div>

                  {isDarkMode && (
                    <div className="absolute bottom-2 right-4 opacity-40 mix-blend-screen">
                      <Cloud className="w-[90px] h-[90px] text-white/40 fill-white/10" />
                    </div>
                  )}
                </div>

                <h3
                  className={`text-[32px] font-medium tracking-wide leading-none transition-colors ${
                    isDarkMode ? "text-white" : "text-[#0E1421]"
                  }`}
                >
                  Cloudy
                </h3>
                <p
                  className={`text-[16px] font-normal mt-2 transition-colors ${
                    isDarkMode ? "text-white/80" : "text-slate-500"
                  }`}
                >
                  Feels Like {isFahrenheit ? Math.round((currentFeelsLike * 9) / 5 + 32) : Math.round(currentFeelsLike)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex gap-6 select-none font-sans">
          {/* Left Forecast Container */}
          <div
            className={`flex-1 rounded-[32px] p-[24px] flex flex-col gap-6 justify-between border transition-all duration-300 ${
              isDarkMode
                ? "bg-[#0E1421] border-slate-900/40"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div>
              <h3
                className={`text-[16px] font-medium mb-4 transition-colors ${
                  isDarkMode ? "text-white" : "text-[#0E1421]"
                }`}
              >
                Today / Week
              </h3>

              {/* Horizontal Scrollable Tracking Row */}
              <div className="flex justify-between gap-1.5">
                {hourlyForecast.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-between w-[58px] h-[106px] border rounded-[14px] py-3 px-1 transition-all ${
                      isDarkMode
                        ? "bg-[#161D2F]/50 border-slate-800/40 hover:bg-[#161D2F]/80"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`text-[11px] font-medium transition-colors ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {item.time}
                    </span>
                    <item.icon className="w-5 h-5 text-[#FFB800] fill-[#FFB800]/20 my-1" />
                    <span
                      className={`text-[13px] font-medium transition-colors ${
                        isDarkMode ? "text-white" : "text-[#0E1421]"
                      }`}
                    >
                      {item.temp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tomorrow Warning Card Layer */}
            <div
              className={`w-full h-[84px] border rounded-[22px] px-6 flex items-center justify-between transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#121826] to-[#1C263B] border-slate-800/30"
                  : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 shadow-inner"
              }`}
            >
              <div className="flex flex-col">
                <span
                  className={`text-[13px] font-medium transition-colors ${
                    isDarkMode ? "text-slate-200" : "text-[#0E1421]"
                  }`}
                >
                  Tomorrow
                </span>
                <span
                  className={`text-[11px] mt-0.5 transition-colors ${
                    isDarkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Thunder storm
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-[26px] font-semibold tracking-tight transition-colors ${
                    isDarkMode ? "text-white" : "text-[#0E1421]"
                  }`}
                >
                  14°
                </span>
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <Cloud
                    className={`w-9 h-9 transition-colors ${
                      isDarkMode
                        ? "text-[#5E6575] fill-[#2B303C]"
                        : "text-slate-400 fill-slate-200"
                    }`}
                  />
                  <CloudLightning className="w-5 h-5 text-blue-500 absolute bottom-[-2px] right-[-1px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Sunrise, Sunset, and Length of day Astronomy parameters */}
          <div
            className={`w-[172px] rounded-[32px] p-[24px] flex flex-col justify-between border transition-all duration-300 ${
              isDarkMode
                ? "bg-[#0E1421] border-slate-900/40"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex flex-col gap-5">
              {/* Sunrise */}
              <div className="flex flex-col">
                <span
                  className={`text-[12px] font-medium tracking-wide transition-colors ${
                    isDarkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Sunrise
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span
                    className={`text-[22px] font-semibold tracking-tight transition-colors ${
                      isDarkMode ? "text-white" : "text-[#0E1421]"
                    }`}
                  >
                    6:45
                  </span>
                  <span
                    className={`text-[11px] font-bold transition-colors ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    AM
                  </span>
                </div>
              </div>

              {/* Sunset */}
              <div className="flex flex-col">
                <span
                  className={`text-[12px] font-medium tracking-wide transition-colors ${
                    isDarkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Sunset
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span
                    className={`text-[22px] font-semibold tracking-tight transition-colors ${
                      isDarkMode ? "text-white" : "text-[#0E1421]"
                    }`}
                  >
                    5:30
                  </span>
                  <span
                    className={`text-[11px] font-bold transition-colors ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    PM
                  </span>
                </div>
              </div>
            </div>

            {/* Daylength divider indicator track */}
            <div
              className={`flex flex-col border-t pt-4 mt-2 transition-colors ${
                isDarkMode ? "border-slate-800/80" : "border-slate-100"
              }`}
            >
              <span
                className={`text-[12px] font-medium tracking-wide transition-colors ${
                  isDarkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Length of day
              </span>
              <span
                className={`text-[15px] font-semibold mt-1 transition-colors ${
                  isDarkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                10h 23m
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
