import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function GetFeatured() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <div className="w-full text-center mb-8" style={{ fontFamily: 'Rock Salt, cursive' }}>
        <div className="text-[40px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>GET</div>
        <div className="text-[48px]" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 8px 24px rgba(0, 0, 0, 0.8)' }}>FEATURED</div>
      </div>
      
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square overflow-hidden">
          <ImageWithFallback
            src="" // Imported from placeholder-images.ts - see featuredDesign.image
            alt="Phoenix Rising"
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 md:px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs">
            TaTTTy
          </div>
        </div>
        <CardContent className="p-3 md:p-4 space-y-2 md:space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-base md:text-lg mb-1">Phoenix Rising</h3>
              <div className="flex items-center gap-2">
                <ImageWithFallback
                  src="" // Imported from placeholder-images.ts - see featuredDesign.avatar
                  alt="Sarah M."
                  className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover"
                />
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
            <button className="flex items-center gap-1 hover:text-accent transition-colors ml-auto">
              <Share2 size={14} className="md:w-4 md:h-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
