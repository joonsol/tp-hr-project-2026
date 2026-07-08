"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { deleteEventSupport, searchEventSupports } from "@/lib/api/eventSupports";
import { EventSupport } from "@/lib/types/eventSupport";
import { Page } from "@/lib/types/employee";
import { Button, Card, Input, Select } from "@/components/ui";
import { StatusBadge } from "@/components/StatusBadge";

const PAGE_SIZE = 10;

interface Filters {
  keyword: string;
  approvalStatus: string;
}

const EMPTY_FILTERS: Filters = { keyword: "", approvalStatus: "" };

export default function EventSupportsPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Page<EventSupport> | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    searchEventSupports({
      keyword: appliedFilters.keyword || undefined,
      approvalStatus: appliedFilters.approvalStatus || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then(setData)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [appliedFilters, page]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setPage(0);
    setAppliedFilters(filters);
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(0);
  }

  async function handleDelete(id: number) {
    if (!confirm("이 신청 내역을 삭제하시겠습니까?")) return;
    await deleteEventSupport(id);
    load();
  }

  const totalPages = data?.totalPages ?? 0;

  return (
    <div>
      <div className="mb-4 text-sm text-slate-500">인사관리 &gt; 경조비관리 &gt; 경조비신청</div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">경조비신청</h1>
          <p className="mt-1 text-sm text-slate-500">직원의 경조사비 신청 내역을 등록하고 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            PDF 다운로드
          </Button>
          <Link href="/event-supports/new">
            <Button>신청등록</Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6 p-4">
        <div className="mb-3 text-sm font-medium text-slate-600">검색조건</div>
        <form onSubmit={handleSearch} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">사원검색</label>
            <Input
              placeholder="사원번호 또는 성명"
              value={filters.keyword}
              onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">승인상태</label>
            <Select
              value={filters.approvalStatus}
              onChange={(e) => setFilters((f) => ({ ...f, approvalStatus: e.target.value }))}
            >
              <option value="">전체</option>
              <option value="PENDING">대기</option>
              <option value="APPROVED">승인</option>
              <option value="REJECTED">반려</option>
            </Select>
          </div>
          <div className="col-span-2 flex items-end gap-2 sm:col-span-2 sm:justify-end">
            <Button type="submit">조회</Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="text-sm font-medium text-slate-700">신청 내역</span>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            총 {data?.totalElements ?? 0}건
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">NO</th>
              <th className="px-4 py-2">신청번호</th>
              <th className="px-4 py-2">사원번호</th>
              <th className="px-4 py-2">성명</th>
              <th className="px-4 py-2">경조유형</th>
              <th className="px-4 py-2">대상자</th>
              <th className="px-4 py-2">경조일</th>
              <th className="px-4 py-2">신청금액</th>
              <th className="px-4 py-2">승인상태</th>
              <th className="px-4 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={10}>
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && data?.content.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={10}>
                  조건에 맞는 신청 내역이 없습니다.
                </td>
              </tr>
            )}
            {data?.content.map((e, index) => (
              <tr key={e.employeeEventSupportId} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-500">{page * PAGE_SIZE + index + 1}</td>
                <td className="px-4 py-2">{e.applicationNo}</td>
                <td className="px-4 py-2">{e.employeeNo}</td>
                <td className="px-4 py-2 font-medium">{e.employeeName}</td>
                <td className="px-4 py-2">{e.eventType ?? "-"}</td>
                <td className="px-4 py-2">{e.targetName ?? "-"}</td>
                <td className="px-4 py-2">{e.eventDate ?? "-"}</td>
                <td className="px-4 py-2">{e.requestedAmount != null ? e.requestedAmount.toLocaleString() : "-"}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={e.approvalStatus} />
                </td>
                <td className="px-4 py-2 space-x-1">
                  <Link href={`/event-supports/${e.employeeEventSupportId}/edit`}>
                    <Button variant="secondary">수정</Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleDelete(e.employeeEventSupportId)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-slate-500">총 {data?.totalElements ?? 0}건</span>
        {totalPages > 1 && (
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-md text-sm font-medium ${
                  p === page ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {p + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
