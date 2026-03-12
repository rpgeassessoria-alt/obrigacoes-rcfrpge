# 🏢 FiscoControl - RPGE Assessoria

Bem-vindo ao repositório oficial do FiscoControl, a plataforma avançada de gestão e auditoria fiscal desenvolvida para a RPGE Assessoria. O sistema centraliza a automação de processos, auditoria instantânea de regularidade (Raio-X Fiscal) e a integração direta com as APIS do Governo Federal (via Serpro Integra Contador).

## 🚀 Tecnologias Integradas

O projeto é construído sobre uma base robusta e moderna:
- **Framework Frontend/Backend:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Linguagem Principal:** TypeScript
- **Estilização:** CSS Customizado Premium (`index.css` e Componentes UI modulares)
- **Banco de Dados (ORM):** [Prisma](https://www.prisma.io/) com SQLite (Suporte fácil para PostgreSQL)
- **Integração Externa:** API Serpro Integra Contador (e-CAC, RFB, PGFN)
- **Ícones:** Lucide React

## 📂 Arquitetura e Estrutura de Diretórios

O ecossistema interno está dividido logicamente da seguinte forma dentro de `fiscocontrol-app/src`:

```
src/
├── app/                        # Next.js App Router (Páginas e API Backend)
│   ├── api/                    # BFF (Backend for Frontend) e Proxy para o Serpro
│   │   └── integra-contador/   # Endpoints de integração (MEI, Certidões, Raio-X, DARF, Caixa Postal)
│   ├── alertas/                # Visualização da Caixa Postal do e-CAC
│   ├── certidoes/              # Emissão e controle de Certidões (CND RFB, FGTS, Municipais)
│   ├── clientes/               # Cadastro e gestão de CNPJs e matrizes/filiais
│   ├── darfs/                  # Emissão avulsa de Guias DARF (Sicalcweb)
│   ├── declaracoes/            # Consulta DCTFWeb e atalhos Sintegra
│   ├── mei/                    # Hub exclusivo do Microempreendedor (CCMEI, DAS, Parcelamentos)
│   ├── parcelamentos/          # Acompanhamento de Acordos e Parcelamentos RFB/PGFN
│   ├── procuracoes/            # Consulta de Procurações Eletrônicas ativas
│   └── raiox/                  # Dashboard inteligente de Score de Risco Fiscal
│
├── components/                 # Componentes Visuais Reutilizáveis (UI)
│   ├── ui/                     # Cards, Badges, Botões base
│   └── Sidebar.tsx             # Menu lateral principal de navegação
│
├── lib/                        # Lógicas de Serviço, Cache e Configurações Core
│   ├── prisma.ts               # Conector do Prisma ORM
│   └── integra-contador/       # Serviços isolados que chamam a API Serpro (Client e Services)
│
└── styles/ ou css/             # Folhas de estilo globais (var de temas e layout base)
```

## 🧩 Principais Módulos do Sistema

1. **Painel Raio-X Fiscal (Score):**
   Um algoritmo inteligente que consulta Certidões Federais, SITAF (Dívida Ativa) e Caixa Postal para gerar um "Score" instantâneo de conformidade da empresa, variando de "Sem Risco" até "Risco Alto".

2. **Hub do MEI Integrado:**
   Automação profunda para MEIs, permitindo: Gerar DAS, emitir CCMEI, extratos de parcelamentos (Especial, PERT, RELP), além de auditar a exclusão do Simples Nacional ou ausência de declarações anuais (DASN).

3. **Automação Trabalhista e Previdenciária:**
   Integrado para varrer Certidões do FGTS e CND Trabalhista.

4. **Governança e e-CAC:**
   Leitura de mensagens da Caixa Postal da Receita Federal (Alertas), auditoria de Procurações Eletrônicas para segurança do escritório e emissão de guias do Sicalcweb (DARF).

## ⚡ Governança de Cache (Segurança e Performance)

Para evitar bilhetagem excessiva na API Serpro (que possui cobrança por requisição), o projeto implementa uma governança de Cache forte via banco de dados (`IntegraCache`).
*Tabela de TTL (Tempo de Vida):*
- **Certidões Negativas:** Cache de 4 horas.
- **Dívida Ativa MEI:** Cache de 4 horas.
- **Situação de Optante:** Cache de 24 horas.
- **Caixa Postal:** Cache de 30 minutos.
- **Caixa Postal / Extratos de Parcelamento:** Cache de 1 hora.

## 🛠️ Como Executar o Projeto Localmente

1. **Clone o Repositório:**
   ```bash
   git clone https://github.com/rpgeassessoria-alt/obrigacoes-rcfrpge.git
   cd obrigacoes-rcfrpge/fiscocontrol/fiscocontrol-app
   ```

2. **Instale as Dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz da pasta `fiscocontrol-app` com as seguintes chaves reais do Serpro:
   ```env
   SERPRO_CONSUMER_KEY=sua_consumer_key
   SERPRO_CONSUMER_SECRET=sua_consumer_secret
   SERPRO_SCOPE=escopo_da_api
   ```

4. **Rode as Migrations do Banco de Dados:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Inicie o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000`.

## 🔒 Considerações de Arquitetura

- **Isolamento Frontend/Backend:** Por razões de segurança, o Frontend React **nunca** chama a API do Serpro diretamente. Ele sempre conversa com a camada `/api/integra-contador/` do Next.js, que carrega as chaves criptografadas no servidor e resolve CORS e segurança de Tokens JWT internamente.

---
*Desenvolvido e mantido para automação contábil de alta perfomance.*
