export interface EventSupport {
  employeeEventSupportId: number;
  applicationNo: string;
  employeeId: number;
  employeeNo: string;
  employeeName: string;
  eventType: string | null;
  familyRelation: string | null;
  targetName: string | null;
  applicationDate: string | null;
  eventDate: string | null;
  requestedAmount: number | null;
  eventLocation: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  approvalStatus: string;
  memo: string | null;
}

export interface EventSupportRequest {
  employeeId: number;
  eventType: string | null;
  familyRelation: string | null;
  targetName: string | null;
  applicationDate: string | null;
  eventDate: string | null;
  requestedAmount: number | null;
  eventLocation: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  approvalStatus: string | null;
  memo: string | null;
}
