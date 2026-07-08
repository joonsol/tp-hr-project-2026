export interface Department {
  departmentId: number;
  departmentName: string;
  parentDepartmentId: number | null;
}

export interface DepartmentTreeNode {
  departmentId: number;
  departmentName: string;
  children: DepartmentTreeNode[];
}

export interface DepartmentRequest {
  departmentName: string;
  parentDepartmentId: number | null;
}
