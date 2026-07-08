import { Card } from "@/components/ui";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">{title}</h1>
      <Card className="flex h-64 items-center justify-center text-slate-400">준비 중입니다.</Card>
    </div>
  );
}
