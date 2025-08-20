#!/bin/bash

# 🔤 SCRIPT DE VALIDACIÓN DE TIPOGRAFÍA - THEME EDITOR 3.0
# Valida que la tipografía esté unificada con el sistema global

echo "🔤 VALIDACIÓN DE CONSISTENCIA TIPOGRÁFICA - THEME EDITOR 3.0"
echo "=============================================================="

# Directorio del Theme Editor
THEME_EDITOR_DIR="$(dirname "$0")/.."

cd "$THEME_EDITOR_DIR"

echo ""
echo "📍 Validando en: $(pwd)"
echo ""

# Contador de problemas
ISSUES=0

echo "🔍 1. Buscando fuentes hardcodeadas..."
HARDCODED_FONTS=$(grep -r -E "fontFamily.*['\"]([A-Z][a-z]+|Inter|Georgia|Arial|Helvetica)" . --include="*.tsx" --include="*.ts" | grep -v "var(--font-" | grep -v "node_modules" | grep -v ".git" | grep -v "validate-typography.sh" | grep -v "constants/typography-classes.ts" | grep -v "utils/typography-tokens.ts")

if [ -n "$HARDCODED_FONTS" ]; then
    echo "❌ ENCONTRADAS fuentes hardcodeadas:"
    echo "$HARDCODED_FONTS"
    ISSUES=$((ISSUES + 1))
else
    echo "✅ No se encontraron fuentes hardcodeadas"
fi

echo ""
echo "🔍 2. Verificando uso de variables CSS de fuentes..."
FONT_VAR_USAGE=$(grep -r "var(--font-" . --include="*.tsx" --include="*.ts" | wc -l)

if [ "$FONT_VAR_USAGE" -gt 0 ]; then
    echo "✅ Encontradas $FONT_VAR_USAGE referencias a variables CSS de fuentes"
else
    echo "⚠️  No se encontraron usos de variables CSS de fuentes"
    ISSUES=$((ISSUES + 1))
fi

echo ""
echo "🔍 3. Verificando configuración Tailwind..."
TAILWIND_CONFIG="../../../tailwind.config.ts"

if [ -f "$TAILWIND_CONFIG" ]; then
    SERIF_CONFIG=$(grep -c "serif.*var(--font-serif)" "$TAILWIND_CONFIG" || echo "0")
    SANS_CONFIG=$(grep -c "sans.*var(--font-sans)" "$TAILWIND_CONFIG" || echo "0")
    MONO_CONFIG=$(grep -c "mono.*var(--font-mono)" "$TAILWIND_CONFIG" || echo "0")
    
    if [ "$SERIF_CONFIG" -gt 0 ] && [ "$SANS_CONFIG" -gt 0 ] && [ "$MONO_CONFIG" -gt 0 ]; then
        echo "✅ Tailwind config tiene todas las fuentes configuradas (sans, serif, mono)"
    else
        echo "❌ Tailwind config incompleto:"
        echo "   Sans: $SANS_CONFIG, Serif: $SERIF_CONFIG, Mono: $MONO_CONFIG"
        ISSUES=$((ISSUES + 1))
    fi
else
    echo "❌ No se encontró tailwind.config.ts"
    ISSUES=$((ISSUES + 1))
fi

echo ""
echo "🔍 4. Buscando tamaños de fuente hardcodeados..."
HARDCODED_SIZES=$(grep -r -E "fontSize.*['\"][0-9]+(px|rem|em)" . --include="*.tsx" --include="*.ts" | grep -v "constants/typography-classes.ts" | grep -v "utils/typography-tokens.ts" | grep -v "validate-typography.sh")

if [ -n "$HARDCODED_SIZES" ]; then
    echo "⚠️  ENCONTRADOS tamaños de fuente hardcodeados:"
    echo "$HARDCODED_SIZES"
    echo "    Considerar usar clases de Tailwind o variables CSS"
else
    echo "✅ No se encontraron tamaños de fuente hardcodeados"
fi

echo ""
echo "🔍 5. Verificando uso consistente de clases tipográficas..."

# Verificar uso de clases font-* de Tailwind
FONT_CLASSES=$(grep -r -E "(font-sans|font-serif|font-mono)" . --include="*.tsx" --include="*.ts" | wc -l)
if [ "$FONT_CLASSES" -gt 0 ]; then
    echo "✅ Encontradas $FONT_CLASSES referencias a clases de fuente de Tailwind"
else
    echo "⚠️  No se encontraron clases de fuente de Tailwind"
fi

# Verificar uso de clases text-* para tamaños
TEXT_SIZE_CLASSES=$(grep -r -E "text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)" . --include="*.tsx" --include="*.ts" | wc -l)
if [ "$TEXT_SIZE_CLASSES" -gt 0 ]; then
    echo "✅ Encontradas $TEXT_SIZE_CLASSES referencias a clases de tamaño de Tailwind"
else
    echo "⚠️  No se encontraron clases de tamaño de texto de Tailwind"
fi

echo ""
echo "🔍 6. Validando estructura de archivos tipográficos..."

# Verificar archivos importantes
REQUIRED_FILES=(
    "constants/typography-classes.ts"
    "utils/typography-tokens.ts"
    "3-theme-editor/typography/types.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
        
        # Verificar que use variables CSS
        if [ "$file" = "3-theme-editor/typography/types.ts" ]; then
            VAR_COUNT=$(grep -c "var(--font-" "$file" || echo "0")
            if [ "$VAR_COUNT" -gt 0 ]; then
                echo "   ✅ Usa $VAR_COUNT variables CSS de fuentes"
            else
                echo "   ❌ No usa variables CSS de fuentes"
                ISSUES=$((ISSUES + 1))
            fi
        fi
    else
        echo "❌ Falta $file"
        ISSUES=$((ISSUES + 1))
    fi
done

echo ""
echo "🔍 7. Verificando conexión con sistema global..."

# Verificar que los temas usen variables CSS en typography
THEME_FILES=("constants/default-themes.ts" "constants/bubblegum-theme.ts")
for file in "${THEME_FILES[@]}"; do
    if [ -f "$file" ]; then
        THEME_FONT_VARS=$(grep -A 5 "typography:" "$file" | grep -c "var(--" || echo "0")
        if [ "$THEME_FONT_VARS" -gt 0 ]; then
            echo "✅ $file conecta tipografía con sistema global"
        else
            echo "❌ $file no conecta tipografía con sistema global"
            ISSUES=$((ISSUES + 1))
        fi
    fi
done

echo ""
echo "🔍 8. Verificando legacy font usage..."
LEGACY_FONTS=$(grep -r -E "(Inter.*sans-serif|Georgia.*serif|Arial|Helvetica)" . --include="*.tsx" --include="*.ts" | grep -v "constants/typography-classes.ts" | grep -v "validate-typography.sh")

if [ -n "$LEGACY_FONTS" ]; then
    echo "⚠️  ENCONTRADO uso de fuentes legacy:"
    echo "$LEGACY_FONTS"
    echo "    Migrar a variables CSS (var(--font-sans), var(--font-serif), etc.)"
else
    echo "✅ No se encontraron fuentes legacy en uso"
fi

echo ""
echo "=============================================================="

if [ $ISSUES -eq 0 ]; then
    echo "🎉 ✅ VALIDACIÓN EXITOSA: Sistema tipográfico 100% consistente"
    echo ""
    echo "📊 RESUMEN:"
    echo "• Sin fuentes hardcodeadas"
    echo "• Uso correcto de variables CSS"
    echo "• Tailwind config completo"
    echo "• Archivos tipográficos presentes"
    echo "• Conexión con sistema global"
    exit 0
else
    echo "⚠️  ❌ VALIDACIÓN FALLIDA: Se encontraron $ISSUES problemas"
    echo ""
    echo "🔧 ACCIONES REQUERIDAS:"
    echo "• Reemplazar fuentes hardcodeadas con variables CSS"
    echo "• Completar configuración Tailwind"
    echo "• Migrar uso legacy a estándar"
    echo "• Conectar todos los temas con sistema global"
    exit 1
fi