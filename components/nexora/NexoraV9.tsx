'use client';

import {
  Activity, Bell, Bot, BrainCircuit, ChartNoAxesCombined, Check, ChevronRight,
  CircleDollarSign, Command, Cpu, Database, FileClock, Gauge, GitBranch,
  Grid2X2, Layers3, LockKeyhole, Menu, Network, Play, Plus, Radar, Search,
  Settings, ShieldCheck, SlidersHorizontal, Sparkles, TerminalSquare, Users,
  Waypoints, Workflow, X, Zap, ZoomIn, ZoomOut, RotateCcw, Pause, Send,
  PlugZap, Boxes, UserCheck, ShieldAlert, ChevronDown, ArrowUpRight, Clock3,
  CircleDot, WandSparkles, PanelRightOpen, RefreshCw, KeyRound
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type View = 'command'|'workflows'|'agents'|'automations'|'approvals'|'runtime'|'models'|'scenarios'|'analytics'|'governance'|'teams'|'audit'|'economics'|'integrations'|'settings';
type IconType = typeof Activity;
type NodeState = 'completed'|'running'|'waiting'|'pending'|'blocked';

type MissionNode = { id:string; title:string; subtitle:string; state:NodeState; x:number; y:number; icon:IconType; tone:'blue'|'green'|'lime'|'amber'|'violet'|'cyan' };
type Agent = { name:string; role:string; runs:number; score:string; tone:string };
type Feed = { title:string; detail:string; time:string; tone:string };

type NavItem = { id:View; label:string; icon:IconType; group:string; badge?:string };

const nav: NavItem[] = [
  {id:'command',label:'Command Center',icon:Radar,group:'Home'},
  {id:'workflows',label:'Workflow Studio',icon:Workflow,group:'Operations'},
  {id:'agents',label:'Agent Fleet',icon:Bot,group:'Operations'},
  {id:'automations',label:'Automations',icon:Zap,group:'Operations'},
  {id:'approvals',label:'Human Review',icon:UserCheck,group:'Operations',badge:'3'},
  {id:'runtime',label:'Runtime Console',icon:TerminalSquare,group:'Operations'},
  {id:'models',label:'Model Router',icon:BrainCircuit,group:'Intelligence'},
  {id:'scenarios',label:'Scenarios',icon:Sparkles,group:'Intelligence',badge:'NEW'},
  {id:'analytics',label:'Analytics & Insights',icon:ChartNoAxesCombined,group:'Intelligence'},
  {id:'governance',label:'Governance Center',icon:ShieldCheck,group:'Governance'},
  {id:'teams',label:'Teams & Access',icon:Users,group:'Governance'},
  {id:'audit',label:'Audit Trail',icon:FileClock,group:'Governance'},
  {id:'economics',label:'Economics',icon:CircleDollarSign,group:'Business'},
  {id:'integrations',label:'Integrations',icon:PlugZap,group:'Business'},
  {id:'settings',label:'Settings',icon:Settings,group:'System'},
];

const seedNodes: MissionNode[] = [
  {id:'ingest',title:'Data Ingestion',subtitle:'CRM + product data',state:'completed',x:40,y:80,icon:Database,tone:'blue'},
  {id:'score',title:'Lead Scoring',subtitle:'intent + fit model',state:'completed',x:250,y:80,icon:BrainCircuit,tone:'green'},
  {id:'outreach',title:'Outreach Agent',subtitle:'running',state:'running',x:470,y:80,icon:Bot,tone:'lime'},
  {id:'review',title:'Human Review',subtitle:'waiting',state:'waiting',x:700,y:80,icon:UserCheck,tone:'amber'},
  {id:'enrich',title:'Enrichment',subtitle:'completed',state:'completed',x:155,y:205,icon:Layers3,tone:'cyan'},
  {id:'qualify',title:'Qualification',subtitle:'completed',state:'completed',x:390,y:205,icon:ShieldCheck,tone:'green'},
  {id:'opportunity',title:'Create Opportunity',subtitle:'pending',state:'pending',x:650,y:205,icon:CircleDollarSign,tone:'violet'},
];

const agents: Agent[] = [
  {name:'Outreach Agent',role:'Revenue execution',runs:1247,score:'98.3%',tone:'text-amber-300'},
  {name:'Lead Scoring Agent',role:'Intent intelligence',runs:892,score:'97.8%',tone:'text-emerald-300'},
  {name:'Research Agent',role:'Market context',runs:675,score:'99.1%',tone:'text-cyan-300'},
  {name:'Enrichment Agent',role:'Data expansion',runs:543,score:'98.6%',tone:'text-blue-300'},
];

const feed: Feed[] = [
  {title:'Outreach Agent sent 143 emails',detail:'Sequence: Enterprise Expansion',time:'2m ago',tone:'bg-violet-500/15 text-violet-300'},
  {title:'Human review requested',detail:'Budget approval for $12,450',time:'4m ago',tone:'bg-fuchsia-500/15 text-fuchsia-300'},
  {title:'Lead scored as High Intent',detail:'Acme Corp · Score: 92',time:'6m ago',tone:'bg-blue-500/15 text-blue-300'},
  {title:'Opportunity created',detail:'Acme Corp · $85,000',time:'8m ago',tone:'bg-amber-500/15 text-amber-300'},
  {title:'Data enrichment completed',detail:'245 new leads enriched',time:'10m ago',tone:'bg-emerald-500/15 text-emerald-300'},
];

const metrics = [
  ['Active missions','24','+18%','violet'],['Success rate','98.6%','+2.7%','blue'],['Value generated','$2.41M','+24%','green'],['Costs','$347K','-6%','amber'],['Human hours saved','2,846','+22%','pink'],
] as const;

const toneClass: Record<string,string> = {
  violet:'from-violet-400 to-fuchsia-400', blue:'from-sky-400 to-blue-500', green:'from-emerald-400 to-lime-400', amber:'from-amber-400 to-orange-400', pink:'from-fuchsia-400 to-pink-400', cyan:'from-cyan-400 to-teal-400', lime:'from-lime-400 to-emerald-400'
};

const stateDot: Record<NodeState,string> = {
  completed:'bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,.75)]', running:'bg-lime-400 shadow-[0_0_14px_rgba(163,230,53,.9)] animate-pulse', waiting:'bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,.7)]', pending:'bg-violet-400 shadow-[0_0_14px_rgba(167,139,250,.7)]', blocked:'bg-rose-400'
};

const card = 'rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(11,18,31,.96),rgba(7,12,22,.98))] shadow-[0_24px_80px_rgba(0,0,0,.35)]';

function TinyChart({tone='violet'}:{tone?:string}) {
  return <svg viewBox="0 0 120 42" className="h-10 w-28 overflow-visible"><defs><linearGradient id={`g-${tone}`} x1="0" x2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".15"/><stop offset="1" stopColor="currentColor" stopOpacity=".75"/></linearGradient></defs><path d="M2 34 C18 32 14 22 26 25 S40 34 48 20 S66 28 74 16 S88 9 96 14 S108 9 118 4" fill="none" stroke="currentColor" strokeWidth="2" className={tone==='green'?'text-emerald-400':tone==='blue'?'text-sky-400':tone==='amber'?'text-amber-400':tone==='pink'?'text-fuchsia-400':'text-violet-400'}/></svg>
}

function Logo() {
  return <div className="flex items-center gap-3"><div className="relative grid size-10 place-items-center overflow-hidden rounded-xl border border-violet-400/20 bg-violet-500/10 shadow-[0_0_30px_rgba(124,58,237,.22)]"><span className="absolute h-8 w-2 rotate-[-35deg] rounded-full bg-cyan-300/90"/><span className="absolute h-8 w-2 rotate-[35deg] rounded-full bg-violet-400/90"/></div><div><p className="text-[15px] font-semibold tracking-[.22em]">NEXORA</p><p className="text-[9px] tracking-[.14em] text-zinc-500">AI AUTONOMY OS</p></div></div>
}

function MetricCard({label,value,delta,tone}:{label:string;value:string;delta:string;tone:string}) {
  return <motion.div whileHover={{y:-3}} className={`${card} group p-4 transition`}><div className="flex items-start justify-between"><div><p className="text-[9px] uppercase tracking-[.13em] text-zinc-500">{label}</p><p className="mt-2 text-[24px] font-semibold tracking-[-.04em]">{value}</p><p className={delta.startsWith('-')?'mt-2 text-[10px] font-medium text-amber-300':'mt-2 text-[10px] font-medium text-emerald-400'}>{delta}</p></div><TinyChart tone={tone}/></div></motion.div>
}

function WorkflowNode({node,active}:{node:MissionNode;active:boolean}) {
  const Icon=node.icon; const grad=toneClass[node.tone];
  return <motion.div animate={active?{boxShadow:['0 0 0 rgba(0,0,0,0)','0 0 32px rgba(132,204,22,.28)','0 0 0 rgba(0,0,0,0)']}:{}} transition={{repeat:Infinity,duration:1.8}} style={{left:node.x,top:node.y}} className={`absolute w-[170px] rounded-2xl border bg-[#09111f]/95 p-3 ${active?'border-lime-400/60':'border-white/[0.10]'} backdrop-blur-xl`}><div className="flex items-center gap-3"><div className={`grid size-9 place-items-center rounded-xl bg-gradient-to-br ${grad} text-[#041018] shadow-lg`}><Icon size={17}/></div><div className="min-w-0"><p className="truncate text-[12px] font-semibold">{node.title}</p><div className="mt-1 flex items-center gap-1.5"><span className={`size-1.5 rounded-full ${stateDot[node.state]}`}/><span className="text-[9px] capitalize text-zinc-500">{node.state}</span></div></div></div></motion.div>
}

function RingStatus() {
  return <div className="relative grid size-[92px] place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.04]"><div className="absolute inset-2 rounded-full border border-emerald-400/20"/><div className="absolute inset-4 rounded-full border-2 border-emerald-400 shadow-[0_0_28px_rgba(52,211,153,.24)]"/><div className="text-center"><p className="text-xl font-semibold text-emerald-300">100</p><p className="text-[8px] text-emerald-400/70">HEALTH</p></div></div>
}

function CommandCenter({onAction}:{onAction:(s:string)=>void}) {
  const [simulating,setSimulating]=useState(false); const [progress,setProgress]=useState(68); const [review,setReview]=useState(true);
  const run=()=>{if(simulating)return;setSimulating(true);setProgress(12);const id=window.setInterval(()=>setProgress(p=>{if(p>=86){window.clearInterval(id);setReview(true);setSimulating(false);return 86}return p+8}),350);onAction('Simulation started')};
  const approve=()=>{setReview(false);setProgress(100);onAction('Human review approved · opportunity created')};
  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{metrics.map(([l,v,d,t])=><MetricCard key={l} label={l} value={v} delta={d} tone={t}/>)}</div>
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className={`${card} overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4"><div><div className="flex items-center gap-2"><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Mission Flow</p><span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[9px] text-violet-300">Enterprise</span></div><h2 className="mt-1 text-[18px] font-semibold">Q2 Revenue Acceleration</h2><p className="mt-1 text-[10px] text-zinc-500">Increase qualified pipeline by 35% with AI-driven outbound & nurturing</p></div><div className="flex items-center gap-5 text-[10px]"><div><p className="text-zinc-600">STATUS</p><p className="mt-1 text-emerald-400">● {simulating?'Running':'Live'}</p></div><div><p className="text-zinc-600">PROGRESS</p><div className="mt-1 flex items-center gap-2"><div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/[0.06]"><motion.div animate={{width:`${progress}%`}} className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-lime-300"/></div><span>{progress}%</span></div></div><button onClick={run} className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 hover:bg-white/[0.07]"><Play size={14}/></button></div></div>
        <div className="relative h-[360px] overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(62,105,255,.08),transparent_38%),linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] [background-size:auto,28px_28px,28px_28px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 340" preserveAspectRatio="none"><defs><linearGradient id="flow" x1="0" x2="1"><stop offset="0" stopColor="#38bdf8"/><stop offset=".55" stopColor="#84cc16"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs><path d="M110 116 H250 M420 116 H500 M660 116 H720 M590 147 V225 H540 M315 147 V245 H390 M560 245 H720 V155" fill="none" stroke="url(#flow)" strokeOpacity=".65" strokeWidth="2" strokeDasharray="5 6"><animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.3s" repeatCount="indefinite"/></path></svg>
          {seedNodes.map(n=><WorkflowNode key={n.id} node={{...n,state:n.id==='review'?(review?'waiting':'completed'):n.id==='opportunity'?(review?'pending':'completed'):n.id==='outreach'?(simulating?'running':'running'):n.state}} active={n.id==='outreach'&&simulating}/>) }
          <div className="absolute bottom-4 left-4 flex items-center gap-2"><button className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-black/30 hover:bg-white/[0.05]"><ZoomIn size={14}/></button><button className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-black/30 hover:bg-white/[0.05]"><ZoomOut size={14}/></button><button className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-black/30 hover:bg-white/[0.05]"><RotateCcw size={14}/></button></div>
          {review&&<motion.button initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} onClick={approve} className="absolute bottom-4 right-4 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-[10px] text-amber-200 shadow-[0_0_32px_rgba(251,191,36,.08)]">Approve human review</motion.button>}
        </div>
      </div>
      <div className="space-y-4">
        <div className={`${card} p-4`}><div className="mb-3 flex items-center justify-between"><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Activity Feed</p><button className="text-[9px] text-zinc-500 hover:text-white">View all</button></div><div className="space-y-1">{feed.map((f,i)=><motion.div key={f.title} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:i*.05}} className="flex gap-3 rounded-xl px-2 py-2.5 hover:bg-white/[0.035]"><div className={`grid size-8 shrink-0 place-items-center rounded-xl ${f.tone}`}><Activity size={13}/></div><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-medium">{f.title}</p><p className="mt-0.5 truncate text-[9px] text-zinc-600">{f.detail}</p></div><span className="text-[8px] text-zinc-700">{f.time}</span></motion.div>)}</div></div>
        <div className={`${card} p-4`}><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">System Health</p><p className="mt-2 text-sm font-semibold text-emerald-300">Excellent</p><p className="text-[9px] text-emerald-500">All systems operational</p></div><RingStatus/></div><div className="mt-4 space-y-2">{['LLM Services','Vector Database','Agent Orchestrator','Tool Execution'].map((x,i)=><div key={x} className="flex items-center justify-between text-[9px]"><span className="text-zinc-400">● {x}</span><span className="text-emerald-400">{99.9-i*.1}%</span></div>)}</div></div>
      </div>
    </div>
    <div className="grid gap-4 xl:grid-cols-[1fr_1.35fr_1.05fr_1.15fr]">
      <div className={`${card} p-4`}><div className="mb-3 flex justify-between"><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Scenarios</p><span className="text-[9px] text-zinc-600">View all</span></div>{[['Q2 Revenue Acceleration','Running','violet'],['Risk Mitigation & Compliance','Ready','blue'],['Customer Onboarding 2.0','Ready','green'],['Operational Efficiency','Draft','amber']].map(([a,b,t])=><button key={a} className="mb-2 flex w-full items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-2.5 text-left hover:border-violet-400/20 hover:bg-violet-400/[0.05]"><div className="flex items-center gap-2"><div className={`grid size-7 place-items-center rounded-lg bg-gradient-to-br ${toneClass[t]}`}><Sparkles size={12} className="text-black"/></div><span className="text-[10px]">{a}</span></div><span className="text-[8px] text-emerald-400">{b}</span></button>)}</div>
      <div className={`${card} p-4`}><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Value Over Time</p><p className="mt-3 text-2xl font-semibold">$2.41M <span className="text-[10px] text-emerald-400">↑ 18%</span></p></div><div className="flex gap-1 text-[8px] text-zinc-500"><span>7D</span><span className="rounded bg-violet-500/15 px-2 py-1 text-violet-300">30D</span><span>90D</span></div></div><svg viewBox="0 0 420 150" className="mt-2 h-36 w-full"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8b5cf6" stopOpacity=".45"/><stop offset="1" stopColor="#8b5cf6" stopOpacity="0"/></linearGradient></defs><path d="M0 125 C30 122 26 93 55 100 S92 105 110 72 S148 95 172 69 S215 72 239 43 S275 62 299 36 S340 58 360 27 S390 38 420 14 L420 150 L0 150Z" fill="url(#area)"/><path d="M0 125 C30 122 26 93 55 100 S92 105 110 72 S148 95 172 69 S215 72 239 43 S275 62 299 36 S340 58 360 27 S390 38 420 14" fill="none" stroke="#a78bfa" strokeWidth="2"/></svg></div>
      <div className={`${card} p-4`}><div className="mb-3 flex justify-between"><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Top Agents</p><span className="text-[9px] text-zinc-600">View all</span></div>{agents.map((a,i)=><div key={a.name} className="flex items-center gap-3 border-b border-white/[0.05] py-2.5 last:border-0"><div className={`grid size-8 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] ${a.tone}`}><Bot size={13}/></div><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-medium">{a.name}</p><p className="text-[8px] text-zinc-600">{a.runs.toLocaleString()} runs</p></div><div className="text-right"><p className="text-[10px]">{a.score}</p><TinyChart tone={i===0?'violet':i===1?'green':'blue'}/></div></div>)}</div>
      <div className={`${card} p-4`}><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Quick Actions</p><div className="mt-3 grid grid-cols-2 gap-2">{[['New Workflow',Plus],['Deploy Agent',Bot],['Create Scenario',Sparkles],['Run Simulation',Play]].map(([label,Icon])=><motion.button whileHover={{y:-2}} key={label as string} onClick={()=>onAction(label as string)} className="flex min-h-20 flex-col items-start justify-between rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.09] to-transparent p-3 text-left hover:border-violet-400/30"><div className="grid size-8 place-items-center rounded-xl bg-violet-500/15 text-violet-300"><Icon size={15}/></div><span className="text-[9px]">{label as string}</span></motion.button>)}</div></div>
    </div>
    <div className={`${card} overflow-hidden`}><div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3"><div className="flex items-center gap-2"><TerminalSquare size={14} className="text-violet-300"/><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Runtime Console</p><span className="text-[8px] text-emerald-400">● 128 events/sec</span></div><button className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-[8px] text-zinc-400">Open Console</button></div><div className="grid grid-cols-[80px_130px_1fr_110px] gap-3 px-4 py-3 font-mono text-[9px] text-zinc-500"><span>12:45:32</span><span className="text-sky-300">Outreach Agent</span><span>Email batch completed (143 sent)</span><span className="text-emerald-400">Success</span><span>12:45:35</span><span className="text-amber-300">Human Review</span><span>Approval requested (Budget: $12,450)</span><span className="text-amber-400">Waiting</span></div></div>
  </div>
}

function GenericView({view,onAction}:{view:View;onAction:(s:string)=>void}) {
  const title:Record<View,string>={command:'Command Center',workflows:'Workflow Studio',agents:'Agent Fleet',automations:'Automations',approvals:'Human Review',runtime:'Runtime Console',models:'Model Router',scenarios:'Scenarios',analytics:'Analytics & Insights',governance:'Governance Center',teams:'Teams & Access',audit:'Audit Trail',economics:'Economics',integrations:'Integrations',settings:'Settings'};
  const blocks = view==='governance'?['Authority Gates','Policy Coverage','Risk Thresholds','Regional Controls']:view==='economics'?['Cost per Run','Value Created','Budget Guardrails','ROI by Mission']:view==='integrations'?['Salesforce','HubSpot','Slack','PostgreSQL']:view==='models'?['NXR-4 Enterprise','Claude Opus','GPT-5 Class','Gemini Pro']:view==='agents'?['Atlas','Nova','Sable','Echo']:view==='workflows'?['Revenue Acceleration','Risk Mitigation','Onboarding 2.0','Data Quality Mesh']:['Live Operations','Performance','Controls','Recent Activity'];
  return <div className="space-y-4"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[9px] uppercase tracking-[.18em] text-violet-300">NEXORA / {view}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">{title[view]}</h1><p className="mt-2 text-sm text-zinc-500">Enterprise-grade controls, telemetry and autonomous operations.</p></div><button onClick={()=>onAction(`New ${title[view]} action`)} className="rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-[10px] text-violet-200 hover:bg-violet-500/15"><Plus size={13} className="mr-2 inline"/>New action</button></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{blocks.map((b,i)=><motion.div whileHover={{y:-3}} key={b} className={`${card} min-h-40 p-4`}><div className="flex items-center justify-between"><div className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-300">{i===0?<Radar size={16}/>:i===1?<Gauge size={16}/>:i===2?<ShieldCheck size={16}/>:<Activity size={16}/>}</div><span className="text-[8px] text-emerald-400">● Live</span></div><p className="mt-7 text-sm font-semibold">{b}</p><p className="mt-1 text-[10px] text-zinc-600">Interactive enterprise module with realtime state and controls.</p><div className="mt-5 h-1.5 rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{width:`${62+i*8}%`}}/></div></motion.div>)}</div><div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]"><div className={`${card} p-5`}><div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Operational Surface</p><button className="text-[9px] text-zinc-500">Configure</button></div><div className="mt-5 grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-white/[0.08] bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,.12),transparent_45%)]"><div className="text-center"><div className="mx-auto grid size-16 place-items-center rounded-3xl border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-[0_0_50px_rgba(139,92,246,.15)]"><Waypoints size={28}/></div><p className="mt-4 text-sm font-medium">Live {title[view]} workspace</p><p className="mt-1 text-[10px] text-zinc-600">Select an object or run an action to inspect details.</p></div></div></div><div className={`${card} p-5`}><p className="text-[10px] uppercase tracking-[.12em] text-zinc-500">Controls</p><div className="mt-4 space-y-3">{['Realtime mode','Human authority','Audit logging','Cost protection'].map((x,i)=><div key={x} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3"><div><p className="text-[10px]">{x}</p><p className="text-[8px] text-zinc-600">Policy active</p></div><button onClick={()=>onAction(`${x} toggled`)} className="relative h-7 w-12 rounded-full border border-violet-400/20 bg-violet-500/20"><span className="absolute right-1 top-1 size-5 rounded-full bg-gradient-to-br from-violet-300 to-cyan-300 shadow-[0_0_18px_rgba(139,92,246,.45)]"/></button></div>)}</div></div></div></div>
}

export default function NexoraV9(){
  const [view,setView]=useState<View>('command'); const [mobile,setMobile]=useState(false); const [palette,setPalette]=useState(false); const [notice,setNotice]=useState(false); const [toast,setToast]=useState(''); const [query,setQuery]=useState('');
  const grouped=useMemo(()=>Array.from(new Set(nav.map(n=>n.group))),[]); const flash=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(''),2200)};
  useEffect(()=>{const fn=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPalette(v=>!v)}if(e.key==='Escape'){setPalette(false);setNotice(false);setMobile(false)}};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[]);
  const choose=(id:View)=>{setView(id);setMobile(false);setPalette(false)};
  return <main className="min-h-screen bg-[#030712] text-[#eef2ff] selection:bg-violet-400 selection:text-black"><div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_74%_-10%,rgba(109,40,217,.18),transparent_28%),radial-gradient(circle_at_18%_22%,rgba(14,165,233,.07),transparent_24%)]"/>
    <div className="relative flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[245px] shrink-0 border-r border-white/[0.07] bg-[#050914]/95 p-4 backdrop-blur-2xl lg:flex lg:flex-col"><Logo/><div className="mt-6 flex-1 overflow-y-auto pr-1">{grouped.map(group=><div key={group} className="mb-5"><p className="mb-2 px-2 text-[8px] uppercase tracking-[.13em] text-zinc-700">{group==='Home'?'':group}</p>{nav.filter(n=>n.group===group).map(({id,label,icon:Icon,badge})=><button key={id} onClick={()=>choose(id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[10px] transition ${view===id?'border border-violet-400/20 bg-gradient-to-r from-violet-500/20 to-violet-500/[0.05] text-white shadow-[0_0_28px_rgba(124,58,237,.10)]':'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200'}`}><Icon size={14}/><span className="flex-1">{label}</span>{badge&&<span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[8px] text-violet-300">{badge}</span>}{view===id&&<ChevronRight size={12} className="text-violet-300"/>}</button>)}</div>)}</div><div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-300 text-black"><span className="text-[10px] font-bold">PS</span></div><div><p className="text-[10px] font-medium">Pablo Solla</p><p className="text-[8px] text-zinc-600">Enterprise Plan</p></div></div></div></aside>
      <section className="min-w-0 flex-1"><header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#030712]/80 px-4 py-3 backdrop-blur-2xl md:px-6"><div className="flex items-center gap-3"><button onClick={()=>setMobile(true)} className="grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] lg:hidden"><Menu size={16}/></button><div className="hidden flex-1 md:block"><h1 className="text-[16px] font-semibold">Good morning, Pablo 👋</h1><p className="mt-0.5 text-[10px] text-zinc-600">Here’s what’s happening across your autonomous operations</p></div><button onClick={()=>setPalette(true)} className="ml-auto flex h-10 w-full max-w-[360px] items-center gap-2 rounded-xl border border-violet-400/15 bg-violet-500/[0.05] px-3 text-[10px] text-zinc-500 hover:border-violet-400/30"><Command size={14}/><span className="flex-1 text-left">⌘K to search or run a command</span><span className="rounded-md border border-violet-400/15 bg-violet-500/10 px-1.5 py-0.5 text-[8px] text-violet-300">⌘K</span></button><button onClick={()=>setNotice(v=>!v)} className="relative grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03]"><Bell size={15}/><span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-violet-500 text-[8px]">7</span></button><div className="grid size-10 place-items-center rounded-full border border-white/[0.1] bg-gradient-to-br from-zinc-200 to-zinc-500 text-[10px] font-bold text-black">PS</div></div></header>
        <div className="p-4 md:p-6">{view==='command'?<CommandCenter onAction={flash}/>:<GenericView view={view} onAction={flash}/>}</div>
      </section>
    </div>
    <AnimatePresence>{mobile&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-[#030712]/95 p-4 backdrop-blur-2xl lg:hidden"><div className="flex items-center justify-between"><Logo/><button onClick={()=>setMobile(false)} className="grid size-10 place-items-center rounded-xl border border-white/[0.08]"><X size={16}/></button></div><div className="mt-6 grid gap-2">{nav.map(({id,label,icon:Icon})=><button key={id} onClick={()=>choose(id)} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-left text-sm"><Icon size={16}/>{label}</button>)}</div></motion.div>}</AnimatePresence>
    <AnimatePresence>{palette&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setPalette(false)} className="fixed inset-0 z-[70] grid place-items-start bg-black/65 px-4 pt-[12vh] backdrop-blur-sm"><motion.div initial={{y:-12,scale:.98}} animate={{y:0,scale:1}} onClick={e=>e.stopPropagation()} className="w-full max-w-2xl rounded-2xl border border-violet-400/20 bg-[#07101d] p-3 shadow-[0_40px_120px_rgba(0,0,0,.65)]"><div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3"><Search size={15}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search modules, agents or actions…" className="h-11 flex-1 bg-transparent text-sm outline-none"/></div><div className="mt-2 max-h-80 overflow-auto">{nav.filter(n=>n.label.toLowerCase().includes(query.toLowerCase())).map(({id,label,icon:Icon})=><button key={id} onClick={()=>choose(id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-white/[0.04]"><Icon size={15} className="text-violet-300"/>{label}<ChevronRight size={13} className="ml-auto text-zinc-700"/></button>)}</div></motion.div></motion.div>}</AnimatePresence>
    <AnimatePresence>{notice&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="fixed right-5 top-[68px] z-[65] w-[340px] rounded-2xl border border-white/[0.08] bg-[#07101d] p-4 shadow-2xl"><div className="flex justify-between"><p className="text-sm font-semibold">Notifications</p><button onClick={()=>setNotice(false)}><X size={14}/></button></div><div className="mt-3 space-y-2">{feed.slice(0,4).map(f=><div key={f.title} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><p className="text-[10px]">{f.title}</p><p className="mt-1 text-[9px] text-zinc-600">{f.detail}</p></div>)}</div></motion.div>}</AnimatePresence>
    <AnimatePresence>{toast&&<motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:18}} className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-[10px] text-emerald-200 shadow-2xl"><Check size={13} className="mr-2 inline"/>{toast}</motion.div>}</AnimatePresence>
  </main>
}
