'use client';

import {
  Activity, BarChart3, Bell, Bot, Boxes, ChevronDown, CircleGauge, Command, Cpu,
  Database, GitBranch, LayoutDashboard, Menu, Network, Play, Plus, Search, Settings,
  ShieldCheck, Sparkles, Users, Workflow, X, Zap, ArrowUpRight, SlidersHorizontal,
  CheckCircle2, AlertTriangle, Pause, MoreHorizontal, Clock3, BrainCircuit, Layers3,
  Radio, LockKeyhole, RefreshCcw, Gauge, UserPlus, FileText, KeyRound,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type NavId = 'overview' | 'agents' | 'automations' | 'projects' | 'analytics' | 'team' | 'settings';
type Icon = typeof Activity;
type AgentStatus = 'Running' | 'Idle' | 'Review';
type Agent = { id: string; name: string; role: string; status: AgentStatus; load: number; tasks: number; model: string; success: string; };

type NavItem = { id: NavId; label: string; icon: Icon; hint: string };

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, hint: 'Command center' },
  { id: 'agents', label: 'AI Agents', icon: Bot, hint: '24 deployed' },
  { id: 'automations', label: 'Automations', icon: Workflow, hint: '31 active' },
  { id: 'projects', label: 'Projects', icon: GitBranch, hint: '12 workspaces' },
  { id: 'analytics', label: 'Intelligence', icon: BarChart3, hint: '42.8M signals' },
  { id: 'team', label: 'Team', icon: Users, hint: '18 operators' },
  { id: 'settings', label: 'Settings', icon: Settings, hint: 'Workspace' },
];

const agents: Agent[] = [
  { id: 'A1', name: 'Atlas', role: 'Operations Orchestrator', status: 'Running', load: 82, tasks: 19, model: 'NXR-4', success: '99.4%' },
  { id: 'N2', name: 'Nova', role: 'Revenue Intelligence', status: 'Running', load: 67, tasks: 12, model: 'NXR-4', success: '98.9%' },
  { id: 'S3', name: 'Sable', role: 'Risk & Compliance', status: 'Review', load: 44, tasks: 7, model: 'NXR-3', success: '97.8%' },
  { id: 'E4', name: 'Echo', role: 'Customer Signal Analyst', status: 'Idle', load: 21, tasks: 3, model: 'NXR-3', success: '99.7%' },
  { id: 'V5', name: 'Vector', role: 'Data Quality Guardian', status: 'Running', load: 71, tasks: 15, model: 'NXR-4', success: '99.1%' },
  { id: 'M6', name: 'Muse', role: 'Executive Briefing Agent', status: 'Idle', load: 18, tasks: 2, model: 'NXR-3', success: '100%' },
];

const activity = [
  ['Atlas', 'Rebalanced 14 workflow priorities', '12 sec ago', 'ok'],
  ['Nova', 'Qualified 8 revenue opportunities', '1 min ago', 'ok'],
  ['System', 'Production health score increased to 98.7%', '4 min ago', 'ok'],
  ['Sable', 'Escalated compliance review · APAC routing', '8 min ago', 'warn'],
  ['Echo', 'Merged 284 customer signals into 6 clusters', '11 min ago', 'ok'],
];

const automations = [
  { name: 'Lead Intelligence Loop', owner: 'Nova', runs: '4.8k', success: '99.2%', latency: '1.3s', state: 'Live' },
  { name: 'Client Risk Monitor', owner: 'Sable', runs: '1.9k', success: '98.7%', latency: '2.1s', state: 'Live' },
  { name: 'Revenue Forecast Sync', owner: 'Nova', runs: '892', success: '99.8%', latency: '940ms', state: 'Live' },
  { name: 'Executive Brief Generator', owner: 'Muse', runs: '364', success: '100%', latency: '4.7s', state: 'Paused' },
];

const projects = [
  { name: 'Northstar Expansion', progress: 82, health: 'On track', team: 8, agents: 5, due: '14 Sep' },
  { name: 'Signal Lake Migration', progress: 64, health: 'At risk', team: 6, agents: 4, due: '03 Oct' },
  { name: 'Enterprise RevOps', progress: 91, health: 'On track', team: 11, agents: 7, due: '28 Aug' },
  { name: 'APAC Compliance Mesh', progress: 48, health: 'Review', team: 5, agents: 3, due: '19 Oct' },
];

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[22px] border border-white/[0.08] bg-[#0b0e12]/82 shadow-[0_30px_80px_rgba(0,0,0,.22)] backdrop-blur-xl ${className}`}>{children}</section>;
}

function SectionHead({ title, eyebrow, action }: { title: string; eyebrow: string; action?: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 border-b border-white/[0.075] px-5 py-4 sm:px-6"><div><p className="text-sm font-medium tracking-[-0.01em]">{title}</p><p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-600">{eyebrow}</p></div>{action}</div>;
}

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'green' | 'amber' | 'cyan' | 'neutral' }) {
  const tones = { green: 'border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300', amber: 'border-amber-300/20 bg-amber-300/[0.07] text-amber-200', cyan: 'border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200', neutral: 'border-white/[0.08] bg-white/[0.03] text-zinc-500' };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] ${tones[tone]}`}>{children}</span>;
}

function Metric({ label, value, delta, icon: Icon, bars }: { label: string; value: string; delta: string; icon: Icon; bars: number[] }) {
  return <Panel className="group overflow-hidden p-5 transition duration-500 hover:-translate-y-0.5 hover:border-cyan-300/20">
    <div className="flex items-center justify-between text-zinc-500"><span className="text-[10px] uppercase tracking-[0.19em]">{label}</span><Icon size={16} strokeWidth={1.5} /></div>
    <div className="mt-7 flex items-end justify-between gap-4"><strong className="text-3xl font-medium tracking-[-0.05em] text-white sm:text-4xl">{value}</strong><Badge tone="green">{delta}</Badge></div>
    <div className="mt-5 flex h-8 items-end gap-1">{bars.map((h, i) => <motion.span key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * .035, duration: .55 }} className="flex-1 rounded-[2px] bg-gradient-to-t from-cyan-300/10 to-cyan-300/65" />)}</div>
  </Panel>;
}

function MiniOrbit() {
  return <div className="relative mx-auto aspect-square w-full max-w-[340px]">
    <div className="absolute inset-[8%] rounded-full border border-white/[0.07]" />
    <div className="absolute inset-[22%] rounded-full border border-white/[0.08]" />
    <div className="absolute inset-[36%] rounded-full border border-cyan-300/20 bg-cyan-300/[0.025] shadow-[0_0_70px_rgba(103,232,249,.08)]" />
    <motion.div className="absolute inset-[8%]" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}><span className="absolute left-1/2 top-[-5px] size-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,.8)]" /></motion.div>
    <motion.div className="absolute inset-[22%]" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 17, ease: 'linear' }}><span className="absolute right-[-4px] top-1/2 size-2 -translate-y-1/2 rounded-full bg-white/70" /></motion.div>
    <div className="absolute inset-0 grid place-items-center text-center"><div><BrainCircuit className="mx-auto text-cyan-200" size={28} strokeWidth={1.4}/><p className="mt-3 text-3xl font-medium tracking-[-0.05em]">24</p><p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-zinc-600">Agents online</p></div></div>
  </div>;
}

function Overview({ onNavigate }: { onNavigate: (id: NavId) => void }) {
  return <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
    <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
      <Metric label="Active agents" value="24" delta="+4 this week" icon={Bot} bars={[38,48,44,61,56,74,82,76,92,88,96,91]} />
      <Metric label="Autonomous runs" value="18.4k" delta="+12.8%" icon={Zap} bars={[29,42,38,53,49,62,57,71,68,79,84,92]} />
      <Metric label="Decision latency" value="1.8s" delta="-21.4%" icon={Cpu} bars={[92,85,78,74,65,58,52,49,43,38,34,29]} />
      <Metric label="Health score" value="98.7" delta="Excellent" icon={CircleGauge} bars={[75,80,79,84,86,89,91,90,94,96,98,99]} />
    </div>

    <div className="mt-4 grid gap-4 2xl:grid-cols-[1.35fr_.65fr]">
      <Panel className="overflow-hidden"><SectionHead title="Agent mesh" eyebrow="Execution layer · live" action={<button onClick={() => onNavigate('agents')} className="flex items-center gap-1.5 text-[10px] text-zinc-500 transition hover:text-white">Open registry <ArrowUpRight size={12}/></button>} />
        <div className="grid divide-y divide-white/[0.07]">{agents.slice(0,4).map((agent) => <button key={agent.id} onClick={() => onNavigate('agents')} className="grid gap-4 px-5 py-4 text-left transition hover:bg-white/[0.025] sm:px-6 md:grid-cols-[1.5fr_.55fr_.65fr_auto] md:items-center">
          <div className="flex items-center gap-3"><div className="relative grid size-10 place-items-center rounded-xl border border-white/[0.09] bg-black text-[10px] text-cyan-200"><span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-emerald-300 ring-2 ring-[#0b0e12]"/>{agent.id}</div><div><p className="text-sm font-medium">{agent.name}</p><p className="mt-0.5 text-xs text-zinc-600">{agent.role}</p></div></div>
          <div><p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">Load</p><div className="mt-2 flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${agent.load}%` }} /></div><span className="text-xs text-zinc-500">{agent.load}%</span></div></div>
          <div><p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">Tasks</p><p className="mt-1 text-sm text-zinc-300">{agent.tasks} active</p></div>
          <Badge tone={agent.status === 'Running' ? 'green' : agent.status === 'Review' ? 'amber' : 'neutral'}>{agent.status}</Badge>
        </button>)}</div>
      </Panel>

      <Panel className="p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-medium">Autonomy core</p><p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-zinc-600">Human-governed intelligence</p></div><Radio size={16} className="text-cyan-300"/></div><MiniOrbit/><div className="grid grid-cols-3 gap-2 text-center"><div className="rounded-xl border border-white/[0.06] py-3"><p className="text-sm">6.2k</p><p className="mt-1 text-[9px] text-zinc-600">Decisions</p></div><div className="rounded-xl border border-white/[0.06] py-3"><p className="text-sm">17</p><p className="mt-1 text-[9px] text-zinc-600">Reviews</p></div><div className="rounded-xl border border-white/[0.06] py-3"><p className="text-sm">99.1%</p><p className="mt-1 text-[9px] text-zinc-600">Aligned</p></div></div></Panel>
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
      <Panel className="overflow-hidden"><SectionHead title="Live activity" eyebrow="Operational event stream" action={<span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-emerald-300"><span className="size-1.5 animate-pulse rounded-full bg-emerald-300"/>Streaming</span>} /><div className="divide-y divide-white/[0.06]">{activity.map(([who, what, when, state]) => <div key={what} className="flex gap-3 px-5 py-4 sm:px-6"><div className={`mt-1.5 size-2 shrink-0 rounded-full ${state === 'warn' ? 'bg-amber-300' : 'bg-cyan-300'}`}/><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="text-xs text-zinc-300"><span className="font-medium text-white">{who}</span> · {what}</p><span className="shrink-0 text-[9px] text-zinc-700">{when}</span></div></div></div>)}</div></Panel>
      <Panel className="overflow-hidden"><SectionHead title="Automation fabric" eyebrow="Highest impact workflows" action={<button onClick={() => onNavigate('automations')} className="text-[10px] text-zinc-500 hover:text-white">View all</button>} /><div className="grid divide-y divide-white/[0.06]">{automations.slice(0,3).map((flow) => <button key={flow.name} onClick={() => onNavigate('automations')} className="grid gap-3 px-5 py-4 text-left transition hover:bg-white/[0.025] sm:px-6 md:grid-cols-[1.5fr_.5fr_.5fr_auto] md:items-center"><div><p className="text-sm">{flow.name}</p><p className="mt-1 text-[10px] text-zinc-600">Owner · {flow.owner}</p></div><div><p className="text-[9px] uppercase tracking-[0.15em] text-zinc-700">Runs</p><p className="mt-1 text-xs text-zinc-400">{flow.runs}</p></div><div><p className="text-[9px] uppercase tracking-[0.15em] text-zinc-700">Success</p><p className="mt-1 text-xs text-zinc-400">{flow.success}</p></div><Badge tone={flow.state === 'Live' ? 'green' : 'neutral'}>{flow.state}</Badge></button>)}</div></Panel>
    </div>
  </motion.div>;
}

function AgentsView() {
  return <motion.div key="agents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]"><Panel className="overflow-hidden"><SectionHead title="Agent registry" eyebrow="Runtime identities · 24 deployed" action={<button className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[10px] font-semibold text-black"><Plus size={13}/> Deploy agent</button>}/><div className="grid gap-3 p-4 sm:p-5">{agents.map((agent) => <div key={agent.id} className="grid gap-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4 transition hover:border-cyan-300/20 hover:bg-white/[0.02] md:grid-cols-[1.35fr_.6fr_.6fr_.45fr_auto] md:items-center"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] text-xs text-cyan-200">{agent.id}</div><div><p className="text-sm font-medium">{agent.name}</p><p className="mt-1 text-[11px] text-zinc-600">{agent.role}</p></div></div><div><p className="text-[9px] uppercase tracking-[0.15em] text-zinc-700">Model</p><p className="mt-1 text-xs">{agent.model}</p></div><div><p className="text-[9px] uppercase tracking-[0.15em] text-zinc-700">Success</p><p className="mt-1 text-xs">{agent.success}</p></div><div><p className="text-[9px] uppercase tracking-[0.15em] text-zinc-700">Load</p><p className="mt-1 text-xs">{agent.load}%</p></div><button className="grid size-8 place-items-center rounded-lg border border-white/[0.08] text-zinc-500 hover:text-white"><MoreHorizontal size={14}/></button></div>)}</div></Panel><Panel className="p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium">Capacity map</p><p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-zinc-600">Compute allocation</p></div><Gauge size={16} className="text-zinc-600"/></div><div className="mt-8 space-y-6">{[['Reasoning',82],['Research',64],['Automation',74],['Review',39],['Data',68]].map(([name,value]) => <div key={name as string}><div className="mb-2 flex justify-between text-[10px]"><span className="text-zinc-500">{name}</span><span>{value}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]"><motion.div initial={{width:0}} animate={{width:`${value}%`}} transition={{duration:.7}} className="h-full bg-gradient-to-r from-cyan-300/40 to-cyan-200"/></div></div>)}</div><div className="mt-8 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.03] p-4"><p className="text-xs text-cyan-100">Capacity recommendation</p><p className="mt-2 text-xs leading-5 text-zinc-500">Move 12% research capacity from Echo to Atlas for the next 3 hours. Predicted queue reduction: 18%.</p><button className="mt-4 flex items-center gap-2 text-[10px] text-cyan-200">Apply recommendation <ArrowUpRight size={12}/></button></div></Panel></div></motion.div>;
}

function AutomationsView() {
  return <motion.div key="automations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><div className="grid gap-4 sm:grid-cols-3"><Metric label="Runs today" value="7,482" delta="+18.2%" icon={Play} bars={[22,31,43,39,51,56,63,71,68,80,86,93]}/><Metric label="Success rate" value="99.18%" delta="Stable" icon={CheckCircle2} bars={[78,80,84,82,87,90,91,89,93,94,96,98]}/><Metric label="Time returned" value="186h" delta="This week" icon={Clock3} bars={[35,41,46,50,58,62,68,70,76,83,89,95]}/></div><Panel className="mt-4 overflow-hidden"><SectionHead title="Automation fabric" eyebrow="Rules · triggers · agent handoffs" action={<button className="flex items-center gap-2 rounded-xl bg-cyan-300 px-3 py-2 text-[10px] font-semibold text-black"><Plus size={13}/> New automation</button>}/><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="border-b border-white/[0.07] text-[9px] uppercase tracking-[0.16em] text-zinc-700"><tr><th className="px-6 py-3 font-normal">Workflow</th><th className="px-4 py-3 font-normal">Owner</th><th className="px-4 py-3 font-normal">Runs</th><th className="px-4 py-3 font-normal">Success</th><th className="px-4 py-3 font-normal">Latency</th><th className="px-4 py-3 font-normal">State</th><th className="px-4 py-3"/></tr></thead><tbody>{automations.map(flow => <tr key={flow.name} className="border-b border-white/[0.055] last:border-0 hover:bg-white/[0.02]"><td className="px-6 py-5"><p className="text-sm">{flow.name}</p><p className="mt-1 text-[10px] text-zinc-700">Trigger → evaluate → execute → verify</p></td><td className="px-4 py-5 text-xs text-zinc-500">{flow.owner}</td><td className="px-4 py-5 text-xs text-zinc-400">{flow.runs}</td><td className="px-4 py-5 text-xs text-zinc-400">{flow.success}</td><td className="px-4 py-5 text-xs text-zinc-400">{flow.latency}</td><td className="px-4 py-5"><Badge tone={flow.state==='Live'?'green':'neutral'}>{flow.state}</Badge></td><td className="px-4 py-5"><button className="text-zinc-600 hover:text-white"><MoreHorizontal size={15}/></button></td></tr>)}</tbody></table></div></Panel></motion.div>;
}

function ProjectsView() {
  return <motion.div key="projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><div className="grid gap-4 lg:grid-cols-2">{projects.map((p,i)=><Panel key={p.name} className="overflow-hidden p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] uppercase tracking-[0.17em] text-zinc-700">Workspace 0{i+1}</p><h3 className="mt-2 text-xl font-medium tracking-[-0.035em]">{p.name}</h3></div><Badge tone={p.health==='On track'?'green':p.health==='At risk'?'amber':'cyan'}>{p.health}</Badge></div><div className="mt-8 flex items-end justify-between"><div><p className="text-5xl font-medium tracking-[-0.06em]">{p.progress}%</p><p className="mt-2 text-[10px] text-zinc-600">Program completion</p></div><div className="text-right text-[10px] text-zinc-600"><p>{p.team} operators</p><p className="mt-1">{p.agents} agents</p></div></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]"><motion.div initial={{width:0}} animate={{width:`${p.progress}%`}} transition={{duration:.7,delay:i*.08}} className="h-full bg-cyan-300"/></div><div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4"><span className="flex items-center gap-2 text-[10px] text-zinc-600"><Clock3 size={12}/> Due {p.due}</span><button className="flex items-center gap-2 text-[10px] text-zinc-400 hover:text-white">Open workspace <ArrowUpRight size={12}/></button></div></Panel>)}</div></motion.div>;
}

function IntelligenceView() {
  return <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><div className="grid gap-4 2xl:grid-cols-[1.4fr_.6fr]"><Panel className="overflow-hidden"><SectionHead title="Decision intelligence" eyebrow="Signal topology · trailing 24 hours" action={<button className="flex items-center gap-2 rounded-xl border border-white/[0.08] px-3 py-2 text-[10px] text-zinc-500"><SlidersHorizontal size={12}/> Filter</button>}/><div className="p-5 sm:p-6"><div className="relative h-[360px] overflow-hidden rounded-2xl border border-white/[0.06] bg-black/35"><div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:28px_28px]"/><svg viewBox="0 0 800 320" className="absolute inset-0 h-full w-full" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(103,232,249,.22)"/><stop offset="100%" stopColor="rgba(103,232,249,0)"/></linearGradient></defs><path d="M0 260 C80 252 92 208 175 216 S282 142 370 175 S474 90 560 115 S675 48 800 58 L800 320 L0 320 Z" fill="url(#fill)"/><path d="M0 260 C80 252 92 208 175 216 S282 142 370 175 S474 90 560 115 S675 48 800 58" fill="none" stroke="rgba(103,232,249,.95)" strokeWidth="2"/></svg><div className="absolute left-5 top-5"><p className="text-5xl font-medium tracking-[-0.06em]">42.8M</p><p className="mt-2 text-[9px] uppercase tracking-[0.18em] text-zinc-600">Signals processed</p></div><div className="absolute bottom-4 left-5 right-5 grid grid-cols-4 gap-2 text-center text-[9px] text-zinc-600"><span>00:00</span><span>08:00</span><span>16:00</span><span>24:00</span></div></div></div></Panel><Panel className="p-5 sm:p-6"><p className="text-sm font-medium">Decision mix</p><p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-zinc-600">Human + autonomous</p><div className="mt-7 space-y-5">{[['Autonomous',74,'cyan'],['Human approved',18,'white'],['Escalated',6,'amber'],['Blocked',2,'red']].map(([n,v])=><div key={n as string}><div className="mb-2 flex justify-between text-xs"><span className="text-zinc-500">{n}</span><span>{v}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/[0.05]"><div className={`h-full rounded-full ${n==='Autonomous'?'bg-cyan-300':n==='Human approved'?'bg-white/70':n==='Escalated'?'bg-amber-300':'bg-red-400'}`} style={{width:`${v}%`}}/></div></div>)}</div><div className="mt-8 rounded-2xl border border-white/[0.06] p-4"><div className="flex items-center gap-2 text-xs"><ShieldCheck size={14} className="text-emerald-300"/> Governance healthy</div><p className="mt-2 text-xs leading-5 text-zinc-600">No decision-policy drift detected across production agents in the last 24 hours.</p></div></Panel></div></motion.div>;
}

function TeamView() {
  const people=[['PS','Pablo Solla','Owner · Strategy','Online'],['ML','Maya Lee','AI Operations Lead','Online'],['TR','Theo Reed','Data Systems','Away'],['AK','Ava Kim','Automation Engineer','Online'],['NC','Noah Chen','Risk & Compliance','Offline'],['LM','Lena Moore','Product Operations','Online']];
  return <motion.div key="team" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}><Panel className="overflow-hidden"><SectionHead title="Operator directory" eyebrow="Humans in the loop" action={<button className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[10px] font-semibold text-black"><UserPlus size={13}/> Invite operator</button>}/><div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">{people.map(([initials,name,role,status])=><div key={name} className="rounded-2xl border border-white/[0.07] bg-black/20 p-4"><div className="flex items-start justify-between"><div className="grid size-10 place-items-center rounded-xl bg-white text-xs font-semibold text-black">{initials}</div><span className={`mt-1 size-2 rounded-full ${status==='Online'?'bg-emerald-300':status==='Away'?'bg-amber-300':'bg-zinc-700'}`}/></div><p className="mt-5 text-sm font-medium">{name}</p><p className="mt-1 text-[11px] text-zinc-600">{role}</p><div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3"><span className="text-[9px] uppercase tracking-[0.14em] text-zinc-700">{status}</span><button className="text-zinc-600 hover:text-white"><MoreHorizontal size={14}/></button></div></div>)}</div></Panel></motion.div>;
}

function SettingsView() {
  const settings=[{icon:LockKeyhole,title:'Governance policy',text:'Define approval thresholds, sensitive actions and escalation paths.'},{icon:KeyRound,title:'Model access',text:'Control model providers, keys, fallback order and usage boundaries.'},{icon:Database,title:'Data connections',text:'Manage production sources, knowledge stores and retention.'},{icon:Bell,title:'Notification routing',text:'Configure critical alerts, digests and operator channels.'},{icon:RefreshCcw,title:'Runtime behavior',text:'Set retries, execution windows and recovery policies.'},{icon:FileText,title:'Audit & exports',text:'Review immutable decision logs and export governance reports.'}];
  return <motion.div key="settings" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}><div className="grid gap-4 lg:grid-cols-2">{settings.map(({icon:Icon,title,text})=><Panel key={title} className="p-5 sm:p-6"><div className="flex items-start gap-4"><div className="grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-cyan-200"><Icon size={17}/></div><div className="flex-1"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium">{title}</p><p className="mt-2 max-w-md text-xs leading-5 text-zinc-600">{text}</p></div><button className="text-[10px] text-zinc-500 hover:text-white">Configure</button></div></div></div></Panel>)}</div></motion.div>;
}

function CommandPalette({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (id: NavId) => void }) {
  const [query,setQuery]=useState('');
  const actions = navItems.map(item=>({label:`Open ${item.label}`,id:item.id,icon:item.icon}));
  const filtered=useMemo(()=>actions.filter(a=>a.label.toLowerCase().includes(query.toLowerCase())),[query]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault(); if(open) onClose();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[open,onClose]);
  return <AnimatePresence>{open&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[90] grid place-items-start bg-black/60 px-4 pt-[14vh] backdrop-blur-md" onMouseDown={onClose}><motion.div initial={{opacity:0,y:-12,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-10,scale:.98}} transition={{duration:.22}} className="w-full max-w-xl overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#0c0f13] shadow-2xl" onMouseDown={e=>e.stopPropagation()}><div className="flex items-center gap-3 border-b border-white/[0.08] px-4"><Search size={16} className="text-zinc-600"/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search commands, agents, projects..." className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-700"/><button onClick={onClose} className="text-zinc-600"><X size={16}/></button></div><div className="p-2">{filtered.map(({label,id,icon:Icon})=><button key={id} onClick={()=>{onNavigate(id);onClose()}} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-zinc-400 hover:bg-white/[0.05] hover:text-white"><div className="grid size-8 place-items-center rounded-lg border border-white/[0.07]"><Icon size={14}/></div>{label}<span className="ml-auto text-[9px] text-zinc-700">↵</span></button>)}</div><div className="border-t border-white/[0.06] px-4 py-3 text-[9px] uppercase tracking-[0.14em] text-zinc-700">NEXORA command layer · production workspace</div></motion.div></motion.div>}</AnimatePresence>;
}

export default function NexoraApp() {
  const [active,setActive]=useState<NavId>('overview');
  const [mobileNav,setMobileNav]=useState(false);
  const [commandOpen,setCommandOpen]=useState(false);
  const [deployOpen,setDeployOpen]=useState(false);
  const current=navItems.find(n=>n.id===active) ?? navItems[0];
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setCommandOpen(v=>!v)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
  const navigate=(id:NavId)=>{setActive(id);setMobileNav(false)};

  return <main className="min-h-screen bg-[#06080b] text-[#f5f7f8] selection:bg-cyan-300 selection:text-black">
    <div className="pointer-events-none fixed inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.022)_1px,transparent_1px)] [background-size:52px_52px]"/>
    <div className="pointer-events-none fixed left-[28%] top-[-20%] h-[46rem] w-[46rem] rounded-full bg-cyan-300/[0.025] blur-[120px]"/>
    <div className="relative flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 border-r border-white/[0.075] bg-[#080a0d]/92 px-4 py-5 backdrop-blur-2xl lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2"><div className="relative grid size-10 place-items-center rounded-[13px] border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200"><Network size={18}/><span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-emerald-300 ring-[3px] ring-[#080a0d]"/></div><div><p className="text-sm font-semibold tracking-[0.18em]">NEXORA</p><p className="text-[9px] uppercase tracking-[0.24em] text-zinc-600">AI Operations</p></div></div>
        <div className="mt-9 space-y-1">{navItems.map(({id,label,icon:Icon,hint})=><button key={id} onClick={()=>navigate(id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${active===id?'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,.08)]':'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'}`}><Icon size={16} strokeWidth={1.7}/><div className="min-w-0 flex-1"><p className="text-[13px]">{label}</p><p className={`mt-0.5 truncate text-[9px] ${active===id?'text-black/45':'text-zinc-700 group-hover:text-zinc-600'}`}>{hint}</p></div></button>)}</div>
        <div className="mt-auto rounded-[18px] border border-white/[0.08] bg-white/[0.025] p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[10px] text-zinc-400"><ShieldCheck size={14} className="text-emerald-300"/> Secure runtime</div><span className="text-[9px] text-emerald-300">LIVE</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300"/></div><div className="mt-2 flex justify-between text-[9px] uppercase tracking-[0.14em] text-zinc-700"><span>Trust score</span><span>92%</span></div></div>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-white/[0.075] bg-[#06080b]/78 px-4 backdrop-blur-2xl sm:px-6 xl:px-8"><div className="flex items-center gap-3"><button onClick={()=>setMobileNav(true)} className="grid size-9 place-items-center rounded-xl border border-white/[0.08] lg:hidden"><Menu size={17}/></button><div><p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">Workspace / Production</p><p className="mt-0.5 text-sm font-medium">{current.label}</p></div></div><div className="flex items-center gap-2"><button onClick={()=>setCommandOpen(true)} className="hidden items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-zinc-600 transition hover:border-white/[0.15] hover:text-zinc-300 sm:flex"><Search size={14}/> Search anything <span className="rounded-md border border-white/[0.08] px-1.5 py-0.5 text-[9px]">⌘K</span></button><button className="relative grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02]"><Bell size={15}/><span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-300"/></button><button className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-2 py-1.5 text-xs"><span className="grid size-6 place-items-center rounded-lg bg-white font-semibold text-black">SP</span><ChevronDown size={13} className="text-zinc-600"/></button></div></header>

        <div className="px-4 py-6 sm:px-6 xl:px-8 xl:py-8"><div className="mb-6 flex flex-col gap-5 border-b border-white/[0.075] pb-7 xl:flex-row xl:items-end xl:justify-between"><div><div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-cyan-300"><span className="size-1.5 animate-pulse rounded-full bg-cyan-300"/> Global operations · live</div><h1 className="mt-3 text-3xl font-medium tracking-[-0.055em] sm:text-4xl xl:text-5xl">{active==='overview'?'Autonomous operations, under human control.':current.label}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">{active==='overview'?'A premium command surface for orchestrating agents, automations, risk and intelligence across a modern enterprise.':current.hint+' · production workspace'}</p></div><div className="flex gap-2"><button onClick={()=>setCommandOpen(true)} className="flex items-center gap-2 rounded-xl border border-white/[0.12] px-4 py-2.5 text-xs text-zinc-300 transition hover:bg-white/[0.04]"><Command size={14}/> Command</button><button onClick={()=>setDeployOpen(true)} className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-semibold text-black shadow-[0_10px_35px_rgba(103,232,249,.12)] transition hover:bg-cyan-200"><Sparkles size={14}/> Deploy agent</button></div></div>
          <AnimatePresence mode="wait">{active==='overview'?<Overview onNavigate={navigate}/>:active==='agents'?<AgentsView/>:active==='automations'?<AutomationsView/>:active==='projects'?<ProjectsView/>:active==='analytics'?<IntelligenceView/>:active==='team'?<TeamView/>:<SettingsView/>}</AnimatePresence>
        </div>
      </section>
    </div>

    <AnimatePresence>{mobileNav&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[80] bg-[#07090b] p-5 lg:hidden"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200"><Network size={17}/></div><p className="text-sm font-semibold tracking-[0.18em]">NEXORA</p></div><button onClick={()=>setMobileNav(false)} className="grid size-10 place-items-center rounded-xl border border-white/[0.08]"><X size={18}/></button></div><div className="mt-10 grid gap-2">{navItems.map(({id,label,icon:Icon,hint})=><button key={id} onClick={()=>navigate(id)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left ${active===id?'border-cyan-300/20 bg-cyan-300/[0.05]':'border-white/[0.07]'}`}><Icon size={18}/><div><p className="text-sm">{label}</p><p className="mt-1 text-[10px] text-zinc-600">{hint}</p></div></button>)}</div></motion.div>}</AnimatePresence>

    <CommandPalette open={commandOpen} onClose={()=>setCommandOpen(false)} onNavigate={navigate}/>

    <AnimatePresence>{deployOpen&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[95] grid place-items-center bg-black/70 px-4 backdrop-blur-lg" onMouseDown={()=>setDeployOpen(false)}><motion.div initial={{opacity:0,y:18,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:.98}} className="w-full max-w-lg rounded-[26px] border border-white/[0.11] bg-[#0b0e12] p-6 shadow-2xl" onMouseDown={e=>e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[9px] uppercase tracking-[0.2em] text-cyan-300">New runtime identity</p><h2 className="mt-2 text-2xl font-medium tracking-[-0.04em]">Deploy an AI agent</h2></div><button onClick={()=>setDeployOpen(false)} className="text-zinc-600"><X size={18}/></button></div><div className="mt-6 grid gap-3"><label className="text-[10px] text-zinc-500">Agent name<input defaultValue="Orion" className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 text-sm text-white outline-none focus:border-cyan-300/25"/></label><label className="text-[10px] text-zinc-500">Mission<input defaultValue="Strategic operations analyst" className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 text-sm text-white outline-none focus:border-cyan-300/25"/></label><div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.04] p-3"><p className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">Model</p><p className="mt-2 text-xs">NXR-4 Reasoning</p></div><div className="rounded-xl border border-white/[0.08] p-3"><p className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">Authority</p><p className="mt-2 text-xs">Human approval</p></div></div></div><button onClick={()=>setDeployOpen(false)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3 text-xs font-semibold text-black"><Sparkles size={14}/> Create runtime identity</button></motion.div></motion.div>}</AnimatePresence>
  </main>;
}
