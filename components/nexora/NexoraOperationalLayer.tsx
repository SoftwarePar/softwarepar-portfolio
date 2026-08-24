'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity, ArrowRight, Bot, CheckCircle2, CircleDollarSign, CloudCog,
  Database, Download, FileClock, GitBranch, Link2, Network, RefreshCcw,
  ShieldCheck, Sparkles, UserCheck, Workflow, X, Zap
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type EventKind =
  | 'scenario.created' | 'workflow.created' | 'workflow.started' | 'workflow.completed'
  | 'agent.deployed' | 'agent.routed' | 'approval.requested' | 'approval.approved'
  | 'opportunity.created' | 'policy.changed' | 'console.opened' | 'navigation.changed'
  | 'sync.received';

type LedgerEvent = {
  id: string;
  traceId: string;
  kind: EventKind;
  entity: string;
  entityId: string;
  summary: string;
  at: string;
  value?: number;
  cost?: number;
  hours?: number;
  source: 'ui' | 'runtime' | 'sync';
};

type Tab = 'lineage' | 'ledger' | 'sync';

const STORAGE_KEY = 'nexora.v12.operational-ledger';
const CHANNEL_NAME = 'nexora-v12-sync';
const BASE_VALUE = 2_410_000;
const BASE_COST = 347_000;
const BASE_HOURS = 2_846;

const seed: LedgerEvent[] = [
  {id:'evt-seed-1',traceId:'TRC-Q2-2408',kind:'workflow.started',entity:'Q2 Revenue Acceleration',entityId:'WF-Q2-001',summary:'Revenue acceleration workflow entered execution',at:'2026-08-24T00:18:00-03:00',source:'runtime'},
  {id:'evt-seed-2',traceId:'TRC-Q2-2408',kind:'agent.routed',entity:'Outreach Agent',entityId:'AG-OUT-014',summary:'Lead cohort routed to Outreach Agent',at:'2026-08-24T00:20:12-03:00',source:'runtime'},
  {id:'evt-seed-3',traceId:'TRC-Q2-2408',kind:'approval.requested',entity:'Human Review',entityId:'APR-12450',summary:'Budget authority requested for $12,450',at:'2026-08-24T00:24:18-03:00',cost:12450,source:'runtime'},
];

const kindMeta: Record<EventKind,{label:string;tone:string;icon:typeof Activity}> = {
  'scenario.created':{label:'Scenario',tone:'text-violet-300 border-violet-400/20 bg-violet-500/10',icon:Sparkles},
  'workflow.created':{label:'Workflow',tone:'text-sky-300 border-sky-400/20 bg-sky-500/10',icon:Workflow},
  'workflow.started':{label:'Runtime',tone:'text-cyan-300 border-cyan-400/20 bg-cyan-500/10',icon:GitBranch},
  'workflow.completed':{label:'Completed',tone:'text-emerald-300 border-emerald-400/20 bg-emerald-500/10',icon:CheckCircle2},
  'agent.deployed':{label:'Agent',tone:'text-violet-300 border-violet-400/20 bg-violet-500/10',icon:Bot},
  'agent.routed':{label:'Agent',tone:'text-emerald-300 border-emerald-400/20 bg-emerald-500/10',icon:Bot},
  'approval.requested':{label:'Authority',tone:'text-amber-300 border-amber-400/20 bg-amber-500/10',icon:UserCheck},
  'approval.approved':{label:'Approved',tone:'text-emerald-300 border-emerald-400/20 bg-emerald-500/10',icon:ShieldCheck},
  'opportunity.created':{label:'Outcome',tone:'text-pink-300 border-pink-400/20 bg-pink-500/10',icon:CircleDollarSign},
  'policy.changed':{label:'Policy',tone:'text-amber-300 border-amber-400/20 bg-amber-500/10',icon:ShieldCheck},
  'console.opened':{label:'Runtime',tone:'text-sky-300 border-sky-400/20 bg-sky-500/10',icon:Activity},
  'navigation.changed':{label:'View',tone:'text-slate-300 border-slate-400/20 bg-slate-500/10',icon:Network},
  'sync.received':{label:'Synced',tone:'text-cyan-300 border-cyan-400/20 bg-cyan-500/10',icon:CloudCog},
};

function uid(prefix:string){return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}
function now(){return new Date().toISOString()}
function money(n:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)}

export default function NexoraOperationalLayer(){
  const [events,setEvents]=useState<LedgerEvent[]>(seed);
  const [open,setOpen]=useState(false);
  const [tab,setTab]=useState<Tab>('lineage');
  const [syncState,setSyncState]=useState<'local'|'synced'|'receiving'>('local');
  const [lastSync,setLastSync]=useState<string>('—');
  const channelRef=useRef<BroadcastChannel|null>(null);
  const timers=useRef<number[]>([]);

  const persist=(next:LedgerEvent[],broadcast=true)=>{
    setEvents(next);
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(next));}catch{}
    if(broadcast) channelRef.current?.postMessage({type:'ledger',events:next,at:now()});
    setSyncState('synced');
    setLastSync(new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}));
  };

  const append=(partial:Omit<LedgerEvent,'id'|'at'>)=>{
    const event:LedgerEvent={...partial,id:uid('EVT'),at:now()};
    setEvents(prev=>{
      const next=[event,...prev].slice(0,120);
      try{localStorage.setItem(STORAGE_KEY,JSON.stringify(next));}catch{}
      channelRef.current?.postMessage({type:'ledger',events:next,at:event.at});
      return next;
    });
    setSyncState('synced');
    setLastSync(new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}));
    return event;
  };

  useEffect(()=>{
    try{
      const saved=localStorage.getItem(STORAGE_KEY);
      if(saved){const parsed=JSON.parse(saved) as LedgerEvent[];if(Array.isArray(parsed)&&parsed.length)setEvents(parsed)}
      const channel=new BroadcastChannel(CHANNEL_NAME);channelRef.current=channel;
      channel.onmessage=(message:MessageEvent<{type:string;events?:LedgerEvent[];at?:string}>)=>{
        if(message.data?.type==='ledger'&&message.data.events){
          setSyncState('receiving');setEvents(message.data.events);
          try{localStorage.setItem(STORAGE_KEY,JSON.stringify(message.data.events));}catch{}
          setLastSync(new Date(message.data.at??Date.now()).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}));
          window.setTimeout(()=>setSyncState('synced'),450);
        }
      };
      const onStorage=(e:StorageEvent)=>{if(e.key===STORAGE_KEY&&e.newValue){try{setEvents(JSON.parse(e.newValue) as LedgerEvent[]);setSyncState('synced')}catch{}}};
      window.addEventListener('storage',onStorage);
      return()=>{channel.close();window.removeEventListener('storage',onStorage);timers.current.forEach(window.clearTimeout)};
    }catch{return;}
  },[]);

  useEffect(()=>{
    const handler=(e:MouseEvent)=>{
      const button=(e.target as HTMLElement).closest('button');
      if(!button||!button.closest('main[class*="bg-[#020711]"]')) return;
      const label=(button.textContent??'').replace(/\s+/g,' ').trim();
      const lower=label.toLowerCase();
      const traceId='TRC-Q2-2408';

      if(lower.includes('run simulation')||lower==='live'){
        append({traceId,kind:'workflow.started',entity:'Q2 Revenue Acceleration',entityId:'WF-Q2-001',summary:'Simulation started from Command Center',source:'ui'});
        timers.current.push(window.setTimeout(()=>append({traceId,kind:'agent.routed',entity:'Outreach Agent',entityId:'AG-OUT-014',summary:'Qualified cohort routed to outreach execution',source:'runtime'}),700));
        timers.current.push(window.setTimeout(()=>append({traceId,kind:'approval.requested',entity:'Human Review',entityId:'APR-12450',summary:'Authority gate reached · budget $12,450',cost:12450,source:'runtime'}),1500));
      } else if(lower.includes('approve human review')){
        append({traceId,kind:'approval.approved',entity:'Human Review',entityId:'APR-12450',summary:'Pablo approved budget authority gate',source:'ui'});
        timers.current.push(window.setTimeout(()=>append({traceId,kind:'opportunity.created',entity:'Acme Corp Opportunity',entityId:'OPP-85000',summary:'Opportunity created after approved autonomous sequence',value:85000,hours:11.4,source:'runtime'}),450));
        timers.current.push(window.setTimeout(()=>append({traceId,kind:'workflow.completed',entity:'Q2 Revenue Acceleration',entityId:'WF-Q2-001',summary:'Workflow completed with attributable outcome',source:'runtime'}),850));
      } else if(lower.includes('new workflow')){
        append({traceId:uid('TRC'),kind:'workflow.created',entity:'Untitled Workflow',entityId:uid('WF'),summary:'New workflow draft created',source:'ui'});
      } else if(lower.includes('deploy agent')){
        append({traceId:uid('TRC'),kind:'agent.deployed',entity:'New Autonomous Agent',entityId:uid('AG'),summary:'Agent deployment initiated from fleet controls',source:'ui'});
      } else if(lower.includes('create scenario')){
        append({traceId:uid('TRC'),kind:'scenario.created',entity:'New Enterprise Scenario',entityId:uid('SCN'),summary:'Scenario workspace created',source:'ui'});
      } else if(lower.includes('open console')){
        append({traceId,kind:'console.opened',entity:'Runtime Console',entityId:'RTC-001',summary:'Runtime console opened for current trace',source:'ui'});setOpen(true);setTab('ledger');
      } else if(lower.includes('strict policy')||lower.includes('authority gates')||lower.includes('guardrails')||lower.includes('audit logging')||lower.includes('auto-scaling')||lower.includes('fallback models')){
        append({traceId,kind:'policy.changed',entity:label.split(' enabled')[0].split(' disabled')[0],entityId:uid('POL'),summary:`Control changed: ${label}`,source:'ui'});
      } else {
        const navLabels=['command center','workflow studio','agent fleet','automations','human review','runtime console','model router','scenarios','analytics & insights','governance','teams & access','audit trail','economics','integrations','settings'];
        const navHit=navLabels.find(n=>lower.includes(n));
        if(navHit) append({traceId,kind:'navigation.changed',entity:navHit,entityId:navHit.replace(/\s+/g,'-'),summary:`Operational view changed to ${navHit}`,source:'ui'});
      }
    };
    document.addEventListener('click',handler,true);return()=>document.removeEventListener('click',handler,true);
  },[]);

  const metrics=useMemo(()=>{
    const addedValue=events.reduce((s,e)=>s+(e.value??0),0);
    const addedCost=events.filter(e=>e.kind==='approval.approved').reduce(s=>s+12450,0);
    const addedHours=events.reduce((s,e)=>s+(e.hours??0),0);
    const pending=Math.max(0,events.filter(e=>e.kind==='approval.requested').length-events.filter(e=>e.kind==='approval.approved').length);
    return {value:BASE_VALUE+addedValue,cost:BASE_COST+addedCost,hours:BASE_HOURS+addedHours,pending,roi:(BASE_VALUE+addedValue)/(BASE_COST+addedCost)};
  },[events]);

  const latestTrace=events[0]?.traceId??'TRC-Q2-2408';
  const current=events.filter(e=>e.traceId===latestTrace).slice(0,8).reverse();

  const exportLedger=()=>{const blob=new Blob([JSON.stringify({exportedAt:now(),metrics,events},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`nexora-trace-${latestTrace}.json`;a.click();URL.revokeObjectURL(url)};
  const reset=()=>persist(seed);

  return <>
    <div className="fixed bottom-4 right-4 z-[62] hidden xl:block">
      <motion.button whileHover={{y:-2}} whileTap={{scale:.98}} onClick={()=>setOpen(true)} className="group flex min-w-[310px] items-center gap-3 rounded-[13px] border border-violet-400/20 bg-[#06101d]/95 px-3.5 py-3 text-left shadow-[0_20px_70px_rgba(0,0,0,.48),0_0_34px_rgba(124,58,237,.07)] backdrop-blur-xl">
        <span className="relative grid size-9 place-items-center rounded-[10px] border border-violet-400/25 bg-violet-500/10 text-violet-300"><Link2 size={15}/><span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-[#06101d] bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,.65)]"/></span>
        <span className="min-w-0 flex-1"><span className="flex items-center gap-2 text-[9px] font-medium text-white">Operational lineage <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[.07] px-1.5 py-[2px] text-[7px] text-emerald-300">SYNCED</span></span><span className="mt-0.5 block truncate font-mono text-[7px] text-[#64738a]">{latestTrace} · {events.length} events · {metrics.pending} approvals pending</span></span>
        <ArrowRight size={13} className="text-[#607089] transition group-hover:translate-x-0.5 group-hover:text-violet-300"/>
      </motion.button>
    </div>

    <AnimatePresence>{open&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/62 backdrop-blur-[4px]" onClick={()=>setOpen(false)}>
      <motion.aside initial={{x:38,opacity:.7}} animate={{x:0,opacity:1}} exit={{x:38,opacity:0}} transition={{type:'spring',stiffness:260,damping:28}} onClick={e=>e.stopPropagation()} className="absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col border-l border-[#1b2c46] bg-[linear-gradient(180deg,#07111e,#030914)] shadow-[-30px_0_100px_rgba(0,0,0,.52)]">
        <div className="border-b border-[#17263d] p-4">
          <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-[9px] border border-violet-400/20 bg-violet-500/10 text-violet-300"><Network size={14}/></span><div><p className="text-[11px] font-medium text-white">Operational lineage & synchronization</p><p className="mt-0.5 font-mono text-[7px] text-[#637188]">Trace {latestTrace}</p></div></div></div><button onClick={()=>setOpen(false)} className="grid size-8 place-items-center rounded-[8px] border border-[#1b2a40] bg-[#071421] text-[#8190a5] hover:text-white"><X size={13}/></button></div>
          <div className="mt-4 grid grid-cols-4 gap-2">{[[money(metrics.value),'Value'],[money(metrics.cost),'Cost'],[`${metrics.roi.toFixed(1)}x`,'ROI'],[metrics.hours.toFixed(0),'Hours saved']].map(([v,l])=><div key={l} className="rounded-[9px] border border-[#17263b] bg-[#06111e] p-2.5"><p className="text-[11px] font-medium text-white">{v}</p><p className="mt-0.5 text-[7px] text-[#607087]">{l}</p></div>)}</div>
        </div>

        <div className="flex gap-1 border-b border-[#17263d] px-4 py-2">{(['lineage','ledger','sync'] as Tab[]).map(t=><button key={t} onClick={()=>setTab(t)} className={`rounded-[7px] px-3 py-1.5 text-[8px] capitalize ${tab===t?'border border-violet-400/20 bg-violet-500/10 text-violet-300':'border border-transparent text-[#69788e] hover:text-white'}`}>{t}</button>)}<div className="ml-auto flex gap-1"><button onClick={exportLedger} className="grid size-8 place-items-center rounded-[7px] border border-[#1a2a40] bg-[#071421] text-[#7e8da2] hover:text-white" title="Export trace"><Download size={12}/></button><button onClick={reset} className="grid size-8 place-items-center rounded-[7px] border border-[#1a2a40] bg-[#071421] text-[#7e8da2] hover:text-white" title="Reset demo"><RefreshCcw size={12}/></button></div></div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tab==='lineage'&&<div>
            <div className="rounded-[12px] border border-[#182943] bg-[#06111e] p-3.5"><div className="flex items-center justify-between"><p className="text-[8px] font-semibold tracking-[.11em] text-[#8897aa]">CAUSAL CHAIN</p><span className="text-[7px] text-emerald-400">● live</span></div><div className="mt-4 space-y-1">{current.length?current.map((e,i)=>{const m=kindMeta[e.kind];const I=m.icon;return <div key={e.id} className="relative flex gap-3 pb-4 last:pb-0">{i<current.length-1&&<span className="absolute left-[15px] top-8 h-[calc(100%-18px)] w-px bg-gradient-to-b from-violet-400/30 to-cyan-400/10"/>}<span className={`relative z-10 grid size-[30px] shrink-0 place-items-center rounded-[8px] border ${m.tone}`}><I size={12}/></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-[8px] font-medium text-white">{e.entity}</p><span className="rounded-full border border-[#243550] px-1.5 py-[1px] text-[6px] text-[#708099]">{m.label}</span></div><p className="mt-1 text-[7px] leading-relaxed text-[#65758b]">{e.summary}</p><div className="mt-1.5 flex gap-3 font-mono text-[6px] text-[#4f6078]"><span>{e.entityId}</span><span>{new Date(e.at).toLocaleTimeString()}</span><span>{e.source}</span></div></div></div>}):<p className="text-[8px] text-[#66758b]">No events for this trace.</p>}</div></div>
            <div className="mt-3 rounded-[12px] border border-[#182943] bg-[#06111e] p-3.5"><p className="text-[8px] font-semibold tracking-[.11em] text-[#8897aa]">WHAT THE DASHBOARD MEANS</p><div className="mt-3 space-y-2 text-[7px] text-[#69788e]"><p><b className="text-[#dce6f2]">Value generated</b> is attributed only when an opportunity/outcome event is created.</p><p><b className="text-[#dce6f2]">Costs</b> include approved authority-gated spend and autonomous execution cost.</p><p><b className="text-[#dce6f2]">Human hours saved</b> are attached to completed outcomes, not arbitrary counters.</p><p><b className="text-[#dce6f2]">Success</b> represents completed workflows without blocked policy violations.</p></div></div>
          </div>}

          {tab==='ledger'&&<div className="space-y-2">{events.map(e=>{const m=kindMeta[e.kind];const I=m.icon;return <div key={e.id} className="rounded-[10px] border border-[#17263c] bg-[#06111e] p-3"><div className="flex items-start gap-2.5"><span className={`grid size-7 shrink-0 place-items-center rounded-[7px] border ${m.tone}`}><I size={11}/></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-[8px] text-white">{e.summary}</p><span className="shrink-0 text-[6px] text-[#56667d]">{new Date(e.at).toLocaleTimeString()}</span></div><div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[6px] text-[#53637a]"><span>trace={e.traceId}</span><span>entity={e.entityId}</span><span>source={e.source}</span>{e.value&&<span className="text-emerald-400">value=+{money(e.value)}</span>}{e.cost&&<span className="text-amber-300">cost={money(e.cost)}</span>}</div></div></div></div>})}</div>}

          {tab==='sync'&&<div className="space-y-3">
            <div className="rounded-[12px] border border-[#182943] bg-[#06111e] p-4"><div className="flex items-center gap-3"><span className="relative grid size-10 place-items-center rounded-[10px] border border-cyan-400/20 bg-cyan-500/10 text-cyan-300"><CloudCog size={17}/><span className={`absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-[#06111e] ${syncState==='receiving'?'bg-amber-400':'bg-emerald-400'}`}/></span><div><p className="text-[9px] font-medium text-white">{syncState==='receiving'?'Receiving changes':'Workspace synchronized'}</p><p className="mt-0.5 text-[7px] text-[#65758b]">BroadcastChannel + local persistence</p></div></div><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-[8px] border border-[#17263b] bg-[#040d18] p-2.5"><p className="text-[7px] text-[#5d6d84]">Last sync</p><p className="mt-1 font-mono text-[8px] text-white">{lastSync}</p></div><div className="rounded-[8px] border border-[#17263b] bg-[#040d18] p-2.5"><p className="text-[7px] text-[#5d6d84]">Ledger events</p><p className="mt-1 font-mono text-[8px] text-white">{events.length}</p></div></div></div>
            <div className="rounded-[12px] border border-[#182943] bg-[#06111e] p-4"><p className="text-[8px] font-semibold tracking-[.11em] text-[#8897aa]">SYNCHRONIZATION MODEL</p><div className="mt-4 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center"><div className="rounded-[8px] border border-violet-400/15 bg-violet-500/[.06] p-2"><Database size={13} className="mx-auto text-violet-300"/><p className="mt-1 text-[7px] text-white">UI state</p></div><Zap size={11} className="text-[#53647c]"/><div className="rounded-[8px] border border-cyan-400/15 bg-cyan-500/[.06] p-2"><Link2 size={13} className="mx-auto text-cyan-300"/><p className="mt-1 text-[7px] text-white">Event ledger</p></div><Zap size={11} className="text-[#53647c]"/><div className="rounded-[8px] border border-emerald-400/15 bg-emerald-500/[.06] p-2"><CloudCog size={13} className="mx-auto text-emerald-300"/><p className="mt-1 text-[7px] text-white">Other tabs</p></div></div><p className="mt-3 text-[7px] leading-relaxed text-[#65758b]">Every meaningful interaction creates an event with trace ID, entity ID, source and timestamp. Other open NEXORA tabs receive the same ledger immediately, so approvals, outcomes and audit history stay aligned.</p></div>
          </div>}
        </div>
      </motion.aside>
    </motion.div>}</AnimatePresence>
  </>;
}
