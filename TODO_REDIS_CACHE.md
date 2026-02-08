# TODO: Redis Cache Implementation

**Priority**: Post-Launch Optimization
**Estimated Time**: 2 hours
**Status**: ⏸️ POSTPONED (Complete core features first)

---

## Current State

✅ Redis 7 already configured in Docker Compose (dev & prod)
✅ Container: `alkitu-redis-dev` on port `6379`
✅ Environment variable: `REDIS_URL=redis://redis:6379`
❌ **NOT being used in code** (needs integration)

---

## Why Implement This Later?

### Performance Impact
- **Without cache**: 1,000+ MongoDB queries/second for feature flag checks
- **With cache**: 99% reduction in DB queries (1ms vs 50ms latency)
- **Cost savings**: 90%+ reduction in database read operations

### Current Workaround
Feature flags work correctly, they're just slower than optimal. Not a blocker for launch.

---

## Implementation Steps (When Ready)

### 1. Install Dependencies (~5min)
```bash
cd packages/api
npm install ioredis @nestjs/cache-manager cache-manager-ioredis-yet
```

### 2. Create RedisModule (~15min)

**File**: `/packages/api/src/redis/redis.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        ttl: 300, // 5 minutes default
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
```

### 3. Integrate in FeatureFlagsService (~30min)

**File**: `/packages/api/src/feature-flags/feature-flags.service.ts`

```typescript
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class FeatureFlagsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getFeatureFlag(key: string): Promise<FeatureFlag | null> {
    const cacheKey = `feature-flag:${key}`;

    // Try cache first
    const cached = await this.cacheManager.get<FeatureFlag>(cacheKey);
    if (cached) {
      return cached;
    }

    // Cache miss - fetch from DB
    const featureFlag = await this.prisma.featureFlag.findUnique({
      where: { key },
    });

    if (featureFlag) {
      // Store in cache (TTL: 5 minutes)
      await this.cacheManager.set(cacheKey, featureFlag, 300000);
    }

    return featureFlag;
  }

  async toggleFeature(key: string, status: FeatureFlagStatus): Promise<FeatureFlag> {
    const updated = await this.prisma.featureFlag.update({
      where: { key },
      data: { status },
    });

    // Invalidate cache on update
    await this.cacheManager.del(`feature-flag:${key}`);

    return updated;
  }
}
```

### 4. Update Middleware (~15min)

**File**: `/packages/api/src/trpc/middlewares/roles.middleware.ts`

```typescript
export const requireFeature = (featureKey: string) => {
  return t.middleware(async ({ ctx, next }) => {
    // Use cached version from FeatureFlagsService
    const featureFlag = await ctx.featureFlagsService.getFeatureFlag(featureKey);

    if (!featureFlag || featureFlag.status !== 'ENABLED') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Feature "${featureKey}" is not enabled`,
      });
    }

    return next();
  });
};
```

### 5. Testing (~1h)
- Unit tests: Cache hit/miss scenarios
- Integration tests: Cache invalidation
- Performance tests: Before/after benchmarks

---

## Additional Redis Use Cases (Future)

Once Redis is integrated, it can also be used for:
- **Session storage** (NextAuth, Passport)
- **Rate limiting** (more efficient throttling)
- **Job queues** (BullMQ for async tasks)
- **WebSocket pub/sub** (real-time scaling)
- **API response cache** (cache entire endpoints)

---

## Monitoring & Metrics (Post-Implementation)

Track these metrics to measure impact:
- Cache hit ratio (target: >95%)
- Average response time (target: <5ms)
- MongoDB query reduction (target: >90%)
- Redis memory usage

---

## References

- Redis Docker config: `docker-compose.dev.yml`
- Feature flags without cache: `/packages/api/src/feature-flags/feature-flags.service.ts`
- tRPC middleware: `/packages/api/src/trpc/middlewares/roles.middleware.ts`
- Security Phase 2 doc: `PHASE2_RESOURCE_ACCESS_CONTROL_IMPLEMENTATION.md`

---

**When to implement**: After core features are complete and stable, before handling high traffic loads.
