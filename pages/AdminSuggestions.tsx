import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import api, { getAssetUrl } from '../src/api/api';

interface Suggestion {
    id: number;
    title: string;
    description: string;
    fileUrl: string;
    suggesterName: string;
    status: string;
    createdAt: string;
}

const AdminSuggestions: React.FC = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [sectors, setSectors] = useState<any[]>([]);
    const [modalities, setModalities] = useState<any[]>([]);

    // Modal state for approving
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
    const [approveData, setApproveData] = useState({
        title: '',
        description: '',
        sectorId: '',
        modalityId: '',
        type: 'PDF'
    });

    useEffect(() => {
        fetchSuggestions();
        fetchOptions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const res = await api.get('/suggestions');
            setSuggestions(res.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const [secRes, modRes] = await Promise.all([
                api.get('/classifications/sectors'),
                api.get('/classifications/modalities')
            ]);
            setSectors(secRes.data);
            setModalities(modRes.data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const openApproveModal = (sug: Suggestion) => {
        setCurrentSuggestion(sug);
        setApproveData({
            title: sug.title,
            description: sug.description || '',
            sectorId: '',
            modalityId: '',
            type: 'PDF'
        });
        setIsApproveOpen(true);
    };

    const handleApprove = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentSuggestion) return;
        try {
            // Create Document
            const formData = new FormData();
            formData.append('title', approveData.title);
            formData.append('description', approveData.description);
            formData.append('type', approveData.type);
            if (approveData.sectorId) formData.append('sectorId', approveData.sectorId);
            if (approveData.modalityId) formData.append('modalityId', approveData.modalityId);
            if (currentSuggestion.fileUrl) formData.append('existingFileUrl', currentSuggestion.fileUrl);

            await api.post('/documents', formData);

            // Mark suggestion as approved
            await api.put(`/suggestions/${currentSuggestion.id}/status`, { status: 'approved' });

            setIsApproveOpen(false);
            fetchSuggestions();
        } catch (err) {
            console.error(err);
            alert('Erro ao aprovar sugestão.');
        }
    };

    const handleReject = async (id: number) => {
        if (!window.confirm("Deseja rejeitar esta sugestão?")) return;
        try {
            await api.put(`/suggestions/${id}/status`, { status: 'rejected' });
            fetchSuggestions();
        } catch (err) {
            console.error(err);
            alert('Erro ao rejeitar sugestão.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja excluir Permanentemente esta sugestão?")) return;
        try {
            await api.delete(`/suggestions/${id}`);
            fetchSuggestions();
        } catch (err) {
            console.error(err);
            alert('Erro ao excluir sugestão.');
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'approved': return 'Aprovado';
            case 'rejected': return 'Rejeitado';
            default: return status;
        }
    };

    return (
        <div className="bg-[#f0f2f4] dark:bg-[#121617] min-h-screen text-[#121617] dark:text-white font-manrope transition-colors">
            <Header
                title="EduDocs"
                startContent={<span className="material-symbols-outlined text-[var(--primary-color)]" style={{ fontSize: '32px' }}>inbox</span>}
            />

            <div className="px-4 pb-4">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-[#121617] dark:text-white text-lg font-bold">Gerenciamento de Sugestões</h2>
                </div>
            </div>

            <main className="pb-20 w-full max-w-7xl mx-auto px-4">
                {loading ? <p className="text-center text-gray-500">Carregando...</p> : (
                    <div className="space-y-4">
                        {suggestions.length === 0 && <p className="text-gray-500 text-center py-10">Nenhuma sugestão encontrada.</p>}
                        {suggestions.map(s => (
                            <div key={s.id} className="bg-white dark:bg-[#1e2329] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg text-[#121617] dark:text-white">{s.title}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusStyle(s.status)}`}>
                                            {getStatusText(s.status)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">{s.description || 'Sem descrição'}</p>
                                    <div className="flex gap-4 mt-3 text-xs text-gray-400">
                                        {s.suggesterName && <span><strong className="text-gray-500 dark:text-gray-300">Por:</strong> {s.suggesterName}</span>}
                                        <span><strong className="text-gray-500 dark:text-gray-300">Em:</strong> {new Date(s.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
                                    {s.fileUrl && (
                                        <a
                                            href={getAssetUrl(s.fileUrl)}
                                            target="_blank" rel="noopener noreferrer"
                                            download
                                            className="px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">download</span> Baixar Arquivo
                                        </a>
                                    )}

                                    {s.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleReject(s.id)} className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-red-50 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">close</span> Rejeitar
                                            </button>
                                            <button onClick={() => openApproveModal(s)} className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg text-sm font-bold flex items-center gap-1 hover:opacity-90 transition-opacity">
                                                <span className="material-symbols-outlined text-[18px]">check</span> Aprovar
                                            </button>
                                        </>
                                    )}
                                    {s.status !== 'pending' && (
                                        <button onClick={() => handleDelete(s.id)} className="px-3 py-2 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Approval Modal */}
            {isApproveOpen && currentSuggestion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-[#1e2329] rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200 my-8">
                        <button onClick={() => setIsApproveOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <h3 className="text-xl font-bold mb-1 text-[#121617] dark:text-white">Aprovar Sugestão</h3>
                        <p className="text-sm text-gray-500 mb-4">Complete as informações para salvar como documento final.</p>

                        <form onSubmit={handleApprove} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                                <input
                                    type="text" required
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-3 py-2 text-[#121617] dark:text-white focus:ring-2 focus:border-transparent outline-none"
                                    value={approveData.title}
                                    onChange={e => setApproveData({ ...approveData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                                <textarea
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-3 py-2 text-[#121617] dark:text-white focus:ring-2 focus:border-transparent outline-none resize-none"
                                    rows={3}
                                    value={approveData.description}
                                    onChange={e => setApproveData({ ...approveData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Setor</label>
                                    <select
                                        required
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-3 py-2 text-[#121617] dark:text-white focus:ring-2 focus:border-transparent outline-none"
                                        value={approveData.sectorId}
                                        onChange={e => setApproveData({ ...approveData, sectorId: e.target.value })}
                                    >
                                        <option value="">Selecione...</option>
                                        {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Modalidade</label>
                                    <select
                                        required
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-3 py-2 text-[#121617] dark:text-white focus:ring-2 focus:border-transparent outline-none"
                                        value={approveData.modalityId}
                                        onChange={e => setApproveData({ ...approveData, modalityId: e.target.value })}
                                    >
                                        <option value="">Selecione...</option>
                                        {modalities.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tipo de Arquivo</label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-3 py-2 text-[#121617] dark:text-white focus:ring-2 focus:border-transparent outline-none"
                                    value={approveData.type}
                                    onChange={e => setApproveData({ ...approveData, type: e.target.value })}
                                >
                                    <option value="PDF">PDF</option>
                                    <option value="DOCX">DOCX</option>
                                    <option value="XLSX">XLSX</option>
                                    <option value="PPT">PPT</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-3 mt-2 rounded-lg text-white font-bold shadow-md hover:opacity-90 transition-opacity bg-[var(--primary-color)] flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">publish</span> Publicar Documento
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSuggestions;
