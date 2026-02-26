import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/api/api';

import Header from '../components/Header';

const AdminUpload: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const [sectors, setSectors] = useState<any[]>([]);
    const [modalities, setModalities] = useState<any[]>([]);

    const [selectedType, setSelectedType] = useState('PDF');
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedModality, setSelectedModality] = useState('');

    useEffect(() => {
        fetchClassifications();
    }, []);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!title || !file) {
            alert('Por favor, preencha o título e selecione um arquivo.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);
        formData.append('type', selectedType);
        if (selectedSector) formData.append('sectorId', selectedSector);
        if (selectedModality) formData.append('modalityId', selectedModality);

        setLoading(true);

        try {
            await api.post('/documents', formData);
            alert('Documento publicado com sucesso!');
            navigate('/admin/documents');
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Erro ao publicar documento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f9fafa] dark:bg-[#121617] text-[#121617] dark:text-white font-public transition-colors">
            <Header title="EduDocs" showBack={true} />

            <main className="w-full max-w-3xl mx-auto pb-32">
                <div className="px-4 pt-6 pb-2">
                    <h1 className="text-2xl font-bold tracking-tight text-[#121617] dark:text-white">Novo Documento</h1>
                    <p className="text-sm text-[#667d85] dark:text-gray-400 mt-1">Preencha os dados abaixo para publicar no repositório.</p>
                </div>

                <div className="px-4 py-4 mt-2">
                    <h3 className="text-[#121617] dark:text-white tracking-tight text-lg font-bold leading-tight mb-4 border-l-4 border-[var(--primary-color)] dark:border-[#5ab2d1] pl-3">Informações Básicas</h3>
                    <div className="space-y-4">
                        <label className="flex flex-col w-full">
                            <p className="text-[#121617] dark:text-gray-200 text-sm font-semibold leading-normal pb-2">Título do Documento</p>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} className="flex w-full rounded-lg text-[#121617] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 dark:focus:ring-[#5ab2d1]/50 border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#1e2329] h-14 placeholder:text-[#667d85] dark:placeholder:text-gray-500 p-[15px] text-base font-normal transition-all" placeholder="Ex: Plano de Ensino 2024" type="text" />
                        </label>
                        <label className="flex flex-col w-full">
                            <p className="text-[#121617] dark:text-gray-200 text-sm font-semibold leading-normal pb-2">Descrição</p>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="flex w-full rounded-lg text-[#121617] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 dark:focus:ring-[#5ab2d1]/50 border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#1e2329] min-h-32 placeholder:text-[#667d85] dark:placeholder:text-gray-500 p-[15px] text-base font-normal resize-none transition-all" placeholder="Breve resumo do conteúdo para facilitar a busca..."></textarea>
                        </label>
                    </div>
                </div>

                <div className="px-4 py-4 mt-2">
                    <h3 className="text-[#121617] dark:text-white tracking-tight text-lg font-bold leading-tight mb-4 border-l-4 border-[var(--primary-color)] dark:border-[#5ab2d1] pl-3">Classificação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex flex-col w-full">
                            <p className="text-[#121617] dark:text-gray-200 text-sm font-semibold leading-normal pb-2">Tipo de Arquivo</p>
                            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="flex w-full rounded-lg text-[#121617] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 dark:focus:ring-[#5ab2d1]/50 border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#1e2329] h-14 p-[15px] text-base font-normal transition-all appearance-none">
                                <option value="PDF">PDF</option>
                                <option value="DOCX">DOCX</option>
                                <option value="XLSX">XLSX</option>
                                <option value="PPT">PPT</option>
                            </select>
                        </label>
                        <label className="flex flex-col w-full">
                            <p className="text-[#121617] dark:text-gray-200 text-sm font-semibold leading-normal pb-2">Setor</p>
                            <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)} className="flex w-full rounded-lg text-[#121617] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 dark:focus:ring-[#5ab2d1]/50 border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#1e2329] h-14 p-[15px] text-base font-normal transition-all appearance-none">
                                <option value="">Selecione...</option>
                                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </label>
                        <label className="flex flex-col w-full">
                            <p className="text-[#121617] dark:text-gray-200 text-sm font-semibold leading-normal pb-2">Modalidade</p>
                            <select value={selectedModality} onChange={(e) => setSelectedModality(e.target.value)} className="flex w-full rounded-lg text-[#121617] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)]/50 dark:focus:ring-[#5ab2d1]/50 border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#1e2329] h-14 p-[15px] text-base font-normal transition-all appearance-none">
                                <option value="">Selecione...</option>
                                {modalities.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </label>
                    </div>
                </div>

                {/* Additional metadata fields excluded for brevity but can be added back */}

                <div className="px-4 py-4">
                    <h3 className="text-[#121617] dark:text-white tracking-tight text-lg font-bold leading-tight mb-4 border-l-4 border-[var(--primary-color)] dark:border-[#5ab2d1] pl-3">Arquivo</h3>
                    <div className="relative group cursor-pointer">
                        <div className="flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#1e2329] hover:bg-[var(--primary-color)]/5 dark:hover:bg-[#5ab2d1]/5 hover:border-[var(--primary-color)] dark:hover:border-[#5ab2d1] transition-all p-6 text-center">
                            <div className="size-14 bg-[var(--primary-color)]/10 dark:bg-[#5ab2d1]/10 rounded-full flex items-center justify-center mb-3 text-[var(--primary-color)] dark:text-[#5ab2d1]">
                                <span className="material-symbols-outlined text-3xl">upload_file</span>
                            </div>
                            <p className="text-sm font-bold text-[#121617] dark:text-white mb-1">{file ? file.name : 'Selecione ou arraste o documento'}</p>
                            <p className="text-xs text-[#667d85] dark:text-gray-400">PDF, DOCX ou XLSX (Máx. 25MB)</p>
                        </div>
                        <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" onChange={handleFileChange} />
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121617] border-t border-[#dce2e4] dark:border-gray-800 p-4 pb-8 safe-area-inset-bottom flex flex-col gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                    <button onClick={handleUpload} disabled={loading} className="w-full text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 hover:opacity-90" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <span className="material-symbols-outlined">publish</span>
                        {loading ? 'Publicando...' : 'Publicar Documento'}
                    </button>
                    <button onClick={() => navigate('/admin')} className="w-full bg-transparent border border-[#dce2e4] dark:border-gray-700 text-[#121617] dark:text-white font-semibold h-12 rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-gray-50 dark:hover:bg-[#1e2329]">
                        <span className="material-symbols-outlined">save</span>
                        Salvar como Rascunho
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AdminUpload;