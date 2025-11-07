import React, { useRef, useEffect, useState } from 'react';

import { Button } from '../../components/ui/button';
import './GeminiCamera.css';

interface GeminiCameraProps {
  title?: string;
}

export function GeminiCamera({
  title = 'Gemini Camera'
}: GeminiCameraProps) {
  const webcamRef = useRef<any>(null);
  const [WebcamComponent, setWebcamComponent] = useState<any>(null);

  useEffect(() => {
    // Dynamically import react-webcam
    import('react-webcam')
      .then(mod => setWebcamComponent(() => mod.default))
      .catch(() => {
        setWebcamComponent(null);
        // Optionally, you could log or handle the error here
      });
  }, []);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log('Captured Image:', imageSrc); // Placeholder for further processing
    }
  };

  const captureVideo = () => {
    console.log('Video capture functionality not implemented yet.');
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 items-center">
      <h2 className="gemini-title">
        {title}
      </h2>

      <div className="h-[150px] w-[150px] flex items-center justify-center">
        {WebcamComponent ? (
          <WebcamComponent
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-xl"
          />
        ) : (
          <div>
            Webcam component not available.<br />
            Please run <code>npm install react-webcam</code> and <code>npm install --save-dev @types/react-webcam</code>.<br />
            Then restart your dev server.
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-4">
        <Button variant="outline" size="lg" onClick={captureImage}>
          Capture Image
        </Button>
        <Button variant="outline" size="lg" onClick={captureVideo}>
          Capture Video
        </Button>
      </div>
    </div>
  );
}