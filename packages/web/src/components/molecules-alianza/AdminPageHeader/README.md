# AdminPageHeader Component

A consistent header layout for admin pages with title, description, breadcrumbs, actions, and navigation elements.

## Quick Start

```tsx
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';

<AdminPageHeader
  title="User Management"
  description="View and manage all users in the system"
  actions={<Button>Create User</Button>}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **required** | Main title of the page |
| `description` | `string \| ReactNode` | `undefined` | Optional description or subtitle |
| `actions` | `ReactNode` | `undefined` | Action buttons or elements |
| `backHref` | `string` | `undefined` | Back navigation link |
| `backLabel` | `string` | `"Back"` | Label for back button |
| `breadcrumbs` | `ReactNode` | `undefined` | Breadcrumb navigation |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Heading level for title |
| `icon` | `ReactNode` | `undefined` | Icon before title |
| `badge` | `ReactNode` | `undefined` | Badge after title |
| `showDivider` | `boolean` | `false` | Show divider below header |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `children` | `ReactNode` | `undefined` | Additional content |
| `className` | `string` | `undefined` | Wrapper className |
| `titleClassName` | `string` | `undefined` | Title className |
| `descriptionClassName` | `string` | `undefined` | Description className |
| `actionsClassName` | `string` | `undefined` | Actions className |

## Usage Examples

### Basic Header
```tsx
<AdminPageHeader
  title="Dashboard"
  description="Welcome to your admin dashboard"
/>
```

### With Back Button
```tsx
<AdminPageHeader
  title="User Details"
  description="View detailed user information"
  backHref="/admin/users"
  backLabel="Back to Users"
/>
```

### With Actions
```tsx
<AdminPageHeader
  title="Users"
  description="Manage all users"
  actions={
    <>
      <Button variant="outline" iconLeft={<Download />}>
        Export
      </Button>
      <Button iconLeft={<Plus />}>
        Create User
      </Button>
    </>
  }
/>
```

### With Breadcrumbs
```tsx
<AdminPageHeader
  title="Edit User"
  breadcrumbs={
    <BreadcrumbNavigation
      items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Users', href: '/admin/users' },
        { label: 'Edit', current: true }
      ]}
    />
  }
  actions={<Button>Save Changes</Button>}
/>
```

### With Icon and Badge
```tsx
<AdminPageHeader
  title="New Dashboard"
  description="Try our redesigned dashboard"
  icon={<Home className="h-6 w-6 text-primary" />}
  badge={<Badge variant="success">New</Badge>}
  actions={<Button>Get Started</Button>}
/>
```

### With Custom Content (Tabs)
```tsx
<AdminPageHeader
  title="Requests"
  description="View and manage service requests"
  actions={<Button iconLeft={<Filter />} variant="outline">Filters</Button>}
>
  <div className="flex gap-2">
    <Button variant="outline" size="sm">All</Button>
    <Button variant="nude" size="sm">Pending</Button>
    <Button variant="nude" size="sm">In Progress</Button>
    <Button variant="nude" size="sm">Completed</Button>
  </div>
</AdminPageHeader>
```

### Loading State
```tsx
<AdminPageHeader
  title="Dashboard"
  description="Loading..."
  loading={true}
  backHref="/admin"
  actions={<Button>Action</Button>}
/>
```

### Complete Example
```tsx
<AdminPageHeader
  title="Advanced Configuration"
  description="Configure advanced system settings"
  backHref="/admin/settings"
  backLabel="Back to Settings"
  icon={<Settings className="h-6 w-6 text-primary" />}
  badge={<Badge variant="warning">Advanced</Badge>}
  breadcrumbs={
    <BreadcrumbNavigation
      items={[
        { label: 'Home', href: '/admin' },
        { label: 'Settings', href: '/admin/settings' },
        { label: 'Advanced', current: true }
      ]}
    />
  }
  showDivider
  actions={
    <>
      <Button variant="outline">Reset</Button>
      <Button>Save Changes</Button>
    </>
  }
>
  <div className="p-4 bg-muted rounded-md">
    Additional configuration options
  </div>
</AdminPageHeader>
```

## Features

- ✅ Flexible page title with customizable heading levels (h1-h6)
- ✅ Optional description (string or React node)
- ✅ Back navigation with animated arrow icon
- ✅ Breadcrumb integration support
- ✅ Action buttons area for primary actions
- ✅ Icon support before title
- ✅ Badge support after title
- ✅ Custom content slots for tabs, filters, etc.
- ✅ Loading skeleton state
- ✅ Optional divider/separator
- ✅ Responsive layout (mobile-first)
- ✅ Custom styling props for fine-grained control
- ✅ Forward ref support
- ✅ Full HTML attribute forwarding
- ✅ TypeScript support with comprehensive types

## Responsive Behavior

- **Mobile**: Stacked layout (flex-col)
- **Desktop**: Inline layout (md:flex-row)
- **Actions**: Wrap on small screens (flex-wrap)
- **Text**: Responsive sizing (text-2xl md:text-3xl)

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- ARIA attributes support
- Keyboard navigation support (for links/buttons)
- Screen reader friendly

## Testing

Run tests:
```bash
npm run test -- molecules-alianza/AdminPageHeader --run
```

View coverage:
```bash
npm run test -- molecules-alianza/AdminPageHeader --run --coverage
```

## Storybook

View all examples in Storybook:
```bash
npm run storybook
```

Navigate to: **Molecules > AdminPageHeader**

## Integration

### Dependencies
- `next/link` - Back button navigation
- `lucide-react` - ArrowLeft icon
- `@/lib/utils` - cn utility
- `@/components/molecules-alianza/Breadcrumb` - Optional breadcrumb
- `@/components/molecules-alianza/Button` - Optional actions
- `@/components/atoms-alianza/Badge` - Optional badge

### Used In
This component is used across 17+ admin pages including:
- Dashboard
- User Management
- Request Management
- Service Catalog
- Settings
- Analytics
- And more...

## Migration from Old Component

The component is 100% backward compatible with the old `molecules/admin-page-header`:

```diff
- import { AdminPageHeader } from '@/components/molecules/admin-page-header';
+ import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
```

All existing props work the same way. New features are optional.

## Performance

- Lightweight render
- Conditional rendering for optional features
- Optimized skeleton loading
- No unnecessary re-renders

## Best Practices

1. **Always provide a title** - It's required and crucial for navigation
2. **Use descriptions** - Help users understand the page purpose
3. **Keep actions focused** - 1-3 primary actions maximum
4. **Use breadcrumbs** - For deep navigation hierarchies
5. **Add loading states** - For better perceived performance
6. **Consider mobile** - Test on small screens
7. **Use semantic headings** - Follow proper hierarchy (h1 > h2 > h3)

## Common Patterns

### List Page
```tsx
<AdminPageHeader
  title="Users"
  description="Manage all users in the system"
  actions={
    <>
      <Button variant="outline" iconLeft={<Download />}>Export</Button>
      <Button iconLeft={<Plus />}>Create User</Button>
    </>
  }
/>
```

### Detail Page
```tsx
<AdminPageHeader
  title={user.name}
  description={user.email}
  backHref="/admin/users"
  backLabel="Back to Users"
  actions={<Button iconLeft={<Edit />}>Edit User</Button>}
/>
```

### Edit/Create Page
```tsx
<AdminPageHeader
  title="Create User"
  description="Add a new user to the system"
  backHref="/admin/users"
  actions={
    <>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </>
  }
/>
```

### Dashboard Page
```tsx
<AdminPageHeader
  title="Dashboard"
  description="Overview of system metrics"
  actions={<Button variant="outline">Refresh</Button>}
>
  <div className="flex gap-2">
    <Button variant="nude" size="sm">Today</Button>
    <Button variant="nude" size="sm">Week</Button>
    <Button variant="nude" size="sm">Month</Button>
  </div>
</AdminPageHeader>
```

## Troubleshooting

### Title not showing
- Ensure `title` prop is provided (it's required)

### Actions not aligned
- Check if you're using the `actions` prop correctly
- Verify button components are wrapped in fragment if multiple

### Back button not working
- Ensure `backHref` prop is provided
- Check Next.js Link is working correctly

### Breadcrumbs not showing
- Verify you're passing the `breadcrumbs` prop
- Check BreadcrumbNavigation is imported correctly

### Loading skeleton not appearing
- Set `loading={true}` prop
- Check component is not cached

## Support

For issues or questions:
1. Check the Storybook examples
2. Review the migration summary
3. Run the test suite
4. Consult the component source code

## Version History

- **v1.0.0** (2026-02-08) - Initial migration to molecules-alianza
  - 76 comprehensive tests
  - 27 Storybook stories
  - 10 new features
  - 100% backward compatible
