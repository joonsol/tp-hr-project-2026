"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getActiveTab } from "@/lib/nav";
import { NavIcon } from "@/components/layout/NavIcon";

export function Sidebar() {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  if (activeTab.sidebar.length === 0) {
    return <aside className="w-56 shrink-0 border-r border-slate-200 bg-white" />;
  }

  return (
    <aside className="w-56 shrink-0 space-y-4 overflow-y-auto border-r border-slate-200 bg-white py-4">
      {activeTab.sidebar.map((section) => (
        <div key={section.label} className="px-3">
          <div className="mb-1 flex items-center gap-2 px-2 py-1 text-sm font-semibold text-slate-500">
            <NavIcon icon={section.icon} className="h-4 w-4" />
            {section.label}
          </div>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-1.5 text-sm ${
                    active ? "bg-slate-900 font-medium text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
