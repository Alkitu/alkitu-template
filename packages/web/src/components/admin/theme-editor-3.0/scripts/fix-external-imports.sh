#!/bin/bash

# Theme Editor 3.0 - Fix External Imports Script
#
# PREPARACIÓN PRE-ETAPA 7: Replace ALL external imports
#
# Script para reemplazar TODOS los imports externos con imports locales
# Hace el Theme Editor completamente standalone

echo "🔄 Starting Theme Editor external imports replacement..."

# Base directory
BASE_DIR="C:\Users\La compu\Documents\CODE PROJECTS\alkitu-template\packages\web\src\components\admin\theme-editor-3.0"

cd "$BASE_DIR"

echo "📁 Working in: $(pwd)"

# Count current external imports
echo "🔍 Current external imports count:"
CURRENT_EXTERNALS=$(find . -name "*.tsx" -o -name "*.ts" | xargs grep -c "@/" 2>/dev/null | awk -F: '{sum+=$2} END {print sum+0}')
echo "  📊 Found $CURRENT_EXTERNALS external imports to fix"

# 1. Replace @/components/ui imports with local primitives
echo "🔧 Step 1: Replacing @/components/ui imports..."

# UI Components replacements
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/dialog"|from "../design-system/primitives/dialog-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/popover"|from "../design-system/primitives/popover-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/tabs"|from "../design-system/primitives/tabs-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/tooltip"|from "../design-system/primitives/tooltip-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/slider"|from "../design-system/primitives/slider-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/switch"|from "../design-system/primitives/switch-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/separator"|from "../design-system/primitives/separator-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/progress"|from "../design-system/primitives/progress-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/enhanced-color-picker"|from "../design-system/primitives/enhanced-color-picker-local"|g' {} \;

# More UI components that might exist
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/dropdown-menu"|from "../design-system/primitives/dropdown-menu-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/command"|from "../design-system/primitives/command-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/toast"|from "../design-system/primitives/toast-local"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui/skeleton"|from "../design-system/primitives/skeleton-local"|g' {} \;

echo "✅ Replaced @/components/ui imports"

# 2. Replace @/lib/utils imports with local utils
echo "🔧 Step 2: Replacing @/lib/utils imports..."

find . -name "*.tsx" -exec sed -i 's|from "@/lib/utils"|from "./lib/utils/cn"|g' {} \;
find . -name "*.ts" -exec sed -i 's|from "@/lib/utils"|from "./lib/utils/cn"|g' {} \;

# Specific cn imports
find . -name "*.tsx" -exec sed -i 's|import { cn } from "@/lib/utils"|import { cn } from "./lib/utils/cn"|g' {} \;
find . -name "*.ts" -exec sed -i 's|import { cn } from "@/lib/utils"|import { cn } from "./lib/utils/cn"|g' {} \;

echo "✅ Replaced @/lib/utils imports"

# 3. Fix relative path depths for utils imports
echo "🔧 Step 3: Fixing relative path depths..."

# From different depths, adjust the relative path to lib/utils/cn
find ./design-system -name "*.tsx" -exec sed -i 's|from "./lib/utils/cn"|from "../../lib/utils/cn"|g' {} \;
find ./theme-editor -name "*.tsx" -exec sed -i 's|from "./lib/utils/cn"|from "../../lib/utils/cn"|g' {} \;
find ./preview -name "*.tsx" -exec sed -i 's|from "./lib/utils/cn"|from "../../lib/utils/cn"|g' {} \;

# Fix paths that might be too deep
find . -name "*.tsx" -exec sed -i 's|from "../../../lib/utils/cn"|from "../../lib/utils/cn"|g' {} \;
find . -name "*.tsx" -exec sed -i 's|from "../../../../lib/utils/cn"|from "../../lib/utils/cn"|g' {} \;

echo "✅ Fixed relative path depths"

# 4. Replace any remaining @/ imports with local equivalents
echo "🔧 Step 4: Replacing remaining @/ imports..."

# Components that might be imported from other locations
find . -name "*.tsx" -exec sed -i 's|from "@/components/ui|from "../design-system/primitives|g' {} \;

echo "✅ Replaced remaining @/ imports"

# 5. Fix broken re-export files
echo "🔧 Step 5: Updating re-export files..."

# Update the primitive re-export files to use local components
for file in design-system/primitives/*.tsx; do
  if [[ "$file" != *"-local.tsx" ]] && [[ -f "$file" ]]; then
    filename=$(basename "$file" .tsx)
    if [[ -f "design-system/primitives/${filename}-local.tsx" ]]; then
      echo "export * from './${filename}-local';" > "$file"
      echo "🔄 Updated re-export: $file"
    fi
  fi
done

echo "✅ Updated re-export files"

# 6. Count remaining external imports
echo "📊 Final verification:"
FINAL_EXTERNALS=$(find . -name "*.tsx" -o -name "*.ts" | xargs grep -c "@/" 2>/dev/null | awk -F: '{sum+=$2} END {print sum+0}')
echo "  📉 Remaining external imports: $FINAL_EXTERNALS"
echo "  📈 Reduced by: $((CURRENT_EXTERNALS - FINAL_EXTERNALS)) imports"

if [[ $FINAL_EXTERNALS -eq 0 ]]; then
  echo "🎉 SUCCESS: Theme Editor is now completely standalone!"
  echo "✅ 0 external dependencies remaining"
else
  echo "⚠️  WARNING: $FINAL_EXTERNALS external imports still remain"
  echo "📋 Remaining external imports:"
  find . -name "*.tsx" -o -name "*.ts" | xargs grep "@/" 2>/dev/null | head -10
fi

echo ""
echo "🎯 Summary:"
echo "  - Processed all .tsx and .ts files"
echo "  - Replaced @/components/ui imports with local primitives"
echo "  - Replaced @/lib/utils imports with local utils"
echo "  - Fixed relative path depths"
echo "  - Updated re-export files"
echo "  - Reduced external imports from $CURRENT_EXTERNALS to $FINAL_EXTERNALS"

echo "✅ External imports replacement completed!"