import { Card } from '../ui/card';

export function SidebarTips() {
  const tips = [
    "Be specific about your story details",
    "Include symbols that matter to you",
    "Choose your preferred tattoo style",
    "Consider the body placement"
  ];

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="w-full text-center" style={{ fontFamily: 'Rock Salt, cursive' }}>
        <div className="text-[40px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>PRO</div>
        <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>TIPS</div>
      </div>
      
      {/* Individual Tip Cards */}
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <Card
            key={index}
            className="p-3 border-2 border-accent/20"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
              borderRadius: '20px',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            <p className="text-[20px] text-[rgb(255,255,255)] whitespace-nowrap overflow-hidden text-ellipsis font-[Amarante]">
              {tip}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
