import { Switch } from '../primitives/ui/switch';

interface ToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Toggle({ checked, onCheckedChange, className }: ToggleProps) {
  return (
    <Switch 
      checked={checked} 
      onCheckedChange={onCheckedChange} 
      className={className} 
    />
  );
}
