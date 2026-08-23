import {Aperture,Atom,Boxes,BrainCircuit,CircleDot,Hexagon,Orbit,Sparkles} from 'lucide-react';

const brands=[['NOVA',Aperture],['KERNEL',BrainCircuit],['VECTOR',Boxes],['NEURAL',Atom],['ARC',Orbit],['MOTION',Sparkles],['SIGNAL',CircleDot],['FRAME',Hexagon]] as const;
export default function TrustedBrands(){return <section className="section-line edge-fade relative overflow-hidden py-8"><div className="marquee-track items-center gap-16 pr-16 opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 md:gap-24 md:pr-24">{[...brands,...brands].map(([name,Icon],i)=><div key={`${name}-${i}`} className="flex shrink-0 items-center gap-3"><Icon size={22} strokeWidth={1.4}/><span className="text-sm font-medium tracking-[.2em]">{name}</span></div>)}</div></section>}
