export interface VariableChipProps {
  /** The variable placeholder, e.g. "{{user.name}}" */
  variable: string;
  /** Callback when chip is clicked */
  onClick: (variable: string) => void;
}
