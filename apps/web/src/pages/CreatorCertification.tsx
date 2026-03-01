import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, Link as LinkIcon, Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { creatorService } from '../services/badge.service';
import { UserBadge } from '../components/common/UserBadge';
import { useAuth } from '../contexts/AuthContext';
import { COUNTRIES } from '../data/countries';

export const CreatorCertification: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        reason: '',
        portfolioLinks: [''],
        femoEmailOrId: user?.femoId?.toString() || user?.femoMail || '',
        phoneCountryCode: '+1',
        mobileNumber: '',
        creatorAccountName: '',
        accountType: 'page',
        creationDate: '',
        currentStatus: 'active'
    });

    useEffect(() => {
        fetchApplication();
    }, []);

    const fetchApplication = async () => {
        try {
            const data = await creatorService.getMyApplication();
            setApplication(data);
        } catch (error) {
            console.error('Failed to fetch application', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitting(true);
        try {
            const finalMobileNumber = formData.phoneCountryCode + formData.mobileNumber.replace(/\s+/g, '');
            await creatorService.apply({
                ...formData,
                mobileNumber: finalMobileNumber,
                portfolioLinks: formData.portfolioLinks.filter(l => l)
            });
            alert('Application submitted successfully! Our team will review it soon.');
            fetchApplication();
        } catch (error: any) {
            console.error('Application failed', error);
            alert(error.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const addLink = () => setFormData(prev => ({ ...prev, portfolioLinks: [...prev.portfolioLinks, ''] }));

    const updateLink = (index: number, value: string) => {
        const newLinks = [...formData.portfolioLinks];
        newLinks[index] = value;
        setFormData(prev => ({ ...prev, portfolioLinks: newLinks }));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] pb-20">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Creator Certification</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 pt-8">
                {/* Status Section */}
                {user?.isCreatorCertified ? (
                    <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-10 border border-gray-100 dark:border-gray-800 shadow-sm text-center mb-8">
                        <div className="inline-block p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl mb-6">
                            <UserBadge type="creator" size={80} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You are Certified!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Your account is officially recognized as a certified creator.</p>
                        <button onClick={() => navigate('/profile')} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">View My Profile</button>
                    </div>
                ) : application ? (
                    <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm mb-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Application Status</h3>
                        <div className={`p-6 rounded-2xl flex items-center gap-4 ${application.status === 'pending' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/10 dark:text-yellow-500' :
                            application.status === 'approved' ? 'bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-500' :
                                'bg-red-50 text-red-700 dark:bg-red-900/10 dark:text-red-500'
                            }`}>
                            {application.status === 'pending' ? <Clock size={32} /> :
                                application.status === 'approved' ? <CheckCircle size={32} /> :
                                    <XCircle size={32} />}
                            <div>
                                <p className="font-bold text-lg capitalize">{application.status}</p>
                                <p className="text-sm opacity-80">
                                    {application.status === 'pending' ? 'Your application is being reviewed by our team.' :
                                        application.status === 'approved' ? 'Congratulations! Your account is now certified.' :
                                            `Rejected: ${application.rejectionReason || 'Please review your application and try again later.'}`}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center mb-8">
                            <div className="inline-block p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl mb-6">
                                <UserBadge type="creator" size={60} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Get Your Creator Badge</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Fill out the form below to apply for manual verification.</p>
                        </div>

                        <form onSubmit={handleApply} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Application Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        className="w-full p-4 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Femo Email or ID</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            readOnly
                                            value={formData.femoEmailOrId}
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm outline-none cursor-not-allowed dark:text-gray-400"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-bold">
                                            VERIFIED
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Mobile Number</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.phoneCountryCode}
                                            onChange={e => setFormData(prev => ({ ...prev, phoneCountryCode: e.target.value }))}
                                            className="w-32 p-4 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none text-sm"
                                        >
                                            {COUNTRIES.map(c => (
                                                <option key={c.code} value={c.dialCode}>
                                                    {c.flag} {c.code} ({c.dialCode})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="234 567 890"
                                            value={formData.mobileNumber}
                                            onChange={e => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                                            className="flex-1 p-4 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Creator Account Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Account / Page / Channel Name"
                                        value={formData.creatorAccountName}
                                        onChange={e => setFormData(prev => ({ ...prev, creatorAccountName: e.target.value }))}
                                        className="w-full p-4 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Account Type</label>
                                    <select
                                        value={formData.accountType}
                                        onChange={e => setFormData(prev => ({ ...prev, accountType: e.target.value }))}
                                        className="w-full p-4 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                                    >
                                        <option value="page">Page</option>
                                        <option value="group">Group</option>
                                        <option value="channel">Channel</option>
                                        <option value="account">Personal Creator Account</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Date of Creation</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.creationDate}
                                        onChange={e => setFormData(prev => ({ ...prev, creationDate: e.target.value }))}
                                        className="w-full p-4 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Current Status</label>
                                <select
                                    value={formData.currentStatus}
                                    onChange={e => setFormData(prev => ({ ...prev, currentStatus: e.target.value }))}
                                    className="w-full p-4 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                                >
                                    <option value="active">Active & Growing</option>
                                    <option value="established">Established Brand</option>
                                    <option value="new">New but Promising</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Why should you be certified?</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tell us about your work and presence on social media"
                                    value={formData.reason}
                                    onChange={e => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                                    className="w-full p-4 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Portfolio / Social Links</label>
                                {formData.portfolioLinks.map((link, index) => (
                                    <div key={index} className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <LinkIcon size={18} />
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={link}
                                            onChange={e => updateLink(index, e.target.value)}
                                            className="w-full p-4 pl-12 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addLink}
                                    className="text-sm font-bold text-blue-500 hover:text-blue-600 ml-1 transition-colors"
                                >
                                    + Add Another Link
                                </button>
                            </div>

                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex gap-3 text-blue-700 dark:text-blue-400 text-sm">
                                <Info size={20} className="flex-shrink-0" />
                                <p>Manual verification can take up to 7 business days. You will be notified once a decision is made.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {submitting ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>Submit Application <Send size={20} /></>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </main>
        </div>
    );
};
