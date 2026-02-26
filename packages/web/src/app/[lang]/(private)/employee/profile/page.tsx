'use client';

import { ProfilePageOrganism } from '@/components/organisms-alianza/ProfilePageOrganism';

/**
 * Employee Profile Page
 *
 * Profile management page for employee users, rendered inside the employee dashboard layout.
 * Delegates all functionality to the ProfilePageOrganism.
 *
 * @route /[lang]/employee/profile
 */
export default function EmployeeProfilePage() {
  return <ProfilePageOrganism />;
}
