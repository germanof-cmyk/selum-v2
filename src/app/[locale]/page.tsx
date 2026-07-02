import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import Products from "@/components/sections/Products";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import WorkWithUs from "@/components/sections/WorkWithUs";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <Products />
      <WorkWithUs />
      <About />
      <Projects />
      <CTASection />
      <Footer />
    </main>
  );
}
