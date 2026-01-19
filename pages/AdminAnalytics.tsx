import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import api from '../src/api/api';

import Header from '../components/Header';

const AdminAnalytics: React.FC = () => {
    const [stats, setStats] = useState({
        totalDownloads: 0,
        totalDocuments: 0,
        totalUsers: 0,
        activeUsers: 0,
        topDocuments: [],
        analyticsData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/analytics');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Carregando dados...</div>;
    }

    return (
        <div className="bg-[#f6f7f8] dark:bg-[#121617] min-h-screen text-[#121617] dark:text-white font-display transition-colors duration-200">
            <Header 
                title="EduDocs Analytics"
                startContent={
                    <div className="text-[#121617] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f6f7f8] dark:bg-[#1e2329]">
                        <span className="material-symbols-outlined">menu</span>
                    </div>
                }
            />

            <main className="flex flex-col gap-6 p-4 pb-24 w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-[#2f8598] dark:text-[#5ab2d1] text-xl">download</span>
                            <span className="text-[#078834] dark:text-[#4ade80] text-xs font-bold bg-[#078834]/10 dark:bg-[#4ade80]/10 px-1.5 py-0.5 rounded">+12%</span>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Total Downloads</p>
                            <p className="text-[#121617] dark:text-white text-2xl font-extrabold leading-tight">{stats.totalDownloads}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-[#2f8598] dark:text-[#5ab2d1] text-xl">description</span>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Total Documentos</p>
                            <p className="text-[#121617] dark:text-white text-2xl font-extrabold leading-tight">{stats.totalDocuments}</p>
                            <p className="text-gray-400 dark:text-gray-500 text-[10px]">Ativos</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-[#2f8598] dark:text-[#5ab2d1] text-xl">calendar_today</span>
                            <span className="text-[#078834] dark:text-[#4ade80] text-xs font-bold bg-[#078834]/10 dark:bg-[#4ade80]/10 px-1.5 py-0.5 rounded">+5%</span>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Usuários</p>
                            <p className="text-[#121617] dark:text-white text-2xl font-extrabold leading-tight">{stats.totalUsers}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-4 bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-[#2f8598] dark:text-[#5ab2d1] text-xl">group</span>
                            <span className="text-[#e73508] dark:text-[#f87171] text-xs font-bold bg-[#e73508]/10 dark:bg-[#f87171]/10 px-1.5 py-0.5 rounded">-2%</span>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Usuários Ativos</p>
                            <p className="text-[#121617] dark:text-white text-2xl font-extrabold leading-tight">{stats.totalUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl p-5 bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-[#121617] dark:text-white text-base font-bold">Tendência de Downloads</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Últimos 6 meses</p>
                        </div>
                        <div className="bg-[#2f8598]/10 dark:bg-[#5ab2d1]/10 text-[#2f8598] dark:text-[#5ab2d1] p-2 rounded-lg">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-[#121617] dark:text-white">{stats.totalDownloads}</span>
                        <span className="text-[#078834] dark:text-[#4ade80] text-sm font-bold">+15.4%</span>
                    </div>
                    <div className="h-40 w-full mt-2 relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.analyticsData}>
                                <defs>
                                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2f8598" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2f8598" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="downloads" stroke="#2f8598" strokeWidth={3} fillOpacity={1} fill="url(#colorDownloads)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-[#121617] dark:text-white text-lg font-bold">Top Documentos</h2>
                        <button className="text-[#2f8598] dark:text-[#5ab2d1] text-sm font-bold">Ver todos</button>
                    </div>
                    <div className="flex flex-col bg-white dark:bg-[#1e2329] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 gap-2 p-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-[#2c333a]/50">
                            <div className="col-span-10 text-[10px] font-bold uppercase tracking-wider text-gray-400">Documento</div>
                            <div className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Dls</div>
                        </div>
                        {stats.topDocuments.length > 0 ? stats.topDocuments.map((doc: any, idx: number) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 p-4 items-center border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-[#2c333a] transition-colors">
                                <div className="col-span-10 flex flex-col">
                                    <span className="text-sm font-bold text-[#121617] dark:text-white truncate">{doc.title}</span>
                                    <span className="text-xs text-gray-400">{doc.status}</span>
                                </div>
                                <div className="col-span-2 text-right">
                                    <span className="text-xs font-bold text-[#2f8598] dark:text-[#5ab2d1]">{doc.downloads}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-4 text-center text-gray-500 text-sm">Nenhum documento baixado ainda.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminAnalytics;