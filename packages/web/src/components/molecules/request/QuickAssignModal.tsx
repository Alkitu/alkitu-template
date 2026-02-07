'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, AlertCircle } from 'lucide-react';
import { ResponsiveModal } from '@/components/primitives/ui/responsive-modal';
import { Button } from '@/components/primitives/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import { useTranslations } from '@/context/TranslationsContext';
import { trpc } from '@/lib/trpc';
import { UserRole } from '@alkitu/shared';

interface QuickAssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  onConfirm: (requestId: string, employeeId: string) => Promise<void>;
  isLoading?: boolean;
}

export const QuickAssignModal: React.FC<QuickAssignModalProps> = ({
  open,
  onOpenChange,
  requestId,
  onConfirm,
  isLoading = false,
}) => {
  const t = useTranslations('requests.assign');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  // Use tRPC to fetch employees
  const {
    data: employeesData,
    isLoading: isFetchingEmployees,
    isError,
    error
  } = trpc.user.getFilteredUsers.useQuery(
    {
      role: UserRole.EMPLOYEE,
      limit: 100,
      page: 1,
      sortBy: 'firstname',
      sortOrder: 'asc'
    },
    { enabled: open }
  );

  // Extract employees from the response
  const employees = React.useMemo(() => {
    if (!employeesData) return [];
    // The response has structure: { users: [...], pagination: {...} }
    return employeesData.users || [];
  }, [employeesData]);

  useEffect(() => {
    if (!open) {
      setSelectedEmployeeId('');
    }
  }, [open]);

  // Debug: Log employee data
  useEffect(() => {
    if (employeesData) {
      console.log('Employees data:', employeesData);
      console.log('Employees array:', employees);
    }
  }, [employeesData, employees]);

  const handleConfirm = async () => {
    if (!selectedEmployeeId) return;
    await onConfirm(requestId, selectedEmployeeId);
    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('title') || 'Asignar Empleado'}
      description={t('description') || 'Selecciona un empleado para asignar esta solicitud.'}
    >
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label htmlFor="employeeId" className="text-sm font-medium">
            {t('selectEmployee') || 'Empleado'}
          </label>

          {isError ? (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error?.message || (t('errorFetchingEmployees') || 'Error al cargar empleados')}</span>
            </div>
          ) : (
            <Select
              key={`select-${employees.length}-${employees[0]?.id || 'empty'}`}
              value={selectedEmployeeId}
              onValueChange={setSelectedEmployeeId}
              disabled={isFetchingEmployees || isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isFetchingEmployees
                      ? (t('loadingEmployees') || 'Cargando empleados...')
                      : (t('selectEmployeePlaceholder') || 'Seleccionar empleado')
                  }
                />
              </SelectTrigger>
              <SelectContent style={{ zIndex: 9999 }}>
                <SelectGroup>
                  {isFetchingEmployees ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      Cargando empleados...
                    </div>
                  ) : employees.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      <p className="font-medium">No hay empleados disponibles</p>
                      <p className="text-xs mt-1">
                        Crea usuarios con rol &quot;EMPLOYEE&quot; en Gestión de Usuarios
                      </p>
                    </div>
                  ) : (
                    employees.map((employee: any) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstname} {employee.lastname} ({employee.email})
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!selectedEmployeeId || isLoading}
          className="w-full bg-primary text-primary-foreground font-bold"
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Asignando...
            </>
          ) : (
            'Confirmar Asignación'
          )}
        </Button>
      </div>
    </ResponsiveModal>
  );
};
