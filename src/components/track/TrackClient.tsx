"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface OrderItem {
  name: string;
  size?: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const statusSteps = ["placed", "preparing", "ready", "delivered"];

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  placed: { label: "Placed", color: "text-blue-600", bg: "bg-blue-50", dot: "bg-blue-500" },
  preparing: { label: "Preparing", color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
  ready: { label: "Ready", color: "text-purple-600", bg: "bg-purple-50", dot: "bg-purple-500" },
  delivered: { label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-50", dot: "bg-red-500" },
};

export default function TrackClient() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [liveUpdating, setLiveUpdating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedPhoneRef = useRef("");

  const fetchOrders = useCallback(async (phoneNumber: string, silent = false) => {
    if (silent) setLiveUpdating(true);
    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phoneNumber)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // silent background refresh — don't show error
    } finally {
      if (silent) setLiveUpdating(false);
    }
  }, []);

  // Poll every 10s if there are active (non-delivered, non-cancelled) orders
  useEffect(() => {
    if (orders.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const hasActive = orders.some(
      (o) => !["delivered", "cancelled"].includes(o.orderStatus)
    );

    if (hasActive) {
      timerRef.current = setInterval(() => {
        fetchOrders(savedPhoneRef.current, true);
      }, 10000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [orders, fetchOrders]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setError("");
    setOrders([]);
    savedPhoneRef.current = phone.trim();

    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phone.trim())}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to look up orders");
        return;
      }
      const data = await res.json();
      setOrders(data);
      setSearched(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === "cancelled") return -1;
    return statusSteps.indexOf(status);
  };

  return (
    <div className="min-h-[70vh] bg-cream/30">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand/5 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
          <p className="text-muted text-sm">Enter the phone number you used when placing the order</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-white rounded-2xl border border-border/50 p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm bg-cream/10 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-muted/50"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !phone.trim()}
                className="bg-brand text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-hover transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  "Track"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {searched && !loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-border/50 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">No orders found</h3>
            <p className="text-sm text-muted">No orders found for this phone number. Please check and try again.</p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-4">
            {/* Live indicator */}
            {orders.some((o) => !["delivered", "cancelled"].includes(o.orderStatus)) && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-veg opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-veg" />
                </span>
                Auto-updating every 10s
                {liveUpdating && <span className="text-muted/60">· refreshing...</span>}
              </div>
            )}
            {orders.map((order) => {
              const stepIdx = getStepIndex(order.orderStatus);
              const isCancelled = order.orderStatus === "cancelled";
              const config = statusConfig[order.orderStatus];

              return (
                <div key={order._id} className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm">
                  {/* Order Header */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted mb-0.5">
                          {new Date(order.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-muted font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        {config.label}
                      </span>
                    </div>

                    {/* Status Progress (non-cancelled only) */}
                    {!isCancelled && (
                      <div className="mb-5">
                        <div className="flex items-center">
                          {statusSteps.map((step, idx) => {
                            const isCompleted = idx <= stepIdx;
                            const isCurrent = idx === stepIdx;
                            const sc = statusConfig[step];

                            return (
                              <div key={step} className="flex-1 flex items-center">
                                {/* Step Circle */}
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isCompleted
                                      ? `${sc.bg} ${sc.color}`
                                      : "bg-gray-100 text-gray-400"
                                  } ${isCurrent ? "ring-2 ring-offset-2 ring-brand/20" : ""}`}>
                                    {isCompleted ? (
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      idx + 1
                                    )}
                                  </div>
                                  <span className={`text-[10px] font-medium mt-1.5 ${isCompleted ? "text-foreground" : "text-muted"}`}>
                                    {sc.label}
                                  </span>
                                </div>
                                {/* Connector Line */}
                                {idx < statusSteps.length - 1 && (
                                  <div className={`flex-1 h-0.5 mx-1.5 mb-5 rounded-full transition-all ${
                                    idx < stepIdx ? "bg-brand" : "bg-gray-200"
                                  }`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {isCancelled && (
                      <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-5 flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <span className="text-sm font-medium text-red-600">This order has been cancelled</span>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-1.5 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-1.5">
                          <span className="text-foreground">
                            {item.quantity}× {item.name}
                            {item.size && <span className="text-muted"> ({item.size})</span>}
                          </span>
                          <span className="font-medium text-foreground">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t border-border/50 pt-3 flex justify-between">
                      <span className="text-sm font-medium text-muted">Total</span>
                      <span className="text-base font-bold text-brand">₹{order.total}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
