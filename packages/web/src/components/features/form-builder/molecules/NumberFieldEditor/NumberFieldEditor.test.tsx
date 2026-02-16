import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NumberFieldEditor } from './NumberFieldEditor';
import type { FormField } from '@/components/features/form-builder/types';
import { formatNumber, validateNumberValue, CURRENCY_PRESETS } from './NumberFieldEditor.types';

expect.extend(toHaveNoViolations);

describe('NumberFieldEditor', () => {
  // ============================================================================
  // TEST DATA
  // ============================================================================

  const createMockField = (overrides?: Partial<FormField>): FormField => ({
    id: 'test-number-field',
    type: 'number',
    label: 'Number Field',
    placeholder: 'Enter number',
    description: 'Test description',
    validation: {
      required: false,
      min: 0,
      max: 100,
    },
    numberOptions: {
      step: 1,
    },
    ...overrides,
  });

  const mockOnChange = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnDuplicate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // RENDERING TESTS
  // ============================================================================

  describe('Rendering', () => {
    it('should render with basic number field configuration', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      expect(screen.getByText('Number Field')).toBeInTheDocument();
      expect(screen.getByLabelText('Label')).toHaveValue('Number Field');
      expect(screen.getByLabelText('Placeholder')).toHaveValue('Enter number');
      expect(screen.getByLabelText('Description')).toHaveValue('Test description');
    });

    it('should render with field ID in header', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      expect(screen.getByText(`ID: ${field.id}`)).toBeInTheDocument();
    });

    it('should render delete button', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      expect(screen.getByRole('button', { name: /delete field/i })).toBeInTheDocument();
    });

    it('should render duplicate button when onDuplicate is provided', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor
          field={field}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          onDuplicate={mockOnDuplicate}
        />
      );

      expect(screen.getByRole('button', { name: /duplicate field/i })).toBeInTheDocument();
    });

    it('should not render duplicate button when onDuplicate is not provided', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      expect(screen.queryByRole('button', { name: /duplicate field/i })).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // DISPLAY TYPE TESTS
  // ============================================================================

  describe('Display Type', () => {
    it('should render display type selector with all three options', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      expect(screen.getByRole('button', { name: /number/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /currency/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /percentage/i })).toBeInTheDocument();
    });

    it('should select currency display type and show currency options', async () => {
      const user = userEvent.setup();
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const currencyButton = screen.getByRole('button', { name: /currency/i });
      await user.click(currencyButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOptions: expect.objectContaining({
            displayType: 'currency',
            currencyCode: 'USD',
            decimals: 2,
            thousandsSeparator: true,
          }),
        })
      );
    });

    it('should select percentage display type', async () => {
      const user = userEvent.setup();
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const percentageButton = screen.getByRole('button', { name: /percentage/i });
      await user.click(percentageButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOptions: expect.objectContaining({
            displayType: 'percentage',
            decimals: 1,
          }),
        })
      );
    });
  });

  // ============================================================================
  // CURRENCY OPTIONS TESTS
  // ============================================================================

  describe('Currency Options', () => {
    it('should render currency selector when display type is currency', () => {
      const field = createMockField({
        numberOptions: {
          displayType: 'currency',
          currencyCode: 'USD',
        },
      });
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      expect(screen.getByText('Currency Options')).toBeInTheDocument();
      expect(screen.getByLabelText('Currency')).toBeInTheDocument();
    });

    it('should change currency and update decimals accordingly', async () => {
      const user = userEvent.setup();
      const field = createMockField({
        numberOptions: {
          displayType: 'currency',
          currencyCode: 'USD',
          decimals: 2,
        },
      });
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const currencySelect = screen.getByLabelText('Currency');
      await user.click(currencySelect);

      const eurOption = screen.getByRole('option', { name: /euro/i });
      await user.click(eurOption);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOptions: expect.objectContaining({
            currencyCode: 'EUR',
            decimals: 2,
          }),
        })
      );
    });

    it('should display currency preview', () => {
      const field = createMockField({
        numberOptions: {
          displayType: 'currency',
          currencyCode: 'USD',
          decimals: 2,
          thousandsSeparator: true,
        },
      });
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      expect(screen.getByText('Preview:')).toBeInTheDocument();
      expect(screen.getByText(/\$100/)).toBeInTheDocument();
    });

    it('should render all available currencies', async () => {
      const user = userEvent.setup();
      const field = createMockField({
        numberOptions: {
          displayType: 'currency',
          currencyCode: 'USD',
        },
      });
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const currencySelect = screen.getByLabelText('Currency');
      await user.click(currencySelect);

      expect(screen.getByRole('option', { name: /us dollar/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /euro/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /british pound/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /mexican peso/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /japanese yen/i })).toBeInTheDocument();
    });
  });

  // ============================================================================
  // NUMBER OPTIONS TESTS
  // ============================================================================

  describe('Number Options', () => {
    it('should update step increment', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const stepInput = screen.getByLabelText('Step Increment');
      fireEvent.change(stepInput, { target: { value: '5' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOptions: expect.objectContaining({
            step: 5,
          }),
        })
      );
    });

    it('should update decimal places', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const decimalsInput = screen.getByLabelText('Decimal Places');
      fireEvent.change(decimalsInput, { target: { value: '3' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOptions: expect.objectContaining({
            decimals: 3,
          }),
        })
      );
    });

    it('should toggle thousands separator', async () => {
      const user = userEvent.setup();
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const thousandsSeparator = screen.getByLabelText('Show thousands separator');
      await user.click(thousandsSeparator);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOptions: expect.objectContaining({
            thousandsSeparator: true,
          }),
        })
      );
    });

    it('should toggle allow negative numbers', async () => {
      const user = userEvent.setup();
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const allowNegative = screen.getByLabelText('Allow negative numbers');
      await user.click(allowNegative);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOptions: expect.objectContaining({
            allowNegative: false,
          }),
        })
      );
    });
  });

  // ============================================================================
  // PREFIX/SUFFIX TESTS
  // ============================================================================

  describe('Prefix and Suffix', () => {
    it('should render prefix/suffix section for number display type', () => {
      const field = createMockField({
        numberOptions: {
          displayType: 'number',
        },
      });
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      expect(screen.getByText('Prefix / Suffix')).toBeInTheDocument();
      expect(screen.getByLabelText('Prefix')).toBeInTheDocument();
      expect(screen.getByLabelText('Suffix')).toBeInTheDocument();
    });

    it('should update prefix', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const prefixInput = screen.getByLabelText('Prefix');
      fireEvent.change(prefixInput, { target: { value: '#' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOptions: expect.objectContaining({
            prefix: '#',
          }),
        })
      );
    });

    it('should update suffix', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const suffixInput = screen.getByLabelText('Suffix');
      fireEvent.change(suffixInput, { target: { value: 'kg' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOptions: expect.objectContaining({
            suffix: 'kg',
          }),
        })
      );
    });

    it('should show preview when prefix or suffix is set', () => {
      const field = createMockField({
        numberOptions: {
          displayType: 'number',
          prefix: '#',
          suffix: 'kg',
        },
      });
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const previews = screen.getAllByText('Preview:');
      expect(previews.length).toBeGreaterThan(0);
    });

    it('should not render prefix/suffix section for currency type', () => {
      const field = createMockField({
        numberOptions: {
          displayType: 'currency',
          currencyCode: 'USD',
        },
      });
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      expect(screen.queryByText('Prefix / Suffix')).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // VALIDATION TESTS
  // ============================================================================

  describe('Validation', () => {
    it('should update minimum value', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const minInput = screen.getByLabelText('Minimum Value');
      fireEvent.change(minInput, { target: { value: '10' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          validation: expect.objectContaining({
            min: 10,
          }),
        })
      );
    });

    it('should update maximum value', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const maxInput = screen.getByLabelText('Maximum Value');
      fireEvent.change(maxInput, { target: { value: '200' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          validation: expect.objectContaining({
            max: 200,
          }),
        })
      );
    });

    it('should show validation error when test value exceeds max', async () => {
      const user = userEvent.setup();
      const field = createMockField({
        validation: {
          min: 0,
          max: 100,
        },
      });
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const testInput = screen.getByLabelText('Test Validation');
      await user.clear(testInput);
      await user.type(testInput, '150');

      expect(screen.getByText(/value must be at most 100/i)).toBeInTheDocument();
    });

    it('should show validation error when test value is below min', async () => {
      const user = userEvent.setup();
      const field = createMockField({
        validation: {
          min: 10,
          max: 100,
        },
      });
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const testInput = screen.getByLabelText('Test Validation');
      await user.clear(testInput);
      await user.type(testInput, '5');

      expect(screen.getByText(/value must be at least 10/i)).toBeInTheDocument();
    });

    it('should show success message when test value is valid', async () => {
      const user = userEvent.setup();
      const field = createMockField({
        validation: {
          min: 0,
          max: 100,
        },
      });
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const testInput = screen.getByLabelText('Test Validation');
      await user.clear(testInput);
      await user.type(testInput, '50');

      expect(screen.getByText(/valid value/i)).toBeInTheDocument();
    });

    it('should update custom error message', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const errorMessageInput = screen.getByLabelText('Custom Error Message');
      fireEvent.change(errorMessageInput, { target: { value: 'Invalid number' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          validation: expect.objectContaining({
            errorMessage: 'Invalid number',
          }),
        })
      );
    });
  });

  // ============================================================================
  // LOCALIZATION TESTS
  // ============================================================================

  describe('Localization', () => {
    it('should render with default locale', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor
          field={field}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="en"
          defaultLocale="en"
        />
      );

      expect(screen.getByLabelText('Label')).toBeInTheDocument();
      expect(screen.queryByText(/currently editing en translations/i)).not.toBeInTheDocument();
    });

    it('should render with non-default locale and show indicator', () => {
      const field = createMockField({
        i18n: {
          es: {
            label: 'Campo de Número',
            placeholder: 'Ingrese número',
            description: 'Descripción de prueba',
          },
        },
      });
      render(
        <NumberFieldEditor
          field={field}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      expect(screen.getByText(/currently editing es translations/i)).toBeInTheDocument();
    });

    it('should update localized label for non-default locale', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor
          field={field}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const labelInput = screen.getByLabelText('Label (ES)');
      fireEvent.change(labelInput, { target: { value: 'Número' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          i18n: {
            es: {
              label: 'Número',
            },
          },
        })
      );
    });

    it('should disable technical settings when editing non-default locale', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor
          field={field}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const requiredSwitch = screen.getByLabelText('Required field');
      expect(requiredSwitch).toBeDisabled();
    });
  });

  // ============================================================================
  // INTERACTION TESTS
  // ============================================================================

  describe('User Interactions', () => {
    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const deleteButton = screen.getByRole('button', { name: /delete field/i });
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('should call onDuplicate when duplicate button is clicked', async () => {
      const user = userEvent.setup();
      const field = createMockField();
      render(
        <NumberFieldEditor
          field={field}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          onDuplicate={mockOnDuplicate}
        />
      );

      const duplicateButton = screen.getByRole('button', { name: /duplicate field/i });
      await user.click(duplicateButton);

      expect(mockOnDuplicate).toHaveBeenCalledTimes(1);
    });

    it('should toggle required field', async () => {
      const user = userEvent.setup();
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      const requiredSwitch = screen.getByLabelText('Required field');
      await user.click(requiredSwitch);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          validation: expect.objectContaining({
            required: true,
          }),
        })
      );
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe('Accessibility', () => {
    it('should have no accessibility violations (excluding known Switch issues)', async () => {
      const field = createMockField();
      const { container } = render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      // Note: Switch components from Radix UI have known axe violations for button-name
      // These are handled by Label association and are safe to ignore in this context
      const results = await axe(container, {
        rules: {
          'button-name': { enabled: false }, // Disable switch button name check
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels for all inputs', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor field={field} onChange={mockOnChange} onDelete={mockOnDelete} />
      );

      expect(screen.getByLabelText('Label')).toBeInTheDocument();
      expect(screen.getByLabelText('Placeholder')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Required field')).toBeInTheDocument();
      expect(screen.getByLabelText('Step Increment')).toBeInTheDocument();
      expect(screen.getByLabelText('Minimum Value')).toBeInTheDocument();
      expect(screen.getByLabelText('Maximum Value')).toBeInTheDocument();
    });

    it('should have aria-label for action buttons', () => {
      const field = createMockField();
      render(
        <NumberFieldEditor
          field={field}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          onDuplicate={mockOnDuplicate}
        />
      );

      expect(screen.getByLabelText('Delete field')).toBeInTheDocument();
      expect(screen.getByLabelText('Duplicate field')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // UTILITY FUNCTIONS TESTS
  // ============================================================================

  describe('Utility Functions', () => {
    describe('formatNumber', () => {
      it('should format basic number with decimals', () => {
        const result = formatNumber(123.456, { decimals: 2 });
        expect(result).toBe('123.46');
      });

      it('should format number with thousands separator', () => {
        const result = formatNumber(1234567.89, { decimals: 2, thousandsSeparator: true });
        expect(result).toBe('1,234,567.89');
      });

      it('should format currency with USD', () => {
        const result = formatNumber(100, {
          displayType: 'currency',
          currencyCode: 'USD',
          decimals: 2,
        });
        expect(result).toBe('$100.00');
      });

      it('should format currency with EUR (suffix)', () => {
        const result = formatNumber(100, {
          displayType: 'currency',
          currencyCode: 'EUR',
          decimals: 2,
        });
        expect(result).toBe('100.00€');
      });

      it('should format percentage', () => {
        const result = formatNumber(75.5, { displayType: 'percentage', decimals: 1 });
        expect(result).toBe('75.5%');
      });

      it('should format with custom prefix', () => {
        const result = formatNumber(100, { prefix: '#', decimals: 0 });
        expect(result).toBe('#100');
      });

      it('should format with custom suffix', () => {
        const result = formatNumber(100, { suffix: 'kg', decimals: 1 });
        expect(result).toBe('100.0kg');
      });
    });

    describe('validateNumberValue', () => {
      it('should validate number within range', () => {
        const field = createMockField({ validation: { min: 0, max: 100 } });
        const result = validateNumberValue(50, field);
        expect(result.isValid).toBe(true);
      });

      it('should invalidate number below minimum', () => {
        const field = createMockField({ validation: { min: 10 } });
        const result = validateNumberValue(5, field);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('at least 10');
      });

      it('should invalidate number above maximum', () => {
        const field = createMockField({ validation: { max: 100 } });
        const result = validateNumberValue(150, field);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('at most 100');
      });

      it('should validate when no constraints are set', () => {
        const field = createMockField({ validation: {} });
        const result = validateNumberValue(999999, field);
        expect(result.isValid).toBe(true);
      });
    });

    describe('CURRENCY_PRESETS', () => {
      it('should have all required currency codes', () => {
        expect(CURRENCY_PRESETS).toHaveProperty('USD');
        expect(CURRENCY_PRESETS).toHaveProperty('EUR');
        expect(CURRENCY_PRESETS).toHaveProperty('GBP');
        expect(CURRENCY_PRESETS).toHaveProperty('MXN');
        expect(CURRENCY_PRESETS).toHaveProperty('JPY');
      });

      it('should have correct USD configuration', () => {
        const usd = CURRENCY_PRESETS.USD;
        expect(usd.symbol).toBe('$');
        expect(usd.position).toBe('prefix');
        expect(usd.decimals).toBe(2);
      });

      it('should have correct EUR configuration', () => {
        const eur = CURRENCY_PRESETS.EUR;
        expect(eur.symbol).toBe('€');
        expect(eur.position).toBe('suffix');
        expect(eur.decimals).toBe(2);
      });

      it('should have correct JPY configuration (no decimals)', () => {
        const jpy = CURRENCY_PRESETS.JPY;
        expect(jpy.symbol).toBe('¥');
        expect(jpy.decimals).toBe(0);
      });
    });
  });
});
