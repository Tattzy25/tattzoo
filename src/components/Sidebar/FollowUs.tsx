import { Instagram, Youtube } from 'lucide-react';
import { FaTiktok, FaXTwitter } from 'react-icons/fa6';

export function FollowUs() {
  return (
    <div>
      <div className="w-full text-center mb-8" style={{ fontFamily: 'Rock Salt, cursive' }}>
        <div className="text-[40px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>FOLLOW</div>
        <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>US</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Instagram */}
        <a
          href="https://instagram.com/tattty"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-6 rounded-2xl border-2 border-accent/20 hover:border-accent/40 transition-all group"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          <Instagram 
            size={48} 
            className="transition-transform group-hover:scale-110"
            style={{ color: '#E4405F' }}
          />
        </a>
        
        {/* TikTok */}
        <a
          href="https://tiktok.com/@tattty"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-6 rounded-2xl border-2 border-accent/20 hover:border-accent/40 transition-all group"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          <FaTiktok 
            size={48} 
            className="transition-transform group-hover:scale-110"
            style={{ color: '#00F2EA' }}
          />
        </a>
        
        {/* YouTube */}
        <a
          href="https://youtube.com/@tattty"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-6 rounded-2xl border-2 border-accent/20 hover:border-accent/40 transition-all group"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          <Youtube 
            size={48} 
            className="transition-transform group-hover:scale-110"
            style={{ color: '#FF0000' }}
          />
        </a>
        
        {/* X (Twitter) */}
        <a
          href="https://x.com/tattty"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-6 rounded-2xl border-2 border-accent/20 hover:border-accent/40 transition-all group"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.05))',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
          }}
        >
          <FaXTwitter 
            size={48} 
            className="transition-transform group-hover:scale-110"
            style={{ color: '#FFFFFF' }}
          />
        </a>
      </div>
    </div>
  );
}
