import { MapPin } from 'lucide-react';
import { footerContent } from '../data';
import { ThemeToggle } from './theme-toggle';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#57f1d6] border-t border-black/10 w-full">
      <div className="w-full px-6 md:px-8 py-10 md:py-14 pb-5">
        {/* Brand section */}
        <div className="w-full">
          <div className="space-y-5 md:space-y-6">
            {/* TaTTTy - Center Aligned */}
            <div className="flex justify-center items-center gap-4">
              <span className="text-black text-[32px]" style={{ fontFamily: 'Rock Salt' }}>{footerContent.brandName}</span>
              <ThemeToggle />
            </div>
            
            {/* Description - Left Aligned */}
            <p className="text-black/70 text-[24px] text-left" style={{ fontFamily: 'Roboto Condensed' }}>
              {footerContent.description}
            </p>
            
            {/* Location - Left Aligned */}
            <div className="flex items-center space-x-2 text-black/70 text-[20px]" style={{ fontFamily: 'Roboto Condensed' }}>
              <MapPin size={20} />
              <span>{footerContent.location.city}, {footerContent.location.state}</span>
            </div>
          </div>
        </div>

        {/* Policy Links - Vertical Stack Center Aligned */}
        <div className="mt-10 md:mt-14 pt-8 md:pt-10 border-t border-black/10">
          <div className="flex flex-col items-center space-y-4">
            <button 
              onClick={() => onNavigate('privacy-policy')}
              className="text-black/70 hover:text-black transition-colors text-[24px]"
              style={{ fontFamily: 'Roboto Condensed' }}
            >
              {footerContent.links.privacyPolicy}
            </button>
            <button 
              onClick={() => onNavigate('terms-of-service')}
              className="text-black/70 hover:text-black transition-colors text-[24px]"
              style={{ fontFamily: 'Roboto Condensed' }}
            >
              {footerContent.links.termsOfService}
            </button>
            <button className="text-black/70 hover:text-black transition-colors text-[24px]" style={{ fontFamily: 'Roboto Condensed' }}>
              {footerContent.links.cookiePolicy}
            </button>
            
            {/* Made with AI message */}
            <p className="text-black/70 text-[20px] text-center mt-6" style={{ fontFamily: 'Roboto Condensed' }}>
              {footerContent.madeWithAI}
            </p>
            
            {/* Copyright - Below Policy Links */}
            <p className="text-black/70 text-[20px] text-center mt-4 pb-10" style={{ fontFamily: 'Roboto Condensed' }}>
              {footerContent.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
