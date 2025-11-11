import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';
import { useState } from 'react';

const meta: Meta<typeof Slider> = {
  title: 'Atomic Design/Atoms/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Interactive slider component for selecting numeric values from a range. Supports horizontal/vertical orientations, keyboard navigation, and full accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Current value (controlled mode)',
    },
    defaultValue: {
      control: 'number',
      description: 'Default value (uncontrolled mode)',
    },
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    step: {
      control: 'number',
      description: 'Step increment',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Color variant',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show value label',
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Label position',
    },
    showTicks: {
      control: 'boolean',
      description: 'Whether to show tick marks',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether slider is disabled',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation',
    },
    onChange: {
      action: 'changed',
      description: 'Change handler - called during dragging',
    },
    onValueCommit: {
      action: 'committed',
      description: 'Commit handler - called on mouse up',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

// Basic Examples
export const Default: Story = {
  args: {
    defaultValue: 50,
    'aria-label': 'Default slider',
  },
};

export const WithValueLabel: Story = {
  args: {
    defaultValue: 60,
    showValue: true,
    labelPosition: 'top',
    'aria-label': 'Slider with value label',
  },
};

export const WithTicks: Story = {
  args: {
    defaultValue: 50,
    showTicks: true,
    'aria-label': 'Slider with tick marks',
  },
};

// Size Variants
export const Small: Story = {
  args: {
    size: 'sm',
    defaultValue: 30,
    showValue: true,
    'aria-label': 'Small slider',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    defaultValue: 50,
    showValue: true,
    'aria-label': 'Medium slider',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    defaultValue: 70,
    showValue: true,
    'aria-label': 'Large slider',
  },
};

// Color Variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    defaultValue: 60,
    showValue: true,
    'aria-label': 'Primary slider',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    defaultValue: 40,
    showValue: true,
    'aria-label': 'Secondary slider',
  },
};

// Orientations
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    defaultValue: 50,
    showValue: true,
    labelPosition: 'top',
    'aria-label': 'Horizontal slider',
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    defaultValue: 50,
    showValue: true,
    labelPosition: 'right',
    'aria-label': 'Vertical slider',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center' }}>
        <Story />
      </div>
    ),
  ],
};

// Label Positions
export const LabelTop: Story = {
  args: {
    defaultValue: 50,
    showValue: true,
    labelPosition: 'top',
    'aria-label': 'Slider with top label',
  },
};

export const LabelBottom: Story = {
  args: {
    defaultValue: 50,
    showValue: true,
    labelPosition: 'bottom',
    'aria-label': 'Slider with bottom label',
  },
};

export const LabelLeft: Story = {
  args: {
    defaultValue: 50,
    showValue: true,
    labelPosition: 'left',
    'aria-label': 'Slider with left label',
  },
};

export const LabelRight: Story = {
  args: {
    defaultValue: 50,
    showValue: true,
    labelPosition: 'right',
    'aria-label': 'Slider with right label',
  },
};

// States
export const Disabled: Story = {
  args: {
    defaultValue: 50,
    disabled: true,
    showValue: true,
    'aria-label': 'Disabled slider',
  },
};

// Custom Ranges
export const CustomRange: Story = {
  args: {
    min: 10,
    max: 200,
    defaultValue: 75,
    step: 5,
    showValue: true,
    showTicks: true,
    'aria-label': 'Custom range slider',
  },
};

export const FineControl: Story = {
  args: {
    min: 0,
    max: 1,
    defaultValue: 0.5,
    step: 0.01,
    showValue: true,
    'aria-label': 'Fine control slider',
  },
};

// Interactive Controlled Example
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(50);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <Slider
          {...args}
          value={value}
          onChange={setValue}
          showValue
          aria-label="Controlled slider"
        />
        <div style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>
          Current value: {value}
        </div>
        <button
          onClick={() => setValue(75)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            cursor: 'pointer',
          }}
        >
          Set to 75
        </button>
      </div>
    );
  },
};

// Combined Features
export const AllFeatures: Story = {
  args: {
    defaultValue: 65,
    min: 0,
    max: 100,
    step: 5,
    size: 'lg',
    variant: 'primary',
    showValue: true,
    labelPosition: 'top',
    showTicks: true,
    'aria-label': 'Slider with all features',
  },
};

// Multiple Sliders
export const MultipleSliders: Story = {
  render: () => {
    const [volume, setVolume] = useState(50);
    const [brightness, setBrightness] = useState(75);
    const [contrast, setContrast] = useState(60);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', minWidth: '300px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Volume: {volume}%
          </label>
          <Slider
            value={volume}
            onChange={setVolume}
            variant="primary"
            showValue
            labelPosition="right"
            aria-label="Volume control"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Brightness: {brightness}%
          </label>
          <Slider
            value={brightness}
            onChange={setBrightness}
            variant="secondary"
            showValue
            labelPosition="right"
            aria-label="Brightness control"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Contrast: {contrast}%
          </label>
          <Slider
            value={contrast}
            onChange={setContrast}
            showValue
            labelPosition="right"
            aria-label="Contrast control"
          />
        </div>
      </div>
    );
  },
};

// Keyboard Navigation Demo
export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <Slider defaultValue={50} showValue aria-label="Keyboard navigation demo" />
      <div
        style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: 'hsl(var(--muted))',
          fontSize: '12px',
          maxWidth: '300px',
        }}
      >
        <strong>Keyboard Controls:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Arrow Left/Down: Decrease by step</li>
          <li>Arrow Right/Up: Increase by step</li>
          <li>Home: Go to minimum</li>
          <li>End: Go to maximum</li>
          <li>Page Up: Increase by 10× step</li>
          <li>Page Down: Decrease by 10× step</li>
        </ul>
      </div>
    </div>
  ),
};
