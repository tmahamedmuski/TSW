import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { api } from "../utils/api";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";

interface Service {
  id?: string;
  _id?: string;
  icon: string;
  title: string;
  description: string;
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

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api.get("services").then((data) => {
      if (data) {
        const filtered = (data as any[]).filter(item =>
          !item.status || item.status.toLowerCase() === "approved"
        );
        setServices(filtered as Service[]);
      }
    });
  }, []);

  return (
    <section id="services" className="py-24" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Solutions & Services
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Comprehensive IT solutions{" "}
            <span className="text-gradient">for every need</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            From strategic consulting to hands-on support, we deliver end-to-end
            technology services that drive real business results.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const IconComp = iconMap[s.icon] || Icons.Code2;
            const id = s.id || s._id;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/service/${id}`}
                  className="group block h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-accent transition-colors group-hover:bg-primary/20">
                    <IconComp size={22} />
                  </div>
                  <h3 className="mb-2 font-display text-base font-semibold text-foreground">
                    {s.title}
                  </h3>
                  {/* Dynamic Fields - Polished UI */}
                  {s.data && Object.entries(s.data).length > 0 && (
                    <div className="mb-5 flex flex-wrap gap-2">
                      {Object.entries(s.data).map(([key, value]) => value && (
                        <div key={key} className="flex flex-col rounded-md border border-primary/10 bg-primary/5 px-2 py-1 transition-colors hover:border-primary/20">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-accent/80 line-height-none leading-none mb-1">{key}</span>
                          <span className="text-[11px] font-medium text-foreground leading-none">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary group-hover:text-accent">
                    View Projects <Icons.ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
