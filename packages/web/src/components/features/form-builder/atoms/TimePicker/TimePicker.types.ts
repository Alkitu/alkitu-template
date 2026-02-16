export interface TimePickerProps {
  /**
   * Current time value in HH:mm or HH:mm:ss format
   */
  value?: string;

  /**
   * Callback function triggered when time changes
   */
  onChange: (value: string) => void;

  /**
   * Use 24-hour format (true) or 12-hour format with AM/PM (false)
   * @default false
   */
  format24?: boolean;

  /**
   * Include seconds in the time picker
   * @default false
   */
  includeSeconds?: boolean;

  /**
   * Time interval in minutes for quick selection (e.g., 15, 30)
   * When provided, displays preset time options
   */
  interval?: number;

  /**
   * Minimum hour allowed (0-23 for 24h, 1-12 for 12h format)
   */
  minHour?: number;

  /**
   * Maximum hour allowed (0-23 for 24h, 1-12 for 12h format)
   */
  maxHour?: number;

  /**
   * Placeholder text when no time is selected
   * @default "Select time"
   */
  placeholder?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes for the trigger button
   */
  className?: string;

  /**
   * Locale for translations (en or es)
   * @default "en"
   */
  locale?: 'en' | 'es';
}
