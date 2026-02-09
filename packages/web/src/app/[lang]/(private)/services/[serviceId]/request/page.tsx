'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { RequestTemplateRenderer } from '@/components/organisms/request-template';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/primitives/ui/button';
import Link from 'next/link';
import type { Service } from '@/components/molecules-alianza/ServiceCard';

/**
 * Service Request Page (ALI-118)
 *
 * Page for submitting a service request using the dynamic form renderer.
 * Fetches the service details and renders its requestTemplate as a form.
 *
 * Features:
 * - Fetches service with request template
 * - Renders dynamic form based on template
 * - Handles form submission
 * - Success/error states
 * - Loading states
 *
 * @route /services/[serviceId]/request
 * @access Authenticated users
 */
export default function ServiceRequestPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /**
   * Fetch service details
   */
  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(`/api/services/${resolvedParams.serviceId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load service');
        }

        setService(data);
      } catch (err: any) {
        console.error('Fetch service error:', err);
        setError(err.message || 'Failed to load service');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [resolvedParams.serviceId]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      console.log('Service request submitted:', {
        serviceId: resolvedParams.serviceId,
        serviceName: service?.name,
        formData,
      });

      // TODO: In future phases, send this to a service requests API endpoint
      // For now, just show success message
      setSubmitSuccess(true);

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to submit request');
    }
  };

  /**
   * Handle submission error
   */
  const handleError = (errorMessage: string) => {
    alert(`Error: ${errorMessage}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-400" />
          <p className="mt-4 text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="h-6 w-6" />
            <div>
              <h2 className="font-semibold">Error Loading Service</h2>
              <p className="mt-1 text-sm text-red-600">
                {error || 'Service not found'}
              </p>
            </div>
          </div>
          <Link href="/services">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Back Button */}
      <Link href="/services">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Button>
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          {service.thumbnail && (
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
              <img
                src={service.thumbnail}
                alt={service.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {service.name}
            </h1>
            <p className="mt-1 text-gray-600">{service.category.name}</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="font-medium text-green-800">
            ✓ Request submitted successfully!
          </p>
          <p className="mt-1 text-sm text-green-600">
            Your service request has been received. We&apos;ll get back to you soon.
          </p>
        </div>
      )}

      {/* Request Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Request Service
        </h2>

        <RequestTemplateRenderer
          template={service.requestTemplate}
          onSubmit={handleSubmit}
          onError={handleError}
          submitButtonText="Submit Request"
        />
      </div>

      {/* Template Debug Info (DEV only) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer font-medium text-gray-700">
            Debug: Request Template JSON
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-gray-800 p-4 text-xs text-green-400">
            {JSON.stringify(service.requestTemplate, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
