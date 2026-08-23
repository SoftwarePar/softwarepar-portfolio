import type { Metadata } from 'next';
import NexoraV9 from '@/components/nexora/NexoraV9';

export const metadata: Metadata = {
  title: 'NEXORA V9 — AI Autonomy OS',
  description:
    'High-fidelity enterprise AI autonomy operating system demo by SoftwarePar with mission control, agent orchestration, workflows, governance, economics, integrations and realtime operations.',
};

export default function NexoraPage() {
  return <NexoraV9 />;
}
