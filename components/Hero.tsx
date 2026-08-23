'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ChevronDown} from 'lucide-react';
import gsap from 'gsap';

const phrases=['Building Tomorrow','Shaping Futures','Driving Growth'];
const videoSrc='/softwarepar-portfolio/hero_bg_animation_hand.mp4.mp4';

export default function Hero(){
 const root=useRef<HTMLElement>(null);
 const videoRef=useRef<HTMLVideoElement>(null);
 const [phrase,setPhrase]=useState(0);
 const [typed,setTyped]=useState('');
 const current=useMemo(()=>phrases[phrase],[phrase]);

 useEffect(()=>{let i=0;setTyped('');const timer=window.setInterval(()=>{i+=1;setTyped(current.slice(0,i));if(i>=current.length){window.clearInterval(timer);window.setTimeout(()=>setPhrase(v=>(v+1)%phrases.length),1250)}},62);return()=>window.clearInterval(timer)},[current]);
 useEffect(()=>{if(!root.current)return;const ctx=gsap.context(()=>{gsap.from('[data-hero]',{y:46,opacity:0,duration:1.15,stagger:.08,ease:'power4.out'})},root);return()=>ctx.revert()},[]);
 useEffect(()=>{const video=videoRef.current;if(!video)return;video.muted=true;const play=()=>{void video.play().catch(()=>undefined)};if(video.readyState>=2)play();else video.addEventListener('canplay',play,{once:true});return()=>video.removeEventListener('canplay',play)},[]);

 return <section ref={root} id="home" className="relative min-h-[100svh] overflow-hidden border-t border-border bg-[#F5F3EF]">
  <div className="absolute inset-0 z-0 overflow-hidden bg-[#F5F3EF]">
   <video ref={videoRef} src={videoSrc} className="absolute left-1/2 top-[49%] h-auto w-[175vw] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-[.84] mix-blend-luminosity grayscale contrast-[1.03] brightness-[1.08] sm:w-[145vw] md:top-1/2 md:h-full md:w-full md:object-cover md:object-center md:opacity-[.88]" autoPlay muted loop playsInline preload="auto" aria-hidden="true"/>
  </div>
  <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(245,243,239,0)_0%,rgba(245,243,239,.04)_58%,rgba(245,243,239,.28)_100%)] md:bg-[radial-gradient(circle_at_center,rgba(245,243,239,0)_0%,rgba(245,243,239,.03)_62%,rgba(245,243,239,.22)_100%)]"/>
  <div className="pointer-events-none absolute inset-0 z-[2] halftone opacity-20 md:opacity-25"/>

  <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1680px] flex-col items-center justify-center px-4 pb-20 pt-20 text-center sm:px-5 sm:pt-24 md:px-8">
   <p data-hero className="label mb-4 max-w-[90vw] text-muted sm:mb-6">PIXZEN / INDEPENDENT AI CREATIVE STUDIO</p>
   <h1 data-hero className="max-w-[1600px] whitespace-nowrap text-[19vw] font-medium leading-[.82] tracking-[-.075em] sm:text-[17vw] md:text-[9.5vw]">PIXZEN</h1>
   <div data-hero className="mt-5 flex min-h-12 max-w-[94vw] items-center justify-center text-[clamp(1.65rem,8vw,2.35rem)] font-medium leading-none tracking-[-.045em] sm:mt-7 md:min-h-14 md:text-6xl"><span className="whitespace-nowrap">{typed}</span><span className="cursor-blink ml-1">|</span></div>
   <p data-hero className="mt-5 max-w-[32rem] px-3 text-xs leading-5 text-muted sm:mt-7 sm:text-sm sm:leading-6 md:text-base">AI-powered strategy, brand and digital products for companies shaping what comes next.</p>
  </div>

  <a href="#services" aria-label="Scroll to expertise" className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2 text-center sm:bottom-7"><span className="label block">SCROLL DOWN</span><ChevronDown className="bounce-soft mx-auto mt-2" size={17}/></a>
 </section>
}
