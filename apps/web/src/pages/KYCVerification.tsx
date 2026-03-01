import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, User, CreditCard,
    Upload, CheckCircle2,
    Loader2, Scan
} from 'lucide-react';
import { kycService, KYCStatus, KYCProfile } from '../services/kyc.service';
import { useNavigate } from 'react-router-dom';

export const KYCVerification = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [, setProfile] = useState<KYCProfile | null>(null);

    // Form States
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        country: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await kycService.getProfile();
            setProfile(data);
            if (data.status === KYCStatus.APPROVED) {
                // Already verified
            }
        } catch (error) {
            console.error('Failed to fetch KYC profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLevel1Submit = async () => {
        setSubmitting(true);
        try {
            await kycService.submitLevel1(formData);
            setStep(2);
        } catch (error) {
            alert('Failed to submit basic info');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileUpload = async (type: string, file: File) => {
        setSubmitting(true);
        try {
            await kycService.uploadDocument(type, file);
            // Auto progression for demo
            if (type === 'ID_FRONT') setStep(3);
            if (type === 'ID_BACK') setStep(4);
        } catch (error) {
            alert('Upload failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4">
            <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="text-blue-500" size={40} />
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Identity Verification</h1>
                    <p className="text-white/40 max-w-sm mx-auto">Complete verification to unlock full monetization and high-volume payouts.</p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-12">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-600' : 'bg-white/10'}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* STEP 1: BASIC INFO */}
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-neutral-900 border border-white/5 p-10 rounded-[48px]"
                        >
                            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                                <User className="text-blue-500" /> Basic Information
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">Legal Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-bold focus:border-blue-500 outline-none transition-all"
                                        placeholder="Enter your name as it appears on ID"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={formData.dob}
                                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-bold focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-2">Country</label>
                                        <select
                                            value={formData.country}
                                            onChange={e => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-bold focus:border-blue-500 outline-none transition-all"
                                        >
                                            <option value="">Select Country</option>
                                            <option value="US">United States</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="CA">Canada</option>
                                            <option value="DE">Germany</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLevel1Submit}
                                    disabled={submitting}
                                    className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl mt-6 hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'PROCESSING...' : 'CONTINUE'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: ID FRONT */}
                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-neutral-900 border border-white/5 p-10 rounded-[48px] text-center"
                        >
                            <CreditCard className="text-blue-500 mx-auto mb-6" size={48} />
                            <h2 className="text-2xl font-black mb-4">Government ID (Front)</h2>
                            <p className="text-white/40 text-sm mb-10 text-center">Upload a clear photo of the front side of your Passport, National ID, or Driver's License.</p>

                            <label className="block w-full cursor-pointer group">
                                <div className="border-2 border-dashed border-white/10 rounded-[40px] p-16 group-hover:border-blue-500 transition-all flex flex-col items-center">
                                    <Upload className="text-white/20 group-hover:text-blue-500 mb-4" size={40} />
                                    <p className="text-xs font-black uppercase tracking-widest text-white/40">Drop file or click to upload</p>
                                </div>
                                <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload('ID_FRONT', e.target.files[0])} />
                            </label>
                        </motion.div>
                    )}

                    {/* STEP 3: LIVENESS (Simplified for Demo) */}
                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-neutral-900 border border-white/5 p-10 rounded-[48px] text-center"
                        >
                            <Scan className="text-blue-500 mx-auto mb-6" size={48} />
                            <h2 className="text-2xl font-black mb-4">Liveness Detection</h2>
                            <p className="text-white/40 text-sm mb-10 text-center">Position your face in the center and follow the instructions below to prove you are human.</p>

                            <div className="aspect-video bg-black rounded-[40px] border border-white/5 relative overflow-hidden flex items-center justify-center">
                                <div className="w-48 h-64 border-2 border-blue-500 rounded-full border-dashed" />
                                <div className="absolute bottom-6 bg-blue-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    Please Blink Now
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(4)}
                                className="w-full py-5 bg-white text-black font-black rounded-3xl mt-8 hover:scale-105 transition-all"
                            >
                                START SCAN
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: REVIEW STATUS */}
                    {step === 4 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-neutral-900 border border-white/5 p-12 rounded-[60px] text-center"
                        >
                            <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Loader2 className="text-blue-500 animate-spin" size={48} />
                            </div>
                            <h2 className="text-3xl font-black mb-4">Verification Pending</h2>
                            <p className="text-white/40 text-sm mb-10 max-w-xs mx-auto">Our AI engine and compliance experts are reviewing your documents. This usually takes 5-10 minutes.</p>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Level 1: Basic Info</span>
                                    <CheckCircle2 className="text-green-500" size={18} />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Level 2: ID Documents</span>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/monetization')}
                                className="w-full py-5 border border-white/10 rounded-3xl mt-12 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                BACK TO DASHBOARD
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Info */}
                <div className="mt-12 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/20">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} /> 256-BIT ENCRYPTION
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} /> GDPR COMPLIANT
                    </div>
                </div>
            </div>
        </div>
    );
};
