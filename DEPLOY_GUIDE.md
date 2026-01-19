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
