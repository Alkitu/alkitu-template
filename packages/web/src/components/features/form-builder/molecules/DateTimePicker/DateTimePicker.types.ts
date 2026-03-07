import type { DateFieldOptions } from '@alkitu/shared';

export interface DateTimePickerProps {
  mode: 'date' | 'time' | 'datetime';
  value?: string;
  onChange: (value: string) => void;
  dateOptions?: DateFieldOptions;
  locale?: 'en' | 'es';
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
