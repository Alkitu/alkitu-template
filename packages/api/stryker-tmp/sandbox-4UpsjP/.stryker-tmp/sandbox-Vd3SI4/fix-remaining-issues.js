// @ts-nocheck
// 
const fs = require('fs');
const glob = require('glob');

function fixRemainingIssues() {
  console.log('🔧 Fixing remaining specific issues...\n');

  // Fix user.fixtures.ts completely
  fixUserFixturesRemaining();

  // Fix all prisma mock references
  fixAllPrismaMockReferences();

  console.log('✅ All remaining issues fixed!');
}

function fixUserFixturesRemaining() {
  console.log('1️⃣ Fixing user.fixtures.ts remaining issues...');
  const filePath = 'test/fixtures/user.fixtures.ts';
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix all Status references that weren't caught
  content = content.replace(/Status\./g, 'UserStatus.');
  content = content.replace(/: Status/g, ': UserStatus');

  // Remove phone field everywhere
  content = content.replace(/\s*phone: "[^"]*",?\s*/g, '');
  content = content.replace(/\s*phone: null,?\s*/g, '');

  fs.writeFileSync(filePath, content);
  console.log('   ✅ user.fixtures.ts completely fixed\n');
}

function fixAllPrismaMockReferences() {
  console.log('2️⃣ Fixing all prisma mock references...');

  const testFiles = glob.sync('src/**/*.spec.ts');

  testFiles.forEach((filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix all prismaServiceMock references to PrismaServiceMock
    if (content.includes('prismaServiceMock')) {
      content = content.replace(/prismaServiceMock/g, 'PrismaServiceMock');
      modified = true;
    }

    // Fix mockPrismaService() calls
    if (content.includes('mockPrismaService()')) {
      content = content.replace(/mockPrismaService\(\)/g, 'PrismaServiceMock');
      modified = true;
    }

    // Fix prismaMock usage in auth tests
    if (content.includes('useValue: prismaMock')) {
      content = content.replace(
        /useValue: prismaMock/g,
        'useValue: PrismaServiceMock',
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`   ✅ Fixed: ${filePath}`);
    }
  });

  console.log('   📁 All prisma mock references updated\n');
}

// Run fixes
fixRemainingIssues();
