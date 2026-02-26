import React, { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../primitives/ui/dropdown-menu";
import type { EmployeeAssignmentButtonProps, Employee } from './EmployeeAssignmentButton.types';

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
              <ChevronDown
                className={cn("size-[var(--icon-size-xs)] shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
                strokeWidth={1.33}
              />
            </>
          ) : (
            // Unassigned State
            <>
              <User
                className="size-[var(--icon-size-sm)] shrink-0"
                strokeWidth={1.33}
              />
              <span className="body-sm whitespace-nowrap">
                {placeholder}
              </span>
              <ChevronDown
                className={cn("size-[var(--icon-size-xs)] shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
                strokeWidth={1.33}
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
