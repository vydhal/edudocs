import React from 'react';
import { getAssetUrl } from '../src/api/api';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
    type: 'public' | 'admin' | 'editor' | 'none';
}

const BottomNav: React.FC<BottomNavProps> = ({ type }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initials = user.name ? user.name.substring(0, 2).toUpperCase() : 'U';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;
    const activeStyle = { color: 'var(--primary-color)' };
    const inactiveClass = "text-[#667d85] dark:text-gray-400 md:text-gray-500 hover:text-gray-900 dark:hover:text-white";
    const inactiveAdminClass = "text-gray-400 md:text-gray-500 hover:text-gray-900 dark:hover:text-white";

    // Desktop classes to be applied on md: breakpoint
    const navContainerClass = "absolute bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-white/90 dark:bg-[#1e2329]/90 backdrop-blur-md border-t md:border-t-0 md:border-b border-gray-200 dark:border-gray-800 pb-safe pb-4 md:pb-0 md:h-24 z-50 transition-all";
    const navContentClass = "flex justify-around md:justify-between items-center pt-3 md:pt-0 md:h-full max-w-7xl mx-auto md:px-6";
    const navButtonClass = "flex flex-col md:flex-row items-center gap-1 group transition-colors md:px-5 md:py-3.5 md:gap-3 md:rounded-2xl md:hover:bg-gray-100 md:dark:hover:bg-gray-800";
    const navTextClass = "text-[10px] md:text-lg font-bold uppercase tracking-tighter md:normal-case md:tracking-normal md:font-semibold";

    const [logoUrl, setLogoUrl] = React.useState('');

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Using relative path /api for consistency or full URL if in dev
                const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api')}/settings`);
                const data = await res.json();
                if (data && data.logoUrl) {
                    setLogoUrl(data.logoUrl);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const Logo = () => (
        <div className="hidden md:flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            {logoUrl ? (
                <img src={getAssetUrl(logoUrl)} alt="EduDocs Logo" className="h-10 w-auto object-contain" />
            ) : (
                <div className="bg-[var(--primary-color)] text-white p-1 rounded-xl flex items-center justify-center size-12 shadow-sm shadow-[var(--primary-color)]/20">
                    <span className="material-symbols-outlined text-3xl">archive</span>
                </div>
            )}
            <span className="text-[#121617] dark:text-white text-3xl font-extrabold tracking-tight">EduDocs</span>
        </div>
    );

    const ProfileMenu = () => (
        <div className="hidden md:flex items-center gap-5">
            <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                {user.avatarUrl ? (
                     <img 
                        src={getAssetUrl(user.avatarUrl)} 
                        alt="Profile" 
                        className="size-10 rounded-full object-cover shadow-md border-2 border-white dark:border-gray-700"
                    />
                ) : (
                    <div className="size-10 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center font-bold text-base shadow-md">{initials}</div>
                )}
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300 max-w-[140px] truncate">{user.name?.split(' ')[0] || 'Usuário'}</span>
                <span className="material-symbols-outlined text-gray-400 text-xl">expand_more</span>
            </button>
        </div>
    );

    const renderNavItems = () => {
        if (type === 'public') {
            return (
                <>
                    <button onClick={() => navigate('/')} className={`${navButtonClass} ${!isActive('/') && inactiveClass}`} style={isActive('/') ? activeStyle : {}}>
                        <span className="material-symbols-outlined">home</span>
                        <span className={navTextClass}>Início</span>
                    </button>
                    {/* Documentos link removed as requested */}
                    <button onClick={() => navigate('/login')} className={`${navButtonClass} ${inactiveClass}`}>
                        <span className="material-symbols-outlined">login</span>
                        <span className={navTextClass}>Login</span>
                    </button>
                </>
            );
        }

        if (type === 'admin') {
            return (
                <>
                    <button onClick={() => navigate('/admin')} className={`${navButtonClass} ${!isActive('/admin') && inactiveAdminClass}`} style={isActive('/admin') ? activeStyle : {}}>
                        <span className="material-symbols-outlined fill-1">grid_view</span>
                        <span className={navTextClass}>Dashboard</span>
                    </button>
                    <button onClick={() => navigate('/admin/documents')} className={`${navButtonClass} ${!isActive('/admin/documents') && inactiveAdminClass}`} style={isActive('/admin/documents') ? activeStyle : {}}>
                        <span className="material-symbols-outlined fill-1">folder_open</span>
                        <span className={navTextClass}>Documentos</span>
                    </button>
                    <button onClick={() => navigate('/admin/users')} className={`${navButtonClass} ${!isActive('/admin/users') && inactiveAdminClass}`} style={isActive('/admin/users') ? activeStyle : {}}>
                        <span className="material-symbols-outlined group-hover:text-primary">group</span>
                        <span className={navTextClass}>Usuários</span>
                    </button>
                    <button onClick={() => navigate('/admin/links')} className={`${navButtonClass} ${!isActive('/admin/links') && inactiveAdminClass}`} style={isActive('/admin/links') ? activeStyle : {}}>
                        <span className="material-symbols-outlined group-hover:text-primary">link</span>
                        <span className={navTextClass}>Links</span>
                    </button>
                    <button onClick={() => navigate('/admin/settings')} className={`${navButtonClass} ${!isActive('/admin/settings') && inactiveAdminClass}`} style={isActive('/admin/settings') ? activeStyle : {}}>
                        <span className="material-symbols-outlined group-hover:text-primary">settings</span>
                        <span className={navTextClass}>Config</span>
                    </button>
                </>
            );
        }

        if (type === 'editor') {
            return (
                <>
                    <button onClick={() => navigate('/')} className={`${navButtonClass} text-gray-400`}>
                        <span className="material-symbols-outlined">home</span>
                        <span className={navTextClass}>Início</span>
                    </button>
                    <button onClick={() => navigate('/admin/documents')} className={navButtonClass} style={activeStyle}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                        <span className={navTextClass}>Meus Docs</span>
                    </button>
                    <button onClick={() => navigate('/admin/links')} className={`${navButtonClass} ${!isActive('/admin/links') && inactiveAdminClass}`} style={isActive('/admin/links') ? activeStyle : {}}>
                        <span className="material-symbols-outlined group-hover:text-primary">link</span>
                        <span className={navTextClass}>Links</span>
                    </button>
                    <button onClick={() => navigate('/admin/settings')} className={`${navButtonClass} ${!isActive('/admin/settings') && inactiveAdminClass}`} style={isActive('/admin/settings') ? activeStyle : {}}>
                        <span className="material-symbols-outlined">account_circle</span>
                        <span className={navTextClass}>Perfil</span>
                    </button>
                </>
            );
        }
        return null;
    };

    return (
        <>
            <nav className={navContainerClass}>
                <div className={navContentClass}>
                    <Logo />
                    <div className="flex justify-around md:justify-center w-full md:w-auto md:gap-4">
                        {renderNavItems()}
                    </div>

                    {user.name && <ProfileMenu />}
                </div>
            </nav>

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

export default BottomNav;