import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    startContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack, startContent }) => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    // Get user initials
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initials = user.name ? user.name.substring(0, 2).toUpperCase() : 'AD';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#121617]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        {showBack ? (
                            <button onClick={() => navigate(-1)} className="text-[#121617] dark:text-white">
                                <span className="material-symbols-outlined">arrow_back_ios</span>
                            </button>
                        ) : startContent ? (
                            <div className="shrink-0">{startContent}</div>
                        ) : null}
                        <h2 className="text-[#121617] dark:text-white text-lg font-bold leading-tight tracking-tight truncate pl-1">{title}</h2>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-2 md:hidden">
                        <button className="flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            <span className="material-symbols-outlined text-[22px]">notifications</span>
                        </button>
                        <button onClick={() => setShowLogoutModal(true)} className="flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden ring-2 ring-transparent hover:ring-[#1f7693] transition-all">
                            <div className="w-full h-full bg-[#1f7693] text-white flex items-center justify-center font-bold text-sm">{initials}</div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-white dark:bg-[#1e2329] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="size-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">logout</span>
                            </div>
                            <h3 className="text-[#121617] dark:text-white text-xl font-bold mb-2">Desconectar?</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Tem certeza que deseja sair da sua conta?</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-[#121617]/50 flex gap-3">
                            <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 text-[#121617] dark:text-gray-300 font-bold bg-white dark:bg-[#2c333a] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#363d45] transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleLogout} className="flex-1 py-3 text-white font-bold bg-red-500 rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-colors">
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
