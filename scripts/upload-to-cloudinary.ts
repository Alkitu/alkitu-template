/**
 * Upload Screenshots to Cloudinary
 *
 * Uploads all captured screenshots to Cloudinary
 * Organizes them by category using folders
 * Generates manifest with URLs for JIRA integration
 *
 * Prerequisites:
 * - Screenshots captured (npm run screenshots:capture)
 * - Cloudinary credentials in .env
 *
 * Run: npm run screenshots:upload
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

interface UploadResult {
  ali: string;
  category: string;
  filename: string;
  localPath: string;
  cloudinaryUrl?: string;
  publicId?: string;
  error?: string;
  status: 'success' | 'failed' | 'skipped';
}

interface CloudinaryManifest {
  uploadedAt: string;
  cloudName: string;
  totalFiles: number;
  successful: number;
  failed: number;
  uploads: UploadResult[];
}

const UPLOAD_CONFIG = {
  screenshotsDir: path.join(__dirname, '../screenshots'),
  manifestPath: path.join(__dirname, '../screenshots/manifest.json'),
  cloudinaryManifestPath: path.join(__dirname, '../screenshots/cloudinary-manifest.json'),
  cloudinaryFolder: 'alkitu-screenshots', // Base folder in Cloudinary
};

// Check Cloudinary credentials
function checkCloudinaryConfig(): boolean {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing Cloudinary configuration:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Add these to your .env file:');
    console.error('   CLOUDINARY_CLOUD_NAME="your-cloud-name"');
    console.error('   CLOUDINARY_API_KEY="your-api-key"');
    console.error('   CLOUDINARY_API_SECRET="your-api-secret"\n');
    return false;
  }

  return true;
}

// Read local manifest
function readManifest(): any {
  if (!fs.existsSync(UPLOAD_CONFIG.manifestPath)) {
    throw new Error(`Manifest not found: ${UPLOAD_CONFIG.manifestPath}\nRun: npm run screenshots:capture first`);
  }

  return JSON.parse(fs.readFileSync(UPLOAD_CONFIG.manifestPath, 'utf-8'));
}

// Get all screenshot files
function getScreenshotFiles(): string[] {
  const files: string[] = [];
  const categories = fs.readdirSync(UPLOAD_CONFIG.screenshotsDir).filter(item => {
    const fullPath = path.join(UPLOAD_CONFIG.screenshotsDir, item);
    return fs.statSync(fullPath).isDirectory();
  });

  categories.forEach(category => {
    const categoryPath = path.join(UPLOAD_CONFIG.screenshotsDir, category);
    const categoryFiles = fs.readdirSync(categoryPath)
      .filter(file => file.endsWith('.png'))
      .map(file => path.join(categoryPath, file));
    files.push(...categoryFiles);
  });

  return files;
}

// Upload to Cloudinary using MCP
async function uploadToCloudinary() {
  console.log('☁️  Starting Cloudinary upload...\n');

  // Check configuration
  if (!checkCloudinaryConfig()) {
    process.exit(1);
  }

  console.log(`📁 Screenshots directory: ${UPLOAD_CONFIG.screenshotsDir}`);
  console.log(`☁️  Cloudinary folder: ${UPLOAD_CONFIG.cloudinaryFolder}\n`);

  // Read manifest
  const manifest = readManifest();
  console.log(`📋 Found ${manifest.routes.length} routes in manifest\n`);

  // Get screenshot files
  const files = getScreenshotFiles();
  console.log(`📸 Found ${files.length} screenshot files\n`);

  if (files.length === 0) {
    console.error('❌ No screenshot files found!');
    console.error('   Run: npm run screenshots:capture first\n');
    process.exit(1);
  }

  // Results tracking
  const results: UploadResult[] = [];
  const stats = {
    total: files.length,
    successful: 0,
    failed: 0,
    skipped: 0,
  };

  console.log('⚠️  IMPORTANT: Cloudinary upload requires MCP integration');
  console.log('⚠️  Please use Claude Code with Cloudinary MCP to upload files\n');
  console.log('=' .repeat(80) + '\n');

  // Process each file
  files.forEach((filepath, index) => {
    const relativePath = path.relative(UPLOAD_CONFIG.screenshotsDir, filepath);
    const parts = relativePath.split(path.sep);
    const category = parts[0];
    const filename = parts[1];
    const ali = filename.split('-')[0]; // Extract ALI-XXX from filename

    // Cloudinary public_id: alkitu-screenshots/01-authentication-extended/ALI-182-forgot-password
    const publicId = `${UPLOAD_CONFIG.cloudinaryFolder}/${category}/${filename.replace('.png', '')}`;

    console.log(`\n[${index + 1}/${files.length}] ${ali} - ${category}`);
    console.log(`File: ${filepath}`);
    console.log(`Public ID: ${publicId}`);
    console.log(`\nUpload command:`);
    console.log(`mcp__cloudinary-asset-mgmt__upload-asset({`);
    console.log(`  resource_type: "image",`);
    console.log(`  upload_request: {`);
    console.log(`    file: "file://${filepath}",`);
    console.log(`    public_id: "${publicId}",`);
    console.log(`    folder: "${UPLOAD_CONFIG.cloudinaryFolder}/${category}",`);
    console.log(`    tags: ["alkitu", "screenshot", "${category}", "${ali}"]`);
    console.log(`  }`);
    console.log(`})\n`);

    results.push({
      ali,
      category,
      filename,
      localPath: filepath,
      publicId,
      status: 'skipped',
    });
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Upload Summary:');
  console.log(`   Total files: ${stats.total}`);
  console.log(`   Ready for upload: ${stats.total}\n`);

  // Save preliminary manifest
  const cloudinaryManifest: CloudinaryManifest = {
    uploadedAt: new Date().toISOString(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'not-configured',
    totalFiles: stats.total,
    successful: 0,
    failed: 0,
    uploads: results,
  };

  fs.writeFileSync(
    UPLOAD_CONFIG.cloudinaryManifestPath,
    JSON.stringify(cloudinaryManifest, null, 2)
  );

  console.log(`✅ Cloudinary manifest saved: ${UPLOAD_CONFIG.cloudinaryManifestPath}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Use Claude Code to execute the upload commands above');
  console.log('   2. Update the manifest with actual Cloudinary URLs');
  console.log('   3. Run: npm run screenshots:attach-jira\n');
}

// Run
uploadToCloudinary()
  .catch((error) => {
    console.error('❌ Cloudinary upload preparation failed:', error);
    process.exit(1);
  });
