import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ServiceCardMolecule } from './ServiceCardMolecule';
import type { Service } from './ServiceCardMolecule.types';

expect.extend(toHaveNoViolations);

const mockService: Service = {
  id: '1',
  name: 'Test Service',
  categoryId: 'cat-1',
  thumbnail: 'https://example.com/image.jpg',
  requestTemplate: {
    fields: [
      { name: 'field1', type: 'text' },
      { name: 'field2', type: 'email' },
    ],
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  category: {
    id: 'cat-1',
    name: 'Test Category',
  },
};

describe('ServiceCardMolecule - Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders service name', () => {
      render(<ServiceCardMolecule service={mockService} />);
      expect(screen.getByText('Test Service')).toBeInTheDocument();
    });

    it('renders category name', () => {
      render(<ServiceCardMolecule service={mockService} />);
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });

    it('renders field count', () => {
      render(<ServiceCardMolecule service={mockService} />);
      expect(screen.getByText('2 fields in form template')).toBeInTheDocument();
    });

    it('renders singular "field" for count of 1', () => {
      const service = {
        ...mockService,
        requestTemplate: { fields: [{ name: 'field1', type: 'text' }] },
      };
      render(<ServiceCardMolecule service={service} />);
      expect(screen.getByText('1 field in form template')).toBeInTheDocument();
    });

    it('renders 0 fields when requestTemplate is null', () => {
      const service = { ...mockService, requestTemplate: null };
      render(<ServiceCardMolecule service={service} />);
      expect(screen.getByText('0 fields in form template')).toBeInTheDocument();
    });

    it('renders creation date', () => {
      render(<ServiceCardMolecule service={mockService} />);
      expect(screen.getByText(/created/i)).toBeInTheDocument();
    });

    it('has correct data-testid', () => {
      render(<ServiceCardMolecule service={mockService} />);
      expect(screen.getByTestId('service-card')).toBeInTheDocument();
    });
  });

  // 2. THUMBNAIL TESTS
  describe('Thumbnail', () => {
    it('renders thumbnail image when provided', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const img = screen.getByAlt('Test Service');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('renders Wrench icon when no thumbnail', () => {
      const service = { ...mockService, thumbnail: null };
      const { container } = render(<ServiceCardMolecule service={service} />);

      // Check for the wrench icon container
      const iconContainer = container.querySelector('.bg-blue-50');
      expect(iconContainer).toBeInTheDocument();
    });

    it('thumbnail has object-cover class', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const img = screen.getByAlt('Test Service');
      expect(img).toHaveClass('object-cover');
    });

    it('thumbnail container has rounded corners', () => {
      const { container } = render(<ServiceCardMolecule service={mockService} />);
      const imgContainer = container.querySelector('.overflow-hidden.rounded-lg');
      expect(imgContainer).toBeInTheDocument();
    });
  });

  // 3. EDIT BUTTON TESTS
  describe('Edit Button', () => {
    it('shows edit button by default', () => {
      render(<ServiceCardMolecule service={mockService} />);
      expect(screen.getByRole('button', { name: /edit service/i })).toBeInTheDocument();
    });

    it('hides edit button when showEdit is false', () => {
      render(<ServiceCardMolecule service={mockService} showEdit={false} />);
      expect(screen.queryByRole('button', { name: /edit service/i })).not.toBeInTheDocument();
    });

    it('calls onEdit callback when clicked', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      render(<ServiceCardMolecule service={mockService} onEdit={onEdit} />);

      const editButton = screen.getByRole('button', { name: /edit service/i });
      await user.click(editButton);

      expect(onEdit).toHaveBeenCalledWith(mockService);
    });

    it('edit button is disabled when deleting', () => {
      render(<ServiceCardMolecule service={mockService} isDeleting={true} />);
      const editButton = screen.getByRole('button', { name: /edit service/i });
      expect(editButton).toBeDisabled();
    });

    it('edit button has Edit icon', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const editButton = screen.getByRole('button', { name: /edit service/i });
      expect(editButton.querySelector('svg')).toBeInTheDocument();
    });
  });

  // 4. DELETE BUTTON TESTS
  describe('Delete Button', () => {
    it('shows delete button by default', () => {
      render(<ServiceCardMolecule service={mockService} />);
      expect(screen.getByRole('button', { name: /delete service/i })).toBeInTheDocument();
    });

    it('hides delete button when showDelete is false', () => {
      render(<ServiceCardMolecule service={mockService} showDelete={false} />);
      expect(screen.queryByRole('button', { name: /delete service/i })).not.toBeInTheDocument();
    });

    it('calls onDelete callback when clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      render(<ServiceCardMolecule service={mockService} onDelete={onDelete} />);

      const deleteButton = screen.getByRole('button', { name: /delete service/i });
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith(mockService);
    });

    it('shows loading spinner when isDeleting', () => {
      const { container } = render(
        <ServiceCardMolecule service={mockService} onDelete={vi.fn()} isDeleting={true} />
      );
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('delete button has red styling', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const deleteButton = screen.getByRole('button', { name: /delete service/i });
      expect(deleteButton).toHaveClass('text-red-600', 'hover:bg-red-50');
    });

    it('spinner has red border when deleting', () => {
      const { container } = render(
        <ServiceCardMolecule service={mockService} onDelete={vi.fn()} isDeleting={true} />
      );
      const spinner = container.querySelector('.border-t-red-600');
      expect(spinner).toBeInTheDocument();
    });
  });

  // 5. STYLING TESTS
  describe('Styling', () => {
    it('has border and shadow', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const card = screen.getByTestId('service-card');
      expect(card).toHaveClass('border', 'shadow-sm');
    });

    it('has hover shadow effect', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const card = screen.getByTestId('service-card');
      expect(card).toHaveClass('hover:shadow-md');
    });

    it('has rounded corners', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const card = screen.getByTestId('service-card');
      expect(card).toHaveClass('rounded-lg');
    });

    it('accepts custom className', () => {
      render(<ServiceCardMolecule service={mockService} className="custom-class" />);
      const card = screen.getByTestId('service-card');
      expect(card).toHaveClass('custom-class');
    });

    it('has transition classes', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const card = screen.getByTestId('service-card');
      expect(card).toHaveClass('transition-shadow');
    });
  });

  // 6. ICON TESTS
  describe('Icons', () => {
    it('shows Folder icon for category', () => {
      const { container } = render(<ServiceCardMolecule service={mockService} />);
      const categorySection = screen.getByText('Test Category').parentElement;
      expect(categorySection?.querySelector('svg')).toBeInTheDocument();
    });

    it('shows Wrench icon when no thumbnail', () => {
      const service = { ...mockService, thumbnail: null };
      const { container } = render(<ServiceCardMolecule service={service} />);
      const wrenchIcon = container.querySelector('.text-blue-600');
      expect(wrenchIcon).toBeInTheDocument();
    });
  });

  // 7. FIELD COUNT TESTS
  describe('Field Count', () => {
    it('displays 0 fields when fields array is empty', () => {
      const service = { ...mockService, requestTemplate: { fields: [] } };
      render(<ServiceCardMolecule service={service} />);
      expect(screen.getByText('0 fields in form template')).toBeInTheDocument();
    });

    it('displays correct count for multiple fields', () => {
      const service = {
        ...mockService,
        requestTemplate: {
          fields: [
            { name: 'f1', type: 'text' },
            { name: 'f2', type: 'text' },
            { name: 'f3', type: 'text' },
          ],
        },
      };
      render(<ServiceCardMolecule service={service} />);
      expect(screen.getByText('3 fields in form template')).toBeInTheDocument();
    });

    it('handles missing fields array', () => {
      const service = { ...mockService, requestTemplate: {} };
      render(<ServiceCardMolecule service={service} />);
      expect(screen.getByText('0 fields in form template')).toBeInTheDocument();
    });
  });

  // 8. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ServiceCardMolecule service={mockService} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('edit button has proper aria-label', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const editButton = screen.getByRole('button', { name: 'Edit service' });
      expect(editButton).toHaveAttribute('aria-label', 'Edit service');
    });

    it('delete button has proper aria-label', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const deleteButton = screen.getByRole('button', { name: 'Delete service' });
      expect(deleteButton).toHaveAttribute('aria-label', 'Delete service');
    });

    it('thumbnail has alt text', () => {
      render(<ServiceCardMolecule service={mockService} />);
      const img = screen.getByAlt('Test Service');
      expect(img).toBeInTheDocument();
    });
  });

  // 9. EDGE CASES
  describe('Edge Cases', () => {
    it('handles very long service names', () => {
      const service = { ...mockService, name: 'A'.repeat(100) };
      render(<ServiceCardMolecule service={service} />);
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('handles very long category names', () => {
      const service = {
        ...mockService,
        category: { id: 'cat-1', name: 'B'.repeat(100) },
      };
      render(<ServiceCardMolecule service={service} />);
      expect(screen.getByText('B'.repeat(100))).toBeInTheDocument();
    });

    it('handles large field count', () => {
      const fields = Array(50).fill(null).map((_, i) => ({ name: `field${i}`, type: 'text' }));
      const service = { ...mockService, requestTemplate: { fields } };
      render(<ServiceCardMolecule service={service} />);
      expect(screen.getByText('50 fields in form template')).toBeInTheDocument();
    });

    it('handles both buttons hidden', () => {
      render(
        <ServiceCardMolecule
          service={mockService}
          showEdit={false}
          showDelete={false}
        />
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles missing onEdit callback', () => {
      render(<ServiceCardMolecule service={mockService} showEdit={true} />);
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    });

    it('handles missing onDelete callback', () => {
      render(<ServiceCardMolecule service={mockService} showDelete={true} />);
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });
  });

  // 10. INTEGRATION TESTS
  describe('Integration', () => {
    it('works in a grid layout', () => {
      const services = [
        { ...mockService, id: '1', name: 'Service 1' },
        { ...mockService, id: '2', name: 'Service 2' },
        { ...mockService, id: '3', name: 'Service 3' },
      ];

      render(
        <div className="grid grid-cols-3 gap-4">
          {services.map((svc) => (
            <ServiceCardMolecule key={svc.id} service={svc} />
          ))}
        </div>
      );

      expect(screen.getByText('Service 1')).toBeInTheDocument();
      expect(screen.getByText('Service 2')).toBeInTheDocument();
      expect(screen.getByText('Service 3')).toBeInTheDocument();
    });

    it('maintains state across multiple instances', async () => {
      const user = userEvent.setup();
      const onEdit1 = vi.fn();
      const onEdit2 = vi.fn();

      render(
        <div>
          <ServiceCardMolecule
            service={{ ...mockService, id: '1', name: 'Svc 1' }}
            onEdit={onEdit1}
          />
          <ServiceCardMolecule
            service={{ ...mockService, id: '2', name: 'Svc 2' }}
            onEdit={onEdit2}
          />
        </div>
      );

      const editButtons = screen.getAllByRole('button', { name: /edit service/i });
      await user.click(editButtons[0]);

      expect(onEdit1).toHaveBeenCalled();
      expect(onEdit2).not.toHaveBeenCalled();
    });

    it('works with mixed thumbnail states', () => {
      render(
        <div>
          <ServiceCardMolecule
            service={{ ...mockService, id: '1', thumbnail: 'https://example.com/1.jpg' }}
          />
          <ServiceCardMolecule
            service={{ ...mockService, id: '2', thumbnail: null }}
          />
        </div>
      );

      expect(screen.getByAlt('Test Service')).toBeInTheDocument();
    });
  });
});
