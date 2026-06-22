import { Calendar, ChartPie, LayoutPanelLeft, MapPin, Settings, SquareArrowRightExit } from 'lucide-react'
import bolt from "../assets/bolt.png";
import React from 'react'

export const Sidebar = ({ isDarkMode, onToggleTheme }) => {
  return (
    <div>
        <aside
        className={`w-[88px] h-[calc(100vh-60px)]  absolute left-[30px] top-[30px] pt-6 pb-6 mr-[30px] flex flex-col items-center justify-between rounded-[20px] border shadow-xl z-50 transition-colors duration-300 ${isDarkMode ? "bg-[#0E1421] border-slate-900/40" : "bg-white border-slate-200"}`}
      >
        <div className="flex flex-col items-center w-full">
          {/* Logo Brand Branding Header */}
          <div className="flex flex-col items-center mb-12 cursor-pointer group">
            <img
              src={bolt}
              alt="SkySense Lightning Bolt Branding Asset"
              className="w-7 h-7 object-contain mb-2 transition-transform duration-300 group-hover:scale-110"
            />
            <h2
              className={`text-[12px] font-medium tracking-tight transition-colors duration-300 ${isDarkMode ? "text-white/90" : "text-[#0E1421]"}`}
            >
              SkySense
            </h2>
          </div>

          {/* Navigation Link Menu Buttons */}
          <nav className="flex flex-col gap-[36px] items-center">
            <button
              className="p-1"
              aria-label="Dashboard Overview Grid Layout Shortcut Window"
            >
              <LayoutPanelLeft
                className={`transition-colors duration-200 w-6 h-6 ${isDarkMode ? "text-slate-500 hover:text-[#742BEC]" : "text-[#742BEC]"}`}
              />
            </button>
            <button
              className="p-1"
              aria-label="Metrics Analytics Performance Tracking Interface Screen"
            >
              <ChartPie
                className={`transition-colors duration-200 w-6 h-6 ${isDarkMode ? "text-slate-500 hover:text-[#742BEC]" : "text-[#742BEC]"}`}
              />
            </button>
            <button
              className="p-1"
              aria-label="Regional Station Map Location Tracking Pointer Dashboard Pin"
            >
              <MapPin
                className={`transition-colors duration-200 w-6 h-6 ${isDarkMode ? "text-slate-500 hover:text-[#742BEC]" : "text-[#742BEC]"}`}
              />
            </button>
            <button
              className="p-1"
              aria-label="Weekly Meteorological Planning Events Schedule Forecast Calendar System"
            >
              <Calendar
                className={`transition-colors duration-200 w-6 h-6 ${isDarkMode ? "text-slate-500 hover:text-[#742BEC]" : "text-[#742BEC]"}`}
              />
            </button>
            <button
              className="p-1"
              aria-label="System Settings Configuration Control Dashboard Screen Configuration Link"
            >
              <Settings
                className={`transition-colors duration-200 w-6 h-6 ${isDarkMode ? "text-slate-500 hover:text-[#742BEC]" : "text-[#742BEC]"}`}
              />
            </button>
          </nav>
        </div>

        {/* Bottom Actions Session Tools */}
        <div className="flex flex-col items-center gap-[32px] w-full">
          <button
            className="p-1"
            aria-label="Sign Out Secure Account System Exit Connection Session Switcher"
          >
            <SquareArrowRightExit
              className={`transition-colors duration-200 w-6 h-6 ${isDarkMode ? "text-slate-500 hover:text-[#742BEC]" : "text-[#742BEC]"}`}
            />
          </button>

          {/* Light/Dark Toggle Controller Button */}
          <div
            onClick={onToggleTheme}
            className={`w-[72px] h-[28px] rounded-full p-[3px] flex items-center shadow-inner border cursor-pointer transition-all duration-300 ${isDarkMode ? "bg-[#000000] border-slate-900/60 justify-end" : "bg-[#E2E8F0] border-slate-300 justify-start"}`}
          >
            <div
              className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-md transition-transform duration-300 ${isDarkMode ? "bg-[#d2d5db]" : "bg-white"}`}
            >
              {isDarkMode ? (
                /* Moon Icon SVG For Dark Mode Viewport */
                <svg
                  xmlns="http://w3.org"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                /* Sun Icon SVG For Light Mode Viewport */
                <svg
                  xmlns="http://w3.org"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFB800"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
