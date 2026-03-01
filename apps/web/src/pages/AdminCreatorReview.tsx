import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, X, ExternalLink, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { creatorService } from '../services/badge.service';

interface Application {
    _id: string;
    fullName: string;
    userId: {
        _id: string;
        username: string;
        femoId: string;
    };
    reason: string;
    portfolioLinks: string[];
}

export const AdminCreatorReview: React.FC = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);

    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await creatorService.getAllApplications('pending');
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await creatorService.approveApplication(id);
            setApplications(prev => prev.filter(app => app._id !== id));
            alert('Application approved!');
        } catch (error) {
            console.error('Approve failed', error);
            alert('Failed to approve application');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Reason for rejection:');
        if (reason === null) return;

        setProcessingId(id);
        try {
            await creatorService.rejectApplication(id, reason);
            setApplications(prev => prev.filter(app => app._id !== id));
            alert('Application rejected');
        } catch (error) {
            console.error('Reject failed', error);
            alert('Failed to reject application');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] pb-20">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Creator Applications Review</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Pending Applications ({applications.length})
                    </h2>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-12 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                        <Check size={48} className="text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
                        <p className="text-gray-500 dark:text-gray-400">There are no pending applications for creator certification.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {applications.map((app) => (
                                <motion.div
                                    key={app._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center">
                                                    <User size={24} className="text-blue-500" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">{app.fullName}</h3>
                                                    <p className="text-sm text-gray-500">@{app.userId?.username} • ID: {app.userId?.femoId}</p>
                                                </div>
                                                <a
                                                    href={`/profile/${app.userId?.username}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-auto text-blue-500 hover:text-blue-600 p-2"
                                                >
                                                    <ExternalLink size={20} />
                                                </a>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reason for Application</p>
                                                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-sm italic">
                                                        "{app.reason}"
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Portfolio Links</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {app.portfolioLinks.map((link: string, i: number) => (
                                                            <a
                                                                key={i}
                                                                href={link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-blue-500 text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                            >
                                                                {new URL(link).hostname} <ExternalLink size={12} />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row md:flex-col gap-3 justify-end md:w-48">
                                            <button
                                                disabled={processingId === app._id}
                                                onClick={() => handleApprove(app._id)}
                                                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                            >
                                                {processingId === app._id ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Check size={18} /> Approve</>}
                                            </button>
                                            <button
                                                disabled={processingId === app._id}
                                                onClick={() => handleReject(app._id)}
                                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                            >
                                                {processingId === app._id ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><X size={18} /> Reject</>}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};
