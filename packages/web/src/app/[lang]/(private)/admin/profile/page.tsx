'use client';

import { ProfilePageOrganism } from '@/components/organisms-alianza/ProfilePageOrganism';

/**
 * Admin Profile Page
 *
 * Profile management page for admin users, rendered inside the admin dashboard layout.
 * Delegates all functionality to the ProfilePageOrganism.
 *
 * @route /[lang]/admin/profile
 */
export default function AdminProfilePage() {
  return <ProfilePageOrganism showFiles />;
}
