#!/bin/bash

# 🔍 SCRIPT DE VALIDACIÓN DE COLORES - THEME EDITOR 3.0
# Valida que no existan colores hardcodeados en el Theme Editor

echo "🎨 VALIDACIÓN DE CONSISTENCIA DE COLORES - THEME EDITOR 3.0"
echo "============================================================="

# Directorio del Theme Editor
THEME_EDITOR_DIR="$(dirname "$0")/.."

cd "$THEME_EDITOR_DIR"

echo ""
echo "📍 Validando en: $(pwd)"
echo ""

# Contador de problemas
ISSUES=0

echo "🔍 1. Buscando colores hex hardcodeados (#xxx)..."
HEX_COLORS=$(grep -r "#[0-9a-fA-F]\{3,8\}" . --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v ".git" | grep -v "validate-colors.sh")

if [ -n "$HEX_COLORS" ]; then
    echo "❌ ENCONTRADOS colores hex hardcodeados:"
    echo "$HEX_COLORS"
    ISSUES=$((ISSUES + 1))
else
    echo "✅ No se encontraron colores hex hardcodeados"
fi

echo ""
echo "🔍 2. Buscando colores rgb/hsl hardcodeados..."
RGB_HSL_COLORS=$(grep -r -E "(rgb|hsl)\(" . --include="*.tsx" --include="*.ts" | grep -v "var(--" | grep -v "node_modules" | grep -v ".git" | grep -v "validate-colors.sh")

if [ -n "$RGB_HSL_COLORS" ]; then
    echo "❌ ENCONTRADOS colores rgb/hsl hardcodeados:"
    echo "$RGB_HSL_COLORS"
    ISSUES=$((ISSUES + 1))
else
    echo "✅ No se encontraron colores rgb/hsl hardcodeados"
fi

echo ""
echo "🔍 3. Verificando uso de variables CSS..."
CSS_VAR_USAGE=$(grep -r "var(--" . --include="*.tsx" --include="*.ts" | grep -E "(color|background|border)" | wc -l)

if [ "$CSS_VAR_USAGE" -gt 0 ]; then
    echo "✅ Encontradas $CSS_VAR_USAGE referencias a variables CSS de color"
else
    echo "⚠️  No se encontraron usos de variables CSS de color"
    ISSUES=$((ISSUES + 1))
fi

echo ""
echo "🔍 4. Buscando clases de color de Tailwind hardcodeadas..."
TAILWIND_COLORS=$(grep -r -E "(text|bg|border)-(red|blue|green|yellow|purple|pink|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-[0-9]" . --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v ".git")

if [ -n "$TAILWIND_COLORS" ]; then
    echo "⚠️  ENCONTRADAS clases de color específicas de Tailwind:"
    echo "$TAILWIND_COLORS"
    echo "    Considerar usar tokens semánticos (primary, secondary, etc.)"
else
    echo "✅ No se encontraron clases de color específicas de Tailwind"
fi

echo ""
echo "🔍 5. Verificando tokens legacy..."
LEGACY_TOKENS=$(grep -r -E "(brand-primary|brand-secondary)" . --include="*.tsx" --include="*.ts" | grep -v "constants/color-tokens-docs.ts" | grep -v "validate-colors.sh")

if [ -n "$LEGACY_TOKENS" ]; then
    echo "⚠️  ENCONTRADOS tokens legacy en uso:"
    echo "$LEGACY_TOKENS"
    echo "    Estos tokens están deprecados, usar --primary y --secondary"
else
    echo "✅ No se encontraron tokens legacy en uso"
fi

echo ""
echo "🔍 6. Validando estructura de archivos de color..."

# Verificar que existan archivos importantes
if [ -f "constants/color-tokens-docs.ts" ]; then
    echo "✅ Documentación de tokens existe"
else
    echo "❌ Falta documentación de tokens de color"
    ISSUES=$((ISSUES + 1))
fi

# Verificar que los temas usen variables CSS
THEME_FILES=("constants/default-themes.ts" "constants/bubblegum-theme.ts")
for file in "${THEME_FILES[@]}"; do
    if [ -f "$file" ]; then
        THEME_VAR_COUNT=$(grep -c "var(--" "$file" || echo "0")
        if [ "$THEME_VAR_COUNT" -gt 0 ]; then
            echo "✅ $file usa $THEME_VAR_COUNT variables CSS"
        else
            echo "❌ $file no usa variables CSS"
            ISSUES=$((ISSUES + 1))
        fi
    fi
done

echo ""
echo "============================================================="

if [ $ISSUES -eq 0 ]; then
    echo "🎉 ✅ VALIDACIÓN EXITOSA: Sistema de colores 100% consistente"
    echo ""
    echo "📊 RESUMEN:"
    echo "• Sin colores hardcodeados"
    echo "• Uso correcto de variables CSS"
    echo "• Documentación presente"
    echo "• Temas unificados"
    exit 0
else
    echo "⚠️  ❌ VALIDACIÓN FALLIDA: Se encontraron $ISSUES problemas"
    echo ""
    echo "🔧 ACCIONES REQUERIDAS:"
    echo "• Reemplazar colores hardcodeados con variables CSS"
    echo "• Usar tokens semánticos en lugar de colores específicos"
    echo "• Migrar tokens legacy a estándar"
    echo "• Completar documentación faltante"
    exit 1
fi