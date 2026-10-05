import SplashScreen from "@/components/ui/SplashScreen";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import Products from "@/components/sections/Products";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import WorkWithUs from "@/components/sections/WorkWithUs";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import { getPublicProducts } from "@/lib/published-catalog";
import { selectHomeProducts } from "@/lib/home-products";
import { getPublicProjects } from "@/lib/published-projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, projects] = await Promise.all([getPublicProducts(), getPublicProjects()]);
  const homeProducts = selectHomeProducts(products);
  return (
    <main>
      <SplashScreen />
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <Products products={homeProducts} />
      <WorkWithUs />
      <About />
      <Projects projects={projects} />
      <CTASection />
      <Footer />
    </main>
  );
}
