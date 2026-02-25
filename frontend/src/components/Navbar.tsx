import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { api } from "../utils/api";
import { useAuth } from "@/hooks/useAuth";

interface NavLinkItem {
  label: string;
  href: string;
}

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();
  const [customLinks, setCustomLinks] = useState<NavLinkItem[]>([]);

  const baseLinks: NavLinkItem[] = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Team", href: "#team" },
    { label: "Industries", href: "#industries" },
  ];

  useEffect(() => {
    api.get("custom-tabs").then((data) => {
      if (data && Array.isArray(data)) {
        const links = data.map((ct: any) => ({
          label: ct.name,
          href: `#${ct.slug}`
        }));
        setCustomLinks(links);
      }
    });
  }, []);

  const allLinks = [...baseLinks, ...customLinks, { label: "Contact", href: "#contact" }];

  return (
    <nav
      className={`fixed left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300 ${isAdmin ? "top-10" : "top-0"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt="Saltware Logo" className="h-10 w-10" />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Saltware
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {allLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-glow"
          >
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-foreground md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 py-6">
              {allLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="w-fit rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
