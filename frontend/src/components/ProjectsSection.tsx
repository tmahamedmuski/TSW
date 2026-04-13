import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { api } from "../utils/api";
import { ExternalLink, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface Project {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string | null;
  sort_order: number;
  status?: string;
  data?: Record<string, string>;
}

const ProjectsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.get("projects").then((data) => {
      if (data) {
        const filtered = (data as any[]).filter(item =>
          !item.status || item.status.toLowerCase() === "approved"
        );
        setProjects(filtered as Project[]);
      }
    });
  }, []);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Our Work
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Explore our portfolio of successful implementations and client solutions.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.id || p._id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
            >
              <div className="aspect-video overflow-hidden bg-secondary">
                {p.image_url ? (
                  <img
                    src={api.getAssetUrl(p.image_url) || ""}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <FolderOpen size={48} />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {p.title}
                </h3>
                {/* Dynamic Fields - Polished UI */}
                {p.data && Object.entries(p.data).length > 0 && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {Object.entries(p.data).map(([key, value]) => value && (
                      <div key={key} className="flex flex-col rounded-md border border-primary/10 bg-primary/5 px-2 py-1 transition-colors hover:border-primary/20">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-accent/80 leading-none mb-1">{key}</span>
                        <span className="text-[11px] font-medium text-foreground leading-none">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to={`/project/${p.id || p._id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 hover:underline"
                  >
                    View Details
                  </Link>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                    >
                      Live Link <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
