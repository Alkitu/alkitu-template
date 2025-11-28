
export const createMockNotification = (overrides = {}) => ({
  id: 'notif-1',
  userId: 'user-1',
  message: 'Test notification',
  type: 'INFO',
  link: 'http://example.com',
  read: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

export const createMockNotificationPreference = (overrides = {}) => ({
  id: 'pref-1',
  userId: 'user-1',
  emailEnabled: true,
  emailTypes: ['INFO'],
  pushEnabled: true,
  pushTypes: ['INFO'],
  inAppEnabled: true,
  inAppTypes: ['INFO'],
  smsEnabled: false,
  smsTypes: [],
  promotionalEnabled: false,
  securityEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});
