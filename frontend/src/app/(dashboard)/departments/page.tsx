"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createDepartment,
  deleteDepartment,
  getDepartmentTree,
  listDepartments,
  updateDepartment,
} from "@/lib/api/departments";
import { Department, DepartmentTreeNode } from "@/lib/types/department";
import { ApiError } from "@/lib/api/client";
import { Button, Card, ErrorText, Field, Input, PageHeader, Select } from "@/components/ui";
import { Modal } from "@/components/Modal";

export default function DepartmentsPage() {
  const [tree, setTree] = useState<DepartmentTreeNode[]>([]);
  const [flat, setFlat] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Department | null>(null);
  const [showForm, setShowForm] = useState(false);

  function load() {
    Promise.all([getDepartmentTree(), listDepartments()])
      .then(([treeData, flatData]) => {
        setTree(treeData);
        setFlat(flatData);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(department: Department) {
    setEditing(department);
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("이 부서를 삭제하시겠습니까?")) return;
    await deleteDepartment(id);
    load();
  }

  return (
    <div>
      <PageHeader title="부서 관리" actions={<Button onClick={openCreate}>부서 추가</Button>} />
      <Card className="p-4">
        {loading && <p className="text-slate-400">불러오는 중...</p>}
        {!loading && tree.length === 0 && <p className="text-slate-400">등록된 부서가 없습니다.</p>}
        <ul className="space-y-1">
          {tree.map((node) => (
            <DepartmentNode
              key={node.departmentId}
              node={node}
              depth={0}
              flat={flat}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      </Card>

      {showForm && (
        <DepartmentFormModal
          department={editing}
          departments={flat}
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

function DepartmentNode({
  node,
  depth,
  flat,
  onEdit,
  onDelete,
}: {
  node: DepartmentTreeNode;
  depth: number;
  flat: Department[];
  onEdit: (department: Department) => void;
  onDelete: (id: number) => void;
}) {
  const department = flat.find((d) => d.departmentId === node.departmentId);

  return (
    <li>
      <div
        className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-slate-50"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        <span className="text-sm text-slate-800">{node.departmentName}</span>
        <div className="space-x-2">
          <Button variant="secondary" onClick={() => department && onEdit(department)}>
            수정
          </Button>
          <Button variant="danger" onClick={() => onDelete(node.departmentId)}>
            삭제
          </Button>
        </div>
      </div>
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <DepartmentNode key={child.departmentId} node={child} depth={depth + 1} flat={flat} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </li>
  );
}

function DepartmentFormModal({
  department,
  departments,
  onClose,
  onSaved,
}: {
  department: Department | null;
  departments: Department[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [departmentName, setDepartmentName] = useState(department?.departmentName ?? "");
  const [parentDepartmentId, setParentDepartmentId] = useState(
    department?.parentDepartmentId?.toString() ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        departmentName,
        parentDepartmentId: parentDepartmentId ? Number(parentDepartmentId) : null,
      };
      if (department) {
        await updateDepartment(department.departmentId, payload);
      } else {
        await createDepartment(payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={department ? "부서 수정" : "부서 추가"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="부서명">
          <Input value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} required />
        </Field>
        <Field label="상위 부서">
          <Select value={parentDepartmentId} onChange={(e) => setParentDepartmentId(e.target.value)}>
            <option value="">없음 (최상위 부서)</option>
            {departments
              .filter((d) => !department || d.departmentId !== department.departmentId)
              .map((d) => (
                <option key={d.departmentId} value={d.departmentId}>
                  {d.departmentName}
                </option>
              ))}
          </Select>
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
