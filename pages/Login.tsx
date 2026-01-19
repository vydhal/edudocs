import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/api/api';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    useEffect(() => {
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
        fetchSettings();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await api.post('/auth/login', { email, password });
            const user = response.data.user;
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(user));
            
            if (user.role === 'EDITOR') {
                navigate('/admin/documents');
            } else {
                navigate('/admin');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Falha ao realizar login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f1f2f4] dark:bg-[#121617] min-h-screen flex flex-col items-center justify-center p-4 transition-colors">
            <div className="w-full max-w-[400px] mb-8 flex flex-col items-center">
                <div className="flex items-center justify-center mb-4">
                    {logoUrl ? (
                        <img src={`http://localhost:3001${logoUrl}`} alt="Logo" className="h-24 object-contain" />
                    ) : (
                        <div className="bg-[var(--primary-color)] rounded-xl p-3 shadow-lg">
                            <span className="material-symbols-outlined text-white text-4xl">menu_book</span>
                        </div>
                    )}
                </div>
                <h1 className="text-[#121417] dark:text-white text-3xl font-bold tracking-tight text-center">EduDocs</h1>
                <p className="text-[#677583] dark:text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">Secretaria de Educação</p>
                
                <button 
                    onClick={() => navigate('/')}
                    className="mt-6 flex items-center gap-2 text-[var(--primary-color)] hover:opacity-80 font-semibold text-sm transition-opacity"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Voltar para Home
                </button>
            </div>

            <div className="w-full max-w-[400px] bg-white dark:bg-[#1e2329] rounded-xl shadow-xl border border-[#dde0e4] dark:border-gray-800 overflow-hidden">
                <div className="w-full h-32 bg-[var(--primary-color)]/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-[var(--primary-color)]/20 rounded-full"></div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[var(--primary-color)]/10 rounded-full"></div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-[#121417] dark:text-white text-xl font-bold px-4">Login Administrativo</h2>
                        <div className="h-1 w-12 bg-[var(--primary-color)] mx-auto mt-2 rounded-full"></div>
                    </div>
                </div>
                
                <form className="p-6 space-y-4" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            {error === 'Invalid credentials' ? 'Credenciais inválidas' : error}
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#121417] dark:text-gray-200 text-sm font-semibold leading-normal">E-mail</label>
                        <div className="flex w-full items-stretch rounded-lg group">
                            <div className="flex items-center justify-center pl-4 bg-white dark:bg-[#121617] border border-[#dde0e4] dark:border-gray-700 border-r-0 rounded-l-lg text-[#677583] dark:text-gray-400">
                                <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                            </div>
                            <input 
                                className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-0 focus:ring-0 border border-[#dde0e4] dark:border-gray-700 bg-white dark:bg-[#121617] text-[#121417] dark:text-white focus:border-[var(--primary-color)] h-12 placeholder:text-[#677583] dark:placeholder:text-gray-600 p-3 rounded-l-none text-base font-normal" 
                                placeholder="nome@edu.gov.br" 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[#121417] dark:text-gray-200 text-sm font-semibold leading-normal">Senha</label>
                        <div className="flex w-full items-stretch rounded-lg group relative">
                            <div className="flex items-center justify-center pl-4 bg-white dark:bg-[#121617] border border-[#dde0e4] dark:border-gray-700 border-r-0 rounded-l-lg text-[#677583] dark:text-gray-400">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </div>
                            <input 
                                className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-0 focus:ring-0 border border-[#dde0e4] dark:border-gray-700 bg-white dark:bg-[#121617] text-[#121417] dark:text-white focus:border-[#2966a3] h-12 placeholder:text-[#677583] dark:placeholder:text-gray-600 p-3 rounded-l-none text-base font-normal" 
                                placeholder="Digite sua senha" 
                                type={showPassword ? "text" : "password"} 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[var(--primary-color)]"
                            >
                                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input className="w-4 h-4 rounded border-[#dde0e4] text-[var(--primary-color)] focus:ring-[var(--primary-color)]/50 transition-colors" type="checkbox" />
                            <span className="text-sm text-[#677583] dark:text-gray-400 font-medium group-hover:text-[var(--primary-color)]">Lembrar de mim</span>
                        </label>
                        <button type="button" className="text-sm font-semibold text-[var(--primary-color)] hover:underline underline-offset-4" onClick={() => alert('Entre em contato com o suporte para redefinir sua senha.')}>Esqueci minha senha</button>
                    </div>

                    <button className="w-full bg-[var(--primary-color)] hover:opacity-90 text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2" type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : (
                            <>
                                <span>Acessar</span>
                                <span className="material-symbols-outlined text-[20px]">login</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="bg-gray-50 dark:bg-[#1a1f24] p-4 text-center border-t border-[#dde0e4] dark:border-gray-700">
                    <p className="text-xs text-[#677583] dark:text-gray-400">
                        Problemas de acesso? Contate o <a className="text-[#2966a3] font-semibold hover:underline" href="https://wa.me/+5583991185518" target="_blank" rel="noopener noreferrer">suporte técnico</a>.
                    </p>
                </div>
            </div>

            <div className="fixed top-12 left-12 opacity-10 pointer-events-none -z-10">
                <span className="material-symbols-outlined text-[120px] text-[var(--primary-color)]">school</span>
            </div>
            <p className="mt-8 text-xs text-[#677583] dark:text-gray-500 font-medium">
                © 2024 EduDocs · Gestão de Documentos v1.0.4
            </p>
        </div>
    );
};

export default Login;