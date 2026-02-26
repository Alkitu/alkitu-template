import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock socket.io-client with factory function
vi.mock('socket.io-client', () => {
  const mockSocket = {
    connected: false,
    id: 'test-socket-id',
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  };

  const mockIo = vi.fn(() => mockSocket);

  return {
    io: mockIo,
  };
});

import { useWebSocket } from '../use-websocket';

describe('useWebSocket', () => {
  let mockSocket: any;
  let mockIo: any;

  beforeEach(async () => {
    // Get the mocked functions
    const { io } = await import('socket.io-client');
    mockIo = io as any;
    mockSocket = mockIo();

    vi.clearAllMocks();
    mockSocket.connected = false;
    mockSocket.on.mockClear();
    mockSocket.emit.mockClear();
    mockSocket.disconnect.mockClear();
    mockIo.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should initialize with disconnected state', () => {
    const { result } = renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: false,
      }),
    );

    expect(result.current.connected).toBe(false);
    expect(result.current.socket).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.reconnectAttempts).toBe(0);
  });

  it('should connect when enabled and userId provided', () => {
    renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
      }),
    );

    expect(mockIo).toHaveBeenCalledWith(
      'http://localhost:3001/notifications',
      expect.objectContaining({
        withCredentials: true,
        transports: ['websocket', 'polling'],
        upgrade: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      }),
    );
  });

  it('should not connect when disabled', () => {
    renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: false,
      }),
    );

    expect(mockIo).not.toHaveBeenCalled();
  });

  it('should not connect when userId is empty', () => {
    renderHook(() =>
      useWebSocket({
        userId: '',
        enabled: true,
      }),
    );

    expect(mockIo).not.toHaveBeenCalled();
  });

  it('should setup event listeners on connection', () => {
    renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
      }),
    );

    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith(
      'disconnect',
      expect.any(Function),
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      'connect_error',
      expect.any(Function),
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      'notification:new',
      expect.any(Function),
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      'notification:count_updated',
      expect.any(Function),
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      'notification_read',
      expect.any(Function),
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      'connection:confirmed',
      expect.any(Function),
    );
  });

  it('should emit subscription message on connection', () => {
    renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
      }),
    );

    expect(mockSocket.emit).toHaveBeenCalledWith('notification:subscribe');
  });

  it('should call onNewNotification callback', () => {
    const onNewNotification = vi.fn();
    const notification = { id: '1', message: 'Test notification' };

    renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
        onNewNotification,
      }),
    );

    // Simulate receiving a new notification
    const newNotificationHandler = mockSocket.on.mock.calls.find(
      (call: [string, Function]) => call[0] === 'notification:new',
    )?.[1];

    act(() => {
      newNotificationHandler?.(notification);
    });

    expect(onNewNotification).toHaveBeenCalledWith(notification);
  });

  it('should call onCountUpdate callback', () => {
    const onCountUpdate = vi.fn();

    renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
        onCountUpdate,
      }),
    );

    // Simulate count update event
    const countUpdateHandler = mockSocket.on.mock.calls.find(
      (call: [string, Function]) => call[0] === 'notification:count_updated',
    )?.[1];

    act(() => {
      countUpdateHandler?.();
    });

    expect(onCountUpdate).toHaveBeenCalled();
  });

  it('should call onConnectionChange callback on connect', () => {
    const onConnectionChange = vi.fn();

    renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
        onConnectionChange,
      }),
    );

    // Simulate connection event
    const connectHandler = mockSocket.on.mock.calls.find(
      (call: [string, Function]) => call[0] === 'connect',
    )?.[1];

    act(() => {
      connectHandler?.();
    });

    expect(onConnectionChange).toHaveBeenCalledWith(true);
  });

  it('should call onConnectionChange callback on disconnect', () => {
    const onConnectionChange = vi.fn();

    renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
        onConnectionChange,
      }),
    );

    // Simulate disconnect event
    const disconnectHandler = mockSocket.on.mock.calls.find(
      (call: [string, Function]) => call[0] === 'disconnect',
    )?.[1];

    act(() => {
      disconnectHandler?.('transport close');
    });

    expect(onConnectionChange).toHaveBeenCalledWith(false);
  });

  it('should handle connection errors', () => {
    const { result } = renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
      }),
    );

    // Simulate connection error
    const errorHandler = mockSocket.on.mock.calls.find(
      (call: [string, Function]) => call[0] === 'connect_error',
    )?.[1];

    const error = new Error('Connection failed');

    act(() => {
      errorHandler?.(error);
    });

    expect(result.current.error).toBe('Connection failed');
  });

  it('should disconnect on cleanup', () => {
    const { unmount } = renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
      }),
    );

    unmount();

    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should use production URL in production environment', () => {
    const originalEnv = process.env.NODE_ENV;
    vi.stubEnv('NODE_ENV', 'production');

    renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
      }),
    );

    expect(mockIo).toHaveBeenCalledWith('/notifications', expect.any(Object));

    vi.unstubAllEnvs();
  });

  it('should provide manual disconnect function', () => {
    const { result } = renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
      }),
    );

    act(() => {
      result.current.disconnect();
    });

    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should provide manual reconnect function', () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useWebSocket({
        userId: 'user-1',
        enabled: true,
      }),
    );

    act(() => {
      result.current.reconnect();
    });

    // Should disconnect first
    expect(mockSocket.disconnect).toHaveBeenCalled();

    // Should attempt to reconnect after delay
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockIo).toHaveBeenCalledTimes(2); // Initial + reconnect

    vi.useRealTimers();
  });
});
