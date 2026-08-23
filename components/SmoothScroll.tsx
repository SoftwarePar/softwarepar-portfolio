'use client';
import {ReactNode,useEffect} from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({children}:{children:ReactNode}){
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const lenis=new Lenis({lerp:.05,smoothWheel:true,syncTouch:false});
  let rafId=0;
  const raf=(time:number)=>{lenis.raf(time);rafId=requestAnimationFrame(raf)};
  rafId=requestAnimationFrame(raf);
  return()=>{cancelAnimationFrame(rafId);lenis.destroy()}
 },[]);
 return <>{children}</>
}
