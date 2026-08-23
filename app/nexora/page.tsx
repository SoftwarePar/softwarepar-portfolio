import type { Metadata } from 'next';
import NexoraPremiumOS from '@/components/nexora/NexoraPremiumOS';

export const metadata: Metadata = {
  title: 'NEXORA — Enterprise Autonomy OS',
  description:
    'Premium interactive enterprise AI operations demo by SoftwarePar with workflow orchestration, autonomous agents, human approvals, runtime telemetry, economics and governance.',
};

export default function NexoraPage() {
  return <NexoraPremiumOS />;
}
