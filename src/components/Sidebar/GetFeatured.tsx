import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import './GetFeatured.css'; // added import

export function GetFeatured() {
  return (
    <div className="get-featured-root">
      <div className="w-full text-center mb-8 get-featured-title">
        <div className="text-[40px] get-featured-line">GET</div>
        <div className="text-[48px] get-featured-line">FEATURED</div>
      </div>
      
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-accent/10 flex items-center justify-center">
          <div className="text-center text-accent/60">
            <div className="text-4xl font-bold mb-2">🦅</div>
            <div className="text-sm font-medium">Phoenix Rising</div>
          </div>
          <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 md:px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs">
            TaTTTy
          </div>
        </div>
        <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-base md:text-lg mb-1">Phoenix Rising</h3>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                  <span className="text-accent font-semibold text-xs">S</span>
                </div>
                <div className="text-xs md:text-sm">
                  <p className="text-muted-foreground">Sarah M.</p>
                  <p className="text-xs text-muted-foreground">Los Angeles, CA</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 pt-2 border-t border-border text-xs md:text-sm text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <Heart size={14} className="md:w-4 md:h-4" />
              <span>2,453</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
              <MessageCircle size={14} className="md:w-4 md:h-4" />
              <span>187</span>
            </button>
            { /* Added aria-label and sr-only text for accessibility */ }
            <button
              className="flex items-center gap-1 hover:text-accent transition-colors ml-auto"
              aria-label="Share design"
              title="Share"
            >
              <Share2 size={14} className="md:w-4 md:h-4" />
              <span className="sr-only">Share</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
