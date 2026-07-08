const LABELS: Record<string, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "반려",
  REQUESTED: "요청",
  ISSUED: "발급완료",
};

const STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  REQUESTED: "bg-slate-100 text-slate-600",
  ISSUED: "bg-blue-100 text-blue-700",
};

export function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-slate-400">-</span>;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${STYLES[status] ?? "bg-slate-100 text-slate-600"}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
