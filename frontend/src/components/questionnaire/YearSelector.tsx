// src/components/questionnaire/YearSelector.tsx
'use client';

import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface YearSelectorProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ selectedYear, onYearChange }) => {
  // Generate array of years (current year - 10 to current year + 2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 13 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="relative">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
        <label htmlFor="year-select" className="text-sm font-medium text-gray-700 mr-3">
          Financial Year:
        </label>
      </div>
      
      <div className="relative mt-1">
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
        >
          {years.map((year) => (
            <option key={year} value={year.toString()}>
              FY {year}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default YearSelector;