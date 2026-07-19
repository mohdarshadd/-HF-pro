"use client";

import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  activeTab: "menu" | "orders";
  onTabChange: (tab: "menu" | "orders") => void;
  menuCount?: number;
  orderCount?: number;
}

export default function AdminHeader({
  activeTab,
  onTabChange,
  menuCount = 0,
  orderCount = 0,
}: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin-token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  return (
    <div className="bg-white border-b border-border sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.png" alt="Hello Food" className="h-7 sm:h-9 w-auto" />
            <span className="text-sm font-semibold text-muted hidden sm:block">
              Admin Panel
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              className="text-xs text-muted hover:text-foreground border border-border px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-cream/50 transition-all hidden sm:flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-brand border border-border px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:border-brand/20 hover:bg-brand/5 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex gap-0.5 sm:gap-1 -mb-px overflow-x-auto hide-scrollbar">
          <button
            onClick={() => onTabChange("orders")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === "orders"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-foreground hover:border-border"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            Orders
            <span className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full shrink-0 ${
              activeTab === "orders" ? "bg-brand/10 text-brand" : "bg-cream text-muted"
            }`}>
              {orderCount}
            </span>
          </button>
          <button
            onClick={() => onTabChange("menu")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === "menu"
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-foreground hover:border-border"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Menu
            <span className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full shrink-0 ${
              activeTab === "menu" ? "bg-brand/10 text-brand" : "bg-cream text-muted"
            }`}>
              {menuCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
