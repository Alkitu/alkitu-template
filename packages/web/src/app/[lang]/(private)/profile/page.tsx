'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ProfileFormClientOrganism,
  ProfileFormEmployeeOrganism,
} from '@/components/organisms/profile';
import type { UserRole } from '@alkitu/shared';

/**
 * Profile Page (ALI-116)
 *
 * User profile management page with role-based form rendering.
 * Shows appropriate profile form based on user's role:
 * - CLIENT: Full form with address and contactPerson
 * - EMPLOYEE/ADMIN: Simplified form without address and contactPerson
 *
 * Features:
 * - Role-based form rendering
 * - Pre-filled with current user data
 * - Success notification on update
 * - Automatic navigation back to dashboard on success
 *
 * @route /[lang]/profile
 */

interface UserProfile {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  company?: string;
  address?: string;
  contactPerson?: {
    name: string;
    lastname: string;
    phone: string;
    email: string;
  };
  role: UserRole;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current user profile
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/users/profile');

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSuccess = () => {
    // Optionally navigate back to dashboard after update
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 2000);
  };

  const handleError = (errorMsg: string) => {
    console.error('Profile update error:', errorMsg);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">
            {error || 'Failed to load profile'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update your personal information and preferences
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          {/* Render appropriate form based on role */}
          {user.role === 'CLIENT' ? (
            <ProfileFormClientOrganism
              initialData={{
                firstname: user.firstname,
                lastname: user.lastname,
                phone: user.phone,
                company: user.company,
                address: user.address,
                contactPerson: user.contactPerson,
              }}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          ) : (
            <ProfileFormEmployeeOrganism
              initialData={{
                firstname: user.firstname,
                lastname: user.lastname,
                phone: user.phone,
                company: user.company,
              }}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> Your email address cannot be changed for
            security reasons. If you need to update your email, please contact
            support.
          </p>
          {user.role === 'CLIENT' && (
            <p className="mt-2">
              As a <strong>Client</strong>, you can also update your main
              address and contact person details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

