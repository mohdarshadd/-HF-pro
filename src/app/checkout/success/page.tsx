"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-veg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">
          Order Placed!
        </h1>
        <p className="text-muted mb-2">
          Thank you for ordering from Hello Food. Your order has been placed
          successfully.
        </p>
        {orderId && (
          <p className="text-sm text-muted mb-8">
            Order ID: <span className="font-mono font-medium">{orderId}</span>
          </p>
        )}

        <div className="space-y-3">
          <Link
            href="/track"
            className="block w-full bg-brand text-white py-3 rounded-full font-semibold text-sm hover:bg-brand-hover transition-colors"
          >
            Track My Order
          </Link>
          <Link
            href="/menu"
            className="block w-full border border-border text-foreground py-3 rounded-full font-semibold text-sm hover:bg-cream transition-colors"
          >
            Order More
          </Link>
          <Link
            href="/"
            className="block w-full text-muted py-3 rounded-full font-semibold text-sm hover:text-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-muted">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
