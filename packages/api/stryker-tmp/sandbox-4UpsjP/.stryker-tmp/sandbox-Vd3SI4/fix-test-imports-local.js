// @ts-nocheck
// 
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixImportsInFile(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Calculate relative path from this file to local test directory
  const from = path.dirname(filePath);
  const to = path.resolve('test');
  const relativePath = path.relative(from, to);
  const testPrefix = relativePath ? `${relativePath}/` : './test/';

  // Replace both old patterns
  const patterns = [
    /\.\.\/\.\.\/\.\.\/test\//g,
    /\.\.\/\.\.\/\.\.\/\.\.\/test\//g,
    /\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/test\//g,
  ];

  patterns.forEach((pattern) => {
    if (content.match(pattern)) {
      content = content.replace(pattern, testPrefix);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  Updated imports in ${filePath}`);
  }
}

// Find all test files
const testFiles = glob.sync('src/**/*.spec.ts');

console.log(`Found ${testFiles.length} test files to process`);

testFiles.forEach(fixImportsInFile);

console.log('Import fixing complete!');
