import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicSection from "@/components/DynamicSection";
import { motion } from "framer-motion";

const DynamicPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [tab, setTab] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        // Fetch custom tabs to find the one matching this slug
        api.get("custom-tabs").then((data) => {
            if (data && Array.isArray(data)) {
                const found = data.find((t: any) => t.slug === slug);
                setTab(found);
            }
            setLoading(false);
        }).catch(err => {
            console.error("Failed to fetch custom tab:", err);
            setLoading(false);
        });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!tab) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto py-24 text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
                    <p className="text-muted-foreground">The section you are looking for does not exist.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="pt-20"
            >
                <div className="bg-gradient-to-b from-primary/5 to-transparent py-16">
                    <div className="container mx-auto px-4">
                        <nav className="flex mb-8 text-sm text-muted-foreground">
                            <a href="/" className="hover:text-primary transition-colors">Home</a>
                            <span className="mx-2">/</span>
                            <span className="text-foreground font-medium">{tab.name}</span>
                        </nav>
                        <h1 className="text-4xl font-display font-bold text-foreground">{tab.name}</h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                            Discover more about our {tab.name.toLowerCase()} and how we can help you achieve your goals.
                        </p>
                    </div>
                </div>

                <DynamicSection
                    slug={tab.slug}
                    title={tab.name}
                    icon={tab.icon}
                />
            </motion.div>
            <Footer />
        </div>
    );
};

export default DynamicPage;
