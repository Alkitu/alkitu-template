'use client';

import { ProfilePageOrganism } from '@/components/organisms-alianza/ProfilePageOrganism';

/**
 * Client Profile Page
 *
 * Profile management page for client users, rendered inside the client dashboard layout.
 * Includes Locations tab (CLIENT role only).
 *
 * @route /[lang]/client/profile
 */
export default function ClientProfilePage() {
  return <ProfilePageOrganism showLocations />;
}
