import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EmployeeAssignmentButton } from './EmployeeAssignmentButton';
import type { Employee } from './EmployeeAssignmentButton.types';

const meta = {
  title: 'Molecules/Alianza/EmployeeAssignmentButton',
  component: EmployeeAssignmentButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A dropdown button component for assigning employees to tasks or requests. Supports search, unassignment, and various states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: 'List of employee names or Employee objects',
      control: 'object',
    },
    defaultAssigned: {
      description: 'Currently assigned employee name',
      control: 'text',
    },
    onAssign: {
      description: 'Callback when employee is assigned or unassigned',
      action: 'assigned',
    },
    disabled: {
      description: 'Disables the button',
      control: 'boolean',
    },
    isLoading: {
      description: 'Shows loading state',
      control: 'boolean',
    },
    error: {
      description: 'Error message to display',
      control: 'text',
    },
    placeholder: {
      description: 'Placeholder text when unassigned',
      control: 'text',
    },
    searchable: {
      description: 'Enables search/filter in dropdown',
      control: 'boolean',
    },
    className: {
      description: 'Custom CSS class',
      control: 'text',
    },
  },
  args: {
    onAssign: fn(),
  },
} satisfies Meta<typeof EmployeeAssignmentButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default unassigned state
export const Default: Story = {
  args: {},
};

// Assigned state
export const Assigned: Story = {
  args: {
    defaultAssigned: 'Alejandro G.',
  },
};

// Custom placeholder
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Seleccionar empleado',
  },
};

// Custom employee options
export const CustomEmployees: Story = {
  args: {
    options: [
      'Ana García',
      'Carlos Rodríguez',
      'Diana López',
      'Eduardo Martínez',
      'Fernanda Torres',
    ],
  },
};

// With search enabled
export const WithSearch: Story = {
  args: {
    searchable: true,
    options: [
      'Ana García',
      'Carlos Rodríguez',
      'Diana López',
      'Eduardo Martínez',
      'Fernanda Torres',
      'Gabriela Sánchez',
      'Héctor Ramírez',
      'Isabel Morales',
      'Javier Herrera',
      'Karla Jiménez',
    ],
  },
};

// Loading state
export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

// Disabled state (unassigned)
export const DisabledUnassigned: Story = {
  args: {
    disabled: true,
  },
};

// Disabled state (assigned)
export const DisabledAssigned: Story = {
  args: {
    disabled: true,
    defaultAssigned: 'Maria P.',
  },
};

// Error state
export const WithError: Story = {
  args: {
    error: 'No se pudieron cargar los empleados',
  },
};

// Empty state (no employees)
export const EmptyState: Story = {
  args: {
    options: [],
  },
};

// Single employee
export const SingleEmployee: Story = {
  args: {
    options: ['Juan Pérez'],
  },
};

// Long employee names
export const LongNames: Story = {
  args: {
    options: [
      'Dr. María Fernanda García-López de la Torre',
      'Ing. José Antonio Rodríguez Martínez',
      'Lic. Ana Isabel Sánchez Hernández',
    ],
  },
};

// With Employee objects
export const WithEmployeeObjects: Story = {
  args: {
    options: [
      { id: '1', name: 'Ana García', role: 'Manager', department: 'Sales' },
      { id: '2', name: 'Carlos Rodríguez', role: 'Developer', department: 'Engineering' },
      { id: '3', name: 'Diana López', role: 'Designer', department: 'Design' },
      { id: '4', name: 'Eduardo Martínez', role: 'Analyst', department: 'Finance' },
    ] as Employee[],
  },
};

// Assigned with search
export const AssignedWithSearch: Story = {
  args: {
    defaultAssigned: 'Carlos Rodríguez',
    searchable: true,
    options: [
      'Ana García',
      'Carlos Rodríguez',
      'Diana López',
      'Eduardo Martínez',
      'Fernanda Torres',
    ],
  },
};

// Many employees (scrollable)
export const ManyEmployees: Story = {
  args: {
    searchable: true,
    options: Array.from({ length: 20 }, (_, i) => `Employee ${i + 1}`),
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    searchable: true,
    options: [
      'Alejandro González',
      'Beatriz Fernández',
      'Carlos Mendoza',
      'Diana Vargas',
      'Eduardo Rojas',
      'Fernanda Castro',
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive employee assignment button. Try searching, selecting, and unassigning employees.',
      },
    },
  },
};
