/**
 * CalendarOrganism - Type definitions
 * Atomic Design: Organism
 */

/**
 * Event variant for styling
 */
export type CalendarEventVariant =
  | 'primary' | 'secondary' | 'outline'
  | 'pending' | 'ongoing' | 'completed' | 'cancelled';

/**
 * Calendar view type
 */
export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

/**
 * Calendar event data
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  variant?: CalendarEventVariant;
  resource?: Record<string, unknown>;
}

/**
 * Translated toolbar & UI labels
 *
 * IMPORTANT: All text props should be **translated strings** passed from page components.
 * This organism does NOT handle translations internally.
 */
export interface CalendarLabels {
  today: string;
  previous: string;
  next: string;
  month: string;
  week: string;
  day: string;
  agenda: string;
  noEvents: string;
  showMore: string;
}

/**
 * Slot info returned when selecting a time range
 */
export interface CalendarSlotInfo {
  start: Date;
  end: Date;
  slots: Date[];
  action: 'select' | 'click' | 'doubleClick';
}

/**
 * Props for CalendarOrganism
 *
 * IMPORTANT: All text props should be **translated strings** passed from page components.
 * This organism does NOT handle translations internally.
 */
export interface CalendarOrganismProps {
  /** Array of calendar events */
  events: CalendarEvent[];

  /** Translated UI labels */
  labels: CalendarLabels;

  /** Default calendar view */
  defaultView?: CalendarView;

  /** Callback when an event is clicked */
  onSelectEvent?: (event: CalendarEvent) => void;

  /** Callback when a time slot is selected */
  onSelectSlot?: (slotInfo: CalendarSlotInfo) => void;

  /** Loading state */
  isLoading?: boolean;

  /** Custom className for container */
  className?: string;

  /** Calendar height */
  height?: string | number;
}
