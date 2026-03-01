import React, { useState, useEffect } from 'react';
import { X, Send, Heart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
    id: string;
    user: {
        id: string;
        name: string;
        avatar: string;
    };
    text: string;
    likes: number;
    createdAt: string;
}

interface CommentPanelProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
    commentCount: number;
}

export const CommentPanel: React.FC<CommentPanelProps> = ({
    isOpen,
    onClose,
    videoId,
    commentCount
}) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && videoId) {
            fetchComments();
        }
    }, [isOpen, videoId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            // Mocking comment fetch - in real app: await api.get(`/videos/${videoId}/comments`)
            const mockComments: Comment[] = Array.from({ length: 5 }).map((_, i) => ({
                id: `c-${i}`,
                user: {
                    id: `u-${i}`,
                    name: `User ${i + 1}`,
                    avatar: `https://i.pravatar.cc/150?u=u-${i}`
                },
                text: `This is a great reel! Love the vibes. 🔥 #amazing #trend`,
                likes: Math.floor(Math.random() * 100),
                createdAt: '2h ago'
            }));
            setComments(mockComments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            // Mocking comment post
            const comment: Comment = {
                id: Date.now().toString(),
                user: {
                    id: 'current-user',
                    name: 'You',
                    avatar: 'https://i.pravatar.cc/150?u=current-user'
                },
                text: newComment,
                likes: 0,
                createdAt: 'Just now'
            };

            setComments([comment, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 z-[60]"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute bottom-0 left-0 right-0 h-[70%] bg-neutral-900 rounded-t-3xl z-[70] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex-1" />
                            <h3 className="text-white font-bold text-sm">
                                {commentCount} Comments
                            </h3>
                            <button
                                onClick={onClose}
                                className="flex-1 flex justify-end text-white/60 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                                </div>
                            ) : comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment.id} className="flex gap-3">
                                        <img
                                            src={comment.user.avatar}
                                            alt={comment.user.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-white text-sm font-bold">
                                                    {comment.user.name}
                                                </span>
                                                <span className="text-gray-500 text-xs">
                                                    {comment.createdAt}
                                                </span>
                                            </div>
                                            <p className="text-gray-200 text-sm leading-relaxed">
                                                {comment.text}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                                                    <Heart size={14} />
                                                    <span className="text-xs">{comment.likes}</span>
                                                </button>
                                                <button className="text-gray-400 hover:text-white transition-colors text-xs font-bold">
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                    <MessageCircle size={48} className="mb-4 opacity-20" />
                                    <p>No comments yet. Be the first to comment!</p>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-neutral-800">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-white/10 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="p-2 text-blue-500 hover:scale-110 active:scale-95 disabled:opacity-50 transition-all"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
