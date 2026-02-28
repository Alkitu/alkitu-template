'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Badge } from '@/components/atoms-alianza/Badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/primitives/ui/popover';
import { Calendar } from '@/components/primitives/ui/calendar';
import { useThemeEditor } from '../../core/context/ThemeEditorContext';

export interface DatePickerMoleculeProps {
  value?: Date | { from?: Date; to?: Date };
  onChange?: (date: Date | { from?: Date; to?: Date } | undefined) => void;
  placeholder?: string;
  format?: string;
  variant?: 'default' | 'inline' | 'range' | 'datetime';
  disabled?: boolean;
  clearable?: boolean;
  showToday?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

/**
 * DatePickerMolecule - Advanced date picker with theme integration
 * 
 * Combines: Popover + Calendar + Input + Button + Badge
 * Features: DateTime support, range selection, validation, theme-responsive
 * Spacing: Small (input padding), Medium (popover gaps), Large (section spacing)
 */
export function DatePickerMolecule({
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  format: dateFormat = 'PPP',
  variant = 'default',
  disabled = false,
  clearable = true,
  showToday = true,
  minDate,
  maxDate,
  className = '',
  error,
  label,
  required = false
}: DatePickerMoleculeProps) {
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
  const largeSpacing = `var(--spacing-large, ${baseValue * 4}px)`;

  // Local state
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [time, setTime] = useState({ hours: '12', minutes: '00' });
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced date formatting helper with range support
  const formatDate = (dateValue: Date | { from?: Date; to?: Date } | undefined, format: string = 'PPP') => {
    if (!dateValue) return '';

    // Handle range values
    if (typeof dateValue === 'object' && 'from' in dateValue) {
      const range = dateValue as { from?: Date; to?: Date };
      if (!range.from) return '';
      
      const fromFormatted = formatSingleDate(range.from, format);
      if (range.to) {
        const toFormatted = formatSingleDate(range.to, format);
        return `${fromFormatted} - ${toFormatted}`;
      }
      return fromFormatted + ' (Select end date)';
    }

    // Handle single date
    return formatSingleDate(dateValue as Date, format);
  };

  const formatSingleDate = (date: Date, format: string = 'PPP') => {
    if (!date || isNaN(date.getTime())) return '';
    
    try {
      if (format === 'PPP pp' || variant === 'datetime') {
        return date.toLocaleString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return date.toISOString().split('T')[0];
    }
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  // Update input value when external value changes - Enhanced for range support
  useEffect(() => {
    const formatted = formatDate(value, dateFormat);
    setInputValue(formatted);
    
    // Handle datetime for single dates only
    if (variant === 'datetime' && value && typeof value === 'object' && 'getTime' in value) {
      const date = value as Date;
      if (!isNaN(date.getTime())) {
        setTime({
          hours: date.getHours().toString().padStart(2, '0'),
          minutes: date.getMinutes().toString().padStart(2, '0')
        });
      }
    }
  }, [value, dateFormat, variant]);

  // Enhanced date selection handler with range support
  const handleDateSelect = (selected: Date | { from?: Date; to?: Date } | undefined) => {
    if (!selected) {
      onChange?.(undefined);
      setInputValue('');
      setIsOpen(false);
      return;
    }

    if (variant === 'range') {
      onChange?.(selected as { from?: Date; to?: Date });
      // Keep popover open until range is complete
      const range = selected as { from?: Date; to?: Date };
      if (range.from && range.to) {
        setIsOpen(false);
      }
    } else {
      const selectedDate = selected as Date;
      let finalDate = selectedDate;

      // Add time for datetime variant
      if (variant === 'datetime') {
        finalDate = new Date(selectedDate);
        finalDate.setHours(parseInt(time.hours), parseInt(time.minutes));
      }

      onChange?.(finalDate);
      
      // Close popover for non-inline variants
      if (variant !== 'inline') {
        setIsOpen(false);
      }
    }
  };

  // Handle manual input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = event.target.value;
    setInputValue(inputVal);

    const parsed = parseDate(inputVal);
    if (parsed) {
      onChange?.(parsed);
    }
  };

  // Clear date
  const handleClear = () => {
    onChange?.(undefined);
    setInputValue('');
    setIsOpen(false);
  };

  // Select today
  const handleToday = () => {
    const today = new Date();
    handleDateSelect(today);
  };

  // Handle time change for datetime variant
  const handleTimeChange = (type: 'hours' | 'minutes', timeValue: string) => {
    const newTime = { ...time, [type]: timeValue };
    setTime(newTime);

    if (value) {
      const updatedDate = new Date(value as Date);
      updatedDate.setHours(parseInt(newTime.hours), parseInt(newTime.minutes));
      onChange?.(updatedDate);
    }
  };

  // Styles
  const getContainerStyles = () => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: mediumSpacing,
    marginBottom: largeSpacing
  });

  const getLabelStyles = () => ({
    fontFamily: 'var(--typography-emphasis-font-family)',
    fontSize: 'var(--typography-emphasis-font-size)',
    fontWeight: 'var(--typography-emphasis-font-weight)',
    color: colors?.foreground?.value || 'var(--color-foreground)',
    marginBottom: smallSpacing
  });

  const getInputContainerStyles = () => ({
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  const getErrorStyles = () => ({
    fontFamily: 'var(--typography-paragraph-font-family)',
    fontSize: 'calc(var(--typography-paragraph-font-size) * 0.875)',
    color: colors?.destructive?.value || 'var(--color-destructive)',
    marginTop: '4px'
  });

  const getPopoverContentStyles = () => ({
    padding: mediumSpacing,
    background: `${colors?.popover?.value || 'var(--color-popover)'}f8`,
    border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
    borderRadius: 'var(--radius-popover, 12px)',
    boxShadow: `${shadows?.shadowLg || 'var(--shadow-lg)'}, 0 0 0 1px ${colors?.border?.value || 'var(--color-border)'}20`,
    minWidth: variant === 'datetime' ? 'min(340px, calc(100vw - 40px))' : 'min(300px, calc(100vw - 40px))',
    maxWidth: 'calc(100vw - 20px)',
    backdropFilter: 'blur(8px)',
    animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'var(--radix-popover-content-transform-origin)'
  });

  const getTimeInputStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: mediumSpacing,
    padding: `12px ${smallSpacing}`,
    background: `${colors?.accent?.value || 'var(--color-accent)'}40`,
    borderRadius: 'var(--radius, 8px)',
    border: `1px solid ${colors?.border?.value || 'var(--color-border)'}60`,
    backdropFilter: 'blur(4px)',
    transition: 'all 0.3s ease'
  });

  // Render time inputs for datetime variant
  const renderTimeInputs = () => {
    if (variant !== 'datetime') return null;

    return (
      <div style={getTimeInputStyles()} className="max-sm:flex-col max-sm:items-stretch max-sm:gap-2">
        <Clock className="h-4 w-4 max-sm:self-center" style={{ color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)' }} />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column' as const, 
          alignItems: 'center',
          gap: '4px'
        }}>
          <label style={{
            fontSize: '11px',
            fontWeight: 600,
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px'
          }}>Hora</label>
          <input
            type="number"
            min="0"
            max="23"
            value={time.hours}
            onChange={(e) => handleTimeChange('hours', e.target.value)}
            style={{
              width: '50px',
              height: '36px',
              padding: '6px 8px',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
              borderRadius: 'var(--radius, 6px)',
              background: colors?.background?.value || 'var(--color-background)',
              color: colors?.foreground?.value || 'var(--color-foreground)',
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: '14px',
              fontWeight: 500,
              textAlign: 'center' as const,
              transition: 'all 0.3s ease',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
            }}
            className="focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
          />
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 600,
          color: colors?.primary?.value || 'var(--color-primary)',
          marginTop: '16px'
        }}>:</div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column' as const, 
          alignItems: 'center',
          gap: '4px'
        }}>
          <label style={{
            fontSize: '11px',
            fontWeight: 600,
            color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px'
          }}>Min</label>
          <input
            type="number"
            min="0"
            max="59"
            value={time.minutes}
            onChange={(e) => handleTimeChange('minutes', e.target.value)}
            style={{
              width: '50px',
              height: '36px',
              padding: '6px 8px',
              border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
              borderRadius: 'var(--radius, 6px)',
              background: colors?.background?.value || 'var(--color-background)',
              color: colors?.foreground?.value || 'var(--color-foreground)',
              fontFamily: 'var(--typography-paragraph-font-family)',
              fontSize: '14px',
              fontWeight: 500,
              textAlign: 'center' as const,
              transition: 'all 0.3s ease',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
            }}
            className="focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
          />
        </div>
      </div>
    );
  };

  // Inline variant renders calendar directly
  if (variant === 'inline') {
    return (
      <div className={className} style={getContainerStyles()}>
        {label && (
          <label style={getLabelStyles()}>
            {label}
            {required && <span style={{ color: colors?.destructive?.value || 'var(--color-destructive)' }}>*</span>}
          </label>
        )}
        
        <div style={{
          border: `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
          borderRadius: 'var(--radius-card, 8px)',
          padding: mediumSpacing,
          background: colors?.background?.value || 'var(--color-background)'
        }}>
          <Calendar
            mode="single"
            selected={value as Date | undefined}
            onSelect={handleDateSelect as any}
            disabled={disabled}
            fromDate={minDate}
            toDate={maxDate}
          />
          
          {renderTimeInputs()}
          
          {showToday && (
            <div style={{ marginTop: mediumSpacing, display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Hoy
              </Button>
              {clearable && value && (
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Limpiar
                </Button>
              )}
            </div>
          )}
        </div>
        
        {error && <div style={getErrorStyles()}>{error}</div>}
      </div>
    );
  }

  // Default popover variant
  return (
    <div className={className} style={getContainerStyles()}>
      {label && (
        <label style={getLabelStyles()}>
          {label}
          {required && <span style={{ color: colors?.destructive?.value || 'var(--color-destructive)' }}>*</span>}
        </label>
      )}
      
      <div style={getInputContainerStyles()}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              style={{
                width: '100%',
                justifyContent: 'space-between',
                fontWeight: inputValue ? 500 : 400,
                color: inputValue 
                  ? (colors?.foreground?.value || 'var(--color-foreground)') 
                  : (colors?.mutedForeground?.value || 'var(--color-muted-foreground)'),
                minHeight: '40px',
                padding: `8px ${smallSpacing}`,
                borderRadius: 'var(--radius, 8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: isOpen 
                  ? `2px solid ${colors?.primary?.value || 'var(--color-primary)'}` 
                  : `1px solid ${colors?.border?.value || 'var(--color-border)'}`,
                boxShadow: isOpen 
                  ? `0 0 0 2px ${colors?.primary?.value || 'var(--color-primary)'}20`
                  : 'none'
              }}
              className={`
                group relative overflow-hidden
                ${!disabled ? 'hover:bg-accent/50 hover:scale-[0.99] active:scale-[0.98]' : ''}
                ${isOpen ? 'bg-accent/30' : ''}
                transition-all duration-300 ease-out
              `}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                flex: 1,
                minWidth: 0
              }}>
                <CalendarIcon 
                  className="h-4 w-4" 
                  style={{
                    color: inputValue 
                      ? (colors?.primary?.value || 'var(--color-primary)') 
                      : (colors?.mutedForeground?.value || 'var(--color-muted-foreground)'),
                    flexShrink: 0,
                    transition: 'color 0.3s ease'
                  }} 
                />
                <span style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '14px',
                  lineHeight: 1.4
                }}>
                  {inputValue || placeholder}
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0
              }}>
                {clearable && inputValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      padding: '0',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease',
                      background: 'transparent'
                    }}
                    className="hover:bg-destructive/20 hover:scale-110 active:scale-95"
                  >
                    <X className="h-3 w-3" style={{
                      color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)',
                      transition: 'color 0.2s ease'
                    }} />
                  </Button>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          
          <PopoverContent style={getPopoverContentStyles()}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Calendar
              {...{
                mode: variant === 'range' ? 'range' : 'single',
                selected: value,
                onSelect: handleDateSelect,
                fromDate: minDate,
                toDate: maxDate,
                autoFocus: true,
              } as any}
            />
            
            {renderTimeInputs()}
            
            <div style={{ 
              marginTop: mediumSpacing, 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: `1px solid ${colors?.border?.value || 'var(--color-border)'}40`
            }}>
              {showToday && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleToday}
                  style={{
                    borderRadius: '6px',
                    fontWeight: 500,
                    fontSize: '13px',
                    transition: 'all 0.3s ease',
                    background: `${colors?.primary?.value || 'var(--color-primary)'}10`,
                    borderColor: `${colors?.primary?.value || 'var(--color-primary)'}40`,
                    color: colors?.primary?.value || 'var(--color-primary)'
                  }}
                  className="hover:scale-105 hover:shadow-sm active:scale-95"
                >
                  Hoy
                </Button>
              )}
              {clearable && value && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClear}
                  style={{
                    borderRadius: '6px',
                    fontWeight: 500,
                    fontSize: '13px',
                    transition: 'all 0.3s ease',
                    color: colors?.mutedForeground?.value || 'var(--color-muted-foreground)'
                  }}
                  className="hover:scale-105 hover:bg-destructive/20 hover:text-destructive active:scale-95"
                >
                  <X className="h-3 w-3" style={{ marginRight: '4px' }} />
                  Limpiar
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Enhanced text input for power users */}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="dd/mm/yyyy"
          disabled={disabled}
          style={{ 
            width: '160px',
            fontFamily: 'var(--typography-paragraph-font-family)',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: 'var(--radius, 8px)',
            transition: 'all 0.3s ease',
            background: colors?.background?.value || 'var(--color-background)',
            borderColor: colors?.border?.value || 'var(--color-border)'
          }}
          className="focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none hover:border-primary/60"
        />
      </div>
      
      {error && <div style={getErrorStyles()}>{error}</div>}
    </div>
  );
}

// Export preset configurations - Enhanced with proper range support
export const DatePickerPresets = {
  basic: {
    variant: 'default' as const,
    clearable: true,
    showToday: true
  },
  
  datetime: {
    variant: 'datetime' as const,
    format: 'PPP pp',
    clearable: true,
    showToday: true
  },
  
  inline: {
    variant: 'inline' as const,
    clearable: true,
    showToday: true
  },
  
  range: {
    variant: 'range' as const,
    placeholder: 'Select date range...',
    clearable: true,
    showToday: true
  }
};