"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

export default function CheckoutClient() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const total = getTotal();
  const orderPlaced = useRef(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0 && !orderPlaced.current) {
      router.push("/menu");
    }
  }, [items.length, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.email || !form.address) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          items: items.map((i) => ({
            foodItem: i.id,
            name: i.name,
            size: i.size,
            price: i.price,
            quantity: i.quantity,
          })),
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: form.address,
            orderType: "dinein",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create order");
        setLoading(false);
        return;
      }

      // Mark payment as completed (skip Razorpay for now)
      await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: data.orderId,
          razorpay_payment_id: "skip_payment",
          orderId: data.dbOrderId,
        }),
      });

      orderPlaced.current = true;
      clearCart();
      router.push(`/checkout/success?orderId=${data.dbOrderId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Full-screen loader overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-brand/20 border-t-brand animate-spin mx-auto mb-5" />
            <p className="text-lg font-semibold text-foreground mb-1">Placing your order...</p>
            <p className="text-sm text-muted">Hang tight, this won&apos;t take long</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Delivery Details
              </h2>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  placeholder="your@email.com"
                />
              </div>

              <div className="mt-4 bg-cream/50 border border-border rounded-xl p-4 text-center">
                <p className="text-sm text-muted">
                  📍 Dine in at <span className="font-semibold text-foreground">Hello Food</span>, Gandhi Stadium Road, Pilibhit
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Address / Table No.
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  placeholder="Your address or table number"
                />
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white py-4 rounded-full font-semibold text-base hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Placing Order...
                </span>
              ) : (
                `Place Order · ₹${total}`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size || ""}`}
                  className="flex justify-between text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground truncate block">
                      {item.name}
                      {item.size && (
                        <span className="text-muted"> ({item.size})</span>
                      )}
                    </span>
                    <span className="text-xs text-muted">
                      × {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium text-foreground shrink-0 ml-2">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="font-medium text-foreground">₹{total}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-muted">Delivery</span>
                <span className="text-sm text-veg font-medium">Free</span>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t border-border">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-xl text-brand">₹{total}</span>
              </div>
            </div>

            <Link
              href="/menu"
              className="block text-center text-sm text-brand font-medium mt-4 hover:underline"
            >
              ← Back to Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
