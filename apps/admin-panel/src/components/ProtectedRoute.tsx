import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import type { AdminRoleType } from '../services/adminAuth.service';

interface ProtectedRouteProps {
    allowedRoles?: AdminRoleType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { admin, isLoading } = useAdminAuth();

    if (isLoading) return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!admin) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(admin.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
