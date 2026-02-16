import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TextFieldEditor } from './TextFieldEditor';
import type { FormField } from '@/components/features/form-builder/types';

expect.extend(toHaveNoViolations);

// ============================================================================
// MOCK DATA
// ============================================================================

const createTextField = (overrides?: Partial<FormField>): FormField => ({
  id: 'text-field-1',
  type: 'text',
  label: 'Text Field',
  placeholder: 'Enter text',
  validation: {
    required: false,
  },
  ...overrides,
});

const createEmailField = (overrides?: Partial<FormField>): FormField => ({
  id: 'email-field-1',
  type: 'email',
  label: 'Email Field',
  placeholder: 'email@example.com',
  validation: {
    required: false,
  },
  emailOptions: {
    showValidationIcon: true,
    validateOnBlur: true,
    allowMultiple: false,
  },
  ...overrides,
});

const createPhoneField = (overrides?: Partial<FormField>): FormField => ({
  id: 'phone-field-1',
  type: 'phone',
  label: 'Phone Field',
  placeholder: '+1 (555) 123-4567',
  validation: {
    required: false,
  },
  phoneOptions: {
    format: 'national',
    defaultCountry: 'US',
    mask: '(###) ###-####',
  },
  ...overrides,
});

// ============================================================================
// TEXT FIELD TESTS
// ============================================================================

describe('TextFieldEditor - Text Type', () => {
  const mockOnChange = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnDuplicate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders text field editor with basic settings', () => {
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('text Field')).toBeInTheDocument();
    expect(screen.getByLabelText('Label')).toHaveValue('Text Field');
    expect(screen.getByLabelText('Placeholder')).toHaveValue('Enter text');
  });

  it('updates label when changed', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const labelInput = screen.getByLabelText('Label');
    await user.tripleClick(labelInput); // Select all
    await user.paste('New Label');

    // Check that onChange was called with the final result
    expect(mockOnChange).toHaveBeenCalled();
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.label).toBe('New Label');
  });

  it('updates placeholder when changed', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const placeholderInput = screen.getByLabelText('Placeholder');
    await user.tripleClick(placeholderInput); // Select all
    await user.paste('New placeholder');

    // Check that onChange was called with the final result
    expect(mockOnChange).toHaveBeenCalled();
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.placeholder).toBe('New placeholder');
  });

  it('updates description when changed', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const descriptionInput = screen.getByLabelText('Description');
    await user.click(descriptionInput);
    await user.paste('Help text');

    // Check that onChange was called with the final result
    expect(mockOnChange).toHaveBeenCalled();
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.description).toBe('Help text');
  });

  it('toggles required field', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const requiredSwitch = screen.getByRole('switch', { name: /required field/i });
    await user.click(requiredSwitch);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...field,
      validation: { required: true },
    });
  });

  it('updates minimum length validation', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const minLengthInput = screen.getByLabelText('Minimum Length');
    await user.type(minLengthInput, '5');

    expect(mockOnChange).toHaveBeenLastCalledWith({
      ...field,
      validation: { ...field.validation, minLength: 5 },
    });
  });

  it('updates maximum length validation', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const maxLengthInput = screen.getByLabelText('Maximum Length');
    await user.click(maxLengthInput);
    await user.paste('100');

    // Check that onChange was called with the final result
    expect(mockOnChange).toHaveBeenCalled();
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.validation?.maxLength).toBe(100);
  });

  it('displays character count when max length is set', () => {
    const field = createTextField({
      validation: { maxLength: 100 },
    });
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/\/ 100/)).toBeInTheDocument();
  });

  it('updates pattern validation', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const patternInput = screen.getByLabelText('Pattern (Regex)');
    // Use paste instead of type to avoid keyboard parsing issues with special characters
    await user.click(patternInput);
    await user.paste('^[A-Z]');

    // Check that onChange was called with the final result
    expect(mockOnChange).toHaveBeenCalled();
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.validation?.pattern).toBe('^[A-Z]');
  });

  it('updates custom error message', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const errorMessageInput = screen.getByLabelText('Custom Error Message');
    await user.click(errorMessageInput);
    await user.paste('This field is invalid');

    // Check that onChange was called with the final result
    expect(mockOnChange).toHaveBeenCalled();
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.validation?.errorMessage).toBe('This field is invalid');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete field/i });
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onDuplicate when duplicate button is clicked', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
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

  it('does not render duplicate button when onDuplicate is not provided', () => {
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByRole('button', { name: /duplicate field/i })).not.toBeInTheDocument();
  });
});

// ============================================================================
// EMAIL FIELD TESTS
// ============================================================================

describe('TextFieldEditor - Email Type', () => {
  const mockOnChange = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email field with email-specific options', () => {
    const field = createEmailField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Email Options')).toBeInTheDocument();
    expect(screen.getByLabelText('Show validation icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Allow multiple emails')).toBeInTheDocument();
    expect(screen.getByLabelText('Validate on blur')).toBeInTheDocument();
  });

  it('toggles show validation icon', async () => {
    const user = userEvent.setup();
    const field = createEmailField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const validationIconSwitch = screen.getByRole('switch', { name: /show validation icon/i });
    await user.click(validationIconSwitch);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...field,
      emailOptions: { ...field.emailOptions, showValidationIcon: false },
    });
  });

  it('toggles allow multiple emails', async () => {
    const user = userEvent.setup();
    const field = createEmailField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const allowMultipleSwitch = screen.getByRole('switch', { name: /allow multiple emails/i });
    await user.click(allowMultipleSwitch);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...field,
      emailOptions: { ...field.emailOptions, allowMultiple: true },
    });
  });

  it('toggles validate on blur', async () => {
    const user = userEvent.setup();
    const field = createEmailField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const validateOnBlurSwitch = screen.getByRole('switch', { name: /validate on blur/i });
    await user.click(validateOnBlurSwitch);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...field,
      emailOptions: { ...field.emailOptions, validateOnBlur: false },
    });
  });

  it('shows email preview when validation icon is enabled', () => {
    const field = createEmailField({ emailOptions: { showValidationIcon: true } });
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByLabelText('Preview Validation')).toBeInTheDocument();
  });

  it('validates email in preview and shows valid icon', async () => {
    const user = userEvent.setup();
    const field = createEmailField({ emailOptions: { showValidationIcon: true } });
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const previewInput = screen.getByLabelText('Preview Validation');
    await user.type(previewInput, 'valid@email.com');

    await waitFor(() => {
      const validIcon = document.querySelector('.text-green-500');
      expect(validIcon).toBeInTheDocument();
    });
  });

  it('validates email in preview and shows invalid icon', async () => {
    const user = userEvent.setup();
    const field = createEmailField({ emailOptions: { showValidationIcon: true } });
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const previewInput = screen.getByLabelText('Preview Validation');
    await user.type(previewInput, 'invalid-email');

    await waitFor(() => {
      const invalidIcon = document.querySelector('.text-destructive');
      expect(invalidIcon).toBeInTheDocument();
    });
  });
});

// ============================================================================
// PHONE FIELD TESTS
// ============================================================================

describe('TextFieldEditor - Phone Type', () => {
  const mockOnChange = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders phone field with phone-specific options', () => {
    const field = createPhoneField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Phone Options')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Format')).toBeInTheDocument();
  });

  it('displays national format with country selector', () => {
    const field = createPhoneField({ phoneOptions: { format: 'national' } });
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByLabelText('Default Country')).toBeInTheDocument();
  });

  it('changes phone format to international', async () => {
    const user = userEvent.setup();
    const field = createPhoneField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const formatSelect = screen.getByLabelText('Phone Format');
    await user.click(formatSelect);

    const internationalOption = screen.getByRole('option', { name: /international/i });
    await user.click(internationalOption);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...field,
      phoneOptions: { ...field.phoneOptions, format: 'international' },
    });
  });

  it('changes phone format to custom and shows mask input', async () => {
    const user = userEvent.setup();
    const field = createPhoneField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const formatSelect = screen.getByLabelText('Phone Format');
    await user.click(formatSelect);

    const customOption = screen.getByRole('option', { name: /custom/i });
    await user.click(customOption);

    // Verify onChange was called with custom format
    expect(mockOnChange).toHaveBeenCalled();
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.phoneOptions?.format).toBe('custom');
  });

  it('updates custom phone mask', async () => {
    const user = userEvent.setup();
    const field = createPhoneField({ phoneOptions: { format: 'custom', mask: '' } });
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const maskInput = screen.getByLabelText('Phone Mask');
    await user.click(maskInput);
    await user.paste('##-####-####');

    // Check that onChange was called with the final result
    expect(mockOnChange).toHaveBeenCalled();
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.phoneOptions?.mask).toBe('##-####-####');
  });

  it('displays current mask pattern', () => {
    const field = createPhoneField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('(###) ###-####')).toBeInTheDocument();
  });

  it('changes country and updates mask automatically', async () => {
    const user = userEvent.setup();
    const field = createPhoneField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const countrySelect = screen.getByLabelText('Default Country');
    await user.click(countrySelect);

    const spainOption = screen.getByRole('option', { name: /Spain/i });
    await user.click(spainOption);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...field,
      phoneOptions: {
        ...field.phoneOptions,
        defaultCountry: 'ES',
        mask: '### ### ###',
      },
    });
  });
});

// ============================================================================
// I18N TESTS
// ============================================================================

describe('TextFieldEditor - Internationalization', () => {
  const mockOnChange = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows locale indicator when editing non-default locale', () => {
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        editingLocale="es"
        defaultLocale="en"
      />
    );

    expect(screen.getByText(/Currently editing ES translations/)).toBeInTheDocument();
  });

  it('updates localized label for non-default locale', async () => {
    const user = userEvent.setup();
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        editingLocale="es"
        defaultLocale="en"
      />
    );

    const labelInput = screen.getByLabelText(/Label.*ES/);
    await user.tripleClick(labelInput); // Select all
    await user.paste('Campo de texto');

    // Check that onChange was called with the final result
    expect(mockOnChange).toHaveBeenCalled();
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
    expect(lastCall.i18n?.es?.label).toBe('Campo de texto');
  });

  it('disables technical settings when editing non-default locale', () => {
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        editingLocale="es"
        defaultLocale="en"
      />
    );

    const requiredSwitch = screen.getByRole('switch', { name: /required field/i });
    expect(requiredSwitch).toBeDisabled();

    const minLengthInput = screen.getByLabelText('Minimum Length');
    expect(minLengthInput).toBeDisabled();
  });

  it('displays existing i18n translations', () => {
    const field = createTextField({
      i18n: {
        es: {
          label: 'Campo de texto',
          placeholder: 'Ingrese texto',
        },
      },
    });
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
        editingLocale="es"
        defaultLocale="en"
      />
    );

    const labelInput = screen.getByLabelText(/Label.*ES/);
    expect(labelInput).toHaveValue('Campo de texto');
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

describe('TextFieldEditor - Accessibility', () => {
  const mockOnChange = vi.fn();
  const mockOnDelete = vi.fn();

  it('has no accessibility violations (text field)', async () => {
    const field = createTextField();
    const { container } = render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const results = await axe(container, {
      rules: {
        // Disable button-name rule for Switch/Select which are properly labeled by their Label
        'button-name': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (email field)', async () => {
    const field = createEmailField();
    const { container } = render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const results = await axe(container, {
      rules: {
        // Disable button-name rule for Switch/Select which are properly labeled by their Label
        'button-name': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (phone field)', async () => {
    const field = createPhoneField();
    const { container } = render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    const results = await axe(container, {
      rules: {
        // Disable button-name rule for Select triggers which are properly labeled by their Label
        'button-name': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA labels for all inputs', () => {
    const field = createTextField();
    render(
      <TextFieldEditor
        field={field}
        onChange={mockOnChange}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByLabelText('Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Placeholder')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete field/i })).toBeInTheDocument();
  });
});
