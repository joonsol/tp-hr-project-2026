"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPosition, deletePosition, listPositions, updatePosition } from "@/lib/api/positions";
import { Position } from "@/lib/types/position";
import { ApiError } from "@/lib/api/client";
import { Button, Card, ErrorText, Field, Input, PageHeader } from "@/components/ui";
import { Modal } from "@/components/Modal";

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Position | null>(null);
  const [showForm, setShowForm] = useState(false);

  function load() {
    listPositions()
      .then(setPositions)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(position: Position) {
    setEditing(position);
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("이 직책을 삭제하시겠습니까?")) return;
    await deletePosition(id);
    load();
  }

  return (
    <div>
      <PageHeader title="직책 관리" actions={<Button onClick={openCreate}>직책 추가</Button>} />
      <Card>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">직책명</th>
              <th className="px-4 py-2">레벨</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={3}>
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && positions.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={3}>
                  등록된 직책이 없습니다.
                </td>
              </tr>
            )}
            {positions.map((position) => (
              <tr key={position.positionId} className="border-b border-slate-100">
                <td className="px-4 py-2">{position.positionName}</td>
                <td className="px-4 py-2">{position.level ?? "-"}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="secondary" onClick={() => openEdit(position)}>
                    수정
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(position.positionId)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showForm && (
        <PositionFormModal
          position={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function PositionFormModal({
  position,
  onClose,
  onSaved,
}: {
  position: Position | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [positionName, setPositionName] = useState(position?.positionName ?? "");
  const [level, setLevel] = useState(position?.level?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = { positionName, level: level ? Number(level) : null };
      if (position) {
        await updatePosition(position.positionId, payload);
      } else {
        await createPosition(payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={position ? "직책 수정" : "직책 추가"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="직책명">
          <Input value={positionName} onChange={(e) => setPositionName(e.target.value)} required />
        </Field>
        <Field label="레벨">
          <Input type="number" value={level} onChange={(e) => setLevel(e.target.value)} />
        </Field>
        <ErrorText>{error}</ErrorText>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" disabled={submitting}>
            저장
          </Button>
        </div>
      </form>
    </Modal>
  );
}
