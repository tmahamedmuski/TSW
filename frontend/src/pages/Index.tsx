import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import EmployeesSection from "@/components/EmployeesSection";
import StatsSection from "@/components/StatsSection";
import IndustriesSection from "@/components/IndustriesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <EmployeesSection />
      <StatsSection />
      <IndustriesSection />


      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
