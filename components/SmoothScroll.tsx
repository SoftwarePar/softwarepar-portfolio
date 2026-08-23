'use client';
import {ReactNode,useEffect} from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({children}:{children:ReactNode}){
  useEffect(()=>{const lenis=new Lenis({lerp:.05,smoothWheel:true});let rafId=0;const raf=(time:number)=>{lenis.raf(time);rafId=requestAnimationFrame(raf)};rafId=requestAnimationFrame(raf);return()=>{cancelAnimationFrame(rafId);lenis.destroy()}},[]);
  return <>{children}</>
}