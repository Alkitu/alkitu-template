// @ts-nocheck
// 
const fs = require('fs');
const glob = require('glob');

function fixAllTestTypes() {
  console.log('🔧 Starting massive test fixes...\n');

  // Corregir user.fixtures.ts
  console.log('1️⃣ Fixing user.fixtures.ts...');
  fixUserFixtures();

  // Corregir user.factory.ts
  console.log('2️⃣ Fixing user.factory.ts...');
  fixUserFactory();

  // Corregir prisma mock imports
  console.log('3️⃣ Fixing prisma mock imports...');
  fixPrismaMockImports();

  // Corregir test utilities imports
  console.log('4️⃣ Fixing test utilities imports...');
  fixTestUtilitiesImports();

  console.log('✅ All fixes completed!');
}

function fixUserFixtures() {
  const filePath = 'test/fixtures/user.fixtures.ts';
  let content = fs.readFileSync(filePath, 'utf8');

  const fixes = [
    // Fix imports
    {
      from: /import { User, UserRole, Status } from "@prisma\/client";/g,
      to: 'import { User, UserRole, UserStatus } from "@prisma/client";',
    },
    // Fix emailVerified to Date
    {
      from: /emailVerified: true,/g,
      to: 'emailVerified: new Date(),',
    },
    {
      from: /emailVerified: false,/g,
      to: 'emailVerified: null,',
    },
    // Fix firstName to name (remove firstName)
    {
      from: /firstName: "[^"]*",\s*/g,
      to: '',
    },
    // Fix organizationId (remove it)
    {
      from: /organizationId,\s*/g,
      to: '',
    },
    {
      from: /organizationId: "[^"]*",\s*/g,
      to: '',
    },
  ];

  fixes.forEach((fix) => {
    if (content.match(fix.from)) {
      content = content.replace(fix.from, fix.to);
      console.log(`   ✅ Fixed: ${fix.from.toString().substring(0, 50)}...`);
    }
  });

  fs.writeFileSync(filePath, content);
  console.log('   📁 user.fixtures.ts updated\n');
}

function fixUserFactory() {
  const filePath = 'test/factories/user.factory.ts';
  let content = fs.readFileSync(filePath, 'utf8');

  const fixes = [
    // Fix imports
    {
      from: /import { User, UserRole, Status } from "@prisma\/client";/g,
      to: 'import { User, UserRole, UserStatus } from "@prisma/client";',
    },
    // Fix emailVerified to Date
    {
      from: /emailVerified: false,/g,
      to: 'emailVerified: null,',
    },
    // Fix firstName to name (remove firstName)
    {
      from: /firstName: overrides\.firstName \|\| "[^"]*",\s*/g,
      to: '',
    },
    // Fix Status references
    {
      from: /Status\./g,
      to: 'UserStatus.',
    },
  ];

  fixes.forEach((fix) => {
    if (content.match(fix.from)) {
      content = content.replace(fix.from, fix.to);
      console.log(`   ✅ Fixed: ${fix.from.toString().substring(0, 50)}...`);
    }
  });

  fs.writeFileSync(filePath, content);
  console.log('   📁 user.factory.ts updated\n');
}

function fixPrismaMockImports() {
  const testFiles = glob.sync('src/**/*.spec.ts');

  testFiles.forEach((filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    const imports = [
      {
        from: /mockPrismaService,/g,
        to: 'prismaMock,',
      },
      {
        from: /prismaServiceMock,/g,
        to: 'PrismaServiceMock,',
      },
      {
        from: /resetAllMocks,/g,
        to: 'resetAllMocks,',
      },
    ];

    imports.forEach((imp) => {
      if (content.match(imp.from)) {
        content = content.replace(imp.from, imp.to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`   ✅ Fixed prisma imports in: ${filePath}`);
    }
  });
  console.log('   📁 Prisma mock imports updated\n');
}

function fixTestUtilitiesImports() {
  const testFiles = glob.sync('src/**/*.spec.ts');

  testFiles.forEach((filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove missing imports from solid-test-utils
    const badImports = ['TestDataFactory,', 'PerformanceTestUtils,'];

    badImports.forEach((badImport) => {
      if (content.includes(badImport)) {
        content = content.replace(badImport, '');
        modified = true;
      }
    });

    // Remove calls to missing methods
    const badCalls = [/SOLIDTestUtils\.generateSOLIDReport\([^)]*\);?/g];

    badCalls.forEach((badCall) => {
      if (content.match(badCall)) {
        content = content.replace(badCall, '// Removed invalid method call');
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`   ✅ Fixed test utilities in: ${filePath}`);
    }
  });
  console.log('   📁 Test utilities imports updated\n');
}

// Run all fixes
fixAllTestTypes();
