
// Global test setup
console.log('Global test setup loaded.');

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'test-secret';

// Global test timeout
jest.setTimeout(30000);
