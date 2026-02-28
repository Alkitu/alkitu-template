# Component Duplication & Reuse Audit

> Generated: 2026-02-28
> Scope: `packages/web/src/components/` and `packages/web/src/app/[lang]/`

---

## Table of Contents

1. [Orphaned Files (Delete Immediately)](#1-orphaned-files)
2. [Duplicate Components (Same Purpose, Multiple Implementations)](#2-duplicate-components)
3. [Pages That Should Share Components But Don't](#3-pages-that-should-share-components)
4. [Near-Duplicate Modals](#4-near-duplicate-modals)
5. [Dual Design Systems (Legacy vs Alianza)](#5-dual-design-systems)
6. [Recommendations by Priority](#6-recommendations-by-priority)

---

## 1. Orphaned Files

**Severity: CRITICAL** — These exist in an accidental `src/src/` nested directory and cause TypeScript errors.

| File | Action |
|------|--------|
| `packages/web/src/src/components/ui/button.tsx` | DELETE |
| `packages/web/src/src/components/ui/calendar.tsx` | DELETE |
| `packages/web/src/src/components/ui/scroll-area.tsx` | DELETE |

These are copies of shadcn primitives that ended up in the wrong path. They import from `@/src/lib/utils/utils` which doesn't exist.

---

## 2. Duplicate Components

### 2.1 Badge — 5 implementations

| Location | Name | Purpose |
|----------|------|---------|
| `atoms-alianza/Badge/` | `Badge` | General-purpose badge atom with variants |
| `atoms-alianza/StatusBadge/` | `StatusBadge` | User status badge (wraps Badge) |
| `molecules/request/` | `RequestStatusBadgeMolecule` | Request status badge with icon + color |
| `primitives/ui/badge.tsx` | `Badge` | Raw shadcn badge (variant styling) |
| `features/theme-editor-3.0/` | `Badge` | Theme-editor scoped badge |

**Recommendation:** Consolidate `primitives/ui/badge` and `atoms-alianza/Badge` into a single atom. `StatusBadge` and `RequestStatusBadgeMolecule` are legitimate molecules that compose the base badge — keep them but ensure they import from the same atom.

---

### 2.2 Avatar — 4 implementations

| Location | Name | Purpose |
|----------|------|---------|
| `atoms-alianza/Avatar/` | `Avatar` | Base avatar atom |
| `molecules-alianza/UserAvatar/` | `UserAvatar` | Avatar with initials fallback, themed |
| `primitives/ui/avatar.tsx` | `Avatar` | Raw shadcn/Radix avatar |
| `features/theme-editor-3.0/atoms/Avatar/` | `Avatar` | Theme-editor scoped avatar |

**Recommendation:** Keep `primitives/ui/avatar` as the Radix primitive. `atoms-alianza/Avatar` should wrap it. `UserAvatar` is a legitimate molecule composition. Theme-editor avatar should import from `atoms-alianza/Avatar`.

---

### 2.3 Input — 4 implementations

| Location | Name | Purpose |
|----------|------|---------|
| `atoms-alianza/Input/` | `Input` | Styled input atom |
| `primitives/Input/Input.tsx` | `Input` | PascalCase directory input |
| `primitives/ui/input.tsx` | `Input` | Raw shadcn input |
| `features/theme-editor-3.0/` | `Input` | Theme-editor scoped input |

**Recommendation:** Keep `primitives/ui/input` as the base. `atoms-alianza/Input` should wrap it with Alianza styling. Delete `primitives/Input/` (duplicate). Theme-editor should import from atoms-alianza.

---

### 2.4 Button — 4 implementations

| Location | Name | Purpose |
|----------|------|---------|
| `molecules-alianza/Button/` | `Button` | Full-featured button with loading, icons, theme |
| `primitives/Button/Button.tsx` | `Button` | PascalCase directory button |
| `primitives/ui/button.tsx` | `Button` | Raw shadcn button |
| `src/src/components/ui/button.tsx` | `Button` | Orphan (DELETE) |

**Recommendation:** Keep `primitives/ui/button` as the base primitive. `molecules-alianza/Button` is the Alianza design system button that wraps it — keep both. Delete `primitives/Button/` and `src/src/` copy.

---

### 2.5 Card — 2 near-identical

| Location | Name | Props |
|----------|------|-------|
| `molecules-alianza/Card/` | `Card` | `variant`, `padding`, `className`, `children` |
| `primitives/Card/Card.tsx` | `Card` | `CardHeader`, `CardContent`, `CardFooter` sub-parts |

**Recommendation:** These serve different patterns. `primitives/Card` is the shadcn compound card (Header/Content/Footer). `molecules-alianza/Card` is a simple container with variant styling. Rename `molecules-alianza/Card` to `CardContainer` or merge its variants into the primitive.

---

### 2.6 Select — 3 implementations

| Location | Name | Purpose |
|----------|------|---------|
| `atoms-alianza/Select/` | `Select` | Alianza-styled select atom |
| `primitives/Select/Select.tsx` | `Select` | PascalCase directory (duplicate) |
| `primitives/ui/select.tsx` | `Select` | Raw Radix Select |

**Recommendation:** Delete `primitives/Select/`. Keep `primitives/ui/select` as the Radix primitive. `atoms-alianza/Select` wraps it with styling.

---

### 2.7 Tabs — 3 implementations

| Location | Name | Purpose |
|----------|------|---------|
| `atoms-alianza/Tabs/` | `Tabs` | Raw Radix Tabs atom |
| `molecules-alianza/TabsAlianza/` | `TabsAlianza` | Tabs molecule with label, icon, badge support |
| `primitives/Tabs/Tabs.tsx` | `Tabs` | PascalCase directory (duplicate of atoms-alianza) |

**Recommendation:** Delete `primitives/Tabs/`. Keep `primitives/ui/tabs` as the Radix primitive. `TabsAlianza` is a legitimate molecule. `atoms-alianza/Tabs` may be redundant with `primitives/ui/tabs`.

---

### 2.8 StatsCard — 2 domain-specific but identical structure

| Location | Name | Purpose |
|----------|------|---------|
| `atoms-alianza/UserStatsCard.tsx` | `UserStatsCard` | Card showing user statistics |
| `atoms-alianza/ServiceStatsCard/` | `ServiceStatsCard` | Card showing service statistics |

**Recommendation:** Both have nearly identical structure. Replace with a generic `StatsCard` atom that accepts `title`, `value`, `icon`, `trend`. `molecules-alianza/StatCard` already exists and may cover both cases — verify and consolidate.

---

### 2.9 Accordion — 2 implementations

| Location | Name |
|----------|------|
| `primitives/Accordion/Accordion.tsx` | PascalCase directory wrapper |
| `primitives/ui/accordion.tsx` | Raw shadcn/Radix accordion |

**Recommendation:** Delete `primitives/Accordion/`. Use `primitives/ui/accordion` everywhere.

---

### 2.10 Dialog — 2 implementations

| Location | Name |
|----------|------|
| `primitives/Dialog/Dialog.tsx` | PascalCase directory wrapper |
| `primitives/ui/dialog.tsx` | Raw shadcn/Radix dialog |

**Recommendation:** Delete `primitives/Dialog/`. Use `primitives/ui/dialog` everywhere.

---

### 2.11 DropdownMenu — 2 implementations

| Location | Name |
|----------|------|
| `molecules-alianza/DropdownMenu/` | Alianza molecule with `trigger` + `items[]` |
| `primitives/ui/dropdown-menu.tsx` | Raw Radix DropdownMenu |

**Recommendation:** These serve different levels. The primitive is the Radix wrapper. The molecule is a convenience API. Keep both but ensure the molecule imports the primitive.

---

### 2.12 FormBuilder — 2 systems

| Location | Name | Purpose |
|----------|------|---------|
| `organisms-alianza/FormBuilder/` | `FormBuilder` | Visual form template builder (fields CRUD + preview) |
| `features/form-builder/` | Feature module | Runtime form rendering (field widgets, image picker, etc.) |

**Recommendation:** These are different concerns: **design-time** (template builder) vs **runtime** (form rendering). Rename or document clearly. Not duplicates but confusing naming.

---

### 2.13 LocationCard — 2 implementations

| Location | Name | Purpose |
|----------|------|---------|
| `molecules/location/LocationCardMolecule.tsx` | `LocationCardMolecule` | Location card with edit/delete, uses `LocationIconMolecule` |
| `molecules-alianza/LocationCard/` | `LocationCard` | Location card (Alianza design system) |

**Recommendation:** Verify if `molecules-alianza/LocationCard` is actually used. If both exist, consolidate into one using `LocationIconMolecule`.

---

### 2.14 Combobox — 2 implementations

| Location | Name |
|----------|------|
| `molecules-alianza/Combobox/` | Alianza-styled combobox molecule |
| `primitives/ui/combobox.tsx` | Shadcn Command + Popover pattern |

**Recommendation:** Keep the molecule as the public API. Ensure it wraps the primitive.

---

### 2.15 PlaceholderPalette — 2 implementations

| Location | Name |
|----------|------|
| `molecules-alianza/PlaceholderPalette/` | Alianza palette component |
| `molecules/placeholder-palette/PlaceholderPaletteMolecule.tsx` | Legacy palette component |

**Recommendation:** Consolidate into one. If they have different concerns, rename to distinguish.

---

### 2.16 ThemeToggle / ModeToggle — 2 implementations

| Location | Name |
|----------|------|
| `atoms-alianza/ThemeToggle/` | Alianza theme toggle atom |
| `molecules-alianza/ModeToggle/` | Mode toggle molecule |

**Recommendation:** These likely do the same thing. Consolidate.

---

## 3. Pages That Should Share Components

### 3.1 Request Creation — 2 separate wizard implementations

**Admin:** `app/[lang]/(private)/admin/requests/create/page.tsx`
**Client:** `app/[lang]/(private)/client/requests/new/page.tsx`

Both implement a **5-step wizard** with almost identical steps:

| Step | Admin | Client |
|------|-------|--------|
| 1 | Select Client | Select Location |
| 2 | Select Location | Select Service |
| 3 | Select Service | Fill Details |
| 4 | Fill Details | Select Date/Time |
| 5 | Select Date/Time | Summary + Confirm |

**Shared components already used by both:**
- `CategorizedServiceSelector`
- `LocationCardMolecule` / `LocationFormOrganism`
- `CalendarAppointment`
- Form field rendering

**What's duplicated:**
- Step navigation logic (progress bar, next/back buttons)
- Step state management
- Form validation between steps
- Location selection UI
- Service selection UI
- Date/time selection UI

**Recommendation:** Extract a `RequestWizardOrganism` that accepts configuration for which steps to show and whether to include client selection (admin) or auto-use current user (client). Both pages become thin wrappers.

---

### 3.2 Dashboard — 3 separate implementations

| Route | Components Used | Data Fetching |
|-------|----------------|---------------|
| `/admin/dashboard` | `StatsCardGrid`, `AdminRecentActivityCard`, `AdminUserDistributionCard` | tRPC |
| `/client/dashboard` | `QuickActionCard`, `StatsCardGrid`, `RequestListOrganism` | Raw `fetch()` |
| `/employee/dashboard` | `QuickActionCard`, `StatsCardGrid`, `RequestListOrganism` | tRPC |

**What's duplicated:**
- Client and Employee dashboards have nearly identical structure (QuickActions + Stats + RequestList)
- Stats cards use the same `StatsCardGrid` molecule but with different data sources
- Client uses raw `fetch()` while Employee uses tRPC for the same data shapes

**Recommendation:**
1. Unify Client/Employee dashboards into a `RoleDashboardOrganism` that accepts role and adjusts quick actions + data queries
2. Migrate Client dashboard from `fetch()` to tRPC for consistency

---

### 3.3 Request List — 3 separate implementations

| Route | Component | Notes |
|-------|-----------|-------|
| `/admin/requests` | `RequestManagementTable` (organism) | Full admin controls |
| `/client/requests` | `RequestManagementTable` with `mode="client"` | Hides admin columns |
| `/employee/requests` | Custom inline implementation with `RequestsTableAlianza` | Different component entirely |

**Recommendation:** Employee request list should use `RequestManagementTable` with `mode="employee"` instead of a custom inline implementation. This would eliminate ~100 lines of duplicated filter/pagination/table logic.

---

### 3.4 Notification Pages — Already well shared

All three roles use `NotificationsPageOrganism` with only `requestsBasePath` differing. This is the **gold standard** of reuse in this codebase.

---

### 3.5 Profile Pages — Already well shared

All three roles use `ProfilePageOrganism` with only `showLocations` differing. Good reuse.

---

### 3.6 Request Detail Pages — Already well shared

All three roles use `RequestDetailOrganism` with only `userRole` differing. Excellent reuse.

---

### 3.7 Service Create vs Edit — 2 pages with identical wizard

| Route | Purpose |
|-------|---------|
| `/admin/catalog/services/create` | Create service (2-step wizard: Info + Form Builder) |
| `/admin/catalog/services/[id]` | Edit service (same 2-step wizard, loads existing data) |

Both implement the same 2-step wizard inline in the page file with ~90% identical code.

**Recommendation:** Extract a `ServiceWizardOrganism` with `mode: 'create' | 'edit'` and optional `initialData`.

---

### 3.8 User Detail Tabs — Inline page logic

`/admin/users/[userEmail]` implements 5-6 tabs (Profile, Security, Products, Groups, Locations, Actions) entirely inline in the page file (~500+ lines).

**Recommendation:** Extract a `UserDetailOrganism` that composes existing molecules (`UserProfileForm`, `ChangePasswordForm`, `LocationListOrganism`).

---

### 3.9 Email Template Routes — 2 separate pages

| Route | Status |
|-------|--------|
| `/admin/email-templates` | Legacy, partially implemented |
| `/admin/settings/email-templates` | New, fully implemented |

**Recommendation:** Delete the legacy `/admin/email-templates` route. It's superseded by the settings version.

---

## 4. Near-Duplicate Modals

### 4.1 Cancel modals

| Component | Purpose |
|-----------|---------|
| `molecules/request/CancelRequestModal` | Admin/employee cancel confirmation |
| `molecules/request/RequestCancellationModal` | Client cancellation with reason text |

**Difference:** Client version includes a textarea for cancellation reason.

**Recommendation:** Merge into one `CancelRequestModal` with an optional `showReason?: boolean` prop.

---

### 4.2 Assign modals

| Component | Purpose |
|-----------|---------|
| `molecules/request/AssignRequestModal` | Detailed assignment with employee list |
| `molecules/request/QuickAssignModal` | Simplified quick-assign |

**Recommendation:** Verify if `AssignRequestModal` is still used. If `QuickAssignModal` covers all cases, remove the legacy one.

---

### 4.3 Complete + Status modals

| Component | Purpose |
|-----------|---------|
| `molecules/request/CompleteRequestModal` | Mark request complete |
| `molecules/request/QuickStatusModal` | Quick status change |

**Recommendation:** `QuickStatusModal` likely supersedes `CompleteRequestModal`. Verify usage and consolidate.

---

## 5. Dual Design Systems

The codebase has two coexisting design systems:

| System | Directories | Naming Pattern |
|--------|------------|----------------|
| **Legacy** | `molecules/`, `organisms/` | `ComponentNameMolecule`, `ComponentNameOrganism` |
| **Alianza** | `atoms-alianza/`, `molecules-alianza/`, `organisms-alianza/` | `ComponentName` (PascalCase dir) |

Both systems import from the same `primitives/ui/` layer.

### Migration Status

**Fully migrated to Alianza:**
- Badge, Avatar, Typography, StatCard, Button, Card, Tabs
- AdminPageHeader, UserAvatar, UserTable
- NotificationsPage, ProfilePage, RequestsTable

**Still using Legacy only:**
- Location components (`LocationCardMolecule`, `LocationFormOrganism`, `LocationListOrganism`)
- Category components (`CategoryListOrganism`, `CategoryFormOrganism`)
- Service components (`ServiceListOrganism`, `ServiceFormOrganism`)
- Auth components (`LoginFormOrganism`, `RegisterFormOrganism`, etc.)
- Request detail sub-components (`RequestClientCardMolecule`, `RequestTimelineMolecule`)

**Recommendation:** Prioritize migrating Location, Category, and Service organisms to Alianza to reduce the dual-system surface area.

---

## 6. Recommendations by Priority

### CRITICAL (delete/fix now)

| # | Action | Impact |
|---|--------|--------|
| 1 | Delete `src/src/components/ui/` (3 orphan files) | Removes TS errors |
| 2 | Delete `primitives/Accordion/`, `primitives/Dialog/`, `primitives/Select/`, `primitives/Tabs/`, `primitives/Button/`, `primitives/Input/` (PascalCase duplicates of `primitives/ui/`) | Eliminates 6 duplicate directories |

### HIGH (reduce confusion, major dedup)

| # | Action | Impact |
|---|--------|--------|
| 3 | Extract `RequestWizardOrganism` from admin/client create pages | Eliminates ~500 lines of duplicated wizard logic |
| 4 | Unify Employee request list to use `RequestManagementTable` | Eliminates ~100 lines of inline table code |
| 5 | Extract `ServiceWizardOrganism` from create/edit pages | Eliminates ~300 lines of duplicated wizard logic |
| 6 | Consolidate `UserStatsCard` + `ServiceStatsCard` into generic `StatsCard` | Removes 1 near-identical component |
| 7 | Delete legacy `/admin/email-templates` route | Removes dead/partial code |

### MEDIUM (cleanup, consistency)

| # | Action | Impact |
|---|--------|--------|
| 8 | Merge `CancelRequestModal` + `RequestCancellationModal` | 1 fewer modal |
| 9 | Verify and remove `AssignRequestModal` if `QuickAssignModal` covers all cases | 1 fewer modal |
| 10 | Extract `UserDetailOrganism` from inline page logic | ~500 lines out of page file |
| 11 | Unify Client/Employee dashboard into `RoleDashboardOrganism` | Eliminates duplicated layout |
| 12 | Migrate Client dashboard from `fetch()` to tRPC | Consistency |
| 13 | Consolidate `LocationCard` (legacy vs alianza) | 1 fewer component |

### LOW (nice to have)

| # | Action | Impact |
|---|--------|--------|
| 14 | Consolidate `ThemeToggle` + `ModeToggle` | 1 fewer component |
| 15 | Consolidate `PlaceholderPalette` implementations | 1 fewer component |
| 16 | Rename `FormBuilder` (organisms-alianza) vs `form-builder` (features) to clarify design-time vs runtime | Reduces naming confusion |
| 17 | Standardize route param naming (`[requestId]` vs `[id]`) | Consistency |

---

## Appendix: Component Count Summary

| Directory | Count | Purpose |
|-----------|-------|---------|
| `atoms-alianza/` | 25 | Alianza design system atoms |
| `molecules-alianza/` | 35 | Alianza design system molecules |
| `organisms-alianza/` | 18 | Alianza design system organisms |
| `molecules/` (legacy) | 15 | Legacy atomic molecules |
| `organisms/` (legacy) | 25+ | Legacy atomic organisms |
| `primitives/ui/` | 60+ | shadcn/Radix primitives |
| `primitives/` (PascalCase) | 6 | **Duplicates of primitives/ui/** |
| `features/` | 3 modules | Feature-specific component trees |
| `drive/` | 3 | Google Drive upload components |
| **Total unique** | ~180+ | |
| **Deletable duplicates** | ~12 | |
