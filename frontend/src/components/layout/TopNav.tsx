"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getActiveTab, TOP_TABS } from "@/lib/nav";
import { useAuth } from "@/lib/auth/AuthContext";

export function TopNav() {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="flex h-14 items-stretch bg-slate-900 text-white">
      <Link href="/dashboard" className="flex items-center gap-2 px-5 font-semibold">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10">🏢</span>
        인사관리시스템
      </Link>
      <nav className="flex items-stretch">
        {TOP_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.homeHref}
            className={`flex items-center px-5 text-sm font-medium ${
              tab.key === activeTab.key ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-4 px-5">
        <button aria-label="알림" className="text-slate-300 hover:text-white">
          🔔
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold">
            {user?.name?.slice(0, 1) ?? "?"}
          </span>
          <span className="text-sm">{user?.name}</span>
        </div>
        <button aria-label="로그아웃" onClick={handleLogout} className="text-slate-300 hover:text-white">
          ⏻
        </button>
      </div>
    </header>
  );
}
