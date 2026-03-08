import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { api } from "../utils/api";

interface Contact {
  address: string;
}

const Footer = () => {
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    api.get("contacts").then((data) => {
      if (data && Array.isArray(data)) {
        const approved = data.find(c => !c.status || c.status.toLowerCase() === "approved");
        if (approved) setContact(approved);
      }
    }).catch(err => console.error("Error fetching contact info for footer:", err));
  }, []);

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Saltware" className="h-8 w-8" />
            <span className="font-display text-lg font-bold text-foreground">
              Saltware (PVT) Ltd
            </span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Innovation with Integrity: For People, Planet, and Purpose. Based in{" "}
            {contact?.address || "Puttalam, North Western Province, Sri Lanka"}.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["Home", "About", "Services", "Team", "Industries", "Contact"].map((l) => (
              <a
                key={l}
                href={`/#${l.toLowerCase()}`}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {l}
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            © {new Date().getFullYear()} Saltware (PVT) Ltd. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
