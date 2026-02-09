import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ServiceCard } from './ServiceCard';
import type { Service } from './ServiceCard.types';

expect.extend(toHaveNoViolations);

const mockService: Service = {
  id: 'svc-1',
  name: 'Professional Cleaning Service',
  description: 'High-quality professional cleaning service for residential and commercial properties with eco-friendly products',
  categoryId: 'cat-1',
  category: {
    id: 'cat-1',
    name: 'Limpieza',
  },
  thumbnail: 'https://example.com/cleaning.jpg',
  price: 49.99,
  status: 'active',
  rating: 4.5,
  reviewCount: 127,
  requestTemplate: {
    fields: [
      { name: 'address', type: 'text' },
      { name: 'date', type: 'date' },
      { name: 'notes', type: 'textarea' },
    ],
  },
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-20T14:45:00.000Z',
};

describe('ServiceCard - Molecule', () => {
  // 1. BASIC RENDERING TESTS
  describe('Basic Rendering', () => {
    it('renders service card', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.getByTestId('service-card')).toBeInTheDocument();
    });

    it('renders service name', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.getByText('Professional Cleaning Service')).toBeInTheDocument();
    });

    it('renders service description', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.getByTestId('service-description')).toHaveTextContent(/High-quality professional cleaning/);
    });

    it('renders service category', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.getByTestId('service-category')).toHaveTextContent('Limpieza');
    });

    it('renders service price', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.getByTestId('service-price')).toHaveTextContent('$49.99');
    });

    it('renders service status', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.getByTestId('service-status')).toHaveTextContent('active');
    });

    it('renders service rating', () => {
      render(<ServiceCard service={mockService} />);
      const rating = screen.getByTestId('service-rating');
      expect(rating).toHaveTextContent('4.5');
      expect(rating).toHaveTextContent('(127)');
    });

    it('applies custom className', () => {
      render(<ServiceCard service={mockService} className="custom-class" />);
      expect(screen.getByTestId('service-card')).toHaveClass('custom-class');
    });

    it('forwards ref to card element', () => {
      const ref = vi.fn();
      render(<ServiceCard service={mockService} ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  // 2. IMAGE/THUMBNAIL TESTS
  describe('Image/Thumbnail', () => {
    it('renders service thumbnail when provided', () => {
      render(<ServiceCard service={mockService} />);
      const img = screen.getByTestId('service-image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/cleaning.jpg');
      expect(img).toHaveAttribute('alt', 'Professional Cleaning Service');
    });

    it('renders ServiceIcon when no thumbnail', () => {
      const service = { ...mockService, thumbnail: null };
      const { container } = render(<ServiceCard service={service} />);
      expect(screen.queryByTestId('service-image')).not.toBeInTheDocument();
      // ServiceIcon should be rendered
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('hides image when showImage is false', () => {
      render(<ServiceCard service={mockService} showImage={false} />);
      expect(screen.queryByTestId('service-image')).not.toBeInTheDocument();
    });

    it('has proper image styling', () => {
      render(<ServiceCard service={mockService} />);
      const img = screen.getByTestId('service-image');
      expect(img).toHaveClass('object-cover');
    });

    it('image has rounded container', () => {
      const { container } = render(<ServiceCard service={mockService} />);
      const imgContainer = container.querySelector('.rounded-lg');
      expect(imgContainer).toBeInTheDocument();
    });
  });

  // 3. DESCRIPTION TESTS
  describe('Description', () => {
    it('renders full description when under limit', () => {
      const service = { ...mockService, description: 'Short description' };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-description')).toHaveTextContent('Short description');
    });

    it('truncates long description', () => {
      render(<ServiceCard service={mockService} descriptionLimit={50} />);
      const desc = screen.getByTestId('service-description').textContent;
      expect(desc?.length).toBe(53); // 50 + "..."
      expect(desc).toMatch(/\.\.\.$/);
    });

    it('hides description when showDescription is false', () => {
      render(<ServiceCard service={mockService} showDescription={false} />);
      expect(screen.queryByTestId('service-description')).not.toBeInTheDocument();
    });

    it('handles missing description', () => {
      const service = { ...mockService, description: undefined };
      render(<ServiceCard service={service} />);
      expect(screen.queryByTestId('service-description')).not.toBeInTheDocument();
    });

    it('handles empty description', () => {
      const service = { ...mockService, description: '' };
      render(<ServiceCard service={service} />);
      expect(screen.queryByTestId('service-description')).not.toBeInTheDocument();
    });

    it('respects custom descriptionLimit', () => {
      render(<ServiceCard service={mockService} descriptionLimit={30} />);
      const desc = screen.getByTestId('service-description').textContent;
      expect(desc?.length).toBe(33); // 30 + "..."
      expect(desc).toMatch(/\.\.\.$/);
    });
  });

  // 4. PRICE TESTS
  describe('Price', () => {
    it('formats price with 2 decimals', () => {
      const service = { ...mockService, price: 100 };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-price')).toHaveTextContent('$100.00');
    });

    it('uses custom currency symbol', () => {
      render(<ServiceCard service={mockService} currencySymbol="€" />);
      expect(screen.getByTestId('service-price')).toHaveTextContent('€49.99');
    });

    it('hides price when showPrice is false', () => {
      render(<ServiceCard service={mockService} showPrice={false} />);
      expect(screen.queryByTestId('service-price')).not.toBeInTheDocument();
    });

    it('handles missing price', () => {
      const service = { ...mockService, price: undefined };
      render(<ServiceCard service={service} />);
      expect(screen.queryByTestId('service-price')).not.toBeInTheDocument();
    });

    it('handles null price', () => {
      const service = { ...mockService, price: null };
      render(<ServiceCard service={service} />);
      expect(screen.queryByTestId('service-price')).not.toBeInTheDocument();
    });

    it('handles zero price', () => {
      const service = { ...mockService, price: 0 };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-price')).toHaveTextContent('$0.00');
    });

    it('handles large price values', () => {
      const service = { ...mockService, price: 9999.99 };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-price')).toHaveTextContent('$9999.99');
    });
  });

  // 5. CATEGORY TESTS
  describe('Category', () => {
    it('renders category chip', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.getByTestId('service-category')).toBeInTheDocument();
    });

    it('hides category when showCategory is false', () => {
      render(<ServiceCard service={mockService} showCategory={false} />);
      expect(screen.queryByTestId('service-category')).not.toBeInTheDocument();
    });

    it('handles long category names', () => {
      const service = {
        ...mockService,
        category: { id: 'cat-1', name: 'Very Long Category Name That Should Display' },
      };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-category')).toHaveTextContent(/Very Long Category/);
    });
  });

  // 6. STATUS TESTS
  describe('Status', () => {
    it('renders active status with success variant', () => {
      render(<ServiceCard service={mockService} />);
      const status = screen.getByTestId('service-status');
      expect(status).toHaveTextContent('active');
    });

    it('renders inactive status', () => {
      const service = { ...mockService, status: 'inactive' as const };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-status')).toHaveTextContent('inactive');
    });

    it('renders pending status', () => {
      const service = { ...mockService, status: 'pending' as const };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-status')).toHaveTextContent('pending');
    });

    it('hides status when showStatus is false', () => {
      render(<ServiceCard service={mockService} showStatus={false} />);
      expect(screen.queryByTestId('service-status')).not.toBeInTheDocument();
    });

    it('handles missing status', () => {
      const service = { ...mockService, status: undefined };
      render(<ServiceCard service={service} />);
      expect(screen.queryByTestId('service-status')).not.toBeInTheDocument();
    });
  });

  // 7. RATING TESTS
  describe('Rating', () => {
    it('renders rating with star icon', () => {
      render(<ServiceCard service={mockService} />);
      const rating = screen.getByTestId('service-rating');
      expect(rating).toBeInTheDocument();
      expect(rating.querySelector('svg')).toBeInTheDocument();
    });

    it('formats rating to 1 decimal place', () => {
      const service = { ...mockService, rating: 4.67 };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-rating')).toHaveTextContent('4.7');
    });

    it('renders review count', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.getByTestId('service-rating')).toHaveTextContent('(127)');
    });

    it('renders rating without review count', () => {
      const service = { ...mockService, reviewCount: undefined };
      render(<ServiceCard service={service} />);
      const rating = screen.getByTestId('service-rating');
      expect(rating).toHaveTextContent('4.5');
      expect(rating).not.toHaveTextContent('(');
    });

    it('hides rating when showRating is false', () => {
      render(<ServiceCard service={mockService} showRating={false} />);
      expect(screen.queryByTestId('service-rating')).not.toBeInTheDocument();
    });

    it('handles missing rating', () => {
      const service = { ...mockService, rating: undefined };
      render(<ServiceCard service={service} />);
      expect(screen.queryByTestId('service-rating')).not.toBeInTheDocument();
    });

    it('handles zero rating', () => {
      const service = { ...mockService, rating: 0 };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-rating')).toHaveTextContent('0.0');
    });

    it('handles perfect rating', () => {
      const service = { ...mockService, rating: 5 };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-rating')).toHaveTextContent('5.0');
    });
  });

  // 8. EDIT BUTTON TESTS
  describe('Edit Button', () => {
    it('hides edit button by default', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    });

    it('shows edit button when showEdit is true', () => {
      render(<ServiceCard service={mockService} showEdit onEdit={vi.fn()} />);
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('calls onEdit when clicked', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      render(<ServiceCard service={mockService} showEdit onEdit={onEdit} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));
      expect(onEdit).toHaveBeenCalledWith(mockService);
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it('disables edit button when deleting', () => {
      render(<ServiceCard service={mockService} showEdit onEdit={vi.fn()} isDeleting />);
      expect(screen.getByRole('button', { name: /edit/i })).toBeDisabled();
    });

    it('hides edit button when onEdit is not provided', () => {
      render(<ServiceCard service={mockService} showEdit />);
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    });

    it('has proper aria-label', () => {
      render(<ServiceCard service={mockService} showEdit onEdit={vi.fn()} />);
      expect(screen.getByRole('button', { name: 'Edit service' })).toBeInTheDocument();
    });
  });

  // 9. DELETE BUTTON TESTS
  describe('Delete Button', () => {
    it('hides delete button by default', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('shows delete button when showDelete is true', () => {
      render(<ServiceCard service={mockService} showDelete onDelete={vi.fn()} />);
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('calls onDelete when clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(<ServiceCard service={mockService} showDelete onDelete={onDelete} />);

      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(onDelete).toHaveBeenCalledWith(mockService);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('shows loading state when deleting', () => {
      render(<ServiceCard service={mockService} showDelete onDelete={vi.fn()} isDeleting />);
      expect(screen.getByRole('button', { name: /delete/i })).toHaveTextContent(/deleting/i);
    });

    it('disables delete button when deleting', () => {
      render(<ServiceCard service={mockService} showDelete onDelete={vi.fn()} isDeleting />);
      expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
    });

    it('hides delete button when onDelete is not provided', () => {
      render(<ServiceCard service={mockService} showDelete />);
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('has proper aria-label', () => {
      render(<ServiceCard service={mockService} showDelete onDelete={vi.fn()} />);
      expect(screen.getByRole('button', { name: 'Delete service' })).toBeInTheDocument();
    });
  });

  // 10. VIEW DETAILS BUTTON TESTS
  describe('View Details Button', () => {
    it('hides view details button by default', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.queryByRole('button', { name: /view/i })).not.toBeInTheDocument();
    });

    it('shows view details button when showViewDetails is true', () => {
      render(<ServiceCard service={mockService} showViewDetails onViewDetails={vi.fn()} />);
      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
    });

    it('calls onViewDetails when clicked', async () => {
      const user = userEvent.setup();
      const onViewDetails = vi.fn();
      render(<ServiceCard service={mockService} showViewDetails onViewDetails={onViewDetails} />);

      await user.click(screen.getByRole('button', { name: /view/i }));
      expect(onViewDetails).toHaveBeenCalledWith(mockService);
      expect(onViewDetails).toHaveBeenCalledTimes(1);
    });

    it('disables view details button when deleting', () => {
      render(<ServiceCard service={mockService} showViewDetails onViewDetails={vi.fn()} isDeleting />);
      expect(screen.getByRole('button', { name: /view/i })).toBeDisabled();
    });

    it('hides view details button when onViewDetails is not provided', () => {
      render(<ServiceCard service={mockService} showViewDetails />);
      expect(screen.queryByRole('button', { name: /view/i })).not.toBeInTheDocument();
    });
  });

  // 11. CARD CLICK TESTS
  describe('Card Click', () => {
    it('calls onClick when card is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<ServiceCard service={mockService} onClick={onClick} />);

      await user.click(screen.getByTestId('service-card'));
      expect(onClick).toHaveBeenCalledWith(mockService);
    });

    it('adds cursor-pointer when onClick is provided', () => {
      render(<ServiceCard service={mockService} onClick={vi.fn()} />);
      expect(screen.getByTestId('service-card')).toHaveClass('cursor-pointer');
    });

    it('does not trigger onClick when clicking buttons', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const onEdit = vi.fn();
      render(<ServiceCard service={mockService} onClick={onClick} showEdit onEdit={onEdit} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));
      expect(onClick).not.toHaveBeenCalled();
      expect(onEdit).toHaveBeenCalled();
    });

    it('does not add cursor-pointer without onClick', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.getByTestId('service-card')).not.toHaveClass('cursor-pointer');
    });
  });

  // 12. VARIANT TESTS
  describe('Variants', () => {
    it('renders default variant', () => {
      render(<ServiceCard service={mockService} variant="default" />);
      expect(screen.getByTestId('service-card')).toBeInTheDocument();
      expect(screen.getByTestId('service-description')).toBeInTheDocument();
    });

    it('renders compact variant', () => {
      render(<ServiceCard service={mockService} variant="compact" />);
      const card = screen.getByTestId('service-card');
      expect(card).toBeInTheDocument();
      // Compact variant has less padding
    });

    it('renders detailed variant with field count', () => {
      render(<ServiceCard service={mockService} variant="detailed" showFieldCount />);
      expect(screen.getByTestId('service-field-count')).toBeInTheDocument();
    });

    it('shows creation date in detailed variant', () => {
      render(<ServiceCard service={mockService} variant="detailed" showCreatedAt />);
      expect(screen.getByTestId('service-created-at')).toBeInTheDocument();
    });

    it('compact variant shows all action buttons', () => {
      render(
        <ServiceCard
          service={mockService}
          variant="compact"
          showEdit
          showDelete
          showViewDetails
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onViewDetails={vi.fn()}
        />
      );
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
    });
  });

  // 13. FIELD COUNT TESTS
  describe('Field Count', () => {
    it('shows field count when showFieldCount is true', () => {
      render(<ServiceCard service={mockService} variant="detailed" showFieldCount />);
      expect(screen.getByTestId('service-field-count')).toHaveTextContent('3 fields in form template');
    });

    it('shows singular "field" for count of 1', () => {
      const service = {
        ...mockService,
        requestTemplate: { fields: [{ name: 'field1', type: 'text' }] },
      };
      render(<ServiceCard service={service} variant="detailed" showFieldCount />);
      expect(screen.getByTestId('service-field-count')).toHaveTextContent('1 field in form template');
    });

    it('shows 0 fields when no fields', () => {
      const service = { ...mockService, requestTemplate: { fields: [] } };
      render(<ServiceCard service={service} variant="detailed" showFieldCount />);
      expect(screen.getByTestId('service-field-count')).toHaveTextContent('0 fields in form template');
    });

    it('handles null requestTemplate', () => {
      const service = { ...mockService, requestTemplate: null };
      render(<ServiceCard service={service} variant="detailed" showFieldCount />);
      expect(screen.getByTestId('service-field-count')).toHaveTextContent('0 fields in form template');
    });

    it('hides field count in default variant', () => {
      render(<ServiceCard service={mockService} variant="default" showFieldCount />);
      expect(screen.queryByTestId('service-field-count')).not.toBeInTheDocument();
    });
  });

  // 14. CREATED DATE TESTS
  describe('Created Date', () => {
    it('shows created date when showCreatedAt is true', () => {
      render(<ServiceCard service={mockService} variant="detailed" showCreatedAt />);
      const createdAt = screen.getByTestId('service-created-at');
      expect(createdAt).toBeInTheDocument();
      expect(createdAt).toHaveTextContent(/Created/);
    });

    it('formats date correctly', () => {
      render(<ServiceCard service={mockService} variant="detailed" showCreatedAt />);
      expect(screen.getByTestId('service-created-at')).toHaveTextContent('1/15/2024');
    });

    it('hides created date by default', () => {
      render(<ServiceCard service={mockService} variant="detailed" />);
      expect(screen.queryByTestId('service-created-at')).not.toBeInTheDocument();
    });

    it('hides created date in default variant even when true', () => {
      render(<ServiceCard service={mockService} variant="default" showCreatedAt />);
      expect(screen.queryByTestId('service-created-at')).not.toBeInTheDocument();
    });
  });

  // 15. LOADING STATE TESTS
  describe('Loading State', () => {
    it('renders loading skeleton when isLoading is true', () => {
      render(<ServiceCard service={mockService} isLoading />);
      expect(screen.getByTestId('service-card-skeleton')).toBeInTheDocument();
    });

    it('loading skeleton has animate-pulse class', () => {
      render(<ServiceCard service={mockService} isLoading />);
      expect(screen.getByTestId('service-card-skeleton')).toHaveClass('animate-pulse');
    });

    it('loading state does not render service content', () => {
      render(<ServiceCard service={mockService} isLoading />);
      expect(screen.queryByText(mockService.name)).not.toBeInTheDocument();
    });

    it('loading skeleton respects showImage prop', () => {
      const { container } = render(<ServiceCard service={mockService} isLoading showImage />);
      expect(container.querySelector('.h-16.w-16')).toBeInTheDocument();
    });

    it('loading skeleton without image', () => {
      const { container } = render(<ServiceCard service={mockService} isLoading showImage={false} />);
      expect(container.querySelector('.h-16.w-16')).not.toBeInTheDocument();
    });
  });

  // 16. EDGE CASES
  describe('Edge Cases', () => {
    it('handles very long service name', () => {
      const service = { ...mockService, name: 'A'.repeat(200) };
      render(<ServiceCard service={service} />);
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
    });

    it('handles empty service name', () => {
      const service = { ...mockService, name: '' };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-card')).toBeInTheDocument();
    });

    it('handles all buttons hidden', () => {
      render(
        <ServiceCard
          service={mockService}
          showEdit={false}
          showDelete={false}
          showViewDetails={false}
        />
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles all metadata hidden', () => {
      render(
        <ServiceCard
          service={mockService}
          showDescription={false}
          showPrice={false}
          showCategory={false}
          showStatus={false}
          showRating={false}
        />
      );
      expect(screen.getByText(mockService.name)).toBeInTheDocument();
      expect(screen.queryByTestId('service-description')).not.toBeInTheDocument();
      expect(screen.queryByTestId('service-price')).not.toBeInTheDocument();
    });

    it('handles missing category name', () => {
      const service = {
        ...mockService,
        category: { id: 'cat-1', name: '' },
      };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-category')).toBeInTheDocument();
    });

    it('handles fractional prices', () => {
      const service = { ...mockService, price: 99.99 };
      render(<ServiceCard service={service} />);
      expect(screen.getByTestId('service-price')).toHaveTextContent('$99.99');
    });

    it('handles multiple action buttons together', () => {
      render(
        <ServiceCard
          service={mockService}
          showEdit
          showDelete
          showViewDetails
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onViewDetails={vi.fn()}
        />
      );
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });
  });

  // 17. INTERACTION TESTS
  describe('Interactions', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('multiple clicks on edit trigger multiple callbacks', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      render(<ServiceCard service={mockService} showEdit onEdit={onEdit} />);

      const button = screen.getByRole('button', { name: /edit/i });
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(onEdit).toHaveBeenCalledTimes(3);
    });

    it('keyboard navigation works on buttons', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      render(<ServiceCard service={mockService} showEdit onEdit={onEdit} />);

      const button = screen.getByRole('button', { name: /edit/i });
      button.focus();
      await user.keyboard('{Enter}');

      expect(onEdit).toHaveBeenCalled();
    });

    it('does not trigger actions when disabled', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();
      render(<ServiceCard service={mockService} showEdit onEdit={onEdit} isDeleting />);

      const button = screen.getByRole('button', { name: /edit/i });
      await user.click(button);

      expect(onEdit).not.toHaveBeenCalled();
    });
  });

  // 18. STYLING TESTS
  describe('Styling', () => {
    it('has transition classes', () => {
      render(<ServiceCard service={mockService} />);
      expect(screen.getByTestId('service-card')).toHaveClass('transition-all');
    });

    it('has hover shadow class when clickable', () => {
      render(<ServiceCard service={mockService} onClick={vi.fn()} />);
      expect(screen.getByTestId('service-card')).toHaveClass('hover:shadow-lg');
    });

    it('applies elevated variant to card', () => {
      const { container } = render(<ServiceCard service={mockService} />);
      expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
    });

    it('service name has proper typography', () => {
      const { container } = render(<ServiceCard service={mockService} />);
      const name = screen.getByText(mockService.name);
      expect(name.tagName).toBe('H3');
    });
  });

  // 19. ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ServiceCard service={mockService} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with all buttons visible', async () => {
      const { container } = render(
        <ServiceCard
          service={mockService}
          showEdit
          showDelete
          showViewDetails
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onViewDetails={vi.fn()}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('buttons have proper aria-labels', () => {
      render(
        <ServiceCard
          service={mockService}
          showEdit
          showDelete
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );
      expect(screen.getByRole('button', { name: 'Edit service' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete service' })).toBeInTheDocument();
    });

    it('image has alt text', () => {
      render(<ServiceCard service={mockService} />);
      const img = screen.getByTestId('service-image');
      expect(img).toHaveAttribute('alt', mockService.name);
    });

    it('loading skeleton is accessible', async () => {
      const { container } = render(<ServiceCard service={mockService} isLoading />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 20. INTEGRATION TESTS
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
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </div>
      );

      expect(screen.getByText('Service 1')).toBeInTheDocument();
      expect(screen.getByText('Service 2')).toBeInTheDocument();
      expect(screen.getByText('Service 3')).toBeInTheDocument();
    });

    it('maintains independent state across instances', async () => {
      const user = userEvent.setup();
      const onEdit1 = vi.fn();
      const onEdit2 = vi.fn();

      render(
        <div>
          <ServiceCard
            service={{ ...mockService, id: '1', name: 'Svc 1' }}
            showEdit
            onEdit={onEdit1}
          />
          <ServiceCard
            service={{ ...mockService, id: '2', name: 'Svc 2' }}
            showEdit
            onEdit={onEdit2}
          />
        </div>
      );

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      expect(onEdit1).toHaveBeenCalled();
      expect(onEdit2).not.toHaveBeenCalled();
    });

    it('works with different variants mixed', () => {
      render(
        <div>
          <ServiceCard service={{ ...mockService, id: '1' }} variant="compact" />
          <ServiceCard service={{ ...mockService, id: '2' }} variant="default" />
          <ServiceCard service={{ ...mockService, id: '3' }} variant="detailed" showFieldCount />
        </div>
      );

      expect(screen.getAllByTestId('service-card')).toHaveLength(3);
    });

    it('handles mixed loading states', () => {
      render(
        <div>
          <ServiceCard service={{ ...mockService, id: '1' }} isLoading />
          <ServiceCard service={{ ...mockService, id: '2' }} />
        </div>
      );

      expect(screen.getByTestId('service-card-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('service-card')).toBeInTheDocument();
    });
  });
});
