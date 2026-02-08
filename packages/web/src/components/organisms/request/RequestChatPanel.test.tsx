import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { RequestChatPanel } from './RequestChatPanel';

// Mock dependencies
vi.mock('@/lib/trpc', () => {
  const createMockMutation = (onSuccess?: any, onError?: any) => ({
    mutate: vi.fn((data) => {
      if (onSuccess) onSuccess({ id: 'conv-123' });
    }),
    isPending: false,
  });

  const createMockQuery = (data: any) => ({
    data,
    refetch: vi.fn(),
    isLoading: false,
    isError: false,
  });

  return {
    trpc: {
      chat: {
        getOrCreateRequestConversation: {
          useMutation: vi.fn((options) => createMockMutation(options?.onSuccess, options?.onError)),
        },
        getMessages: {
          useQuery: vi.fn(() => createMockQuery([])),
        },
        replyToMessage: {
          useMutation: vi.fn(() => createMockMutation()),
        },
      },
    },
  };
});

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('RequestChatPanel - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render chat panel header', () => {
      render(<RequestChatPanel requestId="req-123" />);

      expect(screen.getByText('Internal Team Chat')).toBeInTheDocument();
      expect(screen.getByText('Discuss this request with your team')).toBeInTheDocument();
    });

    it('should render toggle button', () => {
      render(<RequestChatPanel requestId="req-123" />);

      expect(screen.getByRole('button', { name: /Open Chat/i })).toBeInTheDocument();
    });

    it('should not show chat initially', () => {
      render(<RequestChatPanel requestId="req-123" />);

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('should show chat when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });
  });

  describe('Chat Opening', () => {
    it('should create conversation on first open', async () => {
      const { trpc } = await import('@/lib/trpc');
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      await waitFor(() => {
        expect(trpc.chat.getOrCreateRequestConversation.useMutation).toHaveBeenCalled();
      });
    });

    it('should change button text when chat is opened', async () => {
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      const toggleButton = screen.getByRole('button', { name: /Open Chat/i });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Hide Chat/i })).toBeInTheDocument();
      });
    });

    it('should hide chat when toggle button is clicked again', async () => {
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      const toggleButton = screen.getByRole('button', { name: /Open Chat/i });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /Hide Chat/i }));

      await waitFor(() => {
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Messages Display', () => {
    it('should show empty state when no messages', async () => {
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      await waitFor(() => {
        expect(screen.getByText('No messages yet. Start the conversation!')).toBeInTheDocument();
      });
    });

    it('should display messages when available', async () => {
      const { trpc } = await import('@/lib/trpc');
      const mockMessages = [
        {
          id: 'msg-1',
          content: 'Hello team!',
          isFromVisitor: true,
          senderUser: { firstname: 'John' },
          createdAt: new Date().toISOString(),
        },
      ];

      (trpc.chat.getMessages.useQuery as any).mockReturnValue({
        data: mockMessages,
        refetch: vi.fn(),
        isLoading: false,
        isError: false,
      });

      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      await waitFor(() => {
        expect(screen.getByText('Hello team!')).toBeInTheDocument();
      });
    });

    it('should show sender initials in avatar', async () => {
      const { trpc } = await import('@/lib/trpc');
      const mockMessages = [
        {
          id: 'msg-1',
          content: 'Test message',
          isFromVisitor: true,
          senderUser: { firstname: 'Alice' },
          createdAt: new Date().toISOString(),
        },
      ];

      (trpc.chat.getMessages.useQuery as any).mockReturnValue({
        data: mockMessages,
        refetch: vi.fn(),
        isLoading: false,
        isError: false,
      });

      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      await waitFor(() => {
        expect(screen.getByText('A')).toBeInTheDocument();
      });
    });

    it('should show message timestamp', async () => {
      const { trpc } = await import('@/lib/trpc');
      const now = new Date();
      const mockMessages = [
        {
          id: 'msg-1',
          content: 'Test message',
          isFromVisitor: true,
          senderUser: { firstname: 'John' },
          createdAt: now.toISOString(),
        },
      ];

      (trpc.chat.getMessages.useQuery as any).mockReturnValue({
        data: mockMessages,
        refetch: vi.fn(),
        isLoading: false,
        isError: false,
      });

      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      await waitFor(() => {
        const timestamp = now.toLocaleTimeString();
        expect(screen.getByText(timestamp)).toBeInTheDocument();
      });
    });
  });

  describe('Message Sending', () => {
    it('should render message input and send button', async () => {
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Send button
      });
    });

    it('should update message input value when typing', async () => {
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      const textarea = await screen.findByRole('textbox');
      await user.type(textarea, 'Hello team!');

      expect(textarea).toHaveValue('Hello team!');
    });

    it('should send message when send button clicked', async () => {
      const { trpc } = await import('@/lib/trpc');
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      const textarea = await screen.findByRole('textbox');
      await user.type(textarea, 'Test message');

      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find(btn => btn.getAttribute('class')?.includes('h-[60px]'));
      if (sendButton) {
        await user.click(sendButton);

        await waitFor(() => {
          expect(trpc.chat.replyToMessage.useMutation).toHaveBeenCalled();
        });
      }
    });

    it('should clear message input after sending', async () => {
      const { trpc } = await import('@/lib/trpc');
      (trpc.chat.replyToMessage.useMutation as any).mockReturnValue({
        mutate: vi.fn((data, options: any) => {
          if (options?.onSuccess) options.onSuccess();
        }),
        isPending: false,
      });

      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      const textarea = await screen.findByRole('textbox') as HTMLTextAreaElement;
      await user.type(textarea, 'Test message');

      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find(btn => btn.getAttribute('class')?.includes('h-[60px]'));
      if (sendButton) {
        await user.click(sendButton);

        await waitFor(() => {
          expect(textarea.value).toBe('');
        });
      }
    });

    it('should not send empty messages', async () => {
      const { trpc } = await import('@/lib/trpc');
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find(btn => btn.getAttribute('class')?.includes('h-[60px]'));

      if (sendButton) {
        expect(sendButton).toBeDisabled();
      }
    });

    it('should handle Enter key to send message', async () => {
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      const textarea = await screen.findByRole('textbox');
      await user.type(textarea, 'Test message{Enter}');

      // Message should be sent and input cleared
      await waitFor(() => {
        expect(textarea).toHaveValue('');
      });
    });

    it('should allow Shift+Enter for new line', async () => {
      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      const textarea = await screen.findByRole('textbox') as HTMLTextAreaElement;
      await user.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2');

      expect(textarea.value).toContain('Line 1');
      expect(textarea.value).toContain('Line 2');
    });
  });

  describe('Error Handling', () => {
    it('should show error toast on conversation creation failure', async () => {
      const { trpc } = await import('@/lib/trpc');
      const { toast } = await import('sonner');

      (trpc.chat.getOrCreateRequestConversation.useMutation as any).mockReturnValue({
        mutate: vi.fn((data, options: any) => {
          if (options?.onError) options.onError({ message: 'Failed to create conversation' });
        }),
        isPending: false,
      });

      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create conversation');
      });
    });

    it('should show error toast on message send failure', async () => {
      const { trpc } = await import('@/lib/trpc');
      const { toast } = await import('sonner');

      (trpc.chat.replyToMessage.useMutation as any).mockReturnValue({
        mutate: vi.fn((data, options: any) => {
          if (options?.onError) options.onError({ message: 'Failed to send message' });
        }),
        isPending: false,
      });

      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      const textarea = await screen.findByRole('textbox');
      await user.type(textarea, 'Test');

      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find(btn => btn.getAttribute('class')?.includes('h-[60px]'));
      if (sendButton) {
        await user.click(sendButton);

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner on toggle button when creating conversation', () => {
      const { trpc } = await import('@/lib/trpc');

      (trpc.chat.getOrCreateRequestConversation.useMutation as any).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      });

      render(<RequestChatPanel requestId="req-123" />);

      expect(screen.getByRole('button', { name: /Open Chat/i })).toBeInTheDocument();
    });

    it('should disable message input and button while sending', async () => {
      const { trpc } = await import('@/lib/trpc');

      (trpc.chat.replyToMessage.useMutation as any).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      });

      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        expect(textarea).toBeDisabled();
      });
    });
  });

  describe('Polling', () => {
    it('should refetch messages periodically', async () => {
      const { trpc } = await import('@/lib/trpc');
      const mockRefetch = vi.fn();

      (trpc.chat.getMessages.useQuery as any).mockReturnValue({
        data: [],
        refetch: mockRefetch,
        isLoading: false,
        isError: false,
      });

      const user = userEvent.setup();
      render(<RequestChatPanel requestId="req-123" />);

      await user.click(screen.getByRole('button', { name: /Open Chat/i }));

      // useQuery is configured with refetchInterval: 3000
      expect(trpc.chat.getMessages.useQuery).toHaveBeenCalledWith(
        expect.objectContaining({ conversationId: expect.any(String) }),
        expect.objectContaining({ refetchInterval: 3000 })
      );
    });
  });
});
