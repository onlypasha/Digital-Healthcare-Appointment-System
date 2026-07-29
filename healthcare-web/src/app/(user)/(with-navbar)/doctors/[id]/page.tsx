import { DoctorDetail } from '@/components/user/DoctorDetail';

export default async function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DoctorDetail doctorId={id} />;
}
