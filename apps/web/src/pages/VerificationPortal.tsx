import { motion } from 'framer-motion';
import { ShieldCheck, Phone, Star, Briefcase, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VerificationPortal = () => {
    const navigate = useNavigate();

    const modules = [
        {
            id: 'id-verify',
            title: 'Identity Verification',
            desc: 'Required for selling and high-volume withdrawals.',
            icon: <ShieldCheck className="text-blue-500" />,
            status: 'NOT_STARTED',
            path: '/monetization/kyc'
        },
        {
            id: 'phone-verify',
            title: 'Phone Verification',
            desc: 'Secure your account with a verified mobile signal.',
            icon: <Phone className="text-emerald-500" />,
            status: 'VERIFIED',
            path: '#'
        },
        {
            id: 'creator-verify',
            title: 'Creator Certification',
            desc: 'Get the exclusive star badge and unlock creator tools.',
            icon: <Star className="text-amber-500" />,
            status: 'ELIGIBLE',
            path: '/creator-certification'
        },
        {
            id: 'business-verify',
            title: 'Business Verification',
            desc: 'Verify your brand or company for commerce tools.',
            icon: <Briefcase className="text-indigo-500" />,
            status: 'LOCKED',
            path: '#'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black uppercase tracking-tight italic">Verification Matrix</h1>
                    <p className="text-white/40 max-w-lg mx-auto font-medium">Verify your digital identity across the FemoSpace ecosystem to unlock elite platform features.</p>
                </div>

                <div className="grid gap-6">
                    {modules.map((module, i) => (
                        <motion.div
                            key={module.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => module.path !== '#' && navigate(module.path)}
                            className="bg-neutral-900 border border-white/5 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-neutral-800/50 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
                                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    {module.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight italic">{module.title}</h3>
                                    <p className="text-white/40 text-sm font-medium mt-1">{module.desc}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right hidden md:block">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${module.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        module.status === 'LOCKED' ? 'bg-white/5 text-white/20 border-white/5' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                        {module.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <ChevronRight className="text-white/20 group-hover:text-white transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Important Note */}
                <div className="bg-blue-600/5 border border-blue-600/20 p-8 rounded-[40px] flex gap-6">
                    <AlertCircle className="text-blue-500 shrink-0" size={24} />
                    <div className="space-y-2">
                        <h4 className="text-sm font-black uppercase italic tracking-wider">Security Awareness</h4>
                        <p className="text-white/40 text-[11px] leading-relaxed font-medium italic">
                            Verification data is processed via zero-knowledge encrypted channels. Our staff will never ask for your recovery phrase or private wallet keys during the identity verification process.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
