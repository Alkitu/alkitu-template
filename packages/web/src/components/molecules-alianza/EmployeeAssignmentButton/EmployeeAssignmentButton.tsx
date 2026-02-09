import React, { useState } from 'react';
import { Icon } from '../../atoms-alianza/Icon';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../primitives/ui/dropdown-menu";
import type { EmployeeAssignmentButtonProps, Employee } from './EmployeeAssignmentButton.types';

const ICONS = {
  chevron: {
    viewBox: "0 0 14 8",
    path: "M0.665 0.665L6.665 6.665L12.665 0.665"
  },
  user: {
    viewBox: "0 0 10 12",
    paths: [
      "M8.88862 10.6646V9.55348C8.88862 8.96411 8.65449 8.39888 8.23774 7.98213C7.821 7.56539 7.25577 7.33126 6.6664 7.33126H3.33306C2.74369 7.33126 2.17846 7.56539 1.76171 7.98213C1.34497 8.39888 1.11084 8.96411 1.11084 9.55348V10.6646",
      "M5.00054 5.10944C6.22784 5.10944 7.22276 4.11452 7.22276 2.88722C7.22276 1.65992 6.22784 0.665 5.00054 0.665C3.77324 0.665 2.77832 1.65992 2.77832 2.88722C2.77832 4.11452 3.77324 5.10944 5.00054 5.10944Z"
    ]
  }
};

export function EmployeeAssignmentButton({
  options = ["Alejandro G.", "Maria P.", "Juan R.", "Sofia L."],
  defaultAssigned = null,
  onAssign,
  disabled = false,
  isLoading = false,
  error,
  placeholder = "Asignar Employee",
  searchable = false,
  className,
  'data-testid': dataTestId = 'employee-assignment-button',
}: EmployeeAssignmentButtonProps) {
  const [assignedTo, setAssignedTo] = useState<string | null>(defaultAssigned);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (value: string) => {
    setAssignedTo(value);
    setIsOpen(false);
    setSearchTerm('');
    onAssign?.(value);
  };

  const handleUnassign = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAssignedTo(null);
    onAssign?.(null);
  };

  // Normalize options to array of strings
  const normalizedOptions = options.map(opt =>
    typeof opt === 'string' ? opt : opt.name
  );

  // Filter options based on search term
  const filteredOptions = searchable
    ? normalizedOptions.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : normalizedOptions;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          data-testid={dataTestId}
          aria-label={assignedTo ? `Asignado a ${assignedTo}` : placeholder}
          disabled={disabled}
          className={cn(
            "h-[var(--button-height)] rounded-[var(--radius-md)] px-[var(--space-4)] flex items-center justify-center gap-[var(--space-3-75)] transition-all outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 select-none",
            assignedTo
              ? "bg-transparent text-body-md hover:bg-muted-background-m"
              : "bg-primary-1 text-primary-foreground-1 hover:bg-primary-1/90",
            disabled && "opacity-50 cursor-not-allowed hover:bg-primary-1",
            isLoading && "opacity-70 cursor-wait",
            className
          )}
        >
          {isLoading ? (
            <>
              <span className="body-sm whitespace-nowrap">Cargando...</span>
            </>
          ) : assignedTo ? (
            // Assigned State
            <>
              <p className="body-sm text-base-foreground-b whitespace-nowrap">
                Asignado a <span className="text-primary-1">{assignedTo}</span>
              </p>
              <Icon
                paths={[ICONS.chevron.path]}
                viewBox={ICONS.chevron.viewBox}
                className={cn("size-[var(--icon-size-xs)] shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
                strokeWidth="1.33"
                color="currentColor"
              />
            </>
          ) : (
            // Unassigned State
            <>
              <Icon
                paths={ICONS.user.paths}
                viewBox={ICONS.user.viewBox}
                className="size-[var(--icon-size-sm)] shrink-0"
                strokeWidth="1.33"
                color="currentColor"
              />
              <span className="body-sm whitespace-nowrap">
                {placeholder}
              </span>
              <Icon
                paths={[ICONS.chevron.path]}
                viewBox={ICONS.chevron.viewBox}
                className={cn("size-[var(--icon-size-xs)] shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
                strokeWidth="1.33"
                color="currentColor"
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[200px] p-0 gap-0 bg-card-background-c border-border rounded-[var(--radius-xs)] shadow-sm overflow-hidden"
        data-testid="employee-dropdown"
      >
        {error ? (
          <div
            className="h-[var(--size-dropdown-item)] px-[var(--space-3-75)] flex items-center body-sm text-destructive"
            data-testid="error-message"
          >
            {error}
          </div>
        ) : searchable ? (
          <>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[var(--size-dropdown-item)] px-[var(--space-3-75)] body-sm border-b border-border outline-none focus:bg-accent-a"
              data-testid="search-input"
            />
            {filteredOptions.length === 0 ? (
              <div
                className="h-[var(--size-dropdown-item)] px-[var(--space-3-75)] flex items-center body-sm text-muted-foreground"
                data-testid="no-results"
              >
                No se encontraron empleados
              </div>
            ) : (
              filteredOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "h-[var(--size-dropdown-item)] px-[var(--space-3-75)] py-0 cursor-pointer rounded-none outline-none",
                    "body-sm",
                    assignedTo === option
                      ? "bg-accent-a text-accent-foreground-a focus:bg-accent-a focus:text-accent-foreground-a"
                      : "text-card-foreground-c hover:bg-accent-a hover:text-accent-foreground-a focus:bg-accent-a focus:text-accent-foreground-a"
                  )}
                  data-testid={`employee-option-${option}`}
                >
                  {option}
                </DropdownMenuItem>
              ))
            )}
            {assignedTo && (
              <button
                onClick={handleUnassign}
                className="w-full h-[var(--size-dropdown-item)] px-[var(--space-3-75)] body-sm text-destructive hover:bg-accent-a text-left border-t border-border"
                data-testid="unassign-button"
              >
                Desasignar
              </button>
            )}
          </>
        ) : (
          <>
            {filteredOptions.length === 0 ? (
              <div
                className="h-[var(--size-dropdown-item)] px-[var(--space-3-75)] flex items-center body-sm text-muted-foreground"
                data-testid="empty-state"
              >
                No hay empleados disponibles
              </div>
            ) : (
              filteredOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "h-[var(--size-dropdown-item)] px-[var(--space-3-75)] py-0 cursor-pointer rounded-none outline-none",
                    "body-sm",
                    assignedTo === option
                      ? "bg-accent-a text-accent-foreground-a focus:bg-accent-a focus:text-accent-foreground-a"
                      : "text-card-foreground-c hover:bg-accent-a hover:text-accent-foreground-a focus:bg-accent-a focus:text-accent-foreground-a"
                  )}
                  data-testid={`employee-option-${option}`}
                >
                  {option}
                </DropdownMenuItem>
              ))
            )}
            {assignedTo && (
              <button
                onClick={handleUnassign}
                className="w-full h-[var(--size-dropdown-item)] px-[var(--space-3-75)] body-sm text-destructive hover:bg-accent-a text-left border-t border-border"
                data-testid="unassign-button"
              >
                Desasignar
              </button>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

EmployeeAssignmentButton.displayName = 'EmployeeAssignmentButton';
