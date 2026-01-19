import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../src/api/api';

interface Document {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    version: number;
    fileUrl: string;
    author: {
        name: string;
    };
}

const DocumentVersions: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchVersions = async () => {
        try {
            const response = await api.get(`/documents/${id}/versions`);
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching versions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchVersions();
        }
    }, [id]);

    const handleNewVersion = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const currentDoc = documents[0]; // Assuming first is latest or at least getting title from first
            if (!currentDoc) return;

            const formData = new FormData();
            formData.append('title', currentDoc.title);
            formData.append('description', currentDoc.description);
            formData.append('parentId', currentDoc.id.toString());
            formData.append('file', file);

            setUploading(true);
            try {
                await api.post('/documents', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Nova versão enviada com sucesso!');
                fetchVersions();
            } catch (error) {
                console.error('Error uploading version:', error);
                alert('Erro ao enviar nova versão.');
            } finally {
                setUploading(false);
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Carregando versões...</div>;
    }

    if (documents.length === 0) {
        return <div className="p-8 text-center text-gray-500">Documento não encontrado.</div>;
    }

    const currentVersion = documents[0]; // Assuming descending order

    return (
        <div className="bg-[#fafafa] dark:bg-[#121617] min-h-screen text-[#121617] dark:text-white font-public transition-colors">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#121617]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center px-4 h-16 justify-between max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-[#121617] dark:text-white">arrow_back_ios_new</span>
                        </button>
                        <h1 className="text-lg font-bold tracking-tight">Versões do Documento</h1>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-[#121617] dark:text-gray-400">info</span>
                    </button>
                </div>
            </header>

            <main className="max-w-md mx-auto pb-20">
                <div className="px-4 pt-6 pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold leading-tight mb-1">{currentVersion.title}</h2>
                            <p className="text-[#667d85] dark:text-gray-400 text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">description</span>
                                {currentVersion.description}
                            </p>
                        </div>
                        <div className="bg-[#2898bd]/10 dark:bg-[#5ab2d1]/10 text-[#2898bd] dark:text-[#5ab2d1] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            v{currentVersion.version} - Atual
                        </div>
                    </div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-800 mx-4 mb-6"></div>

                <div className="relative px-4 space-y-6">
                    <div className="absolute left-7 top-0 bottom-0 width-[2px] bg-gray-200 dark:bg-gray-800 z-0" style={{width: '2px', left: '28px'}}></div>

                    {documents.map((doc, index) => (
                        <div key={doc.id} className="relative pl-10">
                            <div className={`absolute left-0 top-1 w-[26px] h-[26px] rounded-full border-4 border-white dark:border-[#121617] z-10 flex items-center justify-center ${index === 0 ? 'bg-[#2898bd]' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                {index === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                            <div className="bg-white dark:bg-[#1e2329] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-sm font-bold ${index === 0 ? 'text-[#2898bd] dark:text-[#5ab2d1]' : 'text-gray-500 dark:text-gray-400'}`}>VERSÃO {doc.version}</span>
                                        <span className="text-xs text-[#667d85] dark:text-gray-500">{new Date(doc.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm font-medium mb-3">{doc.description}</p>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                            <span className="material-symbols-outlined text-sm text-gray-500 dark:text-gray-400">person</span>
                                        </div>
                                        <span className="text-xs text-[#667d85] dark:text-gray-500">Por <strong>{doc.author?.name}</strong></span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <a href={`http://localhost:3001${doc.fileUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 h-10 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#2c333a] transition-colors dark:text-gray-300">
                                            <span className="material-symbols-outlined text-lg">download</span>
                                            Baixar
                                        </a>
                                        {index !== 0 && (
                                            <button className="flex items-center justify-center gap-2 h-10 rounded-lg bg-[#2898bd] text-white text-sm font-semibold hover:bg-[#2898bd]/90 transition-colors shadow-md">
                                                <span className="material-symbols-outlined text-lg">history</span>
                                                Restaurar
                                            </button>
                                        )}
                                        {index === 0 && (
                                              <button className="flex items-center justify-center gap-2 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm font-semibold cursor-not-allowed" disabled>
                                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                                Ativo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#121617]/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 py-4 z-40">
                <div className="max-w-md mx-auto relative group">
                     {uploading ? (
                        <div className="w-full bg-gray-300 dark:bg-gray-700 text-white dark:text-gray-300 h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                            Enviando...
                        </div>
                     ) : (
                        <>
                            <button className="w-full bg-[#2898bd] text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2898bd]/20 hover:bg-[#2898bd]/90">
                                <span className="material-symbols-outlined">upload_file</span>
                                Subir Nova Versão
                            </button>
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleNewVersion}
                            />
                        </>
                     )}
                    <div className="h-5"></div>
                </div>
            </div>
        </div>
    );
};

export default DocumentVersions;