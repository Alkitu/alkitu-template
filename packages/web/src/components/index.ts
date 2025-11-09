// Design System Main Exports (Internalized)

// Atoms
export * from './atomic-design/atoms';

// Molecules
export * from './atomic-design/molecules';

// Organisms
export * from './atomic-design/organisms';

// Templates
export * from './atomic-design/templates';

// System
export * from './atomic-design/system/ComponentDemo';
export * from './atomic-design/system/ComponentSpecs';

// Contexts
export { BrandingProvider } from '../context/BrandingContext';

// Themes and Tokens
// export * from './themes/tokens'; // Commented out - file doesn't exist

// Data
export * from './data/componentsData';

// Re-export shadcn/ui components for compatibility (non-conflicting only)
export * from './ui/scroll-area';
export * from './ui/accordion';
export * from './ui/alert-dialog';
export * from './ui/alert';
// export * from './ui/avatar'; // Conflicts with atoms/Avatar
// export * from './ui/badge'; // Conflicts with atoms/Badge
// export * from './ui/breadcrumb'; // Conflicts with molecules/Breadcrumb
// export * from './ui/button'; // Conflicts with atoms/Button
export * from './ui/calendar';
// export * from './ui/card'; // Conflicts with molecules/Card
export * from './ui/carousel';
// export * from './ui/checkbox'; // Conflicts with atoms/Checkbox
export * from './ui/collapsible';
export * from './ui/command';
export * from './ui/context-menu';
export * from './ui/dialog';
export * from './ui/drawer';
export * from './ui/dropdown-menu';
// export * from './ui/form'; // Conflicts with molecules/FormField
export * from './ui/hover-card';
// export * from './ui/input'; // Conflicts with atoms/Input
export * from './ui/label';
export * from './ui/menubar';
export * from './ui/navigation-menu';
export * from './ui/pagination';
export * from './ui/popover';
export * from './ui/progress';
// export * from './ui/radio-group'; // Conflicts with atoms/RadioGroup
export * from './ui/resizable';
export * from './ui/select';
export * from './ui/separator';
export * from './ui/sheet';
// export * from './ui/sidebar'; // Conflicts with organisms/Sidebar
export * from './ui/skeleton';
export * from './ui/slider';
export * from './ui/switch';
// export * from './ui/table'; // Conflicts with organisms/Table
export * from './ui/tabs';
export * from './ui/textarea';
export * from './ui/toggle';
export * from './ui/toggle-group';
// export * from './ui/tooltip'; // Conflicts with atoms/Tooltip
