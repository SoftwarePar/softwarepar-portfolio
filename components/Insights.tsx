'use client';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

const items=[
  ['AI','Designing for intelligent behavior','12.08.26','radial-gradient(circle at 30% 30%,#c7ff2f,#111 68%)'],
  ['STRATEGY','Why premium brands need motion systems','04.08.26','linear-gradient(135deg,#ddd8cf,#292929)'],
  ['PRODUCT','From interface to living system','21.07.26','radial-gradient(circle at 70% 30%,#f5f3ef,#111 72%)']
];
export default function Insights(){const cursor=useRef<HTMLDivElement>(null);const [active,setActive]=useState<number|null>(null);const move=(e:React.MouseEvent)=>{if(!cursor.current)return;gsap.to(cursor.current,{x:e.clientX-150,y:e.clientY-100,duration:.55,ease:'power4.out'})};return <section id="insights" className="section-line px-5 md:px-8 py-24 md:py-32" onMouseMove={move}><p className="text-[10px] uppercase tracking-[.32em] text-muted mb-10">04 / INSIGHTS</p><div className="border-t border-border">{items.map((it,i)=><a key={it[1]} href="#contact" onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)} className="grid grid-cols-12 gap-3 items-center py-7 border-b border-border group"><span className="col-span-3 md:col-span-2 text-[10px] tracking-[.2em] text-muted">{it[0]}</span><strong className="col-span-8 md:col-span-7 text-xl md:text-4xl tracking-[-.04em] font-medium group-hover:translate-x-2 transition duration-500">{it[1]}</strong><span className="hidden md:block md:col-span-2 text-xs text-muted">{it[2]}</span><ArrowUpRight className="col-span-1 justify-self-end" size={18}/></a>)}</div><div ref={cursor} className={`pointer-events-none fixed left-0 top-0 z-40 hidden md:block h-[200px] w-[300px] transition-opacity duration-300 ${active===null?'opacity-0':'opacity-100'}`} style={{background:active===null?'transparent':items[active][3]}}><div className="absolute inset-0 halftone opacity-25"/></div></section>}