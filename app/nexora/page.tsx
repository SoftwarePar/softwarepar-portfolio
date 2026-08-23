import type { Metadata } from 'next';
import NexoraV10 from '@/components/nexora/NexoraV10';

export const metadata: Metadata = {
  title: 'NEXORA V10 — AI Autonomy OS',
  description:
    'High-fidelity enterprise AI autonomy operating system demo by SoftwarePar with mission flow, agents, governance, economics, integrations and realtime operations.',
};

export default function NexoraPage() {
  return <NexoraV10 />;
}
