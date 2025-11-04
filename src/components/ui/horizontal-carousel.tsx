import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { LucideIcon } from 'lucide-react';

interface HorizontalCarouselProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  items: string[];
  selectedItem: string | null;
  onSelectItem: (item: string | null) => void;
}

export function HorizontalCarousel({
  title,
  description,
  icon: Icon,
  items,
  selectedItem,
  onSelectItem
}: HorizontalCarouselProps) {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-[Orbitron]">
          {Icon && <Icon size={18} className="md:w-5 md:h-5" />}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
          {items.map((item) => {
            const isSelected = selectedItem === item;
            return (
              <Badge
                key={item}
                variant={isSelected ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-2 text-sm transition-all duration-200 whitespace-nowrap ${
                  isSelected
                    ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                    : 'hover:border-accent/50 hover:bg-accent/5'
                }`}
                onClick={() => onSelectItem(isSelected ? null : item)}
              >
                {item}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
