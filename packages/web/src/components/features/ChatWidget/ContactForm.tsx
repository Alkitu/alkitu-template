'use client';

import { useState } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/Input';
import { Label } from '@/components/primitives/ui/label';
import { Textarea } from '@/components/primitives/ui/textarea';

interface ContactFormProps {
  onSubmit: (contactData: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  }) => void;
  isLoading: boolean;
  config: any;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
}

export function ContactForm({ onSubmit, isLoading, config, initialData }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-3 space-y-3">
      <div className="text-center">
        <h3 className="font-semibold text-base">
          {config?.welcomeMessage || 'Start a conversation'}
        </h3>
        <p className="text-xs text-gray-600 mt-0.5">
          {config?.contactFormMessage ||
            'Please provide your contact information to start chatting with us.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <Label htmlFor="name" className="text-xs">Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Your name"
            required
            className="h-8 text-sm"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-xs">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your@email.com"
            required
            className="h-8 text-sm"
            disabled={isLoading}
          />
        </div>

        {config?.showPhoneField && (
          <div>
            <Label htmlFor="phone" className="text-xs">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Your phone number"
              className="h-8 text-sm"
              disabled={isLoading}
            />
          </div>
        )}

        {config?.showMessageField && (
          <div>
            <Label htmlFor="message" className="text-xs">Initial Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="How can we help you?"
              rows={2}
              className="min-h-[60px] text-sm"
              disabled={isLoading}
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-8 text-sm"
          disabled={isLoading || !formData.name || !formData.email}
          style={{
            backgroundColor: config?.primaryColor || '#007ee6',
            color: config?.textColor || '#FFFFFF',
          }}
        >
          {isLoading ? 'Starting chat...' : 'Start Chat'}
        </Button>
      </form>

      <p className="text-[10px] text-gray-500 text-center">
        {config?.privacyMessage ||
          'Your information is secure and will not be shared.'}
      </p>
    </div>
  );
}
