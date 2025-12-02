'use client';

import { useRouter } from 'next/navigation';
import { RequestFormOrganism } from '@/components/organisms/request';
import { ArrowLeft } from 'lucide-react';

/**
 * Create Service Request Page (ALI-119)
 *
 * Page for creating new service requests.
 * CLIENT role only - employees and admins cannot create requests.
 *
 * Features:
 * - Service selection with template fields
 * - Location selection
 * - Execution date/time picker
 * - Dynamic form fields based on service template
 * - Validation with error messages
 * - Success navigation to request detail
 * - Cancel navigation back to list
 *
 * @route /[lang]/requests/new
 */
export default function NewRequestPage() {
  const router = useRouter();

  const handleSuccess = (request: { id: string }) => {
    // Navigate to the newly created request detail page
    router.push(`/requests/${request.id}`);
  };

  const handleCancel = () => {
    // Navigate back to requests list
    router.push('/requests');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </button>

          <h1 className="text-3xl font-bold tracking-tight">
            New Service Request
          </h1>
          <p className="mt-2 text-muted-foreground">
            Fill in the details below to create a new service request
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <RequestFormOrganism
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>

        {/* Help Text */}
        <div className="mt-6 text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> After submitting your request, it will be
            reviewed and assigned to an available employee. You will be notified
            once an employee has been assigned.
          </p>
          <p className="mt-2">
            You can track the status of your request and cancel it if needed
            before it moves to the <strong>ONGOING</strong> status.
          </p>
        </div>
      </div>
    </div>
  );
}
