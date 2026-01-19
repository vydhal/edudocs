import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserNew from './pages/AdminUserNew';
import AdminDocuments from './pages/AdminDocuments';
import AdminUpload from './pages/AdminUpload';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import DocumentVersions from './pages/DocumentVersions';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './src/components/ProtectedRoute';
import api from './src/api/api';

const Layout = ({ children, type }: { children?: React.ReactNode, type: 'public' | 'admin' | 'editor' | 'none' | 'auto' }) => {
    let navType = type;
    
    if (type === 'auto' || type === 'public') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            navType = user.role === 'EDITOR' ? 'editor' : 'admin';
        } else {
            // If type is auto (protected) and no user, standard behavior (Login redirect happens elsewhere) -> none/login
            // If type is public and no user -> public
            navType = type === 'public' ? 'public' : 'none';
        }
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-[#121617] font-public flex flex-col w-full mx-auto shadow-2xl overflow-hidden relative">
            <div className="flex-1 overflow-y-auto pb-24 md:pb-0 md:pt-28 no-scrollbar">
                {children}
            </div>
            {navType !== 'none' && <BottomNav type={navType as any} />}
        </div>
    );
};

const App: React.FC = () => {
    useEffect(() => {
        applySettings();
    }, []);

    const applySettings = async () => {
        try {
            const response = await api.get('/settings');
            if (response.data) {
                const { themeColor, darkMode } = response.data;
                
                // Apply Theme Color
                if (themeColor) {
                    document.documentElement.style.setProperty('--primary-color', themeColor);
                }

                // Apply Dark Mode
                if (darkMode === 'true') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        } catch (error) {
            console.error('Error applying settings:', error);
        }
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout type="public"><PublicHome /></Layout>} />
                <Route path="/search" element={<Layout type="public"><SearchResults /></Layout>} />
                
                {/* Auth */}
                <Route path="/login" element={<Layout type="none"><Login /></Layout>} />

                {/* Admin Routes - Protected */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<Layout type="auto"><AdminDashboard /></Layout>} />
                    <Route path="/admin/documents" element={<Layout type="auto"><AdminDocuments /></Layout>} />
                    <Route path="/admin/upload" element={<Layout type="none"><AdminUpload /></Layout>} />
                    <Route path="/admin/users" element={<Layout type="auto"><AdminUsers /></Layout>} />
                    <Route path="/admin/users/new" element={<Layout type="none"><AdminUserNew /></Layout>} />
                    <Route path="/admin/analytics" element={<Layout type="auto"><AdminAnalytics /></Layout>} />
                    <Route path="/admin/settings" element={<Layout type="auto"><AdminSettings /></Layout>} />
                    <Route path="/document/:id/versions" element={<Layout type="none"><DocumentVersions /></Layout>} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;