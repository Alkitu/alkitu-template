# 🔧 Alkitu API Backend

This package contains the NestJS backend for the Alkitu application. It provides a multi-protocol API with support for tRPC, GraphQL, and REST.

## ✨ Features

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript**: Full type safety throughout the application.
- **Prisma**: A next-generation ORM for type-safe database access.
- **tRPC, GraphQL, and REST**: A multi-protocol API to serve different clients and use cases.
- **JWT Authentication**: Secure, token-based authentication using Passport.js.
- **Swagger**: Automatic API documentation for the REST endpoints.

## 🚀 Getting Started

### 1. Prerequisites

- A MongoDB database instance is running.
- All dependencies must be installed from the root of the monorepo (`npm install`).

### 2. Running the Development Server

To start the API backend in development mode, run the following command from the root of the monorepo:

```bash
npm run dev:api
```

This will start the NestJS development server, typically on **http://localhost:3001**.

## 📁 Folder Structure

- `src/app.module.ts`: The root module of the application.
- `src/main.ts`: The entry point of the application, where the server is initialized.
- `src/trpc/`: Contains the tRPC routers, procedures, and context.
- `src/users/`: A NestJS module for user-related operations.
- `src/auth/`: A NestJS module for authentication-related logic.
- `src/notification/`: A NestJS module for the notification system.
- `src/billing/`: A NestJS module for billing and subscription management.
- `src/group/`: A NestJS module for group and team management.
- `prisma/`: Contains the Prisma schema and generated client.

## 📚 API Documentation

### REST API (Swagger)
The documentation for the REST API is automatically generated and available at **http://localhost:3001/api/docs**.

### tRPC API

#### Available Procedures

##### User Management
```typescript
// Get current user profile
user.getProfile()

// Update user profile
user.updateProfile({ name: string, email: string })

// Get user by ID
user.getById({ id: string })
```

##### Notification System
```typescript
// Get user notifications
notification.getAll()

// Create new notification
notification.create({
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  userId: string
})

// Mark notification as read
notification.markAsRead({ id: string })

// Delete notification
notification.delete({ id: string })
```

##### Authentication
```typescript
// Login user
auth.login({ email: string, password: string })

// Register new user
auth.register({ email: string, password: string, name: string })

// Refresh authentication token
auth.refresh({ refreshToken: string })
```

#### tRPC Client Usage

To use tRPC in your frontend:

```typescript
import { trpc } from '@/lib/trpc';

// In a React component
const { data: notifications, isLoading } = trpc.notification.getAll.useQuery();

const createNotification = trpc.notification.create.useMutation({
  onSuccess: () => {
    // Refetch notifications
    trpc.notification.getAll.invalidate();
  }
});

// Create a notification
const handleCreate = () => {
  createNotification.mutate({
    title: 'New Notification',
    message: 'This is a test notification',
    type: 'info',
    userId: 'user-id'
  });
};
```

#### Error Handling

```typescript
// tRPC automatically provides type-safe error handling
const { data, error, isLoading } = trpc.user.getProfile.useQuery();

if (error) {
  console.error('API Error:', error.message);
  // Error types are automatically inferred
}
```

### GraphQL API
The GraphQL schema can be explored through the GraphQL Playground at **http://localhost:3001/graphql**.

#### Example Queries

```graphql
# Get user profile
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    role
    createdAt
  }
}

# Get notifications
query GetNotifications {
  notifications {
    id
    title
    message
    type
    isRead
    createdAt
  }
}
```

#### Example Mutations

```graphql
# Create notification
mutation CreateNotification($input: CreateNotificationInput!) {
  createNotification(input: $input) {
    id
    title
    message
    type
  }
}

# Update user
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    name
    email
  }
}
```

## 🧪 Testing

### Running Tests

To run the tests for the API package:

```bash
# Run all API tests
npm run test:api

# Run tests with coverage
npm run test:api --coverage

# Run tests in watch mode
npm run test:watch --workspace=@alkitu/api

# Run specific test file
npm run test:api -- notification.service.spec.ts
```

### Test Structure

- **Unit Tests**: `src/**/*.spec.ts` - Test individual services and utilities
- **Integration Tests**: `test/**/*.e2e-spec.ts` - Test complete API endpoints
- **Test Configuration**: Jest with MongoDB Memory Server for isolated testing

### Example Test

```typescript
// notification.service.spec.ts
describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a notification', async () => {
    const notification = await service.create({
      title: 'Test',
      message: 'Test message',
      type: 'info',
      userId: 'user-1'
    });

    expect(notification).toBeDefined();
    expect(notification.title).toBe('Test');
  });
});
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="mongodb://localhost:27017/alkitu?replicaSet=rs0&directConnection=true"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"

# Server
PORT=3001
CORS_ORIGIN="http://localhost:3000"

# Redis (optional)
REDIS_URL="redis://localhost:6379"
```

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database (development)
npm run db:push

# Run migrations (production)
npm run migrate

# Open Prisma Studio
npm run db:studio
```

## 🏗️ Architecture

### Module Structure

```
src/
├── app.module.ts           # Root module
├── main.ts                 # Application entry point
├── prisma.service.ts       # Database service
├── auth/                   # Authentication module
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── strategies/
├── users/                  # Users module
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.controller.ts
├── notification/           # Notifications module
│   ├── notification.module.ts
│   ├── notification.service.ts
│   └── notification.controller.ts
└── trpc/                   # tRPC configuration
    ├── trpc.module.ts
    ├── trpc.router.ts
    └── routers/
```

### Key Services

- **PrismaService**: Database connection and client management
- **AuthService**: JWT token generation and validation
- **UsersService**: User CRUD operations
- **NotificationService**: Notification system management
- **TrpcRouter**: Type-safe API procedures
