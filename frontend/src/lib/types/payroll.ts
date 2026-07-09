export interface PayrollCandidate {
  employeeId: number;
  employeeNo: string;
  name: string;
  departmentName: string | null;
  positionName: string | null;
  hireDate: string | null;
  registered: boolean;
}

export interface PayrollRow {
  employeeId: number;
  employeeNo: string;
  name: string;
  departmentName: string | null;
  positionName: string | null;
  baseSalary: number;
  mealAllowance: number;
  transportAllowance: number;
  positionAllowance: number;
  allowanceTotal: number;
  pension: number;
  healthInsurance: number;
  employmentInsurance: number;
  incomeTax: number;
  deductionTotal: number;
  totalPayment: number;
  netPay: number;
  bankName: string | null;
  accountNumber: string | null;
  effectiveDate: string;
}

export interface PayrollSummary {
  averageBaseSalary: number;
  maxBaseSalary: number;
  maxBaseSalaryEmployeeName: string | null;
  maxBaseSalaryPositionName: string | null;
  totalLaborCost: number;
  totalAllowance: number;
  registeredCount: number;
  unregisteredCount: number;
  totalCount: number;
  rows: PayrollRow[];
}

export interface PayrollBulkUpsertRequest {
  employeeIds: number[];
  baseSalary: number;
  positionAllowance: number;
  mealAllowance: number;
  transportAllowance: number;
  paymentMethodCode: string;
  paymentDay: number;
  effectiveDate: string;
}

export const PAYMENT_METHODS: { code: string; label: string }[] = [
  { code: "BANK_TRANSFER", label: "계좌이체" },
  { code: "CASH", label: "현금" },
];

export function paymentMethodLabel(code: string): string {
  return PAYMENT_METHODS.find((m) => m.code === code)?.label ?? code;
}
