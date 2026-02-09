import type { Meta, StoryObj } from '@storybook/react';
import { Star, Heart, Folder, BookOpen, Briefcase, Code } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import type { Category } from './CategoryCard.types';

const meta: Meta<typeof CategoryCard> = {
  title: 'Molecules/CategoryCard',
  component: CategoryCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
CategoryCard is a molecule component for displaying category information in a card format.

## Features
- Category name and description
- Service count badge with icon
- Customizable category icon with color variants
- Edit and delete action buttons
- Loading state for async operations
- Clickable card with onClick handler
- Creation date display
- Hover effects and transitions
- Full accessibility support
- Theme integration with CSS variables

## Usage
\`\`\`tsx
<CategoryCard
  category={category}
  showCount
  showDate
  showEdit
  showDelete
  onEdit={(cat) => handleEdit(cat)}
  onDelete={(cat) => handleDelete(cat)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    category: {
      control: 'object',
      description: 'Category data to display',
    },
    icon: {
      control: false,
      description: 'Custom icon (defaults to Folder)',
    },
    iconVariant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'],
      description: 'Icon color variant',
    },
    showEdit: {
      control: 'boolean',
      description: 'Show edit button',
    },
    showDelete: {
      control: 'boolean',
      description: 'Show delete button',
    },
    showCount: {
      control: 'boolean',
      description: 'Show service count badge',
    },
    showDate: {
      control: 'boolean',
      description: 'Show creation date',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when card is clicked',
    },
    onEdit: {
      action: 'edit',
      description: 'Callback when edit button is clicked',
    },
    onDelete: {
      action: 'delete',
      description: 'Callback when delete button is clicked',
    },
    isDeleting: {
      control: 'boolean',
      description: 'Loading state for delete operation',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CategoryCard>;

const baseCategory: Category = {
  id: '1',
  name: 'Engineering',
  description: 'Software development and engineering services',
  createdAt: '2024-01-15T10:00:00.000Z',
  updatedAt: '2024-01-15T10:00:00.000Z',
  _count: {
    services: 12,
  },
};

// 1. DEFAULT STORY
export const Default: Story = {
  args: {
    category: baseCategory,
    showCount: true,
    showDate: true,
  },
};

// 2. WITH CUSTOM ICON
export const WithCustomIcon: Story = {
  args: {
    category: {
      ...baseCategory,
      name: 'Favorites',
      description: 'Your favorite services and categories',
    },
    icon: <Star className="h-5 w-5" />,
    iconVariant: 'warning',
    showCount: true,
    showDate: true,
  },
};

// 3. WITH ACTIONS
export const WithActions: Story = {
  args: {
    category: baseCategory,
    showEdit: true,
    showDelete: true,
    showCount: true,
    showDate: true,
  },
};

// 4. CLICKABLE CARD
export const ClickableCard: Story = {
  args: {
    category: baseCategory,
    onClick: (cat) => alert(`Clicked: ${cat.name}`),
    showCount: true,
    showDate: true,
  },
};

// 5. WITH SINGLE SERVICE
export const WithSingleService: Story = {
  args: {
    category: {
      ...baseCategory,
      name: 'New Category',
      description: 'A newly created category',
      _count: { services: 1 },
    },
    showCount: true,
    showDate: true,
  },
};

// 6. WITH NO SERVICES
export const WithNoServices: Story = {
  args: {
    category: {
      ...baseCategory,
      name: 'Empty Category',
      description: 'This category has no services yet',
      _count: { services: 0 },
    },
    showCount: true,
    showDate: true,
    showEdit: true,
    showDelete: true,
  },
};

// 7. LOADING STATE
export const LoadingState: Story = {
  args: {
    category: baseCategory,
    showEdit: true,
    showDelete: true,
    isDeleting: true,
    showCount: true,
    showDate: true,
  },
};

// 8. DISABLED STATE
export const DisabledState: Story = {
  args: {
    category: baseCategory,
    disabled: true,
    showEdit: true,
    showDelete: true,
    showCount: true,
    showDate: true,
  },
};

// 9. WITHOUT DESCRIPTION
export const WithoutDescription: Story = {
  args: {
    category: {
      ...baseCategory,
      description: undefined,
    },
    showCount: true,
    showDate: true,
  },
};

// 10. MINIMAL (NO EXTRAS)
export const Minimal: Story = {
  args: {
    category: baseCategory,
    showCount: false,
    showDate: false,
  },
};

// 11. ICON VARIANTS SHOWCASE
export const IconVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-4xl">
      <CategoryCard
        category={{ ...baseCategory, name: 'Primary Category' }}
        iconVariant="primary"
        showCount
      />
      <CategoryCard
        category={{ ...baseCategory, name: 'Secondary Category' }}
        iconVariant="secondary"
        showCount
      />
      <CategoryCard
        category={{ ...baseCategory, name: 'Success Category' }}
        iconVariant="success"
        icon={<Heart className="h-5 w-5" />}
        showCount
      />
      <CategoryCard
        category={{ ...baseCategory, name: 'Warning Category' }}
        iconVariant="warning"
        icon={<Star className="h-5 w-5" />}
        showCount
      />
      <CategoryCard
        category={{ ...baseCategory, name: 'Error Category' }}
        iconVariant="error"
        showCount
      />
      <CategoryCard
        category={{ ...baseCategory, name: 'Default Category' }}
        iconVariant="default"
        showCount
      />
    </div>
  ),
};

// 12. GRID LAYOUT EXAMPLE
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CategoryCard
        category={{
          ...baseCategory,
          id: '1',
          name: 'Engineering',
          _count: { services: 24 },
        }}
        icon={<Code className="h-5 w-5" />}
        iconVariant="primary"
        showEdit
        showDelete
        showCount
      />
      <CategoryCard
        category={{
          ...baseCategory,
          id: '2',
          name: 'Business',
          description: 'Business consulting and strategy services',
          _count: { services: 18 },
        }}
        icon={<Briefcase className="h-5 w-5" />}
        iconVariant="success"
        showEdit
        showDelete
        showCount
      />
      <CategoryCard
        category={{
          ...baseCategory,
          id: '3',
          name: 'Education',
          description: 'Training and educational programs',
          _count: { services: 32 },
        }}
        icon={<BookOpen className="h-5 w-5" />}
        iconVariant="warning"
        showEdit
        showDelete
        showCount
      />
    </div>
  ),
};

// 13. LIST LAYOUT EXAMPLE
export const ListLayout: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-2xl">
      <CategoryCard
        category={{
          ...baseCategory,
          name: 'Design',
          _count: { services: 15 },
        }}
        icon={<Star className="h-5 w-5" />}
        iconVariant="primary"
        showEdit
        showDelete
        showCount
        showDate
      />
      <CategoryCard
        category={{
          ...baseCategory,
          name: 'Marketing',
          description: 'Marketing and advertising services',
          _count: { services: 22 },
        }}
        icon={<Heart className="h-5 w-5" />}
        iconVariant="success"
        showEdit
        showDelete
        showCount
        showDate
      />
      <CategoryCard
        category={{
          ...baseCategory,
          name: 'Support',
          description: 'Customer support and help desk services',
          _count: { services: 8 },
        }}
        iconVariant="secondary"
        showEdit
        showDelete
        showCount
        showDate
      />
    </div>
  ),
};

// 14. INTERACTIVE EXAMPLE
export const InteractiveExample: Story = {
  render: () => {
    const [categories, setCategories] = React.useState([
      {
        ...baseCategory,
        id: '1',
        name: 'Frontend',
        description: 'Frontend development services',
        _count: { services: 10 },
      },
      {
        ...baseCategory,
        id: '2',
        name: 'Backend',
        description: 'Backend development services',
        _count: { services: 15 },
      },
      {
        ...baseCategory,
        id: '3',
        name: 'Mobile',
        description: 'Mobile app development',
        _count: { services: 8 },
      },
    ]);

    const handleEdit = (category: Category) => {
      alert(`Edit category: ${category.name}`);
    };

    const handleDelete = (category: Category) => {
      if (confirm(`Delete category "${category.name}"?`)) {
        setCategories((prev) => prev.filter((c) => c.id !== category.id));
      }
    };

    const handleClick = (category: Category) => {
      console.log(`Clicked category: ${category.name}`);
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            showEdit
            showDelete
            showCount
            showDate
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClick={handleClick}
            icon={<Code className="h-5 w-5" />}
            iconVariant="primary"
          />
        ))}
      </div>
    );
  },
};

// 15. LONG CONTENT
export const LongContent: Story = {
  args: {
    category: {
      ...baseCategory,
      name: 'Very Long Category Name That Will Be Truncated',
      description:
        'This is a very long description that will be clamped to two lines. It contains a lot of text to demonstrate how the component handles overflow content gracefully.',
      _count: { services: 999 },
    },
    showEdit: true,
    showDelete: true,
    showCount: true,
    showDate: true,
  },
};

// Add React import for interactive example
import React from 'react';
