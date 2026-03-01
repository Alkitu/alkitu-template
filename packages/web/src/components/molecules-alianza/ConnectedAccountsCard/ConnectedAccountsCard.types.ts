/**
 * ConnectedAccountsCard Types
 *
 * Molecule that displays linked OAuth providers and allows
 * connecting/disconnecting them from the user's profile.
 */

export interface ConnectedAccountsCardProps {
  /** Translation function scoped to the 'profile' namespace */
  t: (key: string) => string;
}
