import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface FollowButtonProps {
    userId: string;
    initialFollowing?: boolean;
    onFollowChange?: (isFollowing: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'outline';
}

export const FollowButton: React.FC<FollowButtonProps> = ({
    userId,
    initialFollowing = false,
    onFollowChange,
    size = 'md',
    variant = 'solid'
}) => {
    const { user: currentUser } = useAuth();
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [isLoading, setIsLoading] = useState(false);

    // Check if already following on mount
    useEffect(() => {
        if (!currentUser || currentUser.id === userId) return;
        
        const checkFollowing = async () => {
            try {
                const { data } = await api.get(`/follows/${userId}/is-following`);
                setIsFollowing(data.isFollowing);
            } catch (err) {
                console.error('Failed to check follow status', err);
            }
        };

        checkFollowing();
    }, [userId, currentUser]);

    const handleToggle = async () => {
        if (!currentUser || currentUser.id === userId) return;

        setIsLoading(true);
        try {
            if (isFollowing) {
                await api.delete(`/follows/${userId}`);
                setIsFollowing(false);
            } else {
                await api.post(`/follows/${userId}`);
                setIsFollowing(true);
            }
            onFollowChange?.(isFollowing);
        } catch (err) {
            console.error('Failed to toggle follow', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser || currentUser.id === userId) return null;

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs gap-1',
        md: 'px-4 py-2 text-sm gap-1.5',
        lg: 'px-6 py-3 text-base gap-2'
    };

    const baseClasses = sizeClasses[size];

    if (variant === 'outline') {
        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggle}
                disabled={isLoading}
                className={`flex items-center font-bold rounded-xl transition-all border-2 ${
                    isFollowing
                        ? 'border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500'
                } ${baseClasses} disabled:opacity-50`}
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                    <>
                        {isFollowing ? (
                            <>
                                <UserCheck size={16} />
                                <span>Following</span>
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} />
                                <span>Follow</span>
                            </>
                        )}
                    </>
                )}
            </motion.button>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            disabled={isLoading}
            className={`flex items-center font-bold rounded-xl transition-all ${baseClasses} ${
                isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
            } disabled:opacity-50`}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
                <>
                    {isFollowing ? (
                        <>
                            <UserCheck size={16} />
                            <span>Following</span>
                        </>
                    ) : (
                        <>
                            <UserPlus size={16} />
                            <span>Follow</span>
                        </>
                    )}
                </>
            )}
        </motion.button>
    );
};
