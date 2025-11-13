"use client"

import { cn } from "@/lib/utils"

interface Product {
  id: string
  image: string
  name: string
  brand?: string
  badge?: string | null
  metadata?: Record<string, unknown>
}

interface ProductListingFilters01Props {
  products: Product[]
  showFilters?: boolean
  columnsClassName?: string
}

export default function ProductListingFilters01({
  products,
  showFilters = true,
  columnsClassName = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
}: ProductListingFilters01Props) {
  return (
    <div className="w-full">
      {showFilters && (
        <div className="mb-6">
          {/* Filters can be added here if needed */}
        </div>
      )}
      
      <div className={cn(columnsClassName)}>
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            
            {product.badge && (
              <div className="absolute top-2 right-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {product.badge}
                </span>
              </div>
            )}
            
            <div className="p-3">
              {product.brand && (
                <p className="text-xs text-muted-foreground">{product.brand}</p>
              )}
              <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
