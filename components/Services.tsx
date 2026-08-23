'use client';
import {motion,AnimatePresence} from 'framer-motion';
import {useState} from 'react';

const services=[
 {title:'AI Systems',desc:'Custom agents, intelligent workflows and automation layers designed around real business operations.',video:'/softwarepar-portfolio/assets/AI_SYSTEMS__Create_a_premiu.mp4'},
 {title:'Brand Strategy',desc:'Positioning, narrative systems and visual direction for ambitious technology-led brands.',video:'/softwarepar-portfolio/assets/BRAND_STRATEGY__Create_a_lu.mp4'},
 {title:'Digital Products',desc:'Premium interfaces, SaaS experiences and conversion-focused platforms built end to end.',video:'/softwarepar-portfolio/assets/DIGITAL_PRODUCTS__Create_a.mp4'},
 {title:'Growth Systems',desc:'Experimentation, lifecycle and performance systems that turn attention into measurable momentum.',video:'/softwarepar-portfolio/assets/GROWTH_SYSTEMS__Create_a_so.mp4'},
];

function ServiceVideo({src}:{src:string}){return <video autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover grayscale"><source src={src} type="video/mp4"/></video>}

export default function Services(){
 const [active,setActive]=useState(0);
 return <section id="services" className="section-line px-4 py-24 sm:px-5 sm:py-28 md:px-8 md:py-40">
  <div className="mx-auto max-w-[1600px]">
   <div className="mb-12 grid grid-cols-12 gap-5 sm:mb-16 md:gap-6">
    <p className="label col-span-12 text-muted md:col-span-5">OUR EXPERTISE / 01</p>
    <h2 className="col-span-12 max-w-[16ch] text-[clamp(2.6rem,12vw,4.4rem)] font-medium leading-[.95] tracking-[-.055em] md:col-span-7 md:max-w-none md:text-7xl">Built where strategy, intelligence and experience meet.</h2>
   </div>

   <div className="space-y-5 md:hidden">{services.map((s,i)=><article key={s.title} className="overflow-hidden border-t border-border pt-5 last:border-b last:pb-5"><div className="mb-4 flex items-end justify-between gap-4"><h3 className="text-[clamp(2rem,10vw,3.2rem)] font-medium leading-none tracking-[-.05em]">{s.title}</h3><span className="label shrink-0 text-muted">0{i+1}</span></div><div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-secondary sm:aspect-video"><ServiceVideo src={s.video}/><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/><p className="absolute inset-x-0 bottom-0 p-5 text-sm leading-6 text-white/90">{s.desc}</p></div></article>)}</div>

   <div className="hidden grid-cols-12 gap-12 md:grid">
    <div className="col-span-5">{services.map((s,i)=><button key={s.title} onMouseEnter={()=>setActive(i)} onFocus={()=>setActive(i)} onClick={()=>setActive(i)} className="group flex w-full items-center justify-between border-t border-border py-7 text-left last:border-b"><span className="text-3xl font-medium tracking-[-.045em] transition-transform duration-500 group-hover:translate-x-2 lg:text-5xl">{s.title}</span><span className="label text-muted">0{i+1}</span></button>)}</div>
    <div className="col-span-7"><div className="sticky top-28 h-[68vh] min-h-[520px] overflow-hidden rounded-[1.5rem] bg-secondary"><AnimatePresence mode="wait"><motion.div key={active} initial={{opacity:0,scale:1.025}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.99}} transition={{duration:.7,ease:[.16,1,.3,1]}} className="absolute inset-0"><ServiceVideo src={services[active].video}/><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(10,10,10,.12)_100%)]"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-7 pt-32 text-white lg:p-10"><p className="max-w-xl text-lg leading-7 lg:text-xl">{services[active].desc}</p></div></motion.div></AnimatePresence></div></div>
   </div>
  </div>
 </section>
}
