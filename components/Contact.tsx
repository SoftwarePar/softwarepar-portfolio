'use client';
import {Mail,MoveUpRight} from 'lucide-react';
import {MouseEvent,useRef} from 'react';
import gsap from 'gsap';

const contactUrl='https://wa.me/5491161396633?text=Hola%20Pablo%2C%20vi%20tu%20portfolio%20PIXZEN%20y%20quiero%20consultarte%20por%20un%20proyecto.';
const emailUrl='mailto:softwarepardeve@gmail.com?subject=Consulta%20desde%20PIXZEN';
const linkedinUrl='https://www.linkedin.com/in/pablo-solla-sdr';

export default function Contact(){
 const button=useRef<HTMLAnchorElement>(null);
 const label=useRef<HTMLSpanElement>(null);
 const icon=useRef<HTMLSpanElement>(null);
 const move=(e:MouseEvent<HTMLDivElement>)=>{if(!button.current||window.matchMedia('(pointer: coarse)').matches)return;const rect=button.current.getBoundingClientRect();const x=e.clientX-(rect.left+rect.width/2);const y=e.clientY-(rect.top+rect.height/2);const distance=Math.hypot(x,y);if(distance<220){gsap.to(button.current,{x:x*.16,y:y*.16,duration:.42,ease:'power4.out'});if(label.current)gsap.to(label.current,{x:x*.035,y:y*.035,duration:.42,ease:'power4.out'});if(icon.current)gsap.to(icon.current,{x:x*.055,y:y*.055,duration:.42,ease:'power4.out'})}};
 const reset=()=>{if(button.current)gsap.to(button.current,{x:0,y:0,duration:1.05,ease:'elastic.out(1,.35)'});if(label.current)gsap.to(label.current,{x:0,y:0,duration:.8,ease:'power4.out'});if(icon.current)gsap.to(icon.current,{x:0,y:0,duration:.8,ease:'power4.out'})};
 return <section id="contact" onMouseMove={move} onMouseLeave={reset} className="section-line relative min-h-[100svh] overflow-hidden bg-black px-4 py-24 text-white sm:px-5 sm:py-28 md:px-8">
  <div className="absolute left-[4%] top-[18%] h-[55vw] w-[55vw] rounded-full bg-white/12 blur-3xl animate-pulse md:left-[10%] md:h-[35vw] md:w-[35vw]"/>
  <div className="absolute bottom-[4%] right-[2%] h-[52vw] w-[52vw] rounded-full bg-[#7d7d7d]/30 blur-3xl animate-pulse [animation-delay:1s] md:right-[8%] md:h-[32vw] md:w-[32vw]"/>
  <div className="relative z-10 mx-auto flex min-h-[76svh] max-w-[1600px] flex-col items-center justify-center text-center">
   <p className="label mb-6 max-w-[90vw] text-white/45 md:mb-7">LET&apos;S MAKE SOMETHING IMPOSSIBLE TO IGNORE</p>
   <h2 className="max-w-[1500px] text-[clamp(4rem,20vw,8rem)] font-medium leading-[.8] tracking-[-.075em] mix-blend-difference md:text-[10vw]">Let&apos;s Build<br/>The Future.</h2>
   <p className="mt-7 max-w-xl px-2 text-sm leading-6 text-white/55 sm:mt-9 sm:text-base sm:leading-7">Strategy, artificial intelligence, digital product and motion brought together as one coherent experience.</p>
   <div className="mt-9 flex w-full items-center justify-center sm:mt-12 sm:min-h-[120px]">
    <a ref={button} href={contactUrl} target="_blank" rel="noreferrer" aria-label="Contact Pablo on WhatsApp" className="group relative inline-flex w-full max-w-[290px] items-center justify-between overflow-hidden rounded-full border border-white/45 bg-white px-5 py-3.5 text-black shadow-[0_15px_70px_rgba(255,255,255,.12)] transition-[background-color,color,border-color] duration-500 hover:border-white hover:bg-black hover:text-white sm:w-auto sm:min-w-[270px] sm:px-6 sm:py-4">
     <span className="absolute inset-0 origin-left scale-x-0 bg-black transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"/>
     <span ref={label} className="relative z-10 whitespace-nowrap text-[10px] font-semibold tracking-[.18em] sm:text-[11px] sm:tracking-[.2em]">START A PROJECT</span>
     <span ref={icon} className="relative z-10 ml-4 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/15 bg-black text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-white/20 group-hover:bg-white group-hover:text-black sm:ml-6"><MoveUpRight size={15}/></span>
    </a>
   </div>
   <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[10px] font-medium tracking-[.16em] text-white/50 sm:text-[11px]">
    <a href={emailUrl} className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-white"><Mail size={13}/> SOFTWAREPARDEVE@GMAIL.COM</a>
    <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-white">LINKEDIN <MoveUpRight size={13}/></a>
   </div>
  </div>
 </section>
}
