import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { api } from "../utils/api";

interface Contact {
  title?: string;
  description?: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  status: string;
  data?: Record<string, string>;
}

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    api.get("contacts").then((data) => {
      if (data && Array.isArray(data)) {
        const approved = data.find(c => !c.status || c.status.toLowerCase() === "approved");
        if (approved) setContact(approved);
      }
    }).catch(err => console.error("Error fetching contact info:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("messages", formData);
      if (response) {
        setSubmitted(true);
        // Clear form after submission
        setFormData({ name: "", email: "", subject: "", message: "" });

        // As requested by the user: refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again later.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24" ref={ref}>
      <div className="container mx-auto">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              Contact Us
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              {contact?.title ? (
                <span>{contact.title}</span>
              ) : (
                <>Let's build something <span className="text-gradient">great together</span></>
              )}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {contact?.description || "Ready to take your business to the next level? Reach out and let's discuss how Saltware can help you achieve your goals."}
            </p>

            <div className="mt-10 flex flex-col gap-6">
              {[
                { icon: MapPin, text: contact?.address || "Puttalam, North Western Province, Sri Lanka" },
                { icon: Phone, text: contact?.phone || "+94 XX XXX XXXX" },
                {
                  icon: () => (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.54 4.186 1.59 6.04L0 24l6.117-1.605a11.803 11.803 0 005.925 1.577h.005c6.632 0 12.032-5.397 12.035-12.036.002-3.217-1.251-6.242-3.525-8.514z" />
                    </svg>
                  ),
                  text: contact?.whatsapp || "WhatsApp Us",
                  link: contact?.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : undefined
                },
                { icon: Mail, text: contact?.email || "info@saltware.lk" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-accent">
                    {(() => {
                      const Icon = item.icon as any;
                      return typeof Icon === 'function' ? <Icon /> : <Icon size={18} />;
                    })()}
                  </div>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-secondary-foreground hover:text-primary transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm text-secondary-foreground">{item.text}</span>
                  )}
                </div>
              ))}

              {/* Dynamic Fields for Contact - Polished UI */}
              {contact?.data && Object.entries(contact.data).length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {Object.entries(contact.data).map(([key, value]) => value && (
                    <div key={key} className="flex flex-col rounded-xl border border-primary/10 bg-primary/5 p-4 transition-colors hover:border-primary/20">
                      <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-accent">{key}</span>
                      <span className="text-sm font-medium text-secondary-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Subject</label>
              <input
                required
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="mt-5 flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Message</label>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your project..."
                className="resize-none rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-glow"
            >
              {submitted ? "Message Sent!" : <>Send Message <Send size={15} /></>}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
