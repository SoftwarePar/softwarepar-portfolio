'use client';

import {
  Activity, AlertTriangle, ArrowRight, Bell, Bot, BrainCircuit, Check, CheckCircle2,
  ChevronRight, CircleDot, Command, Cpu, Database, Gauge, GitBranch, Layers3, LockKeyhole,
  Menu, Network, Pause, Play, Plus, Radio, Search, Settings, ShieldCheck, Sparkles,
  TerminalSquare, Users, Waypoints, Workflow, X, Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type View = 'mission' | 'studio' | 'agents' | 'runtime' | 'approvals' | 'governance';
type AgentStatus = 'running' | 'idle' | 'review';
type NodeState = 'complete' | 'running' | 'waiting' | 'blocked';

type Agent = {
  id: string;
  name: string;
  role: string;
  model: string;
  status: AgentStatus;
  confidence: number;
  tasks: number;
  zone: string;
};

type FlowNode = {
  id: string;
  title: string;
  subtitle: string;
  state: NodeState;
  x: number;
  y: number;
  agent: string;
};

type Approval = {
  id: string;
  title: string;
  reason: string;
  agent: string;
  impact: string;
  risk: 'medium' | 'high';
};

const nav: { id: View; label: string; icon: typeof Activity }[] = [
  { id: 'mission', label: 'Mission Control', icon: Network },
  { id: 'studio', label: 'Workflow Studio', icon: Workflow },
  { id: 'agents', label: 'Agent Registry', icon: Bot },
  { id: 'runtime', label: 'Runtime', icon: TerminalSquare },
  { id: 'approvals', label: 'Human Review', icon: ShieldCheck },
  { id: 'governance', label: 'Governance', icon: LockKeyhole },
];

const seedAgents: Agent[] = [
  { id: 'AG-01', name: 'Atlas', role: 'Operations Orchestrator', model: 'NXR-4', status: 'running', confidence: 98, tasks: 19, zone: 'Global Ops' },
  { id: 'AG-02', name: 'Nova', role: 'Revenue Intelligence', model: 'NXR-4', status: 'running', confidence: 96, tasks: 12, zone: 'Revenue' },
  { id: 'AG-03', name: 'Sable', role: 'Risk & Compliance', model: 'NXR-3', status: 'review', confidence: 91, tasks: 7, zone: 'Governance' },
  { id: 'AG-04', name: 'Echo', role: 'Signal Analyst', model: 'NXR-3', status: 'idle', confidence: 99, tasks: 3, zone: 'Customer' },
  { id: 'AG-05', name: 'Vector', role: 'Data Quality Guardian', model: 'NXR-4', status: 'running', confidence: 97, tasks: 15, zone: 'Data' },
];

const baseNodes: FlowNode[] = [
  { id: 'n1', title: 'Signal Intake', subtitle: 'CRM + product telemetry', state: 'complete', x: 8, y: 20, agent: 'Echo' },
  { id: 'n2', title: 'Intent Scoring', subtitle: 'Revenue opportunity model', state: 'complete', x: 31, y: 20, agent: 'Nova' },
  { id: 'n3', title: 'Risk Gate', subtitle: 'Policy + compliance check', state: 'running', x: 54, y: 20, agent: 'Sable' },
  { id: 'n4', title: 'Human Review', subtitle: 'Approval required', state: 'waiting', x: 54, y: 62, agent: 'Operator' },
  { id: 'n5', title: 'Execution', subtitle: 'Route + update systems', state: 'waiting', x: 77, y: 20, agent: 'Atlas' },
];

const seedApprovals: Approval[] = [
  { id: 'RV-204', title: 'APAC routing exception', reason: 'Customer signal conflicts with regional policy threshold.', agent: 'Sable', impact: '$84k pipeline', risk: 'high' },
  { id: 'RV-198', title: 'Enterprise discount guardrail', reason: 'Requested price override exceeds autonomous authority by 7%.', agent: 'Nova', impact: '$31k ARR', risk: 'medium' },
];

const classNames = (...items: Array<string | false | undefined>) => items.filter(Boolean).join(' ');

function Surface({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={classNames('rounded-[26px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(15,18,24,.94),rgba(7,9,13,.96))] shadow-[0_30px_100px_rgba(0,0,0,.32)] backdrop-blur-xl', className)}>{children}</section>;
}

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'green' | 'cyan' | 'amber' | 'red' }) {
  const tones = {
    neutral: 'border-white/[0.08] bg-white/[0.03] text-zinc-400',
    green: 'border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300',
    cyan: 'border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-200',
    amber: 'border-amber-300/20 bg-amber-300/[0.08] text-amber-200',
    red: 'border-rose-400/20 bg-rose-400/[0.08] text-rose-300',
  };
  return <span className={classNames('inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[.14em]', tones[tone])}>{children}</span>;
}

function Metric({ label, value, detail, bars }: { label: string; value: string; detail: string; bars: number[] }) {
  return <Surface className="group relative overflow-hidden p-5 transition duration-500 hover:-translate-y-1 hover:border-cyan-300/20">
    <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent opacity-0 transition group-hover:opacity-100" />
    <p className="text-[10px] uppercase tracking-[.2em] text-zinc-600">{label}</p>
    <div className="mt-6 flex items-end justify-between gap-4"><p className="text-3xl font-medium tracking-[-.055em] sm:text-4xl">{value}</p><span className="text-[10px] text-cyan-300">{detail}</span></div>
    <div className="mt-5 flex h-8 items-end gap-1">{bars.map((h, i) => <motion.span key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * .035, duration: .45 }} className="flex-1 rounded-sm bg-gradient-to-t from-cyan-300/10 to-cyan-300/75" />)}</div>
  </Surface>;
}

function NodeCard({ node, active, onClick }: { node: FlowNode; active: boolean; onClick: () => void }) {
  const dot = node.state === 'complete' ? 'bg-emerald-300' : node.state === 'running' ? 'bg-cyan-300' : node.state === 'blocked' ? 'bg-rose-300' : 'bg-zinc-600';
  return <button onClick={onClick} style={{ left: `${node.x}%`, top: `${node.y}%` }} className={classNames('absolute w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-4 text-left transition duration-300', active ? 'border-cyan-300/40 bg-cyan-300/[0.09] shadow-[0_0_50px_rgba(103,232,249,.12)]' : 'border-white/[0.1] bg-[#0c1015]/95 hover:border-white/[0.2]')}>
    <div className="flex items-center justify-between"><span className={classNames('size-2 rounded-full', dot, node.state === 'running' && 'animate-pulse')} /><span className="text-[9px] uppercase tracking-[.16em] text-zinc-600">{node.agent}</span></div>
    <p className="mt-4 text-sm font-medium">{node.title}</p><p className="mt-1 text-[11px] leading-5 text-zinc-600">{node.subtitle}</p>
  </button>;
}

export default function NexoraMissionControl() {
  const [view, setView] = useState<View>('mission');
  const [mobileNav, setMobileNav] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [agents, setAgents] = useState(seedAgents);
  const [nodes, setNodes] = useState(baseNodes);
  const [activeNode, setActiveNode] = useState('n3');
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '13:39:18  runtime  production mesh healthy',
    '13:39:22  atlas    14 priorities rebalanced',
    '13:39:26  nova     opportunity score updated → 92',
    '13:39:31  sable    policy review opened RV-204',
  ]);
  const [approvals, setApprovals] = useState(seedApprovals);
  const [toast, setToast] = useState('');
  const [strictMode, setStrictMode] = useState(true);
  const [humanGate, setHumanGate] = useState(true);
  const [auditLock, setAuditLock] = useState(true);
  const [search, setSearch] = useState('');

  const selectedNode = nodes.find((node) => node.id === activeNode) ?? nodes[0];
  const filteredAgents = useMemo(() => agents.filter((agent) => `${agent.name} ${agent.role} ${agent.zone}`.toLowerCase().includes(search.toLowerCase())), [agents, search]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setCommandOpen(true); }
      if (event.key === 'Escape') { setCommandOpen(false); setMobileNav(false); }
    };
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!running) return;
    const sequence = ['n1', 'n2', 'n3', 'n4']; let index = 0;
    setNodes(baseNodes.map((node) => ({ ...node, state: node.id === 'n1' ? 'running' : 'waiting' })));
    setLogs((prev) => [`${new Date().toLocaleTimeString()}  flow     execution started FLOW-72`, ...prev].slice(0, 12));
    const timer = window.setInterval(() => {
      const current = sequence[index];
      setNodes((prev) => prev.map((node) => node.id === current ? { ...node, state: 'complete' } : node.id === sequence[index + 1] ? { ...node, state: 'running' } : node));
      setActiveNode(sequence[Math.min(index + 1, sequence.length - 1)]);
      setLogs((prev) => [`${new Date().toLocaleTimeString()}  flow     ${current} completed`, ...prev].slice(0, 12));
      index += 1;
      if (index >= sequence.length) { window.clearInterval(timer); setRunning(false); setNodes((prev) => prev.map((node) => node.id === 'n5' ? { ...node, state: 'waiting' } : node)); setToast('Human approval required before execution'); }
    }, 1100);
    return () => window.clearInterval(timer);
  }, [running]);

  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2300); };
  const resolveApproval = (id: string, approve: boolean) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    if (approve) {
      setNodes((prev) => prev.map((node) => node.id === 'n4' ? { ...node, state: 'complete' } : node.id === 'n5' ? { ...node, state: 'running' } : node));
      setLogs((prev) => [`${new Date().toLocaleTimeString()}  human    ${id} approved · execution resumed`, ...prev].slice(0, 12));
      window.setTimeout(() => setNodes((prev) => prev.map((node) => node.id === 'n5' ? { ...node, state: 'complete' } : node)), 1100);
    }
    flash(approve ? 'Approval recorded and workflow resumed' : 'Request rejected and execution stopped');
  };

  const sectionTitle: Record<View, [string, string]> = {
    mission: ['Mission Control', 'Autonomous operations under human authority'],
    studio: ['Workflow Studio', 'Design, simulate and inspect agentic workflows'],
    agents: ['Agent Registry', 'Models, permissions, capacity and operational state'],
    runtime: ['Runtime', 'Execution telemetry, logs and infrastructure health'],
    approvals: ['Human Review', 'Decisions that exceed autonomous authority'],
    governance: ['Governance', 'Policy, auditability and control boundaries'],
  };

  return <main className="min-h-screen overflow-x-hidden bg-[#05070a] text-[#f5f7fa] selection:bg-cyan-300 selection:text-black">
    <div className="pointer-events-none fixed inset-0 opacity-[.2] [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:44px_44px]" />
    <div className="pointer-events-none fixed left-[18%] top-[-12%] h-[420px] w-[420px] rounded-full bg-cyan-300/[.035] blur-[120px]" />
    <div className="relative flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 border-r border-white/[0.07] bg-[#07090d]/90 px-4 py-5 backdrop-blur-2xl lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2"><div className="grid size-10 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[.07] text-cyan-200"><Waypoints size={19}/></div><div><p className="text-sm font-semibold tracking-[.17em]">NEXORA</p><p className="text-[9px] uppercase tracking-[.24em] text-zinc-600">Autonomy OS</p></div></div>
        <div className="mt-9 space-y-1">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setView(id)} className={classNames('group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition', view === id ? 'bg-white text-black shadow-[0_12px_35px_rgba(255,255,255,.08)]' : 'text-zinc-500 hover:bg-white/[.04] hover:text-zinc-200')}><Icon size={16}/><span>{label}</span>{id === 'approvals' && approvals.length > 0 && <span className="ml-auto rounded-full bg-amber-300 px-2 py-0.5 text-[9px] font-semibold text-black">{approvals.length}</span>}</button>)}</div>
        <Surface className="mt-auto p-4"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-zinc-400"><ShieldCheck size={14} className="text-emerald-300"/> Runtime trust</span><span className="text-xs text-emerald-300">99.2%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300"/></div><p className="mt-3 text-[9px] uppercase tracking-[.18em] text-zinc-700">SOC2 · audit lock · 3 regions</p></Surface>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-[#05070a]/80 px-4 backdrop-blur-2xl sm:px-6 xl:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="grid size-9 place-items-center rounded-xl border border-white/[0.08] lg:hidden"><Menu size={17}/></button><div><p className="text-[9px] uppercase tracking-[.22em] text-zinc-600">Production / Global mesh</p><p className="mt-1 text-sm">{sectionTitle[view][0]}</p></div></div>
          <div className="flex items-center gap-2"><button onClick={() => setCommandOpen(true)} className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-zinc-500 sm:flex"><Search size={14}/> Search <span className="rounded-md border border-white/[0.08] px-1.5 py-0.5 text-[9px]">⌘K</span></button><button className="relative grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.025]"><Bell size={15}/>{approvals.length > 0 && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-amber-300"/>}</button><div className="grid size-9 place-items-center rounded-xl bg-cyan-300 text-xs font-bold text-black">SP</div></div>
        </header>

        <div className="px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
          <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-7 xl:flex-row xl:items-end xl:justify-between"><div><div className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-cyan-300"><span className="size-1.5 animate-pulse rounded-full bg-cyan-300"/> Production live</div><h1 className="mt-3 text-4xl font-medium tracking-[-.055em] sm:text-5xl">{sectionTitle[view][0]}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">{sectionTitle[view][1]}</p></div><div className="flex gap-2"><button onClick={() => setCommandOpen(true)} className="rounded-xl border border-white/[.1] px-4 py-2.5 text-xs text-zinc-300">Command</button>{view === 'studio' && <button onClick={() => setRunning(true)} disabled={running} className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-semibold text-black disabled:opacity-50">{running ? <Pause size={14}/> : <Play size={14}/>} {running ? 'Running' : 'Run simulation'}</button>}</div></div>

          {view === 'mission' && <div className="mt-6 space-y-4"><div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4"><Metric label="Autonomous decisions" value="6,284" detail="+14.2%" bars={[35,44,51,49,62,73,68,82,76,89,92,96]}/><Metric label="Human intervention" value="0.27%" detail="-18.4%" bars={[88,82,76,71,63,58,51,47,39,35,31,26]}/><Metric label="Median latency" value="1.82s" detail="p95 4.6s" bars={[71,66,61,54,50,45,42,37,35,32,29,26]}/><Metric label="Runtime health" value="99.97%" detail="3 regions" bars={[91,93,92,95,94,97,98,97,99,98,99,100]}/></div><div className="grid gap-4 2xl:grid-cols-[1.45fr_.55fr]"><WorkflowCanvas nodes={nodes} activeNode={activeNode} setActiveNode={setActiveNode} selectedNode={selectedNode}/><Surface className="overflow-hidden"><div className="border-b border-white/[.07] px-5 py-4"><p className="text-sm font-medium">Decision queue</p><p className="mt-1 text-[9px] uppercase tracking-[.18em] text-zinc-600">Human authority layer</p></div><div className="divide-y divide-white/[.06]">{approvals.map((item) => <button key={item.id} onClick={() => setView('approvals')} className="block w-full p-5 text-left transition hover:bg-white/[.025]"><div className="flex items-center justify-between"><Pill tone={item.risk === 'high' ? 'red' : 'amber'}>{item.risk} risk</Pill><span className="text-[9px] text-zinc-700">{item.id}</span></div><p className="mt-4 text-sm font-medium">{item.title}</p><p className="mt-2 text-xs leading-5 text-zinc-600">{item.reason}</p><div className="mt-4 flex items-center justify-between text-[10px]"><span className="text-zinc-500">{item.agent}</span><span className="text-cyan-300">{item.impact}</span></div></button>)}{approvals.length === 0 && <div className="p-6 text-sm text-zinc-600">No decisions waiting for review.</div>}</div></Surface></div></div>}

          {view === 'studio' && <div className="mt-6 grid gap-4 2xl:grid-cols-[1.5fr_.5fr]"><WorkflowCanvas nodes={nodes} activeNode={activeNode} setActiveNode={setActiveNode} selectedNode={selectedNode}/><Surface className="p-5"><p className="text-sm font-medium">Node inspector</p><p className="mt-1 text-[9px] uppercase tracking-[.18em] text-zinc-600">{selectedNode.id} · {selectedNode.agent}</p><div className="mt-6 space-y-4"><InspectorRow label="Execution policy" value={selectedNode.title === 'Human Review' ? 'Manual approval' : 'Autonomous'}/><InspectorRow label="Retries" value="2 attempts"/><InspectorRow label="Timeout" value="18 seconds"/><InspectorRow label="Audit capture" value="Full trace"/></div><button onClick={() => flash('Inspector configuration saved')} className="mt-6 w-full rounded-xl border border-white/[.1] bg-white/[.03] py-2.5 text-xs text-zinc-300">Save node configuration</button></Surface></div>}

          {view === 'agents' && <div className="mt-6"><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agents, roles, zones..." className="w-full rounded-xl border border-white/[.08] bg-white/[.025] py-2.5 pl-9 pr-3 text-xs outline-none placeholder:text-zinc-700 focus:border-cyan-300/30"/></div><button onClick={() => { setAgents((prev) => [...prev, { id: `AG-0${prev.length + 1}`, name: 'Orion', role: 'Scenario Planning Agent', model: 'NXR-4', status: 'idle', confidence: 95, tasks: 0, zone: 'Strategy' }]); flash('New agent deployed to registry'); }} className="flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-semibold text-black"><Plus size={14}/> Deploy agent</button></div><Surface className="overflow-hidden"><div className="divide-y divide-white/[.06]">{filteredAgents.map((agent) => <div key={agent.id} className="grid gap-4 p-5 transition hover:bg-white/[.02] md:grid-cols-[1.6fr_.7fr_.7fr_.7fr_auto] md:items-center"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl border border-white/[.09] bg-black text-[10px] text-cyan-200">{agent.id.replace('AG-','')}</div><div><p className="text-sm font-medium">{agent.name}</p><p className="mt-1 text-xs text-zinc-600">{agent.role}</p></div></div><InspectorRow label="Model" value={agent.model}/><InspectorRow label="Confidence" value={`${agent.confidence}%`}/><InspectorRow label="Tasks" value={`${agent.tasks} active`}/><button onClick={() => setAgents((prev) => prev.map((item) => item.id === agent.id ? { ...item, status: item.status === 'running' ? 'idle' : 'running' } : item))} className="justify-self-start md:justify-self-end"><Pill tone={agent.status === 'running' ? 'green' : agent.status === 'review' ? 'amber' : 'neutral'}>{agent.status}</Pill></button></div>)}</div></Surface></div>}

          {view === 'runtime' && <div className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_.75fr]"><Surface className="overflow-hidden"><div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4"><div><p className="text-sm font-medium">Execution console</p><p className="mt-1 text-[9px] uppercase tracking-[.18em] text-zinc-600">Streaming production logs</p></div><Pill tone="green">live</Pill></div><div className="min-h-[420px] bg-black/35 p-5 font-mono text-[11px] leading-7 text-zinc-500">{logs.map((line, index) => <div key={`${line}-${index}`}><span className="text-cyan-300/70">›</span> {line}</div>)}</div></Surface><div className="space-y-4"><RuntimeCard icon={Cpu} label="Compute fabric" value="63%" detail="14 workers · healthy"/><RuntimeCard icon={Database} label="Signal lake" value="42.8M" detail="1.4M events / hour"/><RuntimeCard icon={Gauge} label="Queue pressure" value="Low" detail="p95 wait 110ms"/><RuntimeCard icon={Radio} label="Regional mesh" value="3/3" detail="IAD · FRA · GRU"/></div></div>}

          {view === 'approvals' && <div className="mt-6 grid gap-4 xl:grid-cols-2">{approvals.map((item) => <Surface key={item.id} className="p-6"><div className="flex items-center justify-between"><Pill tone={item.risk === 'high' ? 'red' : 'amber'}>{item.risk} risk</Pill><span className="text-[10px] text-zinc-700">{item.id}</span></div><h2 className="mt-6 text-2xl font-medium tracking-[-.035em]">{item.title}</h2><p className="mt-3 text-sm leading-6 text-zinc-500">{item.reason}</p><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/[.07] p-4"><p className="text-[9px] uppercase tracking-[.16em] text-zinc-600">Requesting agent</p><p className="mt-2 text-sm">{item.agent}</p></div><div className="rounded-2xl border border-white/[.07] p-4"><p className="text-[9px] uppercase tracking-[.16em] text-zinc-600">Business impact</p><p className="mt-2 text-sm text-cyan-300">{item.impact}</p></div></div><div className="mt-6 flex gap-2"><button onClick={() => resolveApproval(item.id, false)} className="flex-1 rounded-xl border border-white/[.1] py-2.5 text-xs text-zinc-300">Reject</button><button onClick={() => resolveApproval(item.id, true)} className="flex-1 rounded-xl bg-white py-2.5 text-xs font-semibold text-black">Approve & resume</button></div></Surface>)}{approvals.length === 0 && <Surface className="col-span-full grid min-h-[320px] place-items-center text-center"><div><CheckCircle2 className="mx-auto text-emerald-300"/><p className="mt-4 text-lg">Review queue clear</p><p className="mt-2 text-sm text-zinc-600">All high-impact decisions have been resolved.</p></div></Surface>}</div>}

          {view === 'governance' && <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_.8fr]"><Surface className="overflow-hidden"><div className="border-b border-white/[.07] px-5 py-4"><p className="text-sm font-medium">Autonomy policy</p><p className="mt-1 text-[9px] uppercase tracking-[.18em] text-zinc-600">Production guardrails</p></div><PolicyRow title="Strict policy enforcement" text="Block executions that exceed configured risk thresholds." value={strictMode} setValue={setStrictMode}/><PolicyRow title="Human gate for high-impact actions" text="Require approval for pricing, compliance and customer-risk decisions." value={humanGate} setValue={setHumanGate}/><PolicyRow title="Immutable audit trail" text="Lock production traces and decision evidence after execution." value={auditLock} setValue={setAuditLock}/></Surface><Surface className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium">Authority map</p><p className="mt-1 text-[9px] uppercase tracking-[.18em] text-zinc-600">Who can decide what</p></div><BrainCircuit size={18} className="text-cyan-300"/></div><div className="mt-6 space-y-3">{[['Low risk','Autonomous','green'],['Medium risk','Autonomous + audit','cyan'],['High risk','Human approval','amber'],['Restricted','Blocked','red']].map(([risk, authority, tone]) => <div key={risk} className="flex items-center justify-between rounded-2xl border border-white/[.07] p-4"><span className="text-sm text-zinc-400">{risk}</span><Pill tone={tone as 'green'|'cyan'|'amber'|'red'}>{authority}</Pill></div>)}</div></Surface></div>}
        </div>
      </section>
    </div>

    <AnimatePresence>{mobileNav && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#05070a] p-5 lg:hidden"><div className="flex items-center justify-between"><p className="text-sm font-semibold tracking-[.18em]">NEXORA</p><button onClick={() => setMobileNav(false)} className="grid size-10 place-items-center rounded-xl border border-white/[.08]"><X size={17}/></button></div><div className="mt-10 space-y-2">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setView(id); setMobileNav(false); }} className="flex w-full items-center gap-4 rounded-2xl border border-white/[.06] p-4 text-left text-lg"><Icon size={19}/>{label}</button>)}</div></motion.div>}</AnimatePresence>

    <AnimatePresence>{commandOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] grid place-items-start bg-black/70 p-4 pt-[12vh] backdrop-blur-md" onMouseDown={() => setCommandOpen(false)}><motion.div initial={{ y: -14, scale: .98 }} animate={{ y: 0, scale: 1 }} exit={{ y: -10, scale: .98 }} onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-[24px] border border-white/[.1] bg-[#0b0e13] shadow-2xl"><div className="flex items-center gap-3 border-b border-white/[.08] px-4 py-3"><Search size={16} className="text-zinc-600"/><input autoFocus placeholder="Navigate NEXORA..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-700"/><span className="text-[10px] text-zinc-700">ESC</span></div><div className="p-2">{nav.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setView(id); setCommandOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-zinc-400 hover:bg-white/[.04] hover:text-white"><Icon size={15}/>{label}<ChevronRight className="ml-auto" size={14}/></button>)}</div></motion.div></motion.div>}</AnimatePresence>

    <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-2xl border border-white/[.1] bg-[#0d1116] px-4 py-3 text-xs shadow-2xl"><Check className="text-emerald-300" size={15}/>{toast}</motion.div>}</AnimatePresence>
  </main>;
}

function WorkflowCanvas({ nodes, activeNode, setActiveNode, selectedNode }: { nodes: FlowNode[]; activeNode: string; setActiveNode: (id: string) => void; selectedNode: FlowNode }) {
  return <Surface className="overflow-hidden"><div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4"><div><p className="text-sm font-medium">Revenue intelligence flow</p><p className="mt-1 text-[9px] uppercase tracking-[.18em] text-zinc-600">FLOW-72 · production graph</p></div><Pill tone={nodes.some((node) => node.state === 'running') ? 'cyan' : 'green'}>{nodes.some((node) => node.state === 'running') ? 'executing' : 'ready'}</Pill></div><div className="relative h-[520px] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(103,232,249,.035),transparent_45%)]"><div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:28px_28px]"/><svg viewBox="0 0 1000 520" className="absolute inset-0 h-full w-full" preserveAspectRatio="none"><path d="M80 105 C210 105 215 105 310 105 S465 105 540 105 S710 105 770 105" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2"/><path d="M540 105 C540 180 540 240 540 322" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" strokeDasharray="7 8"/><motion.path d="M80 105 C210 105 215 105 310 105 S465 105 540 105" fill="none" stroke="rgba(103,232,249,.72)" strokeWidth="2" strokeDasharray="8 12" animate={{ strokeDashoffset: [0,-40] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}/></svg>{nodes.map((node) => <NodeCard key={node.id} node={node} active={activeNode === node.id} onClick={() => setActiveNode(node.id)}/>)}<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/[.07] bg-black/40 px-4 py-3 backdrop-blur-md"><div><p className="text-[9px] uppercase tracking-[.18em] text-zinc-600">Selected node</p><p className="mt-1 text-xs">{selectedNode.title} · {selectedNode.agent}</p></div><div className="hidden items-center gap-2 text-[10px] text-zinc-600 sm:flex"><CircleDot size={12}/> Full trace enabled</div></div></div></Surface>;
}

function InspectorRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b border-white/[.06] pb-3"><span className="text-xs text-zinc-600">{label}</span><span className="text-xs text-zinc-300">{value}</span></div>; }

function RuntimeCard({ icon: Icon, label, value, detail }: { icon: typeof Activity; label: string; value: string; detail: string }) { return <Surface className="p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[.18em] text-zinc-600">{label}</p><p className="mt-4 text-2xl font-medium tracking-[-.035em]">{value}</p><p className="mt-2 text-xs text-zinc-600">{detail}</p></div><Icon size={18} className="text-cyan-300"/></div></Surface>; }

function PolicyRow({ title, text, value, setValue }: { title: string; text: string; value: boolean; setValue: (value: boolean) => void }) { return <div className="flex items-center justify-between gap-5 border-b border-white/[.06] p-5 last:border-b-0"><div><p className="text-sm">{title}</p><p className="mt-1 max-w-lg text-xs leading-5 text-zinc-600">{text}</p></div><button onClick={() => setValue(!value)} className={classNames('relative h-6 w-11 shrink-0 rounded-full transition', value ? 'bg-cyan-300' : 'bg-white/[.08]')}><motion.span animate={{ x: value ? 21 : 3 }} className={classNames('absolute top-1 size-4 rounded-full', value ? 'bg-black' : 'bg-zinc-500')}/></button></div>; }
