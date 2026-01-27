# Guia de Deploy V5: Release "Download Tracking"

Este guia cobre o processo de deploy da funcionalidade de **Rastreamento de Downloads** para o ambiente de produção (Swarm/Portainer).

---

## 🚀 Passo 1: Preparar Imagens (Build & Push)

Você deve executar esses comandos na sua máquina local, onde o código foi testado.

### 1. Login no Docker Hub
Certifique-se de estar logado:
```bash
docker login
# Insira seu usuário e senha do Docker Hub se solicitado
```

### 2. Backend (API)
Atualize a imagem do backend que contém a nova lógica de rastreamento e correções de conexão.

```bash
cd backend
# Build da nova versão
docker build -t vydhal/edudocs-backend:latest .
# Envio para o Docker Hub
docker push vydhal/edudocs-backend:latest
cd ..
```

### 3. Frontend (Interface)
Atualize a imagem do frontend com o novo botão de download e dashboard.

```bash
# Build da nova versão
docker build -t vydhal/edudocs-frontend:latest .
# Envio para o Docker Hub
docker push vydhal/edudocs-frontend:latest
```

---

## ⚙️ Passo 2: Configuração no Portainer

Para que o backend conecte corretamente ao banco em produção, precisamos garantir que as variáveis de ambiente da Stack estejam corretas.

1.  Acesse o **Portainer**.
2.  Vá em **Stacks** e selecione a stack `edudocs`.
3.  Clique na aba **Editor**.
4.  Verifique a seção **Environment variables** (abaixo do editor de texto ou em um arquivo .env separado se configurado).
5.  **Garanta que as seguintes variáveis estejam definidas** com os valores que você deseja para produção (ou use os padrões se for a primeira vez, mas **anote-os**):

    *   `POSTGRES_USER`: `Admin` (Conforme sua configuração atual - MANTENHA ASSIM)
    *   `POSTGRES_PASSWORD`: `Admin123` (Conforme sua configuração atual - MANTENHA ASSIM)
    *   `POSTGRES_DB`: `edudocs`
    *   `JWT_SECRET`: (Mantenha o valor atual ou gere um novo se for o primeiro deploy)
    *   `PORT`: `3001`

    > **CRÍTICO:** Sua imagem mostra que o usuário é `Admin` e a senha `Admin123`. Você **DEVE** usar esses valores exatos. Se você colocar `admin` (minúsculo) ou `superadmin`, o sistema não conseguirá ler o banco de dados antigo e dará erro de autenticação.

---

## 🔄 Passo 3: Atualizar Serviços

Após subir as imagens e conferir as variáveis:

1.  Ainda na tela da Stack `edudocs` no Portainer.
2.  Clique no botão **Update the stack**.
3.  **IMPORTANTE:** Marque a opção **"Re-pull image and redeploy"**. Isso força o download das versões `:latest` que você acabou de subir.
4.  Confirme a atualização.

---

## ✅ Passo 4: Verificação Pós-Deploy

1.  Acesse `https://edudocs.simplisoft.com.br`.
2.  **Teste de Download:**
    *   Vá para a Home (sem logar).
    *   Encontre um documento qualquer.
    *   Clique em **"Baixar"**.
    *   O download deve iniciar normalmente.
3.  **Teste de Admin:**
    *   Acesse `https://edudocs.simplisoft.com.br/login`.
    *   Logue com `vydhal@gmail.com` / `Vydhal@112358` (ou sua senha de produção se já tiver alterado).
    *   No Dashboard, procure pelo card **"Total Downloads"**.
    *   Ele deve mostrar pelo menos **1** (do seu teste agora).

---

## ❓ Solução de Problemas (Troubleshooting)

### Erro: "Authentication failed" no Backend
Se os logs do backend reclamarem de senha, e você já tem dados no banco de produção que não quer perder:
1.  Não mude a senha no `.env`.
2.  Descubra qual senha foi usada originalmente (se possível).
3.  OU, se puder resetar o banco (PERDERÁ DADOS):
    *   Pare a stack.
    *   Vá em Volumes e remova o volume do postgres.
    *   Suba a stack novamente (ele será recriado com a senha das variáveis).
    *   Rode o seed: `docker exec -it <container_id_backend> npx prisma db seed`.
