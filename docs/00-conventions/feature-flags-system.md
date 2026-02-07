# Feature Flags System

## Overview

The Feature Flags system provides a flexible, database-driven approach to enable/disable platform features dynamically without code deployments. This allows for gradual feature rollouts, A/B testing, and better operational control.

## Architecture

### Database Layer

**Models**:
- `FeatureFlag` - Stores feature configuration and status
- `FeatureFlagHistory` - Audit trail of all feature changes

**Key Fields**:
- `key` (unique) - Feature identifier (e.g., "chat", "analytics")
- `status` - ENABLED | DISABLED | BETA | DEPRECATED
- `config` - JSON field for feature-specific settings
- `enabledAt` / `disabledAt` - Timestamps for tracking
- `icon`, `badge`, `sortOrder` - UI metadata

### Backend Layer

**Location**: `/packages/api/src/feature-flags/`

**Service** (`feature-flags.service.ts`):
- `isFeatureEnabled(key)` - Check if feature is enabled
- `getAllFeatures()` - Get all feature flags
- `toggleFeature(key, enabled, userId)` - Toggle feature with audit
- `updateFeatureConfig(key, config, userId)` - Update configuration

**tRPC Router** (`/trpc/routers/feature-flags.router.ts`):
- `isEnabled` (public) - Check feature status
- `getAll` (public) - List all features
- `toggle` (protected) - Admin toggle
- `updateConfig` (protected) - Admin config update
- `getHistory` (protected) - Audit trail

### Frontend Layer

**Hook** (`/hooks/useFeatureFlag.ts`):
```typescript
const { isEnabled: chatEnabled, isLoading } = useFeatureFlag('chat');
```

**Admin UI** (`/admin/settings/addons`):
- Card-based layout for all features
- Toggle switches for enable/disable
- Visual status indicators

## Usage Patterns

### 1. Checking Feature Availability

**Frontend**:
```typescript
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

function MyComponent() {
  const { isEnabled: chatEnabled } = useFeatureFlag('chat');

  if (!chatEnabled) return null;

  return <ChatPanel />;
}
```

**Backend**:
```typescript
const isEnabled = await featureFlagsService.isFeatureEnabled('chat');
if (!isEnabled) {
  throw new ForbiddenException('Chat feature is disabled');
}
```

### 2. Conditional Rendering (Best Practice)

Use an IIFE pattern to avoid breaking React hooks rules:

```typescript
{(() => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isEnabled } = useFeatureFlag('chat');
  return isEnabled ? <ChatComponent /> : null;
})()}
```

### 3. Feature Configuration

Features can store JSON configuration:

```typescript
const feature = await featureFlagsService.getFeatureByKey('chat');
const config = feature.config; // { enablePublicChat: true, ... }
```

## Available Features

### Chat (Enabled by Default)

**Key**: `chat`
**Status**: ENABLED
**Config**:
```json
{
  "enablePublicChat": true,
  "enableRequestChat": true,
  "enableChannels": true
}
```

**Use Cases**:
- Public chat widget for visitors
- Internal request conversations
- Team channels

### Analytics (Disabled by Default)

**Key**: `analytics`
**Status**: DISABLED
**Badge**: "Pro"

Placeholder for future analytics features.

### Notifications (Enabled by Default)

**Key**: `notifications`
**Status**: ENABLED
**Config**:
```json
{
  "enablePush": true,
  "enableEmail": true,
  "enableInApp": true
}
```

## Request-Chat Integration

### Database Relationship

```prisma
model Conversation {
  type     ConversationType @default(CLIENT_SUPPORT)
  requestId String? @db.ObjectId
  request   Request? @relation("RequestConversations", ...)
}

model Request {
  conversations Conversation[] @relation("RequestConversations")
}
```

**Conversation Types**:
- `CLIENT_SUPPORT` - Public visitor chat
- `INTERNAL_REQUEST` - Team chat for specific request
- `CHANNEL` - Internal team channels

### Creating Request Conversations

**Backend**:
```typescript
const conversation = await chatService.getOrCreateRequestConversation(requestId);
```

**Frontend**:
```typescript
const mutation = trpc.chat.getOrCreateRequestConversation.useMutation();
mutation.mutate({ requestId });
```

### UI Component

**Location**: `/components/organisms/request/RequestChatPanel.tsx`

**Features**:
- Auto-create conversation on first open
- Real-time message polling (3s interval)
- Keyboard shortcuts (Enter to send)
- Conditional rendering via feature flag

## Admin Management

### Accessing Settings

1. Navigate to `/admin/settings`
2. Click "Addons & Features" card
3. Toggle features on/off
4. Changes are instant (no deployment needed)

### Audit Trail

All feature changes are logged in `FeatureFlagHistory`:
- Who made the change (userId)
- What changed (previousValue, newValue)
- When (createdAt)

Access via tRPC:
```typescript
const history = await trpc.featureFlags.getHistory.query({ key: 'chat' });
```

## Seeding Feature Flags

**Location**: `/packages/api/prisma/seeds/feature-flags.seed.ts`

**Run**:
```bash
cd packages/api
npx ts-node prisma/seeds/feature-flags.seed.ts
```

**Adding New Features**:
1. Add to `defaultFeatureFlags` array in seed file
2. Run seed script
3. Feature appears in admin UI

## Performance Considerations

### Caching Strategy

Frontend queries use 5-minute cache:
```typescript
useQuery({ key }, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
});
```

### Database Indexes

```prisma
@@index([key])    // Fast lookup by key
@@index([status]) // Filter by status
```

### Polling

Request chat polls every 3 seconds for new messages. Consider WebSocket upgrade for production.

## Security

### Protected Routes

Only admin users can toggle features:
```typescript
toggle: protectedProcedure // Requires authentication
  .mutation(async ({ ctx }) => {
    if (!ctx.user) throw new Error('Unauthorized');
    // ...
  });
```

### Public Routes

Feature checking is public (no auth required):
```typescript
isEnabled: publicProcedure // Anyone can check
  .query(async ({ input }) => {
    return await service.isFeatureEnabled(input.key);
  });
```

## Future Enhancements

### Planned Features

1. **A/B Testing** - Percentage-based rollouts
2. **Feature Scheduling** - Auto-enable/disable at specific times
3. **Multi-Tenant Support** - Per-company feature flags
4. **Dependency Graph** - Features that depend on other features
5. **Usage Analytics** - Track feature adoption

### Additional Addons

- **Automation** - Workflows, triggers, scheduled actions
- **Billing** - Stripe integration, subscriptions
- **AI Assistant** - ChatGPT integration
- **Custom Branding** - White-label, custom domains

## Troubleshooting

### Feature Not Appearing

1. Check database: `db.feature_flags.find({ key: "chat" })`
2. Run seed script if missing
3. Clear browser cache (5-minute stale time)

### Toggle Not Working

1. Check user authentication (admin only)
2. Check browser console for errors
3. Verify backend logs for mutation errors

### Chat Panel Not Showing

1. Verify `chat` feature is ENABLED
2. Check request detail page props (requestId must be valid)
3. Verify ConversationType enum in Prisma schema

## Related Documentation

- `/docs/00-conventions/documentation-guidelines.md` - How to document features
- `/docs/05-testing/backend-testing-guide.md` - Testing feature flags
- Backend service tests: `/packages/api/src/feature-flags/feature-flags.service.spec.ts` (to be created)

## Migration Notes

### Breaking Changes

None - this is a new feature. All existing features work as before.

### Backward Compatibility

- Chat addon defaults to ENABLED (existing behavior preserved)
- Conversation types default to CLIENT_SUPPORT (existing conversations unaffected)
- Request-Conversation relationship is optional (nullable)

## Files Modified/Created

### Backend
- **Created**: `src/feature-flags/feature-flags.service.ts`
- **Created**: `src/feature-flags/feature-flags.module.ts`
- **Created**: `src/trpc/routers/feature-flags.router.ts`
- **Created**: `src/trpc/schemas/feature-flags.schemas.ts`
- **Created**: `prisma/seeds/feature-flags.seed.ts`
- **Modified**: `src/app.module.ts` - Added FeatureFlagsModule
- **Modified**: `src/trpc/trpc.router.ts` - Added featureFlags router
- **Modified**: `src/chat/chat.service.ts` - Added getOrCreateRequestConversation()
- **Modified**: `src/trpc/routers/chat.router.ts` - Added request conversation procedure
- **Modified**: `prisma/schema.prisma` - Added FeatureFlag models, ConversationType enum

### Frontend
- **Created**: `hooks/useFeatureFlag.ts`
- **Created**: `app/[lang]/(private)/admin/settings/addons/page.tsx`
- **Created**: `components/organisms/request/RequestChatPanel.tsx`
- **Modified**: `app/[lang]/(private)/admin/settings/page.tsx` - Added Addons card
- **Modified**: `components/organisms/request/RequestDetailOrganism.tsx` - Integrated chat panel
- **Modified**: `components/organisms/request/index.ts` - Export RequestChatPanel

## Contributors

- Architecture & Implementation: Claude Sonnet 4.5
- User Requirements: Alkitu Development Team
- Based on industry best practices for feature flag systems
