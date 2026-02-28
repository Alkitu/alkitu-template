'use client';

import React, { useState } from 'react';
import { ShowcaseContainer } from './ShowcaseContainer';
import { Alert } from '@/components/atoms-alianza/Alert';
import { Shield, Zap, Download, Mail } from 'lucide-react';

/**
 * Alert Showcase Component
 * Demonstrates all Alert atom variants and configurations
 */
export function AlertShowcase() {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const resetDismissed = () => {
    setDismissedAlerts([]);
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Variants */}
      <ShowcaseContainer name="Alert Variants" tokenId="alert-variants">
        <div className="space-y-4 w-full">
          <Alert variant="default">
            This is a default alert with standard styling.
          </Alert>
          
          <Alert variant="info">
            This is an info alert. It provides helpful information to users.
          </Alert>
          
          <Alert variant="success">
            Success! Your changes have been saved successfully.
          </Alert>
          
          <Alert variant="warning">
            Warning: Please review your settings before proceeding.
          </Alert>
          
          <Alert variant="error">
            Error: Something went wrong. Please try again.
          </Alert>
        </div>
      </ShowcaseContainer>

      {/* With Titles */}
      <ShowcaseContainer name="With Titles" tokenId="alert-titles">
        <div className="space-y-4 w-full">
          <Alert variant="info" title="Information">
            Additional context can be provided in the alert body to give users more details.
          </Alert>
          
          <Alert variant="success" title="Operation Successful">
            Your data has been processed and saved to the database.
          </Alert>
          
          <Alert variant="warning" title="Security Notice">
            Your session will expire in 5 minutes. Please save your work.
          </Alert>
          
          <Alert variant="error" title="Connection Failed">
            Unable to connect to the server. Please check your internet connection.
          </Alert>
        </div>
      </ShowcaseContainer>

      {/* Sizes */}
      <ShowcaseContainer name="Sizes" tokenId="alert-sizes">
        <div className="space-y-4 w-full">
          <Alert variant="info" size="sm">
            This is a small alert with compact spacing.
          </Alert>
          
          <Alert variant="success" size="md" title="Medium Alert">
            This is a medium-sized alert (default size).
          </Alert>
          
          <Alert variant="warning" size="lg" title="Large Alert">
            This is a large alert with more generous spacing and larger text.
          </Alert>
        </div>
      </ShowcaseContainer>

      {/* Without Icons */}
      <ShowcaseContainer name="Without Icons" tokenId="no-icons">
        <div className="space-y-4 w-full">
          <Alert variant="info" showIcon={false}>
            This info alert doesn't display an icon.
          </Alert>
          
          <Alert variant="success" showIcon={false} title="No Icon Success">
            Success message without an icon for cleaner appearance.
          </Alert>
        </div>
      </ShowcaseContainer>

      {/* Custom Icons */}
      <ShowcaseContainer name="Custom Icons" tokenId="custom-icons">
        <div className="space-y-4 w-full">
          <Alert variant="info" icon={Shield} title="Security Update">
            Your security settings have been updated successfully.
          </Alert>
          
          <Alert variant="success" icon={Download} title="Download Complete">
            Your file has been downloaded successfully.
          </Alert>
          
          <Alert variant="warning" icon={Zap} title="Performance Notice">
            High system load detected. Some features may be slower.
          </Alert>
          
          <Alert variant="error" icon={Mail} title="Email Failed">
            Failed to send email notification. Please try again.
          </Alert>
        </div>
      </ShowcaseContainer>

      {/* Dismissible Alerts */}
      <ShowcaseContainer name="Dismissible Alerts" tokenId="dismissible-alerts">
        <div className="space-y-4 w-full">
          {!dismissedAlerts.includes('info-dismiss') && (
            <Alert
              variant="info"
              title="Dismissible Info"
              dismissible
              onDismiss={() => handleDismiss('info-dismiss')}
            >
              You can dismiss this alert by clicking the X button.
            </Alert>
          )}
          
          {!dismissedAlerts.includes('success-dismiss') && (
            <Alert
              variant="success"
              title="Dismissible Success"
              dismissible
              onDismiss={() => handleDismiss('success-dismiss')}
            >
              Great job! You can close this notification now.
            </Alert>
          )}
          
          {!dismissedAlerts.includes('warning-dismiss') && (
            <Alert
              variant="warning"
              title="Dismissible Warning"
              dismissible
              onDismiss={() => handleDismiss('warning-dismiss')}
            >
              This warning can be dismissed once you've read it.
            </Alert>
          )}
          
          {dismissedAlerts.length > 0 && (
            <button
              onClick={resetDismissed}
              className="text-sm text-primary hover:text-primary/80 underline"
            >
              Reset dismissed alerts
            </button>
          )}
        </div>
      </ShowcaseContainer>

      {/* Real World Examples */}
      <ShowcaseContainer name="Real World Examples" tokenId="real-world">
        <div className="space-y-4 w-full">
          <Alert variant="success" title="Profile Updated" dismissible>
            Your profile information has been updated successfully. Changes may take a few minutes to appear across all services.
          </Alert>
          
          <Alert variant="warning" title="Maintenance Scheduled">
            System maintenance is scheduled for tonight from 2:00 AM to 4:00 AM EST. Some features may be unavailable during this time.
          </Alert>
          
          <Alert variant="error" title="Payment Failed">
            Your payment could not be processed. Please check your payment method and try again, or contact support for assistance.
          </Alert>
          
          <Alert variant="info" title="New Features Available" icon={Zap}>
            We've added new features to improve your experience! Check out our latest updates in the settings panel.
          </Alert>
        </div>
      </ShowcaseContainer>

    </div>
  );
}

export default AlertShowcase;