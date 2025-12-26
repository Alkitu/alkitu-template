/**
 * Chat notification sounds utility
 */

let audioContext: AudioContext | null = null;

// Initialize audio context (needed for browsers)
function getAudioContext() {
  if (!audioContext && typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play a notification sound
 * @param type - Type of notification sound
 */
export function playNotificationSound(type: 'message' | 'sent' = 'message') {
  try {
    const context = getAudioContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    if (type === 'message') {
      // Incoming message: pleasant two-tone
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      oscillator.frequency.setValueAtTime(600, context.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    } else {
      // Message sent: single quick tone
      oscillator.frequency.setValueAtTime(600, context.currentTime);
      gainNode.gain.setValueAtTime(0.2, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
    }

    oscillator.type = 'sine';
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
}

/**
 * Request audio permission (some browsers require user interaction first)
 */
export function requestAudioPermission() {
  try {
    const context = getAudioContext();
    if (context && context.state === 'suspended') {
      context.resume();
    }
  } catch (error) {
    console.error('Error requesting audio permission:', error);
  }
}
