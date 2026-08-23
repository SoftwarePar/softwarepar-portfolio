import type { Metadata } from 'next';
import NexoraMissionControl from '@/components/nexora/NexoraMissionControl';

export const metadata: Metadata = {
  title: 'NEXORA AI OPS — Autonomous Operations Mission Control',
  description:
    'Premium interactive enterprise AI operations demo by SoftwarePar with agent orchestration, workflow simulation, human approval, governance and runtime telemetry.',
};

export default function NexoraPage() {
  return <NexoraMissionControl />;
}
