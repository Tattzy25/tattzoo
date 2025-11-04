import { useState, useEffect } from 'react';

export function LiveActivity() {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  // Mock live activity data
  const liveActivities = [
    { name: 'Jake', design: 'sleeve design', time: 'just now' },
    { name: 'Sarah', design: 'dragon tattoo', time: '2m ago' },
    { name: 'Mike', design: 'tribal band', time: '5m ago' },
    { name: 'Emma', design: 'floral piece', time: '7m ago' },
    { name: 'Chris', design: 'phoenix back', time: '10m ago' },
    { name: 'Alex', design: 'skull sleeve', time: '12m ago' },
  ];

  // Rotate activity feed every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [liveActivities.length]);

  return (
    <div style={{ paddingTop: '100px' }}>
      <div className="w-full text-center mb-8" style={{ fontFamily: 'Rock Salt, cursive' }}>
        <div className="text-[40px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>LIVE</div>
        <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>ACTIVITY</div>
      </div>
      
      <div 
        className="p-5 rounded-2xl border-2 border-accent/20"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
        }}
      >
        <div className="space-y-3">
          {liveActivities.slice(currentActivityIndex, currentActivityIndex + 3).map((activity, index) => (
            <div 
              key={`${activity.name}-${activity.time}-${index}`}
              className="flex items-start gap-3 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-accent mt-1.5 animate-pulse" />
              <div className="flex-1">
                <p className="text-[14px]">
                  <span className="font-[Orbitron] text-accent">{activity.name}</span>
                  {' '}just created a{' '}
                  <span className="text-foreground/90">{activity.design}</span>
                </p>
                <p className="text-[12px] text-foreground/50">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-accent/20 text-center">
          <p className="text-[12px] text-foreground/70 font-[Orbitron]">
            🔥 Join {Math.floor(Math.random() * 50 + 150)} people creating right now
          </p>
        </div>
      </div>
    </div>
  );
}
