"use client";

import { useState, useEffect } from "react";

interface OrderItem {
  foodItem: string;
  name: string;
  size?: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus: "placed" | "preparing" | "ready" | "delivered" | "cancelled";
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; dot: string; bg: string }> = {
  placed: { label: "Placed", color: "text-blue-600", dot: "bg-blue-500", bg: "bg-blue-50" },
  preparing: { label: "Preparing", color: "text-amber-600", dot: "bg-amber-500", bg: "bg-amber-50" },
  ready: { label: "Ready", color: "text-purple-600", dot: "bg-purple-500", bg: "bg-purple-50" },
  delivered: { label: "Delivered", color: "text-emerald-600", dot: "bg-emerald-500", bg: "bg-emerald-50" },
  cancelled: { label: "Cancelled", color: "text-red-500", dot: "bg-red-500", bg: "bg-red-50" },
};

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus: status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: status as Order["orderStatus"] } : o
          )
        );
      }
    } catch {
      console.error("Failed to update status");
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.orderStatus === statusFilter)
    : orders;

  const activeOrders = orders.filter((o) => ["placed", "preparing", "ready"].includes(o.orderStatus));
  const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered");
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "completed" || o.orderStatus === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-border/50 p-16 text-center">
        <div className="inline-flex items-center gap-2 text-muted">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading orders...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border/50 p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">No orders yet</h3>
        <p className="text-sm text-muted">Orders will appear here when customers place them.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 sm:mb-6">
        {[
          { value: orders.length, label: "Total Orders", bg: "bg-brand/5", color: "text-brand", iconPath: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" },
          { value: activeOrders.length, label: "Active", bg: "bg-amber-50", color: "text-amber-500", iconPath: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
          { value: deliveredOrders.length, label: "Delivered", bg: "bg-emerald-50", color: "text-emerald-500", iconPath: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { value: `₹${totalRevenue.toLocaleString("en-IN")}`, label: "Revenue", bg: "bg-veg/5", color: "text-veg", iconPath: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-border/50 p-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                <svg className={`w-4 h-4 ${stat.color}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.iconPath} />
                </svg>
              </div>
              <div className="min-w-0 w-full">
                <p className="text-base font-bold text-foreground leading-tight whitespace-nowrap">{stat.value}</p>
                <p className="text-[10px] text-muted leading-tight truncate">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 flex-wrap">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
            statusFilter === ""
              ? "bg-brand text-white shadow-sm"
              : "bg-white border border-border text-muted hover:text-foreground hover:border-border/80"
          }`}
        >
          All ({orders.length})
        </button>
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = orders.filter((o) => o.orderStatus === key).length;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
                statusFilter === key
                  ? `${config.bg} ${config.color} shadow-sm`
                  : "bg-white border border-border text-muted hover:text-foreground hover:border-border/80"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const config = statusConfig[order.orderStatus];
          const isExpanded = expandedId === order._id;

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-border/50 transition-all hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              {/* Order Header */}
              <div
                className="p-3 sm:p-5 cursor-pointer transition-colors hover:bg-cream/15"
                onClick={() => setExpandedId(isExpanded ? null : order._id)}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Customer + Status */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                      <span className={`text-sm font-bold ${config.color}`}>
                        {order.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {order.customerName}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${config.bg} ${config.color}`}>
                          <span className={`w-1 h-1 rounded-full ${config.dot}`} />
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-muted">
                          {new Date(order.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <span className="text-xs text-muted">·</span>
                        <p className="text-xs text-muted">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Total + Expand */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-base font-bold text-foreground">₹{order.total}</p>
                      <p className={`text-[11px] font-medium ${
                        order.paymentStatus === "completed" ? "text-veg" : order.paymentStatus === "failed" ? "text-red-500" : "text-amber-500"
                      }`}>
                        {order.paymentStatus === "completed" ? "Paid" : order.paymentStatus === "failed" ? "Failed" : "Pending"}
                      </p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-border/50 bg-cream/10">
                  <div className="p-4 sm:p-5 space-y-5">
                    {/* Customer Info + Payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl border border-border/30 p-4">
                        <h4 className="text-[11px] font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          Customer Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-muted shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                            <a href={`tel:${order.customerPhone}`} className="text-brand hover:underline font-medium">
                              {order.customerPhone}
                            </a>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                            <span className="text-muted truncate">{order.customerEmail}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="text-muted">{order.customerAddress}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-border/30 p-4">
                        <h4 className="text-[11px] font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                          </svg>
                          Payment Summary
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted">Payment</span>
                            <span className={`font-semibold ${
                              order.paymentStatus === "completed" ? "text-veg" : order.paymentStatus === "failed" ? "text-red-500" : "text-amber-500"
                            }`}>
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </span>
                          </div>
                          <div className="h-px bg-border/50" />
                          <div className="flex justify-between text-sm">
                            <span className="text-muted">Items ({order.items.length})</span>
                            <span className="font-medium">
                              ₹{order.items.reduce((s, i) => s + i.price * i.quantity, 0)}
                            </span>
                          </div>
                          <div className="h-px bg-border/50" />
                          <div className="flex justify-between text-base font-bold">
                            <span>Total</span>
                            <span className="text-brand">₹{order.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl border border-border/30 p-4">
                      <h4 className="text-[11px] font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        Items Ordered
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-cream/20">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-brand/5 flex items-center justify-center text-[10px] font-bold text-brand shrink-0">
                                {item.quantity}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                {item.size && <p className="text-xs text-muted">{item.size}</p>}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-foreground shrink-0 ml-3">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="bg-white rounded-xl border border-border/30 p-4">
                      <h4 className="text-[11px] font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                        </svg>
                        Update Order Status
                      </h4>
                      <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                        {(["placed", "preparing", "ready", "delivered", "cancelled"] as const).map((status) => {
                          const sc = statusConfig[status];
                          const isActive = order.orderStatus === status;
                          return (
                            <button
                              key={status}
                              onClick={() => updateOrderStatus(order._id, status)}
                              disabled={isActive}
                              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all capitalize ${
                                isActive
                                  ? `${sc.bg} ${sc.color} cursor-default`
                                  : "bg-white border border-border text-muted hover:border-brand/30 hover:text-brand hover:bg-brand/5"
                              } disabled:cursor-not-allowed`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? sc.dot : "bg-muted/30"}`} />
                              {sc.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
