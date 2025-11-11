import * as React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import LoadingSpinner from './LoadingSpinner';

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, className, isLoading = false, ...props }, ref) => {
    return (
      <div className="relative">
        {/* {isLoading && (
          <div className="w-full h-full absolute top-0 left-0 right-0 flex justify-center items-center text-primary ">
            <LoadingSpinner className="w-6 h-6 " />
          </div>
        )} */}
        <Button
          className={cn(className, '')}
          ref={ref}
          disabled={isLoading}
          {...props}
        >
          {isLoading && <LoadingSpinner className="w-6 h-6 mr-2" />}
          {children}
        </Button>
      </div>
    );
  },
);
LoadingButton.displayName = 'Button';

export default LoadingButton;
