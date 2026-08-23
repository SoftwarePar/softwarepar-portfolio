'use client';
import {AnimatePresence,motion} from 'framer-motion';
import {Linkedin,Menu,MessageCircle,X} from 'lucide-react';
import {useEffect,useState} from 'react';

const links=[['Work','#work'],['Expertise','#services'],['About','#about'],['Insights','#insights']];
const whatsapp='https://wa.me/5491161396633?text=Hola%20Pablo%2C%20vi%20tu%20portfolio%20PIXZEN%20y%20quiero%20consultarte%20por%20un%20proyecto.';
const linkedin='https://www.linkedin.com/in/pablo-solla-sdr';

export default function Navbar(){
 const [scrolled,setScrolled]=useState(false);
 const [open,setOpen]=useState(false);
 useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>50);onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);
 useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow=''}},[open]);
 return <>
  <header className={`fixed left-0 top-0 z-[100] w-full transition-all duration-500 ${scrolled?'border-b border-border bg-background/80 backdrop-blur-md':'bg-transparent'}`}>
   <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-4 sm:h-20 sm:px-5 md:px-8">
    <a href="#home" aria-label="PIXZEN home" className="text-xs font-semibold tracking-[.22em] sm:text-sm">PIXZEN</a>
    <nav className="hidden items-center gap-7 md:flex lg:gap-9">{links.map(([label,href])=><a key={label} href={href} className="group relative py-2 text-[11px] tracking-[.14em]"><span>{label.toUpperCase()}</span><span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-black transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100"/></a>)}</nav>
    <div className="flex items-center gap-2 sm:gap-3">
     <a href={whatsapp} target="_blank" rel="noreferrer" className="hidden rounded-full border border-black/25 px-4 py-2.5 text-[9px] font-semibold tracking-[.17em] transition-all duration-500 hover:bg-black hover:text-white min-[390px]:inline-flex sm:px-5 sm:text-[10px]">LET&apos;S TALK</a>
     <button aria-label="Open menu" onClick={()=>setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-black/20 md:hidden"><Menu size={17}/></button>
    </div>
   </div>
  </header>
  <AnimatePresence>{open&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.45,ease:[.16,1,.3,1]}} className="fixed inset-0 z-[130] bg-[#0A0A0A] text-white">
   <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-5"><span className="text-xs font-semibold tracking-[.22em] sm:text-sm">PIXZEN</span><button aria-label="Close menu" onClick={()=>setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-white/25"><X size={18}/></button></div>
   <div className="flex h-[calc(100svh-4rem)] flex-col justify-center px-4 pb-5 sm:h-[calc(100svh-5rem)] sm:px-5">
    <div>{links.map(([label,href],i)=><motion.a key={label} href={href} onClick={()=>setOpen(false)} initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.07*i,duration:.65,ease:[.16,1,.3,1]}} className="block border-t border-white/15 py-3 text-[13vw] font-medium leading-none tracking-[-.06em] last:border-b sm:py-4">{label}</motion.a>)}</div>
    <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.34,duration:.65,ease:[.16,1,.3,1]}} className="mt-7 grid grid-cols-2 gap-3">
     <a href={whatsapp} target="_blank" rel="noreferrer" onClick={()=>setOpen(false)} className="flex items-center justify-center gap-2 rounded-full border border-white/25 px-4 py-3 text-[10px] tracking-[.16em]"><MessageCircle size={15}/> WHATSAPP</a>
     <a href={linkedin} target="_blank" rel="noreferrer" onClick={()=>setOpen(false)} className="flex items-center justify-center gap-2 rounded-full border border-white/25 px-4 py-3 text-[10px] tracking-[.16em]"><Linkedin size={15}/> LINKEDIN</a>
    </motion.div>
   </div>
  </motion.div>}</AnimatePresence>
 </>
}
