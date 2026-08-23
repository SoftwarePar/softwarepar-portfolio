'use client';
import Image from 'next/image';
import {MoveUpRight} from 'lucide-react';
import {MouseEvent,useRef,useState} from 'react';
import gsap from 'gsap';

type Insight={category:string;title:string;date:string;image:string};
const insights:Insight[]=[
 {category:'AI / CULTURE',title:'When machines develop taste',date:'18.08.26',image:'/softwarepar-portfolio/assets/insight-01.svg'},
 {category:'STRATEGY / GROWTH',title:'Designing momentum, not campaigns',date:'11.08.26',image:'/softwarepar-portfolio/assets/insight-02.svg'},
 {category:'PRODUCT / SYSTEMS',title:'Interfaces that think with you',date:'02.08.26',image:'/softwarepar-portfolio/assets/insight-03.svg'},
];

export default function Insights(){
 const cursor=useRef<HTMLDivElement>(null);
 const [image,setImage]=useState(insights[0].image);
 const move=(e:MouseEvent<HTMLDivElement>)=>{if(!cursor.current)return;const width=390;const height=260;const x=Math.min(e.clientX+24,window.innerWidth-width-24);const y=Math.max(24,Math.min(e.clientY-height/2,window.innerHeight-height-24));gsap.to(cursor.current,{x,y,duration:.5,ease:'power4.out'})};
 const enter=(src:string)=>{setImage(src);if(cursor.current)gsap.to(cursor.current,{autoAlpha:1,scale:1,duration:.42,ease:'power4.out'})};
 const leave=()=>{if(cursor.current)gsap.to(cursor.current,{autoAlpha:0,scale:.86,duration:.32,ease:'power4.out'})};
 return <section id="insights" className="section-line px-4 py-24 sm:px-5 sm:py-28 md:px-8 md:py-40" onMouseMove={move}>
  <div ref={cursor} className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-[260px] w-[390px] overflow-hidden rounded-2xl border border-black/10 bg-secondary opacity-0 shadow-[0_25px_80px_rgba(0,0,0,.22)] lg:block"><Image src={image} alt="Insight preview" fill sizes="390px" className="object-cover"/></div>
  <div className="mx-auto max-w-[1600px]">
   <div className="mb-10 grid grid-cols-12 gap-5 sm:mb-14 md:gap-6"><p className="label col-span-12 text-muted md:col-span-4">INSIGHTS / 04</p><h2 className="col-span-12 max-w-[13ch] text-[clamp(3.2rem,14vw,6rem)] font-medium leading-[.9] tracking-[-.06em] md:col-span-8 md:max-w-none md:text-8xl">Ideas for what comes next.</h2></div>
   <div className="border-b border-border">{insights.map(item=><div key={item.title} onMouseEnter={()=>enter(item.image)} onMouseLeave={leave} className="group relative border-t border-border py-6 transition-colors duration-500 hover:bg-secondary sm:py-7 md:grid md:grid-cols-12 md:items-center md:gap-4 md:py-9"><div className="mb-3 flex items-center justify-between gap-4 md:col-span-2 md:mb-0"><span className="label text-muted">{item.category}</span><span className="label text-muted md:hidden">{item.date}</span></div><h3 className="pr-10 text-[clamp(1.55rem,7vw,2.5rem)] font-medium leading-[1.03] tracking-[-.04em] md:col-span-7 md:pr-0 md:text-4xl">{item.title}</h3><span className="label hidden text-muted md:col-span-2 md:block">{item.date}</span><MoveUpRight className="absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-[calc(50%+4px)] md:static md:col-span-1 md:justify-self-end md:translate-y-0 md:group-hover:-translate-y-1" size={20}/></div>)}</div>
  </div>
 </section>
}
