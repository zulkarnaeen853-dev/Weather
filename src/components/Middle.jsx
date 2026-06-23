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

export const Middle = ({
  isDarkMode,
  apiData,
  isCelsius,
  onSearchSubmit,
  onUnitToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Extract layers safely into dedicated tracking objects
  const current = apiData?.current || {};
  const location = apiData?.location || {};
  const forecastday = apiData?.forecast?.forecastday || [];

  // Isolate the primary forecast tracking indices
  const todayForecast = forecastday[0] || {};
  const todayDay = todayForecast.day || {};
  const todayAstro = todayForecast.astro || {};

  const currentTemp = current.temp_c || 26;
  const currentFeelsLike = current.feelslike_c || 26;
  const highTemp = todayDay.maxtemp_c || 27;
  const lowTemp = todayDay.mintemp_c || 10;
  const mainIconUrl = current.condition?.icon || "";

  const cityName = location.name
    ? `${location.name}, ${location.country}`
    : "Bangladesh";
  const conditionText = current.condition?.text || "Cloudy";

  const sunriseTime = todayAstro.sunrise || "6:45 AM";
  const sunsetTime = todayAstro.sunset || "5:30 PM";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  // Setup timestamp display conversion metrics
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const localTimeEpoch = location.localtime_epoch;
  const localDateObj = localTimeEpoch
    ? new Date(localTimeEpoch * 1000)
    : new Date();
  const currentHourIndex = localDateObj.getHours();

  const dayName = daysOfWeek[localDateObj.getDay()];
  const formattedDate = `${localDateObj.getDate()} ${monthsOfYear[localDateObj.getMonth()]} ${localDateObj.getFullYear()}`;

  // Process the 24-hour horizontal forecast slider row - DYNAMIC based on current hour
  const hourlyDataArray = todayForecast.hour || [];

  const mappedHourlyForecast =
    hourlyDataArray.length > currentHourIndex
      ? hourlyDataArray
          .slice(currentHourIndex, currentHourIndex + 7)
          .map((hourItem) => {
            // Splits "2023-12-24 13:00" into ["2023-12-24", "13:00"]
            const dateTimeParts = hourItem.time
              ? hourItem.time.split(" ")
              : ["", "12:00"];
            const clockTime = dateTimeParts[1] || "12:00";

            // Isolates the numeric hour segment safely
            let hourNumber = parseInt(clockTime.split(":")[0]) || 12;
            const ampm = hourNumber >= 12 ? "PM" : "AM";
            hourNumber = hourNumber % 12 || 12;

            return {
              time: `${hourNumber}${ampm}`,
              temp: !isCelsius
                ? Math.round(hourItem.temp_f)
                : Math.round(hourItem.temp_c),
              iconUrl: hourItem.condition?.icon || "",
            };
          })
      : [
          { time: "1PM", temp: 20, iconUrl: "" },
          { time: "2PM", temp: 21, iconUrl: "" },
          { time: "3PM", temp: 20, iconUrl: "" },
          { time: "4PM", temp: 19, iconUrl: "" },
          { time: "5PM", temp: 18, iconUrl: "" },
          { time: "6PM", temp: 18, iconUrl: "" },
          { time: "7PM", temp: 15, iconUrl: "" },
        ];

  // Map tomorrow's outlook safely by targeting index 1
  const tomorrowForecast = forecastday[1] || {};
  const tomorrowDayObj = tomorrowForecast.day || {};
  const tomorrowMaxTemp = !isCelsius
    ? Math.round(tomorrowDayObj.maxtemp_f || 57)
    : Math.round(tomorrowDayObj.maxtemp_c || 14);
  const tomorrowConditionText =
    tomorrowDayObj.condition?.text || "Thunder storm";
  const tomorrowIconUrl = tomorrowDayObj.condition?.icon || "";

  return (
    <div className="min-h-0">
      <main className="w-full pl-[75px] pr-[30px] transition-all min-h-0 overflow-hidden">
        <form
          onSubmit={handleSearchSubmit}
          className={`pt-[16.5px] pb-[16.5px] pl-[22px] flex gap-6 rounded-[50px] w-[670px] mb-17 transition-colors duration-300 border ${
            isDarkMode
              ? "bg-[#0E1421] border-slate-900/40 text-white"
              : "bg-white border-slate-200 text-black shadow-sm"
          }`}
        >
          <button
            type="submit"
            className="bg-transparent border-none p-0 outline-none cursor-pointer"
          >
            <Search
              className={`w-5 h-5 ${isDarkMode ? "text-slate-500 hover:text-[#742BEC]" : "text-slate-400 hover:text-[#742BEC]"}`}
            />
          </button>

          <input
            type="text"
            placeholder="Search City...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`text-[14px] font-normal bg-transparent outline-none w-full ${isDarkMode ? "!text-white/90 placeholder:text-gray-500" : "!text-[#0E1421] placeholder:text-gray-400"}`}
          />
        </form>

        <div
          className={`max-w-[870px] w-full h-[370px] rounded-[32px] relative overflow-hidden select-none shadow-2xl mb-20 transition-colors duration-300 ${
            isDarkMode ? "bg-transparent" : "bg-white border border-slate-200"
          }`}
        >
          {isDarkMode && (
            <img
              src={temp}
              alt="Dashboard Background"
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            />
          )}

          <div className="relative w-full h-full p-[31px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8.5">
              <div className="w-auto h-10 bg-[#742BEC] rounded-[50px] flex items-center gap-[13px] px-[18px]">
                <MapPin className="w-5 h-5 text-white" />
                <h2 className="font-normal text-[16px] text-white whitespace-nowrap">
                  {cityName}
                </h2>
              </div>

              <div
                onClick={() => onUnitToggle(isCelsius ? "F" : "C")}
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
                    !isCelsius ? "translate-x-0" : "translate-x-[44px]"
                  } ${isDarkMode ? "bg-white text-black" : "bg-[#742BEC] text-white"}`}
                >
                  {!isCelsius ? "F" : "C"}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <h1
                  className={`text-[40px] font-medium tracking-tight leading-none transition-colors ${
                    isDarkMode ? "text-white" : "text-[#0E1421]"
                  }`}
                >
                  {dayName}
                </h1>
                <p
                  className={`text-[16px] font-normal mb-8.5 transition-colors ${
                    isDarkMode ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  {formattedDate}
                </p>

                <div
                  className={`text-[64px] font-medium tracking-tighter leading-none flex items-start transition-colors ${
                    isDarkMode ? "text-white" : "text-[#0E1421]"
                  }`}
                >
                  {!isCelsius
                    ? Math.round((currentTemp * 9) / 5 + 32)
                    : Math.round(currentTemp)}
                  <span className="text-[64px] font-medium mt-2 ml-0.5">
                    {!isCelsius ? "°F" : "°C"}
                  </span>
                </div>
                <p
                  className={`text-[16px] font-normal mt-2 transition-colors ${
                    isDarkMode ? "text-white/80" : "text-slate-500"
                  }`}
                >
                  {!isCelsius
                    ? `High: ${Math.round((highTemp * 9) / 5 + 32)} Low: ${Math.round((lowTemp * 9) / 5 + 32)}`
                    : `High: ${Math.round(highTemp)} Low: ${Math.round(lowTemp)}`}
                </p>
              </div>

              <div className="flex flex-col items-end text-right">
                <div className="relative w-44 h-32 mb-2 flex items-center justify-center">
                  {mainIconUrl ? (
                    <img
                      src={mainIconUrl}
                      alt={conditionText}
                      className="w-28 h-28 object-contain z-10 scale-150"
                    />
                  ) : (
                    <>
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
                    </>
                  )}
                </div>

                <h3
                  className={`text-[32px] font-medium tracking-wide leading-none transition-colors ${
                    isDarkMode ? "text-white" : "text-[#0E1421]"
                  }`}
                >
                  {conditionText}
                </h3>
                <p
                  className={`text-[16px] font-normal mt-2 transition-colors ${
                    isDarkMode ? "text-white/80" : "text-slate-500"
                  }`}
                >
                  Feels Like{" "}
                  {!isCelsius
                    ? Math.round((currentFeelsLike * 9) / 5 + 32)
                    : Math.round(currentFeelsLike)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[870px] grid grid-cols-[1fr_280px] gap-4">
          <div
            className={`rounded-[32px] h-[310px] p-[24px] flex flex-col gap-4 justify-between border transition-all duration-300 ${
              isDarkMode
                ? "bg-[#0E1421] border-slate-900/40"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <h3
              className={`text-[16px] font-medium transition-colors ${
                isDarkMode ? "text-white" : "text-[#0E1421]"
              }`}
            >
              Today / Week
            </h3>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {mappedHourlyForecast.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-between w-[58px] h-[106px] border rounded-[14px] py-3 px-1 transition-all flex-shrink-0 ${
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
                  {item.iconUrl ? (
                    <img
                      src={item.iconUrl}
                      alt="hour icon"
                      className="w-6 h-6 object-contain my-1"
                    />
                  ) : (
                    <CloudSun className="w-5 h-5 text-[#FFB800] fill-[#FFB800]/20 my-1" />
                  )}
                  <span
                    className={`text-[13px] font-medium transition-colors ${
                      isDarkMode ? "text-white" : "text-[#0E1421]"
                    }`}
                  >
                    {item.temp}°
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 ">
            <div
              className={`rounded-[32px] p-[15px] border transition-all duration-300 h-[120px] ${
                isDarkMode
                  ? "bg-[#121826] border-slate-800/30"
                  : "bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 shadow-inner"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span
                    className={`text-[13px] font-medium transition-colors ${
                      isDarkMode ? "text-slate-200" : "text-[#0E1421]"
                    }`}
                  >
                    Tomorrow
                  </span>
                  <p
                    className={`text-[22px] font-semibold mt-3 transition-colors ${
                      isDarkMode ? "text-white" : "text-[#0E1421]"
                    }`}
                  >
                    {tomorrowMaxTemp}°
                  </p>
                  <span
                    className={`block text-[11px] mt-1 transition-colors ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {tomorrowConditionText}
                  </span>
                </div>

                <div className={`w-18 h-18 rounded-[24px] flex items-center justify-center ${
                  isDarkMode ? "bg-[#0E172B]" : "bg-slate-100"
                }`}>
                  {tomorrowIconUrl ? (
                    <img
                      src={tomorrowIconUrl}
                      alt={tomorrowConditionText}
                      className="w-11 h-11 object-contain"
                    />
                  ) : (
                    <Cloud
                      className={`w-10 h-10 transition-colors ${
                        isDarkMode
                          ? "text-[#5E6575] fill-[#2B303C]"
                          : "text-slate-400 fill-slate-200"
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>

            <div
              className={`rounded-[32px] p-[15px] border transition-all duration-300 h-[180px] ${
                isDarkMode
                  ? "bg-[#0E1421] border-slate-900/40"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="">
                <div className="flex items-center gap-5">
                  <span
                    className={`text-[14px] font-medium tracking-wide transition-colors ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Sunrise:
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span
                      className={`text-[18px] font-semibold transition-colors ${
                        isDarkMode ? "text-white" : "text-[#0E1421]"
                      }`}
                    >
                      {sunriseTime.split(" ")[0]}
                    </span>
                    <span
                      className={`text-[11px] font-bold transition-colors ${
                        isDarkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {sunriseTime.split(" ")[1]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <span
                    className={`text-[14px] font-medium tracking-wide transition-colors  ${
                      isDarkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Sunset:
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span
                      className={`text-[18px] font-semibold transition-colors ${
                        isDarkMode ? "text-white" : "text-[#0E1421]"
                      }`}
                    >
                      {sunsetTime.split(" ")[0]}
                    </span>
                    <span
                      className={`text-[11px] font-bold transition-colors ${
                        isDarkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {sunsetTime.split(" ")[1]}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`border-t pt-4 mt-4 transition-colors flex gap-5 items-center ${
                  isDarkMode ? "border-slate-800/80" : "border-slate-100"
                }`}
              >
                <span
                  className={`text-[12px] font-medium tracking-wide transition-colors ${
                    isDarkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Length of day:
                </span>
                <p
                  className={`text-[15px] font-semibold mt-1 transition-colors ${
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {todayAstro.moonrise ? "11h 42m" : "13h 22m"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
