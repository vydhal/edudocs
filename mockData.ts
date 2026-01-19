import { Document, User, AnalyticsData } from './types';

export const documents: Document[] = [
    {
        id: '1',
        title: 'Guia Pedagógico de Inclusão Escolar',
        sector: 'PEDAGÓGICO',
        type: 'PDF',
        date: '15/10/2023',
        version: '2024.1',
        status: 'Publicado',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2E2QM96IDXs7kOICjGboXcVo9j2-DG2zLiFvoGZnHfHrogIoYjxb0wHhiht4Jhn5JHbb1Xt2XY8SlLn9q3mDwqztGNrA01hMMt1NZQ_QS-Whh6hFtOAeeyYcQTapZObA9jPXHCNVfBwQLRTDovdqi5TLk5ksLm5l52p5O6kymqiCbtM3vexW8jMT09ga3plV93YEkaIcCsXEj9udzvyTB2piqS_v0b_rq6nEPPThCHXGFFdQ5Xub4x9_oa9hK8aSL2rN8fecgyuJl',
        color: 'bg-primary'
    },
    {
        id: '2',
        title: 'Manual de Prestação de Contas PDDE',
        sector: 'FINANCEIRO',
        type: 'PDF',
        date: '02/11/2023',
        version: '3.2',
        status: 'Publicado',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR4oo-OaqeD_7pXD2bk4aWOq2QZcdSaDaSxtZvx7mwf36P6mWXJZtliWCFxSAJ9zd5WCA-Gr93LqdmhnntbjxMfwbUiaYMUvD7TginhgOo0qJwmOiUIKExq-IBLCDYdxTU5j7prHZyQ2ODwOQLhxGVid3a3GOX9IwhVonh19p1Faw0zFbqRuH15mxrhuSRHNPnpV9OcD2Cazgx8DmbrUC_pHb6FYBK9mal9ObD1nJQ33dtLx_4E7gjoegZ7ldsINyerousyWEXec_s',
        color: 'bg-amber-700'
    },
    {
        id: '3',
        title: 'Matrizes Curriculares EJA 2024',
        sector: 'EJA',
        type: 'PDF',
        date: '28/10/2023',
        version: 'Edição Especial',
        status: 'Publicado',
        thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLe-IUDytORJJAGjjQlNOYl2IAP7UyazMzjp1ySmT1g5mP3f_vy1FM5Ch9rvG34ckyIh7GfQAUOFeKn2udRqe8FecRAK8LQLwXXZP2LYuXlwq7e-bizlL9NOm8wvLdpy8PXNOqA4KQBLYIsQ95PMiBR92I5njaP26-DW_pI-jGMdYhnLAe86_ZQnzlmJhRL12DoV5qJs_5H3MxGBhgJgTfBMui0gKaPvhp-VjwJvqCYAz6jjw3KCb_WdbU9zMgbVGHyvgDM5gkrk9s',
        color: 'bg-emerald-700'
    },
    {
        id: '4',
        title: 'Diretrizes Curriculares 2024',
        sector: 'STEM',
        type: 'PDF',
        date: 'Há 2h',
        version: '1.0',
        status: 'Publicado',
        size: '4.2 MB'
    },
    {
        id: '5',
        title: 'Memorando Adm - Q3',
        sector: 'Interno',
        type: 'DOCX',
        date: 'Ontem',
        version: '1.0',
        status: 'Rascunho',
        size: '1.1 MB'
    },
    {
        id: '6',
        title: 'Política de Saúde (Draft)',
        sector: 'Saúde',
        type: 'PDF',
        date: 'Há 3 dias',
        version: '0.9',
        status: 'Em Revisão',
        size: '8.9 MB'
    },
    {
        id: '7',
        title: 'Regimento Interno 2024',
        sector: 'ADM',
        type: 'PDF',
        date: 'Hoje, 14:30',
        version: 'v3',
        status: 'Publicado',
        size: '2.4 MB'
    }
];

export const users: User[] = [
    {
        id: '1',
        name: 'Ana Silva',
        email: 'ana.silva@educacao.gov.br',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiX5vzTcomM0VyEibbTLvu3bewtiS9JYEpupnTdL77AElFVFkvJ3KgAXHZ82qFcZVpP5fcdFV5c123Fa9U2HjenMGn3GAADXCvod5RJEI7758xS6wvMGbzDheOiZ_bdgHIRnHEkvtT_JuwFjxzWhG0sDNCC559CBRmORvUI_UzJ-rsdF5BQYUr8BHWmRL4lQxYz1Ipr3gOX9SlM4krIf2Z1jax-ug4M9ISREEI4iGb5DWdFkmAAFF0mssRdGUCHbnzltOhvSBoKP7z',
        role: 'Administrador',
        sector: 'Recursos Humanos',
        status: 'Ativo'
    },
    {
        id: '2',
        name: 'Ricardo Lima',
        email: 'ricardo.lima@educacao.gov.br',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7p9rcazAgeFJ5mgziuk5Y0WGbgKVQ77w4I7IUYlXNx5z-i1-oflbVmcpo9_e6SoxjD0JzL0NE8dFaKhfEkTz-JTUkRy9PpZ9f1dIZaI6Yo5c13p72cY0Y4SSdv-8EbfMt3ktWxJl-ch1S130F1fhq2bpZ8kaOcM08sV_5hsEw-hLHR4Q2pi3MnpVl7z8HzlpLDFiUjF6X7CXMmV28XZwlq4qb1noLClghy43O0VumuZ9v6YF3XOyQVVBLyUt8YNvhfmE2_RYP1gFD',
        role: 'Editor',
        sector: 'Pedagógico',
        status: 'Ativo'
    },
    {
        id: '3',
        name: 'Marina Torres',
        email: 'marina.torres@educacao.gov.br',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMAz3-_7GKA2cPXLTf_zHRDxWk3rcSNKeY8-wuu0I_v8x3pSqefQ8aT7rAhki5iMZ4wSvjjBSFXgBzc4G763fOfCbsaW6nOt3iEmBbPAEFQEdiokwQ5j0-vWGoi5T_BrzAhPeh8f-lUfxvsKwUS6kqTdfwFtwS_uHqd3FKiNEsm_IZrOd1aidkgTIcl3pn5dnsm0zDSYVyo_uvbiFtYUeHEG7ukvS7MUTHlebSp2yI6tWE3DbrXrYjCKAc28e4F5hD2RvLa0lUxDYC',
        role: 'Editor',
        sector: 'Financeiro',
        status: 'Inativo'
    }
];

export const analyticsData: AnalyticsData[] = [
    { day: '01', downloads: 1200 },
    { day: '05', downloads: 1900 },
    { day: '10', downloads: 1500 },
    { day: '15', downloads: 2800 },
    { day: '20', downloads: 3200 },
    { day: '25', downloads: 2100 },
    { day: '30', downloads: 3450 },
];