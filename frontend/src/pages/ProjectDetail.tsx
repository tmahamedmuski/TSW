import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ExternalLink, FolderOpen } from "lucide-react";

interface Project {
  id: string;
  _id?: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string | null;
  status?: string;
  serviceId?: string;
  data?: Record<string, string>;
}

const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const projectsData = await api.get("projects");
                if (projectsData) {
                    const foundProject = (projectsData as any[]).find(
                        (p) => (p.id || p._id) === id
                    );
                    setProject(foundProject || null);
                }
            } catch (error) {
                console.error("Error fetching project details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Loading...</div>;
    }

    if (!project) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
                <h1 className="mb-4 text-2xl font-bold">Project not found</h1>
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto">
                    <button onClick={() => navigate(-1)} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        <ArrowLeft size={16} /> Back
                    </button>

                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Project Image View */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="overflow-hidden rounded-2xl border border-border bg-card/50"
                        >
                            <div className="aspect-video w-full bg-secondary md:aspect-square lg:aspect-auto h-full flex items-center justify-center">
                                {project.image_url ? (
                                    <img
                                        src={api.getAssetUrl(project.image_url) || ""}
                                        alt={project.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex min-h-[400px] h-full w-full flex-col items-center justify-center text-muted-foreground opacity-60">
                                        <FolderOpen size={64} className="mb-4" />
                                        <span>No image available</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Project Info View */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col justify-center"
                        >
                            {project.status && project.status.toLowerCase() === 'approved' && (
                                <div className="mb-4 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                    Approved Project
                                </div>
                            )}
                            <h1 className="mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
                                {project.title}
                            </h1>
                            <p className="mb-8 text-lg text-muted-foreground whitespace-pre-wrap">
                                {project.description}
                            </p>

                            {/* Dynamic Fields - Polished Detailed UI */}
                            {project.data && Object.entries(project.data).length > 0 && (
                                <div className="mb-8 grid gap-4 grid-cols-2 sm:grid-cols-3">
                                    {Object.entries(project.data).map(([key, value]) => value && (
                                        <div key={key} className="flex flex-col p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors shadow-sm">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">{key}</span>
                                            <span className="text-sm font-semibold text-foreground">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* External Link Option */}
                            {project.link && (
                                <div className="mt-auto pt-6">
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 font-medium text-primary-foreground shadow-glow transition-all hover:bg-primary/90"
                                    >
                                        Visit Live Project <ExternalLink size={18} />
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProjectDetail;
