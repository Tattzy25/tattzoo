# Data Usage Guide

Quick reference for importing and using data from the `/data/` folder.

---

## 📦 Import Examples

### **Option 1: Named Imports (Recommended)**

```tsx
import { 
  galleryDesigns,
  tattooStyles,
  tattooPlacements,
  timelineSteps,
  socialProofStats,
  validationMessages
} from '../data';
```

### **Option 2: Specific File Imports**

```tsx
import { galleryDesigns } from '../data/gallery';
import { tattooStyles } from '../data/generator-options';
```

---

## 🧩 Component Usage Examples

### **Gallery Component**

```tsx
import { galleryDesigns } from '../data';

export function GallerySection() {
  return (
    <TattooGallery
      designs={galleryDesigns}
      displayCount={15}
      columns={5}
    />
  );
}
```

---

### **Timeline Component**

```tsx
import { timelineSteps } from '../data';

export function TimelineSection() {
  return (
    <div>
      {timelineSteps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index}>
            <Icon className="w-6 h-6" />
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        );
      })}
    </div>
  );
}
```

---

### **Social Proof Component**

```tsx
import { socialProofStats, testimonials } from '../data';

export function SocialProofSection() {
  return (
    <>
      <div className="stats">
        {socialProofStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index}>
              <Icon />
              <div>{stat.value}</div>
              <div>{stat.label}</div>
            </div>
          );
        })}
      </div>
      
      <div className="testimonials">
        {testimonials.map((testimonial, index) => (
          <div key={index}>
            <p>{testimonial.text}</p>
            <span>{testimonial.name}</span>
            <span>{testimonial.location}</span>
          </div>
        ))}
      </div>
    </>
  );
}
```

---

### **Generator Options Component**

```tsx
import { tattooStyles, tattooPlacements, tattooSizes } from '../data';

export function GeneratorPanel({ 
  onStyleSelect,
  onPlacementSelect 
}: Props) {
  return (
    <>
      <StyleSelector 
        styles={tattooStyles}
        onSelect={onStyleSelect}
      />
      
      <PlacementSelector
        placements={tattooPlacements}
        onSelect={onPlacementSelect}
      />
    </>
  );
}
```

---

### **Validation Messages**

```tsx
import { validationMessages } from '../data';

function handleGenerate() {
  if (prompt.length < 50) {
    alert(validationMessages.freestylePromptRequired);
    return;
  }
  
  // Continue generation...
}
```

---

### **Content/Copy**

```tsx
import { sectionHeadings, footerContent } from '../data';

export function LicenseKeySection() {
  return (
    <section>
      <h2>{sectionHeadings.licenseKey.title}</h2>
      <p>{sectionHeadings.licenseKey.price}</p>
      <p>{sectionHeadings.licenseKey.description}</p>
      <button>{sectionHeadings.licenseKey.buttonText}</button>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <span>{footerContent.brandName}</span>
      <p>{footerContent.description}</p>
      <p>{footerContent.copyright}</p>
    </footer>
  );
}
```

---

### **Moods with Icon Handling**

```tsx
import { moods } from '../data';

export function MoodSelector({ 
  selectedMood,
  onSelectMood 
}: Props) {
  return (
    <div className="mood-grid">
      {moods.map((mood) => {
        const Icon = mood.icon; // Icon is a component
        return (
          <button
            key={mood.id}
            onClick={() => onSelectMood(mood.id)}
            className={selectedMood === mood.id ? 'selected' : ''}
          >
            <Icon className="w-6 h-6" />
            <span>{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

---

### **Aspect Ratios**

```tsx
import { aspectRatios } from '../data';

export function AspectRatioSelector({
  selectedRatio,
  onSelectRatio
}: Props) {
  return (
    <div className="aspect-ratio-grid">
      {aspectRatios.map((ratio) => {
        const Icon = ratio.icon;
        return (
          <button
            key={ratio.id}
            onClick={() => onSelectRatio(ratio.value)}
          >
            <Icon />
            <span>{ratio.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

---

## 🔄 Future: Database Migration

When connecting to database, replace static imports with API calls:

```tsx
// BEFORE (Static)
import { galleryDesigns } from '../data';

// AFTER (Database)
const { data: galleryDesigns } = await supabase
  .from('gallery_designs')
  .select('*');

// Component stays the same!
<TattooGallery designs={galleryDesigns} />
```

---

## 🎨 Prop-Based Component Pattern

Always make components accept data as props:

```tsx
// ✅ GOOD - Prop-based
interface GalleryProps {
  designs: GalleryDesign[];
  displayCount?: number;
}

export function Gallery({ designs, displayCount = 15 }: GalleryProps) {
  return <div>{/* render designs */}</div>;
}

// ❌ BAD - Hardcoded
export function Gallery() {
  const designs = [ /* hardcoded array */ ];
  return <div>{/* render designs */}</div>;
}
```

---

## 📋 Quick Reference Table

| **Data Type** | **Import** | **File** |
|--------------|-----------|----------|
| Gallery images | `galleryDesigns` | `gallery.ts` |
| Carousel images | `carouselFallbackImages` | `gallery.ts` |
| Tattoo styles | `tattooStyles` | `generator-options.ts` |
| Placements | `tattooPlacements` | `generator-options.ts` |
| Sizes | `tattooSizes` | `generator-options.ts` |
| Colors | `colorPreferences` | `generator-options.ts` |
| Tattoo cards | `tattooCards` | `tattoo-cards.ts` |
| Timeline steps | `timelineSteps` | `timeline.ts` |
| Stats | `socialProofStats` | `social-proof.ts` |
| Testimonials | `testimonials` | `social-proof.ts` |
| Homepage stats | `homePageStats` | `social-proof.ts` |
| Validation messages | `validationMessages` | `content.ts` |
| Section headings | `sectionHeadings` | `content.ts` |
| Footer content | `footerContent` | `content.ts` |
| Generator types | `generatorOptions` | `generator-types.ts` |
| Moods | `moods` | `moods.ts` |
| Aspect ratios | `aspectRatios` | `aspect-ratios.ts` |

---

## 💡 Tips

1. **Always import from `/data/`** - Never hardcode content in components
2. **Use TypeScript interfaces** - All data has proper typing
3. **Pass data as props** - Keep components flexible and reusable
4. **Icon handling** - Icons are React components, use them with JSX syntax
5. **Centralized imports** - Use `/data/index.ts` for cleaner imports

---

**Ready for Step 2:** Refactoring components to use this data! 🚀
