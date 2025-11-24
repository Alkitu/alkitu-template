'use client';

import { OnboardingFormOrganism } from '@/components/organisms/onboarding';

/**
 * Onboarding Page (ALI-115)
 *
 * User onboarding page for completing profile after registration.
 * Accessible only to authenticated users with incomplete profiles.
 *
 * Flow:
 * 1. User registers with minimal fields (email, password, firstname, lastname)
 * 2. After email verification and login, middleware redirects here if profileComplete=false
 * 3. User completes additional optional fields (phone, company, address, contactPerson)
 * 4. On completion, user is redirected to dashboard
 *
 * Features:
 * - Optional profile fields
 * - Skip option (complete later)
 * - Contact person information (optional)
 * - Automatic redirect to dashboard on completion
 *
 * @route /[lang]/onboarding
 */
export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full">
        <OnboardingFormOrganism />
      </div>
    </div>
  );
}

