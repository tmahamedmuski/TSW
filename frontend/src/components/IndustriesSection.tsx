import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { api } from "../utils/api";
import * as Icons from "lucide-react";

interface Industry {
  id?: string;
  _id?: string;
  icon: string;
  title: string;
  sort_order: number;
  status?: string;
  data?: Record<string, string>;
}

const iconMap: Record<string, any> = {
  Code2: Icons.Code2,
  Cloud: Icons.Cloud,
  Settings: Icons.Settings,
  Headphones: Icons.Headphones,
  BarChart3: Icons.BarChart3,
  Database: Icons.Database,
  Smartphone: Icons.Smartphone,
  ShieldCheck: Icons.ShieldCheck,
  Globe: Icons.Globe,
  Cpu: Icons.Cpu,
  Monitor: Icons.Monitor,
  Wifi: Icons.Wifi,
  Server: Icons.Server,
  Lock: Icons.Lock,
  Factory: Icons.Factory,
  Landmark: Icons.Landmark,
  Heart: Icons.Heart,
  HeartPulse: Icons.HeartPulse,
  ShoppingCart: Icons.ShoppingCart,
  ShoppingBag: Icons.ShoppingBag,
  Zap: Icons.Zap,
  Plane: Icons.Plane,
  Building2: Icons.Building2,
  Droplets: Icons.Droplets,
};

const IndustriesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [industries, setIndustries] = useState<Industry[]>([]);

  useEffect(() => {
    api.get("industries").then((data) => {
      if (data) {
        const filtered = (data as any[]).filter(item =>
          !item.status || item.status.toLowerCase() === "approved"
        );
        setIndustries(filtered as Industry[]);
      }
    });
  }, []);

  return (
    <section id="industries" className="py-24" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Industries
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Serving <span className="text-gradient">diverse sectors</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {industries.map((ind, i) => {
            const IconComp = iconMap[ind.icon] || Icons.Building2;
            return (
              <motion.div
                key={ind.id || ind._id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.06 }}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40 hover:shadow-glow"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-accent transition-colors group-hover:bg-primary/20">
                  <IconComp size={24} />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {ind.title}
                </span>

                {/* Dynamic Fields - Polished UI */}
                {ind.data && Object.entries(ind.data).length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5 items-center">
                    {Object.entries(ind.data).map(([key, value]) => value && (
                      <div key={key} className="flex flex-col items-center rounded-md border border-primary/10 bg-primary/5 px-2 py-1 transition-colors hover:border-primary/20">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-primary/70 leading-none mb-1">{key}</span>
                        <span className="text-[10px] font-medium text-foreground leading-none">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
