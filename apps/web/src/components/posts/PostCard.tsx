import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, Share2, Bookmark,
    CheckCircle, Globe, Lock,
    Users, Send, Play, Volume2, Maximize2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { FollowButton } from '../FollowButton';
import { UserBadge } from '../common/UserBadge';

interface PostCardProps {
    post: any;
    onUpdate?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
    const { user: currentUser } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.stats?.likes || 0);
    const [isCommenting, setIsCommenting] = useState(false);
    const [comment, setComment] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [userVoteOption, setUserVoteOption] = useState<number | null>(null);

    const handleLike = async () => {
        try {
            const { data } = await api.post(`/posts/${post._id}/react`, { type: 'like' });
            if (data.removed) {
                setIsLiked(false);
                setLikesCount((prev: number) => prev - 1);
            } else {
                setIsLiked(true);
                setLikesCount((prev: number) => prev + 1);
            }
        } catch (err) {
            console.error('Failed to react to post', err);
        }
    };

    const handleSave = async () => {
        try {
            await api.post(`/posts/${post._id}/save`);
            setIsSaved(!isSaved);
        } catch (err) {
            console.error('Failed to save post', err);
        }
    };

    const handleReport = async () => {
        const reason = window.prompt('Please specify the reason for reporting this post:');
        if (reason) {
            try {
                await api.post(`/posts/${post._id}/report`, { reason });
                alert('Thank you. Our safety team will review this post.');
            } catch (err) {
                console.error('Failed to report post', err);
            }
        }
    };

    const handlePollVote = async (optionIndex: number) => {
        try {
            await api.post(`/posts/${post._id}/vote`, { optionIndex });
            setUserVoteOption(optionIndex);
            // Update post stats
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Failed to vote on poll', err);
            alert('Failed to vote. You may have already voted on this poll.');
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            await api.post(`/posts/${post._id}/comment`, { content: comment });
            setComment('');
            setIsCommenting(false);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Failed to add comment', err);
        }
    };

    const renderOwnerInfo = () => {
        const owner = post.ownerId; // Populated from backend
        const avatar = owner?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner?.username}`;
        const name = owner?.profile ? `${owner.profile.firstName} ${owner.profile.lastName}` : owner?.username || 'Femo User';
        const isOwner = currentUser?.username === owner?.username;

        return (
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${owner?.username}`} className="relative group cursor-pointer">
                        <img src={avatar} alt={name} className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-700 object-cover" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-500/50 transition-all" />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1">
                                {owner?.isVip && <UserBadge type="vip" size={16} />}
                                {owner?.isCreatorCertified && <UserBadge type="creator" size={16} />}
                            </div>
                            <Link to={`/profile/${owner?.username}`} className="font-bold text-gray-900 dark:text-white hover:underline decoration-blue-500/50 underline-offset-2">
                                {name}
                            </Link>
                            {owner?.verified && <CheckCircle size={14} className="text-blue-500 fill-blue-500 text-white" />}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                            <span>•</span>
                            {post.visibility === 'public' ? <Globe size={12} /> : post.visibility === 'friends' ? <Users size={12} /> : <Lock size={12} />}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isOwner && currentUser && (
                        <FollowButton userId={owner?._id} size="sm" variant="outline" />
                    )}
                    <button
                        onClick={handleReport}
                        className="p-1 px-2 text-[10px] font-bold text-gray-300 hover:text-red-400 transition-colors uppercase tracking-tighter"
                    >
                        Report
                    </button>
                </div>
            </div>
        );
    };

    const renderMedia = () => {
        if (!post.media || post.media.length === 0) return null;

        return (
            <div className={`mt-3 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20`}>
                {post.media.map((m: any, i: number) => (
                    <div key={i} className="relative group">
                        {m.type === 'video' ? (
                            <div className="relative aspect-video">
                                <video src={m.url} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all cursor-pointer">
                                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                        <Play size={24} className="text-white fill-white ml-1" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 flex gap-2">
                                    <button className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md"><Volume2 size={16} /></button>
                                    <button className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md"><Maximize2 size={16} /></button>
                                </div>
                            </div>
                        ) : (
                            <img src={m.url} alt="Post content" className="w-full h-auto max-h-[600px] object-contain" />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const totalPollVotes = post.poll?.options?.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0) || 0;

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                {renderOwnerInfo()}
            </div>

            {/* Content */}
            <div className="px-4 pb-1">
                {post.content && (
                    <p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {post.content}
                    </p>
                )}

                {post.hashtags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {post.hashtags.map((tag: string) => (
                            <span key={tag} className="text-blue-500 hover:underline cursor-pointer font-medium text-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Media */}
            {renderMedia()}

            {/* Poll Display */}
            {post.type === 'poll' && post.poll?.options && post.poll.options.length > 0 && (
                <div className="p-4 space-y-2">
                    <div className="space-y-3">
                        {post.poll.options.map((opt: any, i: number) => {
                            const percentage = totalPollVotes > 0 ? (opt.votes / totalPollVotes) * 100 : 0;
                            const hasVoted = userVoteOption === i;

                            return (
                                <motion.button
                                    key={i}
                                    onClick={() => handlePollVote(i)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-500/50 transition-all relative overflow-hidden group text-left"
                                >
                                    <div className="relative z-10 flex justify-between items-center">
                                        <span className={`font-semibold ${hasVoted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {opt.text}
                                        </span>
                                        <span className={`text-xs font-bold ${hasVoted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                                            {Math.round(percentage)}% ({opt.votes} votes)
                                        </span>
                                    </div>
                                    <motion.div
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.5 }}
                                        className={`absolute inset-y-0 left-0 rounded-lg ${hasVoted ? 'bg-blue-500/20' : 'bg-blue-500/10'} group-hover:bg-blue-500/20`}
                                    />
                                </motion.button>
                            );
                        })}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase font-bold tracking-wider pt-2 border-t border-gray-100 dark:border-gray-800">
                        <span>Total: {totalPollVotes} votes</span>
                        <span>{post.poll?.expiresAt ? `Ends ${formatDistanceToNow(new Date(post.poll.expiresAt))}` : 'Active'}</span>
                    </div>
                </div>
            )}

            {/* Stats Summary */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center -space-x-1">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white dark:border-gray-900">
                        <Heart size={10} className="text-white fill-white" />
                    </div>
                    <span className="ml-2 text-xs text-gray-500 font-medium">
                        {likesCount > 0 ? `${likesCount} likes` : 'Be the first to like'}
                    </span>
                </div>
                <div className="flex gap-3 text-xs text-gray-500 font-medium">
                    <span>{post.stats?.comments || 0} comments</span>
                    <span>{post.stats?.shares || 0} shares</span>
                </div>
            </div>

            {/* Actions */}
            <div className="px-2 py-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${isLiked ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                        <Heart size={20} className={isLiked ? 'fill-current scale-110' : ''} />
                        <span className="text-sm font-bold">Like</span>
                    </button>
                    <button
                        onClick={() => setIsCommenting(!isCommenting)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold"
                    >
                        <MessageCircle size={20} />
                        <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold">
                        <Share2 size={20} />
                        <span className="text-sm">Share</span>
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className={`p-2 rounded-xl transition-all ${isSaved ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                    <Bookmark size={20} className={isSaved ? 'fill-current' : ''} />
                </button>
            </div>

            {/* Comment Section */}
            <AnimatePresence>
                {isCommenting && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 overflow-hidden"
                    >
                        <form onSubmit={handleComment} className="flex gap-2 mt-2">
                            <img src={currentUser?.avatarUrl} className="w-8 h-8 rounded-full" alt="Me" />
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="w-full bg-gray-50 dark:bg-black/20 border-none rounded-xl py-2 px-4 text-sm dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button type="submit" className="absolute right-2 top-1.5 text-blue-500 hover:text-blue-600 font-bold p-1">
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
};
