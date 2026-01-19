import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/api/api';

import Header from '../components/Header';

const AdminSettings: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'identity' | 'users' | 'classifications'>('identity');
    const [sectors, setSectors] = useState<any[]>([]);
    const [modalities, setModalities] = useState<any[]>([]);
    const [newSector, setNewSector] = useState('');
    const [newModality, setNewModality] = useState('');
    const [settings, setSettings] = useState({
        themeColor: '#1F7693',
        darkMode: 'false',
        logoUrl: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
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

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            if (response.data) {
                setSettings(prev => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.post('/settings', settings);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erro ao salvar configurações.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            
            try {
                const response = await api.post('/settings/logo', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setSettings(prev => ({ ...prev, logoUrl: response.data.logoUrl }));
                alert('Logo atualizada com sucesso!');
            } catch (error) {
                console.error('Error uploading logo:', error);
                alert('Erro ao fazer upload da logo.');
            }
        }
    };

    const handleColorChange = (color: string) => {
        setSettings({ ...settings, themeColor: color });
        document.documentElement.style.setProperty('--primary-color', color);
    };

    const toggleDarkMode = () => {
        const newMode = settings.darkMode === 'true' ? 'false' : 'true';
        setSettings(prev => ({ ...prev, darkMode: newMode }));
        if (newMode === 'true') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role !== 'EDITOR';

    const [profileName, setProfileName] = useState(user.name || '');
    const [profileAvatar, setProfileAvatar] = useState(user.avatarUrl || null);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);

            try {
                const response = await api.post('/users/profile/avatar', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const updatedUser = { ...user, avatarUrl: response.data.avatarUrl };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setProfileAvatar(response.data.avatarUrl);
                alert('Foto de perfil atualizada com sucesso!');
                window.location.reload(); // Reload to reflect changes in Header/Nav
            } catch (error) {
                console.error('Error uploading avatar:', error);
                alert('Erro ao atualizar foto de perfil.');
            }
        }
    };

    const handleProfileSave = async () => {
        setLoading(true);
        try {
            const response = await api.put('/users/profile', { name: profileName });
            const updatedUser = { ...user, name: response.data.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert('Perfil atualizado com sucesso!');
            window.location.reload();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erro ao atualizar perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSector = async () => {
        if (!newSector.trim()) return;
        try {
            const response = await api.post('/classifications/sectors', { name: newSector });
            setSectors([...sectors, response.data]);
            setNewSector('');
        } catch (error) {
            alert('Erro ao criar setor');
        }
    };

    const handleDeleteSector = async (id: number) => {
        if (!window.confirm('Excluir este setor?')) return;
        try {
            await api.delete(`/classifications/sectors/${id}`);
            setSectors(sectors.filter(s => s.id !== id));
        } catch (error) {
            alert('Erro ao excluir setor');
        }
    };

    const handleAddModality = async () => {
        if (!newModality.trim()) return;
        try {
            const response = await api.post('/classifications/modalities', { name: newModality });
            setModalities([...modalities, response.data]);
            setNewModality('');
        } catch (error) {
            alert('Erro ao criar modalidade');
        }
    };

    const handleDeleteModality = async (id: number) => {
        if (!window.confirm('Excluir esta modalidade?')) return;
        try {
            await api.delete(`/classifications/modalities/${id}`);
            setModalities(modalities.filter(m => m.id !== id));
        } catch (error) {
            alert('Erro ao excluir modalidade');
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#121617] text-[#121617] dark:text-white font-public">
            <Header title={isAdmin ? "Configurações e White Label" : "Meu Perfil"} showBack={true} />

            <main className="p-4 pb-32 w-full max-w-7xl mx-auto">
                {isAdmin ? (
                    <>
                        {/* ... (Admin Content omitted for brevity, keeping same logic but wrapped) ... */}
                        <div className="bg-gray-100 dark:bg-[#1e2329] p-1 rounded-xl flex mb-6 border border-gray-200 dark:border-gray-700">
                            <button 
                                onClick={() => setActiveTab('identity')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'identity' ? 'bg-white dark:bg-[#2c333a] shadow-sm text-[#121617] dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            >
                                Identidade Visual
                            </button>
                            <button 
                                onClick={() => setActiveTab('users')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'users' ? 'bg-white dark:bg-[#2c333a] shadow-sm text-[#121617] dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            >
                                Gestão de Usuários
                            </button>
                            <button 
                                onClick={() => setActiveTab('classifications')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'classifications' ? 'bg-white dark:bg-[#2c333a] shadow-sm text-[#121617] dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                            >
                                Categorias
                            </button>
                        </div>

                        {activeTab === 'identity' && (
                            <>
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Identidade Visual</h3>
                                    <div className="bg-white dark:bg-[#1a1f24] rounded-xl border border-dashed border-gray-200 dark:border-gray-600 p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[var(--primary-color)] transition-colors relative">
                                        <div className="bg-transparent p-4 rounded-xl mb-3 group-hover:scale-110 transition-transform h-24 flex items-center justify-center">
                                            {settings.logoUrl ? (
                                                <img src={`http://localhost:3001${settings.logoUrl}`} alt="Logo" className="max-h-full max-w-full object-contain" />
                                            ) : (
                                                <span className="material-symbols-outlined text-gray-400 dark:text-gray-300 text-5xl">image</span>
                                            )}
                                        </div>
                                        <h4 className="text-[#121617] dark:text-white font-bold mb-1">Upload de Logo</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">Formatos: SVG ou PNG transparente (Máx 2MB)</p>
                                        <button className="px-4 py-2 bg-[var(--primary-color)]/20 text-[var(--primary-color)] dark:text-[#5ab2d1] text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-[var(--primary-color)]/30 transition-colors pointer-events-none">
                                            <span className="material-symbols-outlined text-lg">cloud_upload</span>
                                            Fazer Upload
                                        </button>
                                        <input 
                                            type="file" 
                                            accept="image/png, image/svg+xml"
                                            onChange={handleLogoUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Configurações de Tema</h3>
                                    <div className="bg-white dark:bg-[#1a1f24] rounded-xl border border-gray-100 dark:border-gray-600 divide-y divide-gray-100 dark:divide-gray-600">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex gap-4 items-center">
                                                <div className="size-10 rounded-full bg-[var(--primary-color)] shadow-lg shadow-[var(--primary-color)]/30 ring-2 ring-white dark:ring-gray-700"></div>
                                                <div>
                                                    <h4 className="text-[#121617] dark:text-white font-bold text-sm">Seletor de Cor</h4>
                                                    <p className="text-gray-500 dark:text-gray-400 text-xs">Aplica-se a botões e links</p>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input 
                                                    type="color" 
                                                    value={settings.themeColor}
                                                    onChange={(e) => handleColorChange(e.target.value)}
                                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                                />
                                                <div 
                                                    className="size-10 rounded-md border-2 border-white dark:border-gray-600 shadow-sm"
                                                    style={{ backgroundColor: settings.themeColor }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="p-4 flex items-center justify-between">
                                            <div>
                                                <h4 className="text-[#121617] dark:text-white font-bold text-sm">Modo Escuro Automático</h4>
                                                <p className="text-gray-500 dark:text-gray-400 text-xs">Adapta a interface conforme o sistema</p>
                                            </div>
                                            <button 
                                                onClick={toggleDarkMode}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.darkMode === 'true' ? 'bg-[var(--primary-color)]' : 'bg-gray-300 dark:bg-gray-600'}`}
                                            >
                                                <div className={`absolute top-1 bottom-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.darkMode === 'true' ? 'left-7' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'users' && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Gestão de Usuários</h3>
                                <div onClick={() => navigate('/admin/users')} className="bg-white dark:bg-[#1a1f24] rounded-xl p-4 border border-gray-100 dark:border-gray-600 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2c333a] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <span className="material-symbols-outlined">group</span>
                                        </div>
                                        <div>
                                            <h4 className="text-[#121617] dark:text-white font-bold text-sm">Gerenciar Usuários</h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs">Visualizar, adicionar e editar usuários</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'classifications' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Sectors */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Setores</h3>
                                    <div className="bg-white dark:bg-[#1a1f24] rounded-xl border border-gray-100 dark:border-gray-600 p-4">
                                        <div className="flex gap-2 mb-4">
                                            <input 
                                                type="text" 
                                                placeholder="Novo Setor..." 
                                                value={newSector}
                                                onChange={(e) => setNewSector(e.target.value)}
                                                className="flex-1 h-10 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-3 text-sm text-[#121617] dark:text-white"
                                            />
                                            <button onClick={handleAddSector} className="bg-[var(--primary-color)] text-white px-3 rounded-lg hover:opacity-90">
                                                <span className="material-symbols-outlined">add</span>
                                            </button>
                                        </div>
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {sectors.map(sector => (
                                                <div key={sector.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#2c333a] rounded-lg">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{sector.name}</span>
                                                    <button onClick={() => handleDeleteSector(sector.id)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            ))}
                                            {sectors.length === 0 && <p className="text-center text-xs text-gray-400 py-2">Nenhum setor cadastrado.</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Modalities */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Modalidades</h3>
                                    <div className="bg-white dark:bg-[#1a1f24] rounded-xl border border-gray-100 dark:border-gray-600 p-4">
                                        <div className="flex gap-2 mb-4">
                                            <input 
                                                type="text" 
                                                placeholder="Nova Modalidade..." 
                                                value={newModality}
                                                onChange={(e) => setNewModality(e.target.value)}
                                                className="flex-1 h-10 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-3 text-sm text-[#121617] dark:text-white"
                                            />
                                            <button onClick={handleAddModality} className="bg-[var(--primary-color)] text-white px-3 rounded-lg hover:opacity-90">
                                                <span className="material-symbols-outlined">add</span>
                                            </button>
                                        </div>
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {modalities.map(modality => (
                                                <div key={modality.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#2c333a] rounded-lg">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{modality.name}</span>
                                                    <button onClick={() => handleDeleteModality(modality.id)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            ))}
                                            {modalities.length === 0 && <p className="text-center text-xs text-gray-400 py-2">Nenhuma modalidade cadastrada.</p>}
                                        </div>
                                    </div>
                                </div>
                             </div>
                        )}
                    </>
                ) : (
                    /* Editor / Non-Admin View */
                    <div className="flex flex-col gap-6">
                        <div className="bg-white dark:bg-[#1a1f24] rounded-xl border border-gray-100 dark:border-gray-600 p-6 flex flex-col items-center">
                            <div className="relative group cursor-pointer mb-4">
                                <div className="size-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-600 shadow-lg">
                                     {profileAvatar || user.avatarUrl ? (
                                        <img src={`http://localhost:3001${profileAvatar || user.avatarUrl}`} alt="Profile" className="w-full h-full object-cover" />
                                     ) : (
                                        <span className="material-symbols-outlined text-5xl text-gray-400">person</span>
                                     )}
                                </div>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white">camera_alt</span>
                                </div>
                                <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <h3 className="text-xl font-bold text-[#121617] dark:text-white">{user.name || 'Usuário'}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email || 'usuario@email.com'}</p>
                        </div>

                        <div className="bg-white dark:bg-[#1a1f24] rounded-xl border border-gray-100 dark:border-gray-600 p-6">
                            <h3 className="text-lg font-bold text-[#121617] dark:text-white mb-4">Informações Pessoais</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121617] px-4 text-[#121617] dark:text-white" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input type="email" defaultValue={user.email} disabled className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#121617]/50 text-gray-500 px-4 cursor-not-allowed" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-8 mb-4">
                    <button onClick={isAdmin ? handleSave : handleProfileSave} disabled={loading} className="w-full h-12 text-white font-bold rounded-xl shadow-lg shadow-black/5 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:opacity-90" style={{ backgroundColor: 'var(--primary-color)' }}>
                        <span className="material-symbols-outlined text-xl">save</span>
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;