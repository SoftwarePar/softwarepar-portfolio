import type { Metadata } from 'next';
import NexoraV8 from '@/components/nexora/NexoraV8';

export const metadata: Metadata = {
  title: 'NEXORA V8 — Enterprise Autonomy OS',
  description:
    'Premium interactive enterprise AI operating system demo by SoftwarePar with draggable workflows, autonomous agents, human authority, runtime telemetry, economics, integrations and auditability.',
};

export default function NexoraPage() {
  return <NexoraV8 />;
}
