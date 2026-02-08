#!/bin/bash

# Fix test timeout issues by adding proper cleanup to test files

FILES=(
  "src/components/organisms/location/LocationFormOrganism.test.tsx"
  "src/components/organisms/service/ServiceFormOrganism.test.tsx"
  "src/components/organisms/category/CategoryListOrganism.test.tsx"
  "src/components/organisms/auth/LoginFormOrganism.test.tsx"
  "src/components/organisms/email-template/EmailTemplateFormOrganism.test.tsx"
  "src/components/organisms/request/RequestDetailOrganism.test.tsx"
  "src/components/organisms/admin/RequestManagementTable.test.tsx"
  "src/components/organisms/theme-editor/ThemeEditorOrganism.test.tsx"
  "src/components/organisms/location/LocationListOrganism.test.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."

    # Check if file already has afterEach
    if ! grep -q "afterEach" "$file"; then
      # Use a simple replacement approach
      # This is a marker-based approach - find the beforeEach block and add afterEach after it
      python3 << 'EOF'
import sys
import re

file_path = sys.argv[1]

with open(file_path, 'r') as f:
    content = f.read()

# Add afterEach to imports if not present
if 'afterEach' not in content:
    content = content.replace(
        'import { vi, describe, it, expect, beforeEach }',
        'import { vi, describe, it, expect, beforeEach, afterEach }'
    )

# Add vi.useRealTimers() to beforeEach if not present
content = re.sub(
    r'(beforeEach\(\(\) => \{\s*vi\.clearAllMocks\(\);)',
    r'\1\n    vi.useRealTimers();',
    content,
    count=1
)

# Add afterEach block after beforeEach if not present
if 'afterEach' not in content or 'afterEach(() =>' not in content:
    content = re.sub(
        r'(beforeEach\(\(\) => \{[^}]*\}\);)',
        r'\1\n\n  afterEach(() => {\n    vi.useRealTimers();\n  });',
        content,
        count=1
    )

with open(file_path, 'w') as f:
    f.write(content)

print(f"Fixed {file_path}")
EOF
python3 -c "import sys; sys.exit(0)" "$file"
    fi
  fi
done

echo "All files processed!"
