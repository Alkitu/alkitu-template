/**
 * Full cleanup script for Google Drive folders + requests + counters.
 *
 * What it does:
 *   1. Deletes all Request records (Conversation.requestId → set to null via schema)
 *   2. Resets User drive folder IDs (driveFolderId, driveProfileFolderId, driveRequestsFolderId)
 *   3. Resets Service drive folder IDs (driveFolderId)
 *   4. Deletes all SystemConfig entries with "drive_" prefix
 *   5. Deletes all Counter entries with "req_" prefix (so customId restarts from 0001)
 *   6. Trashes all folders inside users/ and services/ in Google Drive
 *   7. Trashes the users/ and services/ root folders themselves
 *
 * Usage:
 *   cd packages/api
 *   npx ts-node -r tsconfig-paths/register scripts/cleanup-drive-and-requests.ts
 */

import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';

const prisma = new PrismaClient();

// ─── Google Drive helpers ────────────────────────────────────────────

function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      project_id: process.env.GOOGLE_DRIVE_PROJECT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  return google.drive({ version: 'v3', auth });
}

const sharedDriveId = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID || undefined;

function sharedDriveParams(): Record<string, unknown> {
  if (!sharedDriveId) return {};
  return { corpora: 'drive', driveId: sharedDriveId };
}

async function listFolderChildren(
  drive: ReturnType<typeof google.drive>,
  folderId: string,
): Promise<{ id: string; name: string }[]> {
  const res = await drive.files.list({
    q: `'${folderId}' in parents AND trashed = false`,
    pageSize: 1000,
    fields: 'files(id, name)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    ...sharedDriveParams(),
  });
  return (res.data.files || []).map((f) => ({
    id: f.id!,
    name: f.name!,
  }));
}

async function trashFile(
  drive: ReturnType<typeof google.drive>,
  fileId: string,
  label: string,
): Promise<void> {
  try {
    await drive.files.update({
      fileId,
      requestBody: { trashed: true },
      supportsAllDrives: true,
    });
    console.log(`   🗑️  Trashed: ${label}`);
  } catch (err: any) {
    console.warn(`   ⚠️  Could not trash ${label}: ${err.message}`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('=== FULL CLEANUP: Drive + Requests + Counters ===');
  console.log('');

  // ── Step 1: Delete all requests ──
  console.log('1️⃣  Deleting all requests...');
  const { count: reqCount } = await prisma.request.deleteMany({});
  console.log(`   ✅ Deleted ${reqCount} requests`);

  // ── Step 2: Reset User drive folder IDs ──
  console.log('2️⃣  Clearing User drive folder IDs...');
  const { count: userCount } = await prisma.user.updateMany({
    where: {
      OR: [
        { driveFolderId: { not: null } },
        { driveProfileFolderId: { not: null } },
        { driveRequestsFolderId: { not: null } },
      ],
    },
    data: {
      driveFolderId: null,
      driveProfileFolderId: null,
      driveRequestsFolderId: null,
    },
  });
  console.log(`   ✅ Cleared folder IDs on ${userCount} users`);

  // ── Step 3: Reset Service drive folder IDs ──
  console.log('3️⃣  Clearing Service drive folder IDs...');
  const { count: svcCount } = await prisma.service.updateMany({
    where: { driveFolderId: { not: null } },
    data: { driveFolderId: null },
  });
  console.log(`   ✅ Cleared folder IDs on ${svcCount} services`);

  // ── Step 4: Delete drive-related SystemConfig ──
  console.log('4️⃣  Deleting SystemConfig "drive_*" entries...');
  const { count: cfgCount } = await prisma.systemConfig.deleteMany({
    where: { key: { startsWith: 'drive_' } },
  });
  console.log(`   ✅ Deleted ${cfgCount} SystemConfig entries`);

  // ── Step 5: Delete request counters ──
  console.log('5️⃣  Deleting Counter "req_*" entries (so customId restarts from 0001)...');
  const { count: ctrCount } = await prisma.counter.deleteMany({
    where: { name: { startsWith: 'req_' } },
  });
  console.log(`   ✅ Deleted ${ctrCount} counter entries`);

  // ── Step 6: Trash Drive folders ──
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!rootFolderId) {
    console.log('6️⃣  ⚠️  GOOGLE_DRIVE_ROOT_FOLDER_ID not set — skipping Drive cleanup');
  } else {
    console.log('6️⃣  Cleaning Google Drive folders...');
    const drive = getDriveClient();

    // List root folder children to find users/ and services/
    const rootChildren = await listFolderChildren(drive, rootFolderId);
    console.log(`   Found ${rootChildren.length} items in root: ${rootChildren.map((c) => c.name).join(', ')}`);

    for (const child of rootChildren) {
      const name = child.name.toLowerCase();
      if (name === 'users' || name === 'services') {
        // Trash all children inside users/ or services/ first
        const grandchildren = await listFolderChildren(drive, child.id);
        console.log(`   📂 ${child.name}/ has ${grandchildren.length} subfolders`);

        for (const gc of grandchildren) {
          await trashFile(drive, gc.id, `${child.name}/${gc.name}`);
        }

        // Then trash the root folder itself
        await trashFile(drive, child.id, `${child.name}/`);
      }
    }

    console.log('   ✅ Drive cleanup complete');
  }

  console.log('');
  console.log('=== CLEANUP COMPLETE ===');
  console.log('');
  console.log('Next steps:');
  console.log('  - The next request created will get customId starting from 0001');
  console.log('  - users/ and services/ folders will be re-created automatically via findOrCreateFolder()');
  console.log('');
}

main()
  .catch((err) => {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
