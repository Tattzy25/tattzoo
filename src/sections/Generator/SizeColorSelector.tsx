import { Ruler, Palette as PaletteIcon, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { tattooSizes, colorPreferences } from '../../data';

interface SizeColorSelectorProps {
  selectedSize: string | null;
  selectedColorPreference: string | null;
  onSelectSize: (size: string | null) => void;
  onSelectColorPreference: (color: string | null) => void;
  outputType?: 'color' | 'stencil';
  onOutputTypeChange?: (type: 'color' | 'stencil') => void;
}

const sizes = tattooSizes;

export function SizeColorSelector({
  selectedSize,
  selectedColorPreference,
  onSelectSize,
  onSelectColorPreference,
  outputType = 'color',
  onOutputTypeChange
}: SizeColorSelectorProps) {
  return (
    <>
      {/* Output Type Toggle */}
      {onOutputTypeChange && (
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-[Orbitron]">
              <ImageIcon size={18} className="md:w-5 md:h-5" />
              Output Type
            </CardTitle>
            <CardDescription className="text-sm">
              Choose between full color design or stencil/sketch
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between gap-4 p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className={`transition-all duration-200 ${outputType === 'stencil' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="text-sm font-medium">Stencil/Sketch</div>
                  <div className="text-xs text-muted-foreground">Black outline only</div>
                </div>
              </div>
              
              <Switch
                checked={outputType === 'color'}
                onCheckedChange={(checked) => onOutputTypeChange(checked ? 'color' : 'stencil')}
                className="data-[state=checked]:bg-primary"
              />
              
              <div className="flex items-center gap-3">
                <div className={`transition-all duration-200 ${outputType === 'color' ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="text-sm font-medium">Full Color</div>
                  <div className="text-xs text-muted-foreground">Colored design</div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 <span className="text-primary font-medium">Pro Tip:</span> Stencil mode is perfect for preview before inking!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Size Selector */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-[Orbitron]">
            <Ruler size={18} className="md:w-5 md:h-5" />
            Size
          </CardTitle>
          <CardDescription className="text-sm">
            How large should your tattoo be?
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <Badge
                  key={size}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                      : 'hover:border-accent/50 hover:bg-accent/5'
                  }`}
                  onClick={() => onSelectSize(isSelected ? null : size)}
                >
                  {size}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Color Preference Selector */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-[Orbitron]">
            <PaletteIcon size={18} className="md:w-5 md:h-5" />
            Color Preference
          </CardTitle>
          <CardDescription className="text-sm">
            What color style do you prefer?
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {colorPreferences.map((color) => {
              const isSelected = selectedColorPreference === color;
              return (
                <Badge
                  key={color}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                      : 'hover:border-accent/50 hover:bg-accent/5'
                  }`}
                  onClick={() => onSelectColorPreference(isSelected ? null : color)}
                >
                  {color}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
