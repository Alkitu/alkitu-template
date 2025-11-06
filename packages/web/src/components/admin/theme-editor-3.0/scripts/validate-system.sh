#!/bin/bash

# Sistema de Validación Integrado para Theme Editor 3.0
# Unifica validación de colores, tipografía y consistencia general

set -e

echo "🔍 Sistema de Validación Theme Editor 3.0"
echo "========================================"

# Configuración
PROJECT_ROOT="/Users/leonelperez/CODE PROJECTS/alkitu-template"
THEME_EDITOR_PATH="$PROJECT_ROOT/packages/web/src/components/admin/theme-editor-3.0"
VALIDATION_RESULTS=""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 1. VALIDACIÓN DE COLORES
echo
log "1. Validando consistencia de colores..."

# Buscar colores hardcodeados
HARDCODED_COLORS=$(cd "$THEME_EDITOR_PATH" && find . -name "*.tsx" -o -name "*.ts" | xargs grep -n -E "(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\([^v])" | grep -v "hsl(var(" | grep -v "// Approved:" || true)

if [ -n "$HARDCODED_COLORS" ]; then
    error "Se encontraron colores hardcodeados:"
    echo "$HARDCODED_COLORS"
    VALIDATION_RESULTS+="❌ COLORES: Se encontraron colores hardcodeados\n"
else
    success "✅ No se encontraron colores hardcodeados"
    VALIDATION_RESULTS+="✅ COLORES: Sin colores hardcodeados\n"
fi

# Verificar uso de CSS variables
CSS_VAR_USAGE=$(cd "$THEME_EDITOR_PATH" && grep -r "var(--" . --include="*.tsx" --include="*.ts" | wc -l || echo "0")
log "Variables CSS encontradas: $CSS_VAR_USAGE"

if [ "$CSS_VAR_USAGE" -gt 50 ]; then
    success "✅ Buen uso de variables CSS ($CSS_VAR_USAGE encontradas)"
    VALIDATION_RESULTS+="✅ VARIABLES CSS: Uso adecuado ($CSS_VAR_USAGE variables)\n"
else
    warn "⚠️ Bajo uso de variables CSS ($CSS_VAR_USAGE encontradas)"
    VALIDATION_RESULTS+="⚠️ VARIABLES CSS: Uso limitado ($CSS_VAR_USAGE variables)\n"
fi

# 2. VALIDACIÓN DE TIPOGRAFÍA
echo
log "2. Validando consistencia tipográfica..."

# Buscar fuentes hardcodeadas
HARDCODED_FONTS=$(cd "$THEME_EDITOR_PATH" && find . -name "*.tsx" -o -name "*.ts" | xargs grep -n -E "(fontFamily.*['\"](?!var\(--)[A-Za-z]|font-family.*['\"](?!var\(--)[A-Za-z])" | grep -v "// Approved:" || true)

if [ -n "$HARDCODED_FONTS" ]; then
    error "Se encontraron fuentes hardcodeadas:"
    echo "$HARDCODED_FONTS"
    VALIDATION_RESULTS+="❌ TIPOGRAFÍA: Se encontraron fuentes hardcodeadas\n"
else
    success "✅ No se encontraron fuentes hardcodeadas"
    VALIDATION_RESULTS+="✅ TIPOGRAFÍA: Sin fuentes hardcodeadas\n"
fi

# Verificar uso de variables de fuente
FONT_VAR_USAGE=$(cd "$THEME_EDITOR_PATH" && grep -r "var(--font-" . --include="*.tsx" --include="*.ts" | wc -l || echo "0")
log "Variables de fuente encontradas: $FONT_VAR_USAGE"

if [ "$FONT_VAR_USAGE" -gt 10 ]; then
    success "✅ Buen uso de variables tipográficas ($FONT_VAR_USAGE encontradas)"
    VALIDATION_RESULTS+="✅ VARIABLES TIPOGRÁFICAS: Uso adecuado ($FONT_VAR_USAGE variables)\n"
else
    warn "⚠️ Bajo uso de variables tipográficas ($FONT_VAR_USAGE encontradas)"
    VALIDATION_RESULTS+="⚠️ VARIABLES TIPOGRÁFICAS: Uso limitado ($FONT_VAR_USAGE variables)\n"
fi

# 3. VALIDACIÓN DE TOKENS LEGACY
echo
log "3. Validando tokens legacy..."

# Buscar tokens brand-* obsoletos
LEGACY_TOKENS=$(cd "$THEME_EDITOR_PATH" && find . -name "*.tsx" -o -name "*.ts" | xargs grep -n "brand-\(primary\|secondary\)" || true)

if [ -n "$LEGACY_TOKENS" ]; then
    error "Se encontraron tokens legacy brand-*:"
    echo "$LEGACY_TOKENS"
    VALIDATION_RESULTS+="❌ TOKENS: Tokens legacy brand-* encontrados\n"
else
    success "✅ No se encontraron tokens legacy"
    VALIDATION_RESULTS+="✅ TOKENS: Sin tokens legacy\n"
fi

# 4. VALIDACIÓN DE ESTRUCTURA
echo
log "4. Validando estructura de archivos..."

# Verificar archivos críticos
REQUIRED_FILES=(
    "constants/color-tokens-docs.ts"
    "constants/typography-classes.ts"
    "scripts/validate-colors.sh"
    "ui/index.ts"
    "types/theme.types.ts"
)

MISSING_FILES=""
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$THEME_EDITOR_PATH/$file" ]; then
        MISSING_FILES+="$file "
    fi
done

if [ -n "$MISSING_FILES" ]; then
    error "Archivos requeridos faltantes: $MISSING_FILES"
    VALIDATION_RESULTS+="❌ ESTRUCTURA: Archivos faltantes\n"
else
    success "✅ Todos los archivos requeridos presentes"
    VALIDATION_RESULTS+="✅ ESTRUCTURA: Archivos completos\n"
fi

# 5. VALIDACIÓN DE IMPORTACIONES
echo
log "5. Validando importaciones..."

# Verificar importaciones de UI components
UI_IMPORTS=$(cd "$THEME_EDITOR_PATH" && find . -name "*.tsx" | xargs grep -c "from.*ui/" | awk -F: '{sum+=$2} END {print sum+0}')
EXTERNAL_IMPORTS=$(cd "$THEME_EDITOR_PATH" && find . -name "*.tsx" | xargs grep -c "from.*@/" | awk -F: '{sum+=$2} END {print sum+0}' || echo "0")

log "Importaciones UI internas: $UI_IMPORTS"
log "Importaciones externas: $EXTERNAL_IMPORTS"

if [ "$UI_IMPORTS" -gt "$EXTERNAL_IMPORTS" ]; then
    success "✅ Buena autocontención (más importaciones internas)"
    VALIDATION_RESULTS+="✅ AUTOCONTENCIÓN: Dominan importaciones internas\n"
else
    warn "⚠️ Posible dependencia excesiva externa"
    VALIDATION_RESULTS+="⚠️ AUTOCONTENCIÓN: Revisar dependencias externas\n"
fi

# 6. VALIDACIÓN DE PERFORMANCE
echo
log "6. Validando aspectos de performance..."

# Contar archivos TypeScript/TSX
FILE_COUNT=$(cd "$THEME_EDITOR_PATH" && find . -name "*.tsx" -o -name "*.ts" | wc -l)
COMPONENT_COUNT=$(cd "$THEME_EDITOR_PATH" && find . -name "*.tsx" | wc -l)

log "Archivos totales: $FILE_COUNT"
log "Componentes: $COMPONENT_COUNT"

if [ "$FILE_COUNT" -lt 100 ]; then
    success "✅ Tamaño de módulo manejable ($FILE_COUNT archivos)"
    VALIDATION_RESULTS+="✅ PERFORMANCE: Tamaño adecuado ($FILE_COUNT archivos)\n"
else
    warn "⚠️ Módulo grande, considerar optimización"
    VALIDATION_RESULTS+="⚠️ PERFORMANCE: Módulo grande ($FILE_COUNT archivos)\n"
fi

# RESUMEN FINAL
echo
echo "=========================================="
echo "📊 RESUMEN DE VALIDACIÓN"
echo "=========================================="
echo -e "$VALIDATION_RESULTS"

# Calcular score general
TOTAL_CHECKS=6
SUCCESS_COUNT=$(echo -e "$VALIDATION_RESULTS" | grep -c "✅" || echo "0")
WARNING_COUNT=$(echo -e "$VALIDATION_RESULTS" | grep -c "⚠️" || echo "0")
ERROR_COUNT=$(echo -e "$VALIDATION_RESULTS" | grep -c "❌" || echo "0")

SCORE=$((SUCCESS_COUNT * 100 / TOTAL_CHECKS))

echo
if [ "$SCORE" -ge 90 ]; then
    success "🏆 SCORE GENERAL: $SCORE% - EXCELENTE"
    echo "Theme Editor 3.0 cumple con todos los estándares de calidad."
elif [ "$SCORE" -ge 70 ]; then
    warn "🥉 SCORE GENERAL: $SCORE% - BUENO"
    echo "Theme Editor 3.0 está en buen estado con mejoras menores necesarias."
else
    error "🔴 SCORE GENERAL: $SCORE% - REQUIERE MEJORAS"
    echo "Theme Editor 3.0 necesita optimizaciones antes de considerarse completo."
fi

echo
log "Validación completada. Score: $SCORE%"
log "✅ Éxitos: $SUCCESS_COUNT | ⚠️ Advertencias: $WARNING_COUNT | ❌ Errores: $ERROR_COUNT"

# Return exit code based on score
if [ "$SCORE" -ge 90 ]; then
    exit 0
elif [ "$SCORE" -ge 70 ]; then
    exit 1
else
    exit 2
fi