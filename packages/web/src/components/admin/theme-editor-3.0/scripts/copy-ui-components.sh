#!/bin/bash

# Theme Editor 3.0 - Copy UI Components Script
#
# PREPARACIÓN PRE-ETAPA 7: Batch copy de componentes críticos
#
# Script para copiar TODOS los componentes UI necesarios
# y reemplazar imports automáticamente

echo "🔄 Starting Theme Editor UI components migration..."

# Paths
SOURCE_DIR="../../../../ui"
TARGET_DIR="../design-system/primitives"
UTILS_SOURCE="../../../../ui/utils.ts"
UTILS_TARGET="../lib/utils/index.ts"

# Create target directories
mkdir -p "$TARGET_DIR"
mkdir -p "../lib/utils"

echo "📁 Created target directories"

# Critical components identified from audit
CRITICAL_COMPONENTS=(
  "dialog.tsx"
  "popover.tsx"
  "tabs.tsx"
  "tooltip.tsx"
  "toast.tsx"
  "toaster.tsx"
  "slider.tsx"
  "switch.tsx"
  "table.tsx"
  "textarea.tsx"
  "skeleton.tsx"
  "separator.tsx"
  "progress.tsx"
  "enhanced-color-picker.tsx"
  "dropdown-menu.tsx"
  "command.tsx"
  "context-menu.tsx"
  "radio-group.tsx"
  "toggle.tsx"
  "toggle-group.tsx"
  "sonner.tsx"
  "simple-color-picker.tsx"
)

echo "📋 Found ${#CRITICAL_COMPONENTS[@]} critical components to copy"

# Copy each component and modify imports
for component in "${CRITICAL_COMPONENTS[@]}"; do
  if [[ -f "$SOURCE_DIR/$component" ]]; then
    echo "📋 Copying $component..."

    # Copy component with -local suffix to avoid conflicts
    local_name="${component%.tsx}-local.tsx"

    # Copy and replace imports in one go
    sed 's|from "./utils"|from "../../lib/utils/cn"|g' "$SOURCE_DIR/$component" > "$TARGET_DIR/$local_name"

    echo "✅ Copied $component -> $local_name"
  else
    echo "⚠️  Component $component not found in source"
  fi
done

# Copy and create local utils
echo "🔧 Creating local utils..."

# Create comprehensive utils file
cat > "../lib/utils/index.ts" << 'EOF'
/**
 * Theme Editor 3.0 - Local Utils
 *
 * PREPARACIÓN PRE-ETAPA 7: Standalone Utilities
 *
 * Comprehensive local utilities for Theme Editor
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function para combinar class names con Tailwind merge
 * Copiada EXACTAMENTE de @/components/ui/utils
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export para compatibility
export default cn;

// Additional utils si son necesarias
export { clsx, twMerge };
export type { ClassValue };
EOF

echo "✅ Created local utils"

# Create component index for easy imports
echo "📦 Creating component index..."

cat > "$TARGET_DIR/index.ts" << 'EOF'
/**
 * Theme Editor 3.0 - Primitives Index
 *
 * PREPARACIÓN PRE-ETAPA 7: Local Components Export
 *
 * Centralized exports for all local UI components
 */

// Dialog
export * from './dialog-local';

// Popover
export * from './popover-local';

// Tabs
export * from './tabs-local';

// Form components
export * from './textarea-local';
export * from './slider-local';
export * from './switch-local';
export * from './progress-local';
export * from './radio-group-local';
export * from './toggle-local';
export * from './toggle-group-local';

// Layout components
export * from './table-local';
export * from './separator-local';
export * from './skeleton-local';

// Interactive components
export * from './tooltip-local';
export * from './dropdown-menu-local';
export * from './context-menu-local';
export * from './command-local';

// Toast system
export * from './toast-local';
export * from './toaster-local';
export * from './sonner-local';

// Color pickers
export * from './enhanced-color-picker-local';
export * from './simple-color-picker-local';
EOF

echo "✅ Created component index"

echo "🎯 Summary:"
echo "  - Copied ${#CRITICAL_COMPONENTS[@]} UI components"
echo "  - Created local utils with cn function"
echo "  - Created centralized component index"
echo "  - All imports updated to use local paths"

echo "✅ UI components migration completed!"
echo ""
echo "Next steps:"
echo "1. Run replacement script for existing files"
echo "2. Update primitive re-exports"
echo "3. Test functionality"
echo "4. Verify 0 external dependencies"