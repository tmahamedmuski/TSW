import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = true }: ProtectedRouteProps) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Loading...</div>;
    }

    if (!user || (requireAdmin && !isAdmin)) {
        return <Navigate to="/admin/access" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
