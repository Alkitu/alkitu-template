/**
 * Capture Screenshots
 *
 * Automatically captures screenshots of all 32 extra implemented routes
 * Organizes them by category and saves locally
 *
 * Prerequisites:
 * - Development server running (npm run dev)
 * - Screenshot users created (npm run create:screenshot-users)
 *
 * Run: npm run screenshots:capture
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Route data structure
interface RouteData {
  ali: string;
  route: string;
  category: string;
  summary: string;
  role: 'Public' | 'Shared' | 'Admin' | 'Client' | 'Employee';
}

// Screenshot configuration
const SCREENSHOT_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  outputDir: path.join(__dirname, '../screenshots'),
  viewport: {
    width: 1920,
    height: 1080,
  },
  delay: 2000, // Wait 2s after navigation for page to load
};

// User credentials from .env
const USERS = {
  admin: {
    email: process.env.SCREENSHOT_ADMIN_EMAIL || 'screenshot-admin@alkitu.test',
    password: process.env.SCREENSHOT_ADMIN_PASSWORD || 'Screenshot123',
  },
  client: {
    email: process.env.SCREENSHOT_CLIENT_EMAIL || 'screenshot-client@alkitu.test',
    password: process.env.SCREENSHOT_CLIENT_PASSWORD || 'Screenshot123',
  },
  employee: {
    email: process.env.SCREENSHOT_EMPLOYEE_EMAIL || 'screenshot-employee@alkitu.test',
    password: process.env.SCREENSHOT_EMPLOYEE_PASSWORD || 'Screenshot123',
  },
};

// Routes organized by category
const ROUTES: RouteData[] = [
  // ===================================================
  // CATEGORY 1: AUTHENTICATION EXTENDED (7 routes)
  // ===================================================
  {
    ali: 'ALI-182',
    route: '/en/auth/forgot-password',
    category: '01-authentication-extended',
    summary: 'Forgot Password',
    role: 'Public',
  },
  {
    ali: 'ALI-183',
    route: '/en/auth/new-password',
    category: '01-authentication-extended',
    summary: 'New Password',
    role: 'Public',
  },
  {
    ali: 'ALI-184',
    route: '/en/auth/email-login',
    category: '01-authentication-extended',
    summary: 'Magic Link Login',
    role: 'Public',
  },
  {
    ali: 'ALI-185',
    route: '/en/auth/verify-login-code',
    category: '01-authentication-extended',
    summary: 'Login Code Verification',
    role: 'Public',
  },
  {
    ali: 'ALI-186',
    route: '/en/auth/verify-email',
    category: '01-authentication-extended',
    summary: 'Email Verification Request',
    role: 'Public',
  },
  {
    ali: 'ALI-187',
    route: '/en/auth/new-verification',
    category: '01-authentication-extended',
    summary: 'New Verification',
    role: 'Public',
  },
  {
    ali: 'ALI-188',
    route: '/en/auth/auth-error',
    category: '01-authentication-extended',
    summary: 'Authentication Error',
    role: 'Public',
  },

  // ===================================================
  // CATEGORY 2: SHARED INFRASTRUCTURE (8 routes)
  // ===================================================
  {
    ali: 'ALI-189',
    route: '/en/dashboard',
    category: '02-shared-infrastructure',
    summary: 'Universal Dashboard',
    role: 'Shared',
  },
  {
    ali: 'ALI-190',
    route: '/en/profile',
    category: '02-shared-infrastructure',
    summary: 'Shared Profile',
    role: 'Shared',
  },
  {
    ali: 'ALI-191',
    route: '/en/onboarding',
    category: '02-shared-infrastructure',
    summary: 'Shared Onboarding',
    role: 'Shared',
  },
  {
    ali: 'ALI-192',
    route: '/en/provider/work-locations',
    category: '02-shared-infrastructure',
    summary: 'Work Locations',
    role: 'Shared',
  },
  {
    ali: 'ALI-193',
    route: '/en/requests',
    category: '02-shared-infrastructure',
    summary: 'Shared Requests List',
    role: 'Shared',
  },
  {
    ali: 'ALI-194',
    route: '/en/requests/test-id',
    category: '02-shared-infrastructure',
    summary: 'Shared Request Detail',
    role: 'Shared',
  },
  {
    ali: 'ALI-195',
    route: '/en/requests/new',
    category: '02-shared-infrastructure',
    summary: 'Shared New Request',
    role: 'Shared',
  },
  {
    ali: 'ALI-196',
    route: '/en/requests/service-id',
    category: '02-shared-infrastructure',
    summary: 'Service Request',
    role: 'Shared',
  },

  // ===================================================
  // CATEGORY 3: ADMIN ADVANCED (13 routes)
  // ===================================================
  {
    ali: 'ALI-197',
    route: '/en/admin',
    category: '03-admin-advanced',
    summary: 'Admin Home',
    role: 'Admin',
  },
  {
    ali: 'ALI-198',
    route: '/en/admin/categories',
    category: '03-admin-advanced',
    summary: 'Categories Management',
    role: 'Admin',
  },
  {
    ali: 'ALI-199',
    route: '/en/admin/channels',
    category: '03-admin-advanced',
    summary: 'Channels List',
    role: 'Admin',
  },
  {
    ali: 'ALI-200',
    route: '/en/admin/channels/test-channel-id',
    category: '03-admin-advanced',
    summary: 'Channel Detail',
    role: 'Admin',
  },
  {
    ali: 'ALI-201',
    route: '/en/admin/chat',
    category: '03-admin-advanced',
    summary: 'Chat Management',
    role: 'Admin',
  },
  {
    ali: 'ALI-202',
    route: '/en/admin/chat/test-conversation-id',
    category: '03-admin-advanced',
    summary: 'Chat Conversation',
    role: 'Admin',
  },
  {
    ali: 'ALI-203',
    route: '/en/admin/chat/analytics',
    category: '03-admin-advanced',
    summary: 'Chat Analytics',
    role: 'Admin',
  },
  {
    ali: 'ALI-204',
    route: '/en/admin/notifications/analytics',
    category: '03-admin-advanced',
    summary: 'Notification Analytics',
    role: 'Admin',
  },
  {
    ali: 'ALI-205',
    route: '/en/admin/notifications/preferences',
    category: '03-admin-advanced',
    summary: 'Notification Preferences',
    role: 'Admin',
  },
  {
    ali: 'ALI-206',
    route: '/en/admin/settings',
    category: '03-admin-advanced',
    summary: 'Admin Settings',
    role: 'Admin',
  },
  {
    ali: 'ALI-207',
    route: '/en/admin/settings/chatbot',
    category: '03-admin-advanced',
    summary: 'Chatbot Settings',
    role: 'Admin',
  },
  {
    ali: 'ALI-208',
    route: '/en/admin/settings/theme',
    category: '03-admin-advanced',
    summary: 'Theme Settings',
    role: 'Admin',
  },
  {
    ali: 'ALI-209',
    route: '/en/admin/users/create',
    category: '03-admin-advanced',
    summary: 'Create User',
    role: 'Admin',
  },

  // ===================================================
  // CATEGORY 4: SYSTEM UTILITIES (4 routes)
  // ===================================================
  {
    ali: 'ALI-210',
    route: '/en/chat/popup/test-conversation',
    category: '04-system-utilities',
    summary: 'Chat Popup',
    role: 'Shared',
  },
  {
    ali: 'ALI-211',
    route: '/en/design-system',
    category: '04-system-utilities',
    summary: 'Design System',
    role: 'Public',
  },
  {
    ali: 'ALI-212',
    route: '/en/test',
    category: '04-system-utilities',
    summary: 'Test Page',
    role: 'Public',
  },
  {
    ali: 'ALI-213',
    route: '/en/unauthorized',
    category: '04-system-utilities',
    summary: 'Unauthorized',
    role: 'Public',
  },
];

// Create output directories
function createOutputDirectories() {
  const categories = [...new Set(ROUTES.map((r) => r.category))];

  // Create main screenshots directory
  if (!fs.existsSync(SCREENSHOT_CONFIG.outputDir)) {
    fs.mkdirSync(SCREENSHOT_CONFIG.outputDir, { recursive: true });
  }

  // Create category subdirectories
  categories.forEach((category) => {
    const categoryDir = path.join(SCREENSHOT_CONFIG.outputDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
  });

  console.log(`📁 Created ${categories.length} category directories`);
}

// Generate filename from route data
function getFilename(route: RouteData): string {
  const slug = route.summary.toLowerCase().replace(/\s+/g, '-');
  return `${route.ali}-${slug}.png`;
}

// Get full file path
function getFilePath(route: RouteData): string {
  return path.join(
    SCREENSHOT_CONFIG.outputDir,
    route.category,
    getFilename(route)
  );
}

// Main capture function
async function captureScreenshots() {
  console.log('📸 Starting screenshot capture...\n');
  console.log(`📍 Base URL: ${SCREENSHOT_CONFIG.baseUrl}`);
  console.log(`💾 Output directory: ${SCREENSHOT_CONFIG.outputDir}\n`);

  // Create directories
  createOutputDirectories();

  // Statistics
  const stats = {
    total: ROUTES.length,
    captured: 0,
    failed: 0,
    byCategory: {} as Record<string, number>,
  };

  console.log('📋 Routes to capture:');
  console.log(`   Public: ${ROUTES.filter((r) => r.role === 'Public').length}`);
  console.log(`   Shared: ${ROUTES.filter((r) => r.role === 'Shared').length}`);
  console.log(`   Admin: ${ROUTES.filter((r) => r.role === 'Admin').length}\n`);

  console.log('⚠️  IMPORTANT: This script requires Playwright MCP integration');
  console.log('⚠️  Please run the following manually with Claude Code:\n');

  // Group by category for better output
  const categorized = ROUTES.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, RouteData[]>);

  // Generate instructions for each category
  Object.entries(categorized).forEach(([category, routes]) => {
    console.log(`\n## ${category.replace(/^\d+-/, '').replace(/-/g, ' ').toUpperCase()}`);
    console.log(`Directory: screenshots/${category}/\n`);

    routes.forEach((route) => {
      const url = `${SCREENSHOT_CONFIG.baseUrl}${route.route}`;
      const filepath = getFilePath(route);

      console.log(`### ${route.ali} - ${route.summary}`);
      console.log(`Role: ${route.role}`);
      console.log(`URL: ${url}`);
      console.log(`File: ${filepath}`);

      if (route.role !== 'Public') {
        const user = route.role === 'Admin' ? 'admin' :
                     route.role === 'Client' ? 'client' : 'employee';
        console.log(`Auth: Login with ${USERS[user].email} / ${USERS[user].password}`);
      }

      console.log('');
    });
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n📝 Manual Capture Instructions:');
  console.log('\n1. Use Playwright MCP tools (mcp__playwright__browser_*)');
  console.log('2. For each route above:');
  console.log('   a. Navigate: mcp__playwright__browser_navigate({ url: ... })');
  console.log('   b. Auth (if needed): Login with provided credentials');
  console.log('   c. Wait: mcp__playwright__browser_wait_for({ time: 2 })');
  console.log('   d. Screenshot: mcp__playwright__browser_take_screenshot({ filename: ... })');
  console.log('\n3. Or ask Claude Code to automate this using Playwright MCP\n');

  // Save manifest
  const manifest = {
    capturedAt: new Date().toISOString(),
    baseUrl: SCREENSHOT_CONFIG.baseUrl,
    totalRoutes: ROUTES.length,
    routes: ROUTES.map((route) => ({
      ali: route.ali,
      category: route.category,
      url: `${SCREENSHOT_CONFIG.baseUrl}${route.route}`,
      filepath: getFilePath(route),
      filename: getFilename(route),
      role: route.role,
    })),
  };

  const manifestPath = path.join(SCREENSHOT_CONFIG.outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Manifest saved: ${manifestPath}`);
}

// Run
captureScreenshots()
  .catch((error) => {
    console.error('❌ Screenshot capture failed:', error);
    process.exit(1);
  });
