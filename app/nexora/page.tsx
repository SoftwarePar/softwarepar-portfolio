import type { Metadata } from 'next';
import NexoraApp from '@/components/nexora/NexoraApp';

export const metadata: Metadata = {
  title: 'NEXORA AI OPS — Autonomous Operations Console',
  description:
    'Interactive enterprise AI operations demo by SoftwarePar: agents, automations, intelligence and live operational telemetry.',
};

export default function NexoraPage() {
  return <NexoraApp />;
}
