import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronUp, ChevronRight, Plus } from "lucide-react";
import * as Icons from "lucide-react";
import logo from "@/assets/logo.png";
import { api } from "../utils/api";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLinkItem {
  label: string;
  href: string;
}

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();
  const [customLinks, setCustomLinks] = useState<NavLinkItem[]>([]);

  const baseLinks: NavLinkItem[] = [
    { label: "Home", href: "/#home" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Team", href: "/#team" },
    { label: "Industries", href: "/#industries" },
  ];

  useEffect(() => {
    api.get("custom-tabs").then((data) => {
      if (data && Array.isArray(data)) {
        const links = data.map((ct: any) => ({
          label: ct.name,
          href: `/page/${ct.slug}`
        }));
        setCustomLinks(links);
      }
    }).catch(err => {
      console.error("Failed to fetch custom tabs:", err);
    });
  }, []);

  const allLinks = [...baseLinks, { label: "Contact", href: "#contact" }];

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300"
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="/#home" className="flex items-center gap-3">
          <img src={logo} alt="Saltware Logo" className="h-10 w-10" />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Saltware
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {baseLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}

          <a
            href="/#contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </a>

          <div className="flex items-center gap-4">
            <a
              href="/#contact"
              className="rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-glow"
            >
              Get Started
            </a>

            {(customLinks.length > 0 || isAdmin) && (
              <DropdownMenu>
                <DropdownMenuTrigger className="group flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground focus:outline-none shadow-glow-sm">
                  <ChevronUp size={20} className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 overflow-hidden rounded-2xl border border-border/50 bg-background/95 p-2 shadow-2xl backdrop-blur-xl">
                  {customLinks.length > 0 ? (
                    <>
                      <div className="mb-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 border-b border-border/50">
                        Dynamic Sections
                      </div>
                      <div className="space-y-1">
                        {customLinks.map((l) => (
                          <DropdownMenuItem key={l.href} asChild>
                            <a
                              href={l.href}
                              className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary hover:pl-4"
                            >
                              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              {l.label}
                            </a>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </>
                  ) : (
                    isAdmin && (
                      <div className="px-3 py-4 text-center">
                        <p className="text-xs text-muted-foreground mb-3 font-medium italic">No dynamic sections yet.</p>
                      </div>
                    )
                  )}

                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
              {baseLinks.map((l) => (
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
                href="/#contact"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </a>
              <a
                href="/#contact"
                onClick={() => setOpen(false)}
                className="w-full rounded-lg bg-gradient-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
              >
                Get Started
              </a>

              {(customLinks.length > 0 || isAdmin) && (
                <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-secondary/30 p-4 border border-border/50">
                  <div className="flex items-center gap-2 px-1 mb-2">
                    <ChevronUp size={14} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dynamic Features</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {customLinks.length > 0 ? (
                      customLinks.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="rounded-xl bg-background/50 px-4 py-4 text-sm font-medium text-muted-foreground transition-all hover:bg-background hover:text-foreground active:scale-95"
                        >
                          {l.label}
                        </a>
                      ))
                    ) : (
                      isAdmin && (
                        <p className="px-4 py-3 text-[10px] text-muted-foreground italic text-center">No dynamic sections added yet.</p>
                      )
                    )}


                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
