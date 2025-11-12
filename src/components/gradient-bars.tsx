import React from 'react';

interface GradientBarsProps {
  numBars: number;
  color: string;
}

export const GradientBars: React.FC<GradientBarsProps> = ({ numBars, color }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: numBars }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-1 opacity-20"
          style={{
            left: `${(i / numBars) * 100}%`,
            background: `linear-gradient(to bottom, ${color}, transparent)`,
          }}
        />
      ))}
    </div>
  );
};