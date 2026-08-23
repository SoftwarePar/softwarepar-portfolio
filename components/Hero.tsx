'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ChevronDown} from 'lucide-react';
import gsap from 'gsap';

const phrases=['Building Tomorrow','Shaping Futures','Driving Growth'];
const videoSrc='https://raw.githubusercontent.com/SoftwarePar/softwarepar-portfolio/main/public/hero_bg_animation_hand.mp4';

export default function Hero(){
  const root=useRef<HTMLElement>(null);
  const videoRef=useRef<HTMLVideoElement>(null);
  const [phrase,setPhrase]=useState(0);
  const [typed,setTyped]=useState('');
  const current=useMemo(()=>phrases[phrase],[phrase]);

  useEffect(()=>{
    let i=0;
    setTyped('');
    const timer=window.setInterval(()=>{
      i+=1;
      setTyped(current.slice(0,i));
      if(i>=current.length){
        window.clearInterval(timer);
        window.setTimeout(()=>setPhrase(v=>(v+1)%phrases.length),1250);
      }
    },62);
    return()=>window.clearInterval(timer);
  },[current]);

  useEffect(()=>{
    if(!root.current)return;
    const ctx=gsap.context(()=>{
      gsap.from('[data-hero]',{y:60,opacity:0,duration:1.25,stagger:.08,ease:'power4.out'});
    },root);
    return()=>ctx.revert();
  },[]);

  useEffect(()=>{
    const video=videoRef.current;
    if(!video)return;
    video.muted=true;
    const play=()=>{void video.play().catch(()=>undefined)};
    if(video.readyState>=2)play();
    else video.addEventListener('canplay',play,{once:true});
    return()=>video.removeEventListener('canplay',play);
  },[]);

  return <section ref={root} id="home" className="relative min-h-screen overflow-hidden border-t border-border bg-[#F5F3EF]">
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#F5F3EF]">
      <video
        ref={videoRef}
        src={videoSrc}
        className="absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-center opacity-100 grayscale contrast-[1.05] brightness-[1.03]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>

    <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(245,243,239,0)_0%,rgba(245,243,239,.02)_62%,rgba(245,243,239,.20)_100%)]"/>
    <div className="pointer-events-none absolute inset-0 z-[2] halftone opacity-20"/>

    <div className="relative z-10 mx-auto flex min-h-screen max-w-[1680px] flex-col items-center justify-center px-5 pt-24 text-center md:px-8">
      <p data-hero className="label mb-6 text-muted">PIXZEN / INDEPENDENT AI CREATIVE STUDIO</p>
      <h1 data-hero className="max-w-[1600px] whitespace-nowrap text-[17vw] font-medium leading-[.82] tracking-[-.075em] md:text-[9.5vw]">PIXZEN</h1>
      <div data-hero className="mt-7 flex min-h-14 items-center justify-center text-3xl font-medium tracking-[-.045em] md:text-6xl"><span>{typed}</span><span className="cursor-blink ml-1">|</span></div>
      <p data-hero className="mt-7 max-w-xl text-sm leading-6 text-muted md:text-base">AI-powered strategy, brand and digital products for companies shaping what comes next.</p>
    </div>

    <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center"><span className="label block">SCROLL DOWN</span><ChevronDown className="bounce-soft mx-auto mt-2" size={17}/></div>
  </section>;
}