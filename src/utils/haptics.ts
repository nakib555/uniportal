/**
 * Tactile / Haptic Feedback Utility for Mobile & Touch Interactions
 *
 * Safely wraps the Web Vibration API with feature detection,
 * graceful fallback for unsupported browsers (e.g. iOS Safari, desktop),
 * and calibrated micro-duration vibration signatures.
 */

export const isVibrationSupported = (): boolean => {
  return typeof window !== 'undefined' && 
    typeof navigator !== 'undefined' && 
    'vibrate' in navigator && 
    typeof navigator.vibrate === 'function';
};

const triggerVibrate = (pattern: number | number[]): boolean => {
  if (!isVibrationSupported()) return false;
  try {
    return navigator.vibrate(pattern);
  } catch {
    // Silently fall back if system or browser policy restricts vibration
    return false;
  }
};

export const haptics = {
  /**
   * Ultra-subtle tick (8ms) - Ideal for filter toggles, segment buttons, sort pills
   */
  selection: (): boolean => triggerVibrate(8),

  /**
   * Light tap (12ms) - Ideal for navigation drawer, tab switching, menu expand/collapse
   */
  light: (): boolean => triggerVibrate(12),

  /**
   * Medium confirmation (18ms) - Ideal for modal openers, syllabus previews, standard buttons
   */
  medium: (): boolean => triggerVibrate(18),

  /**
   * Success double-pulse ([12ms, 40ms, 18ms]) - For completed course registration, successful drops
   */
  success: (): boolean => triggerVibrate([12, 40, 18]),

  /**
   * Warning double-buzz ([20ms, 50ms, 20ms]) - For missing prerequisites, credit cap reached, locked enrollment
   */
  warning: (): boolean => triggerVibrate([20, 50, 20]),

  /**
   * Critical error pulse ([30ms, 40ms, 30ms]) - For severe exceptions or restricted operations
   */
  error: (): boolean => triggerVibrate([30, 40, 30]),
};
