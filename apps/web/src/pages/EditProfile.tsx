import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Camera,
    User,
    AtSign,
    FileText,
    Globe,
    MapPin,
    ChevronDown,
    Lock,
    Mail,
    Phone,
    Trash2,
    Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileService, UpdateProfileData } from '../services/profile.service';
import clsx from 'clsx';

export const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateUserProfile } = useAuth();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState<UpdateProfileData & { firstName: string, lastName: string, username: string }>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        username: user?.username || '',
        bio: user?.bio || '',
        website: user?.website || '',
        location: user?.location || '',
        birthday: user?.birthday || '',
        gender: user?.gender || '',
        privacy: {
            profileVisibility: 'public',
            showFollowersCount: true,
            showFollowingCount: true,
        },
        publicEmail: '',
        phone: '',
        avatarUrl: user?.avatarUrl || '',
        coverUrl: user?.coverUrl || '',
    });

    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Simple change detection
        const changed =
            formData.firstName !== user?.firstName ||
            formData.lastName !== user?.lastName ||
            formData.username !== user?.username ||
            formData.bio !== (user?.bio || '') ||
            formData.website !== (user?.website || '') ||
            formData.location !== (user?.location || '') ||
            formData.avatarUrl !== (user?.avatarUrl || '') ||
            formData.coverUrl !== (user?.coverUrl || '');
        setHasChanges(changed);
    }, [formData, user]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (formData.firstName.length < 2) newErrors.firstName = 'First name must be at least 2 characters';
        if (formData.lastName.length < 2) newErrors.lastName = 'Last name must be at least 2 characters';
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
            newErrors.username = 'Username must be 3-20 characters (letters, numbers, underscores only)';
        }
        if (formData.website && !/^https?:\/\/.*/.test(formData.website)) {
            newErrors.website = 'Website must be a valid URL starting with http:// or https://';
        }
        if (formData.bio && formData.bio.length > 160) newErrors.bio = 'Bio cannot exceed 160 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await profileService.uploadAvatar(file);
            setFormData(prev => ({ ...prev, avatarUrl: url }));
        } catch (err) {
            console.error('Avatar upload failed');
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await profileService.uploadCover(file);
            setFormData(prev => ({ ...prev, coverUrl: url }));
        } catch (err) {
            console.error('Cover upload failed');
        }
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        try {
            const dataToUpdate = { ...formData };
            const updatedUser = await profileService.updateProfile(dataToUpdate);
            updateUserProfile(updatedUser);
            navigate('/profile');
        } catch (err: any) {
            console.error('Save failed');
            setErrors({ submit: err.response?.data?.message || 'Failed to save changes' });
        } finally {
            setSaving(false);
        }
    };

    const InputGroup = ({ label, icon: Icon, name, value, onChange, placeholder, error, type = "text", info }: any) => (
        <div className="space-y-1.5 px-6 py-4 border-b border-gray-50 dark:border-gray-800/50">
            <div className="flex justify-between items-center">
                <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
                {info && <span className="text-[11px] text-blue-500 font-medium">{info}</span>}
            </div>
            <div className="relative group">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Icon size={18} />
                </div>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={clsx(
                        "w-full bg-transparent pl-10 pr-4 py-3 rounded-xl border transition-all outline-none text-gray-900 dark:text-white font-medium",
                        error ? "border-red-500/50 bg-red-500/5" : "border-gray-100 dark:border-gray-800 focus:border-blue-500/50 focus:bg-blue-500/5"
                    )}
                />
            </div>
            {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Edit Profile</h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className={clsx(
                            "px-5 py-2 rounded-full font-bold text-sm transition-all",
                            !hasChanges || saving
                                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                        )}
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : "Save"}
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto space-y-6">
                {/* PHOTOS SECTION */}
                <section className="bg-white dark:bg-[#1e293b] border-b border-gray-100 dark:border-gray-800 shadow-sm relative">
                    {/* Cover Preview */}
                    <div className="h-48 w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                        {formData.coverUrl ? (
                            <img src={formData.coverUrl} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                        )}
                        <button
                            onClick={() => coverInputRef.current?.click()}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-colors text-white gap-2 backdrop-blur-[2px]"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <Camera size={24} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest">Change Cover</span>
                        </button>
                        <input ref={coverInputRef} type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                    </div>

                    {/* Avatar Preview */}
                    <div className="px-6 -mt-12 pb-6 flex items-end justify-between relative z-10">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-white dark:border-[#1e293b] bg-gray-200 dark:bg-gray-800 shadow-2xl relative">
                                <img src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                >
                                    <Camera size={24} />
                                </button>
                            </div>
                            <input ref={avatarInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                        </div>
                        {formData.avatarUrl && (
                            <button
                                onClick={() => setFormData(prev => ({ ...prev, avatarUrl: '' }))}
                                className="mb-2 p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </section>

                {/* FIELDS SECTION */}
                <section className="bg-white dark:bg-[#1e293b] border-y border-gray-100 dark:border-gray-800 shadow-sm">
                    <InputGroup
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e: any) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                        icon={User}
                        error={errors.firstName}
                    />
                    <InputGroup
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e: any) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                        icon={User}
                        error={errors.lastName}
                    />
                    <InputGroup
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={(e: any) => setFormData(p => ({ ...p, username: e.target.value }))}
                        icon={AtSign}
                        info="Required, unique URL"
                        error={errors.username}
                    />

                    {/* Bio Textarea */}
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800/50 space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Bio</label>
                            <span className={clsx("text-xs font-medium", (formData.bio?.length || 0) > 160 ? "text-red-500" : "text-gray-400")}>
                                {formData.bio?.length || 0}/160
                            </span>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-0 top-4 w-10 flex justify-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <FileText size={18} />
                            </div>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                                placeholder="Tell us something about yourself..."
                                rows={3}
                                className={clsx(
                                    "w-full bg-transparent pl-10 pr-4 py-3 rounded-xl border transition-all outline-none text-gray-900 dark:text-white font-medium resize-none",
                                    errors.bio ? "border-red-500/50 bg-red-500/5" : "border-gray-100 dark:border-gray-800 focus:border-blue-500/50 focus:bg-blue-500/5"
                                )}
                            />
                        </div>
                    </div>

                    <InputGroup
                        label="Website"
                        name="website"
                        value={formData.website}
                        onChange={(e: any) => setFormData(p => ({ ...p, website: e.target.value }))}
                        icon={Globe}
                        placeholder="https://..."
                        error={errors.website}
                    />
                    <InputGroup
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={(e: any) => setFormData(p => ({ ...p, location: e.target.value }))}
                        icon={MapPin}
                        placeholder="San Francisco, CA"
                    />

                    {/* SELECTS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="px-6 py-4 border-b md:border-r border-gray-50 dark:border-gray-800/50 space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Gender</label>
                            <div className="relative">
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData(p => ({ ...p, gender: e.target.value }))}
                                    className="w-full bg-transparent py-3 pr-10 border-none outline-none text-gray-900 dark:text-white font-medium appearance-none cursor-pointer"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800/50 space-y-1.5">
                            <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Birthday</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.birthday ? new Date(formData.birthday).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setFormData(p => ({ ...p, birthday: e.target.value }))}
                                    className="w-full bg-transparent py-3 border-none outline-none text-gray-900 dark:text-white font-medium appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRIVACY SECTION */}
                <section className="bg-white dark:bg-[#1e293b] border-y border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <Lock size={16} className="text-gray-400" />
                            <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Privacy Settings</h2>
                        </div>
                    </div>

                    {/* Visibility Select */}
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800/50 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800 dark:text-gray-100">Profile Visibility</span>
                            <span className="text-xs text-gray-400">Who can see your profile details</span>
                        </div>
                        <select
                            value={formData.privacy?.profileVisibility}
                            onChange={(e) => setFormData(p => ({ ...p, privacy: { ...p.privacy!, profileVisibility: e.target.value as any } }))}
                            className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-sm font-bold border-none outline-none cursor-pointer"
                        >
                            <option value="public">Public</option>
                            <option value="followers">Followers</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    {/* Toggles */}
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800/50 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800 dark:text-gray-100">Show Follower Counts</span>
                            <span className="text-xs text-gray-400">Make your stats public</span>
                        </div>
                        <button
                            onClick={() => setFormData(p => ({ ...p, privacy: { ...p.privacy!, showFollowersCount: !p.privacy?.showFollowersCount } }))}
                            className={clsx(
                                "w-11 h-6 rounded-full relative transition-colors duration-200",
                                formData.privacy?.showFollowersCount ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                            )}
                        >
                            <div className={clsx(
                                "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm",
                                formData.privacy?.showFollowersCount ? "left-6" : "left-1"
                            )} />
                        </button>
                    </div>

                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800 dark:text-gray-100">Show Following Counts</span>
                            <span className="text-xs text-gray-400">Show who you are following</span>
                        </div>
                        <button
                            onClick={() => setFormData(p => ({ ...p, privacy: { ...p.privacy!, showFollowingCount: !p.privacy?.showFollowingCount } }))}
                            className={clsx(
                                "w-11 h-6 rounded-full relative transition-colors duration-200",
                                formData.privacy?.showFollowingCount ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                            )}
                        >
                            <div className={clsx(
                                "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm",
                                formData.privacy?.showFollowingCount ? "left-6" : "left-1"
                            )} />
                        </button>
                    </div>
                </section>

                {/* CONTACT SECTION */}
                <section className="bg-white dark:bg-[#1e293b] border-y border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Contact Information</h2>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800/50 flex flex-col gap-1.5 opacity-60">
                        <label className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">Femo Mail (ReadOnly)</label>
                        <div className="flex items-center gap-3">
                            <img src="/icons/Favicon.png" className="w-5 h-5 opacity-40" />
                            <span className="font-bold text-gray-900 dark:text-white">{user?.femoMail || 'user@femo.com'}</span>
                        </div>
                    </div>

                    <InputGroup
                        label="Public Email"
                        name="publicEmail"
                        value={formData.publicEmail}
                        onChange={(e: any) => setFormData(p => ({ ...p, publicEmail: e.target.value }))}
                        icon={Mail}
                        placeholder="hello@example.com"
                    />
                    <InputGroup
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={(e: any) => setFormData(p => ({ ...p, phone: e.target.value }))}
                        icon={Phone}
                        placeholder="+1 234 567 8900"
                    />
                </section>

                {/* ACCOUNT ACTIONS */}
                <footer className="px-6 pt-12 pb-24 text-center space-y-6">
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to reset all changes?")) {
                                setFormData({
                                    ...formData,
                                    firstName: user?.firstName || '',
                                    lastName: user?.lastName || '',
                                    username: user?.username || '',
                                    bio: user?.bio || '',
                                    website: user?.website || '',
                                    location: user?.location || '',
                                    avatarUrl: user?.avatarUrl || '',
                                    coverUrl: user?.coverUrl || '',
                                });
                            }
                        }}
                        className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                    >
                        Reset Changes
                    </button>
                    <div className="flex flex-col gap-3">
                        <button className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] hover:text-orange-600 transition-colors">Deactivate Account</button>
                        <button className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] hover:text-red-600 transition-colors">Delete Account Permanently</button>
                    </div>
                </footer>
            </main>
        </div>
    );
};
