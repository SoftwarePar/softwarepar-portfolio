'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ChevronDown,MoveUpRight,Play} from 'lucide-react';
import gsap from 'gsap';

const phrases=['Building Tomorrow','Shaping Futures','Driving Growth'];
export default function Hero(){
  const root=useRef<HTMLElement>(null);const [phrase,setPhrase]=useState(0);const [typed,setTyped]=useState('');
  const current=useMemo(()=>phrases[phrase], [phrase]);
  useEffect(()=>{let i=0;setTyped('');const type=window.setInterval(()=>{i++;setTyped(current.slice(0,i));if(i>=current.length){window.clearInterval(type);window.setTimeout(()=>setPhrase(v=>(v+1)%phrases.length),1200)}},58);return()=>window.clearInterval(type)},[current]);
  useEffect(()=>{if(!root.current)return;const ctx=gsap.context(()=>{gsap.from('[data-hero-reveal]',{y:70,opacity:0,duration:1.25,stagger:.09,ease:'power4.out'});gsap.to('[data-hero-orbit]',{rotate:360,duration:26,repeat:-1,ease:'none'});gsap.to('[data-hero-float]',{y:-20,rotation:2,duration:4.2,yoyo:true,repeat:-1,ease:'sine.inOut'})},root);return()=>ctx.revert()},[]);
  return <section ref={root} className="relative min-h-screen overflow-hidden px-5 pt-28 md:px-8 md:pt-32">
    <div className="absolute inset-0 halftone opacity-60"/><div className="absolute inset-0 mesh opacity-35"/>
    <div className="orb -left-20 top-1/3 h-72 w-72 bg-black/10"/><div className="orb right-0 top-16 h-96 w-96 bg-white"/>
    <div data-hero-orbit className="absolute left-1/2 top-[43%] h-[48vw] w-[48vw] max-h-[760px] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/15">
      <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"/>
      <div className="absolute bottom-[9%] right-[8%] h-2 w-2 rounded-full bg-black"/>
    </div>
    <div data-hero-float className="absolute left-1/2 top-[44%] h-[34vw] w-[34vw] max-h-[530px] max-w-[530px] -translate-x-1/2 -translate-y-1/2 rounded-[46%_54%_61%_39%/48%_38%_62%_52%] border border-black/20 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,.95),rgba(225,222,215,.78)_45%,rgba(10,10,10,.08)_100%)] shadow-[inset_-35px_-45px_90px_rgba(10,10,10,.12),0_50px_120px_rgba(10,10,10,.08)] backdrop-blur-2xl"/>
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] max-w-[1600px] flex-col justify-center">
      <div className="mb-7 flex items-center justify-center gap-3" data-hero-reveal><span className="label text-muted">AI / BRAND / DIGITAL PRODUCT STUDIO</span><span className="h-px w-12 bg-black/30"/></div>
      <h1 data-hero-reveal className="display text-center text-[20vw] font-medium uppercase md:text-[12.2vw]">PIXZEN</h1>
      <div data-hero-reveal className="mx-auto mt-8 flex min-h-12 items-center text-center text-3xl font-medium tracking-[-.04em] md:text-5xl"><span>{typed}</span><span className="cursor-blink ml-1">|</span></div>
      <p data-hero-reveal className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6 text-muted md:text-base">We fuse artificial intelligence, strategy and cinematic interaction to build digital experiences that feel inevitable.</p>
      <div data-hero-reveal className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-3"><a href="#work" className="group flex items-center gap-4 rounded-full bg-black px-6 py-3 text-xs tracking-[.18em] text-white transition-transform hover:scale-[1.03]">VIEW WORK <MoveUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/></a><button className="flex items-center gap-3 rounded-full border border-black/20 px-5 py-3 text-xs tracking-[.15em]"><Play size={14} fill="currentColor"/> SHOWREEL 00:48</button></div>
    </div>
    <div className="absolute bottom-7 left-5 right-5 z-10 flex items-end justify-between md:left-8 md:right-8"><div className="label text-muted">BUENOS AIRES / 34.6037° S</div><div className="bounce-soft flex flex-col items-center gap-2"><span className="label">SCROLL DOWN</span><ChevronDown size={16}/></div><div className="label hidden text-muted md:block">EST. 2026 / INDEPENDENT</div></div>
  </section>