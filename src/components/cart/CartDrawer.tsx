"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const total = getTotal();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            Your Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-cream transition-colors"
            aria-label="Close cart"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-muted mb-6">
                Add some delicious items from our menu!
              </p>
              <button
                onClick={onClose}
                className="text-sm font-medium text-brand hover:underline"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size || ""}`}
                  className="flex gap-4 p-3 bg-cream/30 rounded-xl border border-border"
                >
                  {/* Image placeholder */}
                  <div className="w-16 h-16 bg-cream rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-2xl">🍕</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </h4>
                    {item.size && (
                      <span className="text-xs text-muted">{item.size}</span>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.size
                            )
                          }
                          className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center text-sm hover:border-brand transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.size
                            )
                          }
                          className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center text-sm hover:border-brand transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-brand">
                          ₹{item.price * item.quantity}
                        </span>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-muted hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-muted hover:text-red-500 transition-colors py-2"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Total</span>
              <span className="text-xl font-bold text-foreground">₹{total}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-brand text-white text-center py-3.5 rounded-full font-semibold hover:bg-brand-hover transition-colors active:scale-[0.98]"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
