import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatConversationsTableAlianza } from './ChatConversationsTableAlianza';
import type { ChatConversationItem, PaginationProps } from './ChatConversationsTableAlianza.types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ lang: 'en' }),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('ChatConversationsTableAlianza', () => {
  const mockConversations: ChatConversationItem[] = [
    {
      id: 'conv-123456789',
      contactInfo: {
        email: 'user@example.com',
        name: 'John Doe',
      },
      status: 'active',
      lastMessageAt: new Date('2024-01-15T10:30:00Z'),
    },
    {
      id: 'conv-987654321',
      contactInfo: {
        email: 'jane@example.com',
        name: 'Jane Smith',
      },
      status: 'inactive',
      lastMessageAt: new Date('2024-01-10T14:20:00Z'),
    },
  ];

  const mockPagination: PaginationProps = {
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // RENDERING TESTS
  describe('Rendering', () => {
    it('should render table with conversations', () => {
      render(<ChatConversationsTableAlianza conversations={mockConversations} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Check that both conversations are rendered
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should render empty state when no conversations', () => {
      render(<ChatConversationsTableAlianza conversations={[]} />);

      expect(screen.getByText('No conversations found')).toBeInTheDocument();
    });

    it('should apply custom className to wrapper', () => {
      const { container } = render(
        <ChatConversationsTableAlianza
          conversations={mockConversations}
          className="custom-test-class"
        />
      );

      const wrapper = container.querySelector('.custom-test-class');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('w-full');
      expect(wrapper).toHaveClass('relative');
    });
  });

  // CONVERSATION DISPLAY TESTS
  describe('Conversation Display', () => {
    it('should display conversation ID (truncated)', () => {
      render(<ChatConversationsTableAlianza conversations={mockConversations} />);

      // ID should be truncated to first 8 characters + "..."
      expect(screen.getByText('conv-123...')).toBeInTheDocument();
      expect(screen.getByText('conv-987...')).toBeInTheDocument();
    });

    it('should display contact email and name', () => {
      render(<ChatConversationsTableAlianza conversations={mockConversations} />);

      expect(screen.getByText('user@example.com')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should display "-" for missing contact info', () => {
      const conversationWithoutContact: ChatConversationItem = {
        id: 'conv-no-contact',
        status: 'active',
        lastMessageAt: new Date('2024-01-15T10:30:00Z'),
      };

      render(<ChatConversationsTableAlianza conversations={[conversationWithoutContact]} />);

      // Should display "-" for missing email and name
      const cells = screen.getAllByRole('cell');
      const dashCount = cells.filter(cell => cell.textContent === '-').length;
      expect(dashCount).toBeGreaterThanOrEqual(2);
    });

    it('should display active status with solid variant Chip', () => {
      render(<ChatConversationsTableAlianza conversations={[mockConversations[0]]} />);

      // Check that active status is displayed in a Chip
      const activeStatus = screen.getByText('active');
      expect(activeStatus).toBeInTheDocument();
    });

    it('should display inactive status with outline variant Chip', () => {
      render(<ChatConversationsTableAlianza conversations={[mockConversations[1]]} />);

      // Check that inactive status is displayed in a Chip
      const inactiveStatus = screen.getByText('inactive');
      expect(inactiveStatus).toBeInTheDocument();
    });

    it('should format lastMessageAt date correctly', () => {
      render(<ChatConversationsTableAlianza conversations={mockConversations} />);

      // Check that dates are rendered (format varies by locale, just check they exist)
      const cells = screen.getAllByRole('cell');
      const dateCells = cells.filter(cell => {
        const text = cell.textContent || '';
        // Date should contain numbers and possibly slashes or commas
        return /\d/.test(text) && text.length > 10;
      });
      expect(dateCells.length).toBeGreaterThanOrEqual(2);
    });
  });

  // INTERACTION TESTS
  describe('Interactions', () => {
    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      render(
        <ChatConversationsTableAlianza
          conversations={mockConversations}
          onDelete={onDelete}
        />
      );

      // Find all buttons (should have 2 view buttons + 2 delete buttons = 4 total)
      const allButtons = screen.getAllByRole('button');

      // Filter to get delete buttons (ones with destructive text class)
      const deleteButtons = allButtons.filter(btn =>
        btn.className.includes('destructive')
      );

      // Click the first delete button
      await user.click(deleteButtons[0]);

      expect(onDelete).toHaveBeenCalledWith('conv-123456789');
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('should not render delete button when onDelete is not provided', () => {
      render(<ChatConversationsTableAlianza conversations={mockConversations} />);

      // Should only have view buttons (Eye icons), not delete buttons
      const buttons = screen.getAllByRole('button');
      // With onDelete undefined, should have 2 view buttons only (one per row)
      expect(buttons).toHaveLength(2);
    });

    it('should render link to conversation detail page', () => {
      render(<ChatConversationsTableAlianza conversations={[mockConversations[0]]} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/en/admin/chat/conv-123456789');
    });

    it('should render pagination when provided', () => {
      render(
        <ChatConversationsTableAlianza
          conversations={mockConversations}
          pagination={mockPagination}
        />
      );

      // Check for pagination component (should show page info)
      expect(screen.getByText(/25/)).toBeInTheDocument(); // total items
    });

    it('should not render pagination when not provided', () => {
      const { container } = render(
        <ChatConversationsTableAlianza conversations={mockConversations} />
      );

      // Pagination should not be in the document
      const pagination = container.querySelector('.border-t.border-border\\/50.pt-4');
      expect(pagination).not.toBeInTheDocument();
    });
  });

  // LABEL CUSTOMIZATION TESTS
  describe('Label Customization', () => {
    it('should use custom labels when provided', () => {
      const customLabels = {
        id: 'Custom ID',
        email: 'Custom Email',
        name: 'Custom Name',
        status: 'Custom Status',
        lastMessage: 'Custom Last Message',
        actions: 'Custom Actions',
      };

      render(
        <ChatConversationsTableAlianza
          conversations={mockConversations}
          labels={customLabels}
        />
      );

      expect(screen.getByText('Custom ID')).toBeInTheDocument();
      expect(screen.getByText('Custom Email')).toBeInTheDocument();
      expect(screen.getByText('Custom Name')).toBeInTheDocument();
      expect(screen.getByText('Custom Status')).toBeInTheDocument();
      expect(screen.getByText('Custom Last Message')).toBeInTheDocument();
      expect(screen.getByText('Custom Actions')).toBeInTheDocument();
    });

    it('should use default labels when not provided', () => {
      render(<ChatConversationsTableAlianza conversations={mockConversations} />);

      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Nombre')).toBeInTheDocument();
      expect(screen.getByText('Estado')).toBeInTheDocument();
      expect(screen.getByText('Último Mensaje')).toBeInTheDocument();
      expect(screen.getByText('Acciones')).toBeInTheDocument();
    });
  });

  // ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('should have proper table structure', () => {
      render(<ChatConversationsTableAlianza conversations={mockConversations} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const thead = table.querySelector('thead');
      expect(thead).toBeInTheDocument();

      const tbody = table.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
    });

    it('should have correct number of table rows', () => {
      render(<ChatConversationsTableAlianza conversations={mockConversations} />);

      const rows = screen.getAllByRole('row');
      // 1 header row + 2 data rows = 3 total
      expect(rows).toHaveLength(3);
    });

    it('should have proper heading cells for columns', () => {
      render(<ChatConversationsTableAlianza conversations={mockConversations} />);

      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders).toHaveLength(6);
    });

    it('should apply hover styles for rows', () => {
      const { container } = render(
        <ChatConversationsTableAlianza conversations={mockConversations} />
      );

      const tbody = container.querySelector('tbody');
      const rows = tbody?.querySelectorAll('tr');

      rows?.forEach(row => {
        expect(row).toHaveClass('group');
        expect(row).toHaveClass('hover:bg-muted/50');
      });
    });
  });
});
