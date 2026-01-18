import React from 'react';
import { HeaderAlianza } from '@/components/organisms-alianza';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderAlianza />
      <div className="flex-1 flex items-start justify-center">
        {children}
      </div>
    </div>
  );
}
