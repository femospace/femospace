import React, { useState, useEffect } from 'react';
import { UserCheck, UserPlus, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface FollowButtonProps {
    userId: string;
    className?: string;
    onFollowChange?: (isFollowing: boolean) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ userId, className = '', onFollowChange }) => {
    const { user: currentUser } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    useEffect(() => {
        if (!currentUser || !userId || initialCheckDone) return;

        const checkStatus = async () => {
            try {
                const { data } = await api.get(`/follows/${userId}/is-following`);
                setIsFollowing(data.data.isFollowing);
            } catch (error) {
                console.error('Failed to check follow status', error);
            } finally {
                setInitialCheckDone(true);
            }
        };

        checkStatus();
    }, [userId, currentUser, initialCheckDone]);

    const handleToggleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser) {
            alert('Please login to follow users');
            return;
        }

        const prevState = isFollowing;
        setIsFollowing(!prevState); // Optimistic update
        setLoading(true);

        try {
            if (prevState) {
                await api.delete(`/follows/${userId}`);
            } else {
                await api.post(`/follows/${userId}`);
            }
            if (onFollowChange) onFollowChange(!prevState);
        } catch (error) {
            console.error('Follow action failed', error);
            setIsFollowing(prevState); // Revert
            alert('Failed to update follow status');
        } finally {
            setLoading(false);
        }
    };

    if (currentUser?.id === userId || (currentUser as any)?.['_id'] === userId) return null;

    return (
        <button
            onClick={handleToggleFollow}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-70 ${isFollowing
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-500'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                } ${className}`}
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : isFollowing ? (
                <>
                    <span>Following</span>
                    <UserCheck size={16} />
                </>
            ) : (
                <>
                    <span>Follow</span>
                    <UserPlus size={16} />
                </>
            )}
        </button>
    );
};
