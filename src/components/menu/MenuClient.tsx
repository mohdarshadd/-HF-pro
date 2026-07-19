"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import FoodCard from "@/components/menu/FoodCard";
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

const categoryGroups = [
  {
    label: "Pizzas",
    categories: ["Classic", "Simple Veg", "Veg Favorite", "Supreme", "Ultimate"],
  },
  { label: "Pizza Mania", categories: ["Pizza Mania - Single Topping", "Pizza Mania - Double Topping", "Yummy Pizza"] },
  { label: "Burgers", categories: ["Burgers"] },
  { label: "Sandwich", categories: ["Sandwich"] },
  { label: "Pasta", categories: ["Pasta"] },
  { label: "Garlic Bread", categories: ["Garlic Bread"] },
  { label: "Fries", categories: ["Fries"] },
  { label: "Wraps", categories: ["Wraps"] },
  { label: "Salad", categories: ["Salad"] },
  { label: "Sides", categories: ["Sides"] },
  { label: "Shakes", categories: ["Shakes"] },
  { label: "Coffee", categories: ["Coffee"] },
  { label: "Mocktails", categories: ["Mocktails"] },
  { label: "Drinks", categories: ["Drinks"] },
  { label: "Rolls", categories: ["Rolls"] },
  { label: "Combos", categories: ["Combos"] },
];

const slugToTab: Record<string, string> = {
  classic: "Pizzas",
  burgers: "Burgers",
  pasta: "Pasta",
  shakes: "Shakes",
  fries: "Fries",
  combos: "Combos",
  sandwich: "Sandwich",
  "garlic-bread": "Garlic Bread",
  wraps: "Wraps",
  salad: "Salad",
  sides: "Sides",
  coffee: "Coffee",
  mocktails: "Mocktails",
  drinks: "Drinks",
  rolls: "Rolls",
  "pizza-mania": "Pizza Mania",
};

export default function MenuClient() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const initialTab = categoryParam ? slugToTab[categoryParam.toLowerCase()] || "Pizzas" : "Pizzas";

  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const tabsRef = useRef<HTMLDivElement>(null);
  const cartItems = useCart((s) => s.items) || [];
  const openCart = useCart((s) => s.openCart);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchMenu = () => {
      fetch("/api/menu")
        .then((res) => res.json())
        .then((data) => {
          setItems(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchMenu();
    const interval = setInterval(fetchMenu, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter items based on active tab
  const activeCategories =
    categoryGroups.find((g) => g.label === activeTab)?.categories || [];
  const filteredItems = (items || []).filter((item) =>
    activeCategories.includes(item.category)
  );

  // Scroll to active tab
  useEffect(() => {
    if (tabsRef.current) {
      const activeButton = tabsRef.current.querySelector(
        `[data-tab="${activeTab}"]`
      );
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeTab]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Our <span className="text-brand">Menu</span>
          </h1>
          <p className="text-muted mt-1">
            Fresh food, made just for you
          </p>
        </div>

        {/* Category Tabs */}
        <div
          ref={tabsRef}
          className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-6 sticky top-16 bg-white z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {categoryGroups.map((group) => (
            <button
              key={group.label}
              data-tab={group.label}
              onClick={() => setActiveTab(group.label)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === group.label
                  ? "bg-brand text-white shadow-sm"
                  : "bg-cream text-foreground hover:bg-cream-dark"
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-cream/50 rounded-2xl h-48 border border-border"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No items found
            </h3>
            <p className="text-sm text-muted">
              This category is being updated. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && (
        <button
          onClick={openCart}
          className="fixed bottom-6 right-6 sm:hidden bg-brand text-white px-6 py-3 rounded-full shadow-lg shadow-brand/30 font-semibold flex items-center gap-2 z-40 active:scale-95 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          Cart · ₹{cartItems.reduce((s, i) => s + i.price * i.quantity, 0)}
        </button>
      )}

      {/* Desktop Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={openCart}
          className="hidden sm:flex fixed bottom-6 right-6 bg-brand text-white px-6 py-3 rounded-full shadow-lg shadow-brand/30 font-semibold items-center gap-2 z-40 hover:bg-brand-hover transition-colors active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          View Cart ({cartCount}) · ₹
          {cartItems.reduce((s, i) => s + i.price * i.quantity, 0)}
        </button>
      )}
    </>
  );
}
