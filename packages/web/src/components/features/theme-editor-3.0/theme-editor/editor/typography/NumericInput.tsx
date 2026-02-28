'use client';

import React, { useState, useCallback, KeyboardEvent } from 'react';
import { Input } from '@/components/primitives/ui/input';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
}

export function NumericInput({ 
  value, 
  onChange, 
  placeholder, 
  className = "", 
  step = 0.1,
  min,
  max,
  unit
}: NumericInputProps) {
  const [localValue, setLocalValue] = useState(() => {
    // Extract numeric value only
    return parseFloat(value).toString() || '0';
  });

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue(parseFloat(value).toString() || '0');
  }, [value]);

  // Extract unit from value or use provided unit
  const getUnit = useCallback(() => {
    if (unit) return unit;
    const extractedUnit = value.replace(/[\d.-]/g, '').trim();
    return extractedUnit || 'px';
  }, [value, unit]);

  const handleIncrement = useCallback(() => {
    const currentValue = parseFloat(localValue) || 0;
    let newValue = currentValue + step;
    
    // Apply min/max constraints
    if (min !== undefined && newValue < min) newValue = min;
    if (max !== undefined && newValue > max) newValue = max;
    
    // Round to maximum 2 decimal places
    newValue = Math.round(newValue * 100) / 100;
    const newValueStr = newValue.toString();
    const newValueWithUnit = `${newValueStr}${getUnit()}`;
    
    setLocalValue(newValueStr);
    onChange(newValueWithUnit);
  }, [localValue, onChange, step, min, max, getUnit]);

  const handleDecrement = useCallback(() => {
    const currentValue = parseFloat(localValue) || 0;
    let newValue = currentValue - step;
    
    // Apply min/max constraints
    if (min !== undefined && newValue < min) newValue = min;
    if (max !== undefined && newValue > max) newValue = max;
    
    // Round to maximum 2 decimal places
    newValue = Math.round(newValue * 100) / 100;
    const newValueStr = newValue.toString();
    const newValueWithUnit = `${newValueStr}${getUnit()}`;
    
    setLocalValue(newValueStr);
    onChange(newValueWithUnit);
  }, [localValue, onChange, step, min, max, getUnit]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  }, [handleIncrement, handleDecrement]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only allow numeric input with max 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(newValue) || newValue === '') {
      setLocalValue(newValue);
      const newValueWithUnit = `${newValue}${getUnit()}`;
      onChange(newValueWithUnit);
    }
  }, [onChange, getUnit]);

  const handleBlur = useCallback(() => {
    // Ensure the value is properly formatted on blur with max 2 decimal places
    const numericValue = parseFloat(localValue) || 0;
    const roundedValue = Math.round(numericValue * 100) / 100;
    const formattedValue = roundedValue.toString();
    setLocalValue(formattedValue);
    onChange(`${formattedValue}${getUnit()}`);
  }, [localValue, onChange, getUnit]);

  return (
    <div className="relative flex items-center">
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={parseFloat(placeholder || '0').toString()}
        className={`h-8 text-xs pr-12 ${className}`}
        title="Use ↑/↓ arrows or spinner buttons to adjust values"
      />
      
      {/* Unit display */}
      <span className="absolute right-8 text-xs text-muted-foreground pointer-events-none">
        {getUnit()}
      </span>
      
      {/* Spinner buttons */}
      <div className="absolute right-1 flex flex-col">
        <button
          type="button"
          onClick={handleIncrement}
          className="h-3 w-3 flex items-center justify-center hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          <ChevronUp className="h-2 w-2" />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          className="h-3 w-3 flex items-center justify-center hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          <ChevronDown className="h-2 w-2" />
        </button>
      </div>
    </div>
  );
}