import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getAssetUrl } from '../src/api/api';

interface Document {
    id: number;
    title: string;
    description: string;
    fileUrl: string;
    version: number;
    status: string;
    createdAt: string;
    downloads: number;
    author: {
        name: string;
    };
    sector?: { name: string };
    type?: string;
}

const PublicHome: React.FC = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [links, setLinks] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'documents' | 'links'>('documents');
    
    const [docPage, setDocPage] = useState(1);
    const [docTotalPages, setDocTotalPages] = useState(1);
    const [linkPage, setLinkPage] = useState(1);
    const [linkTotalPages, setLinkTotalPages] = useState(1);
    
    // Filters
    const [sectors, setSectors] = useState<any[]>([]);
    const [modalities, setModalities] = useState<any[]>([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedModality, setSelectedModality] = useState('');
    const [selectedType, setSelectedType] = useState('');
    
    const [logoUrl, setLogoUrl] = useState('');

    useEffect(() => {
        fetchClassifications();
        fetchSettings();
    }, []);

    useEffect(() => {
        fetchLinks();
    }, [linkPage]);

    useEffect(() => {
        fetchDocuments();
    }, [selectedSector, selectedModality, selectedType, docPage]);

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

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            if (response.data && response.data.logoUrl) {
                setLogoUrl(response.data.logoUrl);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const fetchLinks = async () => {
        try {
            const response = await api.get(`/links?page=${linkPage}&limit=30`);
            setLinks(response.data.links);
            setLinkTotalPages(response.data.pages);
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('status', 'published');
            params.append('page', String(docPage));
            params.append('limit', '30');
            if (selectedSector) params.append('sectorId', selectedSector);
            if (selectedModality) params.append('modalityId', selectedModality);
            if (selectedType) params.append('type', selectedType);

            const response = await api.get(`/documents?${params.toString()}`);
            setDocuments(response.data.documents);
            setDocTotalPages(response.data.pages);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/search?q=${search}`);
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLogged = !!localStorage.getItem('token');
    const userInitials = user.name ? user.name.substring(0, 2).toUpperCase() : 'US';

    return (
        <div className="bg-[#f9fafa] dark:bg-[#121617] min-h-screen text-[#121617] dark:text-white font-public transition-colors duration-200">


            {/* Hero Section */}
            <section id="inicio" className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--primary-color)]/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        Transparência e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color)] brightness-125">Acesso Rápido</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                        Bem-vindo ao portal oficial de documentos da Secretaria de Educação. 
                        Encontre editais, portarias, resoluções e outros arquivos importantes de forma simples e ágil.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mb-16 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color)] rounded-2xl opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 blur transition-opacity"></div>
                        <div className="relative flex items-center bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-2xl gap-3">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 ml-3 text-xl">search</span>
                            <input 
                                type="text"
                                placeholder="Busque por editais, resoluções..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                                className="flex-1 bg-transparent border-none text-[#121617] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 h-10 px-3 text-base"
                            />
                            <button onClick={() => navigate(`/search?q=${search}`)} className="bg-[var(--primary-color)] hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-opacity">
                                Pesquisar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="sobre" className="py-16 bg-white dark:bg-[#1a1f24]/50 border-y border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-2xl bg-[#f9fafa] dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 hover:border-[var(--primary-color)]/50 transition-colors">
                        <div className="w-12 h-12 bg-[var(--primary-color)]/10 dark:bg-[var(--primary-color)]/20 text-[var(--primary-color)] rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-2xl">folder_open</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[#121617] dark:text-white">Centralização</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Todos os documentos oficiais reunidos em um único lugar seguro e organizado.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#f9fafa] dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 hover:border-[var(--primary-color)]/50 transition-colors">
                        <div className="w-12 h-12 bg-[var(--primary-color)]/10 dark:bg-[var(--primary-color)]/20 text-[var(--primary-color)] rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-2xl">history</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[#121617] dark:text-white">Histórico</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Acompanhe as versões e atualizações dos arquivos com total transparência.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#f9fafa] dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 hover:border-[var(--primary-color)]/50 transition-colors">
                        <div className="w-12 h-12 bg-[var(--primary-color)]/10 dark:bg-[var(--primary-color)]/20 text-[var(--primary-color)] rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-2xl">lock</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[#121617] dark:text-white">Confiabilidade</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Fontes oficiais e integridade garantida pela Secretaria de Educação.</p>
                    </div>
                </div>
            </section>

            {/* Content Section (Tabs) */}
            <section id="conteudo" className="py-12 px-4 max-w-7xl mx-auto min-h-[600px]">
                
                {/* Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="bg-gray-100 dark:bg-[#1e2329] p-1.5 rounded-2xl flex gap-2">
                        <button 
                            onClick={() => setActiveTab('documents')}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'documents' ? 'bg-white dark:bg-[#2c333a] text-[var(--primary-color)] shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            Documentos
                        </button>
                        <button 
                            onClick={() => setActiveTab('links')}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'links' ? 'bg-white dark:bg-[#2c333a] text-[var(--primary-color)] shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            Links Úteis
                        </button>
                    </div>
                </div>

                {activeTab === 'documents' ? (
                    <>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold mb-2 text-[#121617] dark:text-white">Acervo Digital</h2>
                                <p className="text-gray-500 dark:text-gray-400">Filtrar documentos por categoria</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <div className="relative min-w-[180px]">
                                <select 
                                    value={selectedSector} 
                                    onChange={(e) => setSelectedSector(e.target.value)}
                                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 text-[#121617] dark:text-white text-sm focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
                                >
                                    <option value="">Todos os Setores</option>
                                    {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">expand_more</span>
                            </div>

                            <div className="relative min-w-[180px]">
                                <select 
                                    value={selectedModality} 
                                    onChange={(e) => setSelectedModality(e.target.value)}
                                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 text-[#121617] dark:text-white text-sm focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
                                >
                                    <option value="">Todas as Modalidades</option>
                                    {modalities.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">expand_more</span>
                            </div>

                            <div className="relative min-w-[150px]">
                                <select 
                                    value={selectedType} 
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 text-[#121617] dark:text-white text-sm focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)]"
                                >
                                    <option value="">Todos os Tipos</option>
                                    <option value="PDF">PDF</option>
                                    <option value="DOCX">DOCX</option>
                                    <option value="XLSX">XLSX</option>
                                    <option value="PPT">PPT</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">expand_more</span>
                            </div>
                        </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {loading ? (
                        <p className="text-gray-500 col-span-3 text-center py-10">Carregando documentos...</p>
                    ) : documents.length === 0 ? (
                        <div className="col-span-3 text-center py-20 bg-white dark:bg-[#1e2329] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                            <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-5xl mb-4">folder_off</span>
                            <p className="text-gray-500 dark:text-gray-400">Nenhum documento encontrado.</p>
                        </div>
                    ) : (
                        documents.map(doc => (
                            <div key={doc.id} className="bg-white dark:bg-[#1e2329] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:border-[var(--primary-color)]/50 transition-colors group flex flex-col justify-between h-full shadow-sm dark:shadow-none">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                        <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                            {doc.type || 'DOC'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#121617] dark:text-white mb-2 leading-snug group-hover:text-[var(--primary-color)] transition-colors">{doc.title}</h3>
                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                                        {doc.sector && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">domain</span> {doc.sector.name}</span>}
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> {new Date(doc.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                                    <a href={getAssetUrl(doc.fileUrl)} download className="flex-1 bg-[var(--primary-color)] hover:opacity-90 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity">
                                        <span className="material-symbols-outlined text-lg">download</span>
                                        Baixar
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                {/* Documents Pagination */}
                {docTotalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        <button 
                            onClick={() => setDocPage(p => Math.max(1, p - 1))}
                            disabled={docPage === 1}
                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1e2329] text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 font-bold text-gray-600 dark:text-gray-400">Página {docPage} de {docTotalPages}</span>
                        <button 
                            onClick={() => setDocPage(p => Math.min(docTotalPages, p + 1))}
                            disabled={docPage === docTotalPages}
                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1e2329] text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Próxima
                        </button>
                    </div>
                )}
                    </>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-[#121617] dark:text-white">Links Úteis</h2>
                            <p className="text-gray-500 dark:text-gray-400">Ferramentas e acessos rápidos recomendados pela Secretaria.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {links.length === 0 ? (
                                <div className="col-span-3 text-center py-20 bg-white dark:bg-[#1e2329] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-5xl mb-4">link_off</span>
                                    <p className="text-gray-500 dark:text-gray-400">Nenhum link encontrado.</p>
                                </div>
                            ) : (
                                links.map(link => (
                                    <div key={link.id} className="bg-white dark:bg-[#1e2329] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-[var(--primary-color)]/50 transition-colors group shadow-sm dark:shadow-none">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-[var(--primary-color)]/10 text-[var(--primary-color)] flex items-center justify-center">
                                                <span className="material-symbols-outlined text-2xl">link</span>
                                            </div>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-[var(--primary-color)] hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                                                Acessar <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            </a>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#121617] dark:text-white mb-2 group-hover:text-[var(--primary-color)] transition-colors">{link.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 break-all line-clamp-2 mb-4 font-mono bg-gray-50 dark:bg-black/20 p-2 rounded-lg">{link.url}</p>
                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">event</span>
                                            Adicionado em {new Date(link.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Links Pagination */}
                        {linkTotalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <button 
                                    onClick={() => setLinkPage(p => Math.max(1, p - 1))}
                                    disabled={linkPage === 1}
                                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1e2329] text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Anterior
                                </button>
                                <span className="px-4 py-2 font-bold text-gray-600 dark:text-gray-400">Página {linkPage} de {linkTotalPages}</span>
                                <button 
                                    onClick={() => setLinkPage(p => Math.min(linkTotalPages, p + 1))}
                                    disabled={linkPage === linkTotalPages}
                                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1e2329] text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-white dark:bg-[#0f1213] py-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
                <p>&copy; 2026 Inova Seduc. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default PublicHome;