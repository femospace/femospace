import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CountrySelector } from '../../components/CountrySelector';
import styles from './ProfileSetup.module.css';
import {
    Upload,
    User,
    MapPin,
    Link as LinkIcon,
    X,
    CheckCircle,
    AlertCircle,
    Facebook,
    Linkedin,
    Youtube,
    Twitter,
    Instagram
} from 'lucide-react';

// Social Platforms Config
const SOCIAL_PLATFORMS = [
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/username' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@channel' },
    { id: 'tiktok', name: 'TikTok', icon: LinkIcon, placeholder: 'https://tiktok.com/@username' }, // No Lucide TikTok yet
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, placeholder: 'https://x.com/username' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
];

export const ProfileSetup = () => {
    const { user, updateUserProfile } = useAuth();
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    // Form State
    const [formData, setFormData] = useState({
        username: user?.username || '',
        bio: '',
        country: '',
        city: '',
        skills: [] as string[],
        socials: {} as Record<string, string>,
    });

    // Image State
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    // Validation State
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [tagInput, setTagInput] = useState('');

    // Refs
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // --- Handlers ---

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        handleComplete(true);
    };

    const handleComplete = async (skipped = false) => {
        console.log('Completing profile setup...', { skipped, formData });

        // Update context to mark onboarding as done
        updateUserProfile({ isOnboardingCompleted: true });
    };

    // Image Upload Handlers
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'avatar') setAvatarPreview(reader.result as string);
                else setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Username Check (Mock)
    useEffect(() => {
        const checkUsername = async () => {
            if (formData.username.length < 3) {
                setUsernameStatus('idle');
                return;
            }
            setUsernameStatus('checking');
            // Mock delay
            setTimeout(() => {
                if (formData.username === 'admin') setUsernameStatus('taken');
                else setUsernameStatus('available');
            }, 500);
        };

        const timeoutId = setTimeout(checkUsername, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [formData.username]);

    // Skills Handlers
    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(tagInput.trim())) {
                setFormData(prev => ({ ...prev, skills: [...prev.skills, tagInput.trim()] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(t => t !== tag) }));
    };

    // --- Renders ---

    const renderStepIndicator = () => (
        <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                />
            </div>
            <div className={styles.steps}>
                <span>Step {step} of {totalSteps}</span>
                <span>
                    {step === 1 && 'Profile Images'}
                    {step === 2 && 'Basic Info'}
                    {step === 3 && 'Skills & Interests'}
                    {step === 4 && 'Social Links'}
                </span>
            </div>
        </div>
    );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.backgroundOrb} />
            <div className={styles.backgroundOrb2} />

            <div className={styles.contentContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Welcome to Femo Space</h1>
                    <p className={styles.subtitle}>Let's set up your digital identity</p>
                </div>

                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {renderStepIndicator()}

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className={styles.formArea}
                        >
                            {/* STEP 1: IMAGES */}
                            {step === 1 && (
                                <div className={styles.stepContent}>
                                    <h2 className={styles.sectionTitle}>Profile Images</h2>

                                    <div className={styles.uploadArea} onClick={() => avatarInputRef.current?.click()}>
                                        <input
                                            type="file"
                                            ref={avatarInputRef}
                                            className={styles.hiddenInput}
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'avatar')}
                                        />
                                        <div className={styles.avatarPreview}>
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className={styles.avatarImage} />
                                            ) : (
                                                <User size={48} color="#64748b" />
                                            )}
                                        </div>
                                        <div>
                                            <div className={styles.label}>Profile Picture</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Click to upload</div>
                                        </div>
                                    </div>

                                    <div className={styles.uploadArea} onClick={() => coverInputRef.current?.click()} style={{ marginTop: '1rem', height: '120px' }}>
                                        <input
                                            type="file"
                                            ref={coverInputRef}
                                            className={styles.hiddenInput}
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 'cover')}
                                        />
                                        {coverPreview ? (
                                            <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b' }}>
                                                <Upload size={24} />
                                                <span>Upload Cover Photo</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: BASIC INFO */}
                            {step === 2 && (
                                <div className={styles.stepContent}>
                                    <h2 className={styles.sectionTitle}>Basic Information</h2>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Username</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                className={styles.input}
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                                                placeholder="@username"
                                                style={{ width: '100%' }}
                                            />
                                            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                                                {usernameStatus === 'checking' && <div className="spinner" style={{ width: 16, height: 16, border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
                                                {usernameStatus === 'available' && <CheckCircle size={18} color="#22c55e" />}
                                                {usernameStatus === 'taken' && <AlertCircle size={18} color="#ef4444" />}
                                            </div>
                                        </div>
                                        {usernameStatus === 'taken' && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Username is taken</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Bio</label>
                                        <textarea
                                            className={`${styles.input} ${styles.textarea}`}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Tell us a bit about yourself..."
                                            maxLength={300}
                                        />
                                        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
                                            {formData.bio.length}/300
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Location</label>
                                        <CountrySelector
                                            value={formData.country}
                                            onChange={(code) => setFormData({ ...formData, country: code })}
                                            placeholder="Select Country"
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>City</label>
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input
                                                className={styles.input}
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                placeholder="City"
                                                style={{ paddingLeft: '3rem', width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: SKILLS */}
                            {step === 3 && (
                                <div className={styles.stepContent}>
                                    <h2 className={styles.sectionTitle}>Skills & Specialities</h2>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Add Skills (Press Enter)</label>
                                        <input
                                            className={styles.input}
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            placeholder="e.g. Photography, Coding, Design"
                                        />
                                        <div className={styles.tagContainer}>
                                            {formData.skills.map((skill, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    className={styles.tag}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                >
                                                    {skill}
                                                    <X size={14} className={styles.removeTag} onClick={() => removeTag(skill)} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '2rem' }}>
                                        <label className={styles.toggleLabel}>
                                            <input type="checkbox" className={styles.hiddenInput} defaultChecked />
                                            <div className={styles.toggleSwitch}>
                                                <div className={styles.toggleSlider} />
                                            </div>
                                            <span style={{ color: '#e2e8f0' }}>Make Skills Public</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: SOCIALS */}
                            {step === 4 && (
                                <div className={styles.stepContent}>
                                    <h2 className={styles.sectionTitle}>Social Links</h2>
                                    <p className={styles.subtitle} style={{ marginBottom: '1.5rem' }}>Connect your other profiles (Optional)</p>

                                    {SOCIAL_PLATFORMS.map((platform) => (
                                        <div key={platform.id} className={`${styles.inputGroup} ${styles.socialInputGroup}`}>
                                            <platform.icon className={styles.socialIcon} size={18} />
                                            <input
                                                className={`${styles.input} ${styles.socialInput}`}
                                                placeholder={platform.placeholder}
                                                value={formData.socials[platform.id] || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    socials: { ...formData.socials, [platform.id]: e.target.value }
                                                })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className={styles.buttonRow}>
                        {step > 1 ? (
                            <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleBack}>
                                Back
                            </button>
                        ) : (
                            <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleSkip}>
                                Skip for now
                            </button>
                        )}

                        <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleNext}>
                            {step === totalSteps ? 'Finish Profile' : 'Continue'}
                        </button>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};
