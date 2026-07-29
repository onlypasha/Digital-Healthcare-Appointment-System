import { DoctorExaminationForm } from '@/components/doctor/DoctorExaminationForm';

export default async function DoctorExaminationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DoctorExaminationForm appointmentId={id} />;
}
