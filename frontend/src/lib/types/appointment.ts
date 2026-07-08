export interface Appointment {
  employeeAppointmentId: number;
  appointmentNo: string;
  employeeId: number;
  employeeNo: string;
  employeeName: string;
  appointmentType: string | null;
  appointmentDate: string | null;
  fromDepartmentId: number | null;
  fromDepartmentName: string | null;
  toDepartmentId: number | null;
  toDepartmentName: string | null;
  fromPositionName: string | null;
  toPositionName: string | null;
  reason: string | null;
  memo: string | null;
  registeredBy: string | null;
  createdAt: string;
}

export interface AppointmentRequest {
  employeeId: number;
  appointmentType: string | null;
  appointmentDate: string | null;
  fromDepartmentId: number | null;
  toDepartmentId: number | null;
  fromPositionName: string | null;
  toPositionName: string | null;
  reason: string | null;
  memo: string | null;
}
