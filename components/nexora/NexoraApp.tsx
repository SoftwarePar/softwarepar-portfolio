'use client';

import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  CircleGauge,
  Command,
  Cpu,
  Database,
  GitBranch,
  LayoutDashboard,
  Menu,
  Network,
  Play,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type NavId = 'overview' | 'agents' | 'automations' | 'projects' | 'analytics' | 'team' | 'settings';

type Agent = {
  id: string;
  name: string;
  role: string;
  status: 'Running' | 'Idle' | 'Review';
  load: number;
  tasks: number;
};

const navItems: { id: NavId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'agents', label: 'AI Agents', icon: Bot },
  { id: 'automations', label: 'Automations', icon: Workflow },
  { id: 'projects', label: 'Projects', icon: GitBranch },
  { id: 'analytics', label: 'Intelligence', icon: BarChart3 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const agents: Agent[] = [
  { id: '01', name: 'Atlas', role: 'Operations Orchestrator', status: 'Running', load: 82, tasks: 19 },
  { id: '02', name: 'Nova', role: 'Revenue Intelligence', status: 'Running', load: 67, tasks: 12 },
  { id: '03', name: 'Sable', role: 'Risk & Compliance', status: 'Review', load: 44, tasks: 7 },
  { id: '04', name: 'Echo', role: 'Customer Signal Analyst', status: 'Idle', load: 21, tasks: 3 },
];

const activity = [
  ['Atlas', 'Rebalanced 14 workflow priorities', '12 sec ago'],
  ['Nova', 'Qualified 8 revenue opportunities', '1 min ago'],
  ['System', 'Production health score increased to 98.7%', '4 min ago'],
  ['Sable', 'Escalated compliance review · APAC routing', '8 min ago'],
  ['Echo', 'Merged 284 customer signals into 6 clusters', '11 min ago'],
];

const automations = [
  { name: 'Lead Intelligence Loop', runs: '4.8k', success: '99.2%', state: 'Live' },
  { name: 'Client Risk Monitor', runs: '1.9k', success: '98.7%', state: 'Live' },
  { name: 'Revenue Forecast Sync', runs: '892', success: '99.8%', state: 'Live' },
  { name: 'Executive Brief Generator', runs: '364', success: '100%', state: 'Paused' },
];

function Metric({ label, value, delta, icon: Icon }: { label: string; value: string; delta: string; icon: typeof Activity }) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-white/[0.16] hover:bg-white/[0.04]">
      <div className="flex items-center justify-between text-zinc-500">
        <span className="text-[11px] uppercase tracking-[0.18em]">{label}</span>
        <Icon size={16} strokeWidth={1.5} />
      </div>
      <div className="mt-7 flex items-end justify-between gap-4">
        <strong className="text-3xl font-medium tracking-[-0.04em] text-white">{value}</strong>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] text-emerald-300">{delta}</span>
      </div>
    </div>
  );
}

export default function NexoraApp() {
  const [active, setActive] = useState<NavId>('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredCommands = useMemo(() => {
    const actions = [
      'Open AI Agents',
      'Create Automation',
      'Run Executive Brief',
      'Inspect Risk Queue',
      'Open Intelligence',
      'Invite Team Member',
    ];
    return actions.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <main className="min-h-screen bg-[#07090b] text-[#f4f5f7] selection:bg-cyan-300 selection:text-black">
      <div className="pointer-events-none fixed inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 border-r border-white/[0.08] bg-[#090b0e]/90 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-2">
            <div className="grid size-9 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-200"><Network size={18} /></div>
            <div>
              <p className="text-sm font-semibold tracking-[0.16em]">NEXORA</p>
              <p className="text-[9px] uppercase tracking-[0.24em] text-zinc-600">AI Operations</p>
            </div>
          </div>

          <div className="mt-9 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActive(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${active === id ? 'bg-white text-black' : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200'}`}>
                <Icon size={16} strokeWidth={1.7} />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-auto rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400"><ShieldCheck size={14} className="text-emerald-300" /> Secure runtime</div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full w-[92%] rounded-full bg-emerald-300" /></div>
            <div className="mt-2 flex justify-between text-[9px] uppercase tracking-[0.14em] text-zinc-600"><span>Trust score</span><span>92%</span></div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.08] bg-[#07090b]/80 px-4 backdrop-blur-xl sm:px-6 xl:px-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileNav(true)} className="grid size-9 place-items-center rounded-xl border border-white/[0.08] lg:hidden"><Menu size={17} /></button>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">Workspace / Production</p>
                <p className="mt-0.5 text-sm font-medium">Global Operations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCommandOpen(true)} className="hidden items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-zinc-500 transition hover:border-white/[0.16] sm:flex"><Search size={14} /> Search anything <span className="rounded-md border border-white/[0.08] px-1.5 py-0.5 text-[9px]">⌘K</span></button>
              <button className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.025]"><Bell size={15} /></button>
              <button className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-2 py-1.5 text-xs"><span className="grid size-6 place-items-center rounded-lg bg-cyan-300 font-semibold text-black">SP</span><ChevronDown size={13} className="text-zinc-500" /></button>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
            <div className="flex flex-col gap-5 border-b border-white/[0.08] pb-7 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cyan-300"><span className="size-1.5 animate-pulse rounded-full bg-cyan-300" /> Live system</div>
                <h1 className="mt-3 max-w-4xl text-4xl font-medium tracking-[-0.055em] sm:text-5xl xl:text-6xl">Autonomous operations,<br className="hidden sm:block" /> under human control.</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">A command surface for orchestrating agents, automations, risk and intelligence across a modern enterprise.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCommandOpen(true)} className="flex items-center gap-2 rounded-xl border border-white/[0.12] px-4 py-2.5 text-xs text-zinc-300"><Command size={14} /> Command</button>
                <button className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-semibold text-black"><Sparkles size={14} /> Deploy agent</button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              <Metric label="Active agents" value="24" delta="+4 this week" icon={Bot} />
              <Metric label="Autonomous runs" value="18.4k" delta="+12.8%" icon={Zap} />
              <Metric label="Decision latency" value="1.8s" delta="-21.4%" icon={Cpu} />
              <Metric label="Health score" value="98.7" delta="Excellent" icon={CircleGauge} />
            </div>

            <div className="mt-6 grid gap-4 2xl:grid-cols-[1.45fr_.8fr]">
              <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
                  <div><p className="text-sm font-medium">Agent mesh</p><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600">Current execution layer</p></div>
                  <button className="rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-zinc-500">View all</button>
                </div>
                <div className="grid divide-y divide-white/[0.07]">
                  {agents.map((agent) => (
                    <div key={agent.id} className="grid gap-4 px-5 py-4 transition hover:bg-white/[0.025] md:grid-cols-[1.4fr_.65fr_.7fr_auto] md:items-center">
                      <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl border border-white/[0.09] bg-black text-xs text-cyan-200">{agent.id}</div><div><p className="text-sm font-medium">{agent.name}</p><p className="mt-0.5 text-xs text-zinc-600">{agent.role}</p></div></div>
                      <div><p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">Load</p><div className="mt-2 flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${agent.load}%` }} /></div><span className="text-xs text-zinc-500">{agent.load}%</span></div></div>
                      <div><p className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">Tasks</p><p className="mt-1 text-sm text-zinc-300">{agent.tasks} active</p></div>
                      <span className={`w-max rounded-full border px-2.5 py-1 text-[9px] ${agent.status === 'Running' ? 'border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300' : agent.status === 'Review' ? 'border-amber-300/20 bg-amber-300/[0.06] text-amber-200' : 'border-white/[0.08] text-zinc-500'}`}>{agent.status}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Signal intelligence</p><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600">24H decision graph</p></div><Database size={16} className="text-zinc-600" /></div>
                <div className="relative mt-8 h-48 overflow-hidden rounded-xl border border-white/[0.06] bg-black/40">
                  <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:24px_24px]" />
                  <svg viewBox="0 0 400 180" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true"><path d="M0 145 C45 142 48 112 94 118 S150 77 194 96 S240 37 282 58 S330 28 400 22" fill="none" stroke="rgba(103,232,249,.9)" strokeWidth="2"/><path d="M0 160 C55 150 64 135 116 139 S187 105 232 119 S302 78 400 91" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1"/></svg>
                  <div className="absolute bottom-4 left-4"><p className="text-3xl font-medium tracking-[-0.04em]">42.8M</p><p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-zinc-600">Signals processed</p></div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl border border-white/[0.06] py-3"><p className="text-sm">6.2k</p><p className="mt-1 text-[9px] text-zinc-600">Decisions</p></div><div className="rounded-xl border border-white/[0.06] py-3"><p className="text-sm">184</p><p className="mt-1 text-[9px] text-zinc-600">Escalations</p></div><div className="rounded-xl border border-white/[0.06] py-3"><p className="text-sm">99.4%</p><p className="mt-1 text-[9px] text-zinc-600">Confidence</p></div></div>
              </section>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4"><div><p className="text-sm font-medium">Automation fabric</p><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600">Business-critical loops</p></div><Workflow size={16} className="text-zinc-600" /></div>
                <div className="divide-y divide-white/[0.07]">{automations.map((item) => <div key={item.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4"><div><p className="text-sm">{item.name}</p><p className="mt-1 text-xs text-zinc-600">{item.runs} runs · {item.success} success</p></div><span className={`text-[9px] ${item.state === 'Live' ? 'text-emerald-300' : 'text-zinc-600'}`}>{item.state}</span><button className="grid size-8 place-items-center rounded-lg border border-white/[0.08]"><Play size={12} /></button></div>)}</div>
              </section>

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4"><div><p className="text-sm font-medium">Live activity</p><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600">Operational event stream</p></div><Activity size={16} className="text-zinc-600" /></div>
                <div className="divide-y divide-white/[0.07]">{activity.map(([actor, event, time]) => <div key={`${actor}-${time}`} className="flex gap-3 px-5 py-4"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-300"/><div className="min-w-0 flex-1"><p className="text-sm"><span className="font-medium text-white">{actor}</span> <span className="text-zinc-500">{event}</span></p><p className="mt-1 text-[10px] text-zinc-700">{time}</p></div></div>)}</div>
              </section>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {mobileNav && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#07090b] p-5 lg:hidden"><div className="flex items-center justify-between"><p className="text-sm font-semibold tracking-[0.16em]">NEXORA</p><button onClick={() => setMobileNav(false)} className="grid size-10 place-items-center rounded-xl border border-white/[0.08]"><X size={17}/></button></div><div className="mt-12 space-y-2">{navItems.map(({id,label,icon:Icon}) => <button key={id} onClick={() => {setActive(id);setMobileNav(false)}} className="flex w-full items-center gap-4 border-b border-white/[0.08] py-5 text-left text-2xl"><Icon size={20}/>{label}</button>)}</div></motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {commandOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCommandOpen(false)} className="fixed inset-0 z-[60] grid place-items-start bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"><motion.div initial={{ y: 18, scale: .98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0b0e12] shadow-2xl"><div className="flex items-center gap-3 border-b border-white/[0.08] px-4"><Search size={16} className="text-zinc-500"/><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search actions, agents, workflows..." className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-700"/><button onClick={() => setCommandOpen(false)} className="text-[10px] text-zinc-600">ESC</button></div><div className="p-2">{filteredCommands.map((item) => <button key={item} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"><Command size={14}/>{item}</button>)}</div></motion.div></motion.div>}
      </AnimatePresence>
    </main>
  );
}
