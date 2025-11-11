'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | { from?: Date; to?: Date } | undefined;
  onSelect?: (date: Date | Date[] | { from?: Date; to?: Date } | undefined) => void;
  disabled?: boolean | ((date: Date) => boolean);
  fromDate?: Date;
  toDate?: Date;
  defaultMonth?: Date;
  initialFocus?: boolean;
  className?: string;
}

/**
 * Basic Calendar implementation for DatePicker
 * This is a simplified version - replace with full calendar when available
 */
export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  disabled = false,
  fromDate,
  toDate,
  defaultMonth = new Date(),
  className = ''
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(defaultMonth);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    if (disabled) return;
    
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (fromDate && clickedDate < fromDate) return;
    if (toDate && clickedDate > toDate) return;

    if (mode === 'single') {
      onSelect?.(clickedDate);
    } else if (mode === 'multiple') {
      const currentSelected = (selected as Date[]) || [];
      const isAlreadySelected = currentSelected.some(date => 
        date.toDateString() === clickedDate.toDateString()
      );
      
      if (isAlreadySelected) {
        // Remove if already selected
        const newSelected = currentSelected.filter(date => 
          date.toDateString() !== clickedDate.toDateString()
        );
        onSelect?.(newSelected);
      } else {
        // Add to selection
        onSelect?.([...currentSelected, clickedDate]);
      }
    } else if (mode === 'range') {
      const currentRange = selected as { from?: Date; to?: Date } | undefined;
      
      if (!currentRange?.from || currentRange?.to) {
        // Start new range
        onSelect?.({ from: clickedDate, to: undefined });
      } else if (clickedDate < currentRange.from) {
        // New start date
        onSelect?.({ from: clickedDate, to: undefined });
      } else {
        // Complete range
        onSelect?.({ from: currentRange.from, to: clickedDate });
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    
    const checkDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (mode === 'single' && selected instanceof Date) {
      return selected.toDateString() === checkDate.toDateString();
    } else if (mode === 'multiple' && Array.isArray(selected)) {
      return selected.some(date => date.toDateString() === checkDate.toDateString());
    } else if (mode === 'range' && selected && typeof selected === 'object' && !Array.isArray(selected)) {
      const range = selected as { from?: Date; to?: Date };
      if (range.from && range.to) {
        return checkDate >= range.from && checkDate <= range.to;
      } else if (range.from) {
        return checkDate.toDateString() === range.from.toDateString();
      }
    }
    
    return false;
  };

  const isToday = (day: number) => {
    const today = new Date();
    const checkDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return today.toDateString() === checkDate.toDateString();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const selected = isSelected(day);
    const today = isToday(day);
    
    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        disabled={disabled === true}
        className={`
          p-2 text-center rounded hover:bg-accent hover:text-accent-foreground
          ${selected ? 'bg-primary text-primary-foreground' : 'text-foreground'}
          ${today && !selected ? 'font-bold text-foreground' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{
          fontFamily: 'var(--typography-paragraph-font-family)',
          fontSize: 'var(--typography-paragraph-font-size)'
        }}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-foreground" style={{
          fontFamily: 'var(--typography-emphasis-font-family)',
          fontSize: 'var(--typography-emphasis-font-size)',
          fontWeight: 'var(--typography-emphasis-font-weight)'
        }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}