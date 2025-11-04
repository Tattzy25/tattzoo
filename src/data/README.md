# `/data/` Folder - Database-Ready Content

All content in this folder will eventually be fetched from a database/CMS. This folder serves as a **temporary staging layer** to keep components prop-based and CMS-ready.

## 📁 Folder Structure

```
/data/
├── index.ts                  # Central export (clean imports)
├── gallery.ts               # Gallery images (30 designs)
├── generator-options.ts     # Styles, placements, sizes, colors
├── generator-types.ts       # TaTTTy vs Freestyle config
├── tattoo-cards.ts          # Carousel cards (48 cards)
├── timeline.ts              # "How It Works" steps (4 steps)
├── social-proof.ts          # Stats + testimonials
├── content.ts               # All text/copy/messages
├── moods.ts                 # Mood options (24 moods)
└── aspect-ratios.ts         # Image dimension options (8 ratios)
```

---

## 🔄 Current Flow (Static Data)

```
/data/ files → Component receives as props ✅
```

**Example:**
```tsx
import { galleryDesigns } from '../data';

<TattooGallery designs={galleryDesigns} />
```

---

## 🚀 Future Flow (Database)

```
Database/API → Component receives as props ✅
```

**Example:**
```tsx
const { data: galleryDesigns } = await supabase
  .from('gallery_designs')
  .select('*');

<TattooGallery designs={galleryDesigns} />
```

**Components don't change** - just where data comes from!

---

## 🗄️ Database Migration Checklist

When connecting to Supabase/database:

### **1. Gallery Images** (`gallery.ts`)
- [ ] Create table: `gallery_designs` (id, title, image_url, category, created_at)
- [ ] Migrate 30 designs
- [ ] Replace `import { galleryDesigns }` with API call

### **2. Generator Options** (`generator-options.ts`)
- [ ] Create table: `tattoo_styles` (id, name, display_order)
- [ ] Create table: `tattoo_placements` (id, name, display_order)
- [ ] Create table: `tattoo_sizes` (id, name, display_order)
- [ ] Create table: `color_preferences` (id, name, display_order)
- [ ] Migrate all options

### **3. Tattoo Cards** (`tattoo-cards.ts`)
- [ ] Create table: `tattoo_cards` (id, title, category, image_url, display_order)
- [ ] Migrate 48 cards
- [ ] Add filtering by category

### **4. Timeline** (`timeline.ts`)
- [ ] Create table: `timeline_steps` (id, title, description, icon_name, step_order)
- [ ] Migrate 4 steps
- [ ] Handle icon mapping (store icon name as string)

### **5. Social Proof** (`social-proof.ts`)
- [ ] Create table: `site_stats` (id, stat_key, value, label, icon_name)
- [ ] Create table: `testimonials` (id, name, location, text, avatar_url, rating, featured, created_at)
- [ ] Set up real-time stat updates
- [ ] Add pagination for testimonials

### **6. Content/Copy** (`content.ts`)
- [ ] Create table: `site_content` (id, key, value, language, section)
- [ ] Migrate all text content
- [ ] Add multi-language support

### **7. Moods** (`moods.ts`)
- [ ] Create table: `moods` (id, label, icon_name, display_order)
- [ ] Migrate 24 moods
- [ ] Handle icon mapping (see iconMap)

### **8. Aspect Ratios** (`aspect-ratios.ts`)
- [ ] Create table: `aspect_ratios` (id, label, value, icon_name, grid_position, center_effect)
- [ ] Migrate 8 ratios
- [ ] Handle icon mapping

---

## 🎯 Icon Handling Strategy

**Problem:** Lucide icons are React components, can't be stored in database directly.

**Solution:** Store icon name as string, map to component when fetching.

**Example:**

```tsx
// Database stores: { icon_name: 'Smile' }

// On fetch, map to component:
import { iconMap } from '../data/moods';

const mood = {
  ...dbMood,
  icon: iconMap[dbMood.icon_name]
};
```

---

## 📝 Notes

- All files have TypeScript interfaces ready for database schema
- Each file has TODO comments for database migration
- Icon mapping utilities included where needed
- Prop-based design ensures zero refactoring when switching to database

---

## 🔗 Related Files

- Components import from `/data/index.ts`
- Types defined in `/types/` folder
- Future: Add `/lib/db.ts` for database queries
