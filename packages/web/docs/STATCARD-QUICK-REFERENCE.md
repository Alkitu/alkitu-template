# StatCard Component - Quick Reference

## Import
```typescript
import { StatCard } from '@/components/molecules-alianza/StatCard';
```

## Basic Usage
```tsx
<StatCard
  label="Total Users"
  value={1234}
  icon={Users}
/>
```

## Common Patterns

### Dashboard Metric with Trend
```tsx
<StatCard
  label="Revenue"
  value={54320}
  icon={DollarSign}
  iconColor="text-green-500"
  trend="+18%"
  trendDirection="up"
  formatNumber
/>
```

### Warning Indicator
```tsx
<StatCard
  label="Pending Reviews"
  value={23}
  icon={AlertCircle}
  iconColor="text-warning"
  variant="warning"
  subtitle="Requires attention"
/>
```

### Success Metric with Badge
```tsx
<StatCard
  label="Tasks Completed"
  value={127}
  icon={CheckCircle}
  iconColor="text-success"
  variant="success"
  trend="+15%"
  trendDirection="up"
  badge="On Track"
  badgeVariant="success"
/>
```

### Clickable Navigation Card
```tsx
<StatCard
  label="Active Orders"
  value={892}
  icon={ShoppingCart}
  trend="+5%"
  trendDirection="up"
  onClick={() => router.push('/orders')}
/>
```

### Large Number Formatting
```tsx
<StatCard
  label="Total Downloads"
  value={1234567}
  icon={TrendingUp}
  formatNumber      // Displays: 1.2M
  decimals={1}
  trend="+12%"
  trendDirection="up"
/>
```

### Complete Dashboard Card
```tsx
<StatCard
  label="Monthly Revenue"
  value={125480}
  icon={DollarSign}
  iconColor="text-green-500"
  subtitle="Subscription income"
  trend="+23.5%"
  trendDirection="up"
  comparison="vs last month"
  variant="success"
  badge="New Record"
  badgeVariant="success"
  formatNumber
  decimals={1}
/>
```

### Dashboard Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard label="Users" value={12456} icon={Users} trend="+12%" trendDirection="up" formatNumber />
  <StatCard label="Revenue" value={54320} icon={DollarSign} trend="+18%" trendDirection="up" formatNumber />
  <StatCard label="Orders" value={892} icon={ShoppingCart} trend="+5%" trendDirection="up" />
  <StatCard label="Success Rate" value="98.5%" icon={CheckCircle} variant="success" />
</div>
```

## Prop Reference

### Required Props
| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label/title for the statistic |
| `value` | `number \| string` | Primary value to display |
| `icon` | `LucideIcon` | Icon component from lucide-react |

### Optional Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `iconColor` | `string` | `'text-primary'` | Tailwind color class for icon |
| `subtitle` | `string` | - | Additional description text |
| `trend` | `string` | - | Trend indicator text ("+12%") |
| `trendDirection` | `'up' \| 'down' \| 'neutral'` | - | Visual trend arrow |
| `comparison` | `string` | - | Comparison text ("vs last month") |
| `isLoading` | `boolean` | `false` | Show loading skeleton |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'default'` | Card variant with colored border |
| `badge` | `string` | - | Badge text to display |
| `badgeVariant` | `BadgeVariant` | `'default'` | Badge color variant |
| `formatNumber` | `boolean` | `false` | Auto-format numbers (1K, 1M, 1B) |
| `decimals` | `number` | `1` | Decimal places for formatted numbers |
| `onClick` | `() => void` | - | Click handler (makes card interactive) |
| `clickable` | `boolean` | `false` | Make card focusable/clickable |
| `chart` | `ReactNode` | - | Mini chart or sparkline element |
| `className` | `string` | - | Additional CSS classes |
| `data-testid` | `string` | - | Test ID for testing |

## Number Formatting Examples

| Input | Output (decimals=1) | Output (decimals=0) | Output (decimals=2) |
|-------|---------------------|---------------------|---------------------|
| 999 | 999 | 999 | 999 |
| 1,234 | 1.2K | 1K | 1.23K |
| 12,345 | 12.3K | 12K | 12.35K |
| 1,234,567 | 1.2M | 1M | 1.23M |
| 1,234,567,890 | 1.2B | 1B | 1.23B |

## Trend Direction Colors

| Direction | Color | Use Case |
|-----------|-------|----------|
| `up` | Success (green) | Positive growth, increases |
| `down` | Error (red) | Declines, decreases |
| `neutral` | Muted (gray) | No change, stable |
| (none) | Primary | Default trend color |

## Variant Colors

| Variant | Border Color | Use Case |
|---------|--------------|----------|
| `default` | None | Standard metrics |
| `success` | Green | Positive metrics, achievements |
| `warning` | Yellow | Attention needed, pending |
| `error` | Red | Problems, failures |
| `neutral` | Gray | Informational, neutral data |

## Icons Commonly Used

```typescript
import {
  Users,           // User counts
  DollarSign,      // Revenue, money
  ShoppingCart,    // Orders, purchases
  TrendingUp,      // Growth, increases
  TrendingDown,    // Declines
  Activity,        // Performance, activity
  Clock,           // Time, duration
  CheckCircle,     // Success, completed
  AlertCircle,     // Warnings, alerts
  Star,            // Ratings, premium
} from 'lucide-react';
```

## Accessibility Features

- ✅ Semantic HTML (`<h3>` for labels)
- ✅ ARIA labels on trend arrows
- ✅ Keyboard navigation (Enter/Space when clickable)
- ✅ Focus management with visible focus ring
- ✅ Icon hidden from screen readers (`aria-hidden`)
- ✅ Button role when interactive
- ✅ Zero axe violations

## Best Practices

1. **Use formatNumber for large numbers**: Makes metrics more readable
2. **Add trend direction for clarity**: Visual arrows help users understand changes
3. **Choose appropriate variants**: Match card color to metric type
4. **Include comparison context**: Help users understand the timeframe
5. **Use consistent icons**: Maintain visual consistency across dashboard
6. **Make important metrics clickable**: Enable navigation to details
7. **Add loading states**: Provide feedback during data fetches
8. **Use badges for status**: Highlight special states (New, Live, etc.)

## Performance Tips

- Component is lightweight (~6.4KB)
- No runtime dependencies beyond existing atoms/molecules
- Efficient number formatting algorithm
- Memoize large data arrays when using with many cards
- Use `React.memo()` if passing complex chart components

## Testing

The component is fully tested with:
- 90 comprehensive tests
- 100% code coverage
- All edge cases validated
- Accessibility compliance verified

See `STATCARD-TEST-REPORT.md` for detailed test documentation.

## Storybook

View all examples in Storybook:
```bash
npm run storybook
```

Navigate to: `Molecules → StatCard`

## TypeScript Support

Full TypeScript support with exported types:
```typescript
import type { StatCardProps, TrendDirection, StatCardVariant } from '@/components/molecules-alianza/StatCard';
```
