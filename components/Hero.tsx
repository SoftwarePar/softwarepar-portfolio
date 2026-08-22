'use client';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const phrases=['Building Tomorrow','Shaping Futures','Driving Growth'];
export default function Hero(){
  const [text,setText]=useState(''); const [index,setIndex]=useState(0); const [deleting,setDeleting]=useState(false);
  useEffect(()=>{const target=phrases[index]; const delay=deleting?42:78; const t=setTimeout(()=>{if(!deleting){const next=target.slice(0,text.length+1);setText(next);if(next===target)setTimeout(()=>setDeleting(true),900)}else{const next=target.slice(0,Math.max(0,text.length-1));setText(next);if(next===''){setDeleting(false);setIndex(v=>(v+1)%phrases.length)}}},delay);return()=>clearTimeout(t)},[text,index,deleting]);
  return <section id="top" className="relative min-h-screen overflow-hidden flex items-center justify-center px-5 section-line">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.95),rgba(245,243,239,.2)_45%,rgba(234,231,225,.95)_100%)]"/>
    <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-[.22] mix-blend-luminosity" src="/softwarepar-portfolio/hero_bg_animation_hand.mp4" />
    <div className="absolute inset-0 halftone opacity-30"/>
    <div className="relative z-10 w-full text-center pt-20">
      <p className="mb-8 text-[10px] md:text-xs font-semibold uppercase tracking-[.36em] text-muted">AI / BRAND / DIGITAL PRODUCT STUDIO</p>
      <h1 className="mx-auto max-w-[1600px] text-[16vw] md:text-[8.2vw] leading-[.84] tracking-[-.07em] font-medium">PIXZEN</h1>
      <div className="mt-8 md:mt-12 text-xl md:text-4xl tracking-[-.04em] font-medium"><span>{text}</span><span className="cursor-blink ml-1">|</span></div>
      <p className="mx-auto mt-6 max-w-xl text-sm md:text-base text-muted leading-relaxed">We fuse artificial intelligence, strategy and cinematic interaction to build digital experiences that feel inevitable.</p>
    </div>
    <a href="#expertise" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[.22em]"><span>Scroll down</span><ChevronDown size={18} className="bounce-soft"/></a>
  </section>
}