# 🚀 Guia de Deploy - FiscoControl

Este documento detalha o passo a passo para colocar a plataforma **FiscoControl** em um ambiente de Produção.
Como a arquitetura é baseada no **Next.js (App Router)** com banco de dados **SQLite/Postgres via Prisma**, o deploy pode ser feito de diversas maneiras, seja em VPS, Docker ou Serverless.

---

## 🏗️ Opção 1: Deploy Rápido no Vercel (Recomendado)

O Vercel é a plataforma nativa do Next.js e oferecerá a melhor integração com Zero Configuração.

1. **Repositório GitHub:**
   - Acesse sua conta no [Vercel](https://vercel.com/) e crie um novo projeto "Import Git Repository".
   - Selecione o repositório `obrigacoes-rcfrpge`.

2. **Configuração de Build:**
   - O Vercel deve detectar automaticamente que é um projeto Next.js.
   - **Root Directory:** Configure para `fiscocontrol/fiscocontrol-app`. Se não configurar o subdiretório, o build vai falhar.
   - O *Build Command* padrão do Next.js (`npm run build`) será executado.
   
3. **Variáveis de Ambiente (Environment Variables):**
   - Na mesma tela, adicione as variáveis de produção do Serpro e a String de Conexão do Banco de Dados:
     ```env
     DATABASE_URL="file:./fiscocontrol.db" # (Se for usar PostgreSQL, substitua pelo link do BD na AWS/Supabase)
     SERPRO_CONSUMER_KEY="sua_chave_aqui"
     SERPRO_CONSUMER_SECRET="sua_chave_aqui"
     SERPRO_SCOPE="escopo_necessario"
     NEXTAUTH_SECRET="uma_string_aleatoria_super_secreta"
     NEXTAUTH_URL="https://seusite.com.br"
     ```
   
4. **Deploy:**
   - Clique em **Deploy**. Quando terminar, sua aplicação já estará viva na URL configurada!
   > ⚠️ **Atenção:** Vercel usa disco efêmero (serverless). Usar SQLite no Vercel fará com que o banco apague a cada nova publicação. Se for implantar na Vercel, considere migrar a variável `DATABASE_URL` para um banco Postgres (Supabase, Neon, ou AWS RDS).

---

## 🐳 Opção 2: Deploy com Docker (VPS / AWS / DigitalOcean)

Se você preferir rodar em um servidor privado (VPS) com Ubuntu, a melhor forma é via Docker.

1. **Prepare o Servidor e o Código:**
   Entre no servidor via SSH, instale o Docker e faça o git clone:
   ```bash
   git clone https://github.com/rpgeassessoria-alt/obrigacoes-rcfrpge.git
   cd obrigacoes-rcfrpge/fiscocontrol/fiscocontrol-app
   ```

2. **Crie ou configure o `Dockerfile`:**
   O projeto já pode conter um `Dockerfile`. Basicamente o passo consiste em compilar a imagem de produção e iniciar a porta `:3000`.

3. **Crie o `.env` de Produção:**
   ```bash
   nano .env
   # Cole suas variaveis do Serpro, JWT e Banco aqui
   ```

4. **Levante o Container:**
   ```bash
   docker compose up -d --build
   ```

---

## 🐧 Opção 3: Deploy Manual via PM2 (Debian / Ubuntu)

Excelente opção para rodar diretamente sem Docker, mantendo um SQLite persistente no servidor.

1. **Instale as dependências essenciais do Servidor:**
   ```bash
   sudo apt update
   sudo apt install nodejs npm git
   sudo npm install -g pm2
   ```

2. **Baixe o Código:**
   ```bash
   git clone https://github.com/rpgeassessoria-alt/obrigacoes-rcfrpge.git
   cd obrigacoes-rcfrpge/fiscocontrol/fiscocontrol-app
   ```

3. **Configure e Compile:**
   ```bash
   # Instale os pacotes NPM
   npm install

   # Adicione o .env de produção
   nano .env 

   # Gere o Prisma Client e Banco de Dados Local
   npx prisma generate
   npx prisma db push

   # Compile o projeto Next.js (cria pasta .next com o prod)
   npm run build
   ```

4. **Rode com o PM2 (Gerenciador de Processos):**
   O PM2 mantém o Next.js vivo mesmo se o servidor for reiniciado.
   ```bash
   pm2 start npm --name "fiscocontrol" -- start
   pm2 save
   pm2 startup
   ```

---

## 🔒 Domínio HTTPS e Reverse Proxy (Nginx)

Para ter HTTPS grátis (Certbot/Let's Encrypt), se você publicar as Opções 2 ou 3, precisa colocar o Nginx na frente direcionando para a porta 3000.

1. Instale o Nginx: `sudo apt install nginx -y`
2. Crie um bloco de configuração no Nginx (`/etc/nginx/sites-available/fiscocontrol`):
   ```nginx
   server {
       server_name app.seusite.com.br;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. Rode `certbot --nginx -d app.seusite.com.br` para colocar o cadeado seguro.

---

> ✨ **Dica Importante ao Migrar de SQLite para Postgres na Produção:**
> Caso vá migrar para um DB em nuvem (Vercel, Railway, Supabase), antes de rodar seu deploy, altere o arquivo `prisma/schema.prisma` mudando de `provider = "sqlite"` para `provider = "postgresql"` e commite antes de mandar pra master.
