import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { api } from "../utils/api";
import * as Icons from "lucide-react";

interface DynamicItem {
    id?: string;
    _id?: string;
    title: string;
    data: Record<string, string>;
    image: string | null;
    status?: string;
    sort_order: number;
}

interface DynamicSectionProps {
    slug: string;
    title: string;
    icon: string;
}

const DynamicSection = ({ slug, title, icon }: DynamicSectionProps) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const [items, setItems] = useState<DynamicItem[]>([]);
    const IconComp = (Icons as any)[icon] || Icons.Package;

    // For dedicated pages, we might want to show at least the heading even if no items exist
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get(`custom-items/${slug}`).then((data) => {
            if (data && Array.isArray(data)) {
                const filtered = data.filter(item =>
                    !item.status || item.status.toLowerCase() === "approved"
                );
                setItems(filtered);
            }
            setLoading(false);
        }).catch(err => {
            console.error(`Failed to fetch items for ${slug}:`, err);
            setLoading(false);
        });
    }, [slug]);

    if (loading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <section id={slug} className="py-24" ref={ref}>
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto mb-16 max-w-2xl text-center"
                >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-glow-sm">
                        <IconComp size={24} />
                    </div>
                    <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                        {title}
                    </h2>
                </motion.div>

                {items.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((it, i) => (
                            <motion.div
                                key={it.id || it._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
                            >
                                {it.image && (
                                    <div className="aspect-video overflow-hidden bg-secondary">
                                        <img
                                            src={it.image}
                                            alt={it.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="mb-3 font-display text-lg font-semibold text-foreground">
                                        {it.title}
                                    </h3>

                                    {/* Dynamic Fields - Polished UI */}
                                    {it.data && Object.entries(it.data).length > 0 && (
                                        <div className="flex flex-col gap-3">
                                            {Object.entries(it.data).map(([key, value]) => value && (
                                                <div key={key} className="flex flex-col rounded-lg border border-primary/10 bg-primary/5 p-3 transition-colors hover:border-primary/20">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">{key}</span>
                                                    <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/20 py-20 text-center"
                    >
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary/30">
                            <Icons.PackageOpen size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">No Items Yet</h3>
                        <p className="mt-2 text-muted-foreground">Content will appear here once it has been added and approved.</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default DynamicSection;
