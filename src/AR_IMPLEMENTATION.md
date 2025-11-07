# AR "Try It On" Implementation

## Overview
The AR functionality allows users to preview their generated tattoos on their actual body using their device camera with real-time body tracking.

## Technical Stack
- **MediaPipe BlazePose**: 33-point body landmark detection
- **Keypoint-based positioning**: Calculates tattoo placement, rotation, and scale based on body part vectors
- **Transparent PNG overlay**: Tattoos rendered with proper transparency for realistic appearance

## How It Works

### 1. Canvas Conversion
When user clicks "Try It On":
- `ResultsCard` component maintains a hidden canvas (`canvasRef`)
- Generated tattoo image is synced to this canvas via `useEffect`
- `TryItOnButton` converts canvas to 512×512 transparent PNG using `toSquare512()` helper
- Opens `/ar.html` in new window with tattoo as base64 data URL

### 2. Body Part Tracking
MediaPipe BlazePose provides 33 landmarks. We use specific keypoint pairs for each body part:

| Body Part | Keypoints | Calculation |
|-----------|-----------|-------------|
| Forearm (Left) | WRIST (15) + ELBOW (13) | Midpoint between points |
| Forearm (Right) | WRIST (16) + ELBOW (14) | Midpoint between points |
| Upper Arm (Left) | ELBOW (13) + SHOULDER (11) | Midpoint between points |
| Upper Arm (Right) | ELBOW (14) + SHOULDER (12) | Midpoint between points |
| Calf (Left) | ANKLE (27) + KNEE (25) | Midpoint between points |
| Calf (Right) | ANKLE (28) + KNEE (26) | Midpoint between points |

### 3. Rotation & Scaling
For each frame:
```javascript
const p1 = landmarks[keyPointA];  // {x, y} normalized 0-1
const p2 = landmarks[keyPointB];
const dx = p2.x - p1.x;
const dy = p2.y - p1.y;
const angle = Math.atan2(dy, dx);
const distance = Math.hypot(dx * canvasWidth, dy * canvasHeight);
```

The tattoo is:
- **Positioned**: At midpoint between keypoints
- **Rotated**: Along the limb's angle
- **Scaled**: Proportional to limb length (15-20% of distance)

### 4. Component Flow

```
GeneratorPage.tsx
  ↓
  └─ ResultsCard (ref: resultsCardRef)
       ├─ Hidden canvas (canvasRef)
       └─ Syncs generated image to canvas
  ↓
  └─ TryItOnButton
       ├─ Gets canvas via resultsCardRef.current.getCanvas()
       ├─ Converts to 512×512 PNG
       └─ Opens /public/ar.html with tattoo data
```

## File Structure

```
/components/
  └─ try-it-on/
      └─ TryItOnButton.tsx          # AR trigger button
  └─ shared/
      └─ ResultsCard.tsx             # Exposes canvas via ref

/public/
  └─ ar.html                         # Standalone AR experience

/utils/
  └─ canvasHelpers.ts                # toSquare512() converter
```

## User Flow

1. **Generate tattoo** → Image appears in ResultsCard
2. **Click "Try It On"** → Opens AR window
3. **Allow camera** → MediaPipe initializes
4. **Select body part** → Buttons at top (Forearm L/R, Upper Arm L/R, Calf L/R)
5. **Position limb in view** → Tattoo tracks in real-time with proper rotation/scale
6. **Click Close** → Returns to generator

## Requirements

### Critical: Transparent Backgrounds
ALL tattoo images must have transparent backgrounds (.png with alpha channel). This is essential because:
- Tattoos overlay directly on camera feed
- Opaque backgrounds would show as white/colored boxes
- Image processor removes backgrounds before generation

### Browser Requirements
- HTTPS (required for camera access)
- WebRTC support (camera API)
- Modern browser (Chrome, Safari, Edge)

## Performance Optimizations

1. **Model complexity**: Set to 1 (balance of speed/accuracy)
2. **Landmark smoothing**: Enabled for stable tracking
3. **Canvas alpha**: 0.85 opacity for realistic blend
4. **Scale factors**: Optimized per body part (15-20% of limb length)

## Future Enhancements

- [ ] Add thigh, full sleeve placements
- [ ] Save AR screenshots
- [ ] Multiple tattoos at once
- [ ] 3D depth mapping (MediaPipe BlazePose GHUM)

## Debugging

Set debug mode in ar.html:
```javascript
if (true) { // Set to true for debugging
  // Draws cyan dots at keypoints
}
```

## References

- [MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose.html)
- [BlazePose Paper](https://arxiv.org/abs/2006.10204)
- [33 Landmark Indices](https://google.github.io/mediapipe/solutions/pose#pose-landmark-model-blazepose-ghum-3d)
