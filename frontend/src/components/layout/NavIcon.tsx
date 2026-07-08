import { NavSection } from "@/lib/nav";

const PATHS: Record<NavSection["icon"], string> = {
  person: "M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z",
  heart: "M12 21s-7.5-4.6-10-9.3C.4 8.1 2 4.5 5.6 4c2-.3 3.9.7 5 2.3 1.1-1.6 3-2.6 5-2.3 3.6.5 5.2 4.1 3.6 7.7C19.5 16.4 12 21 12 21z",
  doc: "M6 2h9l5 5v15H6V2zm8 1.5V8h4.5L14 3.5zM8 12h8v1.5H8V12zm0 3.5h8V17H8v-1.5z",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20zm.75 5v5.4l4.25 2.53-.75 1.23-5-3V7h1.5z",
  calendar: "M7 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zM5 9h14v11H5V9z",
  building: "M4 22V4h9v4h7v14h-7v-4h-2v4H4zm2-2h2v-2H6v2zm0-4h2v-2H6v2zm0-4h2V8H6v4zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V8h-2v4zm5 8h5V10h-5v10z",
};

export function NavIcon({ icon, className }: { icon: NavSection["icon"]; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={PATHS[icon]} />
    </svg>
  );
}
