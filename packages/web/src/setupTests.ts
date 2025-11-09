import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Notification API with getter/setter for permission
const NotificationMock = {
  _permission: 'default',
  get permission() {
    return this._permission;
  },
  set permission(value) {
    this._permission = value;
  },
  requestPermission: vi.fn(),
};

Object.defineProperty(global, 'Notification', {
  value: NotificationMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(window, 'Notification', {
  value: NotificationMock,
  writable: true,
  configurable: true,
});

// Mock atob/btoa
Object.defineProperty(global, 'atob', {
  value: vi.fn((str) => str),
  writable: true,
});

Object.defineProperty(global, 'btoa', {
  value: vi.fn((str) => str),
  writable: true,
});

// Mock PushManager
Object.defineProperty(global, 'PushManager', {
  value: vi.fn(),
  writable: true,
});

// Mock ResizeObserver (needed for Radix UI components)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));