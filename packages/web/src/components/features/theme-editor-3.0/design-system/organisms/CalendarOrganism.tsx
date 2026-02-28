'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/primitives/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/primitives/ui/card';
import { Button } from '../atoms/Button';
import { Badge } from '@/components/atoms-alianza/Badge';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface CalendarOrganismProps {
  mode?: 'single' | 'multiple' | 'range';
  showFooter?: boolean;
  showHeader?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * CalendarOrganism - Complex calendar component with theme integration
 * 
 * Combines: Calendar + Card + Button + Badge + Typography
 * Features: Multiple selection modes, theme-responsive design, event management
 * Spacing: Small (internal padding), Medium (component gaps), Large (section spacing)
 */
export function CalendarOrganism({
  mode = 'single',
  showFooter = true,
  showHeader = true,
  title = 'Calendar',
  description = 'Select dates for your events',
  className = ''
}: CalendarOrganismProps) {
  const { state } = useThemeEditor();
  
  // Theme integration
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;
  const shadows = state.currentTheme?.shadows;
  const spacing = state.currentTheme?.spacing;

  // Spacing system
  const baseSpacing = spacing?.spacing || '2.2rem';
  const baseValue = parseFloat(baseSpacing.replace('rem', '')) * 16;
  const smallSpacing = `var(--spacing-small, ${baseValue}px)`;
  const mediumSpacing = `var(--spacing-medium, ${baseValue * 2}px)`;

  // State management - Fixed types and initialization
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);

  // Unified event handler - Fixed to handle all modes correctly
  const handleSelect = (selected: Date | Date[] | { from?: Date; to?: Date } | undefined) => {
    if (mode === 'single') {
      setSelectedDate(selected as Date | undefined);
    } else if (mode === 'multiple') {
      setSelectedDates(selected as Date[] || []);
    } else if (mode === 'range') {
      setSelectedRange(selected as { from?: Date; to?: Date } | undefined);
    }
  };

  const clearSelection = () => {
    setSelectedDate(undefined);
    setSelectedDates([]);
    setSelectedRange(undefined);
  };

  const selectToday = () => {
    const today = new Date();
    if (mode === 'single') {
      setSelectedDate(today);
    } else if (mode === 'multiple') {
      setSelectedDates([...selectedDates, today]);
    } else if (mode === 'range') {
      setSelectedRange({ from: today, to: undefined });
    }
  };

  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  // Get selected count for display - Fixed logic
  const getSelectedCount = () => {
    if (mode === 'single') return selectedDate ? 1 : 0;
    if (mode === 'multiple') return selectedDates.length;
    if (mode === 'range') {
      if (selectedRange?.from && selectedRange?.to) return 2;
      if (selectedRange?.from) return 1;
      return 0;
    }
    return 0;
  };

  return (
    <Card 
      className={`w-full max-w-md ${className}`}
      style={{
        background: `${colors?.card?.value || 'var(--color-card)'}`,
        border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
        boxShadow: shadows?.shadowMd || 'var(--shadow-md)'
      }}
    >
      {/* Header */}
      {showHeader && (
        <CardHeader style={{ padding: mediumSpacing }}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle 
                style={{ 
                  color: colors?.foreground?.value || 'var(--color-foreground)',
                  fontFamily: 'var(--typography-h3-font-family)',
                  fontSize: 'var(--typography-h3-font-size)',
                  marginBottom: '4px'
                }}
              >
                {title}
              </CardTitle>
              <CardDescription 
                style={{ 
                  color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                  fontSize: '14px'
                }}
              >
                {description}
              </CardDescription>
            </div>
            <Badge 
              variant="outline"
              style={{
                background: `${colors?.primary?.value || 'var(--color-primary)'}10`,
                borderColor: colors?.primary?.value || 'var(--color-primary)',
                color: colors?.primary?.value || 'var(--color-primary)'
              }}
            >
              {mode === 'single' ? 'Single' : mode === 'multiple' ? 'Multiple' : 'Range'}
            </Badge>
          </div>
        </CardHeader>
      )}

      {/* Calendar Content */}
      <CardContent style={{ padding: mediumSpacing, paddingTop: showHeader ? '0' : mediumSpacing }}>
        <div className="flex justify-center">
          {/* DayPicker v9 mode/props type mismatch with dynamic mode - cast props to any */}
          {React.createElement(Calendar as any, {
            mode: mode,
            selected: mode === 'single' ? selectedDate :
              mode === 'multiple' ? selectedDates :
              selectedRange,
            onSelect: handleSelect,
            className: "rounded-md border-0",
            style: {
              '--calendar-bg': colors?.background?.value || 'var(--color-background)',
              '--calendar-border': colors?.border?.value || 'var(--color-border)',
              '--calendar-selected': colors?.primary?.value || 'var(--color-primary)',
              '--calendar-selected-text': colors?.primaryForeground?.value || 'var(--color-primary-foreground)',
              '--calendar-hover': `${colors?.accent?.value || 'var(--color-accent)'}80`,
              width: '100%'
            } as React.CSSProperties
          })}
        </div>

        {/* Selection Info */}
        {getSelectedCount() > 0 && (
          <div 
            className="mt-4 p-3 rounded-lg"
            style={{
              background: `${colors?.accent?.value || 'var(--color-accent)'}20`,
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: colors?.foreground?.value || 'var(--color-foreground)' }}
                >
                  {getSelectedCount()} {getSelectedCount() === 1 ? 'date' : 'dates'} selected
                </p>
                {mode === 'single' && selectedDate && (
                  <p 
                    className="text-xs"
                    style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
                  >
                    {selectedDate.toLocaleDateString()}
                    {isToday(selectedDate) && ' (Today)'}
                  </p>
                )}
                {mode === 'multiple' && selectedDates.length > 0 && (
                  <p 
                    className="text-xs"
                    style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
                  >
                    {selectedDates.map(d => d.toLocaleDateString()).join(', ')}
                  </p>
                )}
                {mode === 'range' && selectedRange && (
                  <p 
                    className="text-xs"
                    style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }}
                  >
                    {selectedRange.from?.toLocaleDateString()} 
                    {selectedRange.to && ` - ${selectedRange.to.toLocaleDateString()}`}
                    {selectedRange.from && !selectedRange.to && ' (Select end date)'}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                style={{
                  color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                  fontSize: '12px'
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      {showFooter && (
        <CardFooter 
          className="flex justify-between"
          style={{ padding: mediumSpacing, paddingTop: 0 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={selectToday}
            style={{
              borderColor: colors?.border?.value || 'var(--color-border)',
              color: colors?.foreground?.value || 'var(--color-foreground)'
            }}
          >
            Today
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              style={{
                color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              disabled={getSelectedCount() === 0}
              style={{
                background: getSelectedCount() === 0 ? 
                  `${colors?.muted?.value || 'var(--color-muted)'}` :
                  colors?.primary?.value || 'var(--color-primary)',
                color: getSelectedCount() === 0 ?
                  colors?.mutedForeground?.value || 'var(--color-muted-foreground)' :
                  colors?.primaryForeground?.value || 'var(--color-primary-foreground)'
              }}
            >
              Confirm
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

/**
 * CalendarOrganismShowcase - Demo component showing different calendar variants
 */
export function CalendarOrganismShowcase() {
  const { state } = useThemeEditor();
  
  const colors = state.themeMode === 'dark' 
    ? state.currentTheme?.darkColors 
    : state.currentTheme?.lightColors;

  return (
    <div className="flex flex-wrap gap-6 w-full">
      <div className="flex-1 min-w-[300px] max-w-[400px]">
        <CalendarOrganism
          mode="single"
          title="Event Calendar"
          description="Select a date for your event"
        />
      </div>
      
      <div className="flex-1 min-w-[300px] max-w-[400px]">
        <CalendarOrganism
          mode="multiple"
          title="Multi-Select Calendar"
          description="Select multiple dates"
        />
      </div>
      
      <div className="flex-1 min-w-[300px] max-w-[400px]">
        <CalendarOrganism
          mode="range"
          title="Date Range Calendar"
          description="Select start and end dates"
        />
      </div>
    </div>
  );
}