import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../src/api/api';

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
    const [loading, setLoading] = useState(false);
    
    // Filters
    const [sectors, setSectors] = useState<any[]>([]);
    const [selectedSector, setSelectedSector] = useState(searchParams.get('sector') || '');
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');

    useEffect(() => {
        fetchClassifications();
    }, []);

    useEffect(() => {
        fetchResults();
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
            if (selectedSector) params.append('sectorId', selectedSector);
            if (selectedType) params.append('type', selectedType);

            const response = await api.get(`/documents?${params.toString()}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const val = (e.target as HTMLInputElement).value;
            navigate(`/search?q=${val}`);
        }
    };

    const clearFilters = () => {
        setSelectedSector('');
        setSelectedType('');
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col max-w-7xl mx-auto bg-[#f9f9fb] dark:bg-[#121617] md:bg-transparent md:dark:bg-transparent shadow-none md:overflow-visible font-public">
             {/* Desktop Header / Filters */}
            <div className="flex flex-col gap-4 px-4 py-8">
                <div className="flex items-center gap-4">
                     <div className="text-[#2d5a76] dark:text-blue-400 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" onClick={() => navigate('/')}>
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </div>
                    <div className="flex-1 relative max-w-2xl">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">search</span>
                        <input 
                            className="w-full h-14 bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 rounded-2xl pl-14 pr-4 text-lg focus:ring-4 focus:ring-[#2d5a76]/10 text-[#131516] dark:text-white shadow-sm" 
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
                        className="h-10 px-4 rounded-xl bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 text-[#131516] dark:text-white text-sm font-medium focus:outline-none focus:border-[#2d5a76]"
                    >
                        <option value="">Todos os Setores</option>
                        {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    <select 
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="h-10 px-4 rounded-xl bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-700 text-[#131516] dark:text-white text-sm font-medium focus:outline-none focus:border-[#2d5a76]"
                    >
                        <option value="">Todos os Tipos</option>
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="XLSX">XLSX</option>
                    </select>

                    {(selectedSector || selectedType) && (
                        <button onClick={clearFilters} className="text-[#2d5a76] dark:text-blue-400 text-sm font-bold px-3 hover:underline">
                            Limpar Filtros
                        </button>
                    )}
                </div>

                 <div className="px-1 mt-4">
                    <p className="text-[#6b7880] dark:text-gray-400 text-lg font-medium">{results.length} documentos encontrados</p>
                </div>
            </div>

            <div className="px-4 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? <div className="text-center p-4 text-gray-500 dark:text-gray-400 col-span-full">Carregando...</div> : results.map((doc, idx) => (
                    <div key={doc.id} className={`bg-white dark:bg-[#1e2329] p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex flex-col gap-4 md:gap-6 transition-all`}>
                        <div className="flex items-start gap-4">
                            <div className={`text-[#2d5a76] dark:text-blue-400 flex items-center justify-center rounded-lg md:rounded-xl bg-[#2d5a76]/10 shrink-0 size-12 md:size-16`}>
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
                            <button onClick={() => navigate(`/document/${doc.id}/versions`)} className="flex-1 flex items-center justify-center gap-2 rounded-lg md:rounded-xl h-10 md:h-12 px-4 bg-[#2d5a76]/10 text-[#2d5a76] dark:text-blue-400 text-sm md:text-base font-bold hover:bg-[#2d5a76]/20 transition-colors">
                                <span className="material-symbols-outlined text-lg md:text-xl">visibility</span>
                                Visualizar
                            </button>
                            <a href={`http://localhost:3001${doc.fileUrl}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 rounded-lg md:rounded-xl h-10 md:h-12 px-4 bg-[#2d5a76] text-white text-sm md:text-base font-bold shadow-md shadow-[#2d5a76]/20 hover:bg-[#2d5a76]/90 transition-colors">
                                <span className="material-symbols-outlined text-lg md:text-xl">download</span>
                                Baixar
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;