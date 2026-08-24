import type { Metadata } from 'next';
import NexoraV12 from '@/components/nexora/NexoraV12';
import NexoraInteractionLayer from '@/components/nexora/NexoraInteractionLayer';
import NexoraOperationalLayer from '@/components/nexora/NexoraOperationalLayer';

export const metadata: Metadata = {
  title: 'NEXORA V12 — Enterprise AI Command Center',
  description: 'High-fidelity enterprise AI autonomy command center by SoftwarePar.',
};

export default function NexoraPage() {
  return (
    <>
      <NexoraV12 />
      <NexoraInteractionLayer />
      <NexoraOperationalLayer />
    </>
  );
}
