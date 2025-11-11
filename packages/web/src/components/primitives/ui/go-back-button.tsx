'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';
import { ArrowLeftCircle } from 'lucide-react';

type Props = {
  label: string;
  href: string;
  className?: string;
};

const GoBackButton = ({ label, href, className }: Props) => {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: 'link', size: 'sm' }),
        `font-normal text-xs self-start p-0 ${className}`,
      )}
      href={href}
    >
      <ArrowLeftCircle className="w-4 h-4 mr-2" />
      <p className="text-tiny md:block hidden">{label}</p>
    </Link>
  );
};

export default GoBackButton;
