import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { getAssetUrl } from '../src/api/api';

interface Document {
    id: number;
    title: string;
    description: string;
    fileUrl: string;
    version: number;
    status: string;
    createdAt: string;
    sector?: { name: string };
    type?: string;
    author: {
        name: string;
    };
}

const SearchResults: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<Document[]>([]);
    const [linkResults, setLinkResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // ... user consts
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const canViewVersions = user?.role === 'ADMIN' || user?.role === 'EDITOR';
    
    // Filters
    const [sectors, setSectors] = useState<any[]>([]);
    const [selectedSector, setSelectedSector] = useState(searchParams.get('sector') || '');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');

    useEffect(() => {
        fetchClassifications();
    }, []);

    useEffect(() => {
        if (query) {
            fetchResults();
            fetchLinks();
        }
    }, [query, selectedSector, selectedType]);

    const fetchClassifications = async () => {
        try {
            const sectorsRes = await api.get('/classifications/sectors');
            setSectors(sectorsRes.data);
        } catch (error) {
            console.error('Error fetching classifications:', error);
        }
    };

    const fetchResults = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('search', query);
            params.append('status', 'published');
            // Default limit 30 for search too
            params.append('limit', '30'); 
            if (selectedSector) params.append('sectorId', selectedSector);
            if (selectedType) params.append('type', selectedType);

            const response = await api.get(`/documents?${params.toString()}`);
            setResults(response.data.documents);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLinks = async () => {
        try {
            const response = await api.get(`/links?search=${query}&limit=30`);
            setLinkResults(response.data.links);
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const val = (e.target as HTMLInputElement).value;
            navigate(`/search?q=${val}`);
        }
    };

    // ... clearFilters

    const clearFilters = () => {
        setSelectedSector('');
        setSelectedType('');
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col max-w-7xl mx-auto bg-[#f9f9fb] dark:bg-[#121617] md:bg-transparent md:dark:bg-transparent shadow-none md:overflow-visible font-public">
             {/* Desktop Header / Filters */}
            <div className="flex flex-col gap-4 px-4 py-8">
                <div className="flex items-center gap-4">
                     <div className="text-[var(--primary-color)] dark:text-blue-400 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" onClick={() => navigate('/')}>
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </div>
                    <div className="flex-1 relative max-w-2xl">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">search</span>
                        <input 
                            className="w-full h-14 bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 rounded-2xl pl-14 pr-4 text-lg focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 text-[#131516] dark:text-white shadow-sm" 
                            type="text" 
                            defaultValue={query}
                            onKeyDown={handleSearchEnter}
                            placeholder="Buscar documentos..."
                        />
                    </div>
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-3 mt-4">
                    <select 
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="h-10 px-4 rounded-xl bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 text-[#131516] dark:text-white text-sm font-medium focus:outline-none focus:border-[var(--primary-color)]"
                    >
                        <option value="">Todos os Setores</option>
                        {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    <select 
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="h-10 px-4 rounded-xl bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 text-[#131516] dark:text-white text-sm font-medium focus:outline-none focus:border-[var(--primary-color)]"
                    >
                        <option value="">Todos os Tipos</option>
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="XLSX">XLSX</option>
                    </select>

                    {(selectedSector || selectedType) && (
                        <button onClick={clearFilters} className="text-[var(--primary-color)] dark:text-blue-400 text-sm font-bold px-3 hover:underline">
                            Limpar Filtros
                        </button>
                    )}
                </div>

                 <div className="px-1 mt-4">
                    <p className="text-[#6b7880] dark:text-gray-400 text-lg font-medium">{results.length + linkResults.length} resultados encontrados</p>
                </div>
            </div>

            <div className="px-4 pb-20 space-y-8">
                {/* Links Section */}
                {linkResults.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[#121617] dark:text-white">Links Recomendados</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {linkResults.map(link => (
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
                                </div>
                            ))}
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-gray-800 mt-8"></div>
                    </div>
                )}

                {/* Documents Grid */}
                <div>
                     {linkResults.length > 0 && <h3 className="text-xl font-bold mb-4 text-[#121617] dark:text-white">Documentos</h3>}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading ? <div className="text-center p-4 text-gray-500 dark:text-gray-400 col-span-full">Carregando...</div> : results.map((doc, idx) => (
                            <div key={doc.id} className={`bg-white dark:bg-[#1e2329] p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex flex-col gap-4 md:gap-6 transition-all`}>
                                <div className="flex items-start gap-4">
                                    <div className={`text-[var(--primary-color)] dark:text-blue-400 flex items-center justify-center rounded-lg md:rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0 size-12 md:size-16`}>
                                        <span className="material-symbols-outlined text-3xl md:text-4xl">description</span>
                                    </div>
                                    <div className="flex flex-1 flex-col justify-center">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[#131516] dark:text-white text-base md:text-xl font-bold leading-tight line-clamp-2">
                                                {doc.title}
                                            </p>
                                            <span className="bg-gray-100 text-gray-600 text-[9px] md:text-xs font-black px-1.5 py-0.5 rounded-full uppercase flex items-center gap-0.5 shrink-0">
                                                {doc.type || 'DOC'}
                                            </span>
                                        </div>
                                        <p className="text-[#6b7880] dark:text-gray-400 text-xs md:text-sm mt-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs md:text-sm">calendar_today</span>
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </p>
                                        {doc.sector && (
                                            <p className="text-[#6b7880] dark:text-gray-400 text-xs md:text-sm mt-1 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs md:text-sm">domain</span>
                                                {doc.sector.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full mt-auto">
                                    {canViewVersions && (
                                        <button onClick={() => navigate(`/document/${doc.id}/versions`)} className="flex-1 flex items-center justify-center gap-2 rounded-lg md:rounded-xl h-10 md:h-12 px-4 bg-gray-100 dark:bg-gray-800 text-[var(--primary-color)] dark:text-blue-400 text-sm md:text-base font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                            <span className="material-symbols-outlined text-lg md:text-xl">visibility</span>
                                            Visualizar
                                        </button>
                                    )}
                                    <a href={getAssetUrl(doc.fileUrl)} download className="flex-1 flex items-center justify-center gap-2 rounded-lg md:rounded-xl h-10 md:h-12 px-4 bg-[var(--primary-color)] text-white text-sm md:text-base font-bold shadow-md hover:opacity-90 transition-opacity">
                                        <span className="material-symbols-outlined text-lg md:text-xl">download</span>
                                        Baixar
                                    </a>
                                </div>
                            </div>
                        ))}
                        {!loading && results.length === 0 && linkResults.length === 0 && (
                             <div className="text-center p-10 text-gray-500 dark:text-gray-400 col-span-full">
                                Nenhum resultado encontrado.
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;