// @ts-nocheck
// 
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function calculateRelativePath(fromFile, toTestDir) {
  const from = path.dirname(fromFile);
  const to = path.resolve('test');
  return path.relative(from, to);
}

function fixImportsInFile(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Calculate relative path from this file to test directory
  const relativePath = calculateRelativePath(filePath, 'test');
  const testPrefix = relativePath ? `${relativePath}/` : './';

  // Replace @/test/ imports
  const regex = /@\/test\//g;
  if (content.match(regex)) {
    content = content.replace(regex, testPrefix);
    modified = true;
    console.log(`  Updated imports in ${filePath}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
  }
}

// Find all test files
const testFiles = glob.sync('src/**/*.spec.ts');

console.log(`Found ${testFiles.length} test files to process`);

testFiles.forEach(fixImportsInFile);

console.log('Import fixing complete!');
