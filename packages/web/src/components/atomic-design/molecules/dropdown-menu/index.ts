/**
 * DropdownMenu - Atomic Design Molecule
 *
 * This module exports BOTH primitive composition and data-driven patterns.
 *
 * Use cases:
 * - Use primitives for maximum flexibility and custom composition
 * - Use DropdownMenuMolecule for quick data-driven implementation
 *
 * @example Primitive composition
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Open</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Edit</DropdownMenuItem>
 *     <DropdownMenuItem>Delete</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 *
 * @example Data-driven API
 * ```tsx
 * const items = [
 *   { id: '1', label: 'Edit', icon: <Edit /> },
 *   { id: '2', label: 'Delete' }
 * ];
 * <DropdownMenuMolecule items={items} variant="actions" />
 * ```
 */

// Primitive components (for composition)
export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  default,
} from './DropdownMenu';

// Data-driven molecule wrapper
export {
  DropdownMenuMolecule,
  DropdownMenuPresets,
  ExampleMenuItems,
  default as DropdownMenuMoleculeDefault,
} from './DropdownMenuMolecule';

// Types
export type {
  // Primitive types
  DropdownMenuRootProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuGroupProps,
  DropdownMenuPortalProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
  // Data-driven types
  DropdownMenuItemType,
  DropdownMenuItemBadge,
  DropdownMenuDataItem,
  DropdownMenuMoleculeVariant,
  DropdownMenuPlacement,
  DropdownMenuMoleculeProps,
  DropdownMenuPreset,
} from './DropdownMenu.types';
