'use client';
import {AnimatePresence,motion,useScroll,useTransform} from 'framer-motion';
import {MoveUpRight,X} from 'lucide-react';
import {useEffect,useRef,useState} from 'react';

type Project={title:string;kind:string;year:string;video:string;summary:string;detail:string};
const projects:Project[]=[
 {title:'ORBIT',kind:'AI OPERATING SYSTEM',year:'2026',video:'/softwarepar-portfolio/assets/Create_a_cinematic_hero_video.mp4',summary:'An intelligent operating layer for high-velocity teams.',detail:'ORBIT unifies signal, workflow and decision support into one adaptive interface. The concept explores how AI can become an ambient operating system rather than another dashboard.'},
 {title:'NEURAL',kind:'PREDICTIVE COMMERCE',year:'2026',video:'/softwarepar-portfolio/assets/Create_a_sophisticated_cinemat.mp4',summary:'A predictive commerce system that turns behavior into action.',detail:'NEURAL combines real-time intent modeling, automated segmentation and responsive merchandising to demonstrate a future-facing commerce experience.'},
 {title:'VECTOR',kind:'DIGITAL INFRASTRUCTURE',year:'2026',video:'/softwarepar-portfolio/assets/Create_an_extreme_macro_cinema.mp4',summary:'A modular command surface for distributed digital operations.',detail:'VECTOR reframes infrastructure software as a premium product experience: precise, calm and fast, with progressive disclosure for complex operational data.'},
];

function ProjectVideo({src,title}:{src:string;title:string}){return <video aria-label={title} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover"><source src={src} type="video/mp4"/></video>}

function ProjectCard({project,index,onOpen}:{project:Project;index:number;onOpen:()=>void}){
 const ref=useRef<HTMLDivElement>(null);
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});
 const scale=useTransform(scrollYProgress,[0,1],[1,.94]);
 return <div ref={ref} className="relative min-h-0 py-3 md:sticky md:top-20 md:min-h-[82vh] md:py-4" style={{zIndex:index+1}}>
  <motion.article style={{scale}} className="relative mx-auto h-[72svh] min-h-[500px] max-w-[1500px] overflow-hidden rounded-[1.4rem] bg-black text-white shadow-[0_24px_70px_rgba(0,0,0,.16)] sm:min-h-[540px] md:h-[78vh] md:min-h-[560px] md:rounded-[2rem] md:shadow-[0_35px_100px_rgba(0,0,0,.18)]">
   <ProjectVideo src={project.video} title={`${project.title} cinematic case study`}/>
   <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/92 via-black/5 to-black/20"/>
   <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.18)_100%)]"/>
   <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-6 md:p-12">
    <div><p className="label mb-3 text-white/65 md:mb-4">0{index+1} / {project.kind} / {project.year}</p><h3 className="text-[clamp(4rem,21vw,7rem)] font-medium leading-[.76] tracking-[-.075em] md:text-[9vw]">{project.title}</h3><p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base md:mt-5 md:text-lg">{project.summary}</p></div>
    <button onClick={onOpen} className="group mt-5 flex w-max items-center gap-4 rounded-full border border-white/40 bg-black/20 px-5 py-3 text-[10px] tracking-[.18em] backdrop-blur-md transition-colors duration-500 hover:bg-white hover:text-black md:mt-0 md:gap-5 md:px-6 md:text-xs">VIEW CASE <MoveUpRight size={15} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"/></button>
   </div>
  </motion.article>
 </div>
}

export default function FeaturedWork(){
 const [active,setActive]=useState<Project|null>(null);
 useEffect(()=>{document.body.style.overflow=active?'hidden':'';return()=>{document.body.style.overflow=''}},[active]);
 return <section id="work" className="section-line bg-secondary px-4 py-24 sm:px-5 sm:py-28 md:px-8 md:py-36">
  <div className="mx-auto max-w-[1600px]">
   <div className="mb-12 gap-8 md:mb-16 md:flex md:items-end md:justify-between"><div><p className="label mb-4 text-muted md:mb-5">SELECTED WORK / 02</p><h2 className="max-w-[12ch] text-[clamp(3.4rem,15vw,6rem)] font-medium leading-[.9] tracking-[-.06em] md:text-8xl">Work with gravity.</h2></div><p className="mt-5 max-w-sm text-sm leading-6 text-muted md:mt-0">Three speculative systems built as complete product stories, not decorative mockups.</p></div>
   <div className="space-y-3 md:space-y-0">{projects.map((p,i)=><ProjectCard key={p.title} project={p} index={i} onOpen={()=>setActive(p)}/>)}</div>
  </div>
  <AnimatePresence>{active&&<motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{duration:.7,ease:[.16,1,.3,1]}} className="fixed inset-0 z-[120] overflow-y-auto bg-[#0A0A0A] text-white">
   <button aria-label="Close case study" onClick={()=>setActive(null)} className="fixed right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md sm:right-5 sm:top-5 md:right-8 md:top-8"><X size={22}/></button>
   <div className="mx-auto grid min-h-[100svh] max-w-[1600px] gap-8 px-4 pb-16 pt-20 sm:px-5 md:grid-cols-2 md:items-center md:gap-10 md:px-8 md:py-24">
    <div className="relative aspect-video overflow-hidden rounded-[1.3rem] bg-black md:rounded-3xl"><ProjectVideo src={active.video} title={`${active.title} case study motion`}/><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"/></div>
    <div><p className="label text-white/50">CASE STUDY / {active.kind}</p><h3 className="mt-4 text-[clamp(4.5rem,22vw,8rem)] font-medium leading-[.78] tracking-[-.075em] md:mt-5 md:text-[8vw]">{active.title}</h3><p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg md:mt-8 md:text-xl md:leading-8">{active.detail}</p><div className="mt-9 grid grid-cols-2 gap-5 border-t border-white/20 pt-5 text-sm md:mt-12 md:gap-6 md:pt-6"><div><p className="label mb-2 text-white/40">ROLE</p><p>Strategy / UX / AI / Motion</p></div><div><p className="label mb-2 text-white/40">YEAR</p><p>{active.year}</p></div></div></div>
   </div>
  </motion.div>}</AnimatePresence>
 </section>
}
