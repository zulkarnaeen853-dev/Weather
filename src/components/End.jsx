import React from 'react';

const citiesData = [
  { id: 1, temp: 14, name: 'USA', high: 23, low: 10 },
  { id: 2, temp: 27, name: 'Dubai - UAE', high: 23, low: 10 },
  { id: 3, temp: 16, name: 'China Nuevo', high: 23, low: 10 },
  { id: 4, temp: 26, name: 'Canada', high: 23, low: 10 },
];

export const End = ({ isDarkMode }) => {
  return (
    /* Changed height to h-full to occupy 100% of parent and expanded width to 670px */
    <div className={`w-[800px] h-[calc(100vh-60px)] flex flex-col gap-20 overflow-y-auto pr-2 font-sans transition-colors duration-300 ${
      isDarkMode ? "text-white" : "text-[#0E1421]"
    }`}>
      
      {/* Top User Profile Header Row */}
      <div className="flex justify-end items-center">
        <div className={`flex items-center gap-3 py-2 px-5 rounded-full border transition-all cursor-pointer ${
          isDarkMode ? "bg-[#0E1421] border-slate-800/40" : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            👤
          </div>
          <span className={`text-[13px] font-medium ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
            User Name
          </span>
          <span className="text-[10px] text-slate-500 ml-1">▼</span>
        </div>
      </div>

      {/* Today Highlight Grid Container Card */}
      <div className={`rounded-[32px] p-[28px] flex flex-col gap-5 border transition-all duration-300 ${
        isDarkMode ? "bg-[#0E1421] border-slate-900/40" : "bg-white border-slate-200 shadow-sm"
      }`}>
        <h3 className="text-[17px] font-medium tracking-wide">Today Highlight</h3>
        
        {/* Expanded Grid Track Grid Columns */}
        <div className="grid grid-cols-2 gap-5">
          {/* Chance of Rain */}
          <div className={`h-[120px] rounded-[22px] p-5 flex flex-col justify-between ${isDarkMode ? "bg-[#151C2C]/60" : "bg-slate-50 border border-slate-100"}`}>
            <span className="text-[13px] text-slate-500 font-medium">Chance of Rain</span>
          </div>

          {/* UV Index */}
          <div className={`h-[120px] rounded-[22px] p-5 flex flex-col justify-between ${isDarkMode ? "bg-[#151C2C]/60" : "bg-slate-50 border border-slate-100"}`}>
            <span className="text-[13px] text-slate-500 font-medium">UV Index</span>
            <div className="flex justify-center items-center h-full text-3xl">☀️</div>
          </div>

          {/* Wind Status */}
          <div className={`h-[120px] rounded-[22px] p-5 flex flex-col justify-between ${isDarkMode ? "bg-[#151C2C]/60" : "bg-slate-50 border border-slate-100"}`}>
            <span className="text-[13px] text-slate-500 font-medium">Wind Status</span>
            <div className="flex gap-2 items-end h-9 w-full px-2">
              <div className="bg-blue-400 w-5 h-4 rounded-sm" />
              <div className="bg-blue-500 w-5 h-7 rounded-sm" />
              <div className="bg-slate-300 w-5 h-9 rounded-sm" />
            </div>
          </div>

          {/* Humidity */}
          <div className={`h-[120px] rounded-[22px] p-5 flex flex-col justify-between ${isDarkMode ? "bg-[#151C2C]/60" : "bg-slate-50 border border-slate-100"}`}>
            <span className="text-[13px] text-slate-500 font-medium">Humidity</span>
            <div className="text-right text-2xl">☁️</div>
          </div>
        </div>
      </div>

      {/* Other Cities Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[17px] font-medium tracking-wide">Other Cities</h3>
          <button className="text-[13px] font-semibold text-slate-500 hover:text-purple-500 transition-colors">
            Show All
          </button>
        </div>

        {/* Cities Two Column Extra-Wide Grid Layout */}
        <div className="grid grid-cols-2 gap-5">
          {citiesData.map((city) => (
            <div
              key={city.id}
              className={`rounded-[24px] p-[20px] flex flex-col justify-between h-[125px] border transition-all duration-300 ${
                isDarkMode 
                  ? "bg-[#0E1421] border-slate-900/40 hover:bg-[#151C2C]" 
                  : "bg-white border-slate-200 shadow-sm hover:bg-slate-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[34px] font-semibold tracking-tighter leading-none">
                    {city.temp}°
                  </span>
                  <span className={`text-[11px] font-medium mt-1.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    H:{city.high}° L:{city.low}°
                  </span>
                </div>
                {/* Weather Status Graphic Indicator Icon */}
                <div className="text-3xl select-none">...</div>
              </div>
              <span className={`text-[13px] font-medium tracking-wide ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                {city.name}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
