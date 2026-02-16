'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from '@/context/TranslationsContext';
import { Heading } from '@/components/atoms-alianza/Typography';
import { UserManagementTable } from '@/components/organisms/admin';
import type { UserManagementLabels } from '@/components/organisms/admin';

/**
 * Admin Users Page
 *
 * Displays user management interface using Atomic Design principles.
 * This page component handles:
 * - Translation of all text labels
 * - Composition of organisms
 * - Configuration (not imperative logic)
 *
 * All state management and business logic is handled by the UserManagementTable organism.
 */
const UsersPage = () => {
  const { lang } = useParams();
  const t = useTranslations();

  // Prepare translated labels for the organism
  const labels: UserManagementLabels = {
    table: {
      user: t('admin.users.table.user'),
      role: t('admin.users.table.role'),
      phone: t('admin.users.table.phone'),
      actions: t('admin.users.table.actions'),
      edit: t('admin.users.table.edit'),
      delete: t('admin.users.table.delete'),
    },
    roles: {
      ADMIN: t('admin.users.roles.ADMIN'),
      EMPLOYEE: t('admin.users.roles.EMPLOYEE'),
      CLIENT: t('admin.users.roles.CLIENT'),
      LEAD: t('admin.users.roles.LEAD'),
    },
    filters: {
      all: t('admin.users.filters.all'),
      admin: t('admin.users.filters.admin'),
      employee: t('admin.users.filters.employee'),
      client: t('admin.users.filters.client'),
    },
    stats: {
      total: t('admin.users.stats.total'),
      admins: t('admin.users.stats.admins'),
      employees: t('admin.users.stats.employees'),
      clients: t('admin.users.stats.clients'),
    },
    actions: {
      search: t('admin.users.actions.search'),
      createUser: t('admin.users.actions.createUser'),
    },
    pagination: {
      showing: t('Common.pagination.showing'),
      to: t('Common.pagination.to'),
      of: t('Common.pagination.of'),
      results: t('Common.pagination.results'),
      rowsPerPage: t('Common.pagination.rowsPerPage'),
      page: t('Common.pagination.page'),
      previous: t('Common.pagination.previous'),
      next: t('Common.pagination.next'),
    },
    deleteConfirm: t('admin.users.messages.deleteConfirm'),
    deleteSuccess: t('admin.users.messages.deleteSuccess'),
    deleteError: t('admin.users.messages.deleteError'),
  };

  return (
    <div className="flex flex-col gap-[36px] p-6">
      {/* Page Title */}
      <Heading level={1} className="text-foreground">
        {t('admin.users.title')}
      </Heading>

      {/* User Management Table Organism */}
      <UserManagementTable lang={lang as string} labels={labels} />
    </div>
  );
};

export default UsersPage;
