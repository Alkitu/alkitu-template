import type { Meta, StoryObj } from '@storybook/react';
import { User, Star, Tag, Settings, Heart, Mail } from 'lucide-react';
import { ChipMolecule } from './ChipMolecule';
import { useState } from 'react';

const meta = {
  title: 'Atomic Design/Molecules/ChipMolecule',
  component: ChipMolecule,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ChipMolecule is a compact element that represents input, attribute, or action. It can be clickable, removable, and display icons or avatars. Perfect for tags, filters, and selections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'accent', 'destructive', 'warning', 'success', 'outline'],
      description: 'Visual variant of the chip',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the chip',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    removable: {
      control: 'boolean',
      description: 'Whether the chip can be removed',
      table: {
        defaultValue: { summary: false },
      },
    },
    selected: {
      control: 'boolean',
      description: 'Whether the chip is selected/active',
      table: {
        defaultValue: { summary: false },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the chip is disabled',
      table: {
        defaultValue: { summary: false },
      },
    },
    children: {
      control: 'text',
      description: 'Content of the chip',
    },
  },
} satisfies Meta<typeof ChipMolecule>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Chip',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ChipMolecule variant="default">Default</ChipMolecule>
      <ChipMolecule variant="primary">Primary</ChipMolecule>
      <ChipMolecule variant="secondary">Secondary</ChipMolecule>
      <ChipMolecule variant="accent">Accent</ChipMolecule>
      <ChipMolecule variant="destructive">Destructive</ChipMolecule>
      <ChipMolecule variant="warning">Warning</ChipMolecule>
      <ChipMolecule variant="success">Success</ChipMolecule>
      <ChipMolecule variant="outline">Outline</ChipMolecule>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available chip variants with different semantic colors.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ChipMolecule size="sm" variant="primary">
        Small
      </ChipMolecule>
      <ChipMolecule size="md" variant="primary">
        Medium
      </ChipMolecule>
      <ChipMolecule size="lg" variant="primary">
        Large
      </ChipMolecule>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Three size variants: small, medium (default), and large.',
      },
    },
  },
};

export const WithStartIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ChipMolecule startIcon={User} variant="secondary">
        User
      </ChipMolecule>
      <ChipMolecule startIcon={Star} variant="warning">
        Favorite
      </ChipMolecule>
      <ChipMolecule startIcon={Tag} variant="accent">
        Tagged
      </ChipMolecule>
      <ChipMolecule startIcon={Mail} variant="primary">
        Email
      </ChipMolecule>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chips with icons at the start position.',
      },
    },
  },
};

export const WithEndIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ChipMolecule endIcon={Settings} variant="outline">
        Settings
      </ChipMolecule>
      <ChipMolecule endIcon={Star} variant="warning">
        Premium
      </ChipMolecule>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chips with icons at the end position.',
      },
    },
  },
};

export const WithBothIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ChipMolecule startIcon={Heart} endIcon={Star} variant="destructive">
        Love & Star
      </ChipMolecule>
      <ChipMolecule startIcon={User} endIcon={Settings} variant="primary">
        User Settings
      </ChipMolecule>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chips with icons on both sides.',
      },
    },
  },
};

export const WithAvatar: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ChipMolecule
        avatar={
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
            A
          </div>
        }
        variant="primary"
      >
        Alice Johnson
      </ChipMolecule>
      <ChipMolecule
        avatar={
          <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs">
            B
          </div>
        }
        variant="secondary"
      >
        Bob Smith
      </ChipMolecule>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chips with custom avatar elements.',
      },
    },
  },
};

export const Removable: Story = {
  render: () => {
    const [chips, setChips] = useState(['React', 'TypeScript', 'Next.js', 'Tailwind']);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <ChipMolecule
              key={chip}
              variant="primary"
              removable
              onRemove={() => setChips(chips.filter((c) => c !== chip))}
            >
              {chip}
            </ChipMolecule>
          ))}
          {chips.length === 0 && (
            <p className="text-muted-foreground text-sm">All chips removed!</p>
          )}
        </div>
        <button
          onClick={() => setChips(['React', 'TypeScript', 'Next.js', 'Tailwind'])}
          className="text-sm text-primary hover:underline"
        >
          Reset chips
        </button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Chips that can be removed by clicking the X button.',
      },
    },
  },
};

export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['chip2']);

    const toggleChip = (chipId: string) => {
      setSelected((prev) =>
        prev.includes(chipId) ? prev.filter((id) => id !== chipId) : [...prev, chipId]
      );
    };

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'chip1', label: 'Option 1', variant: 'primary' as const },
            { id: 'chip2', label: 'Option 2', variant: 'secondary' as const },
            { id: 'chip3', label: 'Option 3', variant: 'accent' as const },
            { id: 'chip4', label: 'Option 4', variant: 'success' as const },
          ].map((chip) => (
            <ChipMolecule
              key={chip.id}
              variant={chip.variant}
              selected={selected.includes(chip.id)}
              onClick={() => toggleChip(chip.id)}
            >
              {chip.label}
            </ChipMolecule>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Chips that can be selected/deselected by clicking. Selected state changes the appearance.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ChipMolecule variant="primary">Normal</ChipMolecule>
      <ChipMolecule variant="primary" selected>
        Selected
      </ChipMolecule>
      <ChipMolecule variant="primary" disabled>
        Disabled
      </ChipMolecule>
      <ChipMolecule variant="primary" disabled selected>
        Disabled + Selected
      </ChipMolecule>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different states of chips: normal, selected, disabled, and combinations.',
      },
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleCategory = (categoryId: string) => {
      setSelected((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
    };

    const categories = [
      { id: 'frontend', label: 'Frontend', icon: Star },
      { id: 'backend', label: 'Backend', icon: Settings },
      { id: 'mobile', label: 'Mobile', icon: User },
      { id: 'design', label: 'Design', icon: Heart },
    ];

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Click to filter categories:</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <ChipMolecule
              key={category.id}
              variant="outline"
              startIcon={category.icon}
              selected={selected.includes(category.id)}
              onClick={() => toggleCategory(category.id)}
            >
              {category.label}
            </ChipMolecule>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">Active filters: {selected.join(', ')}</p>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing chips used as filters with icons.',
      },
    },
  },
};

export const AllSizesWithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ChipMolecule size="sm" startIcon={User} variant="primary">
          Small
        </ChipMolecule>
        <ChipMolecule size="sm" startIcon={User} variant="primary" removable onRemove={() => {}}>
          Small Removable
        </ChipMolecule>
      </div>
      <div className="flex items-center gap-3">
        <ChipMolecule size="md" startIcon={Star} variant="secondary">
          Medium
        </ChipMolecule>
        <ChipMolecule size="md" startIcon={Star} variant="secondary" removable onRemove={() => {}}>
          Medium Removable
        </ChipMolecule>
      </div>
      <div className="flex items-center gap-3">
        <ChipMolecule size="lg" startIcon={Heart} variant="accent">
          Large
        </ChipMolecule>
        <ChipMolecule size="lg" startIcon={Heart} variant="accent" removable onRemove={() => {}}>
          Large Removable
        </ChipMolecule>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All sizes with icons and removable options.',
      },
    },
  },
};

export const LongContent: Story = {
  render: () => (
    <div className="space-y-3 max-w-xs">
      <ChipMolecule variant="primary">
        Very long chip content that should be truncated automatically
      </ChipMolecule>
      <ChipMolecule variant="secondary" startIcon={User}>
        Very long chip with icon that should also be truncated
      </ChipMolecule>
      <ChipMolecule variant="accent" removable onRemove={() => {}}>
        Long removable chip content that gets truncated
      </ChipMolecule>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chips automatically truncate long content with ellipsis.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Playground Chip',
    variant: 'primary',
    size: 'md',
    removable: false,
    selected: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all chip props and combinations.',
      },
    },
  },
};
