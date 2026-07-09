"use client";

import { ReactNode } from "react";

export function Modal({
  title,
  subtitle,
  headerExtra,
  onClose,
  children,
  widthClassName = "max-w-md",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  headerExtra?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  widthClassName?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full ${widthClassName} max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg`}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {headerExtra}
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="닫기">
              ✕
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
