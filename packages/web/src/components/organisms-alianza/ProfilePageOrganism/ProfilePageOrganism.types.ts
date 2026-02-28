/**
 * ProfilePageOrganism Types
 *
 * Data-fetching orchestrator that composes UserProfileForm, ChangePasswordForm,
 * and UserPreferencesForm into a tabbed profile page.
 */

export interface ProfilePageOrganismProps {
  /** Whether to show the Locations tab (CLIENT role only) */
  showLocations?: boolean;
  /** Whether to show the Files tab (ADMIN role — browse own Drive folder) */
  showFiles?: boolean;
}
