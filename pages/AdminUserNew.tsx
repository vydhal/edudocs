import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/api/api';

import Header from '../components/Header';

const AdminUserNew: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'EDITOR' // Default value
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não conferem');
            return;
        }
        
        setLoading(true);
        setError('');

        try {
            await api.post('/users', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role.toUpperCase()
            });
            alert('Usuário criado com sucesso!');
            navigate('/admin/users');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Erro ao criar usuário');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f6f7f8] dark:bg-[#121617] min-h-screen text-[#121617] dark:text-white font-public transition-colors">
            <Header title="Novo Usuário" showBack={true} />

            <main className="flex-1 overflow-y-auto pb-10 w-full max-w-3xl mx-auto">
                <div className="px-4 pt-6">
                    <h3 className="text-[#121617] dark:text-white tracking-tight text-2xl font-bold leading-tight">Cadastro de Usuário</h3>
                    <p className="text-[#4a5568] dark:text-gray-400 text-sm font-normal leading-normal mt-2">
                        Preencha as informações abaixo para criar um novo acesso administrativo no sistema <span className="text-[#1f7693] dark:text-[#5ab2d1] font-semibold">EduDocs</span>.
                    </p>
                </div>

                <form className="mt-6 space-y-6 px-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}
                    <div className="bg-white dark:bg-[#1e2329] rounded-xl p-4 shadow-sm border border-gray-50 dark:border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-[#1f7693] dark:text-[#5ab2d1] text-xl">person</span>
                            <h3 className="text-[#121617] dark:text-white text-md font-bold leading-tight tracking-tight">Dados Pessoais</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-col w-full">
                                <p className="text-[#121617] dark:text-gray-200 text-sm font-medium pb-1.5 ml-1">Nome Completo</p>
                                <input name="name" onChange={handleChange} value={formData.name} className="flex w-full rounded-lg border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#121617] text-[#121617] dark:text-white focus:ring-2 focus:ring-[#1f7693]/20 focus:border-[#1f7693] h-12 placeholder:text-[#667d85] dark:placeholder:text-gray-600 px-4 text-base" placeholder="Ex: Maria Silva" type="text" />
                                <p className="text-[#667d85] dark:text-gray-500 text-[11px] mt-1 ml-1">Nome completo sem abreviações.</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <p className="text-[#121617] dark:text-gray-200 text-sm font-medium pb-1.5 ml-1">E-mail Institucional</p>
                                <input name="email" onChange={handleChange} value={formData.email} className="flex w-full rounded-lg border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#121617] text-[#121617] dark:text-white focus:ring-2 focus:ring-[#1f7693]/20 focus:border-[#1f7693] h-12 placeholder:text-[#667d85] dark:placeholder:text-gray-600 px-4 text-base" placeholder="usuario@educacao.gov.br" type="email" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col">
                                    <p className="text-[#121617] dark:text-gray-200 text-sm font-medium pb-1.5 ml-1">Setor</p>
                                    <select className="flex w-full rounded-lg border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#121617] text-[#121617] dark:text-white focus:ring-2 focus:ring-[#1f7693]/20 focus:border-[#1f7693] h-12 px-4 text-sm">
                                        <option value="">Selecionar</option>
                                        <option value="rh">RH</option>
                                        <option value="financeiro">Financeiro</option>
                                        <option value="pedagogico">Pedagógico</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[#121617] dark:text-gray-200 text-sm font-medium pb-1.5 ml-1">Cargo</p>
                                    <input className="flex w-full rounded-lg border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#121617] text-[#121617] dark:text-white focus:ring-2 focus:ring-[#1f7693]/20 focus:border-[#1f7693] h-12 placeholder:text-[#667d85] dark:placeholder:text-gray-600 px-4 text-sm" placeholder="Ex: Analista" type="text" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1e2329] rounded-xl p-4 shadow-sm border border-gray-50 dark:border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-[#1f7693] dark:text-[#5ab2d1] text-xl">shield</span>
                            <h3 className="text-[#121617] dark:text-white text-md font-bold leading-tight tracking-tight">Segurança e Acesso</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <p className="text-[#121617] dark:text-gray-200 text-sm font-medium pb-2 ml-1">Nível de Permissão</p>
                                <div className="grid grid-cols-2 gap-2 bg-[#f6f7f8] dark:bg-[#121617] p-1 rounded-lg">
                                    <label className="cursor-pointer">
                                        <input className="peer hidden" name="role" type="radio" value="editor" checked={formData.role === 'editor'} onChange={handleChange} />
                                        <div className="flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all peer-checked:bg-white dark:peer-checked:bg-[#2c333a] peer-checked:text-[#1f7693] dark:peer-checked:text-[#5ab2d1] peer-checked:shadow-sm text-[#667d85] dark:text-gray-500">
                                            Editor
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input className="peer hidden" name="role" type="radio" value="admin" checked={formData.role === 'admin'} onChange={handleChange} />
                                        <div className="flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all peer-checked:bg-white dark:peer-checked:bg-[#2c333a] peer-checked:text-[#1f7693] dark:peer-checked:text-[#5ab2d1] peer-checked:shadow-sm text-[#667d85] dark:text-gray-500">
                                            Admin
                                        </div>
                                    </label>
                                </div>
                                <p className="text-[#667d85] dark:text-gray-500 text-[11px] mt-2 ml-1">Admins podem gerenciar outros usuários.</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <p className="text-[#121617] dark:text-gray-200 text-sm font-medium pb-1.5 ml-1">Senha</p>
                                <div className="relative">
                                    <input name="password" onChange={handleChange} value={formData.password} className="flex w-full rounded-lg border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#121617] text-[#121617] dark:text-white focus:ring-2 focus:ring-[#1f7693]/20 focus:border-[#1f7693] h-12 px-4 pr-10 text-base" placeholder="••••••••" type="password" />
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">visibility</span>
                                </div>
                                <p className="text-[#667d85] dark:text-gray-500 text-[11px] mt-1 ml-1">Mínimo de 8 caracteres, incluindo números.</p>
                            </div>
                            <div className="flex flex-col w-full">
                                <p className="text-[#121617] dark:text-gray-200 text-sm font-medium pb-1.5 ml-1">Confirmar Senha</p>
                                <input name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} className="flex w-full rounded-lg border border-[#dce2e4] dark:border-gray-700 bg-white dark:bg-[#121617] text-[#121617] dark:text-white focus:ring-2 focus:ring-[#1f7693]/20 focus:border-[#1f7693] h-12 px-4 text-base" placeholder="••••••••" type="password" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <button className="w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 hover:opacity-90" style={{ backgroundColor: 'var(--primary-color)' }} type="button" onClick={handleSubmit} disabled={loading}>
                            <span className="material-symbols-outlined text-xl">person_add</span>
                            {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
                        </button>
                        <button className="w-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-[#667d85] dark:text-gray-400 font-medium py-3 rounded-lg transition-all text-center" type="button" onClick={() => navigate('/admin/users')}>
                            Cancelar
                        </button>
                    </div>
                </form>

                <div className="mt-8 px-6 text-center">
                    <p className="text-[11px] text-[#667d85] dark:text-gray-500 leading-relaxed">
                        Este sistema é monitorado e de uso exclusivo da Secretaria de Educação. O compartilhamento de senhas é proibido.
                    </p>
                    <div className="mt-4 flex justify-center">
                        <div className="bg-[#1f7693]/10 px-3 py-1 rounded-full">
                            <span className="text-[10px] font-bold text-[#1f7693] dark:text-[#5ab2d1] uppercase tracking-widest">EduDocs Admin Portal</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminUserNew;