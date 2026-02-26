'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { logger } from '@/lib/logger';

interface UseWebSocketProps {
  userId: string;
  enabled?: boolean;
  onNewNotification?: (notification: any) => void;
  onCountUpdate?: () => void;
  onConnectionChange?: (connected: boolean) => void;
}

interface WebSocketState {
  connected: boolean;
  socket: Socket | null;
  error: string | null;
  reconnectAttempts: number;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000; // 2 seconds

export function useWebSocket({
  userId,
  enabled = true,
  onNewNotification,
  onCountUpdate,
  onConnectionChange,
}: UseWebSocketProps) {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    socket: null,
    error: null,
    reconnectAttempts: 0,
  });

  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs to avoid recreating connect function when callbacks change
  const onNewNotificationRef = useRef(onNewNotification);
  const onCountUpdateRef = useRef(onCountUpdate);
  const onConnectionChangeRef = useRef(onConnectionChange);

  // Update refs when callbacks change
  useEffect(() => {
    onNewNotificationRef.current = onNewNotification;
  }, [onNewNotification]);

  useEffect(() => {
    onCountUpdateRef.current = onCountUpdate;
  }, [onCountUpdate]);

  useEffect(() => {
    onConnectionChangeRef.current = onConnectionChange;
  }, [onConnectionChange]);

  const connect = useCallback(() => {
    if (!enabled || !userId || socketRef.current?.connected) {
      return;
    }

    const websocketUrl =
      process.env.NODE_ENV === 'production'
        ? '/notifications'
        : 'http://localhost:3001/notifications';

    logger.debug('WebSocket connecting', { url: websocketUrl });

    const socket = io(websocketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      upgrade: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_DELAY,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      logger.debug('WebSocket connected', { socketId: socket.id });
      setState((prev) => ({
        ...prev,
        connected: true,
        error: null,
        reconnectAttempts: 0,
      }));
      onConnectionChangeRef.current?.(true);
    });

    socket.on('disconnect', (reason) => {
      logger.debug('WebSocket disconnected', { reason });
      setState((prev) => ({
        ...prev,
        connected: false,
        error: `Disconnected: ${reason}`,
      }));
      onConnectionChangeRef.current?.(false);
    });

    socket.on('connect_error', (error) => {
      logger.error('WebSocket connection error', { error: error.message });
      setState((prev) => ({
        ...prev,
        connected: false,
        error: error.message,
        reconnectAttempts: prev.reconnectAttempts + 1,
      }));
    });

    // Notification events
    socket.on('notification:new', (notification) => {
      logger.debug('New notification received via WebSocket');
      onNewNotificationRef.current?.(notification);
      onCountUpdateRef.current?.();
    });

    socket.on('notification:count_updated', () => {
      logger.debug('Notification count updated via WebSocket');
      onCountUpdateRef.current?.();
    });

    socket.on('notification_read', () => {
      onCountUpdateRef.current?.();
    });

    socket.on('connection:confirmed', (data) => {
      logger.debug('WebSocket connection confirmed', { userId: data.userId });
    });

    // Subscribe to notifications
    socket.emit('notification:subscribe');

    setState((prev) => ({ ...prev, socket }));
  }, [enabled, userId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setState(prevState => ({
      ...prevState,
      connected: false,
      socket: null,
      error: null,
      reconnectAttempts: 0,
    }));
  }, []);

  const reconnect = () => {
    disconnect();

    if (state.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectTimeoutRef.current = setTimeout(() => {
        logger.debug('WebSocket reconnecting', {
          attempt: `${state.reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS}`,
        });
        connect();
      }, RECONNECT_DELAY);
    }
  };

  // Initialize connection
  useEffect(() => {
    if (enabled && userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, userId, connect]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      // Don't call disconnect here to avoid loops
    };
  }, []);

  return {
    connected: state.connected,
    socket: state.socket,
    error: state.error,
    reconnectAttempts: state.reconnectAttempts,
    connect,
    disconnect,
    reconnect,
  };
}
