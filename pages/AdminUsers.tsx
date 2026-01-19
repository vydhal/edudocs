import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/api/api';

import Header from '../components/Header';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status?: string; // Add status to model if needed, or derive it
    createdAt: string;
}

const AdminUsers: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Erro ao excluir usuário');
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="bg-[#f0f2f4] dark:bg-[#121617] min-h-screen text-[#121617] dark:text-white font-manrope transition-colors">
            <Header 
                title="EduDocs" 
                startContent={
                    <span className="material-symbols-outlined text-[#2f8598] dark:text-[#5ab2d1]" style={{ fontSize: '32px' }}>description</span>
                }
            />
                <div className="px-4 pb-4">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-[#121617] dark:text-white text-lg font-bold">Gestão de Usuários</h2>
                        <button onClick={() => navigate('/admin/users/new')} className="flex items-center justify-center rounded-lg h-10 px-4 text-white text-sm font-bold shadow-sm active:scale-95 transition-transform hover:opacity-90" style={{ backgroundColor: 'var(--primary-color)' }}>
                            <span>+ Novo Usuário</span>
                        </button>
                    </div>
                </div>


            <main className="pb-20 w-full max-w-7xl mx-auto">
                {/* Search and Filters mocked for now */}
                <div className="px-4 py-4">
                    <label className="flex flex-col w-full">
                        <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-[#1e2329] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="text-gray-400 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input className="w-full border-none bg-transparent focus:ring-0 text-[#121617] dark:text-white placeholder:text-gray-400 px-3 text-base" placeholder="Buscar por nome ou e-mail..." />
                        </div>
                    </label>
                </div>

                <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? <p className="text-center text-gray-500 dark:text-gray-400">Carregando usuários...</p> : users.map(user => (
                        <div key={user.id} className="bg-white dark:bg-[#1e2329] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-3">
                                    <div className="h-12 w-12 rounded-full bg-[#2f8598]/20 flex items-center justify-center text-[#2f8598] dark:text-[#5ab2d1] font-bold text-xl">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-[#121617] dark:text-white font-bold text-base">{user.name}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">{user.email}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 text-xs font-bold rounded-full uppercase bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">Ativo</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="bg-[#f0f2f4] dark:bg-[#121617] p-2 rounded-lg">
                                    <p className="text-[10px] uppercase text-gray-400 font-bold">Criado em</p>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-[#f0f2f4] dark:bg-[#121617] p-2 rounded-lg">
                                    <p className="text-[10px] uppercase text-gray-400 font-bold">Nível</p>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{user.role}</p>
                                </div>
                            </div>
                            <div className="flex border-t border-gray-50 dark:border-gray-800 pt-3 gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-[#2f8598]/10 text-[#2f8598] dark:text-[#5ab2d1] font-bold text-sm hover:bg-[#2f8598]/20">
                                    <span className="material-symbols-outlined text-[18px]">edit</span> Editar
                                </button>
                                <button onClick={() => handleDelete(user.id)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30">
                                    <span className="material-symbols-outlined text-[18px]">delete</span> Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminUsers;