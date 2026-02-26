# Drive Folder Automation & Sequential Request IDs

## Overview

This document describes the automated Google Drive folder structure for users and requests, and the sequential `customId` system for requests.

## Folder Structure

```
GOOGLE_DRIVE_ROOT_FOLDER_ID/
└── users/
    ├── user1@email.com/
    │   ├── profile/              ← avatar, profile documents
    │   └── requests/
    │       ├── REQ-LIMP-202602-0001/  ← files for this request
    │       └── REQ-ELEC-202603-0001/
    └── user2@email.com/
        ├── profile/
        └── requests/
```

### Key Design Decisions

- **Email as folder name**: User folders use the email address for human readability
- **CustomId as request folder name**: Request folders use the sequential ID (or MongoDB ObjectId as fallback)
- **Lazy creation**: Folders are created on demand, not eagerly for all existing entities

## Sequential Custom IDs

### Format

```
REQ-{SERVICE_CODE}-{YYYYMM}-{NNNN}
```

| Part | Description | Example |
|------|-------------|---------|
| `REQ` | Fixed prefix | `REQ` |
| `SERVICE_CODE` | 3-6 char uppercase alphanumeric, set per service by admin | `LIMP` |
| `YYYYMM` | Year and month of creation | `202602` |
| `NNNN` | Sequential number, padded to 4 digits | `0001` |

### Examples

- `REQ-LIMP-202602-0001` — First cleaning request in Feb 2026
- `REQ-LIMP-202602-0002` — Second cleaning request in Feb 2026
- `REQ-ELEC-202602-0001` — First electrical request in Feb 2026

### Service Code

- Field: `Service.code` (optional, nullable)
- Validation: 3-6 characters, uppercase, alphanumeric (`/^[A-Z0-9]+$/`)
- Uniqueness: Enforced at application level with a sparse unique index in MongoDB
- If a service has no `code`, requests are created without a `customId`
- Admin configures the code in the service creation/edit form

### Atomic Counter

The counter uses MongoDB's `findAndModify` with `$inc` for true atomic incrementing:

- **Collection**: `counters`
- **Key format**: `req_{SERVICE_CODE}_{YYYYMM}` (e.g., `req_LIMP_202602`)
- **No gaps**: Counter increments atomically, ensuring sequential IDs without gaps
- **Auto-create**: Counters are created on first use via `upsert: true`
- **Overflow**: If a counter exceeds 9999, it naturally extends (e.g., `10000`)

### Implementation

- **CounterService** (`packages/api/src/counter/counter.service.ts`): Atomic counter with `getNextValue()` and `generateRequestCustomId()`
- **CounterModule** (`packages/api/src/counter/counter.module.ts`): NestJS module

## Drive Folder Service

### Location

`packages/api/src/drive/drive-folder.service.ts`

### Methods

| Method | Purpose |
|--------|---------|
| `getUsersRootFolderId()` | Lazy-init `users/` folder inside `GOOGLE_DRIVE_ROOT_FOLDER_ID`. Caches in memory + `SystemConfig` table |
| `ensureUserFolders(userId)` | Creates `{email}/`, `profile/`, `requests/` folders. Idempotent (checks DB fields first). Updates User record |
| `ensureRequestFolder(requestId)` | Creates `{customId}/` inside the user's `requests/` folder. Idempotent. Updates Request.folderId |

### Idempotency Pattern

Every method checks if the Drive folder ID already exists in the database before creating:

```typescript
// Example: ensureUserFolders
const user = await prisma.user.findUnique({ ... });
if (user.driveFolderId && user.driveProfileFolderId && user.driveRequestsFolderId) {
  return { ... }; // Already set up, no API calls
}
```

This means:
- Calling `ensureUserFolders()` multiple times is safe
- Existing entities (users/requests) get folders created lazily on first interaction
- If Drive is temporarily unavailable, the next call will succeed

## Non-Blocking Pattern

Drive folder creation is **non-blocking** — failures don't prevent user/request creation:

```typescript
// In UsersService.create()
this.driveFolderService
  .ensureUserFolders(user.id)
  .catch((error) => {
    this.logger.warn(`Failed to create Drive folders for user: ${error.message}`);
  });
```

This ensures:
- User/request creation always succeeds even if Drive is down
- Folders are created on next opportunity (lazy creation pattern)
- Errors are logged for monitoring

## File Upload Mutations

### Upload Request Files

```typescript
// tRPC: request.uploadRequestFiles
input: {
  requestId: string;
  files: Array<{
    name: string;
    data: string;    // base64
    mimeType: string;
    size: number;
  }>;
}
```

- Verifies access (owner, EMPLOYEE+, ADMIN)
- Calls `ensureRequestFolder()` for lazy folder creation
- Uploads files to request folder in Drive
- Updates `request.attachments` JSON array

### Upload Avatar

```typescript
// tRPC: user.uploadAvatar
input: {
  data: string;      // base64
  mimeType: string;
  fileName: string;
}
```

- Creates user profile folder if needed
- Uploads image to `profile/` folder
- Updates `user.image` with web view link

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_DRIVE_ROOT_FOLDER_ID` | Root folder where `users/` is created |
| `GOOGLE_DRIVE_CLIENT_EMAIL` | Service account email |
| `GOOGLE_DRIVE_PRIVATE_KEY` | Service account private key |
| `GOOGLE_DRIVE_PROJECT_ID` | GCP project ID |
| `GOOGLE_DRIVE_SHARED_DRIVE_ID` | Optional: Shared Drive ID |

## Database Schema Additions

### New Models

- `Counter`: Atomic counters for sequential ID generation
- `SystemConfig`: Key-value store for system configuration (e.g., Drive folder IDs)

### Modified Models

- `User`: Added `driveFolderId`, `driveProfileFolderId`, `driveRequestsFolderId`
- `Request`: Added `customId`, `folderId`, `attachments`
- `Service`: Added `code` (optional, sparse unique)

## Adding a Service Code to an Existing Service

1. Go to Admin > Catalog > Services > [Service Name]
2. Enter a 3-6 character uppercase code (e.g., `LIMP`)
3. Save the service
4. New requests for this service will automatically get sequential IDs
5. Existing requests without `customId` are unaffected
