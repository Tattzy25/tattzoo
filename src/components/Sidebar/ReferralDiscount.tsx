export function ReferralDiscount() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <div className="w-full text-center mb-8" style={{ fontFamily: 'Rock Salt, cursive' }}>
        <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>10% OFF</div>
      </div>
      
      <div 
        className="p-6 rounded-2xl border-2 border-accent/20 text-center"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
        }}
      >
        <p className="text-[20px] font-[Orbitron]">
          Refer a friend and get 10% off
        </p>
      </div>
    </div>
  );
}
