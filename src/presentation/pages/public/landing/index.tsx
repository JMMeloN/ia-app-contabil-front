
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { Services } from "@/components/Services";
import { Cta } from "@/components/Cta";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import "../../../../App.css";

export function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <Services />
      <Cta />
      <Pricing />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}

