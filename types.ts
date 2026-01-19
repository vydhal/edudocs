export interface Document {
    id: string;
    title: string;
    description?: string;
    sector: string;
    type: 'PDF' | 'DOCX' | 'XLSX' | 'VIDEO';
    date: string;
    version: string;
    size?: string;
    status: 'Publicado' | 'Rascunho' | 'Interno' | 'Em Revisão' | 'Inativo';
    thumbnail?: string;
    color?: string; // For sector badges
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'Administrador' | 'Editor';
    sector: string;
    status: 'Ativo' | 'Inativo';
}

export interface AnalyticsData {
    day: string;
    downloads: number;
}