# Phase 2: Parallel Task List - Basic Fields Migration

**Strategy**: Copy & Paste from fork-of-block-editor → Refactor for Alkitu
**Execution**: Multiple agents working in parallel with coordination points
**Duration**: 2 weeks (80 hours total)
**Source**: `/Users/luiseurdanetamartucci/Desktop/Proyectos en GitHub/Alkitu/fork-of-block-editor/components/form/`

---

## 🎯 Coordination Strategy

### Rules for Parallel Work
1. **Copy First, Refactor Later** - Start by copying from fork repo
2. **Report Completion** - Each task reports when done
3. **Check Compatibility** - Verify types match across components
4. **Sync Points** - Wait for dependencies before proceeding
5. **Test Integration** - Verify components work together

### Agent Roles
- **Agent A**: Atoms + Utilities
- **Agent B**: Basic Molecules (Text, Number, Select)
- **Agent C**: Advanced Molecules (Date, Time, Toggle)
- **Agent D**: Testing & Storybook
- **Agent E**: Integration & Documentation

---

## 📋 Task Breakdown (30 Tasks Total)

### MILESTONE 1: Foundation (Tasks 1-5) - MUST COMPLETE FIRST
**Duration**: 8 hours
**Dependencies**: None
**Agent**: Agent A

#### Task #1: Copy utility files from fork
**File**: Copy from fork → Alkitu
```bash
# Source
/fork-of-block-editor/lib/

# Target
/packages/web/src/components/features/form-builder/lib/

# Files to copy:
- form-validation.ts (316 lines)
- i18n-helpers.ts (101 lines)
- date-time-validation.ts
- date-time-i18n.ts
```

**Actions**:
1. Copy files as-is
2. Update import paths
3. Verify TypeScript compiles
4. Create lib/index.ts exports

**Deliverable**: ✅ Utility functions available

---

#### Task #2: Create field-helpers utilities
**File**: `/packages/web/src/components/features/form-builder/lib/field-helpers.ts`

**Content** (copy from fork):
```typescript
// Copy logic from fork-of-block-editor/components/form/field-editor-helpers.tsx
// Utilities for field ID generation, validation, etc.
```

**Deliverable**: ✅ Helper functions for field editors

---

#### Task #3: CharacterCount atom
**Source**: `/fork-of-block-editor/components/form/character-count.tsx`
**Target**: `/packages/web/src/components/features/form-builder/atoms/CharacterCount/`

**Files to create**:
```
CharacterCount/
├── CharacterCount.tsx           # Copy from fork
├── CharacterCount.types.ts      # Extract props
├── CharacterCount.test.tsx      # Unit + a11y tests
├── CharacterCount.stories.tsx   # Storybook
└── index.ts                     # Exports
```

**Refactoring needed**:
- Update imports
- Use Alkitu's Radix UI components if applicable
- Add TypeScript strict types
- Match Alkitu's naming conventions

**Deliverable**: ✅ CharacterCount atom ready

---

#### Task #4: TimePicker atom
**Source**: `/fork-of-block-editor/components/form/time-picker.tsx`
**Target**: `/packages/web/src/components/features/form-builder/atoms/TimePicker/`

**Copy & Refactor**:
1. Copy component structure
2. Update to use Radix UI Popover
3. Ensure i18n compatibility
4. Add tests + Storybook

**Deliverable**: ✅ TimePicker atom ready

---

#### Task #5: ImageUpload atom
**Source**: `/fork-of-block-editor/components/form/image-upload.tsx` (8.7KB)
**Target**: `/packages/web/src/components/features/form-builder/atoms/ImageUpload/`

**Copy & Refactor**:
1. Copy component (complex, 8.7KB)
2. Integrate with Alkitu's upload system
3. Add Sharp integration (backend)
4. Tests + Storybook

**Deliverable**: ✅ ImageUpload atom ready

---

### SYNC POINT 1 ⚠️
**Wait for**: Tasks 1-5 complete
**Verification**:
- [ ] Utilities compile and export correctly
- [ ] All 3 atoms have tests passing
- [ ] Storybook stories render
- [ ] No TypeScript errors

---

## MILESTONE 2: Basic Molecules (Tasks 6-12) - CAN RUN IN PARALLEL
**Duration**: 24 hours
**Dependencies**: MILESTONE 1 complete
**Agents**: Agent B, Agent C (split tasks)

### Agent B: Text-Based Fields (Tasks 6-9)

#### Task #6: TextFieldEditor molecule
**Source**: Copy logic from fork for text/email/phone
**Target**: `/packages/web/src/components/features/form-builder/molecules/TextFieldEditor/`

**Handles**: text, email, phone field types

**Copy from fork**:
- `/fork-of-block-editor/components/form/email-field-editor.tsx` (3.9KB)
- `/fork-of-block-editor/components/form/phone-field-editor.tsx` (6.2KB)

**Combine into unified**:
```typescript
// TextFieldEditor.tsx
export function TextFieldEditor({ field, onChange }: FieldEditorProps) {
  const fieldType = field.type; // 'text' | 'email' | 'phone'

  // Copy validation logic from email-field-editor
  // Copy mask logic from phone-field-editor
  // Unified UI
}
```

**Deliverable**: ✅ TextFieldEditor for text/email/phone

---

#### Task #7: TextareaFieldEditor molecule
**Source**: Fork textarea logic
**Target**: `/packages/web/src/components/features/form-builder/molecules/TextareaFieldEditor/`

**Copy from fork**:
- Textarea logic (if exists, or create new)
- Auto-grow functionality
- Character count integration (uses Task #3)

**Features**:
- Auto-resize
- Character counter
- Min/max rows
- Validation

**Deliverable**: ✅ TextareaFieldEditor ready

---

#### Task #8: NumberFieldEditor molecule
**Source**: Fork number field logic
**Target**: `/packages/web/src/components/features/form-builder/molecules/NumberFieldEditor/`

**Copy & Refactor**:
1. Number validation
2. Step controls
3. Min/max enforcement
4. Formatting (locale-aware)

**Deliverable**: ✅ NumberFieldEditor ready

---

#### Task #9: SelectFieldEditor molecule
**Source**: `/fork-of-block-editor/components/form/select-field-editor.tsx` (if exists)
**Target**: `/packages/web/src/components/features/form-builder/molecules/SelectFieldEditor/`

**Copy from fork**:
- Options management
- Default value handling
- Search/filter functionality
- Clear button

**Integrate with**:
- Radix UI Select
- Options editor UI

**Deliverable**: ✅ SelectFieldEditor ready

---

### Agent C: Advanced Input Fields (Tasks 10-12)

#### Task #10: RadioFieldEditor molecule
**Source**: `/fork-of-block-editor/components/form/radio-field-editor.tsx` (4.8KB)
**Target**: `/packages/web/src/components/features/form-builder/molecules/RadioFieldEditor/`

**Copy**:
1. Radio group layout (vertical/horizontal)
2. Options editor
3. Default selection

**Deliverable**: ✅ RadioFieldEditor ready

---

#### Task #11: ToggleFieldEditor molecule
**Source**: Fork toggle/checkbox logic
**Target**: `/packages/web/src/components/features/form-builder/molecules/ToggleFieldEditor/`

**Copy**:
- Toggle switch component
- Checkbox variant
- Checked/unchecked values

**Deliverable**: ✅ ToggleFieldEditor ready

---

#### Task #12: DateTimeFieldEditor molecule
**Source**: `/fork-of-block-editor/components/form/date-time-field-editor.tsx` (19.2KB - COMPLEX)
**Target**: `/packages/web/src/components/features/form-builder/molecules/DateTimeFieldEditor/`

**⚠️ Complex Component** (19KB):
1. Copy entire file
2. Integrate with Radix UI Calendar
3. Use date-time-validation.ts (Task #1)
4. Use date-time-i18n.ts (Task #1)
5. Business hours logic
6. Min/max date restrictions

**Deliverable**: ✅ DateTimeFieldEditor ready

---

### SYNC POINT 2 ⚠️
**Wait for**: Tasks 6-12 complete
**Verification**:
- [ ] All 7 molecules compile
- [ ] Tests passing (>90% coverage)
- [ ] Storybook stories work
- [ ] Components use shared utilities
- [ ] No duplicate code

---

## MILESTONE 3: Testing & Integration (Tasks 13-20)
**Duration**: 24 hours
**Dependencies**: MILESTONE 2 complete
**Agent**: Agent D

#### Task #13: Unit tests for all atoms
**Files**:
- CharacterCount.test.tsx
- TimePicker.test.tsx
- ImageUpload.test.tsx

**Test Coverage**:
- Component rendering
- User interactions
- Edge cases
- Accessibility (jest-axe)

**Target**: 95%+ coverage for atoms

**Deliverable**: ✅ All atom tests passing

---

#### Task #14: Unit tests for TextFieldEditor
**Coverage**:
- Text input validation
- Email validation (real-time)
- Phone number masking
- Error display

**Deliverable**: ✅ TextFieldEditor tests

---

#### Task #15: Unit tests for TextareaFieldEditor
**Coverage**:
- Auto-grow behavior
- Character counting
- Min/max rows
- Validation

**Deliverable**: ✅ TextareaFieldEditor tests

---

#### Task #16: Unit tests for NumberFieldEditor
**Coverage**:
- Number input
- Step controls
- Min/max enforcement
- Invalid input handling

**Deliverable**: ✅ NumberFieldEditor tests

---

#### Task #17: Unit tests for SelectFieldEditor
**Coverage**:
- Option selection
- Search/filter
- Clear functionality
- Default value

**Deliverable**: ✅ SelectFieldEditor tests

---

#### Task #18: Unit tests for RadioFieldEditor
**Coverage**:
- Radio selection
- Layout variants
- Default selection
- Options editor

**Deliverable**: ✅ RadioFieldEditor tests

---

#### Task #19: Unit tests for ToggleFieldEditor
**Coverage**:
- Toggle/checkbox variants
- Checked/unchecked values
- State persistence

**Deliverable**: ✅ ToggleFieldEditor tests

---

#### Task #20: Unit tests for DateTimeFieldEditor
**Coverage**:
- Date selection
- Time selection
- Combined datetime
- Business hours
- Min/max validation
- Locale switching

**Deliverable**: ✅ DateTimeFieldEditor tests (complex)

---

### SYNC POINT 3 ⚠️
**Wait for**: Tasks 13-20 complete
**Verification**:
- [ ] Test coverage >90%
- [ ] All tests passing
- [ ] No failing accessibility tests
- [ ] Coverage report generated

---

## MILESTONE 4: Storybook Documentation (Tasks 21-28)
**Duration**: 16 hours
**Dependencies**: MILESTONE 3 complete
**Agent**: Agent D (continued)

#### Task #21-23: Storybook for Atoms
**Files**:
- CharacterCount.stories.tsx
- TimePicker.stories.tsx
- ImageUpload.stories.tsx

**Each story includes**:
- Default state
- All variants
- Interactive controls
- Accessibility notes
- Usage examples

**Deliverable**: ✅ 3 atom stories

---

#### Task #24-27: Storybook for Molecules
**Files**:
- TextFieldEditor.stories.tsx
- TextareaFieldEditor.stories.tsx
- NumberFieldEditor.stories.tsx
- SelectFieldEditor.stories.tsx

**Deliverable**: ✅ 4 molecule stories

---

#### Task #28: Storybook for Complex Molecules
**Files**:
- RadioFieldEditor.stories.tsx
- ToggleFieldEditor.stories.tsx
- DateTimeFieldEditor.stories.tsx (complex)

**Deliverable**: ✅ 3 complex molecule stories

---

### SYNC POINT 4 ⚠️
**Wait for**: Tasks 21-28 complete
**Verification**:
- [ ] All stories render correctly
- [ ] Interactive controls work
- [ ] Storybook builds without errors
- [ ] Chromatic visual tests pass (optional)

---

## MILESTONE 5: Integration & Documentation (Tasks 29-30)
**Duration**: 8 hours
**Dependencies**: ALL MILESTONES complete
**Agent**: Agent E

#### Task #29: Integration testing
**Create**: `/packages/web/tests/integration/form-builder-phase2.spec.ts`

**Tests**:
1. All field editors render together
2. Validation works across fields
3. Form state updates correctly
4. i18n switches work
5. No console errors
6. Performance (field editors load <100ms each)

**Deliverable**: ✅ Integration tests passing

---

#### Task #30: Documentation
**Files to create/update**:

1. `/docs/02-components/form-builder-atoms.md`
   - Document all 3 atoms
   - Usage examples
   - Props API

2. `/docs/02-components/form-builder-molecules.md`
   - Document all 7 molecules
   - Field type coverage
   - Integration guide

3. `/packages/web/src/components/features/form-builder/README.md`
   - Update with Phase 2 completion
   - List all available components
   - Migration status

4. `/docs/00-conventions/phase2-completion-report.md`
   - Summary of what was built
   - Metrics (coverage, lines of code)
   - Known issues
   - Next steps

**Deliverable**: ✅ Complete documentation

---

## 📊 Task Dependencies Visualization

```
MILESTONE 1 (Foundation)
├── Task #1: Utilities ─┐
├── Task #2: Helpers    │
├── Task #3: CharCount  ├─► SYNC POINT 1
├── Task #4: TimePicker │
└── Task #5: ImageUpload┘
            │
            ▼
MILESTONE 2 (Molecules) - PARALLEL
├─ Agent B ──────────────┐
│  ├── Task #6: TextFieldEditor
│  ├── Task #7: TextareaFieldEditor
│  ├── Task #8: NumberFieldEditor
│  └── Task #9: SelectFieldEditor
│                        ├─► SYNC POINT 2
├─ Agent C ──────────────┤
│  ├── Task #10: RadioFieldEditor
│  ├── Task #11: ToggleFieldEditor
│  └── Task #12: DateTimeFieldEditor
                         │
                         ▼
MILESTONE 3 (Testing) - SEQUENTIAL
├── Task #13: Atom tests
├── Task #14-20: Molecule tests
                         ├─► SYNC POINT 3
                         │
                         ▼
MILESTONE 4 (Storybook) - PARALLEL
├── Task #21-23: Atom stories
├── Task #24-27: Molecule stories
└── Task #28: Complex stories
                         ├─► SYNC POINT 4
                         │
                         ▼
MILESTONE 5 (Integration)
├── Task #29: Integration tests
└── Task #30: Documentation
                         │
                         ▼
                  ✅ PHASE 2 COMPLETE
```

---

## 🔧 Refactoring Checklist (Apply to ALL copied components)

After copying from fork-of-block-editor, refactor each component:

### 1. Imports
```typescript
// ❌ OLD (fork)
import { ... } from '@/components/ui/...'
import { ... } from '@/lib/...'

// ✅ NEW (Alkitu)
import { ... } from '@/components/primitives/...'
import { ... } from '@/components/features/form-builder/lib/...'
import { ... } from '@alkitu/shared'
```

### 2. Component Structure
```typescript
// ✅ REQUIRED FILES
ComponentName/
├── ComponentName.tsx          # Implementation
├── ComponentName.types.ts     # TypeScript types
├── ComponentName.test.tsx     # Vitest + jest-axe
├── ComponentName.stories.tsx  # Storybook
└── index.ts                   # Export
```

### 3. Types
```typescript
// ✅ Use shared types
import type { FormField, FormFieldOption } from '@alkitu/shared';

// ✅ Define component-specific props
export interface ComponentNameProps {
  field: FormField;
  onChange: (field: FormField) => void;
}
```

### 4. Styling
```typescript
// ✅ Use Tailwind CSS classes (Alkitu standard)
// ✅ Use CSS variables for theming
// ✅ Ensure dark mode compatibility
```

### 5. Accessibility
```typescript
// ✅ Add ARIA labels
// ✅ Keyboard navigation
// ✅ Screen reader support
// ✅ Test with jest-axe
```

---

## 📋 Agent Communication Protocol

### When Starting a Task
```
Agent [X]: Starting Task #[N] - [Task Name]
Dependencies: [List tasks it depends on]
ETA: [Hours]
```

### When Blocked
```
Agent [X]: BLOCKED on Task #[N]
Reason: Waiting for Task #[M] completion
Action: Moving to Task #[P] in parallel
```

### When Completing a Task
```
Agent [X]: COMPLETED Task #[N] - [Task Name]
Deliverables:
- ✅ [File 1]
- ✅ [File 2]
Tests: Passing ✅ / Coverage: XX%
Ready for: [Next tasks]
```

### When Finding Issues
```
Agent [X]: ISSUE in Task #[N]
Problem: [Description]
Impact: [Which tasks affected]
Solution: [Proposed fix]
```

---

## 🎯 Success Criteria for Phase 2

### Completion Checklist
- [ ] All 30 tasks completed
- [ ] 10 field types functional
- [ ] Test coverage >90%
- [ ] Storybook stories complete
- [ ] Integration tests passing
- [ ] Documentation complete
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Accessibility tests passing

### Metrics
| Metric | Target |
|--------|--------|
| Components Created | 10 molecules + 3 atoms |
| Test Coverage | >90% |
| Storybook Stories | 13 stories |
| Lines of Code | ~3,000 |
| Tests Written | ~1,000 lines |
| Documentation | 4 guides |

---

## 🚀 Getting Started

### Agent A (Foundation)
```bash
# Start with utilities
cd packages/web/src/components/features/form-builder/lib

# Copy from fork
cp /Users/.../fork-of-block-editor/lib/form-validation.ts ./
cp /Users/.../fork-of-block-editor/lib/i18n-helpers.ts ./

# Refactor imports
# Run tests
# Report completion
```

### Agent B (Text Fields)
```bash
# Wait for SYNC POINT 1
# Then start TextFieldEditor
cd packages/web/src/components/features/form-builder/molecules

# Copy relevant files from fork
# Create structure
# Implement tests
```

### Agent C (Advanced Fields)
```bash
# Wait for SYNC POINT 1
# Then start RadioFieldEditor
# Work in parallel with Agent B
```

### Agent D (Testing)
```bash
# Wait for SYNC POINT 2
# Create comprehensive test suite
# Generate coverage reports
# Create Storybook stories
```

### Agent E (Integration)
```bash
# Wait for SYNC POINT 4
# Run integration tests
# Write documentation
# Create completion report
```

---

## ⏱️ Timeline

| Week | Milestone | Tasks | Agents | Hours |
|------|-----------|-------|--------|-------|
| **Week 1** | MILESTONE 1-2 | 1-12 | A, B, C | 32h |
| **Week 1-2** | MILESTONE 3-4 | 13-28 | D | 40h |
| **Week 2** | MILESTONE 5 | 29-30 | E | 8h |
| **TOTAL** | | 30 tasks | 5 agents | 80h |

---

## 📞 Support & Questions

If any agent encounters:
- **Type conflicts**: Check `/packages/shared/src/types/form-template.types.ts`
- **Import issues**: Verify feature folder structure
- **Test failures**: Check existing passing tests for patterns
- **Unclear requirements**: Refer to fork-of-block-editor source

---

**Ready to execute Phase 2 in parallel?** 🚀

All agents can start their assigned tasks as soon as dependencies are met!
