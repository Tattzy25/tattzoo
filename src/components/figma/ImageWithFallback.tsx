import { useState, forwardRef } from 'react';

// Fallback placeholder image - a simple data URI for a gray square with "Image Not Found"
const ERROR_IMG_SRC = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%236b7280"%3EImage Not Found%3C/text%3E%3C/svg%3E';

export const ImageWithFallback = forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ src, alt, className, style, ...props }, ref) => {
    const [error, setError] = useState(false);

    const handleError = () => {
      setError(true);
      // Image failed to load - show placeholder (no logging needed for 404 images)
    }

    return error ? (
      <div
        className={`inline-block bg-muted text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...props} data-original-url={src} />
        </div>
      </div>
    ) : (
      <img ref={ref} src={src} alt={alt} className={className} style={style} {...props} onError={handleError} />
    )
  }
);