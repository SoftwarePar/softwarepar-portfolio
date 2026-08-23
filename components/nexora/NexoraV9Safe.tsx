'use client';

import {
  Activity, Bell, Bot, BrainCircuit, Check, ChevronRight, CircleDollarSign,
  Command, Database, FileClock, Gauge, Layers3, Menu, Play, Plus, Radar,
  Search, Settings, ShieldCheck, Sparkles, TerminalSquare, Users, Waypoints,
  Workflow, X, Zap, PlugZap, UserCheck
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type View = 'command'|'workflows'|'agents'|'automations'|'approvals'|'runtime'|'models'|'scenarios'|'analytics'|'governance'|'teams'|'audit'|'economics'|'integrations'|'settings';
type IconType = typeof Activity;
type NavItem = { id: View; label: string; icon: IconType; group: string; badge?: string };
type Metric = { label: string; value: string; delta: string; tone: 'violet'|'blue'|'green'|'amber'|'pink' };
type QuickAction = { label: string; icon: IconType };
type FeedItem = { title: string; detail: string; time: string; tone: string };

type NodeState = 'completed'|'running'|'waiting'|'pending';
type MissionNode = { id:string; title:string; subtitle:string; x:number; y:number; state:NodeState; icon:IconType; tone:string };

const nav: NavItem[] = [
  {id:'command',label:'Command Center',icon:Radar,group:'Home'},
  {id:'workflows',label:'Workflow Studio',icon:Workflow,group:'Operations'},
  {id:'agents',label:'Agent Fleet',icon:Bot,group:'Operations'},
  {id:'automations',label:'Automations',icon:Zap,group:'Operations'},
  {id:'approvals',label:'Human Review',icon:UserCheck,group:'Operations',badge:'3'},
  {id:'runtime',label:'Runtime Console',icon:TerminalSquare,group:'Operations'},
  {id:'models',label:'Model Router',icon:BrainCircuit,group:'Intelligence'},
  {id:'scenarios',label:'Scenarios',icon:Sparkles,group:'Intelligence',badge:'NEW'},
  {id:'analytics',label:'Analytics & Insights',icon:Gauge,group:'Intelligence'},
  {id:'governance',label:'Governance Center',icon:ShieldCheck,group:'Governance'},
  {id:'teams',label:'Teams & Access',icon:Users,group:'Governance'},
  {id:'audit',label:'Audit Trail',icon:FileClock,group:'Governance'},
  {id:'economics',label:'Economics',icon:CircleDollarSign,group:'Business'},
  {id:'integrations',label:'Integrations',icon:PlugZap,group:'Business'},
  {id:'settings',label:'Settings',icon:Settings,group:'System'},
];

const metrics: Metric[] = [
  {label:'Active missions',value:'24',delta:'+18%',tone:'violet'},
  {label:'Success rate',value:'98.6%',delta:'+2.7%',tone:'blue'},
  {label:'Value generated',value:'$2.41M',delta:'+24%',tone:'green'},
  {label:'Costs',value:'$347K',delta:'-6%',tone:'amber'},
  {label:'Human hours saved',value:'2,846',delta:'+22%',tone:'pink'},
];

const quickActions: QuickAction[] = [
  {label:'New Workflow',icon:Plus},{label:'Deploy Agent',icon:Bot},
  {label:'Create Scenario',icon:Sparkles},{label:'Run Simulation',icon:Play},
];

const feed: FeedItem[] = [
  {title:'Outreach Agent sent 143 emails',detail:'Sequence: Enterprise Expansion',time:'2m ago',tone:'text-violet-300'},
  {title:'Human review requested',detail:'Budget approval for $12,450',time:'4m ago',tone:'text-fuchsia-300'},
  {title:'Lead scored as High Intent',detail:'Acme Corp · Score: 92',time:'6m ago',tone:'text-sky-300'},
  {title:'Opportunity created',detail:'Acme Corp · $85,000',time:'8m ago',tone:'text-amber-300'},
  {title:'Data enrichment completed',detail:'245 new leads enriched',time:'10m ago',tone:'text-emerald-300'},
];

const nodes: MissionNode[] = [
  {id:'ingest',title:'Data Ingestion',subtitle:'CRM + product data',x:35,y:64,state:'completed',icon:Database,tone:'from-sky-400 to-blue-500'},
  {id:'score',title:'Lead Scoring',subtitle:'intent + fit model',x:248,y:64,state:'completed',icon:BrainCircuit,tone:'from-emerald-400 to-lime-400'},
  {id:'outreach',title:'Outreach Agent',subtitle:'running',x:465,y:64,state:'running',icon:Bot,tone:'from-lime-300 to-emerald-400'},
  {id:'review',title:'Human Review',subtitle:'waiting',x:690,y:64,state:'waiting',icon:UserCheck,tone:'from-amber-300 to-orange-400'},
  {id:'enrich',title:'Enrichment',subtitle:'completed',x:145,y:195,state:'completed',icon:Layers3,tone:'from-cyan-300 to-teal-400'},
  {id:'qualify',title:'Qualification',subtitle:'completed',x:385,y:195,state:'completed',icon:ShieldCheck,tone:'from-emerald-300 to-lime-400'},
  {id:'opportunity',title:'Create Opportunity',subtitle:'pending',x:650,y:195,state:'pending',icon:CircleDollarSign,tone:'from-violet-300 to-fuchsia-400'},
];

const card='rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(11,18,31,.96),rgba(7,12,22,.98))] shadow-[0_24px_80px_rgba(0,0,0,.35)]';
const stateTone: Record<NodeState,string> = {completed:'bg-emerald-400',running:'bg-lime-400 animate-pulse',waiting:'bg-amber-400',pending:'bg-violet-400'};

function MiniChart({tone}:{tone:Metric['tone']}){
  const color=tone==='green'?'#34d399':tone==='blue'?'#38bdf8':tone==='amber'?'#f59e0b':tone==='pink'?'#e879f9':'#a78bfa';
  return <svg viewBox="0 0 120 42" className="h-10 w-28"><path d="M2 34 C18 32 14 22 26 25 S40 34 48 20 S66 28 74 16 S88 9 96 14 S108 9 118 4" fill="none" stroke={color} strokeWidth="2"/></svg>;
}

function Logo(){return <div className="flex items-center gap-3"><div className="relative grid size-10 place-items-center overflow-hidden rounded-xl border border-violet-400/20 bg-violet-500/10"><span className="absolute h-8 w-2 rotate-[-35deg] rounded-full bg-cyan-300"/><span className="absolute h-8 w-2 rotate-[35deg] rounded-full bg-violet-400"/></div><div><p className="text-[15px] font-semibold tracking-[.22em]">NEXORA</p><p className="text-[9px] tracking-[.14em] text-zinc-500">AI AUTONOMY OS</p></div></div>}

function MetricCard({m}:{m:Metric}){return <motion.div whileHover={{y:-3}} className={`${card} p-4`}><div className="flex items-start justify-between"><div><p className="text-[9px] uppercase tracking-[.13em] text-zinc-500">{m.label}</p><p className="mt-2 text-[24px] font-semibold tracking-[-.04em]">{m.value}</p><p className={m.delta.startsWith('-')?'mt-2 text-[10px] text-amber-300':'mt-2 text-[10px] text-emerald-400'}>{m.delta}</p></div><MiniChart tone={m.tone}/></div></motion.div>}

function MissionNodeCard({node,running,reviewApproved}:{node:MissionNode;running:boolean;reviewApproved:boolean}){
  const Icon=node.icon; const dynamicState:NodeState=node.id==='review'&&reviewApproved?'completed':node.id==='opportunity'&&reviewApproved?'completed':node.id==='outreach'&&running?'running':node.state;
  return <motion.div animate={dynamicState==='running'?{boxShadow:['0 0 0 rgba(0,0,0,0)','0 0 32px rgba(132,204,22,.28)','0 0 0 rgba(0,0,0,0)']}:{}} transition={{repeat:Infinity,duration:1.8}} style={{left:node.x,top:node.y}} className="absolute w-[170px] rounded-2xl border border-white/[0.1] bg-[#09111f]/95 p-3 backdrop-blur-xl"><div className="flex items-center gap-3"><div className={`grid size-9 place-items-center rounded-xl bg-gradient-to-br ${node.tone} text-black`}><Icon size={17}/></div><div className="min-w-0"><p className="truncate text-[12px] font-semibold">{node.title}</p><div className="mt-1 flex items-center gap-1.5"><span className={`size-1.5 rounded-full ${stateTone[dynamicState]}`}/><span className="text-[9px] capitalize text-zinc-500">{dynamicState}</span></div></div></div></motion.div>;
}

function CommandCenter({flash}:{flash:(s:string)=>void}){
  const [running,setRunning]=useState(false); const [progress,setProgress]=useState(68); const [approved,setApproved]=useState(false);
  const run=()=>{if(running)return;setApproved(false);setProgress(18);setRunning(true);flash('Simulation started');const timer=window.setInterval(()=>setProgress(p=>{if(p>=84){window.clearInterval(timer);setRunning(false);return 86}return p+8}),320)};
  const approve=()=>{setApproved(true);setProgress(100);flash('Human review approved · opportunity created')};
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{metrics.map(m=><MetricCard key={m.label} m={m}/>)}</div>
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <section className={`${card} overflow-hidden`}><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4"><div><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Mission Flow</p><h2 className="mt-1 text-[18px] font-semibold">Q2 Revenue Acceleration</h2><p className="mt-1 text-[10px] text-zinc-500">Increase qualified pipeline by 35% with AI-driven outbound & nurturing</p></div><div className="flex items-center gap-4 text-[10px]"><span className="text-emerald-400">● {running?'Running':'Live'}</span><div className="flex items-center gap-2"><div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/[0.06]"><motion.div animate={{width:`${progress}%`}} className="h-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-lime-300"/></div><span>{progress}%</span></div><button onClick={run} className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5 hover:bg-white/[0.07]"><Play size={14}/></button></div></div>
        <div className="relative h-[360px] overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(62,105,255,.08),transparent_38%),linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] [background-size:auto,28px_28px,28px_28px]"><svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 340" preserveAspectRatio="none"><path d="M110 100 H250 M420 100 H500 M660 100 H720 M580 135 V225 H540 M315 135 V238 H390 M560 238 H720 V145" fill="none" stroke="#7c3aed" strokeOpacity=".65" strokeWidth="2" strokeDasharray="5 6"><animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.3s" repeatCount="indefinite"/></path></svg>{nodes.map(n=><MissionNodeCard key={n.id} node={n} running={running} reviewApproved={approved}/>)}{!approved&&<motion.button initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} onClick={approve} className="absolute bottom-4 right-4 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[10px] text-amber-200">Approve human review</motion.button>}</div></section>
      <div className="space-y-4"><section className={`${card} p-4`}><div className="mb-3 flex justify-between"><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Activity Feed</p><span className="text-[9px] text-zinc-600">View all</span></div>{feed.map((f,i)=><motion.div key={f.title} initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} transition={{delay:i*.04}} className="flex gap-3 rounded-xl px-2 py-2.5 hover:bg-white/[0.03]"><Activity size={13} className={f.tone}/><div className="min-w-0 flex-1"><p className="truncate text-[10px]">{f.title}</p><p className="truncate text-[9px] text-zinc-600">{f.detail}</p></div><span className="text-[8px] text-zinc-700">{f.time}</span></motion.div>)}</section><section className={`${card} p-4`}><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">System Health</p><p className="mt-2 text-sm font-semibold text-emerald-300">Excellent</p><p className="text-[9px] text-emerald-500">All systems operational</p></div><div className="grid size-20 place-items-center rounded-full border-2 border-emerald-400/40 text-xl font-semibold text-emerald-300 shadow-[0_0_28px_rgba(52,211,153,.2)]">100</div></div></section></div>
    </div>
    <div className="grid gap-4 xl:grid-cols-[1fr_1.25fr_1fr_1.1fr]"><section className={`${card} p-4`}><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Scenarios</p>{['Q2 Revenue Acceleration','Risk Mitigation & Compliance','Customer Onboarding 2.0','Operational Efficiency'].map((x,i)=><button key={x} className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-2.5 text-left text-[10px] hover:border-violet-400/20"><span>{x}</span><span className={i===3?'text-amber-300':'text-emerald-400'}>{i===0?'Running':i===3?'Draft':'Ready'}</span></button>)}</section><section className={`${card} p-4`}><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Value Over Time</p><p className="mt-3 text-2xl font-semibold">$2.41M <span className="text-[10px] text-emerald-400">↑ 18%</span></p><svg viewBox="0 0 420 150" className="mt-2 h-36 w-full"><path d="M0 125 C30 122 26 93 55 100 S92 105 110 72 S148 95 172 69 S215 72 239 43 S275 62 299 36 S340 58 360 27 S390 38 420 14" fill="none" stroke="#a78bfa" strokeWidth="2"/></svg></section><section className={`${card} p-4`}><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Top Agents</p>{['Outreach Agent','Lead Scoring Agent','Research Agent','Enrichment Agent'].map((x,i)=><div key={x} className="flex items-center gap-3 border-b border-white/[0.05] py-3 last:border-0"><div className="grid size-8 place-items-center rounded-full bg-violet-500/10 text-violet-300"><Bot size={13}/></div><div className="flex-1"><p className="text-[10px]">{x}</p><p className="text-[8px] text-zinc-600">{1247-i*180} runs</p></div><span className="text-[10px]">{(98.3+i*.2).toFixed(1)}%</span></div>)}</section><section className={`${card} p-4`}><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Quick Actions</p><div className="mt-3 grid grid-cols-2 gap-2">{quickActions.map(({label,icon:Icon})=><motion.button whileHover={{y:-2}} key={label} onClick={()=>flash(label)} className="flex min-h-20 flex-col items-start justify-between rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.09] to-transparent p-3 text-left hover:border-violet-400/30"><div className="grid size-8 place-items-center rounded-xl bg-violet-500/15 text-violet-300"><Icon size={15}/></div><span className="text-[9px]">{label}</span></motion.button>)}</div></section></div>
    <section className={`${card} overflow-hidden`}><div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3"><TerminalSquare size={14} className="text-violet-300"/><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Runtime Console</p><span className="text-[8px] text-emerald-400">● 128 events/sec</span></div><div className="grid grid-cols-[80px_130px_1fr_90px] gap-3 px-4 py-3 font-mono text-[9px] text-zinc-500"><span>12:45:32</span><span className="text-sky-300">Outreach Agent</span><span>Email batch completed (143 sent)</span><span className="text-emerald-400">Success</span><span>12:45:35</span><span className="text-amber-300">Human Review</span><span>Approval requested (Budget: $12,450)</span><span className="text-amber-400">Waiting</span></div></section>
  </div>;
}

function GenericModule({view,flash}:{view:View;flash:(s:string)=>void}){
  const title=nav.find(n=>n.id===view)?.label ?? 'Module';
  return <div className="space-y-4"><div className="flex items-end justify-between gap-3"><div><p className="text-[9px] uppercase tracking-[.18em] text-violet-300">NEXORA / {view}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">{title}</h1><p className="mt-2 text-sm text-zinc-500">Enterprise controls, live telemetry and autonomous operations.</p></div><button onClick={()=>flash(`New ${title} action`)} className="rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-[10px] text-violet-200"><Plus size={13} className="mr-2 inline"/>New action</button></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{['Live Operations','Performance','Controls','Recent Activity'].map((b,i)=><motion.section whileHover={{y:-3}} key={b} className={`${card} min-h-40 p-4`}><div className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-300">{i===0?<Radar size={16}/>:i===1?<Gauge size={16}/>:i===2?<ShieldCheck size={16}/>:<Activity size={16}/>}</div><p className="mt-7 text-sm font-semibold">{b}</p><p className="mt-1 text-[10px] text-zinc-600">Realtime enterprise state and controls.</p></motion.section>)}</div><section className={`${card} grid min-h-[340px] place-items-center p-5`}><div className="text-center"><div className="mx-auto grid size-16 place-items-center rounded-3xl border border-violet-400/20 bg-violet-500/10 text-violet-300"><Waypoints size={28}/></div><p className="mt-4 text-sm font-medium">Live {title} workspace</p><p className="mt-1 text-[10px] text-zinc-600">Select an object or run an action to inspect details.</p></div></section></div>;
}

export default function NexoraV9Safe(){
  const [view,setView]=useState<View>('command'); const [mobile,setMobile]=useState(false); const [palette,setPalette]=useState(false); const [notice,setNotice]=useState(false); const [toast,setToast]=useState(''); const [query,setQuery]=useState('');
  const groups=useMemo(()=>Array.from(new Set(nav.map(n=>n.group))),[]); const flash=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(''),2200)};
  useEffect(()=>{const fn=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPalette(v=>!v)}if(e.key==='Escape'){setPalette(false);setNotice(false);setMobile(false)}};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[]);
  const choose=(id:View)=>{setView(id);setMobile(false);setPalette(false)};
  return <main className="min-h-screen bg-[#030712] text-[#eef2ff] selection:bg-violet-400 selection:text-black"><div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_74%_-10%,rgba(109,40,217,.18),transparent_28%),radial-gradient(circle_at_18%_22%,rgba(14,165,233,.07),transparent_24%)]"/><div className="relative flex min-h-screen"><aside className="sticky top-0 hidden h-screen w-[245px] shrink-0 border-r border-white/[0.07] bg-[#050914]/95 p-4 backdrop-blur-2xl lg:flex lg:flex-col"><Logo/><div className="mt-6 flex-1 overflow-y-auto pr-1">{groups.map(group=><div key={group} className="mb-5"><p className="mb-2 px-2 text-[8px] uppercase tracking-[.13em] text-zinc-700">{group==='Home'?'':group}</p>{nav.filter(n=>n.group===group).map(({id,label,icon:Icon,badge})=><button key={id} onClick={()=>choose(id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] transition ${view===id?'border border-violet-400/20 bg-gradient-to-r from-violet-500/20 to-violet-500/[0.05] text-white':'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200'}`}><Icon size={14}/><span className="flex-1">{label}</span>{badge&&<span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[8px] text-violet-300">{badge}</span>}{view===id&&<ChevronRight size={12} className="text-violet-300"/>}</button>)}</div>)}</div></aside><section className="min-w-0 flex-1"><header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#030712]/80 px-4 py-3 backdrop-blur-2xl md:px-6"><div className="flex items-center gap-3"><button onClick={()=>setMobile(true)} className="grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] lg:hidden"><Menu size={16}/></button><div className="hidden flex-1 md:block"><h1 className="text-[16px] font-semibold">Good morning, Pablo 👋</h1><p className="mt-0.5 text-[10px] text-zinc-600">Here’s what’s happening across your autonomous operations</p></div><button onClick={()=>setPalette(true)} className="ml-auto flex h-10 w-full max-w-[360px] items-center gap-2 rounded-xl border border-violet-400/15 bg-violet-500/[0.05] px-3 text-[10px] text-zinc-500"><Command size={14}/><span className="flex-1 text-left">⌘K to search or run a command</span></button><button onClick={()=>setNotice(v=>!v)} className="relative grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03]"><Bell size={15}/><span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-violet-500 text-[8px]">7</span></button></div></header><div className="p-4 md:p-6">{view==='command'?<CommandCenter flash={flash}/>:<GenericModule view={view} flash={flash}/>}</div></section></div>
  <AnimatePresence>{mobile&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 overflow-y-auto bg-[#030712]/95 p-4 backdrop-blur-2xl lg:hidden"><div className="flex items-center justify-between"><Logo/><button onClick={()=>setMobile(false)} className="grid size-10 place-items-center rounded-xl border border-white/[0.08]"><X size={16}/></button></div><div className="mt-6 grid gap-2">{nav.map(({id,label,icon:Icon})=><button key={id} onClick={()=>choose(id)} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-left text-sm"><Icon size={16}/>{label}</button>)}</div></motion.div>}</AnimatePresence>
  <AnimatePresence>{palette&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setPalette(false)} className="fixed inset-0 z-[70] grid place-items-start bg-black/65 px-4 pt-[12vh] backdrop-blur-sm"><motion.div initial={{y:-12,scale:.98}} animate={{y:0,scale:1}} onClick={e=>e.stopPropagation()} className="w-full max-w-2xl rounded-2xl border border-violet-400/20 bg-[#07101d] p-3"><div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3"><Search size={15}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search modules, agents or actions…" className="h-11 flex-1 bg-transparent text-sm outline-none"/></div><div className="mt-2 max-h-80 overflow-auto">{nav.filter(n=>n.label.toLowerCase().includes(query.toLowerCase())).map(({id,label,icon:Icon})=><button key={id} onClick={()=>choose(id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-white/[0.04]"><Icon size={15} className="text-violet-300"/>{label}<ChevronRight size={13} className="ml-auto text-zinc-700"/></button>)}</div></motion.div></motion.div>}</AnimatePresence>
  <AnimatePresence>{notice&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="fixed right-5 top-[68px] z-[65] w-[340px] rounded-2xl border border-white/[0.08] bg-[#07101d] p-4"><div className="flex justify-between"><p className="text-sm font-semibold">Notifications</p><button onClick={()=>setNotice(false)}><X size={14}/></button></div><div className="mt-3 space-y-2">{feed.slice(0,4).map(f=><div key={f.title} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><p className="text-[10px]">{f.title}</p><p className="mt-1 text-[9px] text-zinc-600">{f.detail}</p></div>)}</div></motion.div>}</AnimatePresence>
  <AnimatePresence>{toast&&<motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:18}} className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-[10px] text-emerald-200"><Check size={13} className="mr-2 inline"/>{toast}</motion.div>}</AnimatePresence>
  </main>;
}
