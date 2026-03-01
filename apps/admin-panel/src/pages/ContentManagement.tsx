import React from 'react';
import { motion } from 'framer-motion';
import { Package, Eye, Trash2, Edit3, MessageSquare, Heart } from 'lucide-react';

export const ContentManagement: React.FC = () => {
    const content = [
        { id: '1', author: 'user_one', type: 'Post', text: 'Check out my new reel!', likes: 120, comments: 45, reports: 0 },
        { id: '2', author: 'creator_x', type: 'Story', text: 'Exclusive behind the scenes...', likes: 850, comments: 92, reports: 3 },
        { id: '3', author: 'spam_bot', type: 'Comment', text: 'Click here for free coins!', likes: 0, comments: 0, reports: 12 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-white">Content Ecosystem</h1>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-red-600/20 text-red-500 rounded-xl font-black border border-red-500/20">Review Reported</button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {content.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 border border-slate-700/30 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400">
                                <Package size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <p className="font-bold text-white text-lg">@{item.author}'s {item.type}</p>
                                    {item.reports > 5 && <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded uppercase">High Risk</span>}
                                </div>
                                <p className="text-slate-400 text-sm mt-1">"{item.text}"</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-12">
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Interaction</p>
                                    <div className="flex items-center gap-4 mt-1 text-slate-300">
                                        <span className="flex items-center gap-1 text-xs"><Heart size={12} /> {item.likes}</span>
                                        <span className="flex items-center gap-1 text-xs"><MessageSquare size={12} /> {item.comments}</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Reports</p>
                                    <p className={`text-lg font-black mt-1 ${item.reports > 0 ? 'text-red-400' : 'text-slate-400'}`}>{item.reports}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"><Eye size={18} /></button>
                                <button className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"><Edit3 size={18} /></button>
                                <button className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
