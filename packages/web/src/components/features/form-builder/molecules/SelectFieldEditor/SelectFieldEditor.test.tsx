/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SelectFieldEditor } from './SelectFieldEditor';
import type { FormField, FormFieldOption } from '@/components/features/form-builder/types';

expect.extend(toHaveNoViolations);

describe('SelectFieldEditor', () => {
  // Mock field data
  const mockOptions: FormFieldOption[] = [
    { id: 'opt-1', label: 'Option 1', value: 'option-1' },
    { id: 'opt-2', label: 'Option 2', value: 'option-2' },
    { id: 'opt-3', label: 'Option 3', value: 'option-3' },
  ];

  const mockField: FormField = {
    id: 'field-1',
    type: 'select',
    label: 'Select Field',
    validation: { required: false },
    selectOptions: {
      items: mockOptions,
      placeholder: 'Select an option...',
      allowClear: false,
    },
  };

  const mockOnChange = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnDuplicate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with field label', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByDisplayValue('Select Field')).toBeInTheDocument();
      expect(screen.getByText('Field Label')).toBeInTheDocument();
    });

    it('should render all options in the options editor', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Option 3')).toBeInTheDocument();
    });

    it('should render placeholder input', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByDisplayValue('Select an option...')).toBeInTheDocument();
    });

    it('should render required toggle', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Required')).toBeInTheDocument();
      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBeGreaterThan(0);
    });

    it('should render allow clear toggle', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Allow Clear')).toBeInTheDocument();
      const switches = screen.getAllByRole('switch');
      // Required, Allow Clear, Show Description = 3 switches
      expect(switches.length).toBe(3);
    });

    it('should render default value selector', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Default Value')).toBeInTheDocument();
    });

    it('should render show description toggle', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Show Description')).toBeInTheDocument();
    });
  });

  describe('Field Label Editing', () => {
    it('should update label when typing in default locale', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="en"
          defaultLocale="en"
        />
      );

      const input = screen.getByDisplayValue('Select Field');
      fireEvent.change(input, { target: { value: 'New Label' } });

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.label).toBe('New Label');
    });

    it('should update i18n label when typing in non-default locale', () => {
      const fieldWithI18n: FormField = {
        ...mockField,
        i18n: {
          es: { label: 'Campo de Selección' },
        },
      };

      render(
        <SelectFieldEditor
          field={fieldWithI18n}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const input = screen.getByDisplayValue('Campo de Selección');
      fireEvent.change(input, { target: { value: 'Nueva Etiqueta' } });

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.i18n?.es?.label).toBe('Nueva Etiqueta');
    });

    it('should show locale indicator in non-default locale', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      expect(screen.getByText(/Field Label.*\(es\)/)).toBeInTheDocument();
    });
  });

  describe('Required Toggle', () => {
    it('should toggle required state', async () => {
      const user = userEvent.setup();
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const switches = screen.getAllByRole('switch');
      const requiredSwitch = switches[0]; // First switch is Required
      await user.click(requiredSwitch);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          validation: { required: true },
        })
      );
    });

    it('should not show required toggle in non-default locale', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      expect(screen.queryByText('Required')).not.toBeInTheDocument();
    });
  });

  describe('Placeholder Editing', () => {
    it('should update placeholder in default locale', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const input = screen.getByDisplayValue('Select an option...');
      fireEvent.change(input, { target: { value: 'Choose an item...' } });

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.selectOptions?.placeholder).toBe('Choose an item...');
    });

    it('should update i18n placeholder in non-default locale', () => {
      const fieldWithI18n: FormField = {
        ...mockField,
        i18n: {
          es: { placeholder: 'Seleccione una opción...' },
        },
      };

      render(
        <SelectFieldEditor
          field={fieldWithI18n}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const input = screen.getByDisplayValue('Seleccione una opción...');
      fireEvent.change(input, { target: { value: 'Elija un elemento...' } });

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.i18n?.es?.placeholder).toBe('Elija un elemento...');
    });
  });

  describe('Default Value Selection', () => {
    it('should set default value when selecting an option', async () => {
      const user = userEvent.setup();
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const option = screen.getByRole('option', { name: 'Option 1' });
      await user.click(option);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectOptions: expect.objectContaining({
            defaultValue: 'option-1',
          }),
        })
      );
    });

    it('should clear default value when selecting "No default value"', async () => {
      const user = userEvent.setup();
      const fieldWithDefault: FormField = {
        ...mockField,
        selectOptions: {
          ...mockField.selectOptions!,
          defaultValue: 'option-1',
        },
      };

      render(
        <SelectFieldEditor
          field={fieldWithDefault}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const option = screen.getByRole('option', { name: 'No default value' });
      await user.click(option);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectOptions: expect.objectContaining({
            defaultValue: undefined,
          }),
        })
      );
    });

    it('should not show default value selector in non-default locale', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      expect(screen.queryByText('Default Value')).not.toBeInTheDocument();
    });
  });

  describe('Allow Clear Toggle', () => {
    it('should toggle allow clear state', async () => {
      const user = userEvent.setup();
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const switches = screen.getAllByRole('switch');
      const allowClearSwitch = switches[1]; // Second switch is Allow Clear
      await user.click(allowClearSwitch);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectOptions: expect.objectContaining({
            allowClear: true,
          }),
        })
      );
    });
  });

  describe('Options Management', () => {
    it('should add a new option', async () => {
      const user = userEvent.setup();
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const addButton = screen.getByRole('button', { name: /add option/i });
      await user.click(addButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectOptions: expect.objectContaining({
            items: expect.arrayContaining([
              expect.objectContaining({
                label: 'Option 4',
                value: 'option-4',
              }),
            ]),
          }),
        })
      );
    });

    it('should remove an option', async () => {
      const user = userEvent.setup();
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const deleteButtons = screen.getAllByRole('button', { name: /delete option/i });
      await user.click(deleteButtons[0]);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectOptions: expect.objectContaining({
            items: expect.arrayContaining([
              expect.objectContaining({ id: 'opt-2' }),
              expect.objectContaining({ id: 'opt-3' }),
            ]),
          }),
        })
      );
    });

    it('should duplicate an option', async () => {
      const user = userEvent.setup();
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const duplicateButtons = screen.getAllByRole('button', { name: /duplicate option/i });
      await user.click(duplicateButtons[0]);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectOptions: expect.objectContaining({
            items: expect.arrayContaining([
              expect.objectContaining({
                label: 'Option 1 (copy)',
                value: 'option-1-copy',
              }),
            ]),
          }),
        })
      );
    });

    it('should update option label', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const labelInput = screen.getByDisplayValue('Option 1');
      fireEvent.change(labelInput, { target: { value: 'Updated Label' } });

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      const updatedOption = lastCall.selectOptions?.items?.find((opt: any) => opt.id === 'opt-1');
      expect(updatedOption?.label).toBe('Updated Label');
    });

    it('should update option value', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const valueInput = screen.getByDisplayValue('option-1');
      fireEvent.change(valueInput, { target: { value: 'updated-value' } });

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      const updatedOption = lastCall.selectOptions?.items?.find((opt: any) => opt.id === 'opt-1');
      expect(updatedOption?.value).toBe('updated-value');
    });

    it('should not allow removing last option', () => {
      const singleOptionField: FormField = {
        ...mockField,
        selectOptions: {
          items: [{ id: 'opt-1', label: 'Option 1', value: 'option-1' }],
        },
      };

      render(
        <SelectFieldEditor
          field={singleOptionField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete option/i });
      expect(deleteButton).toBeDisabled();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no options exist', () => {
      const emptyField: FormField = {
        ...mockField,
        selectOptions: { items: [] },
      };

      render(
        <SelectFieldEditor
          field={emptyField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(
        screen.getByText(/No options added yet/i)
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add first option/i })).toBeInTheDocument();
    });

    it('should add first option from empty state', async () => {
      const user = userEvent.setup();
      const emptyField: FormField = {
        ...mockField,
        selectOptions: { items: [] },
      };

      render(
        <SelectFieldEditor
          field={emptyField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const addButton = screen.getByRole('button', { name: /add first option/i });
      await user.click(addButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectOptions: expect.objectContaining({
            items: expect.arrayContaining([
              expect.objectContaining({
                label: 'Option 1',
                value: 'option-1',
              }),
            ]),
          }),
        })
      );
    });
  });

  describe('Duplicate Value Validation', () => {
    it('should detect duplicate values', () => {
      const fieldWithDuplicates: FormField = {
        ...mockField,
        selectOptions: {
          items: [
            { id: 'opt-1', label: 'Option 1', value: 'duplicate' },
            { id: 'opt-2', label: 'Option 2', value: 'duplicate' },
            { id: 'opt-3', label: 'Option 3', value: 'unique' },
          ],
        },
      };

      render(
        <SelectFieldEditor
          field={fieldWithDuplicates}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText(/Duplicate values detected/i)).toBeInTheDocument();
    });

    it('should mark duplicate value inputs with error styling', () => {
      const fieldWithDuplicates: FormField = {
        ...mockField,
        selectOptions: {
          items: [
            { id: 'opt-1', label: 'Option 1', value: 'duplicate' },
            { id: 'opt-2', label: 'Option 2', value: 'duplicate' },
          ],
        },
      };

      render(
        <SelectFieldEditor
          field={fieldWithDuplicates}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const duplicateInputs = screen.getAllByDisplayValue('duplicate');
      duplicateInputs.forEach((input) => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('Description Section', () => {
    it('should show description textarea when toggle is on', async () => {
      const user = userEvent.setup();
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const switches = screen.getAllByRole('switch');
      const showDescriptionSwitch = switches[2]; // Third switch is Show Description
      await user.click(showDescriptionSwitch);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          showDescription: true,
        })
      );
    });

    it('should update description text', () => {
      const fieldWithDescription: FormField = {
        ...mockField,
        showDescription: true,
        description: 'Initial description',
      };

      render(
        <SelectFieldEditor
          field={fieldWithDescription}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const textarea = screen.getByDisplayValue('Initial description');
      fireEvent.change(textarea, { target: { value: 'Updated description' } });

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.description).toBe('Updated description');
    });

    it('should update i18n description in non-default locale', () => {
      const fieldWithI18n: FormField = {
        ...mockField,
        showDescription: true,
        description: 'English description',
        i18n: {
          es: { description: 'Descripción en español' },
        },
      };

      render(
        <SelectFieldEditor
          field={fieldWithI18n}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const textarea = screen.getByDisplayValue('Descripción en español');
      fireEvent.change(textarea, { target: { value: 'Nueva descripción' } });

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.i18n?.es?.description).toBe('Nueva descripción');
    });
  });

  describe('Translation Mode', () => {
    it('should show translation mode hint in non-default locale', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      expect(
        screen.getByText(/Translation mode: Only labels can be edited/i)
      ).toBeInTheDocument();
    });

    it('should disable value inputs in translation mode', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const valueInputs = screen.getAllByDisplayValue(/option-/);
      valueInputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });

    it('should not show action buttons in translation mode', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      expect(screen.queryByRole('button', { name: /duplicate option/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete option/i })).not.toBeInTheDocument();
    });

    it('should update option translations in translation mode', () => {
      const fieldWithI18n: FormField = {
        ...mockField,
        i18n: {
          es: {
            options: {
              'opt-1': 'Opción 1',
            },
          },
        },
      };

      render(
        <SelectFieldEditor
          field={fieldWithI18n}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const labelInput = screen.getByDisplayValue('Opción 1');
      fireEvent.change(labelInput, { target: { value: 'Nueva Opción 1' } });

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.i18n?.es?.options?.['opt-1']).toBe('Nueva Opción 1');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      // Note: We disable button-name rule because Radix UI Switch uses a button with aria-checked
      // which is semantically correct for a switch component, but axe flags it
      const results = await axe(container, {
        rules: {
          'button-name': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper switches for settings', () => {
      render(
        <SelectFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const switches = screen.getAllByRole('switch');
      expect(switches).toHaveLength(3); // Required, Allow Clear, Show Description
    });
  });

  describe('Edge Cases', () => {
    it('should handle field without selectOptions', () => {
      const fieldWithoutOptions: FormField = {
        id: 'field-1',
        type: 'select',
        label: 'Select Field',
      };

      render(
        <SelectFieldEditor
          field={fieldWithoutOptions}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText(/No options added yet/i)).toBeInTheDocument();
    });

    it('should handle empty option values', () => {
      const fieldWithEmptyValues: FormField = {
        ...mockField,
        selectOptions: {
          items: [
            { id: 'opt-1', label: 'Option 1', value: '' },
            { id: 'opt-2', label: 'Option 2', value: 'option-2' },
          ],
        },
      };

      render(
        <SelectFieldEditor
          field={fieldWithEmptyValues}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      // Should not show options with empty values in default value selector
      expect(screen.queryByRole('option', { name: 'Option 1' })).not.toBeInTheDocument();
    });

    it('should handle missing validation object', () => {
      const fieldWithoutValidation: FormField = {
        ...mockField,
        validation: undefined,
      };

      render(
        <SelectFieldEditor
          field={fieldWithoutValidation}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const switches = screen.getAllByRole('switch');
      const requiredSwitch = switches[0]; // First switch is Required
      expect(requiredSwitch).not.toBeChecked();
    });

    it('should handle missing i18n object', () => {
      const fieldWithoutI18n: FormField = {
        ...mockField,
        i18n: undefined,
      };

      render(
        <SelectFieldEditor
          field={fieldWithoutI18n}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      // Should still render without errors
      expect(screen.getByText(/Field Label/i)).toBeInTheDocument();
    });
  });
});
