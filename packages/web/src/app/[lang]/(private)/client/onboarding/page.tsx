'use client';

import { User, MapPin, Bell } from 'lucide-react';
import { useTranslations } from '@/context/TranslationsContext';
import { OnboardingStepsCard } from '@/components/organisms/onboarding';
import type { OnboardingStep } from '@/components/organisms/onboarding';

/**
 * Client Onboarding Page
 *
 * Guides new CLIENT users through initial setup steps.
 * Uses composition-only pattern following Atomic Design methodology.
 */
export default function ClientOnboardingPage() {
  const t = useTranslations('auth.clientOnboarding');

  // Configure onboarding steps with translated content
  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: t('steps.profile.title'),
      description: t('steps.profile.description'),
      icon: User,
      status: 'upcoming',
      completed: false,
      href: '/profile',
    },
    {
      id: 2,
      title: t('steps.location.title'),
      description: t('steps.location.description'),
      icon: MapPin,
      status: 'upcoming',
      completed: false,
      href: '/locations',
    },
    {
      id: 3,
      title: t('steps.request.title'),
      description: t('steps.request.description'),
      icon: Bell,
      status: 'upcoming',
      completed: false,
      href: '/client/requests/new',
    },
  ];

  // Handle step click for analytics or navigation
  const handleStepClick = (step: OnboardingStep) => {
    console.log('Step clicked:', step.id);
    // TODO: Add analytics tracking here
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Onboarding Steps Organism */}
        <OnboardingStepsCard
          steps={steps}
          onStepClick={handleStepClick}
          progressConfig={{
            title: t('progress.title'),
            progressText: t('progress.completed')
              .replace('{completed}', '0')
              .replace('{total}', steps.length.toString()),
            showProgressBar: true,
          }}
          completionConfig={{
            show: true,
            title: t('completion.title'),
            description: t('completion.description'),
            buttonText: t('completion.button'),
            buttonHref: '/client/dashboard',
          }}
          actionButtonText={t('actions.start')}
          completedText={t('actions.completed')}
        />
      </div>
    </div>
  );
}
