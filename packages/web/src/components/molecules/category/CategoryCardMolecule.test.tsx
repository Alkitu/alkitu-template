import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CategoryCardMolecule } from './CategoryCardMolecule';
import type { Category } from './CategoryCardMolecule.types';

expect.extend(toHaveNoViolations);

const mockCategory: Category = {
  id: '1',
  name: 'Test Category',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  _count: {
    services: 5,
  },
};

describe('CategoryCardMolecule - Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders category name', () => {
      render(<CategoryCardMolecule category={mockCategory} />);
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });

    it('renders service count', () => {
      render(<CategoryCardMolecule category={mockCategory} />);
      expect(screen.getByText('5 services')).toBeInTheDocument();
    });

    it('renders singular "service" for count of 1', () => {
      const category = { ...mockCategory, _count: { services: 1 } };
      render(<CategoryCardMolecule category={category} />);
      expect(screen.getByText('1 service')).toBeInTheDocument();
    });

    it('renders creation date', () => {
      render(<CategoryCardMolecule category={mockCategory} />);
      expect(screen.getByText(/created/i)).toBeInTheDocument();
    });

    it('renders folder icon', () => {
      const { container } = render(<CategoryCardMolecule category={mockCategory} />);
      const folderIcon = container.querySelector('svg');
      expect(folderIcon).toBeInTheDocument();
    });

    it('has correct data-testid', () => {
      render(<CategoryCardMolecule category={mockCategory} />);
      expect(screen.getByTestId('category-card')).toBeInTheDocument();
    });
  });

  // 2. EDIT BUTTON TESTS
  describe('Edit Button', () => {
    it('shows edit button when onEdit is provided', () => {
      render(<CategoryCardMolecule category={mockCategory} onEdit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /edit category/i })).toBeInTheDocument();
    });

    it('hides edit button when showEdit is false', () => {
      render(<CategoryCardMolecule category={mockCategory} showEdit={false} />);
      expect(screen.queryByRole('button', { name: /edit category/i })).not.toBeInTheDocument();
    });

    it('calls onEdit callback when clicked', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      render(<CategoryCardMolecule category={mockCategory} onEdit={onEdit} />);

      const editButton = screen.getByRole('button', { name: /edit category/i });
      await user.click(editButton);

      expect(onEdit).toHaveBeenCalledWith(mockCategory);
    });

    it('edit button is disabled when deleting', () => {
      render(<CategoryCardMolecule category={mockCategory} onEdit={vi.fn()} isDeleting={true} />);
      const editButton = screen.getByRole('button', { name: /edit category/i });
      expect(editButton).toBeDisabled();
    });

    it('edit button has Edit icon', () => {
      const { container } = render(<CategoryCardMolecule category={mockCategory} onEdit={vi.fn()} />);
      const editButton = screen.getByRole('button', { name: /edit category/i });
      expect(editButton.querySelector('svg')).toBeInTheDocument();
    });
  });

  // 3. DELETE BUTTON TESTS
  describe('Delete Button', () => {
    it('shows delete button when onDelete is provided', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      render(<CategoryCardMolecule category={category} onDelete={vi.fn()} />);
      expect(screen.getByRole('button', { name: /delete category/i })).toBeInTheDocument();
    });

    it('hides delete button when showDelete is false', () => {
      render(<CategoryCardMolecule category={mockCategory} showDelete={false} />);
      expect(screen.queryByRole('button', { name: /delete category/i })).not.toBeInTheDocument();
    });

    it('calls onDelete callback when clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const category = { ...mockCategory, _count: { services: 0 } };

      render(<CategoryCardMolecule category={category} onDelete={onDelete} />);

      const deleteButton = screen.getByRole('button', { name: /delete category/i });
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith(category);
    });

    it('delete button is disabled when category has services', () => {
      render(<CategoryCardMolecule category={mockCategory} onDelete={vi.fn()} />);
      const deleteButton = screen.getByRole('button', {
        name: /cannot delete category with services/i,
      });
      expect(deleteButton).toBeDisabled();
    });

    it('delete button is enabled when category has no services', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      render(<CategoryCardMolecule category={category} onDelete={vi.fn()} />);
      const deleteButton = screen.getByRole('button', { name: /delete category/i });
      expect(deleteButton).not.toBeDisabled();
    });

    it('shows loading spinner when isDeleting', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      const { container } = render(
        <CategoryCardMolecule category={category} onDelete={vi.fn()} isDeleting={true} />
      );
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('delete button has proper title when category has services', () => {
      render(<CategoryCardMolecule category={mockCategory} onDelete={vi.fn()} />);
      const deleteButton = screen.getByRole('button', {
        name: /cannot delete category with services/i,
      });
      expect(deleteButton).toHaveAttribute(
        'title',
        'Cannot delete category with services. Delete or reassign services first.'
      );
    });
  });

  // 4. SERVICE COUNT TESTS
  describe('Service Count', () => {
    it('shows 0 services when _count is undefined', () => {
      const category = { ...mockCategory, _count: undefined };
      render(<CategoryCardMolecule category={category} />);
      expect(screen.getByText('0 services')).toBeInTheDocument();
    });

    it('displays correct count for multiple services', () => {
      const category = { ...mockCategory, _count: { services: 10 } };
      render(<CategoryCardMolecule category={category} />);
      expect(screen.getByText('10 services')).toBeInTheDocument();
    });

    it('shows Package icon for service count', () => {
      const { container } = render(<CategoryCardMolecule category={mockCategory} />);
      const serviceCountSection = screen.getByText(/services/).parentElement;
      expect(serviceCountSection?.querySelector('svg')).toBeInTheDocument();
    });
  });

  // 5. STYLING TESTS
  describe('Styling', () => {
    it('has border and shadow', () => {
      const { container } = render(<CategoryCardMolecule category={mockCategory} />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveClass('border', 'shadow-sm');
    });

    it('has hover shadow effect', () => {
      const { container } = render(<CategoryCardMolecule category={mockCategory} />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveClass('hover:shadow-md');
    });

    it('has rounded corners', () => {
      const { container } = render(<CategoryCardMolecule category={mockCategory} />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveClass('rounded-lg');
    });

    it('accepts custom className', () => {
      render(<CategoryCardMolecule category={mockCategory} className="custom-class" />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveClass('custom-class');
    });

    it('icon container has indigo background', () => {
      const { container } = render(<CategoryCardMolecule category={mockCategory} />);
      const iconContainer = container.querySelector('.bg-indigo-50');
      expect(iconContainer).toBeInTheDocument();
    });

    it('delete button has red styling', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      render(<CategoryCardMolecule category={category} onDelete={vi.fn()} />);
      const deleteButton = screen.getByRole('button', { name: /delete category/i });
      expect(deleteButton).toHaveClass('text-red-600', 'hover:bg-red-50');
    });
  });

  // 6. DATE FORMATTING TESTS
  describe('Date Formatting', () => {
    it('formats creation date correctly', () => {
      const category = {
        ...mockCategory,
        createdAt: '2024-06-15T12:00:00.000Z',
      };
      render(<CategoryCardMolecule category={category} />);
      expect(screen.getByText(/created/i)).toBeInTheDocument();
    });

    it('handles different date formats', () => {
      const category = {
        ...mockCategory,
        createdAt: '2023-12-25T00:00:00.000Z',
      };
      render(<CategoryCardMolecule category={category} />);
      expect(screen.getByText(/created/i)).toBeInTheDocument();
    });
  });

  // 7. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<CategoryCardMolecule category={mockCategory} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('edit button has proper aria-label', () => {
      render(<CategoryCardMolecule category={mockCategory} onEdit={vi.fn()} />);
      const editButton = screen.getByRole('button', { name: 'Edit category' });
      expect(editButton).toHaveAttribute('aria-label', 'Edit category');
    });

    it('delete button has contextual aria-label when category has services', () => {
      render(<CategoryCardMolecule category={mockCategory} onDelete={vi.fn()} />);
      const deleteButton = screen.getByRole('button', {
        name: 'Cannot delete category with services',
      });
      expect(deleteButton).toHaveAttribute(
        'aria-label',
        'Cannot delete category with services'
      );
    });

    it('delete button has proper aria-label when category has no services', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      render(<CategoryCardMolecule category={category} onDelete={vi.fn()} />);
      const deleteButton = screen.getByRole('button', { name: 'Delete category' });
      expect(deleteButton).toHaveAttribute('aria-label', 'Delete category');
    });
  });

  // 8. EDGE CASES
  describe('Edge Cases', () => {
    it('handles very long category names', () => {
      const category = {
        ...mockCategory,
        name: 'A'.repeat(100),
      };
      render(<CategoryCardMolecule category={category} />);
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('handles category with 0 services', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      render(<CategoryCardMolecule category={category} />);
      expect(screen.getByText('0 services')).toBeInTheDocument();
    });

    it('handles very large service count', () => {
      const category = { ...mockCategory, _count: { services: 9999 } };
      render(<CategoryCardMolecule category={category} />);
      expect(screen.getByText('9999 services')).toBeInTheDocument();
    });

    it('handles missing _count object', () => {
      const category = { ...mockCategory, _count: undefined };
      render(<CategoryCardMolecule category={category} />);
      expect(screen.getByText('0 services')).toBeInTheDocument();
    });

    it('handles both buttons hidden', () => {
      render(
        <CategoryCardMolecule
          category={mockCategory}
          showEdit={false}
          showDelete={false}
        />
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles missing onEdit callback', () => {
      render(<CategoryCardMolecule category={mockCategory} showEdit={true} />);
      // Button should not render if no callback provided
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    });

    it('handles missing onDelete callback', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      render(<CategoryCardMolecule category={category} showDelete={true} />);
      // Button should not render if no callback provided
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });
  });

  // 9. INTERACTION TESTS
  describe('Interactions', () => {
    it('edit button click does not trigger when disabled', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      render(<CategoryCardMolecule category={mockCategory} onEdit={onEdit} isDeleting={true} />);

      const editButton = screen.getByRole('button', { name: /edit category/i });
      await user.click(editButton);

      expect(onEdit).not.toHaveBeenCalled();
    });

    it('delete button shows spinner during deletion', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      const { container } = render(
        <CategoryCardMolecule category={category} onDelete={vi.fn()} isDeleting={true} />
      );

      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('border-t-red-600');
    });
  });

  // 10. INTEGRATION TESTS
  describe('Integration', () => {
    it('works in a grid layout', () => {
      const categories = [
        { ...mockCategory, id: '1', name: 'Category 1' },
        { ...mockCategory, id: '2', name: 'Category 2' },
        { ...mockCategory, id: '3', name: 'Category 3' },
      ];

      render(
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCardMolecule key={cat.id} category={cat} />
          ))}
        </div>
      );

      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
      expect(screen.getByText('Category 3')).toBeInTheDocument();
    });

    it('maintains state across multiple instances', async () => {
      const user = userEvent.setup();
      const onEdit1 = vi.fn();
      const onEdit2 = vi.fn();

      render(
        <div>
          <CategoryCardMolecule
            category={{ ...mockCategory, id: '1', name: 'Cat 1' }}
            onEdit={onEdit1}
          />
          <CategoryCardMolecule
            category={{ ...mockCategory, id: '2', name: 'Cat 2' }}
            onEdit={onEdit2}
          />
        </div>
      );

      const editButtons = screen.getAllByRole('button', { name: /edit category/i });
      await user.click(editButtons[0]);

      expect(onEdit1).toHaveBeenCalled();
      expect(onEdit2).not.toHaveBeenCalled();
    });
  });
});
