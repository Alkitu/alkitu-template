# Git Submodules Workflow

## Overview

The alkitu-template monorepo uses git submodules to integrate the design system (`Alkitu/design-system-web`) at `packages/design-system/`. This allows the design system to be developed independently while remaining tightly integrated.

## Structure

```
alkitu-template/
├── packages/
│   ├── api/              (in monorepo)
│   ├── shared/           (in monorepo)
│   ├── web/              (in monorepo)
│   ├── mobile/           (in monorepo - Expo app)
│   └── design-system/    → submodule → github.com/Alkitu/design-system
│       ├── tokens/       (@alkitu/design-tokens)
│       ├── web/          (@alkitu/design-system-web)
│       └── mobile/       (@alkitu/design-system-mobile)
```

## Cloning the Repository

Always use `--recurse-submodules` when cloning:

```bash
git clone --recurse-submodules git@github.com:Alkitu/alkitu-template.git
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

## Daily Workflow

### Updating submodules to latest

```bash
cd packages/design-system
git pull origin main
cd ../..
git add packages/design-system
git commit -m "chore: update design-system submodule to latest"
```

### Making changes to the design system

1. Navigate to the submodule: `cd packages/design-system`
2. Create a branch: `git checkout -b feat/my-change`
3. Make changes, commit, and push to the design-system repo
4. Create a PR in `Alkitu/design-system-web`
5. After merge, update the submodule pointer in alkitu-template

### Important Rules

- **ALWAYS push submodule changes BEFORE updating the pointer** in the parent repo
- **NEVER commit a submodule pointer** that references unpushed commits
- Run `pnpm install` after updating submodules (dependencies may have changed)

## CI/CD

All CI workflows include `submodules: recursive` in the checkout step:

```yaml
- uses: actions/checkout@v4
  with:
    submodules: recursive
```

## Troubleshooting

### Submodule directory is empty

```bash
git submodule update --init --recursive
```

### Submodule points to wrong commit

```bash
cd packages/design-system
git fetch origin
git checkout main
git pull
cd ../..
git add packages/design-system
git commit -m "chore: sync design-system submodule"
```
