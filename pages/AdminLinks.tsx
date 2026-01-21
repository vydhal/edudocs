import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { linkService, Link } from '../src/api/linkService';

const AdminLinks: React.FC = () => {
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');

    const fetchLinks = async () => {
        try {
            const data = await linkService.getAll({ limit: 1000 });
            setLinks(data.links || []);
        } catch (error) {
            console.error('Error fetching links:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await linkService.create(newName, newUrl);
            setIsModalOpen(false);
            setNewName('');
            setNewUrl('');
            fetchLinks();
        } catch (error) {
            alert('Erro ao criar link');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este link?')) {
            try {
                await linkService.delete(id);
                fetchLinks();
            } catch (error) {
                alert('Erro ao excluir link');
            }
        }
    };

    return (
        <div className="bg-[#f0f2f4] dark:bg-[#121617] min-h-screen text-[#121617] dark:text-white font-manrope transition-colors">
            <Header 
                title="EduDocs" 
                startContent={
                    <span className="material-symbols-outlined text-[var(--primary-color)] dark:text-[var(--primary-color)]" style={{ fontSize: '32px' }}>link</span>
                }
            />
            
            <div className="px-4 pb-4">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-[#121617] dark:text-white text-lg font-bold">Gerenciamento de Links Úteis</h2>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center rounded-lg h-10 px-4 text-white text-sm font-bold shadow-sm active:scale-95 transition-transform hover:opacity-90" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <span>+ Novo Link</span>
                    </button>
                </div>
            </div>

            <main className="pb-20 w-full max-w-7xl mx-auto px-4">
                {loading ? <p className="text-center text-gray-500">Carregando...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {links.map(link => (
                            <div key={link.id} className="bg-white dark:bg-[#1e2329] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-lg text-[#121617] dark:text-white break-words">{link.name}</h3>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[var(--primary-color)] hover:underline text-xs bg-[var(--primary-color)]/10 px-2 py-1 rounded-full">
                                            Acessar
                                        </a>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm break-all line-clamp-2">{link.url}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                                    <button onClick={() => handleDelete(link.id)} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[18px]">delete</span> Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1e2329] rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-[#121617] dark:text-white">Novo Link</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome da Ferramenta</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-3 py-2 text-[#121617] dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="Ex: Portal do Aluno"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">URL (Link)</label>
                                <input 
                                    type="url" 
                                    required 
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-3 py-2 text-[#121617] dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                                    value={newUrl}
                                    onChange={e => setNewUrl(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <button type="submit" className="w-full py-3 rounded-lg text-white font-bold text-lg shadow-md hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: 'var(--primary-color)' }}>
                                Salvar Link
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLinks;
