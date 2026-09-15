import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import Stats from "@/components/landing/Stats";
import CallToAction from "@/components/landing/CallToAction";
import LandingFooter from "@/components/landing/LandingFooter";
import BackToTop from "@/components/ui/BackToTop";

export default function Home() {
  return (
    <div className="page-shell">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
        <Stats />
        <CallToAction />
      </main>

      <LandingFooter />
      <BackToTop/>
    </div>
  );
}