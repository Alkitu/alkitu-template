# Theme Editor 3.0 - Testing Commands

**IMPORTANT**: These commands should be added to package.json scripts WITHOUT modifying existing ones.

## Proposed Scripts to Add

```json
{
  "scripts": {
    "test:theme-editor": "vitest run --config vitest.theme-editor.config.ts",
    "test:theme-editor:watch": "vitest --config vitest.theme-editor.config.ts",
    "test:theme-editor:coverage": "vitest run --coverage --config vitest.theme-editor.config.ts",
    "test:theme-editor:ui": "vitest --ui --config vitest.theme-editor.config.ts"
  }
}
```

## Manual Commands for Now

Until the scripts are added to package.json, use these commands directly:

```bash
# Run Theme Editor tests once
npx vitest run --config vitest.theme-editor.config.ts

# Watch Theme Editor tests
npx vitest --config vitest.theme-editor.config.ts

# Run with coverage
npx vitest run --coverage --config vitest.theme-editor.config.ts

# Run with UI
npx vitest --ui --config vitest.theme-editor.config.ts
```

## Coverage Reports

Coverage reports will be generated in:
- `./coverage/theme-editor/` directory
- HTML report: `./coverage/theme-editor/index.html`
- JSON report: `./coverage/theme-editor/coverage-final.json`

## Coverage Thresholds

- **Global**: 85% (lines, functions, branches, statements)
- **Atoms**: 90%
- **Molecules**: 85%
- **Organisms**: 80%
- **Core**: 95%

## Usage Notes

1. These commands run tests ONLY for Theme Editor components
2. They use a separate coverage configuration
3. They don't interfere with existing test setup
4. Results are isolated to theme-editor directory