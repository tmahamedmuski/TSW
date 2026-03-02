import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, FolderOpen, ExternalLink } from "lucide-react";

interface Service {
    id: string;
    _id?: string;
    title: string;
    description: string;
    data?: Record<string, string>;
}

interface Project {
    id: string;
    _id?: string;
    title: string;
    description: string;
    image_url: string | null;
    link: string | null;
    data?: Record<string, string>;
}

const ServiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [service, setService] = useState<Service | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch services to find the specific one (could add a get by id endpoint later)
                const allServices = await api.get("services");
                const currentService = allServices?.find((s: any) => (s.id || s._id) === id);
                setService(currentService);

                // Fetch filtered projects
                if (id) {
                    const filteredProjects = await api.get(`projects?serviceId=${id}`);
                    if (filteredProjects) {
                        setProjects(filteredProjects.filter((p: any) => !p.status || p.status === "approved"));
                    }
                }
            } catch (error) {
                console.error("Error fetching service details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Loading...</div>;
    }

    if (!service) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
                <h1 className="mb-4 text-2xl font-bold">Service not found</h1>
                <Link to="/" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto">
                    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        <ArrowLeft size={16} /> Back to home
                    </Link>

                    <header className="mb-16">
                        <div className="max-w-2xl">
                            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                                {service.title} <span className="text-gradient">Projects</span>
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                {service.description}
                            </p>
                        </div>

                        {/* Dynamic Fields for Service - Polished UI */}
                        {service.data && Object.entries(service.data).length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                {Object.entries(service.data).map(([key, value]) => value && (
                                    <div key={key} className="flex flex-col px-4 py-2 bg-card border border-primary/10 rounded-xl">
                                        <p className="text-[9px] font-bold text-accent uppercase tracking-widest mb-1">{key}</p>
                                        <p className="text-sm text-foreground font-semibold">{value}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </header>

                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
                            <FolderOpen size={48} className="mb-4 text-muted-foreground opacity-50" />
                            <h2 className="text-xl font-semibold text-foreground">No projects found</h2>
                            <p className="mt-2 text-muted-foreground">We haven't added any projects for this service yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((p, i) => (
                                <motion.div
                                    key={p.id || p._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
                                >
                                    <div className="aspect-video overflow-hidden bg-secondary">
                                        {p.image_url ? (
                                            <img
                                                src={p.image_url}
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
                                        {/* Dynamic Fields for Project - Polished UI */}
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
                                        {p.link && (
                                            <a
                                                href={p.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                                            >
                                                View Project <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ServiceDetail;
