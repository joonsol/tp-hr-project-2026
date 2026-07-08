import { EmployeeEdit } from "@/components/employees/EmployeeEdit";

export default async function EmployeeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EmployeeEdit employeeId={Number(id)} />;
}
