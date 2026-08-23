import type { Metadata } from 'next';
import NexoraV11 from '@/components/nexora/NexoraV11';

export const metadata: Metadata = {
  title: 'NEXORA V11 — Enterprise AI Command Center',
  description:
    'Reference-grade enterprise AI autonomy command center by SoftwarePar with live missions, agents, governance, system maps, runtime telemetry and business value intelligence.',
};

export default function NexoraPage() {
  return <NexoraV11 />;
}
