import { useEffect } from 'react';

/**
 * Screenshot Protection Component
 * 
 * Adds additional layers of protection against screenshots:
 * - Blocks common screenshot keyboard shortcuts
 * - Prevents right-click context menu
 * - Detects PrintScreen key
 * 
 * Note: This is not foolproof - determined users can still screenshot.
 * This adds friction and discourages casual screenshot attempts.
 */
export function ScreenshotProtection() {
  useEffect(() => {
    // Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block screenshot keyboard shortcuts
    const handleKeyDown = async (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        // Try to clear clipboard, but don't fail if blocked
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            // Wrap the actual call in try-catch since it can throw even if the API exists
            try {
              await navigator.clipboard.writeText('');
            } catch (clipboardErr) {
              // Silently fail - clipboard API is blocked
            }
          }
        } catch (err) {
          // Silently fail if clipboard API is blocked
        }
        console.log('Screenshot attempt detected');
      }

      // Cmd/Ctrl + Shift + 3/4/5 (Mac screenshots)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        console.log('Screenshot attempt detected');
      }

      // Windows Snipping Tool (Win + Shift + S)
      if (e.key === 's' && e.shiftKey && e.metaKey) {
        e.preventDefault();
        console.log('Screenshot attempt detected');
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
