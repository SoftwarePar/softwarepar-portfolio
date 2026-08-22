import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustedBrands from '@/components/TrustedBrands';
import Services from '@/components/Services';
import FeaturedWork from '@/components/FeaturedWork';
import About from '@/components/About';
import Insights from '@/components/Insights';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home(){return <SmoothScroll><Navbar/><main><Hero/><TrustedBrands/><Services/><FeaturedWork/><About/><Insights/><Contact/></main><Footer/></SmoothScroll>}