import React from 'react';

export interface CameraLensProps {
  className?: string;
}

export function CameraLens({ className = '' }: CameraLensProps) {
  return (
    <div className={`relative w-[450px] h-[450px] ${className}`}>
      <div className="relative w-full h-full rounded-full overflow-hidden">
        {/* Camera body with teal gradient and wet look */}
        <div 
          className="relative w-full h-full rounded-full overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(87, 241, 214, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.3) 0%, transparent 50%),
              linear-gradient(135deg, rgba(87, 241, 214, 0.8) 0%, rgba(40, 180, 140, 0.6) 50%, rgba(0, 120, 180, 0.4) 100%)
            `,
            boxShadow: `
              0 30px 80px rgba(0, 0, 0, 0.6),
              inset 0 3px 12px rgba(87, 241, 214, 0.2),
              inset 0 -3px 12px rgba(0, 0, 0, 0.4)
            `,
          }}
        >
          {/* Wet effect overlay */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'radial-gradient(circle at 30% 20%, rgba(87, 241, 214, 0.25) 0%, transparent 40%)',
            }}
          />
          
          {/* Lens outer ring */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[88%] h-[88%] rounded-full"
            style={{
              background: `
                radial-gradient(circle at 25% 25%, rgba(87, 241, 214, 0.3) 0%, transparent 30%),
                radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.4) 0%, transparent 40%),
                linear-gradient(135deg, rgba(87, 241, 214, 0.9) 0%, rgba(60, 180, 140, 0.7) 50%, rgba(40, 120, 180, 0.5) 100%)
              `,
              boxShadow: `
                inset 0 4px 15px rgba(87, 241, 214, 0.15),
                inset 0 -4px 15px rgba(0, 0, 0, 0.5),
                0 3px 12px rgba(0, 0, 0, 0.3)
              `,
            }}
          />
          
          {/* Lens middle */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[78%] h-[78%] rounded-full"
            style={{
              background: `
                radial-gradient(circle at 28% 28%, rgba(87, 241, 214, 0.35) 0%, transparent 35%),
                radial-gradient(circle at 72% 72%, rgba(0, 0, 0, 0.5) 0%, transparent 40%),
                radial-gradient(circle at 50% 50%, 
                  rgba(87, 241, 214, 0.8) 0%,
                  rgba(67, 180, 140, 0.7) 15%,
                  rgba(40, 120, 180, 0.6) 30%,
                  rgba(0, 120, 180, 0.4) 80%)
              `,
              boxShadow: `
                inset 0 6px 20px rgba(87, 241, 214, 0.18),
                inset 0 -6px 20px rgba(0, 0, 0, 0.6),
                0 0 30px rgba(87, 241, 214, 0.3)
              `,
            }}
          />
          
          {/* Lens inner */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] rounded-full overflow-hidden"
            style={{
              background: `
                radial-gradient(circle at 32% 32%, rgba(87, 241, 214, 0.4) 0%, transparent 25%),
                radial-gradient(circle at 68% 68%, rgba(0, 0, 0, 0.6) 0%, transparent 30%),
                radial-gradient(circle at 50% 50%, 
                  rgba(87, 241, 214, 0.9) 0%,
                  rgba(67, 180, 140, 0.7) 15%,
                  rgba(40, 120, 180, 0.6) 30%,
                  rgba(0, 120, 180, 0.4) 80%)
              `,
              boxShadow: `
                inset 0 8px 25px rgba(87, 241, 214, 0.22),
                inset 0 -8px 30px rgba(0, 0, 0, 0.7),
                0 0 50px rgba(87, 241, 214, 0.5),
                0 0 80px rgba(120, 80, 180, 0.25)
              `,
            }}
          />
          
          {/* Wet effect overlay */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'radial-gradient(circle, rgba(87, 241, 214, 0.35) 0%, transparent 60%)',
            }}
          />
          
          {/* Center dot */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10%] h-[10%] rounded-full"
            style={{
              background: `
                radial-gradient(circle at 35% 35%, rgba(87, 241, 214, 0.5) 0%, transparent 20%),
                radial-gradient(circle at 30% 30%, rgba(87, 241, 214, 0.9) 40%, rgba(87, 241, 214, 0.6) 80%)
              `,
              boxShadow: `
                0 0 35px rgba(87, 241, 214, 1),
                0 0 70px rgba(87, 241, 214, 0.6),
                inset 0 2px 6px rgba(87, 241, 214, 0.5),
                inset 0 -2px 6px rgba(0, 0, 0, 0.5)
              `,
            }}
          />
          
          {/* Aperture */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            {/* Aperture blades */}
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-[52%] h-[52%] origin-center"
                style={{
                  clipPath: 'polygon(50% 50%, 20% 0%, 80% 0%)',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                  transition: 'all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                }}
              >
                <div 
                  className="w-full h-full"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(60, 65, 85, 0.98) 0%,
                        rgba(40, 45, 65, 0.95) 30%,
                        rgba(25, 30, 50, 0.97) 60%,
                        rgba(15, 18, 35, 0.99) 100%)
                    `,
                    boxShadow: `
                      inset 2px 2px 8px rgba(87, 241, 214, 0.15),
                      inset -2px -2px 10px rgba(0, 0, 0, 0.8)
                    `,
                  }}
                />
                <div 
                  className="absolute top-5% left-20% w-[30%] h-[30%] rounded-full"
                  style={{
                    background: 'radial-gradient(ellipse at top left, rgba(87, 241, 214, 0.25) 0%, transparent 60%)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
