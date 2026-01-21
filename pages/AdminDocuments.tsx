import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/api/api';

import Header from '../components/Header';

interface Document {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    author: {
        name: string;
    };
    version: number;
    type: string;
    sectorId?: number;
    modalityId?: number;
    fileUrl?: string; // Optional for edit
}

const AdminDocuments: React.FC = () => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit Form State
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editType, setEditType] = useState('PDF');
    const [editSector, setEditSector] = useState('');
    const [editModality, setEditModality] = useState('');
    const [editFile, setEditFile] = useState<File | null>(null);

    // Filter Data
    const [sectors, setSectors] = useState<any[]>([]);
    const [modalities, setModalities] = useState<any[]>([]);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents?paginate=false');
            // Filter out archived documents unless we want to show history here? Use backend filter normally.
            // Backend returns everything by default. We should probably filter on frontend or backend.
            // For now, let's filter purely 'published' or 'draft' on frontend display or keep all.
            // Usually "My Documents" shows current active ones.
            // Backend update created new active and archived old.
            // Let's filter to show only status != 'archived'
            setDocuments(response.data.filter((d: any) => d.status !== 'archived'));
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClassifications = async () => {
        try {
            const [sectorsRes, modalitiesRes] = await Promise.all([
                api.get('/classifications/sectors'),
                api.get('/classifications/modalities')
            ]);
            setSectors(sectorsRes.data);
            setModalities(modalitiesRes.data);
        } catch (error) {
            console.error('Error fetching classifications:', error);
        }
    };

    useEffect(() => {
        fetchDocuments();
        fetchClassifications();
    }, []);

    const handleDeleteClick = (doc: Document) => {
        setSelectedDoc(doc);
        setShowDeleteModal(true);
    };

    const handleEditClick = (doc: Document) => {
        setSelectedDoc(doc);
        setEditTitle(doc.title);
        setEditDescription(doc.description);
        setEditType(doc.type || 'PDF');
        setEditSector(doc.sectorId ? String(doc.sectorId) : '');
        setEditModality(doc.modalityId ? String(doc.modalityId) : '');
        setEditFile(null);
        setShowEditModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedDoc) return;
        try {
            await api.delete(`/documents/${selectedDoc.id}`);
            fetchDocuments();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Erro ao excluir documento');
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoc) return;

        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('description', editDescription);
        formData.append('type', editType);
        if (editSector) formData.append('sectorId', editSector);
        if (editModality) formData.append('modalityId', editModality);
        if (editFile) formData.append('file', editFile);

        try {
            await api.post(`/documents/${selectedDoc.id}/version`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Documento atualizado com sucesso (Nova versão criada)!');
            setShowEditModal(false);
            fetchDocuments();
        } catch (error) {
            console.error('Error updating document:', error);
            alert('Erro ao atualizar documento.');
        }
    };

    return (
        <div className="min-h-screen bg-[#f9fafb] dark:bg-[#121617] text-[#121617] dark:text-white font-display pb-24 transition-colors">
            <main className="w-full max-w-7xl mx-auto px-4 pt-6 pb-24">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#121617] dark:text-white">Meus Documentos</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie seu repositório pessoal de arquivos.</p>
                </div>

                {/* Stats mocked for now, can be dynamic later */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-[#1e2329] shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-[var(--primary-color)] dark:text-[var(--primary-color)]">upload_file</span>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Total de Envios</p>
                            <p className="text-[#121617] dark:text-white text-3xl font-extrabold leading-none mt-1">{documents.length}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-[#1e2329] shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-green-500 dark:text-green-400">check_circle</span>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Documentos Ativos</p>
                            <p className="text-[#121617] dark:text-white text-3xl font-extrabold leading-none mt-1">{documents.filter(d => d.status === 'published').length}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-[var(--primary-color)] dark:group-focus-within:text-[var(--primary-color)] transition-colors">search</span>
                        </div>
                        <input className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1e2329] border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[var(--primary-color)]/20 dark:focus:ring-[var(--primary-color)]/20 shadow-sm transition-all placeholder:text-gray-400 text-[#121617] dark:text-white" placeholder="Filtrar por título ou status..." type="text" />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-[#121617] dark:text-white text-md font-bold leading-tight">Arquivos Recentes / Ativos</h3>
                    <button className="text-[var(--primary-color)] dark:text-[var(--primary-color)] text-sm font-bold flex items-center gap-1">
                        Ver Todos <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? <p className="text-center text-gray-400 col-span-3">Carregando documentos...</p> : documents
                        .filter(doc => {
                            const user = JSON.parse(localStorage.getItem('user') || '{}');
                            // If Editor, only show own documents
                            if (user.role === 'EDITOR') {
                                return doc.author.name === user.name;
                            }
                            return true;
                        })
                        .map(doc => (
                        <div key={doc.id} className="bg-white dark:bg-[#1e2329] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-[var(--primary-color)] transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-1 rounded-md text-[0.7rem] uppercase font-bold tracking-wider ${doc.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                    {doc.status === 'published' ? 'Publicado' : 'Rascunho'}
                                </span>
                                <div className="flex items-center gap-2">
                                     <span className="text-gray-400 text-xs font-medium">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                     <button className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-md transition-colors" onClick={() => handleDeleteClick(doc)}>
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                            <h4 className="text-[#121617] dark:text-white text-base font-bold mb-3 pr-2">{doc.title}</h4>
                            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-xs mb-4">
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    <span>{doc.author?.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">history</span>
                                    <span>v{doc.version}.0</span>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
                                <button onClick={() => handleEditClick(doc)} className="flex-1 bg-[var(--primary-color)] dark:bg-[var(--primary-color)] text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90">
                                    <span className="material-symbols-outlined text-sm">edit</span> Editar
                                </button>
                                <button onClick={() => navigate(`/document/${doc.id}/versions`)} className="flex-1 bg-[var(--primary-color)]/10 dark:bg-[var(--primary-color)]/20 text-[var(--primary-color)] dark:text-[var(--primary-color)] py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[var(--primary-color)]/20">
                                    <span className="material-symbols-outlined text-sm">history_edu</span> Histórico
                                </button>
                            </div>
                        </div>
                    ))}
                    {documents.length === 0 && !loading && (
                        <div className="text-center py-10 text-gray-400 col-span-3">
                            Nenhum documento encontrado.
                        </div>
                    )}
                </div>

                <div className="fixed bottom-24 right-6 md:right-12 z-40">
                    <button onClick={() => navigate('/admin/upload')} className="size-14 md:size-16 rounded-full text-white shadow-lg shadow-black/10 flex items-center justify-center hover:scale-105 transition-transform hover:opacity-90" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <span className="material-symbols-outlined text-3xl md:text-4xl">add</span>
                    </button>
                </div>
            </main>

            {/* Delete Modal */}
            {showDeleteModal && selectedDoc && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-white dark:bg-[#1e2329] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800">
                        {/* ... Delete Modal Content ... */}
                        <div className="px-6 pt-6 text-center">
                            <h3 className="text-[#131516] dark:text-white text-xl font-bold mb-2">Excluir Documento?</h3>
                             <p className="text-gray-500 mb-6">Esta ação não pode ser desfeita.</p>
                             <div className="flex gap-3">
                                 <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 rounded-xl">Cancelar</button>
                                 <button onClick={confirmDelete} className="flex-1 py-3 font-bold text-white bg-red-500 rounded-xl">Excluir</button>
                             </div>
                        </div>
                        <div className="h-6"></div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedDoc && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-lg bg-white dark:bg-[#1e2329] rounded-2xl shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1e2329] z-10">
                            <h3 className="text-xl font-bold text-[#121617] dark:text-white">Editar Documento</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-4"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Descrição / Observação</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full h-24 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] p-4 resize-none"
                                    placeholder="Adicione uma observação sobre esta versão..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                                    <select
                                        value={editType}
                                        onChange={(e) => setEditType(e.target.value)}
                                        className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-4"
                                    >
                                        <option value="PDF">PDF</option>
                                        <option value="DOCX">DOCX</option>
                                        <option value="XLSX">XLSX</option>
                                        <option value="PPT">PPT</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Setor</label>
                                    <select
                                        value={editSector}
                                        onChange={(e) => setEditSector(e.target.value)}
                                        className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-4"
                                    >
                                        <option value="">Selecione...</option>
                                        {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Modalidade</label>
                                <select
                                    value={editModality}
                                    onChange={(e) => setEditModality(e.target.value)}
                                    className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-4"
                                >
                                    <option value="">Selecione...</option>
                                    {modalities.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Substituir Arquivo (Opcional)</label>
                                <input
                                    type="file"
                                    onChange={(e) => setEditFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full p-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl"
                                />
                                <p className="text-xs text-gray-500 mt-1">Deixe em branco para manter o arquivo atual.</p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700">Cancelar</button>
                                <button type="submit" className="flex-1 py-3 font-bold text-white rounded-xl shadow-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--primary-color)' }}>Salvar Versão</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDocuments;