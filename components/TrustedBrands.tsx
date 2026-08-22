'use client';
import { Bot, BrainCircuit, Orbit, Sparkles, Waves, Workflow } from 'lucide-react';

const brands=[['NOVA',Orbit],['SYNTH',BrainCircuit],['VECTOR',Workflow],['ARC',Waves],['LUMA',Sparkles],['KINETIC',Bot]] as const;
export default function TrustedBrands(){const row=[...brands,...brands];return <section className="relative overflow-hidden py-7 section-line edge-fade"><div className="marquee-track gap-16 md:gap-24 px-8">{row.map(([name,Icon],i)=><div key={`${name}-${i}`} className="flex items-center gap-3 opacity-40 grayscale hover:opacity-100 transition duration-500"><Icon size={20}/><span className="text-xs md:text-sm font-semibold tracking-[.18em]">{name}</span></div>)}</div></section>}