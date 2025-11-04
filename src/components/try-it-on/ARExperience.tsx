/**
 * AR EXPERIENCE COMPONENT
 * Full-screen AR overlay for trying on tattoos using camera + body tracking
 * Uses MediaPipe Pose Detection to overlay tattoos on body parts
 */

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useLicense } from '../../contexts/LicenseContext';

interface ARExperienceProps {
  tattooDataUrl: string;
  onClose: () => void;
}

type BodyPart = 'forearm-inner-left' | 'forearm-inner-right' | 'upper-arm-left' | 'upper-arm-right' | 'calf-left' | 'calf-right';

// BlazePose keypoint indices (33-point model)
const POSE_LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

// Define body part mappings
const BODY_PARTS: Record<BodyPart, { p1: number; p2: number; scale: number }> = {
  'forearm-inner-left': { p1: POSE_LANDMARKS.LEFT_WRIST, p2: POSE_LANDMARKS.LEFT_ELBOW, scale: 0.15 },
  'forearm-inner-right': { p1: POSE_LANDMARKS.RIGHT_WRIST, p2: POSE_LANDMARKS.RIGHT_ELBOW, scale: 0.15 },
  'upper-arm-left': { p1: POSE_LANDMARKS.LEFT_ELBOW, p2: POSE_LANDMARKS.LEFT_SHOULDER, scale: 0.18 },
  'upper-arm-right': { p1: POSE_LANDMARKS.RIGHT_ELBOW, p2: POSE_LANDMARKS.RIGHT_SHOULDER, scale: 0.18 },
  'calf-left': { p1: POSE_LANDMARKS.LEFT_ANKLE, p2: POSE_LANDMARKS.LEFT_KNEE, scale: 0.2 },
  'calf-right': { p1: POSE_LANDMARKS.RIGHT_ANKLE, p2: POSE_LANDMARKS.RIGHT_KNEE, scale: 0.2 },
};

export function ARExperience({ tattooDataUrl, onClose }: ARExperienceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>('forearm-inner-left');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [tattooImage, setTattooImage] = useState<HTMLImageElement | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const poseDetectorRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasInitializedRef = useRef<boolean>(false);
  const { trackArView, isVerified } = useLicense();

  // Load tattoo image
  useEffect(() => {
    console.log('[AR] 🎬 ARExperience component MOUNTED');
    
    const img = new Image();
    img.onload = () => {
      setTattooImage(img);
      console.log('[AR] ✅ Tattoo image loaded:', img.width, 'x', img.height);
    };
    img.onerror = (e) => {
      console.error('[AR] ❌ Failed to load tattoo image:', e);
      alert('Failed to load tattoo image.');
    };
    img.src = tattooDataUrl;
    
    return () => {
      console.log('[AR] 🔚 ARExperience component UNMOUNTED');
    };
  }, [tattooDataUrl]);

  // Initialize camera and MediaPipe Pose
  useEffect(() => {
    console.log('[AR] 🎬 useEffect triggered');
    
    if (!videoRef.current || !canvasRef.current) {
      console.log('[AR] ⚠️ Video or canvas ref not ready');
      return;
    }

    // Prevent double initialization
    if (hasInitializedRef.current) {
      console.log('[AR] ⚠️ Already initialized, skipping...');
      return;
    }
    hasInitializedRef.current = true;

    let isMounted = true;

    const initializeAR = async () => {
      try {
        setDebugInfo('Checking HTTPS...');
        
        // Step 1: Check if we're on HTTPS (required for camera access, except localhost)
        const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
        console.log('[AR] Protocol:', window.location.protocol);
        console.log('[AR] Is secure context:', isSecure);
        
        if (!isSecure && window.location.hostname !== 'localhost') {
          throw new Error('Camera access requires HTTPS connection');
        }
        
        setDebugInfo('Checking browser support...');
        
        // Step 2: Check if mediaDevices is supported
        console.log('[AR] Checking browser support...');
        console.log('[AR] navigator.mediaDevices:', !!navigator.mediaDevices);
        console.log('[AR] getUserMedia:', !!navigator.mediaDevices?.getUserMedia);
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera not supported in this browser');
        }

        setDebugInfo('Requesting camera access...');
        
        // Step 3: Request camera access (browser will show native permission dialog)
        console.log('[AR] Calling getUserMedia() - browser will show native permission dialog...');
        
        // Try to request permission first (this will trigger the browser prompt)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false, // Explicitly no audio
        }).catch((err) => {
          console.error('[AR] ❌ getUserMedia failed:', err.name, err.message);
          throw err;
        });

        console.log('[AR] ✅ Camera stream received:', stream.id);
        console.log('[AR] Video tracks:', stream.getVideoTracks().length);

        if (!isMounted) {
          console.log('[AR] Component unmounted during camera setup');
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        setDebugInfo('Starting video...');
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('[AR] Video element srcObject set');
          await videoRef.current.play().catch((err) => {
            console.error('[AR] ❌ Video play failed:', err);
            throw new Error('Failed to start video playback: ' + err.message);
          });
          console.log('[AR] ✅ Video playing - dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
        } else {
          throw new Error('Video element ref is null');
        }

        console.log('[AR] ✅ Camera access granted');
        setDebugInfo('Loading MediaPipe...');

        // Step 4: Load MediaPipe scripts
        console.log('[AR] Loading MediaPipe...');
        setDebugInfo('Loading MediaPipe libraries (1/4)...');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        setDebugInfo('Loading MediaPipe libraries (2/4)...');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js');
        setDebugInfo('Loading MediaPipe libraries (3/4)...');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
        setDebugInfo('Loading MediaPipe libraries (4/4)...');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');

        if (!isMounted) return;

        setDebugInfo('Initializing pose detection...');
        
        // Step 5: Initialize MediaPipe Pose
        // @ts-ignore - MediaPipe global
        const { Pose } = window;

        const pose = new Pose({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults(onPoseResults);
        poseDetectorRef.current = pose;

        console.log('[AR] ✅ MediaPipe initialized');
        setDebugInfo('Starting pose detection...');

        // Step 6: Start pose detection loop
        const detectPose = async () => {
          if (!isMounted || !videoRef.current || !poseDetectorRef.current) return;
          
          try {
            await poseDetectorRef.current.send({ image: videoRef.current });
          } catch (err) {
            console.error('[AR] Pose detection error:', err);
          }
          
          if (isMounted) {
            animationFrameRef.current = requestAnimationFrame(detectPose);
          }
        };

        detectPose();
        setIsLoading(false);

        // Track AR view usage after successful initialization
        if (isVerified) {
          trackArView();
        }
        
        // Hide instructions after 5 seconds
        setTimeout(() => setShowInstructions(false), 5000);
        
      } catch (err: any) {
        console.error('[AR] Initialization error:', err);
        console.error('[AR] Error name:', err.name);
        console.error('[AR] Error message:', err.message);
        
        if (!isMounted) return;
        
        // Check if this is a permissions policy violation (embedded iframe issue)
        const isPermissionsPolicyError = err.message?.includes('policy violation') || 
                                        err.message?.includes('not allowed') ||
                                        (err.name === 'NotAllowedError' && window.self !== window.top);
        
        if (isPermissionsPolicyError) {
          setError('AR camera features are not available in this embedded environment. Please open TaTTy in a new browser tab to use the "Try It On" feature.');
        } else if (err.name === 'NotAllowedError') {
          setError('Camera permission was denied. Please allow camera access when prompted.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera detected on your device.');
        } else if (err.name === 'NotReadableError') {
          setError('Camera is already in use by another application. Please close other apps using the camera.');
        } else if (err.message?.includes('not supported')) {
          setError('Your browser does not support camera access. Please use a modern browser like Chrome, Firefox, or Safari.');
        } else {
          setError(`Failed to start camera: ${err.message || 'Unknown error'}`);
        }
        
        setIsLoading(false);
      }
    };

    initializeAR();

    // Cleanup
    return () => {
      console.log('[AR] 🧹 Cleaning up camera and MediaPipe...');
      isMounted = false;
      hasInitializedRef.current = false; // Reset for next mount
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('[AR] 📹 Camera track stopped:', track.kind);
        });
        streamRef.current = null;
      }
      
      if (poseDetectorRef.current) {
        poseDetectorRef.current = null;
      }
      
      console.log('[AR] ✅ Cleanup complete');
    };
  }, []);

  // Process pose results and render tattoo
  const onPoseResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.poseLandmarks || !tattooImage) {
      return;
    }

    const landmarks = results.poseLandmarks;
    const bodyPart = BODY_PARTS[selectedBodyPart];

    if (!bodyPart) return;

    const p1 = landmarks[bodyPart.p1];
    const p2 = landmarks[bodyPart.p2];

    if (!p1 || !p2) return;

    // Convert normalized coordinates to canvas coordinates
    const x1 = p1.x * canvas.width;
    const y1 = p1.y * canvas.height;
    const x2 = p2.x * canvas.width;
    const y2 = p2.y * canvas.height;

    // Calculate midpoint
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Calculate direction vector and angle
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const distance = Math.hypot(dx, dy);

    // Scale tattoo based on limb length
    const tattooWidth = distance * bodyPart.scale;
    const tattooHeight = tattooWidth * (tattooImage.height / tattooImage.width);

    // Draw tattoo with rotation
    ctx.save();
    ctx.translate(midX, midY);
    ctx.rotate(angle);
    ctx.globalAlpha = 0.85; // Slight transparency for realism
    ctx.drawImage(
      tattooImage,
      -tattooWidth / 2,
      -tattooHeight / 2,
      tattooWidth,
      tattooHeight
    );
    ctx.restore();
  };

  return (
    <div className="fixed inset-0 lg:right-[460px] z-50 bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Loading */}
      {isLoading && !error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 px-8 py-6 rounded-xl border border-accent max-w-md">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <div className="text-accent text-xl mb-2 text-center">Starting AR Experience...</div>
          <div className="text-accent/80 text-sm text-center mb-3">
            {debugInfo}
          </div>
          <div className="text-accent/60 text-xs text-center p-3 bg-black/50 rounded-lg">
            💡 Make sure to click "Allow" when prompted
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 px-6 py-6 rounded-xl border border-red-500 max-w-lg mx-4">
          <div className="text-red-500 text-xl mb-3 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error.includes('embedded') ? 'Camera Not Available' : 'Camera Access Required'}</span>
          </div>
          <div className="text-white text-base mb-4">{error}</div>
          
          {error.includes('embedded') && (
            <div className="bg-black/50 p-4 rounded-lg mb-4 text-sm text-accent/90">
              <div className="mb-2">💡 <strong>Workaround:</strong></div>
              <p className="text-xs text-white/80 mb-3">
                Camera access is blocked when embedded. Download your tattoo design and use your phone's camera app to try it on manually!
              </p>
            </div>
          )}
          
          {error.includes('denied') && !error.includes('embedded') && (
            <div className="bg-black/50 p-4 rounded-lg mb-4 text-sm text-accent/90">
              <div className="mb-2">📱 <strong>How to fix:</strong></div>
              <ol className="list-decimal list-inside space-y-1 text-xs text-white/80">
                <li>Click the camera icon in your browser's address bar</li>
                <li>Change camera permission to "Allow"</li>
                <li>Close this and try again</li>
              </ol>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
            >
              Close
            </button>
            {error.includes('embedded') && (
              <button
                onClick={() => {
                  window.open(window.location.href, '_blank');
                  onClose();
                }}
                className="w-full px-4 py-2 rounded-lg bg-accent text-black hover:bg-accent/80 transition-all"
              >
                Open in New Tab
              </button>
            )}
          </div>
        </div>
      )}

      {/* Instructions overlay */}
      {!isLoading && !error && showInstructions && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 px-6 py-5 rounded-xl border border-accent max-w-sm z-20">
          <div className="text-accent text-lg mb-3 text-center">📸 Position yourself</div>
          <div className="text-white text-sm text-center space-y-2">
            <p>• Stand facing the camera</p>
            <p>• Make sure your arms/legs are visible</p>
            <p>• Select a body part above</p>
          </div>
          <button
            onClick={() => setShowInstructions(false)}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-accent text-black hover:bg-accent/80 transition-all"
          >
            Got it!
          </button>
        </div>
      )}

      {/* Controls */}
      {!isLoading && !error && (
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2 z-10">
        <button
          onClick={() => setSelectedBodyPart('forearm-inner-left')}
          className={`px-4 py-2 rounded-lg border transition-all backdrop-blur-md ${
            selectedBodyPart === 'forearm-inner-left'
              ? 'bg-accent text-black border-accent'
              : 'bg-black/80 text-accent border-accent hover:bg-accent/20'
          }`}
        >
          Forearm (L)
        </button>
        <button
          onClick={() => setSelectedBodyPart('forearm-inner-right')}
          className={`px-4 py-2 rounded-lg border transition-all backdrop-blur-md ${
            selectedBodyPart === 'forearm-inner-right'
              ? 'bg-accent text-black border-accent'
              : 'bg-black/80 text-accent border-accent hover:bg-accent/20'
          }`}
        >
          Forearm (R)
        </button>
        <button
          onClick={() => setSelectedBodyPart('upper-arm-left')}
          className={`px-4 py-2 rounded-lg border transition-all backdrop-blur-md ${
            selectedBodyPart === 'upper-arm-left'
              ? 'bg-accent text-black border-accent'
              : 'bg-black/80 text-accent border-accent hover:bg-accent/20'
          }`}
        >
          Upper Arm (L)
        </button>
        <button
          onClick={() => setSelectedBodyPart('upper-arm-right')}
          className={`px-4 py-2 rounded-lg border transition-all backdrop-blur-md ${
            selectedBodyPart === 'upper-arm-right'
              ? 'bg-accent text-black border-accent'
              : 'bg-black/80 text-accent border-accent hover:bg-accent/20'
          }`}
        >
          Upper Arm (R)
        </button>
        <button
          onClick={() => setSelectedBodyPart('calf-left')}
          className={`px-4 py-2 rounded-lg border transition-all backdrop-blur-md ${
            selectedBodyPart === 'calf-left'
              ? 'bg-accent text-black border-accent'
              : 'bg-black/80 text-accent border-accent hover:bg-accent/20'
          }`}
        >
          Calf (L)
        </button>
        <button
          onClick={() => setSelectedBodyPart('calf-right')}
          className={`px-4 py-2 rounded-lg border transition-all backdrop-blur-md ${
            selectedBodyPart === 'calf-right'
              ? 'bg-accent text-black border-accent'
              : 'bg-black/80 text-accent border-accent hover:bg-accent/20'
          }`}
        >
          Calf (R)
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="ml-auto px-4 py-2 rounded-lg bg-red-600/90 text-white border border-red-600 hover:bg-red-600 transition-all backdrop-blur-md flex items-center gap-2"
        >
          <X className="w-5 h-5" />
          Close
        </button>
      </div>
      )}
    </div>
  );
}

// Helper to load external scripts
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}
