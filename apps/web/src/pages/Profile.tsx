import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profile.service';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { PostCard } from '../components/posts/PostCard';
import { FollowButton } from '../components/FollowButton';
import { PostComposer } from '../components/posts/PostComposer';
import {
    Calendar, CheckCircle, Edit3, Globe, Image, Info, MapPin,
    MessageCircle, MoreHorizontal, Share2, Video, Bookmark,
    PenTool, Zap, Award, ShieldCheck, Mail
} from 'lucide-react';
import { UserBadge } from '../components/common/UserBadge';

export const Profile: React.FC = () => {
    const { username: urlUsername } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const coverInputRef = React.useRef<HTMLInputElement>(null);

    const [showPostComposer, setShowPostComposer] = useState(false); // To toggle composer if needed
    // Or simpler: just navigate to home with query param? No, better to have a button.
    // Actually, Profile page usually doesn't have a composer INLINE, but maybe a button.

    // Clean username - remove @ if present
    const cleanUsername = urlUsername?.replace(/^@/, '');
    const isOwnProfile = !cleanUsername || cleanUsername === currentUser?.username;

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch Profile
                let profileData;
                if (isOwnProfile && currentUser) {
                    profileData = currentUser;
                } else if (cleanUsername) {
                    profileData = await profileService.getProfile(cleanUsername);
                }

                if (!profileData) throw new Error('Profile not found');
                setProfile(profileData);

                // 2. Fetch Posts & Stories for this user
                const ownerId = profileData.id || profileData._id;
                try {
                    const { data: postsData } = await api.get(`/posts/by/user/${ownerId}`);
                    setPosts(postsData);
                } catch (err) {
                    console.error('Failed to fetch posts:', err);
                    setPosts([]);
                }

                // Fetch stories
                try {
                    const { data: storiesData } = await api.get(`/stories/by/user/${ownerId}`);
                    setStories(storiesData);
                } catch (err) {
                    console.error('Failed to fetch stories:', err);
                    setStories([]);
                }

            } catch (err: any) {
                console.error('Failed to fetch profile data:', err);
                setError('Profile not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [cleanUsername, isOwnProfile, currentUser]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0];
        if (!file) return;

        type === 'avatar' ? setUploadingAvatar(true) : setUploadingCover(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const endpoint = type === 'avatar' ? '/users/avatar' : '/users/cover';
            const { data } = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update profile state locally
            setProfile((prev: any) => ({
                ...prev,
                [type === 'avatar' ? 'avatarUrl' : 'coverUrl']: data.data[type === 'avatar' ? 'avatarUrl' : 'coverUrl'] || data.data[type + 'Url']
            }));

            // Also update Auth Context if own profile
            if (isOwnProfile) {
                // In a real app we might reload auth user or update context
                window.location.reload(); // Simple refresh to sync everywhere
            }
        } catch (error) {
            console.error(`Failed to upload ${type}`, error);
            alert(`Failed to upload ${type}`);
        } finally {
            type === 'avatar' ? setUploadingAvatar(false) : setUploadingCover(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `Check out ${profile.profile?.firstName}'s space on Femo`,
            text: `Follow @${profile.username} on Femo Space!`,
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Profile link copied to clipboard!');
            }
        } catch (err) {
            console.error('Share failed', err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen animate-pulse">
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-800" />
                <div className="w-32 h-32 -mt-16 bg-gray-300 dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-900" />
                <div className="mt-4 h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Info className="text-red-500" size={40} />
                </div>
                <h1 className="text-2xl font-bold mb-2">{error || 'Profile not found'}</h1>
                <button onClick={() => navigate('/home')} className="text-blue-500 font-bold hover:underline">Back to Home</button>
            </div>
        );
    }

    const tabs = [
        { id: 'posts', label: 'Posts', icon: <Image size={18} /> },
        { id: 'stories', label: 'Stories', icon: <Video size={18} /> },
        { id: 'videos', label: 'Videos', icon: <Video size={18} /> },
        { id: 'reels', label: 'Reels', icon: <Video size={18} /> },
    ];

    if (isOwnProfile) {
        tabs.push({ id: 'saved', label: 'Saved', icon: <Bookmark size={18} /> });
    }

    return (
        <div className={styles.profileContainer}>
            {/* Cover Section */}
            <div className={styles.coverSection}>
                {profile.profile?.coverImage || profile.coverUrl ? (
                    <img src={profile.profile?.coverImage || profile.coverUrl} className={styles.coverImage} alt="Cover" />
                ) : (
                    <div className={styles.coverPlaceholder} />
                )}
                {isOwnProfile && (
                    <>
                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                        <button
                            className={styles.editCoverBtn}
                            onClick={() => coverInputRef.current?.click()}
                            disabled={uploadingCover}
                            title="Edit Cover"
                        >
                            {uploadingCover ? <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent" /> : <Edit3 size={18} />}
                        </button>
                    </>
                )}
            </div>

            {/* Main Profile Header */}
            <div className={styles.profileHeader}>
                <div className={styles.avatarWrapper}>
                    <div className="relative">
                        <img
                            src={profile.profile?.avatarUrl || profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.profile?.firstName || profile.firstName}+${profile.profile?.lastName || profile.lastName}&background=3b82f6&color=fff`}
                            className={styles.avatar + (uploadingAvatar ? ' opacity-50' : '')}
                            alt={profile.username}
                            onClick={() => isOwnProfile && avatarInputRef.current?.click()}
                        />
                        {(profile.isVip || profile.roles?.includes('vip')) && (
                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5 border-2 border-white dark:border-gray-900">
                                <UserBadge type="vip" size={24} />
                            </div>
                        )}
                    </div>
                    {isOwnProfile && (
                        <>
                            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                            <button
                                className={styles.editAvatarBtn}
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={uploadingAvatar}
                                title="Edit Avatar"
                            >
                                {uploadingAvatar ? <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent" /> : <Edit3 size={18} />}
                            </button>
                        </>
                    )}
                </div>

                <div className={styles.profileInfo}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className={styles.nameRow}>
                                <div className="flex items-center gap-1.5 mr-2">
                                    {(profile.isVip || profile.roles?.includes('vip')) && <UserBadge type="vip" size={24} />}
                                    {(profile.isCreatorCertified || profile.roles?.includes('creator')) && <UserBadge type="creator" size={24} />}
                                </div>
                                <h1 className={styles.displayName}>
                                    {profile.profile?.firstName || profile.firstName} {profile.profile?.lastName || profile.lastName}
                                </h1>
                                <div className="ml-2">
                                    {profile.verified && <CheckCircle className="text-blue-500 shadow-sm" size={20} />}
                                </div>
                            </div>
                            <p className={styles.username}>@{profile.username}</p>
                        </div>
                        <div className="flex gap-2">
                            {isOwnProfile ? (
                                <>
                                    <button onClick={() => navigate('/profile/edit')} className={styles.primaryBtn}>
                                        <Edit3 size={18} /> Edit Profile
                                    </button>
                                    <button onClick={() => navigate('/mail')} className={styles.secondaryBtn} title="Femo Mail">
                                        <Mail size={18} />
                                    </button>
                                    <button className={styles.secondaryBtn} onClick={handleShare} title="Share Profile">
                                        <Share2 size={18} />
                                    </button>
                                    <button className={styles.secondaryBtn} onClick={() => setShowPostComposer(!showPostComposer)} title="Create Post">
                                        <PenTool size={18} />
                                    </button>
                                    <button className={styles.secondaryBtn} onClick={() => navigate('/creator')} title="Creator Tools">
                                        <Zap size={18} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <FollowButton userId={profile.id || profile._id} size="md" variant="solid" />
                                    <button className={styles.secondaryBtn}><MessageCircle size={18} /></button>
                                    <button className={styles.secondaryBtn}><MoreHorizontal size={18} /></button>
                                </>
                            )}
                        </div>
                    </div>

                    {isOwnProfile && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {!profile.isVip && (
                                <button
                                    onClick={() => navigate('/vip-badge')}
                                    className="flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-yellow-500/20"
                                >
                                    <Award size={16} /> Get VIP Badge
                                </button>
                            )}
                            {!profile.isCreatorCertified && (
                                <button
                                    onClick={() => navigate('/creator-certification')}
                                    className="flex items-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-sm border border-gray-200 dark:border-gray-700"
                                >
                                    <ShieldCheck size={16} /> Creator Certification
                                </button>
                            )}
                            {currentUser?.roles?.includes('admin') && (
                                <button
                                    onClick={() => navigate('/admin/creator-applications')}
                                    className="flex items-center gap-2 py-2 px-4 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl font-bold text-sm border border-red-200 dark:border-red-900/30"
                                >
                                    <ShieldCheck size={16} /> Admin: Review Creators
                                </button>
                            )}
                        </div>
                    )}

                    {(profile.profile?.bio || profile.bio) && <p className={styles.bio}>{profile.profile?.bio || profile.bio}</p>}

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {(profile.profile?.country || profile.location) && (
                            <span className="flex items-center gap-1"><MapPin size={16} /> {profile.profile?.country || profile.location}</span>
                        )}
                        {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline">
                                <Globe size={16} /> {profile.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                        {profile.createdAt && (
                            <span className="flex items-center gap-1">
                                <Calendar size={16} /> Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                        )}
                    </div>

                    {/* CLICKABLE STATS SECTION */}
                    <div className={styles.statsRow}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{posts.length || profile.stats?.postsCount || 0}</span>
                            <span className={styles.statLabel}>Posts</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{(profile.stats?.followersCount || 0).toLocaleString()}</span>
                            <span className={styles.statLabel}>Followers</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{(profile.stats?.followingCount || 0).toLocaleString()}</span>
                            <span className={styles.statLabel}>Following</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Post Section (Collapsible) */}
            {isOwnProfile && showPostComposer && (
                <div className="max-w-2xl mx-auto px-4 mb-6">
                    <PostComposer onSuccess={() => {
                        window.location.reload();
                        setShowPostComposer(false);
                    }} />
                </div>
            )}

            {/* TAB SECTION */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabsScroll}>
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="flex items-center gap-2">{tab.icon} {tab.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CONTENT SECTION */}
            <main className={styles.contentSection}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'posts' && (
                            <div className="space-y-6">
                                {posts.length > 0 ? (
                                    posts.map(post => (
                                        <PostCard key={post._id} post={post} onUpdate={() => { }} />
                                    ))
                                ) : (
                                    <div className={styles.gridPlaceholder}>
                                        <p>No posts yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'stories' && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {stories.length > 0 ? (
                                    stories.map((story: any) => (
                                        <div key={story._id} className="relative aspect-[9/16] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:scale-105 transition-transform">
                                            {story.media.type === 'video' ? (
                                                <video src={story.media.url} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={story.media.url} alt="Story" className="w-full h-full object-cover" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold">
                                                {new Date(story.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.gridPlaceholder + " col-span-full"}>
                                        <p>No active stories</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'videos' && (
                            <div className={styles.gridPlaceholder}>
                                <p>No videos yet</p>
                            </div>
                        )}
                        {activeTab === 'reels' && (
                            <div className={styles.gridPlaceholder}>
                                <p>No reels yet</p>
                            </div>
                        )}
                        {activeTab === 'saved' && (
                            <div className={styles.gridPlaceholder}>
                                <p>No saved items yet</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};
