import type { Metadata } from 'next';
import NexoraEnterpriseOS from '@/components/nexora/NexoraEnterpriseOS';

export const metadata: Metadata = {
  title: 'NEXORA — Enterprise Autonomy OS',
  description:
    'Premium interactive enterprise AI operations demo by SoftwarePar with workflow orchestration, autonomous agents, human approvals, runtime telemetry and governance.',
};

export default function NexoraPage() {
  return <NexoraEnterpriseOS />;
}
