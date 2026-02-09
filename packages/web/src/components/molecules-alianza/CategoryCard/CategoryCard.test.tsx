import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Star, Heart } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import type { Category } from './CategoryCard.types';

expect.extend(toHaveNoViolations);

const mockCategory: Category = {
  id: '1',
  name: 'Test Category',
  description: 'Test category description',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  _count: {
    services: 5,
  },
};

describe('CategoryCard - Molecule', () => {
  // 1. RENDERING TESTS
  describe('Rendering', () => {
    it('renders category name', () => {
      render(<CategoryCard category={mockCategory} />);
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });

    it('renders category description when provided', () => {
      render(<CategoryCard category={mockCategory} />);
      expect(screen.getByText('Test category description')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      const categoryWithoutDesc = { ...mockCategory, description: undefined };
      render(<CategoryCard category={categoryWithoutDesc} />);
      expect(screen.queryByText('Test category description')).not.toBeInTheDocument();
    });

    it('renders with correct data-testid', () => {
      render(<CategoryCard category={mockCategory} />);
      expect(screen.getByTestId('category-card')).toBeInTheDocument();
    });

    it('renders default Folder icon', () => {
      const { container } = render(<CategoryCard category={mockCategory} />);
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('renders custom icon when provided', () => {
      render(<CategoryCard category={mockCategory} icon={<Star data-testid="custom-icon" />} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('has elevated card variant by default', () => {
      const { container } = render(<CategoryCard category={mockCategory} />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveClass('shadow-md');
    });
  });

  // 2. SERVICE COUNT BADGE TESTS
  describe('Service Count Badge', () => {
    it('shows service count badge by default', () => {
      render(<CategoryCard category={mockCategory} />);
      expect(screen.getByText('5 services')).toBeInTheDocument();
    });

    it('shows singular "service" for count of 1', () => {
      const category = { ...mockCategory, _count: { services: 1 } };
      render(<CategoryCard category={category} />);
      expect(screen.getByText('1 service')).toBeInTheDocument();
    });

    it('shows 0 services when _count is undefined', () => {
      const category = { ...mockCategory, _count: undefined };
      render(<CategoryCard category={category} />);
      expect(screen.getByText('0 services')).toBeInTheDocument();
    });

    it('hides count badge when showCount is false', () => {
      render(<CategoryCard category={mockCategory} showCount={false} />);
      expect(screen.queryByText(/services/i)).not.toBeInTheDocument();
    });

    it('renders Package icon in badge', () => {
      const { container } = render(<CategoryCard category={mockCategory} />);
      const badge = screen.getByText('5 services').closest('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
      expect(badge?.querySelector('svg')).toBeInTheDocument();
    });

    it('displays correct count for large numbers', () => {
      const category = { ...mockCategory, _count: { services: 999 } };
      render(<CategoryCard category={category} />);
      expect(screen.getByText('999 services')).toBeInTheDocument();
    });
  });

  // 3. CREATION DATE TESTS
  describe('Creation Date', () => {
    it('shows creation date by default', () => {
      render(<CategoryCard category={mockCategory} />);
      expect(screen.getByText(/created/i)).toBeInTheDocument();
    });

    it('hides date when showDate is false', () => {
      render(<CategoryCard category={mockCategory} showDate={false} />);
      expect(screen.queryByText(/created/i)).not.toBeInTheDocument();
    });

    it('formats date correctly', () => {
      const category = {
        ...mockCategory,
        createdAt: '2024-06-15T12:00:00.000Z',
      };
      render(<CategoryCard category={category} />);
      expect(screen.getByText(/created/i)).toBeInTheDocument();
    });

    it('handles Date object for createdAt', () => {
      const category = {
        ...mockCategory,
        createdAt: new Date('2024-01-15T00:00:00.000Z'),
      };
      render(<CategoryCard category={category} />);
      expect(screen.getByText(/created/i)).toBeInTheDocument();
    });
  });

  // 4. EDIT BUTTON TESTS
  describe('Edit Button', () => {
    it('shows edit button when showEdit and onEdit provided', () => {
      render(<CategoryCard category={mockCategory} showEdit onEdit={vi.fn()} />);
      expect(screen.getByLabelText(/edit test category/i)).toBeInTheDocument();
    });

    it('hides edit button when showEdit is false', () => {
      render(<CategoryCard category={mockCategory} showEdit={false} onEdit={vi.fn()} />);
      expect(screen.queryByLabelText(/edit/i)).not.toBeInTheDocument();
    });

    it('does not render edit button without onEdit callback', () => {
      render(<CategoryCard category={mockCategory} showEdit />);
      expect(screen.queryByLabelText(/edit/i)).not.toBeInTheDocument();
    });

    it('calls onEdit when clicked', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      render(<CategoryCard category={mockCategory} showEdit onEdit={onEdit} />);

      const editButton = screen.getByLabelText(/edit test category/i);
      await user.click(editButton);

      expect(onEdit).toHaveBeenCalledWith(mockCategory);
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it('edit button is disabled when isDeleting', () => {
      render(
        <CategoryCard category={mockCategory} showEdit onEdit={vi.fn()} isDeleting />
      );
      const editButton = screen.getByLabelText(/edit test category/i);
      expect(editButton).toBeDisabled();
    });

    it('edit button is disabled when card is disabled', () => {
      render(
        <CategoryCard category={mockCategory} showEdit onEdit={vi.fn()} disabled />
      );
      const editButton = screen.getByLabelText(/edit test category/i);
      expect(editButton).toBeDisabled();
    });

    it('does not call onEdit when disabled', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      render(
        <CategoryCard category={mockCategory} showEdit onEdit={onEdit} disabled />
      );

      const editButton = screen.getByLabelText(/edit test category/i);
      await user.click(editButton);

      expect(onEdit).not.toHaveBeenCalled();
    });

    it('stops event propagation when edit button clicked', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      const onClick = vi.fn();

      render(
        <CategoryCard
          category={mockCategory}
          showEdit
          onEdit={onEdit}
          onClick={onClick}
        />
      );

      const editButton = screen.getByLabelText(/edit test category/i);
      await user.click(editButton);

      expect(onEdit).toHaveBeenCalled();
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // 5. DELETE BUTTON TESTS
  describe('Delete Button', () => {
    it('shows delete button when showDelete and onDelete provided', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      render(<CategoryCard category={category} showDelete onDelete={vi.fn()} />);
      expect(screen.getByLabelText(/delete test category/i)).toBeInTheDocument();
    });

    it('hides delete button when showDelete is false', () => {
      render(<CategoryCard category={mockCategory} showDelete={false} onDelete={vi.fn()} />);
      expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument();
    });

    it('does not render delete button without onDelete callback', () => {
      render(<CategoryCard category={mockCategory} showDelete />);
      expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument();
    });

    it('calls onDelete when clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const category = { ...mockCategory, _count: { services: 0 } };

      render(<CategoryCard category={category} showDelete onDelete={onDelete} />);

      const deleteButton = screen.getByLabelText(/delete test category/i);
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith(category);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('delete button is disabled when category has services', () => {
      render(<CategoryCard category={mockCategory} showDelete onDelete={vi.fn()} />);
      const deleteButton = screen.getByLabelText(/cannot delete test category/i);
      expect(deleteButton).toBeDisabled();
    });

    it('delete button is enabled when category has no services', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      render(<CategoryCard category={category} showDelete onDelete={vi.fn()} />);
      const deleteButton = screen.getByLabelText(/delete test category/i);
      expect(deleteButton).not.toBeDisabled();
    });

    it('shows spinner when isDeleting', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      const { container } = render(
        <CategoryCard category={category} showDelete onDelete={vi.fn()} isDeleting />
      );
      // Check for spinner by role="status"
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });

    it('delete button has proper title when category has services', () => {
      render(<CategoryCard category={mockCategory} showDelete onDelete={vi.fn()} />);
      const deleteButton = screen.getByLabelText(/cannot delete test category/i);
      expect(deleteButton).toHaveAttribute(
        'title',
        'Cannot delete category with services. Delete or reassign services first.'
      );
    });

    it('delete button has destructive styling', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      render(<CategoryCard category={category} showDelete onDelete={vi.fn()} />);
      const deleteButton = screen.getByLabelText(/delete test category/i);
      expect(deleteButton).toHaveClass('text-destructive');
    });

    it('stops event propagation when delete button clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const onClick = vi.fn();
      const category = { ...mockCategory, _count: { services: 0 } };

      render(
        <CategoryCard
          category={category}
          showDelete
          onDelete={onDelete}
          onClick={onClick}
        />
      );

      const deleteButton = screen.getByLabelText(/delete test category/i);
      await user.click(deleteButton);

      expect(onDelete).toHaveBeenCalled();
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // 6. ICON VARIANT TESTS
  describe('Icon Variants', () => {
    it('renders default variant by default', () => {
      const { container } = render(<CategoryCard category={mockCategory} />);
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toHaveClass('bg-primary/10', 'text-primary');
    });

    it('renders primary variant correctly', () => {
      const { container } = render(
        <CategoryCard category={mockCategory} iconVariant="primary" />
      );
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toHaveClass('bg-primary/10', 'text-primary');
    });

    it('renders secondary variant correctly', () => {
      const { container } = render(
        <CategoryCard category={mockCategory} iconVariant="secondary" />
      );
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toHaveClass('bg-secondary/10', 'text-secondary');
    });

    it('renders success variant correctly', () => {
      const { container } = render(
        <CategoryCard category={mockCategory} iconVariant="success" />
      );
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toHaveClass('bg-success/10', 'text-success');
    });

    it('renders warning variant correctly', () => {
      const { container } = render(
        <CategoryCard category={mockCategory} iconVariant="warning" />
      );
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toHaveClass('bg-warning/10', 'text-warning');
    });

    it('renders error variant correctly', () => {
      const { container } = render(
        <CategoryCard category={mockCategory} iconVariant="error" />
      );
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toHaveClass('bg-destructive/10', 'text-destructive');
    });

    it('icon container has transition classes', () => {
      const { container } = render(<CategoryCard category={mockCategory} />);
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toHaveClass('transition-colors');
    });
  });

  // 7. CLICK HANDLER TESTS
  describe('Click Handlers', () => {
    it('calls onClick when card is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<CategoryCard category={mockCategory} onClick={onClick} />);

      const card = screen.getByTestId('category-card');
      await user.click(card);

      expect(onClick).toHaveBeenCalledWith(mockCategory);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<CategoryCard category={mockCategory} onClick={onClick} disabled />);

      const card = screen.getByTestId('category-card');
      await user.click(card);

      expect(onClick).not.toHaveBeenCalled();
    });

    it('card has cursor-pointer when onClick provided', () => {
      render(<CategoryCard category={mockCategory} onClick={vi.fn()} />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('card does not have cursor-pointer without onClick', () => {
      render(<CategoryCard category={mockCategory} />);
      const card = screen.getByTestId('category-card');
      expect(card).not.toHaveClass('cursor-pointer');
    });

    it('card is keyboard accessible with onClick', () => {
      render(<CategoryCard category={mockCategory} onClick={vi.fn()} />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveAttribute('role', 'button');
    });

    it('card triggers onClick on Enter key', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<CategoryCard category={mockCategory} onClick={onClick} />);

      const card = screen.getByTestId('category-card');
      card.focus();
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalledWith(mockCategory);
    });

    it('card triggers onClick on Space key', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<CategoryCard category={mockCategory} onClick={onClick} />);

      const card = screen.getByTestId('category-card');
      card.focus();
      await user.keyboard(' ');

      expect(onClick).toHaveBeenCalledWith(mockCategory);
    });
  });

  // 8. DISABLED STATE TESTS
  describe('Disabled State', () => {
    it('applies opacity when disabled', () => {
      render(<CategoryCard category={mockCategory} disabled />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('has aria-disabled when disabled', () => {
      render(<CategoryCard category={mockCategory} disabled />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables all buttons when disabled', () => {
      render(
        <CategoryCard
          category={mockCategory}
          showEdit
          showDelete
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          disabled
        />
      );

      const editButton = screen.getByLabelText(/edit/i);
      const deleteButton = screen.getByLabelText(/delete/i);

      expect(editButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();
    });
  });

  // 9. STYLING TESTS
  describe('Styling', () => {
    it('has transition classes', () => {
      render(<CategoryCard category={mockCategory} />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveClass('transition-all', 'duration-200');
    });

    it('has hover shadow when interactive', () => {
      render(<CategoryCard category={mockCategory} onClick={vi.fn()} />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveClass('hover:shadow-lg');
    });

    it('accepts custom className', () => {
      render(<CategoryCard category={mockCategory} className="custom-class" />);
      const card = screen.getByTestId('category-card');
      expect(card).toHaveClass('custom-class');
    });

    it('category name is truncated for long text', () => {
      const { container } = render(<CategoryCard category={mockCategory} />);
      const title = container.querySelector('h3');
      expect(title).toHaveClass('truncate');
    });

    it('description is clamped to 2 lines', () => {
      const { container } = render(<CategoryCard category={mockCategory} />);
      const description = screen.getByText('Test category description');
      expect(description).toHaveClass('line-clamp-2');
    });
  });

  // 10. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<CategoryCard category={mockCategory} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with actions', async () => {
      const { container } = render(
        <CategoryCard
          category={mockCategory}
          showEdit
          showDelete
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when interactive', async () => {
      const { container } = render(
        <CategoryCard category={mockCategory} onClick={vi.fn()} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('edit button has descriptive aria-label', () => {
      render(<CategoryCard category={mockCategory} showEdit onEdit={vi.fn()} />);
      const editButton = screen.getByLabelText('Edit Test Category');
      expect(editButton).toHaveAttribute('aria-label', 'Edit Test Category');
    });

    it('delete button has contextual aria-label with service count', () => {
      render(<CategoryCard category={mockCategory} showDelete onDelete={vi.fn()} />);
      const deleteButton = screen.getByLabelText(
        /Cannot delete Test Category - has 5 services/i
      );
      expect(deleteButton).toBeInTheDocument();
    });

    it('icon container is aria-hidden', () => {
      const { container } = render(<CategoryCard category={mockCategory} />);
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // 11. EDGE CASES
  describe('Edge Cases', () => {
    it('handles very long category names', () => {
      const category = {
        ...mockCategory,
        name: 'A'.repeat(100),
      };
      render(<CategoryCard category={category} />);
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('handles very long descriptions', () => {
      const category = {
        ...mockCategory,
        description: 'Long description '.repeat(50),
      };
      render(<CategoryCard category={category} />);
      expect(screen.getByText(/Long description/)).toBeInTheDocument();
    });

    it('handles category with 0 services', () => {
      const category = { ...mockCategory, _count: { services: 0 } };
      render(<CategoryCard category={category} />);
      expect(screen.getByText('0 services')).toBeInTheDocument();
    });

    it('handles very large service count', () => {
      const category = { ...mockCategory, _count: { services: 99999 } };
      render(<CategoryCard category={category} />);
      expect(screen.getByText('99999 services')).toBeInTheDocument();
    });

    it('handles missing _count object gracefully', () => {
      const category = { ...mockCategory, _count: undefined };
      render(<CategoryCard category={category} />);
      expect(screen.getByText('0 services')).toBeInTheDocument();
    });

    it('handles both buttons hidden', () => {
      render(
        <CategoryCard
          category={mockCategory}
          showEdit={false}
          showDelete={false}
        />
      );
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('handles all optional props disabled', () => {
      render(
        <CategoryCard
          category={mockCategory}
          showCount={false}
          showDate={false}
          showEdit={false}
          showDelete={false}
        />
      );

      expect(screen.getByText('Test Category')).toBeInTheDocument();
      expect(screen.queryByText(/services/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/created/i)).not.toBeInTheDocument();
    });
  });

  // 12. INTEGRATION TESTS
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
            <CategoryCard key={cat.id} category={cat} />
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
          <CategoryCard
            category={{ ...mockCategory, id: '1', name: 'Cat 1' }}
            showEdit
            onEdit={onEdit1}
          />
          <CategoryCard
            category={{ ...mockCategory, id: '2', name: 'Cat 2' }}
            showEdit
            onEdit={onEdit2}
          />
        </div>
      );

      const editButtons = screen.getAllByLabelText(/edit/i);
      await user.click(editButtons[0]);

      expect(onEdit1).toHaveBeenCalled();
      expect(onEdit2).not.toHaveBeenCalled();
    });

    it('works with different icon variants simultaneously', () => {
      render(
        <div>
          <CategoryCard
            category={{ ...mockCategory, name: 'Primary Cat' }}
            iconVariant="primary"
          />
          <CategoryCard
            category={{ ...mockCategory, name: 'Success Cat' }}
            iconVariant="success"
          />
          <CategoryCard
            category={{ ...mockCategory, name: 'Warning Cat' }}
            iconVariant="warning"
          />
        </div>
      );

      expect(screen.getByText('Primary Cat')).toBeInTheDocument();
      expect(screen.getByText('Success Cat')).toBeInTheDocument();
      expect(screen.getByText('Warning Cat')).toBeInTheDocument();
    });

    it('forwards HTML attributes', () => {
      render(
        <CategoryCard
          category={mockCategory}
          data-custom="test-value"
          aria-label="Custom label"
        />
      );

      const card = screen.getByTestId('category-card');
      expect(card).toHaveAttribute('data-custom', 'test-value');
      expect(card).toHaveAttribute('aria-label', 'Custom label');
    });
  });

  // 13. DISPLAY NAME TEST
  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(CategoryCard.displayName).toBe('CategoryCard');
    });
  });
});
