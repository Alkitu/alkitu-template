'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/primitives/ui/card';
import { Button } from '@/components/primitives/ui/button';
import type { OnboardingStepsCardProps, OnboardingStep } from './OnboardingStepsCard.types';

/**
 * OnboardingStepsCard - Atomic Design Organism
 *
 * Displays a list of onboarding steps with progress tracking and completion states.
 * This organism receives **translated text as props** from page components.
 * It does NOT use `useTranslations()` hook directly.
 *
 * @example
 * ```tsx
 * // In page.tsx
 * const t = useTranslations('onboarding');
 * const steps = [
 *   {
 *     id: 1,
 *     title: t('steps.profile.title'),
 *     description: t('steps.profile.description'),
 *     icon: User,
 *     status: 'completed',
 *     href: '/onboarding/profile'
 *   }
 * ];
 *
 * <OnboardingStepsCard
 *   steps={steps}
 *   actionButtonText={t('actions.start')}
 *   completedText={t('status.completed')}
 * />
 * ```
 */
export const OnboardingStepsCard = React.forwardRef<HTMLDivElement, OnboardingStepsCardProps>(
  (
    {
      steps,
      onStepClick,
      progressConfig = {},
      completionConfig = {},
      actionButtonText = 'Start',
      completedText = 'Completed',
      className = '',
      ...props
    },
    ref,
  ) => {
    // Calculate progress
    const completedSteps = steps.filter(step => step.completed || step.status === 'completed');
    const completedCount = completedSteps.length;
    const totalSteps = steps.length;
    const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
    const allCompleted = completedCount === totalSteps && totalSteps > 0;

    // Progress configuration with defaults
    const {
      title: progressTitle = 'Setup Progress',
      progressText = `${completedCount} of ${totalSteps} completed`,
      showProgressBar = true,
    } = progressConfig;

    // Completion configuration with defaults
    const {
      show: showCompletion = true,
      title: completionTitle = 'Setup Complete!',
      description: completionDescription = "You're all set to use the platform",
      buttonText: completionButtonText = 'Go to Dashboard',
      buttonHref: completionButtonHref = '/dashboard',
    } = completionConfig;

    // Handle step click
    const handleStepClick = (step: OnboardingStep) => {
      if (onStepClick && !step.completed && step.status !== 'completed') {
        onStepClick(step);
      }
    };

    return (
      <div ref={ref} className={cn('space-y-6', className)} {...props}>
        {/* Progress Card */}
        {showProgressBar && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">{progressTitle}</span>
                <span className="text-sm text-muted-foreground">{progressText}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.completed || step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <Card
                key={step.id}
                className={cn(
                  'transition-all',
                  isCompleted && 'border-green-500/30 bg-green-50/50 dark:bg-green-900/10',
                  !isCompleted && 'hover:shadow-lg cursor-pointer',
                )}
                onClick={() => handleStepClick(step)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Step Icon/Status */}
                    <div
                      className={cn(
                        'h-12 w-12 rounded-lg flex items-center justify-center shrink-0',
                        isCompleted
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : isCurrent
                            ? 'bg-primary/20'
                            : 'bg-primary/10',
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <Icon className="h-6 w-6 text-primary" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {index + 1}. {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">{step.description}</p>

                      {/* Action Button or Completed Status */}
                      {!isCompleted && step.href && (
                        <Link href={step.href} onClick={e => e.stopPropagation()}>
                          <Button size="sm">
                            {actionButtonText}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      )}

                      {isCompleted && (
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          ✓ {completedText}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Completion Card */}
        {showCompletion && allCompleted && (
          <Card className="text-center bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-8 pb-8">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{completionTitle}</h2>
              <p className="text-muted-foreground mb-6">{completionDescription}</p>
              <Link href={completionButtonHref}>
                <Button size="lg">
                  {completionButtonText}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    );
  },
);

OnboardingStepsCard.displayName = 'OnboardingStepsCard';

export default OnboardingStepsCard;
