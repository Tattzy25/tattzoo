
// useSkinToneDetection stub: implementation removed per user request.
// Returns a no-op detection function that always yields null.
export default function useSkinToneDetection() {
  async function detectFromCanvas(_canvas: HTMLCanvasElement) {
    return null;
  }

  return { detectFromCanvas };
}
