import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextareaFieldEditor } from './TextareaFieldEditor';
import type { FormField } from '@alkitu/shared';

const createMockTextareaField = (overrides?: Partial<FormField>): FormField => ({
  id: 'textarea-1',
  type: 'textarea',
  label: 'Comments',
  placeholder: 'Enter your comments',
  description: 'Please provide detailed comments',
  showTitle: true,
  showDescription: true,
  validation: {
    required: false,
  },
  textareaOptions: {
    rows: 4,
    resize: 'vertical',
    showCharacterCount: false,
    autoGrow: false,
  },
  ...overrides,
});

describe('TextareaFieldEditor', () => {
  describe('Rendering', () => {
    it('should render the component successfully', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.getByTestId('textarea-field-editor')).toBeInTheDocument();
      expect(screen.getByText('Textarea Field')).toBeInTheDocument();
    });

    it('should display all field sections', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.getByText('Textarea Options')).toBeInTheDocument();
      expect(screen.getByText('Validation')).toBeInTheDocument();
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('should display delete and duplicate buttons', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();
      const onDuplicate = vi.fn();

      render(
        <TextareaFieldEditor
          field={field}
          onChange={onChange}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      );

      expect(screen.getByTestId('delete-button')).toBeInTheDocument();
      expect(screen.getByTestId('duplicate-button')).toBeInTheDocument();
    });

    it('should not display duplicate button when onDuplicate is not provided', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.queryByTestId('duplicate-button')).not.toBeInTheDocument();
    });
  });

  describe('Label Editor', () => {
    it('should display current label value', () => {
      const field = createMockTextareaField({ label: 'Feedback' });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const labelInput = screen.getByTestId('label-input') as HTMLInputElement;
      expect(labelInput.value).toBe('Feedback');
    });

    it('should call onChange when label is updated', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const labelInput = screen.getByTestId('label-input');
      fireEvent.change(labelInput, { target: { value: 'New Label' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'New Label',
        })
      );
    });
  });

  describe('Required Toggle', () => {
    it('should display required toggle with correct state', () => {
      const field = createMockTextareaField({
        validation: { required: true },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const toggle = screen.getByTestId('required-toggle') as HTMLButtonElement;
      expect(toggle.getAttribute('data-state')).toBe('checked');
    });

    it('should call onChange when required is toggled', async () => {
      const user = userEvent.setup();
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const toggle = screen.getByTestId('required-toggle');
      await user.click(toggle);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          validation: expect.objectContaining({
            required: true,
          }),
        })
      );
    });
  });

  describe('Placeholder Editor', () => {
    it('should display current placeholder value', () => {
      const field = createMockTextareaField({ placeholder: 'Enter text here' });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const placeholderInput = screen.getByTestId('placeholder-input') as HTMLInputElement;
      expect(placeholderInput.value).toBe('Enter text here');
    });

    it('should call onChange when placeholder is updated', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const placeholderInput = screen.getByTestId('placeholder-input');
      fireEvent.change(placeholderInput, { target: { value: 'New placeholder' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          placeholder: 'New placeholder',
        })
      );
    });
  });

  describe('Description Section', () => {
    it('should show description toggle', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.getByTestId('show-description-toggle')).toBeInTheDocument();
    });

    it('should display description input when showDescription is true', () => {
      const field = createMockTextareaField({ showDescription: true });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.getByTestId('description-input')).toBeInTheDocument();
    });

    it('should hide description input when showDescription is false', () => {
      const field = createMockTextareaField({ showDescription: false });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.queryByTestId('description-input')).not.toBeInTheDocument();
    });

    it('should call onChange when description is updated', () => {
      const field = createMockTextareaField({ showDescription: true });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const descriptionInput = screen.getByTestId('description-input');
      fireEvent.change(descriptionInput, { target: { value: 'New description' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'New description',
        })
      );
    });
  });

  describe('Textarea Options', () => {
    it('should display rows input with correct value', () => {
      const field = createMockTextareaField({
        textareaOptions: { rows: 6 },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const rowsInput = screen.getByTestId('rows-input') as HTMLInputElement;
      expect(rowsInput.value).toBe('6');
    });

    it('should update rows when changed', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const rowsInput = screen.getByTestId('rows-input');
      fireEvent.change(rowsInput, { target: { value: '8' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          textareaOptions: expect.objectContaining({
            rows: 8,
          }),
        })
      );
    });

    it('should display minRows input', () => {
      const field = createMockTextareaField({
        textareaOptions: { minRows: 2 },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const minRowsInput = screen.getByTestId('min-rows-input') as HTMLInputElement;
      expect(minRowsInput.value).toBe('2');
    });

    it('should display maxRows input', () => {
      const field = createMockTextareaField({
        textareaOptions: { maxRows: 10 },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const maxRowsInput = screen.getByTestId('max-rows-input') as HTMLInputElement;
      expect(maxRowsInput.value).toBe('10');
    });

    it('should display resize select with correct value', () => {
      const field = createMockTextareaField({
        textareaOptions: { resize: 'both' },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.getByTestId('resize-select')).toBeInTheDocument();
    });

    it('should display show character count toggle', () => {
      const field = createMockTextareaField({
        textareaOptions: { showCharacterCount: true },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const toggle = screen.getByTestId('show-character-count-toggle') as HTMLButtonElement;
      expect(toggle.getAttribute('data-state')).toBe('checked');
    });

    it('should display auto-grow toggle', () => {
      const field = createMockTextareaField({
        textareaOptions: { autoGrow: true },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const toggle = screen.getByTestId('auto-grow-toggle') as HTMLButtonElement;
      expect(toggle.getAttribute('data-state')).toBe('checked');
    });

    it('should toggle auto-grow when clicked', async () => {
      const user = userEvent.setup();
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const toggle = screen.getByTestId('auto-grow-toggle');
      await user.click(toggle);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          textareaOptions: expect.objectContaining({
            autoGrow: true,
          }),
        })
      );
    });
  });

  describe('Validation Options', () => {
    it('should display min length input', () => {
      const field = createMockTextareaField({
        validation: { minLength: 10 },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const minLengthInput = screen.getByTestId('min-length-input') as HTMLInputElement;
      expect(minLengthInput.value).toBe('10');
    });

    it('should update minLength when changed', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const minLengthInput = screen.getByTestId('min-length-input');
      fireEvent.change(minLengthInput, { target: { value: '20' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          validation: expect.objectContaining({
            minLength: 20,
          }),
        })
      );
    });

    it('should display max length input', () => {
      const field = createMockTextareaField({
        validation: { maxLength: 500 },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const maxLengthInput = screen.getByTestId('max-length-input') as HTMLInputElement;
      expect(maxLengthInput.value).toBe('500');
    });

    it('should update maxLength when changed', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const maxLengthInput = screen.getByTestId('max-length-input');
      fireEvent.change(maxLengthInput, { target: { value: '1000' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          validation: expect.objectContaining({
            maxLength: 1000,
          }),
        })
      );
    });

    it('should display pattern input', () => {
      const field = createMockTextareaField({
        validation: { pattern: '^[A-Za-z]+$' },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const patternInput = screen.getByTestId('pattern-input') as HTMLInputElement;
      expect(patternInput.value).toBe('^[A-Za-z]+$');
    });

    it('should display error message input', () => {
      const field = createMockTextareaField({
        validation: { errorMessage: 'Custom error' },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const errorMessageInput = screen.getByTestId('error-message-input') as HTMLInputElement;
      expect(errorMessageInput.value).toBe('Custom error');
    });
  });

  describe('Character Counter Integration', () => {
    it('should show character count in preview when enabled with maxLength', () => {
      const field = createMockTextareaField({
        textareaOptions: { showCharacterCount: true },
        validation: { maxLength: 100 },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      // Find by role and text content
      const characterCount = screen.getByRole('status', { name: /0 of 100 characters used/i });
      expect(characterCount).toBeInTheDocument();
      expect(characterCount).toHaveTextContent('0 / 100');
    });

    it('should not show character count when disabled', () => {
      const field = createMockTextareaField({
        textareaOptions: { showCharacterCount: false },
        validation: { maxLength: 100 },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      // Should not find character count status
      expect(screen.queryByRole('status', { name: /characters used/i })).not.toBeInTheDocument();
    });

    it('should not show character count when maxLength is not set', () => {
      const field = createMockTextareaField({
        textareaOptions: { showCharacterCount: true },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      // Should not find character count status
      expect(screen.queryByRole('status', { name: /characters used/i })).not.toBeInTheDocument();
    });

    it('should update character count as preview text changes', () => {
      const field = createMockTextareaField({
        textareaOptions: { showCharacterCount: true },
        validation: { maxLength: 100 },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const previewTextarea = screen.getByTestId('preview-textarea');
      fireEvent.change(previewTextarea, { target: { value: 'Hello' } });

      // Find by role after change
      const characterCount = screen.getByRole('status', { name: /5 of 100 characters used/i });
      expect(characterCount).toHaveTextContent('5 / 100');
    });
  });

  describe('Preview Section', () => {
    it('should display preview textarea', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.getByTestId('preview-textarea')).toBeInTheDocument();
    });

    it('should apply correct rows to preview', () => {
      const field = createMockTextareaField({
        textareaOptions: { rows: 6 },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const preview = screen.getByTestId('preview-textarea') as HTMLTextAreaElement;
      expect(preview.getAttribute('rows')).toBe('6');
    });

    it('should apply correct resize mode to preview', () => {
      const field = createMockTextareaField({
        textareaOptions: { resize: 'both' },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const preview = screen.getByTestId('preview-textarea') as HTMLTextAreaElement;
      expect(preview.style.resize).toBe('both');
    });

    it('should display description in preview when enabled', () => {
      const field = createMockTextareaField({
        description: 'Help text',
        showDescription: true,
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.getByTestId('preview-description')).toHaveTextContent('Help text');
    });

    it('should not display description in preview when disabled', () => {
      const field = createMockTextareaField({
        description: 'Help text',
        showDescription: false,
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.queryByTestId('preview-description')).not.toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      const deleteButton = screen.getByTestId('delete-button');
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('should call onDuplicate when duplicate button is clicked', async () => {
      const user = userEvent.setup();
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();
      const onDuplicate = vi.fn();

      render(
        <TextareaFieldEditor
          field={field}
          onChange={onChange}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      );

      const duplicateButton = screen.getByTestId('duplicate-button');
      await user.click(duplicateButton);

      expect(onDuplicate).toHaveBeenCalledTimes(1);
    });
  });

  describe('i18n Support', () => {
    it('should display localized label when editing non-default locale', () => {
      const field = createMockTextareaField({
        label: 'Comments',
        i18n: {
          es: {
            label: 'Comentarios',
          },
        },
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(
        <TextareaFieldEditor
          field={field}
          onChange={onChange}
          onDelete={onDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const labelInput = screen.getByTestId('label-input') as HTMLInputElement;
      expect(labelInput.value).toBe('Comentarios');
    });

    it('should update localized label for non-default locale', () => {
      const field = createMockTextareaField({
        label: 'Comments',
      });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(
        <TextareaFieldEditor
          field={field}
          onChange={onChange}
          onDelete={onDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      const labelInput = screen.getByTestId('label-input');
      fireEvent.change(labelInput, { target: { value: 'Comentarios' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          i18n: expect.objectContaining({
            es: expect.objectContaining({
              label: 'Comentarios',
            }),
          }),
        })
      );
    });

    it('should disable structural changes when editing non-default locale', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(
        <TextareaFieldEditor
          field={field}
          onChange={onChange}
          onDelete={onDelete}
          editingLocale="es"
          defaultLocale="en"
        />
      );

      expect(screen.getByTestId('required-toggle')).toBeDisabled();
      expect(screen.getByTestId('rows-input')).toBeDisabled();
      expect(screen.getByTestId('resize-select')).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for action buttons', () => {
      const field = createMockTextareaField();
      const onChange = vi.fn();
      const onDelete = vi.fn();
      const onDuplicate = vi.fn();

      render(
        <TextareaFieldEditor
          field={field}
          onChange={onChange}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      );

      const deleteButton = screen.getByLabelText('Delete field');
      const duplicateButton = screen.getByLabelText('Duplicate field');

      expect(deleteButton).toBeInTheDocument();
      expect(duplicateButton).toBeInTheDocument();
    });

    it('should have proper labels for all inputs', () => {
      const field = createMockTextareaField({ showDescription: true });
      const onChange = vi.fn();
      const onDelete = vi.fn();

      render(<TextareaFieldEditor field={field} onChange={onChange} onDelete={onDelete} />);

      expect(screen.getByLabelText('Label')).toBeInTheDocument();
      expect(screen.getByLabelText('Required')).toBeInTheDocument();
      expect(screen.getByLabelText('Placeholder')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Rows (Initial Height)')).toBeInTheDocument();
      expect(screen.getByLabelText('Resize Mode')).toBeInTheDocument();
    });
  });
});
