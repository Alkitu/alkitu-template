/**
 * DateTimeFieldEditor Component Tests
 *
 * Comprehensive test suite for the DateTimeFieldEditor molecule
 * Target coverage: 90%+
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTimeFieldEditor } from './DateTimeFieldEditor';
import type { FormField } from '../../types';

describe('DateTimeFieldEditor', () => {
  // Helper to create a base date field
  const createDateField = (overrides?: Partial<FormField>): FormField => ({
    id: 'date-1',
    type: 'date',
    label: 'Test Date Field',
    dateOptions: {
      mode: 'date',
      locale: 'en',
      hourCycle: 24,
      includeSeconds: false,
    },
    ...overrides,
  });

  const defaultProps = {
    field: createDateField(),
    onChange: vi.fn(),
    editingLocale: 'en' as const,
    defaultLocale: 'en' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<DateTimeFieldEditor {...defaultProps} />);
      const triggers = screen.getAllByText(/Field mode/i);
      expect(triggers.length).toBeGreaterThan(0);
    });

    it('should render all mode options', () => {
      render(<DateTimeFieldEditor {...defaultProps} />);
      expect(screen.getByText(/Date only/i)).toBeInTheDocument();
      expect(screen.getByText(/Time only/i)).toBeInTheDocument();
      expect(screen.getByText(/Date and time/i)).toBeInTheDocument();
    });

    it('should render locale options', () => {
      render(<DateTimeFieldEditor {...defaultProps} />);
      expect(screen.getByText(/English \(EN\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Español \(ES\)/i)).toBeInTheDocument();
    });

    it('should render in Spanish when locale is es', () => {
      render(<DateTimeFieldEditor {...defaultProps} editingLocale="es" />);
      expect(screen.getByText(/Solo fecha/i)).toBeInTheDocument();
      expect(screen.getByText(/Solo hora/i)).toBeInTheDocument();
      expect(screen.getByText(/Fecha y hora/i)).toBeInTheDocument();
    });
  });

  describe('Mode Selection', () => {
    it('should show date options when mode is date', () => {
      const field = createDateField({ dateOptions: { mode: 'date' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);
      expect(screen.getByText(/Date options/i)).toBeInTheDocument();
      expect(screen.queryByText(/Time options/i)).not.toBeInTheDocument();
    });

    it('should show time options when mode is time', () => {
      const field = createDateField({ dateOptions: { mode: 'time' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);
      expect(screen.getByText(/Time options/i)).toBeInTheDocument();
      expect(screen.queryByText(/Date options/i)).not.toBeInTheDocument();
    });

    it('should show both date and time options when mode is datetime', () => {
      const field = createDateField({ dateOptions: { mode: 'datetime' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);
      expect(screen.getByText(/Date options/i)).toBeInTheDocument();
      expect(screen.getByText(/Time options/i)).toBeInTheDocument();
    });

    it('should call onChange when mode changes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DateTimeFieldEditor {...defaultProps} onChange={onChange} />);

      const timeRadio = screen.getByLabelText(/Time only/i);
      await user.click(timeRadio);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateOptions: expect.objectContaining({
            mode: 'time',
          }),
        })
      );
    });
  });

  describe('Locale Selection', () => {
    it('should call onChange when locale changes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DateTimeFieldEditor {...defaultProps} onChange={onChange} />);

      const esRadio = screen.getByLabelText(/Español \(ES\)/i);
      await user.click(esRadio);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateOptions: expect.objectContaining({
            locale: 'es',
          }),
        })
      );
    });

    it('should disable locale selection when not in default locale', () => {
      render(<DateTimeFieldEditor {...defaultProps} editingLocale="es" defaultLocale="en" />);
      // Get locale radio buttons by their labels
      const enRadio = screen.getByLabelText(/English \(EN\)/i);
      const esRadio = screen.getByLabelText(/Español \(ES\)/i);
      expect(enRadio).toBeDisabled();
      expect(esRadio).toBeDisabled();
    });
  });

  describe('Date Options', () => {
    it('should render min date label', async () => {
      const field = createDateField({ dateOptions: { mode: 'date' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);

      // The nested "Date options" collapsible is defaultOpen, but may need a moment to render
      await waitFor(() => {
        expect(screen.getByText(/Minimum date/i)).toBeInTheDocument();
      });
    });

    it('should render max date label', async () => {
      const field = createDateField({ dateOptions: { mode: 'date' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);

      // The nested "Date options" collapsible is defaultOpen, but may need a moment to render
      await waitFor(() => {
        expect(screen.getByText(/Maximum date/i)).toBeInTheDocument();
      });
    });

    it('should call onChange when min date changes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const field = createDateField({ dateOptions: { mode: 'date' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} onChange={onChange} />);

      // Wait for the date options section to be visible
      await waitFor(() => {
        expect(screen.getByText(/Minimum date/i)).toBeInTheDocument();
      });

      const inputs = screen.getAllByDisplayValue('');
      const dateInput = inputs.find((input) => input.getAttribute('type') === 'date');
      if (dateInput) {
        await user.type(dateInput, '2024-01-01');
      }

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should toggle disable weekends', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const field = createDateField({ dateOptions: { mode: 'date' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} onChange={onChange} />);

      // Wait for the date options section to be visible
      await waitFor(() => {
        expect(screen.getByText(/Block weekends/i)).toBeInTheDocument();
      });

      // Get all switches and find the one for "Block weekends" (first one in date options)
      const switches = screen.getAllByRole('switch');
      const blockWeekendsSwitch = switches.find((sw) => {
        const container = sw.parentElement;
        return container?.textContent?.includes('Block weekends');
      });

      if (blockWeekendsSwitch) {
        await user.click(blockWeekendsSwitch);
      }

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            dateOptions: expect.objectContaining({
              disableWeekends: true,
            }),
          })
        );
      });
    });

    it('should display disabled dates list', async () => {
      const field = createDateField({
        dateOptions: {
          mode: 'date',
          disabledDates: [new Date('2024-12-25'), new Date('2024-01-01')],
        },
      });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);

      // Wait for the date options section to be visible, then check dates
      await waitFor(() => {
        expect(screen.getByText(/12\/25\/2024/)).toBeInTheDocument();
        expect(screen.getByText(/1\/1\/2024/)).toBeInTheDocument();
      });
    });

    it('should remove a disabled date', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const field = createDateField({
        dateOptions: {
          mode: 'date',
          disabledDates: [new Date('2024-12-25')],
        },
      });
      render(<DateTimeFieldEditor {...defaultProps} field={field} onChange={onChange} />);

      // Wait for the date options section to be visible
      await waitFor(() => {
        expect(screen.getByText(/12\/25\/2024/)).toBeInTheDocument();
      });

      const removeButton = screen.getByRole('button', { name: /Remove date/i });
      await user.click(removeButton);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateOptions: expect.objectContaining({
            disabledDates: [],
          }),
        })
      );
    });
  });

  describe('Time Options', () => {
    it('should render hour format options', async () => {
      const field = createDateField({ dateOptions: { mode: 'time' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);

      // Wait for the time options section to be visible
      await waitFor(() => {
        expect(screen.getByText(/12 hours \(AM\/PM\)/i)).toBeInTheDocument();
        expect(screen.getByText(/24 hours/i)).toBeInTheDocument();
      });
    });

    it('should toggle hour format', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const field = createDateField({ dateOptions: { mode: 'time', hourCycle: 24 } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} onChange={onChange} />);

      // Wait for the time options section to be visible
      await waitFor(() => {
        expect(screen.getByText(/Hour format/i)).toBeInTheDocument();
      });

      const format12Radio = screen.getByLabelText(/12 hours \(AM\/PM\)/i);
      await user.click(format12Radio);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateOptions: expect.objectContaining({
            hourCycle: 12,
          }),
        })
      );
    });

    it('should toggle include seconds', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const field = createDateField({ dateOptions: { mode: 'time' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} onChange={onChange} />);

      // Wait for the time options section to be visible (use getAllByText since there are multiple)
      await waitFor(() => {
        const includeSecondsElements = screen.getAllByText(/Include seconds/i);
        expect(includeSecondsElements.length).toBeGreaterThan(0);
      });

      // Get all switches and find the one for "Include seconds"
      const switches = screen.getAllByRole('switch');
      const includeSecondsSwitch = switches.find((sw) => {
        const container = sw.closest('div[class*="flex items-center justify-between"]');
        return container?.textContent?.includes('Include seconds');
      });

      if (includeSecondsSwitch) {
        await user.click(includeSecondsSwitch);
      }

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            dateOptions: expect.objectContaining({
              includeSeconds: true,
            }),
          })
        );
      });
    });

    it('should update min time', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const field = createDateField({ dateOptions: { mode: 'time' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} onChange={onChange} />);

      // Wait for the time options section to be visible
      await waitFor(() => {
        expect(screen.getByText(/Minimum time/i)).toBeInTheDocument();
      });

      const inputs = screen.getAllByDisplayValue('');
      const timeInput = inputs.find((input) => input.getAttribute('type') === 'time');
      if (timeInput) {
        await user.type(timeInput, '09:00');
      }

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });
  });

  describe('Business Hours', () => {
    it('should toggle business hours', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const field = createDateField({ dateOptions: { mode: 'time' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} onChange={onChange} />);

      // Wait for the time options section to be visible
      await waitFor(() => {
        expect(screen.getByText(/Business hours/i)).toBeInTheDocument();
      });

      // Open the Business Hours collapsible
      const businessHoursButton = screen.getByText(/Business hours/i);
      await user.click(businessHoursButton);

      // Now find and click the switch
      await waitFor(() => {
        expect(screen.getByText(/Enable business hours restriction/i)).toBeInTheDocument();
      });

      // Get all switches and find the one for "Enable business hours restriction"
      const switches = screen.getAllByRole('switch');
      const businessHoursSwitch = switches.find((sw) => {
        const container = sw.closest('div[class*="flex items-center justify-between"]');
        return container?.textContent?.includes('Enable business hours restriction');
      });

      if (businessHoursSwitch) {
        await user.click(businessHoursSwitch);
      }

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            dateOptions: expect.objectContaining({
              businessHours: expect.objectContaining({
                enabled: true,
              }),
            }),
          })
        );
      });
    });

    it('should show start/end time labels when business hours enabled', async () => {
      const user = userEvent.setup();
      const field = createDateField({
        dateOptions: {
          mode: 'time',
          businessHours: { enabled: true, start: '09:00', end: '17:00' },
        },
      });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);

      // Wait for the time options section to be visible
      await waitFor(() => {
        expect(screen.getByText(/Business hours/i)).toBeInTheDocument();
      });

      // Open the Business Hours collapsible
      const businessHoursButton = screen.getByText(/Business hours/i);
      await user.click(businessHoursButton);

      // Now check for start/end time labels
      await waitFor(() => {
        expect(screen.getByText(/Start time/i)).toBeInTheDocument();
        expect(screen.getByText(/End time/i)).toBeInTheDocument();
      });
    });
  });

  describe('Common Options', () => {
    it('should toggle required field', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DateTimeFieldEditor {...defaultProps} onChange={onChange} />);

      // Wait for common options to be visible
      await waitFor(() => {
        expect(screen.getByText(/Required field/i)).toBeInTheDocument();
      });

      // Get all switches and find the one for "Required field"
      const switches = screen.getAllByRole('switch');
      const requiredSwitch = switches.find((sw) => {
        const container = sw.closest('div[class*="flex items-center justify-between"]');
        return container?.textContent?.includes('Required field');
      });

      if (requiredSwitch) {
        await user.click(requiredSwitch);
      }

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            validation: expect.objectContaining({
              required: true,
            }),
          })
        );
      });
    });

    it('should update placeholder', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DateTimeFieldEditor {...defaultProps} onChange={onChange} />);

      const placeholderInput = screen.getByPlaceholderText(/Pick a date/i);
      await user.type(placeholderInput, 'Custom placeholder');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should toggle show description', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DateTimeFieldEditor {...defaultProps} onChange={onChange} />);

      // Wait for common options to be visible
      await waitFor(() => {
        expect(screen.getByText(/Show description/i)).toBeInTheDocument();
      });

      // Get all switches and find the one for "Show description"
      const switches = screen.getAllByRole('switch');
      const showDescSwitch = switches.find((sw) => {
        const container = sw.closest('div[class*="flex items-center justify-between"]');
        return container?.textContent?.includes('Show description');
      });

      if (showDescSwitch) {
        await user.click(showDescSwitch);
      }

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(
          expect.objectContaining({
            showDescription: true,
          })
        );
      });
    });

    it('should show description textarea when enabled', () => {
      const field = createDateField({ showDescription: true, description: 'Test description' });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);

      const descriptionTextarea = screen.getByDisplayValue('Test description');
      expect(descriptionTextarea).toBeInTheDocument();
    });

    it('should update description', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const field = createDateField({ showDescription: true });
      render(<DateTimeFieldEditor {...defaultProps} field={field} onChange={onChange} />);

      const descriptionTextarea = screen.getByPlaceholderText(/Description/i);
      await user.type(descriptionTextarea, 'New description');

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });
  });

  describe('Internationalization (i18n)', () => {
    it('should update placeholder in default locale', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DateTimeFieldEditor {...defaultProps} onChange={onChange} />);

      // Wait for common options to be visible
      await waitFor(() => {
        expect(screen.getByText(/Common options/i)).toBeInTheDocument();
      });

      const placeholderInput = screen.getByPlaceholderText(/Pick a date/i) as HTMLInputElement;

      // Type a single character to trigger onChange
      await user.type(placeholderInput, 'X');

      // Just check that onChange was called with dateOptions.placeholder
      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
        expect(lastCall[0].dateOptions).toHaveProperty('placeholder');
      });
    });

    it('should update placeholder in translation locale', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const field = createDateField({
        dateOptions: { placeholder: 'Default placeholder' },
        i18n: {},
      });
      render(
        <DateTimeFieldEditor
          {...defaultProps}
          field={field}
          onChange={onChange}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      // Wait for common options to be visible
      await waitFor(() => {
        expect(screen.getByText(/Opciones comunes/i)).toBeInTheDocument();
      });

      const placeholderInput = screen.getByPlaceholderText(/Seleccionar fecha/i) as HTMLInputElement;

      // Type a single character to trigger onChange
      await user.type(placeholderInput, 'X');

      // Just check that onChange was called with i18n.es.placeholder
      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
        expect(lastCall[0].i18n).toHaveProperty('es');
        expect(lastCall[0].i18n.es).toHaveProperty('placeholder');
      });
    });

    it('should show different default placeholders based on mode', () => {
      const dateField = createDateField({ dateOptions: { mode: 'date' } });
      const { rerender } = render(<DateTimeFieldEditor {...defaultProps} field={dateField} />);
      expect(screen.getByPlaceholderText(/Pick a date/i)).toBeInTheDocument();

      const timeField = createDateField({ dateOptions: { mode: 'time' } });
      rerender(<DateTimeFieldEditor {...defaultProps} field={timeField} />);
      expect(screen.getByPlaceholderText(/Pick a time/i)).toBeInTheDocument();

      const datetimeField = createDateField({ dateOptions: { mode: 'datetime' } });
      rerender(<DateTimeFieldEditor {...defaultProps} field={datetimeField} />);
      expect(screen.getByPlaceholderText(/Pick date and time/i)).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable radio inputs when disabled prop is true', () => {
      const field = createDateField({ dateOptions: { mode: 'date' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} disabled={true} />);

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it('should disable inputs when editing non-default locale', () => {
      render(<DateTimeFieldEditor {...defaultProps} editingLocale="es" defaultLocale="en" />);

      const modeRadios = screen.getAllByRole('radio');
      modeRadios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    it('should show read-only message for date fields in translation', () => {
      const field = createDateField({
        dateOptions: { mode: 'date', minDate: new Date('2024-01-01') },
      });
      render(<DateTimeFieldEditor {...defaultProps} field={field} editingLocale="es" defaultLocale="en" />);

      expect(screen.getByText(/No editable en traducción/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle field without dateOptions', () => {
      const field = createDateField({ dateOptions: undefined });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);
      const triggers = screen.getAllByText(/Field mode/i);
      expect(triggers.length).toBeGreaterThan(0);
    });

    it('should handle empty disabled dates array', () => {
      const field = createDateField({ dateOptions: { mode: 'date', disabledDates: [] } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);
      expect(screen.queryByRole('button', { name: /Remove date/i })).not.toBeInTheDocument();
    });

    it('should handle business hours without start/end times', async () => {
      const user = userEvent.setup();
      const field = createDateField({
        dateOptions: { mode: 'time', businessHours: { enabled: true } },
      });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);

      // Wait for the time options section to be visible
      await waitFor(() => {
        expect(screen.getByText(/Business hours/i)).toBeInTheDocument();
      });

      // Open the Business Hours collapsible
      const businessHoursButton = screen.getByText(/Business hours/i);
      await user.click(businessHoursButton);

      // Now check for start time label
      await waitFor(() => {
        expect(screen.getByText(/Start time/i)).toBeInTheDocument();
      });
    });

    it('should format date strings correctly', () => {
      const field = createDateField({
        dateOptions: { mode: 'date', disabledDates: ['2024-12-25'] },
      });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);
      expect(screen.getByText(/12\/25\/2024/)).toBeInTheDocument();
    });
  });

  describe('Complex Interactions', () => {
    it('should handle switching between modes correctly', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { rerender } = render(<DateTimeFieldEditor {...defaultProps} onChange={onChange} />);

      const timeRadio = screen.getByLabelText(/Time only/i);
      await user.click(timeRadio);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateOptions: expect.objectContaining({ mode: 'time' }),
        })
      );

      const updatedField = createDateField({ dateOptions: { mode: 'time' } });
      rerender(<DateTimeFieldEditor {...defaultProps} field={updatedField} onChange={onChange} />);

      expect(screen.getByText(/Time options/i)).toBeInTheDocument();
      expect(screen.queryByText(/Date options/i)).not.toBeInTheDocument();
    });

    it('should preserve other options when changing mode', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const field = createDateField({
        dateOptions: { mode: 'date', locale: 'es', hourCycle: 12 },
      });
      render(<DateTimeFieldEditor {...defaultProps} field={field} onChange={onChange} />);

      const timeRadio = screen.getByLabelText(/Time only/i);
      await user.click(timeRadio);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          dateOptions: expect.objectContaining({
            mode: 'time',
            locale: 'es',
            hourCycle: 12,
          }),
        })
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper radio button structure', () => {
      render(<DateTimeFieldEditor {...defaultProps} />);

      const dateRadio = screen.getByLabelText(/Date only/i);
      expect(dateRadio).toHaveAttribute('role', 'radio');
    });

    it('should have labeled switch elements', () => {
      const field = createDateField({ dateOptions: { mode: 'date' } });
      render(<DateTimeFieldEditor {...defaultProps} field={field} />);

      expect(screen.getByText(/Block weekends/i)).toBeInTheDocument();
      expect(screen.getByText(/Required field/i)).toBeInTheDocument();
    });
  });
});
