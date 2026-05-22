import { useState } from 'react';
import {
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Filter,
    Eye
} from 'lucide-react';

export const AdminPaymentApprovals = () => {
    const [filter, setFilter] = useState('pending');

    const [requests, setRequests] = useState([
        { id: '1', user: 'Alicia Keys', userId: '8829', amount: 500, type: 'deposit', method: 'bank-transfer', status: 'pending', date: '10 mins ago', proofUrl: 'https://example.com/receipt.jpg' },
        { id: '2', user: 'Bob Marley', userId: '4421', amount: 1500, type: 'withdraw', method: 'payoneer', status: 'pending', date: '1 hour ago', details: 'bob@example.com' },
        { id: '3', user: 'Charlie Puth', userId: '1102', amount: 50, type: 'deposit', method: 'skrill', status: 'completed', date: '2 hours ago' },
    ]);

    const handleApprove = (id: string) => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'completed' } : r));
    };

    const handleReject = (id: string) => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'failed' } : r));
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-[#0f172a] min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Payment Approvals</h1>
                        <p className="text-gray-500 font-medium italic">Admin control center for global financial transactions.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-[#1e293b] p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        {['pending', 'completed', 'failed'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Queue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Pending Deposits</p>
                        <h3 className="text-3xl font-black text-blue-600">12</h3>
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Withdrawal Requests</p>
                        <h3 className="text-3xl font-black text-orange-600">8</h3>
                    </div>
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Fraud Alerts</p>
                        <h3 className="text-3xl font-black text-red-600">0</h3>
                    </div>
                </div>

                {/* Request Table */}
                <div className="bg-white dark:bg-[#1e293b] rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="relative w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                className="w-full bg-gray-50 dark:bg-gray-800 pl-12 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="Search by user or ID..."
                            />
                        </div>
                        <button className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-500">
                            <Filter size={20} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type / Method</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {requests.filter(r => r.status === filter).map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-black text-blue-600">
                                                    {r.user[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white uppercase">{r.user}</p>
                                                    <p className="text-[10px] font-bold text-gray-500">ID: {r.userId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-700 dark:text-gray-300 uppercase text-xs">{r.type}</span>
                                                <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{r.method}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-gray-900 dark:text-white">${r.amount}</td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                r.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {r.status === 'pending' ? <Clock size={12} /> :
                                                    r.status === 'completed' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                {r.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {r.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(r.id)}
                                                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors shadow-lg shadow-green-500/20"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(r.id)}
                                                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shadow-lg shadow-red-500/20"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 transition-colors">
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
