import React, { useState } from "react";
import { parseISO } from "date-fns";
import { format, addDays, subDays, startOfWeek, endOfWeek, isWithinInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { FaCalendarAlt, FaTimes, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DateRangePicker = ({ onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState(null);

  const handleDateMatch = (apiResponse, selectedRange) => {
    const { startDate, endDate } = selectedRange;

    if (!startDate || !endDate) {
      console.log("Date range not fully selected.");
      return false;
    }

    const updatedAt = parseISO(apiResponse.updated_at);
    

    const isMatch = isWithinInterval(updatedAt, {
      start: startDate,
      end: endDate,
    });

    if (isMatch) {
      console.log("The date matches the range!", updatedAt);
    } else {
      console.log("The date is outside the selected range.", updatedAt);
    }

    return isMatch;
  };

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startDay = startOfWeek(firstDayOfMonth);
    const days = [];

    for (let i = 0; i < 42; i++) {
      days.push(addDays(startDay, i));
    }

    return days;
  };

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const isDateInRange = (date) => {
    if (startDate && !endDate && hoverDate) {
      return isWithinInterval(date, {
        start: startDate,
        end: hoverDate,
      });
    }
    if (startDate && endDate) {
      return isWithinInterval(date, { start: startDate, end: endDate });
    }
    return false;
  };

  const predefinedRanges = [
    {
      label: "Last 7 days",
      fn: () => {
        const end = new Date();
        const start = subDays(end, 6);
        setStartDate(start);
        setEndDate(end);
      },
    },
    {
      label: "Last 30 days",
      fn: () => {
        const end = new Date();
        const start = subDays(end, 29);
        setStartDate(start);
        setEndDate(end);
      },
    },
    {
      label: "This Month",
      fn: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setStartDate(start);
        setEndDate(end);
      },
    },
  ];

  const handleApply = () => {
    if (startDate && endDate) {
      const selectedRange = { startDate, endDate };

      const apiResponse = {
        created_at: null,
        updated_at: "2024-12-04T07:58:51.000Z", // Example API response
      };

      const matchResult = handleDateMatch(apiResponse, selectedRange);
      console.log("Date match result:", matchResult);

      if (onApply) onApply(selectedRange);
      setIsOpen(false);
      setIsPeriodOpen(false);
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center space-x-4 bg-white rounded-lg p-4 shadow-lg border border-blue-100">
        <div className="relative flex-1">
          <div
            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-blue-400 transition-all duration-300 ease-in-out bg-white"
            onClick={() => {
              setIsOpen(!isOpen);
              setIsPeriodOpen(false);
            }}
          >
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-blue-500" />
              <span className="text-gray-700">
                From: {startDate ? format(startDate, "MMM dd, yyyy") : "Select date"}
              </span>
            </div>
          </div>

          {isOpen && (
            <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-2xl z-50 border border-blue-100 p-4 transform transition-all duration-300 ease-in-out">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-blue-50 rounded-full">
                  <FaChevronLeft className="text-blue-500" />
                </button>
                <span className="text-lg font-semibold text-gray-700">
                  {format(currentMonth, "MMMM yyyy")}
                </span>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-blue-50 rounded-full">
                  <FaChevronRight className="text-blue-500" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 w-[300px]">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-700 py-2">
                    {day}
                  </div>
                ))}

                {generateCalendarDays().map((date, index) => {
                  const isSelected = (startDate && isSameDay(date, startDate)) || (endDate && isSameDay(date, endDate));
                  const isInRange = isDateInRange(date);

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => !endDate && startDate && setHoverDate(date)}
                      onMouseLeave={() => setHoverDate(null)}
                      className={`
                        p-2 text-sm rounded-md transition-all duration-200
                        ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                        ${isInRange ? "bg-blue-100" : "hover:bg-blue-50"}
                        ${currentMonth.getMonth() !== date.getMonth() ? "text-gray-400" : "text-gray-700"}
                      `}
                    >
                      {format(date, "d")}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <div
            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-blue-400 transition-all duration-300 ease-in-out bg-white"
            onClick={() => {
              setIsOpen(!isOpen);
              setIsPeriodOpen(false);
            }}
          >
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-blue-500" />
              <span className="text-gray-700">
                To: {endDate ? format(endDate, "MMM dd, yyyy") : "Select date"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:border-blue-400 transition-all duration-300 ease-in-out bg-white min-w-[150px]"
            onClick={() => {
              setIsPeriodOpen(!isPeriodOpen);
              setIsOpen(false);
            }} >
            <span className="text-gray-700">Period</span>
            <FaChevronDown className="text-blue-500" />
          </div>

          {isPeriodOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-2xl z-50 border border-blue-100 p-2 min-w-[150px] transform transition-all duration-300 ease-in-out">
              {predefinedRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    range.fn();
                    setIsPeriodOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded-md transition-all duration-200"
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleApply}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex-shrink-0 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Apply now
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;