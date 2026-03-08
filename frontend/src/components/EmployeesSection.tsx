import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { api } from "../utils/api";
import { User } from "lucide-react";

interface Employee {
  id?: string;
  _id?: string;
  name: string;
  position: string;
  photo_url: string | null;
  sort_order: number;
  status?: string;
  data?: Record<string, string>;
}

const EmployeesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    api.get("employees")
      .then((data) => {
        if (data) {
          const filtered = (data as any[]).filter(item =>
            !item.status || item.status.toLowerCase() === "approved"
          );
          setEmployees(filtered as Employee[]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch employees:", err);
      });
  }, []);

  return (
    <section id="team" className="py-24" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Our Team
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Meet the <span className="text-gradient">people behind Saltware</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Dedicated professionals committed to delivering excellence.
          </p>
        </motion.div>

        {employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
            <User size={48} className="mb-4 text-muted-foreground" />
            <p className="text-muted-foreground italic">No team members added yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {employees.map((e, i) => (
              <motion.div
                key={e.id || e._id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-primary/20 bg-secondary">
                  {e.photo_url ? (
                    <img
                      src={api.getAssetUrl(e.photo_url) || ""}
                      alt={e.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <User size={36} />
                    </div>
                  )}
                </div>
                <h3 className="font-display font-semibold text-foreground">{e.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{e.position}</p>

                {/* Dynamic Fields - Polished UI */}
                {e.data && Object.entries(e.data).length > 0 && (
                  <div className="flex flex-col items-center gap-1.5">
                    {Object.entries(e.data).map(([key, value]) => value && (
                      <div key={key} className="flex flex-col items-center rounded-md border border-primary/10 bg-primary/5 px-2 py-1 transition-colors hover:border-primary/20">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-accent leading-none mb-1">{key}</span>
                        <span className="text-[10px] font-medium text-foreground leading-none">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EmployeesSection;
