'use client';

import Link from 'next/link';
import { Button } from '@/components/primitives/ui/button';
import { Typography } from '@/components/atoms-alianza/Typography';

export default function Custom500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6 max-w-md">
        <Typography
          variant="h1"
          className="text-6xl font-bold text-muted-foreground"
        >
          500
        </Typography>
        <Typography variant="h1" className="text-2xl font-bold">
          Server-side error occurred
        </Typography>
        <Typography variant="p" className="text-muted-foreground">
          We are sorry, but something went wrong on our end.
        </Typography>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
