/**
 * Canvas helper utilities
 */

/**
 * Converts a source canvas to a 512x512 square PNG with transparency
 * @param sourceCanvas - The source canvas element to convert
 * @returns Data URL string of the 512x512 PNG image
 */
export function toSquare512(sourceCanvas: HTMLCanvasElement): string {
  const side = 512;
  const sq = document.createElement('canvas');
  sq.width = sq.height = side;
  const ctx = sq.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D context');
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height,
                             0, 0, side, side);
  return sq.toDataURL('image/png');  // transparent PNG
}
