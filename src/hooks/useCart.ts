"use client";

import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size?: string;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  openCart: () => void;
  closeCart: () => void;
}

function saveToStorage(items: CartItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("hellofood-cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  }
}

function loadFromStorage(): CartItem[] {
  if (typeof window !== "undefined") {
    try {
      return JSON.parse(localStorage.getItem("hellofood-cart") || "[]");
    } catch {
      return [];
    }
  }
  return [];
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  addItem: (item) => {
    const items = get().items;
    const key = item.size ? `${item.id}-${item.size}` : item.id;
    const existingIndex = items.findIndex((i) => {
      const iKey = i.size ? `${i.id}-${i.size}` : i.id;
      return iKey === key;
    });

    let newItems: CartItem[];
    if (existingIndex >= 0) {
      newItems = items.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newItems = [...items, { ...item, quantity: 1 }];
    }

    set({ items: newItems });
    saveToStorage(newItems);
  },

  removeItem: (id, size) => {
    const items = get().items;
    const key = size ? `${id}-${size}` : id;
    const newItems = items.filter((i) => {
      const iKey = i.size ? `${i.id}-${i.size}` : i.id;
      return iKey !== key;
    });
    set({ items: newItems });
    saveToStorage(newItems);
  },

  updateQuantity: (id, quantity, size) => {
    const items = get().items;
    const key = size ? `${id}-${size}` : id;
    let newItems: CartItem[];
    if (quantity <= 0) {
      newItems = items.filter((i) => {
        const iKey = i.size ? `${i.id}-${i.size}` : i.id;
        return iKey !== key;
      });
    } else {
      newItems = items.map((i) => {
        const iKey = i.size ? `${i.id}-${i.size}` : i.id;
        return iKey === key ? { ...i, quantity } : i;
      });
    }
    set({ items: newItems });
    saveToStorage(newItems);
  },

  clearCart: () => {
    set({ items: [] });
    saveToStorage([]);
  },

  getTotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
