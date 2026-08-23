'use client';
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);
const values='ARTIFICIAL INTELLIGENCE — BRAND STRATEGY — DIGITAL PRODUCTS — EXPERIENCE DESIGN — GROWTH SYSTEMS — ';
export default function About(){const root=useRef<HTMLElement>(null);const text=useRef<HTMLParagraphElement>(null);useEffect(()=>{if(!root.current||!text.current)return;const split=new SplitType(text.current,{types:'words'});const words=split.words??[];gsap.set(words,{color:'#B3B0AA'});const tween=gsap.to(words,{color:'#0A0A0A',stagger:.08,ease:'none',scrollTrigger:{trigger:root.current,start:'top 68%',end:'bottom 42%',scrub:1}});return()=>{tween.kill();split.revert()}},[]);return <section ref={root} id="about" className="section-line bg-background py-28 md:py-44"><div className="mx-auto max-w-[1600px] px-5 md:px-8"><p className="label mb-14 text-muted">ABOUT / VISION / 03</p><p ref={text} className="max-w-[1500px] text-[10vw] font-medium leading-[.92] tracking-[-.065em] md:text-[6.5vw]">We believe the next generation of brands will not separate intelligence from identity, product from storytelling, or technology from emotion. We build systems where all of them move as one.</p></div><div className="mt-28 overflow-hidden border-y border-border py-7"><div className="marquee-track text-[8vw] font-medium uppercase leading-none tracking-[-.05em] md:text-[5vw]"><span className="whitespace-nowrap">{values}{values}</span><span className="whitespace-nowrap">{values}{values}</span></div></div></section>}
