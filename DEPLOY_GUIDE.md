# Guia de Deploy V4: VPS com Traefik Pré-instalado

Este guia é específico para implantar a aplicação em um ambiente **Swarm** que já possui o Traefik rodando e a rede externa `SimpliSoft`.

---

## 🌎 Passo 1: DNS

Certifique-se de que o domínio `edudocs.simplisoft.com.br` aponta para o IP do Manager/Cluster.

---

## 🐳 Passo 2: Stack no Portainer

Como o Traefik já existe, removemos ele da stack e apenas conectamos os serviços à rede pública `SimpliSoft`.

1.  Crie uma nova Stack (ou atualize a existente).
2.  Use o modo **Upload** para subir o arquivo `docker-compose.yml`.

---

## 🔐 Passo 3: Criar Usuário Admin (Primeiro Acesso)

Como o banco de dados é novo, ele vem vazio. Você precisa rodar o comando de "seed" para criar o usuário administrador.

1.  No Portainer, vá em **Containers**.
2.  Localize o container do backend (algo como `edudocs_backend...`).
3.  Clique no ícone de **Console** (>_) desse container.
4.  Clique em **Connect** (pode deixar `bin/bash` ou `sh` como padrão).
5.  No terminal que abrir, digite:
    ```bash
    npx prisma db seed
    ```
6.  Se aparecer o log `{ user: ... }`, o usuário foi criado.

### Credenciais Padrão
*   **Email**: `admin@edudocs.com`
*   **Senha**: `admin123`

> **Nota**: Após logar, altere sua senha imediatamente na tela de Perfil ou Configurações.

---

## 🔄 Fluxo de Atualização (CI/CD Manual)

Para atualizar a aplicação com novas alterações do código, siga os passos abaixo:

### 1. Build e Push da Imagem (Na sua máquina local)

Abra o terminal na raiz do projeto (onde está o `Dockerfile`) e execute:

```bash
# 1. Construir a nova imagem do Frontend
docker build -t vydhal/edudocs-frontend:latest .

# 2. Enviar para o Docker Hub
docker push vydhal/edudocs-frontend:latest
```

> **Nota para Backend**: Se houver alterações no backend, entre na pasta `backend/` e faça o mesmo processo para `vydhal/edudocs-backend:latest`.

### 2. Atualizar no Portainer

1.  Acesse o **Portainer**.
2.  Vá em **Services** (se estiver usando Swarm) e encontre o serviço `edudocs_frontend`.
3.  Clique no nome do serviço para ver os detalhes.
4.  Clique no botão **Update** (ou "Apply changes").
5.  **Importante**: Marque a opção **"Pull latest image version"** (ou similar) para garantir que ele baixe a versão nova que você acabou de subir.
6.  Confirme a atualização. O Swarm irá substituir os containers antigos pelos novos sem downtime perceptível.

## ❓ Solução de Problemas (Troubleshooting)

### Erro: "Authentication failed against database server" (P1000)

**Sintoma:** O backend fica reiniciando e os logs mostram erro de credenciais inválidas para o usuário `admin`.

**Causa:** O banco de dados Postgres já foi inicializado anteriormente com uma senha diferente (ou padrão) e os dados foram persistidos no **Volume**. Alterar a senha no `docker-compose.yml` **não altera** a senha de um banco que já existe.

**Solução 1: Resetar o Banco (Se não houver dados importantes)**
1.  No Portainer, vá em **Volumes**.
2.  Encontre o volume do postgres (geralmente `edudocs_postgres_data` ou similar).
3.  Selecione e clique em **Remove**. (Você precisará parar a Stack antes).
4.  Suba a Stack novamente. O banco será recriado com a senha nova do arquivo.
5.  Execute o Seed novamente (`npx prisma db seed`).

**Solução 2: Atualizar Senha Manualmente**
1.  Acesse o Console do container `postgres`.
2.  Entre no banco: `psql -U admin -d edudocs`
3.  Execute o comando SQL:
    ```sql
    ALTER USER admin WITH PASSWORD 'EduDocs_Secure_DB_Pass_2026';
    ```
4.  Reinicie o serviço do Backend.
