import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth/verify-jwt';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants';
import { OnboardingFormOrganism } from '@/components/organisms/onboarding';

/**
 * Onboarding Page (ALI-115)
 *
 * User onboarding page for completing profile after registration.
 * Accessible only to authenticated users with incomplete profiles.
 *
 * Now a Server Component that reads JWT to determine if user is OAuth-based,
 * passing `isOAuthUser` prop so phone becomes required for social login users.
 *
 * Flow:
 * 1. User registers with minimal fields (email, password, firstname, lastname)
 * 2. After email verification and login, middleware redirects here if profileComplete=false
 * 3. User completes additional optional fields (phone, company, location, contactPerson)
 * 4. On completion, user is redirected to dashboard
 *
 * @route /[lang]/onboarding
 */
export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  let isOAuthUser = false;
  if (token) {
    const payload = await verifyJWT(token);
    if (payload?.provider && payload.provider !== 'local') {
      isOAuthUser = true;
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full">
        <OnboardingFormOrganism isOAuthUser={isOAuthUser} />
      </div>
    </div>
  );
}
