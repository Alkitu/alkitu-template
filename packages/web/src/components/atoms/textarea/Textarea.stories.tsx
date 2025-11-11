import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';
import { useState } from 'react';

const meta = {
  title: 'Atomic Design/Atoms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible textarea component with optional auto-resize functionality, theme reactivity, and multiple variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant of the textarea',
      table: {
        type: { summary: 'TextareaVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the textarea',
      table: {
        type: { summary: 'TextareaSize' },
        defaultValue: { summary: 'md' },
      },
    },
    autosize: {
      control: 'boolean',
      description: 'Enable auto-resize functionality',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    useTypographyVars: {
      control: 'boolean',
      description: 'Use typography CSS variables from theme',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Stories
export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'This is some default text in the textarea.',
    placeholder: 'Enter your message...',
  },
};

// Variant Stories
export const ErrorVariant: Story = {
  args: {
    variant: 'error',
    placeholder: 'This field has an error...',
    defaultValue: 'Invalid input',
  },
};

export const SuccessVariant: Story = {
  args: {
    variant: 'success',
    placeholder: 'This field is valid...',
    defaultValue: 'Valid input!',
  },
};

// Size Stories
export const SmallSize: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small textarea',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium textarea (default)',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large textarea',
  },
};

// State Stories
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'This textarea is disabled',
    defaultValue: 'You cannot edit this text',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    placeholder: 'This textarea is read-only',
    defaultValue: 'This text cannot be modified',
  },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'This field is required',
  },
};

// Autosize Stories
export const Autosize: Story = {
  args: {
    autosize: true,
    placeholder: 'Type here and watch the textarea grow...',
    minHeight: 60,
    maxHeight: 200,
  },
};

export const AutosizeWithLimits: Story = {
  args: {
    autosize: true,
    placeholder: 'Min height: 100px, Max height: 300px',
    minHeight: 100,
    maxHeight: 300,
  },
};

// Interactive Stories
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '400px' }}>
        <Textarea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something..."
        />
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
          Character count: {value.length}
        </p>
      </div>
    );
  },
};

export const WithMaxLength: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const maxLength = 200;
    return (
      <div style={{ width: '400px' }}>
        <Textarea
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
          placeholder={`Maximum ${maxLength} characters`}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
          {value.length} / {maxLength} characters
        </p>
      </div>
    );
  },
};

// Theme Stories
export const WithCustomTheme: Story = {
  args: {
    placeholder: 'Custom themed textarea',
    themeOverride: {
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      borderColor: 'rgb(147, 51, 234)',
      color: 'rgb(147, 51, 234)',
    },
  },
};

export const WithoutTypographyVars: Story = {
  args: {
    placeholder: 'Without typography variables',
    useTypographyVars: false,
  },
};

// Complex Example
export const FormExample: Story = {
  render: (args) => {
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div>
          <label
            htmlFor="message"
            style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}
          >
            Message
          </label>
          <Textarea
            {...args}
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            required
            minHeight={100}
            maxHeight={300}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          {submitted ? 'Submitted!' : 'Submit'}
        </button>
      </form>
    );
  },
  args: {
    autosize: true,
  },
};

// Accessibility Stories
export const WithAriaLabel: Story = {
  args: {
    'aria-label': 'Message textarea',
    placeholder: 'Enter your message...',
  },
};

export const WithAriaDescribedBy: Story = {
  render: (args) => (
    <div style={{ width: '400px' }}>
      <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>
        Description
      </label>
      <Textarea
        {...args}
        id="description"
        aria-describedby="description-help"
        placeholder="Enter a description..."
      />
      <p
        id="description-help"
        style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
      >
        Please provide a detailed description of your request.
      </p>
    </div>
  ),
};

export const WithValidation: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (newValue.length < 10) {
        setError('Message must be at least 10 characters');
      } else if (newValue.length > 500) {
        setError('Message must not exceed 500 characters');
      } else {
        setError('');
      }
    };

    return (
      <div style={{ width: '400px' }}>
        <label htmlFor="validated" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Validated Message
        </label>
        <Textarea
          {...args}
          id="validated"
          value={value}
          onChange={handleChange}
          variant={error ? 'error' : value.length >= 10 ? 'success' : 'default'}
          aria-invalid={!!error}
          aria-describedby="validation-message"
          placeholder="Enter at least 10 characters..."
        />
        {error && (
          <p
            id="validation-message"
            style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--destructive)' }}
          >
            {error}
          </p>
        )}
        {!error && value.length >= 10 && (
          <p
            style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--success)' }}
          >
            Looks good!
          </p>
        )}
      </div>
    );
  },
};

// All Variants Comparison
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <Textarea {...args} variant="default" placeholder="Default variant" />
      <Textarea {...args} variant="error" placeholder="Error variant" />
      <Textarea {...args} variant="success" placeholder="Success variant" />
    </div>
  ),
};

// All Sizes Comparison
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <Textarea {...args} size="sm" placeholder="Small size" />
      <Textarea {...args} size="md" placeholder="Medium size" />
      <Textarea {...args} size="lg" placeholder="Large size" />
    </div>
  ),
};
