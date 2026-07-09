export interface NavItem {
  label: string;
  href: string;
  placeholder?: boolean;
}

export interface NavSection {
  icon: "person" | "heart" | "doc" | "clock" | "calendar" | "building";
  label: string;
  items: NavItem[];
}

export interface TopTab {
  key: string;
  label: string;
  homeHref: string;
  matches: (pathname: string) => boolean;
  sidebar: NavSection[];
}

export const TOP_TABS: TopTab[] = [
  {
    key: "hr",
    label: "인사관리",
    homeHref: "/employees",
    matches: (p) =>
      p.startsWith("/employees") ||
      p.startsWith("/appointments") ||
      p.startsWith("/event-supports") ||
      p.startsWith("/certificate-issues") ||
      p.startsWith("/departments") ||
      p.startsWith("/positions") ||
      p.startsWith("/dashboard"),
    sidebar: [
      {
        icon: "person",
        label: "인사정보",
        items: [
          { label: "인사정보등록", href: "/employees" },
          { label: "인사발령등록", href: "/appointments" },
        ],
      },
      {
        icon: "heart",
        label: "경조비관리",
        items: [{ label: "경조비신청", href: "/event-supports" }],
      },
      {
        icon: "doc",
        label: "증명서관리",
        items: [{ label: "증명서발급", href: "/certificate-issues" }],
      },
      {
        icon: "building",
        label: "기준정보관리",
        items: [
          { label: "부서관리", href: "/departments" },
          { label: "직책관리", href: "/positions" },
        ],
      },
    ],
  },
  {
    key: "attendance",
    label: "근태관리",
    homeHref: "/attendance",
    matches: (p) => p.startsWith("/attendance") || p.startsWith("/leave"),
    sidebar: [
      {
        icon: "clock",
        label: "근태관리",
        items: [
          { label: "일일근태등록", href: "/attendance" },
          { label: "월근태현황", href: "/attendance/monthly" },
        ],
      },
      {
        icon: "calendar",
        label: "휴가관리",
        items: [
          { label: "휴가일수설정", href: "/leave/settings", placeholder: true },
          { label: "휴가일수계산", href: "/leave/calculate", placeholder: true },
          { label: "휴가일수신청", href: "/leave/requests", placeholder: true },
          { label: "휴가사용현황", href: "/leave/usage", placeholder: true },
        ],
      },
    ],
  },
  {
    key: "payroll",
    label: "급여관리",
    homeHref: "/payroll",
    matches: (p) => p.startsWith("/payroll"),
    sidebar: [
      {
        icon: "doc",
        label: "급여관리",
        items: [
          { label: "급여기본정보관리", href: "/payroll" },
          { label: "급여지급", href: "/payroll/payment", placeholder: true },
          { label: "기본수당외수당관리", href: "/payroll/allowances", placeholder: true },
          { label: "급여계산", href: "/payroll/calculate", placeholder: true },
          { label: "급여조회", href: "/payroll/inquiry", placeholder: true },
        ],
      },
    ],
  },
  {
    key: "daily",
    label: "일용직관리",
    homeHref: "/daily-workers",
    matches: (p) => p.startsWith("/daily-workers"),
    sidebar: [],
  },
];

export function getActiveTab(pathname: string): TopTab {
  return TOP_TABS.find((tab) => tab.matches(pathname)) ?? TOP_TABS[0];
}
