/**
 * ProfilePageOrganism Types
 *
 * Data-fetching orchestrator that composes UserProfileForm, ChangePasswordForm,
 * and UserPreferencesForm into a tabbed profile page.
 */

export interface ProfilePageOrganismProps {
  /** Whether to show the Locations tab (CLIENT role only) */
  showLocations?: boolean;
}
