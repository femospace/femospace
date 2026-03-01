import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail as MailIcon,
    Inbox,
    Send,
    FileText,
    Trash2,
    Plus,
    Search,
    Archive,
    Star,
    ChevronLeft,
    ChevronRight,
    Paperclip,
    Smile,
    Image as ImageIcon,
    X,
    Maximize2,
    RotateCcw,
    UserCircle
} from 'lucide-react';
import { mailService, Mail } from '../services/mail.service';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { UserBadge } from '../components/common/UserBadge';

type MailFolder = 'inbox' | 'sent' | 'drafts' | 'trash';

export const FemoMail = () => {
    const { user } = useAuth();
    const [activeFolder, setActiveFolder] = useState<MailFolder>('inbox');
    const [mails, setMails] = useState<Mail[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Compose State
    const [composeData, setComposeData] = useState({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: ''
    });

    const fetchMails = useCallback(async () => {
        setLoading(true);
        try {
            let data: Mail[] = [];
            switch (activeFolder) {
                case 'inbox': data = await mailService.getInbox(); break;
                case 'sent': data = await mailService.getSent(); break;
                case 'drafts': data = await mailService.getDrafts(); break;
                case 'trash': data = await mailService.getTrash(); break;
            }
            setMails(data);
        } catch (error) {
            console.error('Failed to fetch mails', error);
        } finally {
            setLoading(false);
        }
    }, [activeFolder]);

    useEffect(() => {
        fetchMails();
        const interval = setInterval(fetchMails, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [fetchMails]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mailService.sendMail({
                to: composeData.to.split(',').map(s => s.trim()),
                cc: composeData.cc ? composeData.cc.split(',').map(s => s.trim()) : undefined,
                bcc: composeData.bcc ? composeData.bcc.split(',').map(s => s.trim()) : undefined,
                subject: composeData.subject,
                body: composeData.body
            });
            setIsComposeOpen(false);
            setComposeData({ to: '', cc: '', bcc: '', subject: '', body: '' });
            if (activeFolder === 'sent') fetchMails();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to send mail');
        }
    };

    const handleSelectMail = async (mail: Mail) => {
        setSelectedMail(mail);
        if (activeFolder === 'inbox' && !mail.readBy[user?.id || '']) {
            await mailService.markAsRead(mail._id);
            // Update local state
            setMails(prev => prev.map(m => m._id === mail._id ? { ...m, readBy: { ...m.readBy, [user?.id || '']: true } } : m));
        }
    };

    const handleDeleteMail = async (id: string) => {
        try {
            await mailService.deleteMail(id);
            setMails(prev => prev.filter(m => m._id !== id));
            if (selectedMail?._id === id) setSelectedMail(null);
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    const filteredMails = mails.filter(m =>
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white dark:bg-[#0f172a] overflow-hidden">
            {/* Sidebar */}
            <div className="w-16 md:w-64 border-r border-gray-100 dark:border-gray-800 flex flex-col pt-6 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="px-4 mb-6">
                    <button
                        onClick={() => setIsComposeOpen(true)}
                        className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-blue-600 text-blue-600 dark:text-white rounded-2xl font-bold shadow-lg shadow-blue-500/10 hover:shadow-xl transition-all w-full md:justify-center"
                    >
                        <Plus size={20} />
                        <span className="hidden md:block">Compose</span>
                    </button>
                </div>

                <div className="flex-1 space-y-1 px-2">
                    {[
                        { id: 'inbox', icon: <Inbox size={18} />, label: 'Inbox', count: mails.filter(m => !m.readBy[user?.id || '']).length },
                        { id: 'sent', icon: <Send size={18} />, label: 'Sent' },
                        { id: 'drafts', icon: <FileText size={18} />, label: 'Drafts' },
                        { id: 'trash', icon: <Trash2 size={18} />, label: 'Trash' }
                    ].map(folder => (
                        <button
                            key={folder.id}
                            onClick={() => { setActiveFolder(folder.id as MailFolder); setSelectedMail(null); }}
                            className={`flex items-center gap-4 w-full p-3 rounded-xl font-bold transition-all ${activeFolder === folder.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            {folder.icon}
                            <span className="hidden md:block flex-1 text-left">{folder.label}</span>
                            {folder.count && folder.count > 0 && (
                                <span className="hidden md:block px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{folder.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Account info at bottom */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                            <img src={user?.avatarUrl || `https://i.pravatar.cc/150?u=${user?.id}`} />
                        </div>
                        <div className="hidden md:block min-w-0">
                            <p className="text-xs font-bold dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] text-gray-400 truncate">{user?.femoMail || `${user?.femoId}@femo.app`}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* List and Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Mail List */}
                <div className={`${selectedMail ? 'hidden lg:flex' : 'flex'} w-full md:w-80 lg:w-[400px] flex-col border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f172a]`}>
                    <div className="p-4 border-b border-gray-50 dark:border-gray-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search in mail..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border-none focus:ring-2 focus:ring-blue-500/50 text-sm dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading && (
                            <div className="flex justify-center p-8">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                        {!loading && filteredMails.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-12 text-center opacity-40">
                                <Archive size={48} className="mb-4" />
                                <p className="font-bold text-sm dark:text-white">Your {activeFolder} is empty</p>
                            </div>
                        )}
                        {filteredMails.map(mail => (
                            <div
                                key={mail._id}
                                onClick={() => handleSelectMail(mail)}
                                className={`p-4 border-b border-gray-50 dark:border-gray-800 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/40 relative ${selectedMail?._id === mail._id ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden">
                                            {mail.fromUserId?.avatarUrl ? <img src={mail.fromUserId.avatarUrl} /> : <UserCircle size={20} className="text-blue-500" />}
                                        </div>
                                        <span className={`text-xs font-bold dark:text-gray-200 truncate max-w-[120px] ${!mail.readBy[user?.id || ''] ? 'text-blue-600' : ''}`}>
                                            {mail.fromUserId?.firstName} {mail.fromUserId?.lastName}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(mail.createdAt), { addSuffix: false })}
                                    </span>
                                </div>
                                <h3 className={`text-sm mb-1 truncate dark:text-white ${!mail.readBy[user?.id || ''] ? 'font-black' : 'font-medium'}`}>
                                    {mail.subject}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                    {mail.body}
                                </p>
                                {!mail.readBy[user?.id || ''] && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mail Content Area */}
                <div className={`flex-1 flex flex-col bg-gray-50/30 dark:bg-[#080d1a] ${!selectedMail ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                    {selectedMail ? (
                        <>
                            {/* Content Header */}
                            <div className="p-4 bg-white dark:bg-[#0f172a] border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-8">
                                <div className="flex gap-2">
                                    <button onClick={() => setSelectedMail(null)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg dark:text-white">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="flex gap-4">
                                        <button onClick={() => handleDeleteMail(selectedMail._id)} className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                        <button className="p-2.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                                            <RotateCcw size={20} />
                                        </button>
                                        <button className="p-2.5 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl transition-all">
                                            <Star size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-white"><ChevronLeft size={20} /></button>
                                    <button className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-white"><ChevronRight size={20} /></button>
                                </div>
                            </div>

                            {/* Mail Body */}
                            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
                                <div className="mb-8">
                                    <h1 className="text-2xl font-black dark:text-white mb-6 leading-tight">{selectedMail.subject}</h1>
                                    <div className="flex items-center justify-between bg-white dark:bg-gray-800/40 p-5 rounded-3xl border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center overflow-hidden">
                                                {selectedMail.fromUserId?.avatarUrl ? <img src={selectedMail.fromUserId.avatarUrl} /> : <UserCircle size={24} className="text-blue-500" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-black dark:text-white">
                                                        {selectedMail.fromUserId?.firstName} {selectedMail.fromUserId?.lastName}
                                                    </span>
                                                    <UserBadge type="vip" size={14} />
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    &lt;{selectedMail.fromUserId?.femoMail || `${selectedMail.fromUserId?.femoId}@femo.app`}&gt;
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{formatDistanceToNow(new Date(selectedMail.createdAt), { addSuffix: true })}</p>
                                            <p className="text-[10px] text-blue-500 font-bold mt-1">to me</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-800 leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap min-h-[400px]">
                                    {selectedMail.body}
                                </div>

                                {/* Quick Reply Area */}
                                <div className="mt-8 flex gap-4">
                                    <button onClick={() => { setComposeData({ ...composeData, to: selectedMail.fromUserId?.femoMail || selectedMail.fromUserId?.femoId?.toString() || '' }); setIsComposeOpen(true); }} className="flex-1 py-4 bg-blue-50 dark:bg-blue-900/10 text-blue-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all">
                                        <RotateCcw size={18} /> Reply
                                    </button>
                                    <button className="flex-1 py-4 bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                                        <Send size={18} className="rotate-45" /> Forward
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center opacity-30 select-none">
                            <MailIcon size={80} className="mb-6 text-blue-500" />
                            <h2 className="text-2xl font-black dark:text-white mb-2">Select an email to read</h2>
                            <p className="text-sm dark:text-gray-400">Everything in Femo Mail stays private within Femo Space.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Compose Modal */}
            <AnimatePresence>
                {isComposeOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="bg-white dark:bg-[#0f172a] w-full max-w-2xl rounded-t-[40px] md:rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                        >
                            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-b border-gray-100 dark:border-gray-800 px-8">
                                <h2 className="text-lg font-black dark:text-white flex items-center gap-2">
                                    <Plus size={20} className="text-blue-500" /> New Message
                                </h2>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-gray-600"><Maximize2 size={18} /></button>
                                    <button onClick={() => setIsComposeOpen(false)} className="p-2 text-gray-400 hover:text-red-500"><X size={18} /></button>
                                </div>
                            </div>

                            <form onSubmit={handleSend} className="p-8 space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 border-b border-gray-50 dark:border-gray-800 py-2">
                                        <span className="text-xs font-bold text-gray-400 w-12">To</span>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Femo ID or username@femo.app"
                                            value={composeData.to}
                                            onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm dark:text-white"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 border-b border-gray-50 dark:border-gray-800 py-2">
                                        <span className="text-xs font-bold text-gray-400 w-12">Subject</span>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Subject"
                                            value={composeData.subject}
                                            onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm dark:text-white font-bold"
                                        />
                                    </div>
                                </div>

                                <textarea
                                    required
                                    rows={12}
                                    placeholder="Write your internal message here..."
                                    value={composeData.body}
                                    onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                                    className="w-full bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl p-6 border-none focus:ring-2 focus:ring-blue-500/20 text-sm dark:text-white resize-none"
                                />

                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex gap-2">
                                        <button type="button" className="p-3 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"><Paperclip size={20} /></button>
                                        <button type="button" className="p-3 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"><ImageIcon size={20} /></button>
                                        <button type="button" className="p-3 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"><Smile size={20} /></button>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setIsComposeOpen(false)} type="button" className="px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all">Discard</button>
                                        <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                                            Send <Send size={18} className="rotate-45" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
