# 📋 Tarefas — Integração API Serpro Integra Contador

> Legenda: `[ ]` pendente | `[/]` em andamento | `[x]` concluído

---

## PRÉ-REQUISITOS EXTERNOS (Ação Manual)

- [ ] Contratar **Integra Contador** na Loja Serpro (https://serpro.gov.br/loja)
- [ ] Obter **Consumer Key** e **Consumer Secret** do painel Serpro
- [ ] Adquirir **certificado digital e-CNPJ A1** para uso no servidor
- [ ] Contratar produto **API CND** na Loja Serpro (Certidões Negativas)
- [ ] Instruir clientes a outorgarem **procuração eletrônica** no e-CAC

---

## FASE 1 — Infraestrutura e Autenticação

### Variáveis de Ambiente
- [x] Adicionar `SERPRO_CONSUMER_KEY` ao `.env.local`
- [x] Adicionar `SERPRO_CONSUMER_SECRET` ao `.env.local`
- [x] Adicionar `SERPRO_API_BASE_URL` ao `.env.local`
- [x] Adicionar `SERPRO_AUTH_URL` ao `.env.local`
- [x] Adicionar `SERPRO_ECNPJ_PATH` ao `.env.local`
- [x] Adicionar `SERPRO_ECNPJ_PASSWORD` ao `.env.local`
- [x] Atualizar `.env.example` com as novas variáveis documentadas

### Schema Prisma (`prisma/schema.prisma`)
- [x] Criar model `SerproToken` (access_token, expiry, scope)
- [x] Criar model `IntegraLog` (endpoint, cnpj, status, timestamp, resposta)
- [x] Criar model `IntegraCache` (chave, valor, expiresAt)
- [x] Rodar `npx prisma migrate dev`

### Serviço de Autenticação OAuth 2.0
- [x] Criar `src/lib/integra-contador/auth.ts`
  - [x] Função `getAccessToken()`
  - [x] Função `refreshTokenIfNeeded()`
  - [x] Persistir token no banco Prisma

### Cliente HTTP
- [x] Criar `src/lib/integra-contador/client.ts`
  - [x] Instância Axios com base URL
  - [x] Interceptor de request (inject Bearer token)
  - [x] Interceptor de response (tratar 401 e 429)
  - [x] Função genérica `callApi(endpoint, cnpj, params)`

### Proxy API Routes
- [x] Criar `src/app/api/integra-contador/route.ts`
- [x] Middleware de validação de CNPJ e sessão `next-auth`

---

## FASE 2 — Módulo MEI 🟠 (Alta Prioridade)

### CCMEI — Certificado MEI
- [x] Criar `src/lib/integra-contador/mei/ccmei.ts`
- [x] Criar `src/app/api/integra-contador/mei/ccmei/route.ts`
- [x] Atualizar `src/app/mei/ccmei/page.tsx` (remover mock, usar API real)

### DAS MEI
- [x] Criar `src/lib/integra-contador/mei/pgmei.ts`
- [x] Criar `src/app/api/integra-contador/mei/das/route.ts`
- [x] Atualizar `src/app/mei/das/page.tsx`

### Parcelamento MEI (PARCMEI)
- [x] Criar `src/lib/integra-contador/mei/parcmei.ts`
- [x] Criar `src/app/api/integra-contador/mei/parcelamento/route.ts`
- [x] Atualizar `src/app/mei/parcelamento/page.tsx`

### Parcelamento Especial MEI
- [x] Criar `src/lib/integra-contador/mei/parcmei-especial.ts`
- [x] Criar `src/app/api/integra-contador/mei/parcelamento-especial/route.ts`
- [x] Atualizar `src/app/mei/parcelamento-especial/page.tsx`

### Parcelamento PERT MEI
- [x] Criar `src/lib/integra-contador/mei/pertmei.ts`
- [x] Criar `src/app/api/integra-contador/mei/parcelamento-pert/route.ts`
- [x] Atualizar `src/app/mei/parcelamento-pert/page.tsx`

### Dívida Ativa MEI
- [x] Criar `src/lib/integra-contador/mei/divida.ts`
- [x] Criar `src/app/api/integra-contador/mei/divida/route.ts`
- [x] Atualizar `src/app/mei/divida-ativa/page.tsx`

### Ausência de Declarações MEI
- [x] Criar `src/lib/integra-contador/mei/ausencia.ts`
- [x] Criar `src/app/api/integra-contador/mei/ausencia/route.ts`
- [x] Atualizar `src/app/mei/ausencia-declaracoes/page.tsx`

### Optantes/Excluídas MEI
- [x] Criar `src/lib/integra-contador/mei/optantes.ts`
- [x] Criar `src/app/api/integra-contador/mei/optantes/route.ts`
- [x] Atualizar `src/app/mei/optantes-excluidas/page.tsx`

### Parcelamento RELP MEI
- [x] Criar `src/lib/integra-contador/mei/relpmei.ts`
- [x] Criar `src/app/api/integra-contador/mei/parcelamento-relp/route.ts`
- [x] Atualizar `src/app/mei/parcelamento-relp/page.tsx`

### Diagnóstico MEI
- [x] Criar `src/lib/integra-contador/mei/diagnostico.ts` (agrega todos os endpoints)
- [x] Atualizar `src/app/mei/diagnostico/page.tsx`

---

## FASE 3 — Certidões Federais 🟠

### CND RFB/PGFN
- [x] Criar `src/lib/integra-contador/certidoes/cnd-federal.ts`
- [x] Criar `src/app/api/integra-contador/certidoes/cnd-federal/route.ts`
- [x] Atualizar `src/app/certidoes/cnd-rfb-pgfn/page.tsx`

### CND FGTS
- [x] Criar `src/lib/integra-contador/certidoes/cnd-fgts.ts`
- [x] Criar `src/app/api/integra-contador/certidoes/cnd-fgts/route.ts`
- [x] Atualizar `src/app/certidoes/cnd-fgts/page.tsx`

### Histórico de Certidões
- [ ] Criar model `Certidao` no Prisma
- [ ] Criar componente `src/components/certidoes/HistoricoCertidoes.tsx`

---

## FASE 4 — Declarações, Caixa Postal e Procurações 🟡

### DCTFWeb
- [x] Criar `src/lib/integra-contador/declaracoes/dctfweb.ts`
  - [ ] `transmitirDCTFWeb(cnpj, dados)`
  - [x] `consultarDCTFWeb(cnpj, periodo)`
  - [ ] `gerarDARFDCTFWeb(cnpj, declaracaoId)`
- [x] Criar `src/app/api/integra-contador/declaracoes/dctfweb/route.ts`
- [x] Atualizar `src/app/declaracoes/dctfweb/page.tsx`

### DARF via SICALWEB
- [x] Criar `src/lib/integra-contador/darfs/sicalweb.ts`
- [x] Criar `src/app/api/integra-contador/darfs/route.ts`
- [x] Criar visual para emitir DARFs em `src/app/darfs/page.tsx`

### Caixa Postal RFB (Alertas)
- [x] Criar `src/lib/integra-contador/caixa-postal/index.ts`
- [x] Criar `src/app/api/integra-contador/caixa-postal/route.ts`
- [x] Atualizar `src/app/alertas/ClientView.tsx`

### Procurações (Clientes)
- [x] Criar `src/lib/integra-contador/procuracoes/index.ts`
- [x] Criar `src/app/api/integra-contador/procuracoes/route.ts`
- [x] Integrar status de procuração em `src/app/procuracoes/`

### Comprovantes de Pagamento
- [ ] Criar `src/lib/integra-contador/pagamentos/index.ts`
- [ ] Criar `src/app/api/integra-contador/pagamentos/route.ts`
- [ ] Integrar comprovantes no Dashboard

---

## FASE 5 — Raio-X Fiscal com Dados Reais 🟡

- [x] Criar `src/lib/integra-contador/raiox/score.ts` (cálculo de score fiscal)
  - [x] Combinar dados: CND Federal + CND FGTS + MEI + DCTFWeb + Caixa Postal
- [x] Refatorar `src/app/raiox/page.tsx` para consumir dados reais

---

## FASE 6 — Segurança, Cache e Qualidade 🟢

### Segurança
- [ ] Garantir que nenhuma chamada ao Serpro ocorra no lado do client (browser)
- [ ] Validar sessão `next-auth` em todas as rotas `/api/integra-contador/*`
- [ ] Garantir logs sem expor dados sensíveis (LGPD)

### Cache
- [x] Implementar TTL por tipo de consulta no `IntegraCache`:
  - [x] CCMEI: 24h
  - [x] DAS: 1h
  - [x] CND: 4h
  - [x] Caixa Postal: 30min

### Monitoramento
- [ ] Criar `src/app/api/admin/integra-logs/route.ts` (painel de logs internos)
- [ ] Implementar alertas para erros consecutivos na API

### Testes
- [ ] Criar mocks em `src/lib/integra-contador/mocks/` para dev sem credenciais
- [ ] Criar testes de integração por serviço
