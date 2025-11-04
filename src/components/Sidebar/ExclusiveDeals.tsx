export function ExclusiveDeals() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <div className="w-full text-center mb-8" style={{ fontFamily: 'Rock Salt, cursive' }}>
        <div className="text-[40px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>GET</div>
        <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>EXCLUSIVE</div>
        <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>DEALS</div>
      </div>
      
      <div 
        className="p-4 rounded-2xl border-2 border-accent/20"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
        }}
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
        />
        <button
          className="w-full mt-3 px-4 py-3 bg-accent hover:bg-accent/80 text-background rounded-lg transition-all"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
