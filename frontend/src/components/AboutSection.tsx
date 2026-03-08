import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle } from "lucide-react";
import { api } from "../utils/api";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    api.get("home-content").then(res => {
      if (res) setContent(res.about);
    });
  }, []);

  const defaultCompetencies = [
    "End-to-End Software Solutions",
    "Expertise Across Multiple Platforms",
    "Dedicated Team & Support Resources",
    "Strategic Technology Partnerships",
    "Industry-Specific Verticals",
    "Professional Project Management",
  ];

  return (
    <section id="about" className="py-24" ref={ref}>
      <div className="container mx-auto">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              {content?.subtitle || "About Us"}
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              {content?.title ? (
                content.title.split('requirements').length > 1 ? (
                  <>
                    {content.title.split('requirements')[0]}
                    <span className="text-gradient">requirements</span>
                  </>
                ) : content.title
              ) : (
                <>
                  Tailoring world-class digital solutions to match{" "}
                  <span className="text-gradient">your distinct requirements</span>
                </>
              )}
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {content?.description1 || "Saltware (PVT) Ltd, based in Puttalam, North Western Province, is a premier software development company specializing in designing, executing, and supporting enterprise solutions for diverse industries."}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {content?.description2 || "Prioritizing our client's needs, we emphasize value creation by employing collaborative methodologies, ensuring technology solutions are perfectly aligned with business objectives."}
            </p>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-8"
          >
            <h3 className="mb-6 font-display text-lg font-semibold text-foreground">
              {content?.competenciesTitle || "Key Competencies"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {(content?.competencies || defaultCompetencies).map((c: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-sm text-secondary-foreground">{c}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
