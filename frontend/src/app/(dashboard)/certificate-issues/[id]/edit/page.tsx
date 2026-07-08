import { CertificateIssueEdit } from "@/components/certificateissues/CertificateIssueEdit";

export default async function CertificateIssueEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CertificateIssueEdit certificateIssueId={Number(id)} />;
}
