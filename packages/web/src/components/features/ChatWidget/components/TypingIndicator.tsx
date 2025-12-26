'use client';

interface TypingIndicatorProps {
  userName?: string;
  primaryColor?: string;
}

export function TypingIndicator({ userName = 'Agent', primaryColor = '#22c55e' }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      {/* Avatar */}
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
        style={{ 
          backgroundColor: `${primaryColor}20`,
          color: primaryColor 
        }}
      >
        {userName.substring(0, 2).toUpperCase()}
      </div>

      {/* Typing animation */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-md">
        <span className="text-sm text-gray-600">{userName} is typing</span>
        <div className="flex gap-1">
          <div 
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ 
              backgroundColor: primaryColor,
              animationDelay: '0ms',
              animationDuration: '1s'
            }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ 
              backgroundColor: primaryColor,
              animationDelay: '200ms',
              animationDuration: '1s'
            }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ 
              backgroundColor: primaryColor,
              animationDelay: '400ms',
              animationDuration: '1s'
            }}
          />
        </div>
      </div>
    </div>
  );
}
