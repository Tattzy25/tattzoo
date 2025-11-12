"use client"

import { useState, useEffect, useMemo } from "react"
import { Heart, X, ChevronLeft, ChevronRight } from "lucide-react"
// Reuse shared gallery visual styles (shadows, heart button styles, etc.)
// so the cards in this gallery have the same deep glow/shadow as the top gallery.
import "../../shared/TattooGallery.css"

import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { galleryDesigns } from "@/data/gallery"
import { tattooStyles, tattooPlacements, tattooSizes, colorPreferences } from "@/data/generator-options"
import { moods } from "@/data/moods"

type GalleryProduct = {
  id: string;
  image: string;
  name: string;
  brand?: string;
  badge?: string | null;
  price?: string | number;
  metadata?: Record<string, any>;
};

interface ProductListingProps {
  products?: GalleryProduct[];
  showFilters?: boolean;
  hidePrice?: boolean;
  columnsClassName?: string;
  totalLabel?: string;
  onLoadMore?: () => void;
  onItemClick?: (product: GalleryProduct) => void;
  onFiltersChange?: (filters: Record<string, string>) => void;
}

const FILTERS = [
  {
    id: "style",
    label: "Style",
    options: ["All Styles", ...tattooStyles],
  },
  {
    id: "placement",
    label: "Placement",
    options: ["All Placements", ...tattooPlacements],
  },
  {
    id: "size",
    label: "Size",
    options: ["All Sizes", ...tattooSizes],
  },
  {
    id: "color",
    label: "Color",
    options: ["All Colors", ...colorPreferences],
  },
  {
    id: "mood",
    label: "Mood",
    options: ["All Moods", ...moods.map(m => m.label)],
  },
]

// Convert gallery designs to products format
const TATTOO_PRODUCTS: GalleryProduct[] = galleryDesigns.map(design => ({
  id: design.id,
  image: design.image,
  name: design.title,
  brand: "TaTTTy",
  badge: null,
  metadata: {
    style: "Various",
    placement: "Various",
    size: "Medium",
    color: "Black & Grey",
    mood: "Various"
  }
}))

export default function ImageGallery({
  products,
  showFilters = false,
  hidePrice = false,
  columnsClassName = "grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4",
  totalLabel,
  onItemClick,
  onFiltersChange,
}: ProductListingProps) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({})

  // Lightbox state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

  // Use provided products or default to TATTOO_PRODUCTS
  const data = useMemo(() => products || TATTOO_PRODUCTS, [products])

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const handleCloseLightbox = () => {
    setLightboxImage(null)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : data.length - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < data.length - 1 ? prev + 1 : 0))
  }

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxImage) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      } else if (e.key === 'Escape') {
        handleCloseLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxImage, currentImageIndex])

  // Notify parent when filters change (if provided)
  useEffect(() => {
    onFiltersChange?.(selectedFilters)
  }, [selectedFilters, onFiltersChange])

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="w-full">
        {showFilters && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <Select
                  key={filter.id}
                  value={selectedFilters[filter.id] || filter.options[0]}
                  onValueChange={(value) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      [filter.id]: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">{data.length} {totalLabel || 'Designs'}</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className={columnsClassName || "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"}>
          {data.map((product) => (
            <div
              key={product.id}
              // Add tg-grid-item to match shadow style of the hero gallery cards
              className="group bg-card relative overflow-hidden rounded-3xl transition-all tg-grid-item"
            >
              {product.badge && (
                <Badge
                  variant="secondary"
                  className="absolute top-3 left-3 z-10 bg-white dark:bg-gray-900"
                >
                  {product.badge}
                </Badge>
              )}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    favorites.includes(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                />
              </button>

              <div
                className="bg-muted/30 aspect-square overflow-hidden cursor-pointer rounded-3xl"
                onClick={() => {
                  setLightboxImage(product.image);
                  setCurrentImageIndex(data.findIndex(p => p.id === product.id));
                  onItemClick?.(product)
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{product.brand}</p>
                    <p className="text-muted-foreground mt-1 text-sm leading-tight">
                      {product.name}
                    </p>
                  </div>
                </div>
                {product.price && !hidePrice && (
                  <p className="mt-2 font-semibold">{product.price}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={handleCloseLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Global close button: fixed and always visible */}
          <button
            onClick={handleCloseLightbox}
            className="fixed top-4 right-4 z-60 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-colors"
            aria-label="Close image"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Content wrapper - stops propagation so clicking image doesn't close */}
          <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            {/* Navigation buttons */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <img
              src={data[currentImageIndex]?.image || lightboxImage}
              alt={data[currentImageIndex]?.name || "Product image"}
              className="max-w-full max-h-[80vh] object-contain"
            />

            {/* Image info */}
            {data[currentImageIndex] && (
              <div className="mt-4 text-center text-white">
                <p className="text-lg font-semibold">{data[currentImageIndex].brand}</p>
                <p className="text-sm opacity-90">{data[currentImageIndex].name}</p>
                {data[currentImageIndex].price && !hidePrice && (
                  <p className="text-sm font-medium mt-1">{data[currentImageIndex].price}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
