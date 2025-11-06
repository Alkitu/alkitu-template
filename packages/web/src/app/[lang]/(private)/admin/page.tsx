'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Extract language from current path
    const currentLocale = pathname.split('/')[1] || 'es';
    const redirectPath = `/${currentLocale}/admin/dashboard`;
    
    console.log('Admin page - redirecting to:', redirectPath);
    
    // Immediate redirect
    router.replace(redirectPath);
  }, [router, pathname]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to Admin Dashboard...</p>
      </div>
    </div>
  );
}
