import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from './TimePicker';
import { useState } from 'react';

const meta: Meta<typeof TimePicker> = {
  title: 'Form Builder/Atoms/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Current time value in HH:mm or HH:mm:ss format',
    },
    onChange: {
      action: 'onChange',
      description: 'Callback function triggered when time changes',
    },
    format24: {
      control: 'boolean',
      description: 'Use 24-hour format (true) or 12-hour format with AM/PM (false)',
    },
    includeSeconds: {
      control: 'boolean',
      description: 'Include seconds in the time picker',
    },
    interval: {
      control: { type: 'number', min: 5, max: 60, step: 5 },
      description: 'Time interval in minutes for quick selection',
    },
    minHour: {
      control: { type: 'number', min: 0, max: 23 },
      description: 'Minimum hour allowed',
    },
    maxHour: {
      control: { type: 'number', min: 0, max: 23 },
      description: 'Maximum hour allowed',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no time is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    locale: {
      control: 'select',
      options: ['en', 'es'],
      description: 'Locale for translations',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

// Wrapper component for interactive stories
function TimePickerWrapper(args: any) {
  const [value, setValue] = useState(args.value);

  return (
    <div className="p-4 max-w-md">
      <TimePicker {...args} value={value} onChange={setValue} />
      <div className="mt-4 p-2 bg-muted rounded text-sm">
        <strong>Selected time:</strong> {value || 'None'}
      </div>
    </div>
  );
}

export const Default24Hour: Story = {
  render: (args) => <TimePickerWrapper {...args} />,
  args: {
    format24: true,
    placeholder: 'Select time',
  },
};

export const Default12Hour: Story = {
  render: (args) => <TimePickerWrapper {...args} />,
  args: {
    format24: false,
    placeholder: 'Select time',
  },
};

export const WithSeconds: Story = {
  render: (args) => <TimePickerWrapper {...args} />,
  args: {
    format24: true,
    includeSeconds: true,
    value: '14:30:45',
  },
};

export const Interval15Minutes: Story = {
  render: (args) => <TimePickerWrapper {...args} />,
  args: {
    format24: true,
    interval: 15,
  },
};

export const Interval30Minutes: Story = {
  render: (args) => <TimePickerWrapper {...args} />,
  args: {
    format24: false,
    interval: 30,
  },
};

export const BusinessHours: Story = {
  render: (args) => <TimePickerWrapper {...args} />,
  args: {
    format24: true,
    minHour: 9,
    maxHour: 17,
    interval: 30,
  },
};

export const Disabled: Story = {
  render: (args) => <TimePickerWrapper {...args} />,
  args: {
    format24: true,
    value: '10:30',
    disabled: true,
  },
};

export const SpanishLocale: Story = {
  render: (args) => <TimePickerWrapper {...args} />,
  args: {
    format24: false,
    locale: 'es',
  },
};

export const Afternoon12Hour: Story = {
  render: (args) => <TimePickerWrapper {...args} />,
  args: {
    format24: false,
    value: '14:30',
  },
};

export const WithCustomPlaceholder: Story = {
  render: (args) => <TimePickerWrapper {...args} />,
  args: {
    format24: true,
    placeholder: 'Pick a time slot',
  },
};
