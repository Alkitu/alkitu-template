'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Request Edit Page — Redirect
 *
 * Editing is now handled inline in the detail page.
 * This page redirects to the detail view for backwards compatibility.
 */
export default function RequestEditRedirect({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${lang}/admin/requests/${id}`);
  }, [id, lang, router]);

  return null;
}
