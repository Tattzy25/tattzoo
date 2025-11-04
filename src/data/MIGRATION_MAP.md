# Data Migration Map

This document shows exactly what content was extracted from components and where it's now located in `/data/`.

---

## 🔄 Extracted Content

### **From: `GeneratorPage.tsx`**

| **Content** | **Lines** | **New Location** | **Type** |
|------------|----------|-----------------|----------|
| Gallery designs (30 items) | 69-100 | `/data/gallery.ts` → `galleryDesigns` | GalleryDesign[] |
| Tattoo styles array (10 items) | 285-288 | `/data/generator-options.ts` → `tattooStyles` | string[] |
| Placements array (10 items) | 290-293 | `/data/generator-options.ts` → `tattooPlacements` | string[] |
| Tattoo card data (48 items) | 312-368 | `/data/tattoo-cards.ts` → `tattooCards` | TattooCard[] |
| Fallback carousel images (6 items) | 371-378 | `/data/gallery.ts` → `carouselFallbackImages` | string[] |
| Validation messages | 224, 237 | `/data/content.ts` → `validationMessages` | object |
| Homepage stats (3 items) | 471-490 | `/data/social-proof.ts` → `homePageStats` | HomePageStat[] |
| Section headings | Various | `/data/content.ts` → `sectionHeadings` | object |

---

### **From: `HowItWorksTimeline.tsx`**

| **Content** | **Lines** | **New Location** | **Type** |
|------------|----------|-----------------|----------|
| Timeline steps (4 items) | 9-30 | `/data/timeline.ts` → `timelineSteps` | TimelineStep[] |
| Section title "HOW IT WORKS" | 36-44 | `/data/content.ts` → `sectionHeadings.howItWorks` | object |

---

### **From: `SocialProofSection.tsx`**

| **Content** | **Lines** | **New Location** | **Type** |
|------------|----------|-----------------|----------|
| Stats array (3 items) | 4-8 | `/data/social-proof.ts` → `socialProofStats` | StatItem[] |
| Testimonials (2 items) | 10-25 | `/data/social-proof.ts` → `testimonials` | Testimonial[] |
| Section title "TRUSTED BY THOUSANDS" | 31-42 | `/data/content.ts` → `sectionHeadings.trustedByThousands` | object |

---

### **From: `LicenseKeySection.tsx`**

| **Content** | **Lines** | **New Location** | **Type** |
|------------|----------|-----------------|----------|
| Title "GET YOUR PRIVATE KEY" | 34-41 | `/data/content.ts` → `sectionHeadings.licenseKey.title` | string |
| Price "$9.99 • Unlimited Access" | 42-44 | `/data/content.ts` → `sectionHeadings.licenseKey.price` | string |
| Description | 45-47 | `/data/content.ts` → `sectionHeadings.licenseKey.description` | string |
| Button text "UNLOCK NOW" | 51-62 | `/data/content.ts` → `sectionHeadings.licenseKey.buttonText` | string |
| Payment note | 64-66 | `/data/content.ts` → `sectionHeadings.licenseKey.paymentNote` | string |

---

### **From: `Footer.tsx`**

| **Content** | **Lines** | **New Location** | **Type** |
|------------|----------|-----------------|----------|
| Brand name "TaTTTy" | 16 | `/data/content.ts` → `footerContent.brandName` | string |
| Description | 20-22 | `/data/content.ts` → `footerContent.description` | string |
| Location (LA, CA) | 25-28 | `/data/content.ts` → `footerContent.location` | object |
| Policy links | 36-52 | `/data/content.ts` → `footerContent.links` | object |
| "Made with AI" message | 54-56 | `/data/content.ts` → `footerContent.madeWithAI` | string |
| Copyright | 59-61 | `/data/content.ts` → `footerContent.copyright` | string |

---

### **From: `utils/generatorData.ts`**

| **Content** | **Lines** | **New Location** | **Type** |
|------------|----------|-----------------|----------|
| Generator options (2 items) | 14-33 | `/data/generator-types.ts` → `generatorOptions` | GeneratorOption[] |
| Carousel categories (4 items) | 44-69 | `/data/generator-types.ts` → `carouselCategories` | CarouselCategory[] |

---

### **From: `utils/mockDataGenerator.ts`**

| **Content** | **Lines** | **New Location** | **Type** |
|------------|----------|-----------------|----------|
| Moods array (24 items) | 176-201 | `/data/moods.ts` → `moods` | Mood[] |
| Aspect ratios (8 items) | 231-240 | `/data/aspect-ratios.ts` → `aspectRatios` | AspectRatioOption[] |

---

### **From: `components/generator/GeneratorCarouselPanel.tsx`**

| **Content** | **Lines** | **New Location** | **Type** |
|------------|----------|-----------------|----------|
| Sizes array (4 items) | 40 | `/data/generator-options.ts` → `tattooSizes` | string[] |
| Colors array (4 items) | 41 | `/data/generator-options.ts` → `colorPreferences` | string[] |

---

## 📊 Summary Stats

| **Metric** | **Count** |
|-----------|----------|
| **Total data files created** | 9 |
| **Total interfaces/types** | 12 |
| **Total data arrays** | 18 |
| **Components affected** | 8 |
| **Lines of hardcoded content removed** | ~500+ |

---

## ✅ What's Complete

- ✅ All hardcoded arrays extracted
- ✅ All text/copy extracted
- ✅ All validation messages extracted
- ✅ All section headings extracted
- ✅ TypeScript interfaces for all data
- ✅ Central export via `/data/index.ts`
- ✅ Icon mapping utilities for database migration
- ✅ Database migration checklist
- ✅ Documentation (README + this file)

---

## 🔜 Next Steps (STEP 2 & 3)

1. **Refactor components to import from `/data/`**
   - Replace all hardcoded content with imports
   - Make components fully prop-based
   
2. **Test all components**
   - Ensure visual parity
   - Verify all props are passed correctly
   
3. **Clean up old files** (if needed)
   - `utils/generatorData.ts` can be deleted
   - `mockDataGenerator.ts` can be cleaned up

---

## 🎯 Benefits

1. **CMS-Ready**: All content centralized for easy database connection
2. **Modular**: Each data file is focused and easy to manage
3. **Scalable**: Add new content without touching components
4. **Type-Safe**: Full TypeScript support with interfaces
5. **Zero Refactoring**: When connecting to database, components stay the same

---

**Last Updated:** Step 1 Complete ✅
