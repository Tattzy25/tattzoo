import { 
  FollowUs, 
  ExclusiveDeals, 
  ReferralDiscount, 
  LiveActivity, 
  ComingSoon, 
  GetFeatured, 
  GetInspired,
  SidebarTips 
} from './index';

interface GeneratorSidebarProps {
  children: React.ReactNode;
}

export function GeneratorSidebar({ children }: GeneratorSidebarProps) {
  
  return (
    <div 
      className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto space-y-4 md:space-y-6 pl-[10px] pr-[10px] pt-[120px] pb-8"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Social Media Links */}
      <FollowUs />
      
      {/* Email Signup */}
      <ExclusiveDeals />
      
      {/* Referral Section */}
      <ReferralDiscount />

      {/* Live Activity Feed */}
      <LiveActivity />
      
      {/* Coming Soon Section */}
      <ComingSoon />
      
      {children}
      
      <div style={{ paddingTop: '100px' }}>
        <SidebarTips />
      </div>
      
      {/* Featured Design */}
      <GetFeatured />
      
      {/* Inspiration Gallery */}
      <GetInspired />
      
      {/* Extra padding at bottom so you can scroll past everything */}
      <div className="h-20"></div>
    </div>
  );
}
