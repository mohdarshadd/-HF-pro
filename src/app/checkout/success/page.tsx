"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12" style={{ backgroundColor: "rgba(255,247,211,0.3)" }}>
      <div
        className={`w-full max-w-lg transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {/* Success Header */}
          <div className="bg-veg px-8 pt-10 pb-10 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-veg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Order Confirmed!</h1>
            <p className="text-white/80 text-sm mt-2">Thank you for ordering from Hello Food</p>
          </div>

          {/* Order Details */}
          <div className="p-6 sm:p-8">
            {/* Order ID */}
            {orderId && (
              <div className="bg-gray-50 border border-border rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
                <span className="text-xs text-muted font-medium uppercase tracking-wider">Order ID</span>
                <span className="text-sm font-mono font-semibold text-foreground">#{orderId.slice(-8).toUpperCase()}</span>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 border border-border rounded-xl p-4 text-center">
                <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-muted mb-0.5">Estimated Time</p>
                <p className="text-sm font-bold text-foreground">30–45 min</p>
              </div>
              <div className="bg-gray-50 border border-border rounded-xl p-4 text-center">
                <div className="w-9 h-9 rounded-lg bg-veg/10 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-veg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-muted mb-0.5">Payment</p>
                <p className="text-sm font-bold text-veg">Confirmed</p>
              </div>
            </div>

            {/* What happens next */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0">📋</span>
                  <p className="text-sm text-muted leading-relaxed">We received your order and it&apos;s being prepared</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0">👨‍🍳</span>
                  <p className="text-sm text-muted leading-relaxed">Your food will be freshly made with love</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0">📍</span>
                  <p className="text-sm text-muted leading-relaxed">Track your order status in real-time</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/track"
                className="flex items-center justify-center gap-2 w-full bg-brand text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-hover transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25" />
                </svg>
                Track My Order
              </Link>
              <Link
                href="/menu"
                className="flex items-center justify-center gap-2 w-full border border-border text-foreground py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                Order More Food
              </Link>
              <Link
                href="/"
                className="block text-center text-sm text-muted font-medium hover:text-foreground transition-colors pt-1"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-muted">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
