"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";

interface FoodItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  hasSizes: boolean;
  sizes: { label: string; price: number }[];
  price: number;
}

export default function FoodCard({ item }: { item: FoodItem }) {
  const [selectedSize, setSelectedSize] = useState(
    item.hasSizes ? item.sizes[0]?.label : undefined
  );
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  const currentPrice = item.hasSizes
    ? item.sizes.find((s) => s.label === selectedSize)?.price || item.sizes[0]?.price
    : item.price;

  const handleAdd = () => {
    if (!item.isAvailable) return;

    addItem({
      id: item._id,
      name: item.name,
      price: currentPrice,
      size: selectedSize,
      image: item.image,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className={`group bg-white rounded-2xl border border-border overflow-hidden transition-all hover:shadow-md ${
        !item.isAvailable ? "opacity-60" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-40 bg-cream overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Veg/Non-veg badge */}
              <div
                className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                  item.isVeg ? "border-veg" : "border-nonveg"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.isVeg ? "bg-veg" : "bg-nonveg"
                  }`}
                />
              </div>
              <h3 className="text-sm font-semibold text-foreground truncate">
                {item.name}
              </h3>
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <span className="text-base font-bold text-brand">₹{currentPrice}</span>
          </div>
        </div>

        {/* Size selector */}
        {item.hasSizes && item.sizes.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {item.sizes.map((size) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size.label)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedSize === size.label
                    ? "bg-brand text-white"
                    : "bg-cream text-foreground hover:bg-cream-dark"
                }`}
              >
                {size.label} · ₹{size.price}
              </button>
            ))}
          </div>
        )}

        {/* Add button */}
        <div className="mt-3">
          {item.isAvailable ? (
            <button
              onClick={handleAdd}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                added
                  ? "bg-veg text-white"
                  : "bg-brand text-white hover:bg-brand-hover active:scale-[0.98]"
              }`}
            >
              {added ? "✓ Added" : "Add to Cart"}
            </button>
          ) : (
            <div className="w-full py-2.5 rounded-xl text-sm font-medium text-muted bg-gray-100 text-center">
              Currently Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
