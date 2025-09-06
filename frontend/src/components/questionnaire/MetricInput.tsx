// src/components/questionnaire/MetricInput.tsx
'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface MetricInputProps {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  required?: boolean;
  integer?: boolean;
  currency?: boolean;
  min?: number;
  max?: number;
}

const MetricInput: React.FC<MetricInputProps> = ({
  label,
  unit,
  value,
  onChange,
  placeholder,
  required = false,
  integer = false,
  currency = false,
  min = 0,
  max,
}) => {
  const [error, setError] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      onChange(0);
      setError(required ? 'This field is required' : '');
      return;
    }

    const numericValue = parseFloat(inputValue);
    
    // Validation
    if (isNaN(numericValue)) {
      setError('Please enter a valid number');
      return;
    }

    if (integer && !Number.isInteger(numericValue)) {
      setError('Please enter a whole number');
      return;
    }

    if (numericValue < min) {
      setError(`Value must be at least ${min}`);
      return;
    }

    if (max !== undefined && numericValue > max) {
      setError(`Value cannot exceed ${max}`);
      return;
    }

    setError('');
    onChange(numericValue);
  };

  const formatDisplayValue = (val: number): string => {
    if (val === 0) return '';
    if (currency) {
      return new Intl.NumberFormat('en-IN').format(val);
    }
    return val.toString();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
        {unit && <span className="text-gray-500 ml-1">({unit})</span>}
      </label>
      
      <div className="relative">
        <input
          type="number"
          value={formatDisplayValue(value)}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={integer ? 1 : 0.01}
          className={`
            w-full px-3 py-2 border rounded-lg transition-colors
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : isFocused
                ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
                : 'border-gray-300 hover:border-gray-400'
            }
            focus:ring-2 focus:outline-none
            ${currency ? 'pl-8' : ''}
          `}
        />
        
        {currency && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">₹</span>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-600 text-xs mt-1 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
      
      {max !== undefined && value > 0 && (
        <div className="text-xs text-gray-500">
          {((value / max) * 100).toFixed(1)}% of maximum ({max})
        </div>
      )}
    </div>
  );
};

export default MetricInput;