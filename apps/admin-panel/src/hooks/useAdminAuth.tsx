import React, { createContext, useContext, useState, useEffect } from 'react';
import { type AdminUser, adminAuthService } from '../services/adminAuth.service';

interface AdminAuthContextType {
    admin: AdminUser | null;
    login: (firstName: string, lastName: string, serviceNumber: string, secretKey: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = adminAuthService.getCurrentUser();
        setAdmin(user);
        setIsLoading(false);
    }, []);

    const login = async (firstName: string, lastName: string, serviceNumber: string, secretKey: string) => {
        const user = await adminAuthService.login(firstName, lastName, serviceNumber, secretKey);
        if (user) {
            setAdmin(user);
            return true;
        }
        return false;
    };

    const logout = () => {
        adminAuthService.logout();
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider value={{ admin, login, logout, isLoading }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};
