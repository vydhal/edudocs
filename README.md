# EduDocs - Sistema de Gestão Documental para Educação

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
</div>

## 📖 Sobre a Plataforma

**EduDocs** é uma plataforma moderna projetada para centralizar e facilitar a gestão de documentos oficiais da Secretaria de Educação. O sistema serve como um **Portal da Transparência** intuitivo para o público e uma ferramenta robusta de **Gestão Documental (GED)** para a administração pública.

A plataforma foi desenvolvida com foco em agilidade, segurança e experiência do usuário, suportando desde o upload e versionamento de arquivos até a busca avançada por cidadãos.

---

## 🚀 Funcionalidades Principais

### 🏛️ Para o Público (Portal da Transparência)
*   **Interface Moderna**: Landing page informativa e responsiva.
*   **Busca Inteligente**: Pesquisa rápida por títulos, conteúdo ou metadados de documentos.
*   **Filtros Dinâmicos**: Filtragem precisa por **Setor** (Pedagógico, RH, Jurídico), **Modalidade** e **Tipo de Arquivo** (PDF, DOCX, etc.).
*   **Visualização e Download**: Acesso direto aos documentos sem necessidade de cadastro.
*   **PWA (Progressive Web App)**: O sistema pode ser instalado como um aplicativo nativo em desktops e smartphones, permitindo acesso rápido e cache offline.

### ⚙️ Para Gestores (Painel Administrativo)
*   **Dashboard Intuitivo**: Visão geral com cards de métricas, gráficos de uploads recentes e listagem rápida.
*   **Gestão de Documentos Avançada**:
    *   Upload de arquivos (PDF, DOC, XLS, PPT).
    *   **Versionamento Automático**: Edite documentos mantendo todo o histórico de versões anteriores para auditoria.
    *   Classificação por Setores e Modalidades.
*   **Configurações de White Label**: Personalize a **Logo** e as cores do sistema diretamente pelo painel para se adequar à identidade visual da instituição.
*   **Gestão de Usuários**: Controle de acesso com perfis de Administrador e Editor.
*   **Relatórios**: Exportação de dados de documentos em CSV.

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza uma stack moderna e performática:

### Frontend
*   **React.js (Vite)**: Para uma interface super rápida e reativa.
*   **Tailwind CSS**: Para estilização utility-first, garantindo design responsivo e consistente.
*   **React Router DOM**: Para navegação SPA (Single Page Application).
*   **PWA Plugin**: Para capacidades de instalação e offline.

### Backend
*   **Node.js + Express**: API RESTful robusta.
*   **Prisma ORM**: Camada de acesso a dados moderna e segura.
*   **SQLite**: Banco de dados relacional (fácil configuração e backup).
*   **Multer**: Gerenciamento de uploads de arquivos.

---

## 🏁 Como Rodar Localmente

Siga os passos abaixo para executar o projeto em sua máquina:

### Pré-requisitos
*   Node.js (v18 ou superior)
*   Git

### Passo a Passo

#### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/edudocs.git
cd edudocs
```

#### 2. Configurar e Rodar o Backend
```bash
cd backend

# Instalar dependências
npm install

# Configurar o Banco de Dados (SQLite)
npx prisma migrate dev --name init

# (Opcional) Popular com dados iniciais se houver seed
# npm run seed

# Iniciar o servidor
npm run dev
```
*O backend rodará em `http://localhost:3001`*

#### 3. Configurar e Rodar o Frontend
Em um novo terminal, na raiz do projeto:

```bash
# Instalar dependências
npm install

# Iniciar a aplicação
npm run dev
```
*O frontend rodará em `http://localhost:3000` (ou outra porta disponível)*

## 🔐 Acesso Padrão (Sugestão para Dev)
Caso tenha rodado o seed ou criado um usuário manualmente:
*   **Email**: `admin@edu.gov.br`
*   **Senha**: `123456`

---

## 📱 Mobile & PWA
Para testar a funcionalidade PWA:
1.  Acesse a aplicação pelo navegador (Chrome/Edge/Safari).
2.  Busque pelo ícone de "Instalar EduDocs" na barra de endereço ou no menu de opções.
3.  O app será instalado como um aplicativo nativo no seu dispositivo.

---

Desenvolvido para modernizar a educação. 📚✨
