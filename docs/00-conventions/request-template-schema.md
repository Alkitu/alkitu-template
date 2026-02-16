# Request Template Schema Convention

## Overview

El **Request Template** es un esquema JSON almacenado en el modelo `Service` que define los campos dinámicos que los clientes deben completar al solicitar un servicio. Este sistema permite crear formularios personalizados sin necesidad de modificar el código o la base de datos.

## Estructura del Schema

### RequestTemplate

```typescript
interface RequestTemplate {
  version: string;        // Versión del schema (ej: "1.0")
  fields: TemplateField[]; // Array de campos del formulario
}
```

### TemplateField

```typescript
interface TemplateField {
  id: string;              // Identificador único del campo (snake_case)
  type: FieldType;         // Tipo de campo
  label: string;           // Etiqueta visible para el usuario
  required: boolean;       // Si el campo es obligatorio
  placeholder?: string;    // Texto de ayuda en el campo
  helpText?: string;       // Descripción adicional del campo
  options?: FieldOption[]; // Opciones (solo para select/radio/checkboxGroup)
  validation?: FieldValidation; // Reglas de validación adicionales
  order?: number;          // Orden de visualización
}
```

### FieldType (10 tipos soportados)

```typescript
type FieldType =
  | 'text'           // Campo de texto simple
  | 'textarea'       // Área de texto multilínea
  | 'number'         // Campo numérico
  | 'select'         // Selector dropdown
  | 'radio'          // Botones de opción única
  | 'checkbox'       // Checkbox individual
  | 'checkboxGroup'  // Grupo de checkboxes
  | 'date'           // Selector de fecha
  | 'time'           // Selector de hora
  | 'file';          // Carga de archivo
```

### FieldOption

```typescript
interface FieldOption {
  value: string;  // Valor interno del option
  label: string;  // Texto visible para el usuario
}
```

**Formato correcto:**
```json
{
  "options": [
    { "value": "baja", "label": "Baja" },
    { "value": "media", "label": "Media" },
    { "value": "alta", "label": "Alta" }
  ]
}
```

**Formato legacy (soportado pero no recomendado):**
```json
{
  "options": ["Baja", "Media", "Alta"]
}
```

### FieldValidation

```typescript
interface FieldValidation {
  minLength?: number;      // Longitud mínima (text/textarea)
  maxLength?: number;      // Longitud máxima (text/textarea)
  min?: number;            // Valor mínimo (number)
  max?: number;            // Valor máximo (number)
  pattern?: string;        // Regex de validación
  customMessage?: string;  // Mensaje de error personalizado
}
```

## Ejemplos de Templates

### Template Básico - Limpieza

```json
{
  "version": "1.0",
  "fields": [
    {
      "id": "titulo",
      "type": "text",
      "label": "Título del Servicio",
      "required": true,
      "placeholder": "Ej: Limpieza profunda de oficina",
      "validation": {
        "minLength": 5,
        "maxLength": 100
      }
    },
    {
      "id": "descripcion",
      "type": "textarea",
      "label": "Descripción Detallada",
      "required": true,
      "placeholder": "Describe el trabajo a realizar...",
      "helpText": "Por favor sea lo más específico posible",
      "validation": {
        "minLength": 20,
        "maxLength": 500
      }
    },
    {
      "id": "urgencia",
      "type": "select",
      "label": "Nivel de Urgencia",
      "required": true,
      "options": [
        { "value": "baja", "label": "Baja - No urgente" },
        { "value": "media", "label": "Media - Esta semana" },
        { "value": "alta", "label": "Alta - Hoy/Mañana" }
      ]
    },
    {
      "id": "areas_limpiar",
      "type": "checkboxGroup",
      "label": "Áreas a Limpiar",
      "required": true,
      "options": [
        { "value": "oficinas", "label": "Oficinas" },
        { "value": "banos", "label": "Baños" },
        { "value": "cocina", "label": "Cocina" },
        { "value": "recepcion", "label": "Recepción" },
        { "value": "pasillos", "label": "Pasillos" }
      ]
    },
    {
      "id": "fecha_preferida",
      "type": "date",
      "label": "Fecha Preferida",
      "required": false,
      "helpText": "Si tiene preferencia de fecha específica"
    }
  ]
}
```

### Template Avanzado - Mantenimiento

```json
{
  "version": "1.0",
  "fields": [
    {
      "id": "tipo_mantenimiento",
      "type": "radio",
      "label": "Tipo de Mantenimiento",
      "required": true,
      "options": [
        { "value": "preventivo", "label": "Preventivo" },
        { "value": "correctivo", "label": "Correctivo" },
        { "value": "emergencia", "label": "Emergencia" }
      ]
    },
    {
      "id": "equipo_afectado",
      "type": "text",
      "label": "Equipo o Área Afectada",
      "required": true,
      "placeholder": "Ej: Aire acondicionado sala 3"
    },
    {
      "id": "problema_descripcion",
      "type": "textarea",
      "label": "Descripción del Problema",
      "required": true,
      "rows": 4
    },
    {
      "id": "requiere_herramientas",
      "type": "checkbox",
      "label": "¿Requiere herramientas especiales?",
      "required": false
    },
    {
      "id": "adjuntar_foto",
      "type": "file",
      "label": "Adjuntar Foto del Problema",
      "required": false,
      "helpText": "Formatos aceptados: JPG, PNG (máx 5MB)"
    },
    {
      "id": "presupuesto_estimado",
      "type": "number",
      "label": "Presupuesto Estimado (USD)",
      "required": false,
      "validation": {
        "min": 0,
        "max": 10000
      }
    }
  ]
}
```

## Reglas de Naming

### IDs de Campos

- **Formato**: `snake_case` (minúsculas con guiones bajos)
- **Caracteres permitidos**: letras, números, guiones bajos
- **No permitido**: espacios, caracteres especiales, acentos
- **Único**: No puede haber IDs duplicados en el mismo template

**Ejemplos válidos:**
```
descripcion_problema
fecha_preferida
tipo_servicio
area_trabajo_2
```

**Ejemplos inválidos:**
```
Descripción Problema  // Espacios y mayúsculas
fecha-preferida       // Guiones en vez de guiones bajos
área_trabajo          // Acentos
tipo.servicio         // Puntos
```

### Labels

- **Formato**: Texto libre, legible para humanos
- **Recomendación**: Usar capitalización apropiada
- **Longitud**: 3-50 caracteres recomendado

**Ejemplos:**
```
"Descripción del Problema"
"Nivel de Urgencia"
"¿Requiere herramientas especiales?"
```

## Validación

### Backend (API)

El validator en `/packages/api/src/services/validators/request-template.validator.ts` valida:

1. **Estructura básica**:
   - `version` es string y existe
   - `fields` es array no vacío

2. **Cada campo**:
   - `id` es único y válido (snake_case)
   - `type` es uno de los 10 tipos soportados
   - `label` no está vacío
   - `required` es boolean

3. **Options** (para select/radio/checkboxGroup):
   - Es array no vacío
   - Cada option tiene `value` y `label`

4. **Validation rules**:
   - Números son válidos para min/max
   - Pattern es regex válido

### Frontend (React Hook Form + Zod)

Los componentes `DynamicForm` y `RequestTemplateRenderer` validan en tiempo real:

1. **Campos requeridos**: No pueden estar vacíos
2. **Longitud**: Respeta minLength/maxLength
3. **Números**: Respeta min/max
4. **Pattern**: Valida contra regex
5. **Tipos**: Input type correcto según el campo

## Almacenamiento de Respuestas

### En Request Model

```typescript
Request {
  serviceId: string;
  templateResponses: Record<string, unknown>;  // Respuestas del cliente
}
```

### Formato de templateResponses

```json
{
  "titulo": "Limpieza profunda de oficina principal",
  "descripcion": "Requiero limpieza completa incluyendo ventanas...",
  "urgencia": "alta",
  "areas_limpiar": ["oficinas", "banos", "cocina"],
  "fecha_preferida": "2024-03-20"
}
```

**Características:**
- Keys coinciden con los `id` de los campos del template
- Values son del tipo apropiado (string, number, boolean, array)
- Solo campos completados están presentes
- Campos opcionales pueden estar ausentes

## Workflow de Uso

### 1. Admin Crea Servicio

```
Admin → Service Create Page
  ├─ Step 1: Información Básica (nombre, categoría, estado)
  └─ Step 2: FormBuilder
      ├─ Agrega campos uno por uno
      ├─ Configura cada campo (tipo, label, validación)
      ├─ Preview en tiempo real
      └─ Guarda template en service.requestTemplate
```

### 2. Cliente Solicita Servicio

```
Cliente → Request Service Flow
  ├─ Step 1: Selecciona servicio
  ├─ Step 2: RequestTemplateRenderer
  │   ├─ Lee service.requestTemplate
  │   ├─ Renderiza campos dinámicos
  │   ├─ Valida inputs
  │   └─ Recolecta respuestas
  └─ Step 3: Guarda en request.templateResponses
```

### 3. Admin Crea Request (Manual)

```
Admin → Create Request
  ├─ Step 1: Selecciona cliente
  ├─ Step 2: Selecciona servicio
  ├─ Step 3: RequestTemplateRenderer (igual que cliente)
  ├─ Step 4: Selecciona ubicación
  └─ Step 5: Fecha/hora y submit
```

## Migración de Formatos Antiguos

Si encuentra templates con formato legacy (`options` como array de strings):

### Opción 1: Actualizar en Seed Scripts

```typescript
// ANTES
options: ['Baja', 'Media', 'Alta']

// DESPUÉS
options: [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' }
]
```

### Opción 2: Adaptación en Runtime

Los componentes `DynamicForm` normalizan automáticamente:

```typescript
const normalizedOptions = field.options?.map(opt =>
  typeof opt === 'string'
    ? { value: opt, label: opt }
    : opt
);
```

## Guía de Uso del FormBuilder

### Crear Nuevo Campo

1. Click en "Agregar Campo"
2. Seleccionar tipo de campo
3. Ingresar label (el ID se genera automático)
4. Marcar si es requerido
5. Configurar opciones (si aplica)
6. Agregar validaciones (opcional)
7. Guardar campo

### Editar Campo Existente

1. Click en ícono de edición
2. Modificar propiedades
3. Guardar cambios

### Vista Previa

- La columna derecha muestra preview en tiempo real
- No es funcional (solo visual)
- Permite validar UX antes de guardar

### Eliminar Campo

1. Click en ícono de eliminación
2. Confirmar acción
3. Campo se elimina del template

## Best Practices

### 1. Diseño de Templates

- ✅ Mantener templates simples (5-10 campos máximo)
- ✅ Usar help text para claridad
- ✅ Agrupar campos relacionados
- ✅ Marcar solo campos críticos como requeridos
- ❌ No crear formularios excesivamente largos
- ❌ No usar validaciones muy restrictivas

### 2. Naming

- ✅ IDs descriptivos: `tipo_servicio` mejor que `ts`
- ✅ Labels claros: "Nivel de Urgencia" mejor que "Urgencia"
- ✅ Consistencia en naming: siempre snake_case para IDs
- ❌ No usar abreviaciones confusas
- ❌ No mezclar idiomas en IDs

### 3. Validación

- ✅ Usar validación apropiada al tipo
- ✅ Mensajes de error claros y en español
- ✅ Rangos razonables para números
- ❌ No sobre-validar (frustración del usuario)
- ❌ No regex excesivamente complejos

### 4. Opciones

- ✅ Labels descriptivos en options
- ✅ Values en minúsculas sin espacios
- ✅ Máximo 10-15 options por campo
- ❌ No crear selects con 50+ opciones
- ❌ No usar values con espacios o caracteres especiales

### 5. Performance

- ✅ Templates < 20 campos
- ✅ JSON compacto (sin indentación innecesaria)
- ✅ Validación eficiente
- ❌ No templates con 100+ campos
- ❌ No cargar archivos muy grandes

## Troubleshooting

### Error: "Invalid field ID"

**Causa**: ID contiene caracteres no permitidos

**Solución**: Usar solo letras, números y guiones bajos en minúsculas

### Error: "Duplicate field IDs"

**Causa**: Dos campos tienen el mismo ID

**Solución**: Asegurar que cada campo tenga ID único

### Error: "Options required for select field"

**Causa**: Campo tipo select/radio/checkboxGroup sin options

**Solución**: Agregar al menos una opción al campo

### Template no se guarda

**Causa**: Validación backend falló

**Solución**: Revisar estructura JSON en console, verificar todos los campos requeridos

### Preview no se actualiza

**Causa**: Componente en modo "preview only"

**Solución**: Esto es normal, el preview no es interactivo

## Versionado

### Version 1.0 (Actual)

- 10 tipos de campo soportados
- Validación básica y avanzada
- Options en formato objeto
- Backward compatible con arrays de strings

### Futuras Versiones

Posibles features para v2.0:
- Campos condicionales (mostrar campo B si campo A = X)
- Validación cross-field
- Campos calculados
- Templates anidados/secciones
- Multi-idioma en labels

## Referencias

### Archivos Clave

- **Validator**: `/packages/api/src/services/validators/request-template.validator.ts`
- **Types**: `/packages/web/src/components/organisms-alianza/FormBuilder/FormBuilder.types.ts`
- **FormBuilder**: `/packages/web/src/components/organisms-alianza/FormBuilder/`
- **Renderer**: `/packages/web/src/components/organisms-alianza/RequestTemplateRenderer/`
- **DynamicForm**: `/packages/web/src/components/molecules-alianza/DynamicForm/`

### Documentación Relacionada

- [Atomic Design Architecture](/docs/00-conventions/atomic-design-architecture.md)
- [Component Structure and Testing](/docs/00-conventions/component-structure-and-testing.md)
- [API Design Patterns](/docs/00-conventions/api-design-patterns.md)

## Contribuir

Al agregar nuevos tipos de campo:

1. Actualizar `FieldType` en types
2. Agregar validación en backend validator
3. Agregar soporte en `DynamicForm`
4. Agregar opción en `FieldEditor`
5. Actualizar esta documentación
6. Agregar tests para el nuevo tipo
