import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import EmployeesSection from "@/components/EmployeesSection";
import StatsSection from "@/components/StatsSection";
import IndustriesSection from "@/components/IndustriesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import DynamicSection from "@/components/DynamicSection";
import { api } from "../utils/api";

const Index = () => {
  const [customTabs, setCustomTabs] = useState<any[]>([]);

  useEffect(() => {
    api.get("custom-tabs").then((data) => {
      if (data && Array.isArray(data)) {
        setCustomTabs(data);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <EmployeesSection />
      <StatsSection />
      <IndustriesSection />

      {/* Dynamic Sections from Admin */}
      {customTabs.map((ct) => (
        <DynamicSection
          key={ct.id || ct._id}
          slug={ct.slug}
          title={ct.name}
          icon={ct.icon}
        />
      ))}

      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
