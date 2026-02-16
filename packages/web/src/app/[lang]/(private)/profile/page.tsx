'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';

/**
 * Standalone Profile Page - Redirect
 *
 * Redirects to the role-based profile page inside the dashboard layout.
 * Reads the user's role from the session and navigates to /{role}/profile.
 *
 * @route /[lang]/profile -> /[lang]/{role}/profile
 */
export default function ProfileRedirectPage() {
  const router = useRouter();
  const { data: sessionUser, isLoading } = trpc.user.me.useQuery();

  useEffect(() => {
    if (isLoading) return;

    const role = (sessionUser as any)?.role?.toLowerCase() || 'admin';
    const roleMap: Record<string, string> = {
      admin: 'admin',
      client: 'client',
      employee: 'employee',
    };
    const targetRole = roleMap[role] || 'admin';
    router.replace(`/${targetRole}/profile`);
  }, [sessionUser, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
