import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { api } from "../utils/api";

interface Stat {
  id?: string;
  _id?: string;
  value: string;
  label: string;
  sort_order: number;
  status?: string;
  data?: Record<string, string>;
}

const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    api.get("stats").then((data) => {
      if (data) {
        const filtered = (data as any[]).filter(item =>
          !item.status || item.status.toLowerCase() === "approved"
        );
        setStats(filtered as Stat[]);
      }
    });
  }, []);

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto">
        <div className="rounded-2xl border border-primary/20 bg-gradient-card p-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.id || s._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-4xl font-bold text-gradient sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>

                {/* Dynamic Fields - Polished UI */}
                {s.data && Object.entries(s.data).length > 0 && (
                  <div className="mt-4 flex flex-col gap-1.5 items-center">
                    {Object.entries(s.data).map(([key, value]) => value && (
                      <div key={key} className="flex flex-col items-center rounded-md border border-primary/10 bg-white/5 px-2 py-1 transition-colors hover:border-primary/20">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-accent/80 leading-none mb-1">{key}</span>
                        <span className="text-[10px] font-medium text-white/90 leading-none">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
