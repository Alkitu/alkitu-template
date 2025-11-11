export { Select, MemoizedSelect, default } from './Select';
export type { SelectProps, SelectOption, SelectVariant, SelectSize } from './Select.types';

// Re-export shadcn/ui select components for compatibility
export {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../primitives/ui/select';
