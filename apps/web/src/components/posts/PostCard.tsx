import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, Share2, Bookmark,
    CheckCircle, Globe, Lock,
    Users, Send, Play, Volume2, VolumeX, Maximize2,
    X, Link2, Facebook, Twitter, Copy, Check,
    ChevronLeft, ChevronRight, ZoomIn
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

// ─── Image Lightbox ─────────────────────────────────────────────────────────
const ImageLightbox: React.FC<{
    images: string[];
    startIndex: number;
    onClose: () => void;
}> = ({ images, startIndex, onClose }) => {
    const [current, setCurrent] = useState(startIndex);

    const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
    const next = () => setCurrent(i => (i + 1) % images.length);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close */}
            <button
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
                onClick={onClose}
            >
                <X size={24} />
            </button>

            {/* Counter */}
            {images.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-xs font-bold rounded-full">
                    {current + 1} / {images.length}
                </div>
            )}

            {/* Image */}
            <motion.img
                key={current}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 25 }}
                src={images[current]}
                alt="Full screen"
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl select-none"
                onClick={e => e.stopPropagation()}
                draggable={false}
            />

            {/* Prev / Next */}
            {images.length > 1 && (
                <>
                    <button
                        className="absolute left-4 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all"
                        onClick={e => { e.stopPropagation(); prev(); }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        className="absolute right-4 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all"
                        onClick={e => { e.stopPropagation(); next(); }}
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}
        </motion.div>
    );
};

// ─── Share Menu ──────────────────────────────────────────────────────────────
const ShareMenu: React.FC<{
    postId: string;
    content: string;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLButtonElement>;
}> = ({ postId, content, onClose, anchorRef }) => {
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const shareUrl = `${window.location.origin}/post/${postId}`;
    const shareText = content ? content.slice(0, 80) + (content.length > 80 ? '…' : '') : 'Check this out on Femo Space!';

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                anchorRef.current && !anchorRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => { setCopied(false); onClose(); }, 1500);
        } catch {
            // fallback
            const el = document.createElement('input');
            el.value = shareUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => { setCopied(false); onClose(); }, 1500);
        }
    };

    const shareVia = (platform: 'facebook' | 'twitter' | 'whatsapp' | 'native') => {
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);
        const urls: Record<string, string> = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        };
        if (platform === 'native' && navigator.share) {
            navigator.share({ title: 'Femo Space', text: shareText, url: shareUrl }).catch(() => {});
            onClose();
            return;
        }
        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
            onClose();
        }
    };

    const shareOptions = [
        ...(navigator.share ? [{ id: 'native', label: 'Share…', icon: <Share2 size={18} />, color: 'text-blue-400', bg: 'bg-blue-500/10 hover:bg-blue-500/20' }] : []),
        { id: 'facebook', label: 'Facebook', icon: <Facebook size={18} />, color: 'text-blue-600', bg: 'bg-blue-600/10 hover:bg-blue-600/20' },
        { id: 'twitter', label: 'X (Twitter)', icon: <Twitter size={18} />, color: 'text-sky-400', bg: 'bg-sky-400/10 hover:bg-sky-400/20' },
        { id: 'whatsapp', label: 'WhatsApp', icon: (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        ), color: 'text-green-500', bg: 'bg-green-500/10 hover:bg-green-500/20' },
    ];

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 p-2"
        >
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 pb-1">Share this post</p>
            <div className="space-y-1">
                {shareOptions.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => shareVia(opt.id as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${opt.bg} ${opt.color}`}
                    >
                        <span className={opt.color}>{opt.icon}</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{opt.label}</span>
                    </button>
                ))}
                {/* Copy Link */}
                <button
                    onClick={copyLink}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"
                >
                    <span className="text-gray-500">{copied ? <Check size={18} className="text-green-500" /> : <Link2 size={18} />}</span>
                    <span className={`text-sm font-bold ${copied ? 'text-green-500' : 'text-gray-800 dark:text-gray-200'}`}>
                        {copied ? 'Link Copied!' : 'Copy Link'}
                    </span>
                </button>
            </div>
        </motion.div>
    );
};

// ─── Video Player (inline, click to play/pause) ──────────────────────────────
const InlineVideo: React.FC<{ src: string }> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play();
            setPlaying(true);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !muted;
        setMuted(!muted);
    };

    return (
        <div className="relative aspect-video group cursor-pointer" onClick={toggle}>
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                muted={muted}
                loop
                playsInline
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />
            {/* Play/Pause overlay */}
            <AnimatePresence>
                {!playing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/25"
                    >
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <Play size={24} className="text-white fill-white ml-1" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Controls */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={toggleMute}
                    className="p-2 bg-black/60 text-white rounded-lg backdrop-blur-md hover:bg-black/80 transition-all"
                >
                    {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
            </div>
        </div>
    );
};

// ─── Main PostCard ────────────────────────────────────────────────────────────
export const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
    const { user: currentUser } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.stats?.likes || 0);
    const [isCommenting, setIsCommenting] = useState(false);
    const [comment, setComment] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [userVoteOption, setUserVoteOption] = useState<number | null>(null);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
    const [lightboxStart, setLightboxStart] = useState(0);
    const shareButtonRef = useRef<HTMLButtonElement>(null);

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

    const openLightbox = (images: string[], index: number) => {
        setLightboxImages(images);
        setLightboxStart(index);
    };

    const renderOwnerInfo = () => {
        const owner = post.ownerId;
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

        const imageMedia = post.media.filter((m: any) => m.type === 'image');
        const videoMedia = post.media.filter((m: any) => m.type === 'video');
        const imageUrls = imageMedia.map((m: any) => m.url);

        return (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                {/* Videos */}
                {videoMedia.map((m: any, i: number) => (
                    <InlineVideo key={`v-${i}`} src={m.url} />
                ))}

                {/* Images — clickable for lightbox */}
                {imageUrls.length > 0 && (
                    <div className={`grid gap-0.5 ${imageUrls.length === 1 ? 'grid-cols-1' : imageUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                        {imageUrls.slice(0, 4).map((url: string, i: number) => {
                            const isLast = i === 3 && imageUrls.length > 4;
                            return (
                                <div
                                    key={i}
                                    className="relative group cursor-zoom-in overflow-hidden"
                                    style={{ aspectRatio: imageUrls.length === 1 ? 'auto' : '1 / 1' }}
                                    onClick={() => openLightbox(imageUrls, i)}
                                >
                                    <img
                                        src={url}
                                        alt="Post content"
                                        className={`w-full h-full ${imageUrls.length === 1 ? 'max-h-[600px] object-contain' : 'object-cover'} transition-transform duration-300 group-hover:scale-105`}
                                    />
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                        <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                    </div>
                                    {/* +N overlay for 4th image */}
                                    {isLast && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white text-2xl font-black">+{imageUrls.length - 4}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const totalPollVotes = post.poll?.options?.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0) || 0;

    return (
        <>
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

                        {/* Share Button with dropdown */}
                        <div className="relative">
                            <button
                                ref={shareButtonRef}
                                onClick={() => setShowShareMenu(v => !v)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-bold ${showShareMenu ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                <Share2 size={20} />
                                <span className="text-sm">Share</span>
                            </button>
                            <AnimatePresence>
                                {showShareMenu && (
                                    <ShareMenu
                                        postId={post._id}
                                        content={post.content || ''}
                                        onClose={() => setShowShareMenu(false)}
                                        anchorRef={shareButtonRef}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
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

            {/* Image Lightbox Portal */}
            <AnimatePresence>
                {lightboxImages && (
                    <ImageLightbox
                        images={lightboxImages}
                        startIndex={lightboxStart}
                        onClose={() => setLightboxImages(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
