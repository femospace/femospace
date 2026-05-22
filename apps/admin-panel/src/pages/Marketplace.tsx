import React from 'react';
import { Package, ShoppingCart, AlertCircle, CheckCircle2, MoreVertical, Search, Filter } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const stats = [
    { label: 'Total Products', value: '12,482', change: '+12%', icon: <Package className="text-blue-400" /> },
    { label: 'Active Orders', value: '842', change: '+5%', icon: <ShoppingCart className="text-indigo-400" /> },
    { label: 'Pending Approvals', value: '124', change: '-2%', icon: <AlertCircle className="text-amber-400" /> },
    { label: 'Completed Sales', value: '$124.5k', change: '+18%', icon: <CheckCircle2 className="text-emerald-400" /> },
  ];

  const pendingSellers = [
    { id: '1', name: 'Digital Dynamics', email: 'contact@digitaldy.com', category: 'Software', date: '2024-03-07' },
    { id: '2', name: 'Artisan Hub', email: 'hello@artisan.io', category: 'Graphics', date: '2024-03-06' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6 flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black text-white mt-2">{stat.value}</h3>
              <p className={`text-xs font-bold mt-2 ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.change} from last month
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Marketplace Inventory */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-white">Global Inventory</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Manage and monitor platform-wide listings</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="ID, Name, Seller..." 
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all w-64"
                />
              </div>
              <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/2 border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Product / ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Seller</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Price</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <tr key={idx} className="hover:bg-white/2 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-slate-400">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Digital Asset Package {idx}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5">ID: PRD-9283-0{idx}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-300">Creator_{idx * 12}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-white">${(idx * 45).toFixed(2)}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20">
                        ACTIVE
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-500 hover:text-white transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Pending Approvals */}
        <div className="space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-lg font-black text-white mb-6">Seller Applications</h3>
            <div className="space-y-6">
              {pendingSellers.map((seller) => (
                <div key={seller.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-white">{seller.name}</p>
                      <p className="text-[10px] font-medium text-slate-500">{seller.email}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black rounded border border-amber-500/20">
                      PENDING
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl transition-all">
                      APPROVE
                    </button>
                    <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-black rounded-xl transition-all border border-white/10">
                      REJECT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 bg-gradient-to-br from-indigo-500/5 to-blue-500/5">
            <h3 className="text-lg font-black text-white mb-4">Marketplace Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Success Rate</p>
                <p className="text-sm font-black text-white">99.2%</p>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[99.2%] h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
              <p className="text-[10px] font-medium text-slate-400 mt-2">All marketplace systems operational across 12 nodes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
