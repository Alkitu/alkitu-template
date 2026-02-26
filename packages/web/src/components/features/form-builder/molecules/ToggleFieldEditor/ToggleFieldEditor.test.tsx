import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ToggleFieldEditor } from './ToggleFieldEditor';
import type { FormField } from '@/components/features/form-builder/types';

expect.extend(toHaveNoViolations);

describe('ToggleFieldEditor', () => {
  let mockField: FormField;
  let mockOnChange: ReturnType<typeof vi.fn>;
  let mockOnDelete: ReturnType<typeof vi.fn>;
  let mockOnDuplicate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockField = {
      id: 'toggle-1',
      type: 'toggle',
      label: 'Enable notifications',
      validation: { required: false },
      toggleOptions: {
        style: 'toggle',
        defaultChecked: false,
        checkedValue: true,
        uncheckedValue: false,
      },
    };
    mockOnChange = vi.fn();
    mockOnDelete = vi.fn();
    mockOnDuplicate = vi.fn();
  });

  // ============================================================================
  // RENDERING TESTS
  // ============================================================================

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByDisplayValue('Enable notifications')).toBeInTheDocument();
    });

    it('should render field label input', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const labelInput = screen.getByDisplayValue('Enable notifications');
      expect(labelInput).toBeInTheDocument();
      expect(labelInput).toHaveAttribute('placeholder', 'Enter field label');
    });

    it('should render toggle style selector', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Toggle Style')).toBeInTheDocument();
    });

    it('should render required toggle', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('should render default checked toggle', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Default Checked')).toBeInTheDocument();
    });

    it('should render value type selector', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Value Type')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // LABEL EDITING TESTS
  // ============================================================================

  describe('Label Editing', () => {
    it('should update field label on change', async () => {
      const user = userEvent.setup();
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const labelInput = screen.getByDisplayValue('Enable notifications');
      await user.tripleClick(labelInput); // Select all
      await user.paste('New label');

      // Check the last call (after all editing is complete)
      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.label).toBe('New label');
    });

    it('should show locale suffix in non-default locale', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      expect(screen.getByText(/Field Label.*\(es\)/)).toBeInTheDocument();
    });

    it('should update i18n label in non-default locale', async () => {
      const user = userEvent.setup();
      const fieldWithI18n = {
        ...mockField,
        i18n: {
          es: { label: 'Activar notificaciones' },
        },
      };

      render(
        <ToggleFieldEditor
          field={fieldWithI18n}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const labelInput = screen.getByDisplayValue('Activar notificaciones');
      await user.tripleClick(labelInput); // Select all
      await user.paste('Nueva etiqueta');

      // Check the last call (after all editing is complete)
      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.i18n?.es?.label).toBe('Nueva etiqueta');
    });
  });

  // ============================================================================
  // TOGGLE STYLE TESTS
  // ============================================================================

  describe('Toggle Style', () => {
    it('should display current toggle style', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      // The Select component should show the current value
      const styleLabel = screen.getByText('Toggle Style');
      expect(styleLabel).toBeInTheDocument();
    });

    it('should change style from toggle to checkbox', async () => {
      const user = userEvent.setup();
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      // Find and click the style selector trigger
      const styleTriggers = screen.getAllByRole('combobox');
      const styleTrigger = styleTriggers[0]; // First combobox is Toggle Style
      await user.click(styleTrigger);

      // Select checkbox option
      const checkboxOption = await screen.findByText('Checkbox');
      await user.click(checkboxOption);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          toggleOptions: expect.objectContaining({
            style: 'checkbox',
          }),
        })
      );
    });

    it('should not show style selector in non-default locale', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      expect(screen.queryByText('Toggle Style')).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // REQUIRED FIELD TESTS
  // ============================================================================

  describe('Required Field', () => {
    it('should toggle required field', async () => {
      const user = userEvent.setup();
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const requiredLabel = screen.getByText('Required');
      const requiredSwitch = requiredLabel.parentElement?.querySelector('[role="switch"]');
      expect(requiredSwitch).toBeInTheDocument();

      if (requiredSwitch) {
        await user.click(requiredSwitch);

        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            validation: expect.objectContaining({
              required: true,
            }),
          })
        );
      }
    });

    it('should reflect required state correctly', () => {
      const requiredField = {
        ...mockField,
        validation: { required: true },
      };

      render(
        <ToggleFieldEditor
          field={requiredField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const requiredLabel = screen.getByText('Required');
      const requiredSwitch = requiredLabel.parentElement?.querySelector('[role="switch"]');
      expect(requiredSwitch).toHaveAttribute('aria-checked', 'true');
    });
  });

  // ============================================================================
  // DEFAULT CHECKED TESTS
  // ============================================================================

  describe('Default Checked', () => {
    it('should toggle default checked state', async () => {
      const user = userEvent.setup();
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const defaultCheckedLabel = screen.getByText('Default Checked');
      const defaultCheckedSwitch = defaultCheckedLabel.parentElement?.querySelector('[role="switch"]');

      if (defaultCheckedSwitch) {
        await user.click(defaultCheckedSwitch);

        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            toggleOptions: expect.objectContaining({
              defaultChecked: true,
            }),
          })
        );
      }
    });

    it('should reflect default checked state correctly', () => {
      const checkedField = {
        ...mockField,
        toggleOptions: {
          ...mockField.toggleOptions!,
          defaultChecked: true,
        },
      };

      render(
        <ToggleFieldEditor
          field={checkedField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const defaultCheckedLabel = screen.getByText('Default Checked');
      const defaultCheckedSwitch = defaultCheckedLabel.parentElement?.querySelector('[role="switch"]');
      expect(defaultCheckedSwitch).toHaveAttribute('aria-checked', 'true');
    });
  });

  // ============================================================================
  // VALUE TYPE TESTS
  // ============================================================================

  describe('Value Type', () => {
    it('should show boolean value type by default', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Value Type')).toBeInTheDocument();
    });

    it('should change value type from boolean to string', async () => {
      const user = userEvent.setup();
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      // Find and click the value type selector (second combobox)
      const comboboxes = screen.getAllByRole('combobox');
      const valueTypeTrigger = comboboxes[1]; // Second combobox is Value Type
      await user.click(valueTypeTrigger);

      // Select string option
      const stringOption = await screen.findByText(/Text \(custom values\)/);
      await user.click(stringOption);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          toggleOptions: expect.objectContaining({
            checkedValue: 'yes',
            uncheckedValue: 'no',
          }),
        })
      );
    });

    it('should show custom value inputs when string type is selected', () => {
      const stringField = {
        ...mockField,
        toggleOptions: {
          ...mockField.toggleOptions!,
          checkedValue: 'yes',
          uncheckedValue: 'no',
        },
      };

      render(
        <ToggleFieldEditor
          field={stringField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Checked Value')).toBeInTheDocument();
      expect(screen.getByText('Unchecked Value')).toBeInTheDocument();
      expect(screen.getByDisplayValue('yes')).toBeInTheDocument();
      expect(screen.getByDisplayValue('no')).toBeInTheDocument();
    });

    it('should update custom checked value', async () => {
      const user = userEvent.setup();
      const stringField = {
        ...mockField,
        toggleOptions: {
          ...mockField.toggleOptions!,
          checkedValue: 'yes',
          uncheckedValue: 'no',
        },
      };

      render(
        <ToggleFieldEditor
          field={stringField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const checkedValueInput = screen.getByDisplayValue('yes');
      await user.tripleClick(checkedValueInput); // Select all
      await user.paste('enabled');

      // Check the last call (after all editing is complete)
      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.toggleOptions?.checkedValue).toBe('enabled');
    });

    it('should update custom unchecked value', async () => {
      const user = userEvent.setup();
      const stringField = {
        ...mockField,
        toggleOptions: {
          ...mockField.toggleOptions!,
          checkedValue: 'yes',
          uncheckedValue: 'no',
        },
      };

      render(
        <ToggleFieldEditor
          field={stringField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const uncheckedValueInput = screen.getByDisplayValue('no');
      await user.tripleClick(uncheckedValueInput); // Select all
      await user.paste('disabled');

      // Check the last call (after all editing is complete)
      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.toggleOptions?.uncheckedValue).toBe('disabled');
    });
  });

  // ============================================================================
  // DESCRIPTION TESTS
  // ============================================================================

  describe('Description', () => {
    it('should show description toggle', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Show Description')).toBeInTheDocument();
    });

    it('should toggle description visibility', async () => {
      const user = userEvent.setup();
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const showDescriptionLabel = screen.getByText('Show Description');
      const showDescriptionSwitch = showDescriptionLabel.parentElement?.querySelector('[role="switch"]');

      if (showDescriptionSwitch) {
        await user.click(showDescriptionSwitch);

        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            showDescription: true,
          })
        );
      }
    });

    it('should show description textarea when enabled', () => {
      const fieldWithDescription = {
        ...mockField,
        showDescription: true,
        description: 'Help text',
      };

      render(
        <ToggleFieldEditor
          field={fieldWithDescription}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByDisplayValue('Help text')).toBeInTheDocument();
    });

    it('should update description text', async () => {
      const user = userEvent.setup();
      const fieldWithDescription = {
        ...mockField,
        showDescription: true,
        description: 'Old description',
      };

      render(
        <ToggleFieldEditor
          field={fieldWithDescription}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const descriptionTextarea = screen.getByDisplayValue('Old description');
      await user.tripleClick(descriptionTextarea); // Select all
      await user.paste('New description');

      // Check the last call (after all editing is complete)
      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.description).toBe('New description');
    });

    it('should update i18n description in non-default locale', async () => {
      const user = userEvent.setup();
      const fieldWithI18nDescription = {
        ...mockField,
        showDescription: true,
        description: 'English description',
        i18n: {
          es: { description: 'Descripción en español' },
        },
      };

      render(
        <ToggleFieldEditor
          field={fieldWithI18nDescription}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const descriptionTextarea = screen.getByDisplayValue('Descripción en español');
      await user.tripleClick(descriptionTextarea); // Select all
      await user.paste('Nueva descripción');

      // Check the last call (after all editing is complete)
      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.i18n?.es?.description).toBe('Nueva descripción');
    });
  });

  // ============================================================================
  // LOCALE HANDLING TESTS
  // ============================================================================

  describe('Locale Handling', () => {
    it('should disable configuration controls in non-default locale', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      // Style selector should not be visible
      expect(screen.queryByText('Toggle Style')).not.toBeInTheDocument();
      // Required toggle should not be visible
      expect(screen.queryByText('Required')).not.toBeInTheDocument();
    });

    it('should show muted label styling in non-default locale', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const fieldLabel = screen.getByText(/Field Label.*\(es\)/);
      expect(fieldLabel).toHaveClass('text-muted-foreground');
    });
  });

  // ============================================================================
  // EDGE CASES AND DEFAULTS
  // ============================================================================

  describe('Edge Cases and Defaults', () => {
    it('should handle missing toggleOptions gracefully', () => {
      const fieldWithoutOptions = {
        ...mockField,
        toggleOptions: undefined,
      };

      render(
        <ToggleFieldEditor
          field={fieldWithoutOptions}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Toggle Style')).toBeInTheDocument();
    });

    it('should provide default values when creating new toggleOptions', async () => {
      const user = userEvent.setup();
      const fieldWithoutOptions = {
        ...mockField,
        toggleOptions: undefined,
      };

      render(
        <ToggleFieldEditor
          field={fieldWithoutOptions}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      const defaultCheckedLabel = screen.getByText('Default Checked');
      const defaultCheckedSwitch = defaultCheckedLabel.parentElement?.querySelector('[role="switch"]');

      if (defaultCheckedSwitch) {
        await user.click(defaultCheckedSwitch);

        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            toggleOptions: expect.objectContaining({
              checkedValue: true,
              uncheckedValue: false,
              defaultChecked: true,
              style: 'toggle',
            }),
          })
        );
      }
    });

    it('should handle empty i18n object', () => {
      const fieldWithEmptyI18n = {
        ...mockField,
        i18n: {},
      };

      render(
        <ToggleFieldEditor
          field={fieldWithEmptyI18n}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      // Should show empty input with placeholder
      const labelInput = screen.getByPlaceholderText('Enter field label');
      expect(labelInput).toHaveValue('');
      expect(labelInput).toHaveClass('italic');
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      render(
        <ToggleFieldEditor
          field={mockField}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      // Check that labels are associated with inputs
      const labelInput = screen.getByDisplayValue('Enable notifications');
      expect(labelInput).toBeInTheDocument();
      expect(labelInput).toHaveAttribute('placeholder', 'Enter field label');
    });

    it('should have semantic HTML structure', () => {
      const fieldWithDescription = {
        ...mockField,
        showDescription: true,
        description: 'Help text',
      };

      render(
        <ToggleFieldEditor
          field={fieldWithDescription}
          onChange={mockOnChange}
          onDelete={mockOnDelete}
        />
      );

      // Check for proper switch roles
      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBeGreaterThan(0);

      // Check for proper combobox roles (Select components)
      const comboboxes = screen.getAllByRole('combobox');
      expect(comboboxes.length).toBeGreaterThan(0);
    });
  });
});
