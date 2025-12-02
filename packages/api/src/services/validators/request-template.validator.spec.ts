import { BadRequestException } from '@nestjs/common';
import {
  validateRequestTemplate,
  VALID_FIELD_TYPES,
} from './request-template.validator';

describe('RequestTemplateValidator (ALI-118)', () => {
  const validTemplate = {
    version: '1.0',
    fields: [
      {
        id: 'issue_description',
        type: 'textarea',
        label: 'Describe the Issue',
        required: true,
      },
    ],
  };

  describe('Template Structure Validation', () => {
    it('should validate a correct template', () => {
      expect(() => validateRequestTemplate(validTemplate)).not.toThrow();
    });

    it('should throw if template is not an object', () => {
      expect(() => validateRequestTemplate(null)).toThrow(BadRequestException);
      expect(() => validateRequestTemplate(null)).toThrow(
        'Request template must be a valid JSON object',
      );

      expect(() => validateRequestTemplate('string')).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(123)).toThrow(BadRequestException);
      expect(() => validateRequestTemplate([])).toThrow(BadRequestException);
    });

    it('should throw if version is missing', () => {
      const invalidTemplate = { fields: validTemplate.fields };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        'Request template must have a "version" string field',
      );
    });

    it('should throw if version is not a string', () => {
      const invalidTemplate = { version: 123, fields: validTemplate.fields };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
    });

    it('should throw if fields is missing', () => {
      const invalidTemplate = { version: '1.0' };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        'Request template must have a "fields" array',
      );
    });

    it('should throw if fields is not an array', () => {
      const invalidTemplate = { version: '1.0', fields: 'not-array' };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
    });

    it('should throw if fields array is empty', () => {
      const invalidTemplate = { version: '1.0', fields: [] };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        'Request template must have at least one field',
      );
    });

    it('should throw if fields array has more than 50 fields', () => {
      const fields = Array(51)
        .fill(null)
        .map((_, i) => ({
          id: `field_${i}`,
          type: 'text',
          label: `Field ${i}`,
          required: false,
        }));

      const invalidTemplate = { version: '1.0', fields };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        'Request template cannot have more than 50 fields',
      );
    });
  });

  describe('Field Validation', () => {
    it('should throw if field ID is missing', () => {
      const invalidTemplate = {
        version: '1.0',
        fields: [
          {
            type: 'text',
            label: 'Test',
            required: true,
          },
        ],
      };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        'Field 1: "id" must be a non-empty string',
      );
    });

    it('should throw if field ID is not a string', () => {
      const invalidTemplate = {
        version: '1.0',
        fields: [
          {
            id: 123,
            type: 'text',
            label: 'Test',
            required: true,
          },
        ],
      };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
    });

    it('should throw if field ID has invalid characters', () => {
      const invalidTemplate = {
        version: '1.0',
        fields: [
          {
            id: 'Invalid-ID!',
            type: 'text',
            label: 'Test',
            required: true,
          },
        ],
      };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        'can only contain lowercase letters, numbers, and underscores',
      );
    });

    it('should throw if field ID is uppercase', () => {
      const invalidTemplate = {
        version: '1.0',
        fields: [
          {
            id: 'UPPERCASE_ID',
            type: 'text',
            label: 'Test',
            required: true,
          },
        ],
      };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
    });

    it('should throw if field IDs are duplicated', () => {
      const invalidTemplate = {
        version: '1.0',
        fields: [
          {
            id: 'duplicate_field',
            type: 'text',
            label: 'Field 1',
            required: true,
          },
          {
            id: 'duplicate_field',
            type: 'text',
            label: 'Field 2',
            required: true,
          },
        ],
      };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        'Duplicate field ID found',
      );
    });

    it('should throw if field type is invalid', () => {
      const invalidTemplate = {
        version: '1.0',
        fields: [
          {
            id: 'test_field',
            type: 'invalid_type',
            label: 'Test',
            required: true,
          },
        ],
      };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        'Invalid field type',
      );
    });

    it('should throw if field label is missing', () => {
      const invalidTemplate = {
        version: '1.0',
        fields: [
          {
            id: 'test_field',
            type: 'text',
            required: true,
          },
        ],
      };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        '"label" must be a non-empty string',
      );
    });

    it('should throw if field required is not boolean', () => {
      const invalidTemplate = {
        version: '1.0',
        fields: [
          {
            id: 'test_field',
            type: 'text',
            label: 'Test',
            required: 'yes',
          },
        ],
      };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        '"required" must be a boolean',
      );
    });

    it('should allow optional placeholder and helpText', () => {
      const validTemplateWithOptionals = {
        version: '1.0',
        fields: [
          {
            id: 'test_field',
            type: 'text',
            label: 'Test',
            placeholder: 'Enter text...',
            helpText: 'This is help text',
            required: true,
          },
        ],
      };

      expect(() =>
        validateRequestTemplate(validTemplateWithOptionals),
      ).not.toThrow();
    });

    it('should throw if placeholder is not a string', () => {
      const invalidTemplate = {
        version: '1.0',
        fields: [
          {
            id: 'test_field',
            type: 'text',
            label: 'Test',
            placeholder: 123,
            required: true,
          },
        ],
      };

      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        BadRequestException,
      );
      expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
        '"placeholder" must be a string',
      );
    });
  });

  describe('Field Type Specific Validation', () => {
    describe('select, radio, checkboxGroup', () => {
      it('should throw if options are missing', () => {
        const invalidTemplate = {
          version: '1.0',
          fields: [
            {
              id: 'test_select',
              type: 'select',
              label: 'Test Select',
              required: true,
            },
          ],
        };

        expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
          BadRequestException,
        );
        expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
          'requires a non-empty "options" array',
        );
      });

      it('should throw if options array is empty', () => {
        const invalidTemplate = {
          version: '1.0',
          fields: [
            {
              id: 'test_select',
              type: 'select',
              label: 'Test Select',
              required: true,
              options: [],
            },
          ],
        };

        expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
          BadRequestException,
        );
      });

      it('should throw if option is missing value or label', () => {
        const invalidTemplate = {
          version: '1.0',
          fields: [
            {
              id: 'test_select',
              type: 'select',
              label: 'Test Select',
              required: true,
              options: [{ value: 'test' }],
            },
          ],
        };

        expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
          BadRequestException,
        );
        expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
          'Each option must have "value" and "label" properties',
        );
      });

      it('should accept valid options', () => {
        const validTemplate = {
          version: '1.0',
          fields: [
            {
              id: 'test_select',
              type: 'select',
              label: 'Test Select',
              required: true,
              options: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
              ],
            },
          ],
        };

        expect(() => validateRequestTemplate(validTemplate)).not.toThrow();
      });
    });

    describe('Validation rules', () => {
      it('should throw if validation is not an object', () => {
        const invalidTemplate = {
          version: '1.0',
          fields: [
            {
              id: 'test_field',
              type: 'text',
              label: 'Test',
              required: true,
              validation: 'not-object',
            },
          ],
        };

        expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
          BadRequestException,
        );
        expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
          '"validation" must be an object',
        );
      });

      it('should throw if minLength is not a number', () => {
        const invalidTemplate = {
          version: '1.0',
          fields: [
            {
              id: 'test_field',
              type: 'text',
              label: 'Test',
              required: true,
              validation: { minLength: 'five' },
            },
          ],
        };

        expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
          BadRequestException,
        );
        expect(() => validateRequestTemplate(invalidTemplate)).toThrow(
          'validation.minLength must be a number',
        );
      });

      it('should accept valid text validation rules', () => {
        const validTemplate = {
          version: '1.0',
          fields: [
            {
              id: 'test_field',
              type: 'text',
              label: 'Test',
              required: true,
              validation: {
                minLength: 5,
                maxLength: 100,
                pattern: '^[a-zA-Z]+$',
              },
            },
          ],
        };

        expect(() => validateRequestTemplate(validTemplate)).not.toThrow();
      });

      it('should accept valid number validation rules', () => {
        const validTemplate = {
          version: '1.0',
          fields: [
            {
              id: 'test_number',
              type: 'number',
              label: 'Test',
              required: true,
              validation: {
                min: 0,
                max: 100,
                integer: true,
              },
            },
          ],
        };

        expect(() => validateRequestTemplate(validTemplate)).not.toThrow();
      });

      it('should accept valid file validation rules', () => {
        const validTemplate = {
          version: '1.0',
          fields: [
            {
              id: 'test_file',
              type: 'file',
              label: 'Test',
              required: false,
              validation: {
                maxFiles: 5,
                maxSizeMB: 10,
                acceptedTypes: ['image/jpeg', 'image/png'],
              },
            },
          ],
        };

        expect(() => validateRequestTemplate(validTemplate)).not.toThrow();
      });

      it('should accept valid checkboxGroup validation rules', () => {
        const validTemplate = {
          version: '1.0',
          fields: [
            {
              id: 'test_checkbox_group',
              type: 'checkboxGroup',
              label: 'Test',
              required: true,
              options: [
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
              ],
              validation: {
                minSelected: 1,
                maxSelected: 2,
              },
            },
          ],
        };

        expect(() => validateRequestTemplate(validTemplate)).not.toThrow();
      });
    });
  });

  describe('All Field Types', () => {
    it('should validate all supported field types', () => {
      const allFieldsTemplate = {
        version: '1.0',
        fields: [
          { id: 'text_field', type: 'text', label: 'Text', required: true },
          { id: 'textarea_field', type: 'textarea', label: 'Textarea', required: true },
          { id: 'number_field', type: 'number', label: 'Number', required: false },
          {
            id: 'select_field',
            type: 'select',
            label: 'Select',
            required: true,
            options: [{ value: '1', label: 'One' }],
          },
          {
            id: 'radio_field',
            type: 'radio',
            label: 'Radio',
            required: true,
            options: [{ value: '1', label: 'One' }],
          },
          { id: 'checkbox_field', type: 'checkbox', label: 'Checkbox', required: false },
          {
            id: 'checkbox_group_field',
            type: 'checkboxGroup',
            label: 'Checkbox Group',
            required: false,
            options: [{ value: '1', label: 'One' }],
          },
          { id: 'date_field', type: 'date', label: 'Date', required: false },
          { id: 'time_field', type: 'time', label: 'Time', required: false },
          { id: 'file_field', type: 'file', label: 'File', required: false },
        ],
      };

      expect(() => validateRequestTemplate(allFieldsTemplate)).not.toThrow();
    });
  });
});
