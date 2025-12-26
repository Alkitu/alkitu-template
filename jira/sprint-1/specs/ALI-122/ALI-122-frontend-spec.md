# ALI-122: Users & Roles Management - Frontend Specification

## Overview

This document details the complete frontend implementation for the Users & Roles Management system, including all pages, components (Atomic Design), state management, and integration with the backend tRPC API.

**Implementation Status**: ~70% Complete
- ✅ Admin pages structure (list, create, detail)
- ✅ Basic organisms inline in pages
- ⚠️ Missing: Extracted organisms, export/import UI, activity log, advanced features

---

## Page Architecture

### Admin Section

#### 1. /admin/users (User List Page)

**File**: `packages/web/src/app/[lang]/(private)/admin/users/page.tsx`

**Status**: ✅ Implemented (needs refactoring)

**Current Implementation**:
```typescript
// Currently inline organism - should extract to UserListOrganism
export default function AdminUsersPage() {
  return (
    <div className="container">
      {/* Search and filters */}
      {/* User table/grid */}
      {/* Bulk actions toolbar */}
      {/* Pagination */}
    </div>
  );
}
```

**Features Implemented**:
- Search by name, email, company
- Filter by role (CLIENT, EMPLOYEE, ADMIN)
- Filter by status (ACTIVE, SUSPENDED, ANONYMIZED)
- Bulk selection (checkboxes)
- Bulk actions:
  - Delete selected
  - Update role
  - Update status
- Pagination (20 users per page)
- User cards with edit/delete actions
- Loading states
- Error handling

**Missing Features**:
- Export button (CSV/Excel)
- Import button (wizard)
- Advanced filters panel (tags, groups, date ranges)
- Column customization
- Sort by multiple fields
- Save filter presets

**Refactoring Needed**:
Extract inline logic to `UserListOrganism` component for reusability.

---

#### 2. /admin/users/create (Create User Page)

**File**: `packages/web/src/app/[lang]/(private)/admin/users/create/page.tsx`

**Status**: ✅ Fully Implemented

**Implementation**:
```typescript
export default function CreateUserPage() {
  return (
    <UserCreateFormOrganism
      onSuccess={() => router.push('/admin/users')}
      onCancel={() => router.back()}
    />
  );
}
```

**Features**:
- Multi-step form wizard:
  - Step 1: Basic info (firstname, lastname, email, phone)
  - Step 2: Business info (company, address, contactPerson)
  - Step 3: Role & permissions
  - Step 4: Review & confirm
- Password generation with strength indicator
- Email validation (unique check via debounced API call)
- Role-specific field display (address for CLIENT only)
- Success redirect to user detail page
- Cancel returns to list

**Works Well**: No changes needed

---

#### 3. /admin/users/[userEmail] (User Detail Page)

**File**: `packages/web/src/app/[lang]/(private)/admin/users/[userEmail]/page.tsx`

**Status**: ⚠️ Partial (70% complete)

**Current Implementation**:
```typescript
export default function UserDetailPage({ params }) {
  const { data: user } = trpc.user.getUserByEmail.useQuery(params.userEmail);

  return (
    <div className="grid grid-cols-[1fr_300px]">
      {/* Main content - tabs */}
      <Tabs>
        <TabsList>
          <Tab value="profile">Profile</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="products">Products</Tab>
          <Tab value="groups">Groups</Tab>
          <Tab value="activity">Activity</Tab> {/* Missing implementation */}
        </TabsList>

        <TabsContent value="profile">{/* Edit form inline */}</TabsContent>
        <TabsContent value="security">{/* Password reset */}</TabsContent>
        <TabsContent value="products">{/* Products/Resources */}</TabsContent>
        <TabsContent value="groups">{/* Group assignments */}</TabsContent>
        <TabsContent value="activity">{/* TODO: Activity log */}</TabsContent>
      </Tabs>

      {/* Sidebar - actions */}
      <Card>
        <CardHeader>Actions</CardHeader>
        <CardContent>
          {/* Role badge */}
          {/* Status indicator */}
          {/* Edit profile button */}
          {/* Change role dropdown */}
          {/* Suspend/Activate toggle */}
          {/* Reset password */}
          {/* Delete user (with confirmation) */}
          {/* TODO: Impersonate */}
          {/* TODO: Anonymize */}
          {/* TODO: Export data */}
          {/* TODO: Send message */}
        </CardContent>
      </Card>
    </div>
  );
}
```

**Implemented Tabs**:
- ✅ Profile: Edit user details inline
- ✅ Security: Reset password, 2FA setup (placeholder)
- ✅ Products/Resources: Assigned products/resources
- ✅ Groups: Group memberships

**Missing Tabs**:
- ❌ Activity: Activity log timeline
- ❌ Requests: User's request history (CLIENT) or assigned requests (EMPLOYEE)
- ❌ Notifications: User's notification history

**Implemented Actions**:
- ✅ Edit profile
- ✅ Change role (dropdown with confirmation)
- ✅ Change status (Suspend/Activate toggle)
- ✅ Reset password (generates temp password)
- ✅ Delete user (soft delete with confirmation)

**Missing Actions**:
- ❌ Impersonate user (login as user, with exit button)
- ❌ Anonymize user (GDPR, permanent, with strong confirmation)
- ❌ Export user data (GDPR data export)
- ❌ Send message to user (email + in-app notification)

---

## Component Architecture (Atomic Design)

### Atoms (8 components)

#### 1. UserAvatarAtom

**File**: `packages/web/src/components/atoms/user/UserAvatarAtom.tsx`

**Status**: ❌ To Create

```typescript
interface UserAvatarAtomProps {
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showInitials?: boolean;
  className?: string;
}

export function UserAvatarAtom({
  user,
  size = 'md',
  showInitials = true,
  className
}: UserAvatarAtomProps) {
  const initials = `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();

  // Generate consistent color based on email hash
  const bgColor = getColorFromEmail(user.email);

  return (
    <Avatar className={cn(sizeClasses[size], className)} style={{ backgroundColor: bgColor }}>
      <AvatarFallback>{showInitials ? initials : '?'}</AvatarFallback>
    </Avatar>
  );
}
```

**Features**:
- Initials from firstname + lastname
- Consistent color based on email hash
- Size variants (24px, 32px, 40px, 48px)
- Fallback for missing names

---

#### 2. RoleBadgeAtom

**File**: `packages/web/src/components/atoms/user/RoleBadgeAtom.tsx`

**Status**: ❌ To Create

```typescript
interface RoleBadgeAtomProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const roleConfig = {
  CLIENT: { color: 'blue', icon: User, label: 'Client' },
  EMPLOYEE: { color: 'green', icon: Briefcase, label: 'Employee' },
  ADMIN: { color: 'red', icon: Shield, label: 'Admin' },
  LEAD: { color: 'purple', icon: Star, label: 'Lead' },
  USER: { color: 'gray', icon: User, label: 'User' },
  MODERATOR: { color: 'orange', icon: Flag, label: 'Moderator' }
};

export function RoleBadgeAtom({ role, size = 'md', showIcon = true }: RoleBadgeAtomProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <Badge variant={config.color} className={sizeClasses[size]}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
```

**Color Mapping**:
- CLIENT: Blue (#3B82F6)
- EMPLOYEE: Green (#10B981)
- ADMIN: Red (#EF4444)
- LEAD: Purple (#8B5CF6)
- USER: Gray (#6B7280)
- MODERATOR: Orange (#F59E0B)

---

#### 3. StatusIndicatorAtom

**File**: `packages/web/src/components/atoms/user/StatusIndicatorAtom.tsx`

**Status**: ❌ To Create

```typescript
interface StatusIndicatorAtomProps {
  status: UserStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  ACTIVE: { color: 'green', label: 'Active', dot: true },
  SUSPENDED: { color: 'yellow', label: 'Suspended', dot: true },
  ANONYMIZED: { color: 'gray', label: 'Anonymized', dot: true }
};

export function StatusIndicatorAtom({
  status,
  showLabel = true,
  size = 'md'
}: StatusIndicatorAtomProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-2 w-2 rounded-full', `bg-${config.color}-500`)} />
      {showLabel && (
        <span className={cn('text-sm', `text-${config.color}-700`)}>
          {config.label}
        </span>
      )}
    </div>
  );
}
```

---

#### 4. LastLoginAtom

**File**: `packages/web/src/components/atoms/user/LastLoginAtom.tsx`

**Status**: ❌ To Create

```typescript
interface LastLoginAtomProps {
  timestamp: Date;
  format?: 'relative' | 'absolute';
}

export function LastLoginAtom({ timestamp, format = 'relative' }: LastLoginAtomProps) {
  const formatted = format === 'relative'
    ? formatDistanceToNow(timestamp, { addSuffix: true })
    : formatDate(timestamp, 'PPpp');

  return (
    <span className="text-sm text-muted-foreground">
      Last login: {formatted}
    </span>
  );
}
```

---

### Molecules (6 components)

#### 1. UserCardMolecule

**File**: `packages/web/src/components/molecules/user/UserCardMolecule.tsx`

**Status**: ⚠️ Exists inline in page (needs extraction)

```typescript
interface UserCardMoleculeProps {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    company: string;
    role: Role;
    status: UserStatus;
    createdAt: Date;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: (selected: boolean) => void;
  selected?: boolean;
  showActions?: boolean;
}

export function UserCardMolecule({
  user,
  onEdit,
  onDelete,
  onSelect,
  selected = false,
  showActions = true
}: UserCardMoleculeProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', selected && 'ring-2 ring-primary')}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          {onSelect && (
            <Checkbox checked={selected} onCheckedChange={onSelect} />
          )}
          <UserAvatarAtom user={user} size="md" />
          <div>
            <CardTitle>{user.firstname} {user.lastname}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          <RoleBadgeAtom role={user.role} size="sm" />
          <StatusIndicatorAtom status={user.status} showLabel={false} size="sm" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Phone:</span> {user.phone}
          </div>
          <div>
            <span className="text-muted-foreground">Company:</span> {user.company}
          </div>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash className="h-4 w-4 mr-1" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
```

---

#### 2. UserFilterMolecule

**File**: `packages/web/src/components/molecules/user/UserFilterMolecule.tsx`

**Status**: ⚠️ Exists inline (needs extraction)

```typescript
interface UserFilterMoleculeProps {
  filters: {
    search: string;
    role?: Role;
    status?: UserStatus;
    dateRange?: { from: Date; to: Date };
  };
  onFilterChange: (filters: Partial<UserFilterMoleculeProps['filters']>) => void;
  showAdvanced?: boolean;
}

export function UserFilterMolecule({
  filters,
  onFilterChange,
  showAdvanced = false
}: UserFilterMoleculeProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {/* Search input */}
      <Input
        placeholder="Search users..."
        value={filters.search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        className="w-full md:w-64"
      />

      {/* Role filter */}
      <Select
        value={filters.role}
        onValueChange={(role) => onFilterChange({ role: role as Role })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="CLIENT">Client</SelectItem>
          <SelectItem value="EMPLOYEE">Employee</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select
        value={filters.status}
        onValueChange={(status) => onFilterChange({ status: status as UserStatus })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="SUSPENDED">Suspended</SelectItem>
          <SelectItem value="ANONYMIZED">Anonymized</SelectItem>
        </SelectContent>
      </Select>

      {showAdvanced && (
        <>
          {/* Date range picker */}
          <DateRangePicker
            value={filters.dateRange}
            onChange={(range) => onFilterChange({ dateRange: range })}
          />
        </>
      )}
    </div>
  );
}
```

---

#### 3. BulkActionsMolecule

**File**: `packages/web/src/components/molecules/user/BulkActionsMolecule.tsx`

**Status**: ⚠️ Exists inline (needs extraction)

```typescript
interface BulkActionsMoleculeProps {
  selectedIds: string[];
  onBulkDelete: () => void;
  onBulkUpdateRole: (role: Role) => void;
  onBulkUpdateStatus: (status: UserStatus) => void;
  onClearSelection: () => void;
}

export function BulkActionsMolecule({
  selectedIds,
  onBulkDelete,
  onBulkUpdateRole,
  onBulkUpdateStatus,
  onClearSelection
}: BulkActionsMoleculeProps) {
  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center gap-4 z-50">
      <span className="font-medium">{selectedIds.length} selected</span>

      <Separator orientation="vertical" className="h-8" />

      {/* Change role */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <UserCog className="h-4 w-4 mr-2" />
            Change Role
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onBulkUpdateRole('CLIENT')}>
            Client
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkUpdateRole('EMPLOYEE')}>
            Employee
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkUpdateRole('ADMIN')}>
            Admin
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change status */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Power className="h-4 w-4 mr-2" />
            Change Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onBulkUpdateStatus('ACTIVE')}>
            Activate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkUpdateStatus('SUSPENDED')}>
            Suspend
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete */}
      <Button variant="destructive" size="sm" onClick={onBulkDelete}>
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>

      {/* Clear */}
      <Button variant="ghost" size="sm" onClick={onClearSelection}>
        Clear
      </Button>
    </div>
  );
}
```

---

### Organisms (8 components)

#### 1. UserListOrganism (REFACTOR NEEDED)

**File**: `packages/web/src/components/organisms/user/UserListOrganism.tsx`

**Status**: ❌ To Create (currently inline in page)

**Purpose**: Complete user management interface with search, filters, bulk operations, and pagination.

**Props**:
```typescript
interface UserListOrganismProps {
  initialFilters?: UserFilters;
  onUserEdit?: (userId: string) => void;
  onUserDelete?: (userId: string) => void;
  showBulkActions?: boolean;
  showExportImport?: boolean;
}
```

**Features**:
- Search and filter controls
- User grid/table display
- Bulk selection and actions
- Pagination (client-side or server-side)
- Loading states
- Empty state
- Error handling
- Export/import buttons (if enabled)
- Responsive layout (grid on desktop, list on mobile)

**State Management**:
```typescript
// tRPC queries
const { data: users, isLoading } = trpc.user.getAll.useQuery(filters);
const { mutate: deleteUser } = trpc.user.delete.useMutation();
const { mutate: bulkDelete } = trpc.user.bulkDelete.useMutation();
const { mutate: bulkUpdateRole } = trpc.user.bulkUpdateRole.useMutation();
const { mutate: bulkUpdateStatus } = trpc.user.bulkUpdateStatus.useMutation();

// Local state
const [selectedIds, setSelectedIds] = useState<string[]>([]);
const [filters, setFilters] = useState<UserFilters>(initialFilters);
```

---

#### 2. UserCreateFormOrganism (COMPLETE)

**File**: `packages/web/src/components/organisms/user/UserCreateFormOrganism.tsx`

**Status**: ✅ Implemented (inline in create page)

**Should Extract**: Yes, for reusability

**Features**:
- Multi-step wizard (4 steps)
- Step navigation (next, back, skip)
- Form validation with Zod
- Password generation
- Role-based conditional fields
- Progress indicator
- Success/error notifications

---

#### 3. UserDetailOrganism (PARTIAL)

**File**: `packages/web/src/components/organisms/user/UserDetailOrganism.tsx`

**Status**: ❌ To Create (currently inline in detail page)

**Purpose**: Complete user detail view with tabs and actions sidebar.

**Props**:
```typescript
interface UserDetailOrganismProps {
  userId: string;
  showActions?: boolean;
  onUserUpdated?: () => void;
  onUserDeleted?: () => void;
}
```

**Features**:
- Tab navigation (Profile, Security, Activity, Products, Groups, Requests, Notifications)
- Actions sidebar:
  - Role badge and status indicator
  - Edit profile
  - Change role (with confirmation)
  - Change status (Suspend/Activate)
  - Reset password
  - Impersonate user
  - Anonymize user (with strong confirmation)
  - Export user data
  - Send message
  - Delete user (soft delete)
- Real-time updates (optimistic UI)
- Loading states per tab

---

#### 4. UserEditFormOrganism (MISSING)

**File**: `packages/web/src/components/organisms/user/UserEditFormOrganism.tsx`

**Status**: ❌ To Create

**Purpose**: Edit user details form.

**Props**:
```typescript
interface UserEditFormOrganismProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  showRoleChange?: boolean;
  showStatusChange?: boolean;
}
```

**Features**:
- Form with all editable fields
- Role-based field visibility (address for CLIENT)
- Validation
- Role change with confirmation dialog
- Status change with reason textarea
- Save/Cancel buttons
- Optimistic updates
- Error handling

---

#### 5. ActivityTimelineOrganism (MISSING)

**File**: `packages/web/src/components/organisms/user/ActivityTimelineOrganism.tsx`

**Status**: ❌ To Create

**Purpose**: Display user activity log in timeline format.

**Props**:
```typescript
interface ActivityTimelineOrganismProps {
  userId: string;
  limit?: number;
  showFilters?: boolean;
}
```

**Features**:
- Timeline display (vertical)
- Activity types:
  - Login/Logout
  - Profile updates
  - Role changes
  - Status changes
  - Password resets
  - Request actions (created, completed, cancelled)
  - Email sent/received
- Filters:
  - Activity type
  - Date range
  - Search
- Pagination (load more)
- Real-time updates

**Activity Log Item**:
```typescript
{
  id: string;
  userId: string;
  action: 'LOGIN' | 'PROFILE_UPDATE' | 'ROLE_CHANGE' | ...;
  description: string;
  metadata: Record<string, any>;
  ip: string;
  userAgent: string;
  createdAt: Date;
}
```

---

#### 6. UserExportDialogOrganism (MISSING)

**File**: `packages/web/src/components/organisms/user/UserExportDialogOrganism.tsx`

**Status**: ❌ To Create

**Purpose**: Export users dialog with format and column selection.

**Props**:
```typescript
interface UserExportDialogOrganismProps {
  filters: UserFilters;
  onExport: (format: 'csv' | 'excel', columns: string[]) => void;
  onClose: () => void;
}
```

**Features**:
- Format selection (CSV, Excel)
- Column selection (checkboxes for each field)
- Export filtered vs all users
- Preview (first 5 rows)
- Download button
- Loading state during export
- Success notification

---

#### 7. UserImportWizardOrganism (MISSING)

**File**: `packages/web/src/components/organisms/user/UserImportWizardOrganism.tsx`

**Status**: ❌ To Create

**Purpose**: Multi-step import wizard for bulk user creation.

**Props**:
```typescript
interface UserImportWizardOrganismProps {
  onSuccess: (result: ImportResult) => void;
  onCancel: () => void;
}
```

**Steps**:
1. **Upload File**: Drag-drop or file picker (CSV/Excel)
2. **Map Columns**: Map file columns to User fields
3. **Validate**: Show validation errors, fix inline
4. **Review**: Preview users to import
5. **Import**: Progress bar, show results

**Features**:
- File validation (format, size, headers)
- Column auto-mapping (smart detection)
- Inline error fixes
- Duplicate detection (by email)
- Role assignment for imported users
- Default password generation
- Send welcome email option
- Import summary (success, failed, skipped)

---

#### 8. ImpersonationBannerOrganism (MISSING)

**File**: `packages/web/src/components/organisms/user/ImpersonationBannerOrganism.tsx`

**Status**: ❌ To Create

**Purpose**: Top banner shown when admin is impersonating a user.

**Props**:
```typescript
interface ImpersonationBannerOrganismProps {
  originalAdminId: string;
  impersonatedUserId: string;
  impersonatedUserName: string;
  onStopImpersonation: () => void;
}
```

**Features**:
- Fixed position banner at top
- Shows "You are viewing as [User Name]"
- Shows original admin info
- "Stop Impersonation" button
- Warning color (yellow/orange background)
- Cannot be dismissed (must stop impersonation)

---

## State Management

### tRPC Integration

**Queries**:
```typescript
// User list
const { data, isLoading, error } = trpc.user.getAll.useQuery({
  page: 1,
  limit: 20,
  search: 'john',
  role: 'CLIENT',
  status: 'ACTIVE',
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

// User detail
const { data: user } = trpc.user.getById.useQuery(userId);

// User statistics
const { data: stats } = trpc.user.getStats.useQuery();
```

**Mutations**:
```typescript
// Create user
const createUser = trpc.user.create.useMutation({
  onSuccess: () => {
    queryClient.invalidateQueries(['user.getAll']);
    toast.success('User created successfully');
  }
});

// Update user
const updateUser = trpc.user.update.useMutation({
  onSuccess: () => {
    queryClient.invalidateQueries(['user.getById', userId]);
    queryClient.invalidateQueries(['user.getAll']);
  }
});

// Delete user
const deleteUser = trpc.user.delete.useMutation({
  onSuccess: () => {
    queryClient.invalidateQueries(['user.getAll']);
  }
});

// Bulk operations
const bulkDelete = trpc.user.bulkDelete.useMutation();
const bulkUpdateRole = trpc.user.bulkUpdateRole.useMutation();
const bulkUpdateStatus = trpc.user.bulkUpdateStatus.useMutation();
```

### Form State (React Hook Form + Zod)

```typescript
const form = useForm<CreateUserDto>({
  resolver: zodResolver(createUserSchema),
  defaultValues: {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    phone: '',
    company: '',
    role: 'CLIENT',
    address: '',
    contactPerson: undefined
  }
});
```

### Local State

```typescript
// Bulk selection
const [selectedIds, setSelectedIds] = useState<string[]>([]);

// Filters
const [filters, setFilters] = useState<UserFilters>({
  search: '',
  role: undefined,
  status: undefined,
  page: 1,
  limit: 20
});

// View mode
const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
```

---

## Internationalization

### Translation Keys Structure

```json
{
  "users": {
    "title": "Users Management",
    "subtitle": "Manage team and client users",
    "create": "Create User",
    "edit": "Edit User",
    "delete": "Delete User",
    "search": "Search users...",
    "filters": {
      "role": "Filter by role",
      "status": "Filter by status",
      "allRoles": "All roles",
      "allStatuses": "All statuses"
    },
    "roles": {
      "CLIENT": "Client",
      "EMPLOYEE": "Employee",
      "ADMIN": "Administrator",
      "LEAD": "Team Lead",
      "USER": "User",
      "MODERATOR": "Moderator"
    },
    "statuses": {
      "ACTIVE": "Active",
      "SUSPENDED": "Suspended",
      "ANONYMIZED": "Anonymized"
    },
    "fields": {
      "email": "Email",
      "firstname": "First Name",
      "lastname": "Last Name",
      "phone": "Phone Number",
      "company": "Company",
      "address": "Address",
      "role": "Role",
      "status": "Status"
    },
    "actions": {
      "edit": "Edit",
      "delete": "Delete",
      "suspend": "Suspend",
      "activate": "Activate",
      "resetPassword": "Reset Password",
      "impersonate": "Impersonate",
      "anonymize": "Anonymize",
      "exportData": "Export Data",
      "sendMessage": "Send Message"
    },
    "bulk": {
      "selected": "{count} selected",
      "delete": "Delete selected",
      "updateRole": "Update role",
      "updateStatus": "Update status"
    },
    "messages": {
      "createSuccess": "User created successfully",
      "updateSuccess": "User updated successfully",
      "deleteSuccess": "User deleted successfully",
      "deleteConfirm": "Are you sure you want to delete this user?",
      "anonymizeConfirm": "This action is irreversible. All personal data will be permanently deleted. Are you sure?",
      "impersonationActive": "You are viewing as {name}",
      "stopImpersonation": "Stop Impersonation"
    },
    "errors": {
      "emailExists": "Email already exists",
      "loadFailed": "Failed to load users",
      "deleteFailed": "Failed to delete user",
      "cannotDeleteSelf": "You cannot delete your own account",
      "cannotDeleteLastAdmin": "Cannot delete the last administrator"
    }
  }
}
```

### Usage in Components

```typescript
import { useTranslations } from 'next-intl';

export function UserListOrganism() {
  const t = useTranslations('users');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <Button>{t('create')}</Button>
      {/* ... */}
    </div>
  );
}
```

---

## Responsive Design

### Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

### Layout Adaptations

**User List**:
- Mobile: Single column list
- Tablet: 2-column grid
- Desktop: 3-4 column grid or table view

**User Detail**:
- Mobile: Tabs stacked vertically, actions in dropdown
- Tablet: Tabs horizontal, actions sidebar collapsed
- Desktop: Tabs horizontal, actions sidebar visible

**Filters**:
- Mobile: Filters in drawer (slide from bottom)
- Tablet: Filters in collapsible panel
- Desktop: Filters always visible

---

## Accessibility

### ARIA Labels

```tsx
<button aria-label="Delete user John Doe" onClick={handleDelete}>
  <Trash className="h-4 w-4" />
</button>

<input
  type="search"
  aria-label="Search users by name, email, or company"
  placeholder="Search users..."
/>
```

### Keyboard Navigation

- Tab through all interactive elements
- Enter to submit forms
- Escape to close dialogs
- Arrow keys for dropdowns and selects
- Space to toggle checkboxes

### Screen Reader Support

- Announce bulk selection changes: "5 users selected"
- Announce filter changes: "Filtered by role: Client"
- Announce loading states: "Loading users..."
- Announce errors: "Error: Failed to delete user"

---

## Performance Optimizations

### Virtual Scrolling

For lists > 100 users:
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: users.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 80,
  overscan: 5
});
```

### Debounced Search

```typescript
const debouncedSearch = useDebouncedCallback(
  (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  },
  500
);
```

### Optimistic Updates

```typescript
const updateUser = trpc.user.update.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries(['user.getById', userId]);

    // Snapshot previous value
    const previousUser = queryClient.getQueryData(['user.getById', userId]);

    // Optimistically update
    queryClient.setQueryData(['user.getById', userId], newData);

    return { previousUser };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['user.getById', userId], context.previousUser);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['user.getById', userId]);
  }
});
```

### Lazy Loading

```typescript
const ActivityTab = lazy(() => import('./tabs/ActivityTab'));
const RequestsTab = lazy(() => import('./tabs/RequestsTab'));

<Suspense fallback={<Skeleton className="h-96" />}>
  <ActivityTab userId={userId} />
</Suspense>
```

---

## Testing Strategy

### Component Tests (Vitest + Testing Library)

**UserAvatarAtom**:
```typescript
describe('UserAvatarAtom', () => {
  it('displays user initials', () => {
    render(<UserAvatarAtom user={{ firstname: 'John', lastname: 'Doe', email: 'john@example.com' }} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('generates consistent color from email', () => {
    const { container } = render(<UserAvatarAtom user={user} />);
    const avatar = container.querySelector('[style*="background"]');
    expect(avatar).toHaveStyle({ backgroundColor: expect.any(String) });
  });
});
```

**UserCardMolecule**:
```typescript
describe('UserCardMolecule', () => {
  it('renders user information', () => {
    render(<UserCardMolecule user={mockUser} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<UserCardMolecule user={mockUser} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalled();
  });
});
```

**UserListOrganism**:
```typescript
describe('UserListOrganism', () => {
  it('filters users by search term', async () => {
    render(<UserListOrganism />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, 'john');
    await waitFor(() => {
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('bulk selects and deletes users', async () => {
    render(<UserListOrganism />);
    // Select multiple users
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);
    await userEvent.click(checkboxes[1]);

    // Click bulk delete
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    // Confirm deletion
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));

    expect(mockBulkDelete).toHaveBeenCalledWith({ userIds: ['id1', 'id2'] });
  });
});
```

### E2E Tests (Playwright)

See `ALI-122-testing-migration.md` for complete E2E test scenarios.

---

## Storybook Stories

### UserAvatarAtom.stories.tsx

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { UserAvatarAtom } from './UserAvatarAtom';

const meta: Meta<typeof UserAvatarAtom> = {
  title: 'Atoms/User/UserAvatarAtom',
  component: UserAvatarAtom,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof UserAvatarAtom>;

export const Default: Story = {
  args: {
    user: {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com'
    },
    size: 'md',
    showInitials: true
  }
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <UserAvatarAtom user={user} size="sm" />
      <UserAvatarAtom user={user} size="md" />
      <UserAvatarAtom user={user} size="lg" />
      <UserAvatarAtom user={user} size="xl" />
    </div>
  )
};
```

---

## Migration Checklist

### Phase 1: Component Extraction (1-2 days)
- [ ] Extract UserListOrganism from admin/users/page.tsx
- [ ] Extract UserDetailOrganism from admin/users/[userEmail]/page.tsx
- [ ] Create UserAvatarAtom
- [ ] Create RoleBadgeAtom
- [ ] Create StatusIndicatorAtom
- [ ] Create LastLoginAtom
- [ ] Extract UserFilterMolecule
- [ ] Extract BulkActionsMolecule
- [ ] Extract UserCardMolecule

### Phase 2: Missing Features (2-3 days)
- [ ] Create UserEditFormOrganism
- [ ] Create ActivityTimelineOrganism
- [ ] Create UserExportDialogOrganism
- [ ] Create UserImportWizardOrganism
- [ ] Create ImpersonationBannerOrganism
- [ ] Add Activity tab to user detail
- [ ] Add Requests tab to user detail
- [ ] Add Notifications tab to user detail

### Phase 3: Advanced Features (1-2 days)
- [ ] Implement export functionality (CSV/Excel)
- [ ] Implement import wizard
- [ ] Add impersonation UI and flow
- [ ] Add anonymization with strong confirmation
- [ ] Add advanced filters panel

### Phase 4: Testing (1-2 days)
- [ ] Write unit tests for all atoms
- [ ] Write unit tests for all molecules
- [ ] Write unit tests for all organisms
- [ ] Write Storybook stories
- [ ] Write E2E tests

### Phase 5: Polish (1 day)
- [ ] Accessibility audit
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Documentation

**Total Estimated Time**: 6-10 days

---

## References

- [Main Spec](./ALI-122-spec.md)
- [Backend Implementation](./ALI-122-backend-implementation.md)
- [RBAC Permissions](./ALI-122-rbac-permissions.md)
- [Atomic Design Guide](../../../docs/00-conventions/atomic-design-architecture.md)
- [Component Structure](../../../docs/00-conventions/component-structure-and-testing.md)
- [Frontend Testing Guide](../../../docs/05-testing/frontend-testing-guide.md)

---

**Document Version**: 1.0
**Last Updated**: 2025-12-26
**Author**: Luis Eduardo Urdaneta Martucci
