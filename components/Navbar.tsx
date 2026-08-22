'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = ['Expertise','Work','About','Insights'];
export default function Navbar(){
  const [scrolled,setScrolled]=useState(false); const [open,setOpen]=useState(false);
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>50);onScroll();addEventListener('scroll',onScroll);return()=>removeEventListener('scroll',onScroll)},[]);
  return <>
    <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-8 transition-all duration-500 ${scrolled?'backdrop-blur-md bg-background/80 border-b border-border':''}`}>
      <a href="#top" className="font-semibold tracking-[.2em] text-sm">PIXZEN</a>
      <nav className="hidden md:flex gap-8 text-xs uppercase tracking-[.16em]">
        {links.map(l=><a key={l} href={`#${l.toLowerCase()}`} className="relative group py-2"><span>{l}</span><span className="absolute left-0 bottom-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 group-hover:scale-x-100"/></a>)}
      </nav>
      <div className="flex items-center gap-3"><a href="#contact" className="rounded-full border border-foreground px-5 py-2 text-xs font-semibold tracking-[.14em] transition hover:bg-foreground hover:text-background">LET&apos;S TALK</a><button onClick={()=>setOpen(true)} className="md:hidden" aria-label="Open menu"><Menu size={22}/></button></div>
    </header>
    <AnimatePresence>{open&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.45,ease:[.22,1,.36,1]}} className="fixed inset-0 z-[60] bg-foreground text-background p-6 flex flex-col"><button onClick={()=>setOpen(false)} className="ml-auto" aria-label="Close menu"><X size={28}/></button><div className="mt-auto mb-auto flex flex-col gap-3">{links.map((l,i)=><motion.a initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.08*i}} key={l} href={`#${l.toLowerCase()}`} onClick={()=>setOpen(false)} className="text-[13vw] leading-none tracking-[-.06em]">{l}</motion.a>)}</div></motion.div>}</AnimatePresence>
  </>;
}