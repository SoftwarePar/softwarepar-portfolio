'use client';

import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Bell, Bot, BrainCircuit, Check, CheckCircle2,
  ChevronRight, CircleDollarSign, CircleGauge, Command, Cpu, Database, DollarSign, Gauge,
  GitBranch, GripVertical, KeyRound, Layers3, LockKeyhole, Menu, Network, Pause, Play, Plus,
  Radio, RotateCcw, Search, Settings, ShieldCheck, Sparkles, TerminalSquare, TrendingUp,
  UserCheck, Users, Waypoints, Workflow, X, Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type View = 'command' | 'studio' | 'runs' | 'agents' | 'reviews' | 'economics' | 'governance';
type RunState = 'idle' | 'running' | 'review' | 'complete' | 'failed';
type NodeState = 'waiting' | 'running' | 'complete' | 'review' | 'failed';
type AgentStatus = 'online' | 'standby' | 'review';
type ScenarioId = 'revenue' | 'risk' | 'ops';

type FlowNode = { id:string; title:string; subtitle:string; agent:string; state:NodeState; x:number; y:number; cost:number; latency:number };
type Agent = { id:string; name:string; role:string; model:string; status:AgentStatus; confidence:number; tasks:number; cost:string; zone:string };
type Approval = { id:string; title:string; reason:string; value:string; owner:string; severity:'medium'|'high' };
type RunRecord = { id:string; scenario:string; status:'Completed'|'Review'|'Failed'; duration:string; cost:string; impact:string; time:string };

type Scenario = {
  id:ScenarioId;
  label:string;
  eyebrow:string;
  objective:string;
  impact:string;
  nodes:Array<Omit<FlowNode,'state'>>;
};

const nav: Array<{id:View;label:string;icon:typeof Activity}> = [
  { id:'command', label:'Command Center', icon:Network },
  { id:'studio', label:'Workflow Studio', icon:Workflow },
  { id:'runs', label:'Execution History', icon:Activity },
  { id:'agents', label:'Agent Registry', icon:Bot },
  { id:'reviews', label:'Human Review', icon:UserCheck },
  { id:'economics', label:'Economics', icon:CircleDollarSign },
  { id:'governance', label:'Governance', icon:ShieldCheck },
];

const scenarios:Scenario[] = [
  {
    id:'revenue', label:'Revenue acceleration', eyebrow:'RevOps autonomy',
    objective:'Detect enterprise buying intent, qualify opportunity value and update CRM only inside commercial guardrails.',
    impact:'$184k pipeline influenced',
    nodes:[
      {id:'r1',title:'Signal intake',subtitle:'CRM + product + intent',agent:'Echo',x:10,y:32,cost:0.03,latency:180},
      {id:'r2',title:'Intent scoring',subtitle:'Opportunity model',agent:'Nova',x:32,y:32,cost:0.12,latency:640},
      {id:'r3',title:'Account research',subtitle:'Enrich buying committee',agent:'Vector',x:54,y:32,cost:0.18,latency:920},
      {id:'r4',title:'Guardrail check',subtitle:'Discount + territory rules',agent:'Sable',x:54,y:70,cost:0.07,latency:410},
      {id:'r5',title:'CRM execution',subtitle:'Route + update + notify',agent:'Atlas',x:78,y:32,cost:0.04,latency:260},
    ],
  },
  {
    id:'risk', label:'Risk response', eyebrow:'Governed automation',
    objective:'Assess policy anomalies, prepare an evidence pack and require human authority before a high-risk operational change.',
    impact:'3.8h response time saved',
    nodes:[
      {id:'k1',title:'Anomaly intake',subtitle:'Policy + event telemetry',agent:'Echo',x:10,y:32,cost:0.02,latency:140},
      {id:'k2',title:'Risk classifier',subtitle:'Severity + exposure',agent:'Sable',x:32,y:32,cost:0.08,latency:520},
      {id:'k3',title:'Evidence pack',subtitle:'Trace + supporting data',agent:'Vector',x:54,y:32,cost:0.16,latency:810},
      {id:'k4',title:'Human authority',subtitle:'Approval required',agent:'Operator',x:54,y:70,cost:0,latency:0},
      {id:'k5',title:'Containment',subtitle:'Apply approved action',agent:'Atlas',x:78,y:32,cost:0.05,latency:320},
    ],
  },
  {
    id:'ops', label:'Operations recovery', eyebrow:'Mission automation',
    objective:'Detect SLA degradation, identify root cause, rebalance work and verify system recovery with a complete audit trail.',
    impact:'21% latency reduction',
    nodes:[
      {id:'o1',title:'SLA monitor',subtitle:'Realtime health mesh',agent:'Echo',x:10,y:32,cost:0.02,latency:120},
      {id:'o2',title:'Root cause',subtitle:'Correlate service events',agent:'Vector',x:32,y:32,cost:0.14,latency:760},
      {id:'o3',title:'Recovery plan',subtitle:'Simulate rebalancing',agent:'Atlas',x:54,y:32,cost:0.11,latency:680},
      {id:'o4',title:'Safety gate',subtitle:'Change boundary check',agent:'Sable',x:54,y:70,cost:0.06,latency:390},
      {id:'o5',title:'Verify recovery',subtitle:'Observe + close loop',agent:'Echo',x:78,y:32,cost:0.03,latency:220},
    ],
  },
];

const seedAgents:Agent[] = [
  {id:'AG-01',name:'Atlas',role:'Operations Orchestrator',model:'NXR-4',status:'online',confidence:98,tasks:19,cost:'$18.42',zone:'Global Ops'},
  {id:'AG-02',name:'Nova',role:'Revenue Intelligence',model:'NXR-4',status:'online',confidence:96,tasks:12,cost:'$12.18',zone:'Revenue'},
  {id:'AG-03',name:'Sable',role:'Risk & Compliance',model:'NXR-4',status:'review',confidence:99,tasks:7,cost:'$8.74',zone:'Governance'},
  {id:'AG-04',name:'Echo',role:'Realtime Signal Analyst',model:'NXR-3',status:'online',confidence:97,tasks:24,cost:'$6.12',zone:'Signals'},
  {id:'AG-05',name:'Vector',role:'Research & Data Guardian',model:'NXR-4',status:'standby',confidence:95,tasks:9,cost:'$14.06',zone:'Data'},
];

const seedRuns:RunRecord[] = [
  {id:'RUN-8841',scenario:'Revenue acceleration',status:'Completed',duration:'4.2s',cost:'$0.44',impact:'$84k opportunity routed',time:'2 min ago'},
  {id:'RUN-8839',scenario:'Risk response',status:'Review',duration:'2.8s',cost:'$0.26',impact:'APAC policy exception',time:'8 min ago'},
  {id:'RUN-8834',scenario:'Operations recovery',status:'Completed',duration:'5.1s',cost:'$0.36',impact:'SLA restored to 99.98%',time:'21 min ago'},
  {id:'RUN-8828',scenario:'Revenue acceleration',status:'Completed',duration:'3.9s',cost:'$0.41',impact:'6 accounts enriched',time:'34 min ago'},
  {id:'RUN-8815',scenario:'Risk response',status:'Failed',duration:'1.4s',cost:'$0.09',impact:'Connector timeout contained',time:'1h ago'},
];

const approvalsSeed:Approval[] = [
  {id:'RV-204',title:'APAC routing exception',reason:'Regional policy threshold conflicts with high-confidence commercial intent.',value:'$84k pipeline',owner:'Sable',severity:'high'},
  {id:'RV-198',title:'Enterprise discount override',reason:'Requested discount exceeds autonomous commercial authority by 7%.',value:'$31k ARR',owner:'Nova',severity:'medium'},
];

const cx = (...v:Array<string|false|undefined>) => v.filter(Boolean).join(' ');

function Surface({children,className=''}:{children:React.ReactNode;className?:string}){
  return <section className={cx('relative overflow-hidden rounded-[26px] border border-white/[0.075] bg-[linear-gradient(180deg,rgba(16,20,27,.96),rgba(7,9,13,.98))] shadow-[0_35px_110px_rgba(0,0,0,.38)]',className)}>{children}</section>;
}

function TinyPill({children,tone='neutral'}:{children:React.ReactNode;tone?:'neutral'|'cyan'|'green'|'amber'|'red'}){
  const tones={neutral:'border-white/10 bg-white/[.035] text-zinc-400',cyan:'border-cyan-300/20 bg-cyan-300/[.08] text-cyan-200',green:'border-emerald-300/20 bg-emerald-300/[.08] text-emerald-200',amber:'border-amber-300/20 bg-amber-300/[.08] text-amber-200',red:'border-rose-300/20 bg-rose-300/[.08] text-rose-200'};
  return <span className={cx('inline-flex rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[.14em]',tones[tone])}>{children}</span>;
}

function Metric({label,value,detail,icon:Icon}:{label:string;value:string;detail:string;icon:typeof Activity}){
  return <div className="group border-b border-r border-white/[.07] p-5 transition hover:bg-white/[.025] lg:p-6">
    <div className="flex items-center justify-between text-zinc-600"><span className="text-[9px] uppercase tracking-[.2em]">{label}</span><Icon size={15}/></div>
    <div className="mt-6 flex items-end justify-between gap-4"><p className="text-3xl font-medium tracking-[-.055em] lg:text-[38px]">{value}</p><span className="text-[10px] text-cyan-300">{detail}</span></div>
  </div>;
}

function WorkflowCanvas({nodes,selected,onSelect,running}:{nodes:FlowNode[];selected:string;onSelect:(id:string)=>void;running:boolean}){
  return <div className="relative min-h-[500px] overflow-hidden rounded-[22px] border border-white/[.07] bg-[#070a0f]">
    <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:22px_22px]"/>
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M10 32 H32 H54 H78" fill="none" stroke="rgba(103,232,249,.2)" strokeWidth=".25"/>
      <path d="M54 32 V70" fill="none" stroke="rgba(251,191,36,.22)" strokeWidth=".25" strokeDasharray="1 1"/>
      {running && <motion.path d="M10 32 H32 H54 H78" fill="none" stroke="rgba(103,232,249,.9)" strokeWidth=".35" strokeDasharray="3 4" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:4.3,ease:'linear'}}/>}
    </svg>
    {nodes.map(node=>{
      const stateTone=node.state==='complete'?'border-emerald-300/30 bg-emerald-300/[.045]':node.state==='running'?'border-cyan-300/50 bg-cyan-300/[.08] shadow-[0_0_55px_rgba(103,232,249,.12)]':node.state==='review'?'border-amber-300/40 bg-amber-300/[.07]':'border-white/[.09] bg-[#0c1016]';
      return <motion.button drag dragMomentum={false} key={node.id} onClick={()=>onSelect(node.id)} style={{left:`${node.x}%`,top:`${node.y}%`}} className={cx('absolute w-[185px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-4 text-left transition',stateTone,selected===node.id&&'ring-1 ring-cyan-300/50')}>
        <div className="flex items-center justify-between"><GripVertical size={13} className="text-zinc-700"/><TinyPill tone={node.state==='complete'?'green':node.state==='running'?'cyan':node.state==='review'?'amber':'neutral'}>{node.state}</TinyPill></div>
        <p className="mt-4 text-sm font-medium">{node.title}</p><p className="mt-1 text-[10px] leading-4 text-zinc-600">{node.subtitle}</p>
        <div className="mt-4 flex items-center justify-between text-[9px] uppercase tracking-[.12em] text-zinc-600"><span>{node.agent}</span><span>${node.cost.toFixed(2)}</span></div>
      </motion.button>;
    })}
  </div>;
}

export default function NexoraEnterpriseOS(){
  const [view,setView]=useState<View>('command');
  const [scenarioId,setScenarioId]=useState<ScenarioId>('revenue');
  const scenario=scenarios.find(s=>s.id===scenarioId) ?? scenarios[0];
  const [nodes,setNodes]=useState<FlowNode[]>(scenario.nodes.map(n=>({...n,state:'waiting'})));
  const [selected,setSelected]=useState(nodes[0]?.id ?? '');
  const [runState,setRunState]=useState<RunState>('idle');
  const [logs,setLogs]=useState<string[]>(['mesh      production healthy','policy    guardrails synchronized','runtime   24 workers available']);
  const [runs,setRuns]=useState(seedRuns);
  const [approvals,setApprovals]=useState(approvalsSeed);
  const [agents,setAgents]=useState(seedAgents);
  const [search,setSearch]=useState('');
  const [mobile,setMobile]=useState(false);
  const [command,setCommand]=useState(false);
  const [demoMode,setDemoMode]=useState(false);
  const [demoStep,setDemoStep]=useState(0);
  const [strictMode,setStrictMode]=useState(true);
  const [humanGate,setHumanGate]=useState(true);
  const [budgetGuard,setBudgetGuard]=useState(true);

  useEffect(()=>{
    setNodes(scenario.nodes.map(n=>({...n,state:'waiting'})));
    setSelected(scenario.nodes[0]?.id ?? '');
    setRunState('idle');
  },[scenario]);

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setCommand(true)}if(e.key==='Escape'){setCommand(false);setMobile(false);setDemoMode(false)}};
    window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h);
  },[]);

  const filteredAgents=useMemo(()=>agents.filter(a=>`${a.name} ${a.role} ${a.zone}`.toLowerCase().includes(search.toLowerCase())),[agents,search]);
  const selectedNode=nodes.find(n=>n.id===selected) ?? nodes[0];
  const totalCost=nodes.reduce((sum,n)=>sum+n.cost,0);
  const avgLatency=Math.round(nodes.reduce((sum,n)=>sum+n.latency,0)/Math.max(nodes.length,1));

  const appendLog=(line:string)=>setLogs(prev=>[`${new Date().toLocaleTimeString([], {hour12:false})}  ${line}`,...prev].slice(0,14));

  const runWorkflow=()=>{
    if(runState==='running')return;
    setRunState('running');
    setNodes(prev=>prev.map((n,i)=>({...n,state:i===0?'running':'waiting'})));
    appendLog(`run       ${scenario.label} started`);
    let i=0;
    const timer=window.setInterval(()=>{
      setNodes(prev=>prev.map((n,index)=>index===i?{...n,state:'complete'}:index===i+1?{...n,state:'running'}:n));
      appendLog(`node      ${scenario.nodes[i]?.title ?? 'step'} completed`);
      i+=1;
      const reviewIndex=scenario.id==='risk'?3:scenario.id==='revenue'?3:-1;
      if(i===reviewIndex && humanGate){
        window.clearInterval(timer);setRunState('review');
        setNodes(prev=>prev.map((n,index)=>index===i?{...n,state:'review'}:n));
        appendLog('human     authority required · workflow paused');
        setView('reviews');
        return;
      }
      if(i>=scenario.nodes.length){
        window.clearInterval(timer);setRunState('complete');
        setNodes(prev=>prev.map(n=>({...n,state:'complete'})));
        const record:RunRecord={id:`RUN-${8850+runs.length}`,scenario:scenario.label,status:'Completed',duration:`${(3.4+nodes.length*.18).toFixed(1)}s`,cost:`$${totalCost.toFixed(2)}`,impact:scenario.impact,time:'just now'};
        setRuns(prev=>[record,...prev]);appendLog('run       completed · audit record sealed');
      }
    },900);
  };

  const approve=(id:string,ok:boolean)=>{
    setApprovals(prev=>prev.filter(a=>a.id!==id));
    appendLog(`human     ${id} ${ok?'approved':'rejected'}`);
    if(ok && runState==='review'){
      setRunState('running');setView('studio');
      setNodes(prev=>prev.map((n,i)=>n.state==='review'?{...n,state:'complete'}:i===prev.findIndex(x=>x.state==='review')+1?{...n,state:'running'}:n));
      window.setTimeout(()=>{setNodes(prev=>prev.map(n=>({...n,state:'complete'})));setRunState('complete');appendLog('run       resumed and completed after human approval');},1600);
    }else if(!ok){setRunState('failed');}
  };

  const demoSteps=[
    {title:'1 · Choose a business mission',copy:'Switch between revenue, risk and operations scenarios. Each scenario has different agents, costs and authority boundaries.',view:'command' as View},
    {title:'2 · Inspect the agentic workflow',copy:'The visual workflow shows autonomous reasoning, policy gates, human authority and execution as one operating surface.',view:'studio' as View},
    {title:'3 · Run and observe',copy:'Start a workflow. Node state, runtime telemetry and cost update while the execution progresses.',view:'studio' as View},
    {title:'4 · Human authority',copy:'High-impact decisions stop at a review boundary instead of executing blindly. Approve or reject to control the outcome.',view:'reviews' as View},
    {title:'5 · Prove ROI and control',copy:'Execution history, economics and governance make autonomy measurable, auditable and commercially understandable.',view:'economics' as View},
  ];

  const demoNext=()=>{const next=Math.min(demoStep+1,demoSteps.length-1);setDemoStep(next);setView(demoSteps[next].view)};

  return <main className="min-h-screen overflow-x-hidden bg-[#05070a] text-[#f5f7fa] selection:bg-cyan-300 selection:text-black">
    <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] [background-size:48px_48px]"/>
    <div className="pointer-events-none fixed left-[22%] top-[-180px] h-[520px] w-[520px] rounded-full bg-cyan-300/[.035] blur-[150px]"/>
    <div className="relative flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 border-r border-white/[.07] bg-[#07090d]/95 p-4 backdrop-blur-2xl lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2 py-2"><div className="grid size-10 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[.07] text-cyan-200"><Waypoints size={19}/></div><div><p className="text-sm font-semibold tracking-[.17em]">NEXORA</p><p className="text-[9px] uppercase tracking-[.23em] text-zinc-600">Enterprise Autonomy OS</p></div></div>
        <div className="mt-8 space-y-1">{nav.map(({id,label,icon:Icon})=><button key={id} onClick={()=>setView(id)} className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',view===id?'bg-white text-black':'text-zinc-500 hover:bg-white/[.04] hover:text-zinc-200')}><Icon size={16}/><span>{label}</span>{id==='reviews'&&approvals.length>0&&<span className="ml-auto rounded-full bg-amber-300 px-2 py-0.5 text-[9px] font-bold text-black">{approvals.length}</span>}</button>)}</div>
        <div className="mt-auto space-y-3"><button onClick={()=>{setDemoMode(true);setDemoStep(0);setView('command')}} className="flex w-full items-center justify-between rounded-2xl border border-cyan-300/15 bg-cyan-300/[.05] p-4 text-left"><div><p className="text-xs font-medium text-cyan-100">Client Demo Mode</p><p className="mt-1 text-[10px] text-zinc-600">Guided enterprise story</p></div><Sparkles size={16} className="text-cyan-300"/></button><div className="rounded-2xl border border-white/[.07] p-4"><div className="flex items-center justify-between text-[10px]"><span className="text-zinc-500">Trust posture</span><span className="text-emerald-300">99.2%</span></div><div className="mt-3 h-1 rounded-full bg-white/[.06]"><div className="h-full w-[92%] rounded-full bg-emerald-300"/></div></div></div>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[.07] bg-[#05070a]/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><div className="flex items-center gap-3"><button onClick={()=>setMobile(true)} className="grid size-9 place-items-center rounded-xl border border-white/10 lg:hidden"><Menu size={16}/></button><div><p className="text-sm font-medium">{nav.find(n=>n.id===view)?.label}</p><p className="mt-0.5 hidden text-[9px] uppercase tracking-[.17em] text-zinc-600 sm:block">Production workspace · us-east-1</p></div></div><div className="flex items-center gap-2"><button onClick={()=>setCommand(true)} className="hidden items-center gap-3 rounded-xl border border-white/[.08] bg-white/[.025] px-3 py-2 text-[10px] text-zinc-500 sm:flex"><Command size={13}/> Command <kbd className="text-zinc-700">⌘K</kbd></button><div className="flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[.045] px-3 py-2 text-[10px] text-emerald-300"><span className="size-1.5 animate-pulse rounded-full bg-emerald-300"/>Live</div></div></header>

        <div className="mx-auto max-w-[1650px] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><div className="flex items-center gap-2 text-[9px] uppercase tracking-[.2em] text-cyan-300"><Radio size={12}/> Autonomous operations</div><h1 className="mt-3 max-w-4xl text-3xl font-medium tracking-[-.05em] sm:text-4xl xl:text-5xl">{view==='command'?'Operate AI as a governed business system.':nav.find(n=>n.id===view)?.label}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">{view==='command'?'A premium operating layer for agent teams, workflows, human authority, economics and auditability — designed so autonomy can be understood and controlled by the business.':scenario.objective}</p></div>{view!=='governance'&&<div className="flex flex-wrap gap-2"><button onClick={()=>setNodes(scenario.nodes.map(n=>({...n,state:'waiting'})))} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-[10px] text-zinc-400"><RotateCcw size={13}/> Reset</button><button onClick={runWorkflow} className="flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-[10px] font-semibold text-black"><Play size={13}/> Run workflow</button></div>}</div>

          {view==='command'&&<div className="space-y-5">
            <Surface><div className="grid sm:grid-cols-2 xl:grid-cols-4"><Metric label="Autonomous runs" value="18.4k" detail="+12.8%" icon={Zap}/><Metric label="Human interventions" value="0.74%" detail="-18.1%" icon={UserCheck}/><Metric label="Decision latency" value="1.8s" detail="-21.4%" icon={Cpu}/><Metric label="Business impact" value="$1.42M" detail="30d attributed" icon={TrendingUp}/></div></Surface>
            <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
              <Surface className="p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium">Mission library</p><p className="mt-1 text-[10px] uppercase tracking-[.16em] text-zinc-600">Choose a real business operating scenario</p></div><TinyPill tone="cyan">3 production patterns</TinyPill></div><div className="mt-6 grid gap-3 lg:grid-cols-3">{scenarios.map(s=><button key={s.id} onClick={()=>setScenarioId(s.id)} className={cx('rounded-2xl border p-5 text-left transition',scenarioId===s.id?'border-cyan-300/30 bg-cyan-300/[.07]':'border-white/[.07] bg-white/[.02] hover:bg-white/[.04]')}><p className="text-[9px] uppercase tracking-[.18em] text-zinc-600">{s.eyebrow}</p><p className="mt-5 text-base font-medium">{s.label}</p><p className="mt-2 text-xs leading-5 text-zinc-600">{s.objective}</p><div className="mt-6 flex items-center justify-between"><span className="text-[10px] text-cyan-300">{s.impact}</span><ArrowRight size={14}/></div></button>)}</div></Surface>
              <Surface className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium">Autonomy posture</p><p className="mt-1 text-[10px] text-zinc-600">Current production boundary</p></div><CircleGauge className="text-cyan-300" size={20}/></div><div className="mx-auto mt-7 grid size-44 place-items-center rounded-full border border-cyan-300/15 bg-[radial-gradient(circle,rgba(103,232,249,.11),transparent_62%)]"><div className="text-center"><p className="text-4xl font-medium tracking-[-.06em]">92</p><p className="mt-1 text-[9px] uppercase tracking-[.18em] text-zinc-600">controlled autonomy</p></div></div><div className="mt-7 grid grid-cols-3 gap-2 text-center"><div><p className="text-sm">24</p><p className="text-[9px] text-zinc-600">Agents</p></div><div><p className="text-sm">6</p><p className="text-[9px] text-zinc-600">Policies</p></div><div><p className="text-sm">2</p><p className="text-[9px] text-zinc-600">Reviews</p></div></div></Surface>
            </div>
            <Surface className="p-4 sm:p-5"><WorkflowCanvas nodes={nodes} selected={selected} onSelect={setSelected} running={runState==='running'}/></Surface>
          </div>}

          {view==='studio'&&<div className="grid gap-5 2xl:grid-cols-[1fr_340px]"><Surface className="p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-medium">{scenario.label}</p><p className="mt-1 text-[10px] text-zinc-600">Drag nodes to explore the workflow. Execution state is live.</p></div><TinyPill tone={runState==='running'?'cyan':runState==='review'?'amber':runState==='complete'?'green':'neutral'}>{runState}</TinyPill></div><WorkflowCanvas nodes={nodes} selected={selected} onSelect={setSelected} running={runState==='running'}/></Surface><div className="space-y-5"><Surface className="p-5"><p className="text-[9px] uppercase tracking-[.18em] text-zinc-600">Node inspector</p>{selectedNode&&<><div className="mt-5 flex items-start justify-between"><div><p className="text-base font-medium">{selectedNode.title}</p><p className="mt-1 text-xs text-zinc-600">{selectedNode.subtitle}</p></div><TinyPill tone={selectedNode.state==='complete'?'green':selectedNode.state==='running'?'cyan':selectedNode.state==='review'?'amber':'neutral'}>{selectedNode.state}</TinyPill></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/[.07] p-3"><p className="text-[9px] text-zinc-600">Agent</p><p className="mt-1 text-xs">{selectedNode.agent}</p></div><div className="rounded-xl border border-white/[.07] p-3"><p className="text-[9px] text-zinc-600">Latency</p><p className="mt-1 text-xs">{selectedNode.latency}ms</p></div><div className="rounded-xl border border-white/[.07] p-3"><p className="text-[9px] text-zinc-600">Run cost</p><p className="mt-1 text-xs">${selectedNode.cost.toFixed(2)}</p></div><div className="rounded-xl border border-white/[.07] p-3"><p className="text-[9px] text-zinc-600">Authority</p><p className="mt-1 text-xs">{selectedNode.agent==='Operator'?'Human':'Policy bound'}</p></div></div></>}</Surface><Surface className="p-5"><p className="text-[9px] uppercase tracking-[.18em] text-zinc-600">Execution profile</p><div className="mt-5 space-y-4 text-xs"><div className="flex justify-between"><span className="text-zinc-600">Estimated cost</span><span>${totalCost.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-zinc-600">Avg node latency</span><span>{avgLatency}ms</span></div><div className="flex justify-between"><span className="text-zinc-600">Human gate</span><span>{humanGate?'Required':'Disabled'}</span></div></div></Surface></div></div>}

          {view==='runs'&&<Surface><div className="grid grid-cols-[1.1fr_.65fr_.55fr_.55fr_.8fr] border-b border-white/[.07] px-5 py-3 text-[9px] uppercase tracking-[.15em] text-zinc-600"><span>Run</span><span>Status</span><span>Duration</span><span>Cost</span><span>Impact</span></div><div>{runs.map(run=><div key={run.id} className="grid grid-cols-[1.1fr_.65fr_.55fr_.55fr_.8fr] items-center border-b border-white/[.06] px-5 py-4 text-xs"><div><p>{run.id}</p><p className="mt-1 text-[10px] text-zinc-600">{run.scenario} · {run.time}</p></div><TinyPill tone={run.status==='Completed'?'green':run.status==='Review'?'amber':'red'}>{run.status}</TinyPill><span className="text-zinc-400">{run.duration}</span><span className="text-zinc-400">{run.cost}</span><span className="text-zinc-300">{run.impact}</span></div>)}</div></Surface>}

          {view==='agents'&&<div className="space-y-4"><div className="flex flex-col gap-3 sm:flex-row"><div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[.08] bg-white/[.025] px-3"><Search size={14} className="text-zinc-600"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search agents, roles or zones" className="h-10 w-full bg-transparent text-xs outline-none placeholder:text-zinc-700"/></div><button onClick={()=>setAgents(prev=>[...prev,{id:`AG-0${prev.length+1}`,name:'Pulse',role:'Customer Operations Agent',model:'NXR-4',status:'standby',confidence:94,tasks:0,cost:'$0.00',zone:'Customer'}])} className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-medium text-black"><Plus size={14}/> Deploy agent</button></div><Surface><div className="divide-y divide-white/[.06]">{filteredAgents.map(agent=><div key={agent.id} className="grid gap-4 px-5 py-5 md:grid-cols-[1.3fr_.7fr_.55fr_.55fr_auto] md:items-center"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl border border-white/[.08] bg-white/[.025] text-cyan-200"><BrainCircuit size={17}/></div><div><p className="text-sm font-medium">{agent.name}</p><p className="mt-1 text-[10px] text-zinc-600">{agent.role} · {agent.zone}</p></div></div><div><p className="text-[9px] text-zinc-600">Model</p><p className="mt-1 text-xs">{agent.model}</p></div><div><p className="text-[9px] text-zinc-600">Confidence</p><p className="mt-1 text-xs">{agent.confidence}%</p></div><div><p className="text-[9px] text-zinc-600">30d cost</p><p className="mt-1 text-xs">{agent.cost}</p></div><button onClick={()=>setAgents(prev=>prev.map(a=>a.id===agent.id?{...a,status:a.status==='online'?'standby':'online'}:a))}><TinyPill tone={agent.status==='online'?'green':agent.status==='review'?'amber':'neutral'}>{agent.status}</TinyPill></button></div>)}</div></Surface></div>}

          {view==='reviews'&&<div className="grid gap-5 xl:grid-cols-[1fr_.55fr]"><div className="space-y-4">{approvals.length===0?<Surface className="grid min-h-[280px] place-items-center text-center"><div><CheckCircle2 className="mx-auto text-emerald-300"/><p className="mt-4 text-sm">No decisions awaiting authority</p><p className="mt-2 text-xs text-zinc-600">Autonomous execution is inside defined policy boundaries.</p></div></Surface>:approvals.map(a=><Surface key={a.id} className="p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><TinyPill tone={a.severity==='high'?'red':'amber'}>{a.severity} risk</TinyPill><span className="text-[10px] text-zinc-600">{a.id}</span></div><p className="mt-5 text-lg font-medium">{a.title}</p><p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500">{a.reason}</p></div><ShieldCheck className="text-amber-300"/></div><div className="mt-6 flex flex-col justify-between gap-4 border-t border-white/[.07] pt-5 sm:flex-row sm:items-center"><div><p className="text-[9px] uppercase tracking-[.16em] text-zinc-600">Business value at stake</p><p className="mt-1 text-sm">{a.value}</p></div><div className="flex gap-2"><button onClick={()=>approve(a.id,false)} className="rounded-xl border border-white/10 px-4 py-2 text-xs text-zinc-400">Reject</button><button onClick={()=>approve(a.id,true)} className="rounded-xl bg-emerald-300 px-4 py-2 text-xs font-semibold text-black">Approve & resume</button></div></div></Surface>)}</div><Surface className="p-6"><p className="text-sm font-medium">Authority model</p><p className="mt-2 text-xs leading-5 text-zinc-600">NEXORA distinguishes autonomous work from accountable decisions. Policy, value and risk thresholds determine when human authority is mandatory.</p><div className="mt-7 space-y-4">{[['Low impact','Autonomous','green'],['Medium impact','Policy bound','cyan'],['High impact','Human authority','amber']].map(([a,b,t])=><div key={a} className="flex items-center justify-between border-b border-white/[.06] pb-3 text-xs"><span className="text-zinc-500">{a}</span><TinyPill tone={t as 'green'|'cyan'|'amber'}>{b}</TinyPill></div>)}</div></Surface></div>}

          {view==='economics'&&<div className="space-y-5"><Surface><div className="grid sm:grid-cols-2 xl:grid-cols-4"><Metric label="30d model spend" value="$4,821" detail="-9.4%" icon={DollarSign}/><Metric label="Cost / decision" value="$0.27" detail="-14.2%" icon={CircleDollarSign}/><Metric label="Hours automated" value="1,284" detail="+18.6%" icon={Gauge}/><Metric label="Attributed value" value="$1.42M" detail="294× spend" icon={BarChart3}/></div></Surface><div className="grid gap-5 xl:grid-cols-[1fr_.7fr]"><Surface className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium">Autonomy value curve</p><p className="mt-1 text-[10px] text-zinc-600">Business value attributed to governed AI operations</p></div><TrendingUp size={18} className="text-cyan-300"/></div><div className="mt-8 flex h-64 items-end gap-3">{[18,26,31,44,39,52,61,57,70,78,86,94].map((h,i)=><div key={i} className="flex-1"><motion.div initial={{height:0}} animate={{height:`${h}%`}} transition={{delay:i*.04}} className="rounded-t-md bg-gradient-to-t from-cyan-300/[.08] to-cyan-300/70"/></div>)}</div></Surface><Surface className="p-6"><p className="text-sm font-medium">Economic guardrails</p><div className="mt-6 space-y-5 text-xs"><div className="flex justify-between"><span className="text-zinc-600">Per-run budget ceiling</span><span>$1.25</span></div><div className="flex justify-between"><span className="text-zinc-600">Daily autonomous spend</span><span>$148 / $220</span></div><div className="flex justify-between"><span className="text-zinc-600">Human review cost</span><span>$12.80 avg</span></div><div className="flex justify-between"><span className="text-zinc-600">Value / spend ratio</span><span className="text-emerald-300">294×</span></div></div></Surface></div></div>}

          {view==='governance'&&<div className="grid gap-5 xl:grid-cols-[1fr_.7fr]"><Surface className="p-6"><p className="text-sm font-medium">Production policies</p><p className="mt-2 text-xs text-zinc-600">Controls are interactive in this portfolio demo.</p><div className="mt-7 divide-y divide-white/[.06]">{[
            ['Strict policy mode','Block execution when confidence or policy coverage is insufficient.',strictMode,setStrictMode],
            ['Human authority gates','Require explicit approval above impact and risk thresholds.',humanGate,setHumanGate],
            ['Economic guardrails','Stop runs that exceed configured spend limits.',budgetGuard,setBudgetGuard],
          ].map(([title,copy,value,setter])=><div key={title as string} className="flex items-center justify-between gap-5 py-5"><div><p className="text-sm">{title as string}</p><p className="mt-1 max-w-xl text-xs text-zinc-600">{copy as string}</p></div><button onClick={()=> (setter as (v:boolean)=>void)(!(value as boolean))} className={cx('relative h-7 w-12 rounded-full transition',value?'bg-cyan-300':'bg-white/[.09]')}><motion.span animate={{x:value?25:4}} className={cx('absolute top-1 size-5 rounded-full',value?'bg-black':'bg-zinc-500')}/></button></div>)}</div></Surface><div className="space-y-5"><Surface className="p-6"><div className="flex items-center justify-between"><p className="text-sm font-medium">Audit integrity</p><LockKeyhole size={18} className="text-emerald-300"/></div><p className="mt-5 text-4xl font-medium tracking-[-.05em]">100%</p><p className="mt-2 text-xs text-zinc-600">Runs with immutable decision trace</p></Surface><Surface className="p-6"><p className="text-sm font-medium">Connected systems</p><div className="mt-5 grid grid-cols-2 gap-2">{['CRM','Data Lake','ERP','Slack','Email','BI'].map(x=><div key={x} className="flex items-center gap-2 rounded-xl border border-white/[.07] p-3 text-xs text-zinc-400"><span className="size-1.5 rounded-full bg-emerald-300"/>{x}</div>)}</div></Surface></div></div>}
        </div>
      </section>
    </div>

    <AnimatePresence>{mobile&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-[#05070a] p-5 lg:hidden"><div className="flex items-center justify-between"><p className="text-sm tracking-[.16em]">NEXORA</p><button onClick={()=>setMobile(false)}><X/></button></div><div className="mt-12 space-y-2">{nav.map(({id,label,icon:Icon})=><button key={id} onClick={()=>{setView(id);setMobile(false)}} className="flex w-full items-center gap-3 border-b border-white/[.07] py-4 text-left text-lg"><Icon size={18}/>{label}</button>)}</div></motion.div>}</AnimatePresence>

    <AnimatePresence>{command&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] grid place-items-start bg-black/70 px-4 pt-[12vh] backdrop-blur-md" onClick={()=>setCommand(false)}><motion.div initial={{y:-15,scale:.98}} animate={{y:0,scale:1}} onClick={e=>e.stopPropagation()} className="w-full max-w-xl rounded-[24px] border border-white/[.1] bg-[#0a0d12] p-3 shadow-2xl"><div className="flex items-center gap-3 border-b border-white/[.07] px-3 py-3"><Search size={16} className="text-zinc-600"/><input autoFocus placeholder="Navigate NEXORA..." className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-700"/></div><div className="mt-2">{nav.map(({id,label,icon:Icon})=><button key={id} onClick={()=>{setView(id);setCommand(false)}} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-400 hover:bg-white/[.05] hover:text-white"><Icon size={15}/>{label}<ChevronRight size={14} className="ml-auto"/></button>)}</div></motion.div></motion.div>}</AnimatePresence>

    <AnimatePresence>{demoMode&&<motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:18}} className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-[24px] border border-cyan-300/20 bg-[#0a0d12]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,.5)] backdrop-blur-xl"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[9px] uppercase tracking-[.17em] text-cyan-300"><Sparkles size={12}/> Client Demo · {demoStep+1}/{demoSteps.length}</div><p className="mt-3 text-base font-medium">{demoSteps[demoStep].title}</p><p className="mt-2 text-xs leading-5 text-zinc-500">{demoSteps[demoStep].copy}</p></div><button onClick={()=>setDemoMode(false)}><X size={16}/></button></div><div className="mt-5 flex items-center justify-between"><div className="flex gap-1">{demoSteps.map((_,i)=><span key={i} className={cx('h-1 w-8 rounded-full',i<=demoStep?'bg-cyan-300':'bg-white/[.08]')}/>)}</div>{demoStep<demoSteps.length-1?<button onClick={demoNext} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-medium text-black">Continue <ArrowRight size={13}/></button>:<button onClick={()=>setDemoMode(false)} className="rounded-xl bg-emerald-300 px-4 py-2 text-xs font-semibold text-black">Finish demo</button>}</div></motion.div>}</AnimatePresence>
  </main>;
}
