import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/api/api';
import Header from '../components/Header';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDocuments: 0,
        recentUploads: 0,
        totalDownloads: 0,
        topDocuments: [],
        analyticsData: []
    });
    const [recentDocs, setRecentDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [analyticsRes, docsRes] = await Promise.all([
                api.get('/analytics'),
                api.get('/documents?limit=6') // Fetching all for now, optimize later if needed
            ]);
            
            setStats(analyticsRes.data);
            setRecentDocs(docsRes.data.slice(0, 6)); // Client side slice for recent 6
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await api.get('/documents/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'documentos_edudocs.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert('Erro ao baixar CSV.');
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-[#121617] text-[#121617] dark:text-white font-display">
            <Header 
                title="Dashboard" 
                startContent={null} 
            />

            <main className="pb-32 w-full max-w-7xl mx-auto">
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-800 shadow-sm transition-transform hover:scale-[1.02]">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total de Arquivos</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-[#121617] dark:text-white text-2xl font-bold">{stats.totalDocuments}</p>
                            <span className="text-[#078836] text-xs font-bold">+0%</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-800 shadow-sm transition-transform hover:scale-[1.02]">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Uploads Recentes</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-[#121617] dark:text-white text-2xl font-bold">+{stats.recentUploads}</p>
                            <span className="text-[#078836] text-xs font-bold">Últimas 24h</span>
                        </div>
                    </div>
                     {/* Placeholder for other stats */}
                     <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-800 shadow-sm transition-transform hover:scale-[1.02]">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Downloads</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-[#121617] dark:text-white text-2xl font-bold">{stats.totalDownloads}</p>
                            <span className="text-[#078836] text-xs font-bold">+12%</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-800 shadow-sm opacity-50">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Armazenamento</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-[#121617] dark:text-white text-2xl font-bold">--</p>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-2 sticky top-[73px] z-30 bg-background-light/95 dark:bg-[#121617]/95 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2 flex-1">
                        <label className="flex flex-col flex-1 h-12">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
                                <div className="text-gray-400 flex border-none bg-white dark:bg-[#1e2329] items-center justify-center pl-4">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input className="flex w-full border-none bg-white dark:bg-[#1e2329] text-[#121617] dark:text-white focus:ring-0 h-full placeholder:text-gray-400 px-3 text-base font-normal leading-normal" placeholder="Buscar documentos..." />
                            </div>
                        </label>
                    </div>
                     <button onClick={handleExportCSV} className="flex h-12 px-4 items-center justify-center bg-green-600 text-white rounded-xl shadow-sm hover:bg-green-700 transition-colors gap-2 font-bold text-sm">
                        <span className="material-symbols-outlined">download</span>
                        Exportar CSV
                    </button>
                </div>

                <div className="flex items-center justify-between px-4 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                    <h3 className="text-[#121617] dark:text-white text-lg font-bold tracking-tight">Documentos Recentes</h3>
                     <button onClick={() => navigate('/admin/documents')} className="text-[var(--primary-color)] text-sm font-bold hover:underline">Ver Todos</button>
                </div>

                <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? <p className="text-gray-400 col-span-3 text-center py-10">Carregando...</p> : recentDocs.length === 0 ? (
                        <p className="text-gray-400 col-span-3 text-center py-10">Nenhum documento recente.</p>
                    ) : recentDocs.map((doc, idx) => (
                        <div key={doc.id} className="bg-white dark:bg-[#1e2329] p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-[var(--primary-color)] transition-all">
                            <div className="flex gap-4">
                                <div className={`size-12 rounded-lg bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center shrink-0`}>
                                    <span className="material-symbols-outlined">{doc.type === 'PDF' ? 'picture_as_pdf' : 'description'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-base font-bold text-[#121617] dark:text-white truncate pr-2">{doc.title}</h4>
                                        <div className="flex gap-1">
                                            <button className="text-gray-400 hover:text-[var(--primary-color)]" onClick={() => navigate('/admin/documents')}><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                        </div>
                                    </div>
                                    <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                        <p><span className="font-semibold">Autor:</span> {doc.author?.name || 'Desconhecido'}</p>
                                        <p><span className="font-semibold">Data:</span> {new Date(doc.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2 mt-3 items-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${doc.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {doc.status === 'published' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                        {doc.sector && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                                                {doc.sector.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-4 pt-8 pb-2 border-b border-gray-100 dark:border-gray-800 mb-4 mt-4">
                     <h3 className="text-[#121617] dark:text-white text-lg font-bold tracking-tight">Mais Baixados</h3>
                </div>

                <div className="px-4 mb-10">
                    <div className="flex flex-col bg-white dark:bg-[#1e2329] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 gap-2 p-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-[#2c333a]/50">
                            <div className="col-span-8 md:col-span-10 text-[10px] font-bold uppercase tracking-wider text-gray-400">Documento</div>
                            <div className="col-span-4 md:col-span-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Downloads</div>
                        </div>
                        {stats.topDocuments && stats.topDocuments.length > 0 ? (stats.topDocuments as any[]).map((doc, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 p-4 items-center border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-[#2c333a] transition-colors">
                                <div className="col-span-8 md:col-span-10 flex flex-col">
                                    <span className="text-sm font-bold text-[#121617] dark:text-white truncate">{doc.title}</span>
                                    {doc.sector && <span className="text-[10px] text-gray-400">{doc.sector.name}</span>}
                                </div>
                                <div className="col-span-4 md:col-span-2 text-right">
                                    <span className="text-sm font-bold text-[var(--primary-color)]">{doc.downloads}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400 text-sm">Nenhum dado disponível.</div>
                        )}
                    </div>
                </div>
            </main>

            <div className="fixed bottom-24 right-6 md:right-12 z-40 flex flex-col items-center gap-2">
                <span className="bg-white dark:bg-[#1e2329] px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm border border-gray-100 dark:border-gray-800 dark:text-gray-300">Novo Documento</span>
                <button onClick={() => navigate('/admin/upload')} className="flex size-14 items-center justify-center text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-transform" style={{ backgroundColor: 'var(--primary-color)' }}>
                    <span className="material-symbols-outlined text-[32px]">add</span>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;