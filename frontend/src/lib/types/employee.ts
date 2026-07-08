export interface Employee {
  employeeId: number;
  employeeNo: string;
  departmentId: number | null;
  departmentName: string | null;
  positionId: number | null;
  positionName: string | null;
  employmentTypeId: number | null;
  employmentTypeName: string | null;
  name: string;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  hireDate: string | null;
  resignationDate: string | null;
  employeeStatusCode: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSummary {
  employeeId: number;
  employeeNo: string;
  name: string;
  departmentName: string | null;
  positionName: string | null;
  email: string | null;
}

export interface EmployeeCreateRequest {
  employeeNo: string;
  departmentId: number | null;
  positionId: number | null;
  employmentTypeId: number | null;
  name: string;
  birthDate: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  hireDate: string | null;
  employeeStatusCode: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  password: string;
}

export type EmployeeUpdateRequest = Omit<EmployeeCreateRequest, "employeeNo" | "password"> & {
  resignationDate: string | null;
};

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
