# WebSocket Patterns & Conventions

## Authentication

### Cookie-based auth (preferred)

WebSocket connections authenticate via the HttpOnly `auth-token` cookie. The browser sends this cookie automatically when `withCredentials: true` is set on the client.

**Frontend (client):**
```ts
const socket = io('http://localhost:3001/notifications', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});
```

**Backend (gateway):**
The gateway reads the `auth-token` cookie from `client.handshake.headers.cookie` and verifies it with `JwtService.verifyAsync()`.

### Rules

- **NEVER** send JWT tokens via `auth.token` in socket.io config -- the cookie handles it
- **NEVER** read tokens from JavaScript (HttpOnly cookies are inaccessible to JS by design)
- **ALWAYS** use `withCredentials: true` on the client
- **ALWAYS** configure CORS with `credentials: true` on the gateway

---

## Namespaces

Each WebSocket domain uses a dedicated namespace:

| Namespace | Purpose | Auth required |
|---|---|---|
| `/notifications` | Real-time notification delivery | Yes (JWT) |
| `/chat` | Real-time chat messaging | Optional (visitors allowed) |

### Rules

- **NEVER** use `io()` without specifying a namespace (defaults to `/`, which has no gateway)
- **ALWAYS** connect to the specific namespace: `io('http://localhost:3001/chat')`
- In production, use relative paths: `io('/notifications')`

---

## Rooms

Rooms scope message delivery to relevant clients only:

| Room pattern | Used in | Purpose |
|---|---|---|
| `user:{userId}` | `/notifications` | Per-user notification delivery |
| `conversation:{conversationId}` | `/chat` | Per-conversation chat messages |

### Rules

- **NEVER** use `server.emit()` for targeted messages (broadcasts to ALL clients)
- **ALWAYS** use `server.to(room).emit()` for scoped delivery
- Clients must explicitly join rooms via subscribe events

---

## Event naming

Events use a namespace prefix to avoid collisions:

### Notification events (`/notifications` namespace)
- `notification:new` -- New notification received
- `notification:count_updated` -- Unread count changed
- `notification:subscribe` -- Client subscribes to notifications
- `notification:unsubscribe` -- Client unsubscribes
- `connection:confirmed` -- Server confirms authenticated connection

### Chat events (`/chat` namespace)
- `chat:join` -- Client joins a conversation room
- `chat:leave` -- Client leaves a conversation room
- `chat:newMessage` -- New message in a conversation
- `chat:typing` -- User is typing indicator
- `chat:joined` -- Server confirms room join

### Rules

- **ALWAYS** prefix events with their namespace domain (`notification:`, `chat:`)
- **NEVER** use generic event names like `message` or `newMessage` without prefix

---

## Anti-patterns

| Anti-pattern | Why it's wrong | Correct approach |
|---|---|---|
| `auth: { token: 'mock-token' }` | Backend rejects mock tokens | Use `withCredentials: true` (cookie auth) |
| `io()` without namespace | Connects to `/` which has no gateway | `io('/chat')` or `io('/notifications')` |
| `server.emit('newMessage', msg)` | Broadcasts to ALL clients globally | `server.to(room).emit('chat:newMessage', msg)` |
| `socket.on('message:${id}', ...)` | Events don't include dynamic IDs | Join a room, listen for `chat:newMessage` |
| Reading tokens from JS for WS auth | HttpOnly cookies can't be read by JS | Let browser send cookie automatically |
| `refetchInterval: 2000` with WS | Wastes bandwidth when WS is connected | Use longer intervals as fallback only |

---

## Frontend hook: `useWebSocket`

Located at `packages/web/src/hooks/use-websocket.ts`. Handles the `/notifications` namespace.

```ts
const { connected, error } = useWebSocket({
  userId: userId || '',
  enabled: !!userId,
  onNewNotification: () => refetch(),
  onCountUpdate: () => refetch(),
});
```

Key properties:
- `enabled` controls whether the connection is active
- Auth is automatic via cookie -- no `token` parameter needed
- Uses `logger` from `@/lib/logger` instead of `console.log`
- Includes automatic reconnection (max 5 attempts, 2s delay)

---

## Polling fallback strategy

When WebSocket is connected, reduce polling frequency. When disconnected, use shorter intervals as fallback:

```ts
refetchInterval: connected ? 60000 : 10000
```

This ensures data freshness even if WebSocket fails, without wasting bandwidth when it's working.
