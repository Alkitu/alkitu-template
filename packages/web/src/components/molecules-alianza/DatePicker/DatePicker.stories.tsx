import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker';
import type { DatePickerProps, DateValue, DateRange } from './DatePicker.types';

const meta = {
  title: 'Molecules/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'inline', 'range', 'datetime'],
      description: 'Visual variant of the date picker',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the date picker',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the date picker is disabled',
    },
    clearable: {
      control: 'boolean',
      description: 'Whether to show clear button',
    },
    showToday: {
      control: 'boolean',
      description: 'Whether to show today button',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    helperText: {
      control: 'text',
      description: 'Helper text',
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================
// BASIC VARIANTS
// ============================================================

export const Default: Story = {
  args: {
    label: 'Select Date',
    placeholder: 'Choose a date',
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const WithValue: Story = {
  args: {
    label: 'Birth Date',
    placeholder: 'Select your birth date',
    value: new Date(1990, 0, 15),
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(args.value);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const Required: Story = {
  args: {
    label: 'Appointment Date',
    placeholder: 'Select date',
    required: true,
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

// ============================================================
// SIZES
// ============================================================

export const SmallSize: Story = {
  args: {
    label: 'Small Date Picker',
    size: 'sm',
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const MediumSize: Story = {
  args: {
    label: 'Medium Date Picker',
    size: 'md',
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const LargeSize: Story = {
  args: {
    label: 'Large Date Picker',
    size: 'lg',
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

// ============================================================
// VARIANTS
// ============================================================

export const InlineVariant: Story = {
  args: {
    label: 'Inline Calendar',
    variant: 'inline',
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const DateTimeVariant: Story = {
  args: {
    label: 'Select Date & Time',
    variant: 'datetime',
    placeholder: 'Choose date and time',
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(new Date(2025, 0, 15, 14, 30));
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const RangeVariant: Story = {
  args: {
    label: 'Select Date Range',
    variant: 'range',
    placeholder: 'Choose date range',
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const RangeWithValue: Story = {
  args: {
    label: 'Vacation Dates',
    variant: 'range',
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>({
      from: new Date(2025, 6, 1),
      to: new Date(2025, 6, 15),
    });
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

// ============================================================
// STATES
// ============================================================

export const WithError: Story = {
  args: {
    label: 'Event Date',
    error: 'Date must be in the future',
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(new Date(2020, 0, 1));
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Departure Date',
    helperText: 'Select your preferred departure date',
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Date Picker',
    disabled: true,
    value: new Date(2025, 0, 15),
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(args.value);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

// ============================================================
// FEATURES
// ============================================================

export const NotClearable: Story = {
  args: {
    label: 'Non-Clearable Date',
    clearable: false,
    value: new Date(2025, 0, 15),
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(args.value);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const WithoutTodayButton: Story = {
  args: {
    label: 'No Today Button',
    showToday: false,
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const WithMinMaxDates: Story = {
  args: {
    label: 'Date with Constraints',
    helperText: 'Select a date in January 2025',
    minDate: new Date(2025, 0, 1),
    maxDate: new Date(2025, 0, 31),
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const FutureDatesOnly: Story = {
  args: {
    label: 'Future Dates Only',
    helperText: 'Past dates are disabled',
    minDate: new Date(),
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const PastDatesOnly: Story = {
  args: {
    label: 'Past Dates Only',
    helperText: 'Future dates are disabled',
    maxDate: new Date(),
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(undefined);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

// ============================================================
// FORM EXAMPLES
// ============================================================

export const InFormContext: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      startDate: undefined as DateValue,
      endDate: undefined as DateValue,
      appointmentTime: new Date(2025, 0, 15, 14, 0),
    });

    return (
      <div className="space-y-6 w-[400px]">
        <h2 className="text-xl font-bold">Event Form</h2>

        <DatePicker
          label="Start Date"
          required
          value={formData.startDate}
          onChange={(date) => setFormData({ ...formData, startDate: date })}
        />

        <DatePicker
          label="End Date"
          required
          value={formData.endDate}
          onChange={(date) => setFormData({ ...formData, endDate: date })}
          minDate={formData.startDate as Date}
        />

        <DatePicker
          label="Appointment Time"
          variant="datetime"
          required
          value={formData.appointmentTime}
          onChange={(date) => setFormData({ ...formData, appointmentTime: date })}
        />

        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm font-medium mb-2">Selected Values:</p>
          <pre className="text-xs">
            {JSON.stringify(
              {
                startDate: formData.startDate?.toString(),
                endDate: formData.endDate?.toString(),
                appointmentTime: formData.appointmentTime?.toString(),
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    );
  },
};

// ============================================================
// EDGE CASES
// ============================================================

export const LeapYear: Story = {
  args: {
    label: 'Leap Year Date',
    value: new Date(2024, 1, 29), // Feb 29, 2024
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(args.value);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const YearBoundary: Story = {
  args: {
    label: 'Year End Date',
    value: new Date(2025, 11, 31), // Dec 31, 2025
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(args.value);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

export const MonthBoundary: Story = {
  args: {
    label: 'Month End Date',
    value: new Date(2025, 0, 31), // Jan 31, 2025
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue>(args.value);
    return <DatePicker {...args} value={date} onChange={setDate} />;
  },
};

// ============================================================
// INTERACTIVE EXAMPLES
// ============================================================

export const AllVariants: Story = {
  render: () => {
    const [singleDate, setSingleDate] = useState<DateValue>(undefined);
    const [dateTime, setDateTime] = useState<DateValue>(new Date());
    const [dateRange, setDateRange] = useState<DateValue>(undefined);
    const [inlineDate, setInlineDate] = useState<DateValue>(undefined);

    return (
      <div className="space-y-8 w-[600px]">
        <div>
          <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
          <DatePicker
            label="Single Date Selection"
            value={singleDate}
            onChange={setSingleDate}
            placeholder="Pick a date"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">DateTime Variant</h3>
          <DatePicker
            label="Date & Time Selection"
            variant="datetime"
            value={dateTime}
            onChange={setDateTime}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Range Variant</h3>
          <DatePicker
            label="Date Range Selection"
            variant="range"
            value={dateRange}
            onChange={setDateRange}
            placeholder="Select date range"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Inline Variant</h3>
          <DatePicker
            label="Inline Calendar"
            variant="inline"
            value={inlineDate}
            onChange={setInlineDate}
          />
        </div>
      </div>
    );
  },
};
