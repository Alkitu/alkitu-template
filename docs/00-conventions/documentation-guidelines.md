# Documentation Guidelines

This document defines the conventions and guidelines for creating and maintaining documentation in the Alkitu Template project.

## Critical Documentation Rules

### 1. Always Create Documentation in `/docs/00-conventions/`

**IMPORTANT**: When solving a problem, issue, or implementing a new pattern that should be documented as a convention, you MUST:

- Create a new documentation file in `/docs/00-conventions/`
- Use descriptive, kebab-case filenames (e.g., `documentation-guidelines.md`, `naming-conventions.md`)
- Write clear, actionable guidelines that others can follow
- Include examples when applicable

### 2. File Naming Conventions

All documentation files should follow these naming conventions:

- **Lowercase with hyphens**: Use kebab-case (e.g., `api-design-patterns.md`)
- **Descriptive names**: Name should clearly indicate the content (e.g., `state-management-guidelines.md`)
- **No spaces**: Use hyphens instead of spaces
- **Markdown extension**: All documentation must use `.md` extension

### 3. Documentation Structure

Each convention document should include:

```markdown
# [Title]

Brief description of what this convention covers.

## Purpose

Why this convention exists and what problem it solves.

## Rules/Guidelines

Clear, numbered or bulleted list of rules to follow.

## Examples

Practical examples showing correct usage.

## Anti-Patterns

Examples of what NOT to do (optional but recommended).

## Related Documentation

Links to related conventions or documentation.
```

### 4. When to Create Convention Documentation

Create a convention document when:

- ✅ Solving a recurring problem that others might face
- ✅ Establishing a new pattern or best practice for the project
- ✅ Defining coding standards or architectural decisions
- ✅ Documenting workflow or process guidelines
- ✅ Clarifying ambiguous or contentious decisions

Do NOT create convention documentation for:

- ❌ Temporary or one-off solutions
- ❌ External library documentation (link to official docs instead)
- ❌ Code comments (those belong in the code itself)
- ❌ Meeting notes or informal discussions

### 5. Documentation Organization

The `/docs/` directory is organized as follows:

```
docs/
├── 00-conventions/          # Project conventions and guidelines (THIS DIRECTORY)
├── 01-architecture/         # System architecture documentation
├── 02-components/           # Component templates (atoms, molecules, organisms)
├── 03-ai-agents/           # AI agent protocols and workflows
├── 04-product/             # Product specifications and requirements
├── 05-guides/              # How-to guides and tutorials
└── 05-testing/             # Testing strategies and guidelines
```

### 6. Keeping Documentation Current

- **Update, don't duplicate**: If a convention changes, update the existing document
- **Mark deprecated**: If a convention is no longer valid, mark it clearly at the top
- **Reference from CLAUDE.md**: Important conventions should be referenced in the root `CLAUDE.md` file
- **Review regularly**: Documentation should be reviewed and updated as part of the development process

### 7. Writing Style Guidelines

- **Be concise**: Get to the point quickly
- **Be actionable**: Provide clear steps or rules to follow
- **Be specific**: Avoid vague language like "should probably" or "might want to"
- **Use examples**: Show, don't just tell
- **Use formatting**: Use markdown features (lists, code blocks, emphasis) for clarity

## Examples

### Good Documentation File Names

- `naming-conventions.md`
- `git-workflow-guidelines.md`
- `api-error-handling-standards.md`
- `component-design-patterns.md`

### Bad Documentation File Names

- `Naming Conventions.md` (spaces, capital letters)
- `stuff.md` (not descriptive)
- `todo.md` (not a convention)
- `notes_from_meeting.md` (underscores, not a convention)

## Template for New Conventions

When creating a new convention document, use this template:

```markdown
# [Convention Title]

Brief description of what this convention covers and why it exists.

## Purpose

Explain the problem this convention solves.

## Rules

1. First rule with clear explanation
2. Second rule with clear explanation
3. etc.

## Examples

### Good Example

\```typescript
// Show correct usage
\```

### Bad Example (Anti-Pattern)

\```typescript
// Show incorrect usage
\```

## Enforcement

How this convention is enforced (linters, code review, etc.)

## Related Documentation

- Link to related conventions
- Link to external resources
```

## Enforcement

- All contributors must read and follow these guidelines
- Code reviews should check for adherence to documented conventions
- The `CLAUDE.md` file should reference critical conventions
- AI agents (Claude Code) should consult `/docs/00-conventions/` when making decisions

## Related Documentation

- `/CLAUDE.md` - Main project guidance for Claude Code
- `/docs/01-architecture/` - System architecture documentation
- `/docs/05-guides/` - Development guides and tutorials
