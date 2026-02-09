'use client';

import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { ChatWidget } from './ChatWidget';

/**
 * ChatWidget Wrapper with Feature Flag
 *
 * This wrapper component checks the 'support-chat' feature flag
 * before rendering the ChatWidget. If the feature is disabled,
 * the widget won't be rendered.
 */
export function ChatWidgetWrapper() {
  const { isEnabled: supportChatEnabled } = useFeatureFlag('support-chat');

  // Don't render if feature is explicitly disabled
  if (supportChatEnabled === false) {
    return null;
  }

  return <ChatWidget />;
}
