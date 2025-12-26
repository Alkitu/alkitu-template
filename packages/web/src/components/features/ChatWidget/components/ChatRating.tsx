'use client';

import { useState } from 'react';
import { Button } from '@/components/primitives/ui/button';
import { Star } from 'lucide-react';
import { Textarea } from '@/components/atoms/textarea';

interface ChatRatingProps {
  onSubmit: (rating: number, feedback?: string) => void;
  onSkip: () => void;
  primaryColor?: string;
}

export function ChatRating({ onSubmit, onSkip, primaryColor = '#22c55e' }: ChatRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, feedback);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 text-center">
        <div 
          className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
          style={{ backgroundColor: `${primaryColor}20` }}
        >
          <Star 
            className="w-6 h-6" 
            style={{ color: primaryColor }}
            fill={primaryColor}
          />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Thank you!</h3>
        <p className="text-sm text-gray-500">Your feedback helps us improve</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t bg-gray-50">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">
        How was your experience?
      </h3>

      {/* Star Rating */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="transition-transform hover:scale-110"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              className="w-8 h-8"
              style={{
                color: (hoveredRating || rating) >= star ? primaryColor : '#D1D5DB',
                fill: (hoveredRating || rating) >= star ? primaryColor : 'none',
              }}
            />
          </button>
        ))}
      </div>

      {/* Optional Feedback */}
      {rating > 0 && (
        <div className="mb-3">
          <Textarea
            placeholder="Tell us more... (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="resize-none text-sm"
            rows={3}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="flex-1"
        >
          Skip
        </Button>
        <Button
          size="sm"
          disabled={rating === 0}
          onClick={handleSubmit}
          className="flex-1"
          style={{
            backgroundColor: rating > 0 ? primaryColor : undefined,
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
