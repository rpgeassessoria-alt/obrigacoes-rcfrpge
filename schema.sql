-- ============================================================
--  FISCOCONTROL - SCHEMA DO BANCO DE DADOS
--  SQLite 3 | Versão 1.0 | Fevereiro 2026
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA encoding = 'UTF-8';

-- ============================================================
-- MÓDULO 1: USUÁRIOS E AUTENTICAÇÃO
-- ============================================================

CREATE TABLE IF NOT EXISTS perfis_acesso (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nome            TEXT NOT NULL UNIQUE,          -- 'Administrador', 'Contador', 'Assistente'
    descricao       TEXT,
    criado_em       TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS usuarios (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nome            TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    senha_hash      TEXT NOT NULL,                 -- bcrypt hash
    perfil_id       INTEGER NOT NULL REFERENCES perfis_acesso(id),
    ativo           INTEGER DEFAULT 1,             -- 0=inativo, 1=ativo
    dois_fatores    INTEGER DEFAULT 0,             -- 0=desabilitado, 1=habilitado
    token_2fa       TEXT,
    ultimo_login    TEXT,
    criado_em       TEXT DEFAULT (datetime('now')),
    atualizado_em   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessoes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token           TEXT NOT NULL UNIQUE,
    ip              TEXT,
    user_agent      TEXT,
    expira_em       TEXT NOT NULL,
    criado_em       TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- MÓDULO 2: EMPRESAS / CLIENTES
-- ============================================================

CREATE TABLE IF NOT EXISTS regimes_tributarios (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo          TEXT NOT NULL UNIQUE,          -- 'SN', 'LP', 'LR', 'MEI'
    nome            TEXT NOT NULL,                 -- 'Simples Nacional', ...
    descricao       TEXT
);

CREATE TABLE IF NOT EXISTS clientes (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    razao_social         TEXT NOT NULL,
    nome_fantasia        TEXT,
    cnpj                 TEXT NOT NULL UNIQUE,
    inscricao_estadual   TEXT,
    inscricao_municipal  TEXT,
    cnae_principal       TEXT,                     -- código CNAE 7 dígitos
    cnae_descricao       TEXT,
    regime_id            INTEGER NOT NULL REFERENCES regimes_tributarios(id),
    responsavel_id       INTEGER REFERENCES usuarios(id),
    status               TEXT NOT NULL DEFAULT 'Ativo'
                         CHECK(status IN ('Ativo','Suspenso','Encerrado')),
    classificacao_risco  TEXT NOT NULL DEFAULT 'Baixo'
                         CHECK(classificacao_risco IN ('Baixo','Médio','Alto')),
    -- Endereço
    logradouro           TEXT,
    numero               TEXT,
    complemento          TEXT,
    bairro               TEXT,
    cidade               TEXT,
    uf                   TEXT,
    cep                  TEXT,
    -- Contato
    telefone             TEXT,
    email_contato        TEXT,
    -- Fiscal
    data_abertura        TEXT,
    data_encerramento    TEXT,
    observacoes          TEXT,
    criado_em            TEXT DEFAULT (datetime('now')),
    atualizado_em        TEXT DEFAULT (datetime('now'))
);

-- Múltiplos CNAEs secundários por cliente
CREATE TABLE IF NOT EXISTS clientes_cnaes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id  INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    cnae        TEXT NOT NULL,
    descricao   TEXT,
    principal   INTEGER DEFAULT 0
);

-- ============================================================
-- MÓDULO 3: CATÁLOGO DE OBRIGAÇÕES FISCAIS
-- ============================================================

CREATE TABLE IF NOT EXISTS esferas (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo  TEXT NOT NULL UNIQUE,    -- 'FED','EST','MUN'
    nome    TEXT NOT NULL            -- 'Federal','Estadual','Municipal'
);

CREATE TABLE IF NOT EXISTS periodicidades (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo      TEXT NOT NULL UNIQUE,   -- 'MEN','TRI','SEM','ANU','EVE'
    nome        TEXT NOT NULL,          -- 'Mensal','Trimestral',...
    dias_ciclo  INTEGER                 -- 30, 90, 180, 365, null (eventual)
);

CREATE TABLE IF NOT EXISTS categorias_obrigacao (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nome    TEXT NOT NULL UNIQUE     -- 'SPED','Declaração','Previdenciária','ISS','ICMS'...
);

CREATE TABLE IF NOT EXISTS obrigacoes_catalogo (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    sigla               TEXT NOT NULL,              -- 'DCTF', 'ECF', 'PGDAS-D'...
    nome_completo       TEXT NOT NULL,
    descricao           TEXT,
    esfera_id           INTEGER NOT NULL REFERENCES esferas(id),
    categoria_id        INTEGER NOT NULL REFERENCES categorias_obrigacao(id),
    periodicidade_id    INTEGER NOT NULL REFERENCES periodicidades(id),
    -- Prazo padrão
    dia_vencimento      INTEGER,        -- dia do mês que normalmente vence
    mes_referencia      INTEGER,        -- 0=mesmo mês, 1=mês seguinte, 2=dois meses depois
    -- Aplicabilidade
    ativa               INTEGER DEFAULT 1,
    observacao_legal    TEXT,           -- base legal, instrução normativa
    link_receita        TEXT,
    criado_em           TEXT DEFAULT (datetime('now'))
);

-- Quais regimes tributários exigem qual obrigação
CREATE TABLE IF NOT EXISTS obrigacao_regimes (
    obrigacao_id    INTEGER NOT NULL REFERENCES obrigacoes_catalogo(id),
    regime_id       INTEGER NOT NULL REFERENCES regimes_tributarios(id),
    obrigatorio     INTEGER DEFAULT 1,  -- 1=obrigatório, 0=facultativo
    condicao        TEXT,               -- descrição da condição de obrigatoriedade
    PRIMARY KEY (obrigacao_id, regime_id)
);

-- ============================================================
-- MÓDULO 4: OBRIGAÇÕES DOS CLIENTES (instâncias)
-- ============================================================

CREATE TABLE IF NOT EXISTS obrigacoes_clientes (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id          INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    obrigacao_id        INTEGER NOT NULL REFERENCES obrigacoes_catalogo(id),
    -- Competência
    competencia_mes     INTEGER NOT NULL,   -- 1-12
    competencia_ano     INTEGER NOT NULL,
    -- Prazo
    data_vencimento     TEXT NOT NULL,      -- ISO date YYYY-MM-DD
    dias_para_vencer    INTEGER,            -- calculado via app/job: (date_venc - today) em dias
    -- Status
    status              TEXT NOT NULL DEFAULT 'Pendente'
                        CHECK(status IN ('Pendente','Entregue','Atrasada','Dispensada','NaoAplicavel')),
    -- Responsável pela entrega
    responsavel_id      INTEGER REFERENCES usuarios(id),
    -- Entrega
    data_entrega        TEXT,               -- quando foi transmitida
    numero_recibo       TEXT,               -- recibo de transmissão
    protocolo           TEXT,
    -- Observações
    observacoes         TEXT,
    prioridade          TEXT DEFAULT 'Normal'
                        CHECK(prioridade IN ('Baixa','Normal','Alta','Crítica')),
    criado_em           TEXT DEFAULT (datetime('now')),
    atualizado_em       TEXT DEFAULT (datetime('now'))
);

-- Índices para performance nas consultas mais comuns
CREATE INDEX IF NOT EXISTS idx_ob_cliente ON obrigacoes_clientes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ob_status  ON obrigacoes_clientes(status);
CREATE INDEX IF NOT EXISTS idx_ob_venc    ON obrigacoes_clientes(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_ob_comp    ON obrigacoes_clientes(competencia_ano, competencia_mes);

-- ============================================================
-- MÓDULO 5: HISTÓRICO E VERSÕES
-- ============================================================

CREATE TABLE IF NOT EXISTS historico_entregas (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    obrigacao_cliente_id INTEGER NOT NULL REFERENCES obrigacoes_clientes(id) ON DELETE CASCADE,
    status_anterior     TEXT,
    status_novo         TEXT NOT NULL,
    usuario_id          INTEGER REFERENCES usuarios(id),
    observacao          TEXT,
    data_hora           TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documentos (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    obrigacao_cliente_id    INTEGER REFERENCES obrigacoes_clientes(id) ON DELETE SET NULL,
    cliente_id              INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    nome_arquivo            TEXT NOT NULL,
    tipo_arquivo            TEXT,           -- 'PDF','XML','TXT','ZIP'
    tamanho_bytes           INTEGER,
    caminho_storage         TEXT,           -- path no storage (S3, local, etc.)
    hash_md5                TEXT,           -- integridade do arquivo
    competencia             TEXT,           -- 'MM/YYYY'
    tipo_documento          TEXT,           -- 'Recibo','Declaração','SPED','NotaFiscal'
    versao                  INTEGER DEFAULT 1,
    usuario_upload_id       INTEGER REFERENCES usuarios(id),
    criado_em               TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_doc_cliente ON documentos(cliente_id);

-- ============================================================
-- MÓDULO 6: ALERTAS E NOTIFICAÇÕES
-- ============================================================

CREATE TABLE IF NOT EXISTS configuracoes_alerta (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id          INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    canal_email         INTEGER DEFAULT 1,
    canal_whatsapp      INTEGER DEFAULT 0,
    whatsapp_numero     TEXT,
    -- Dias de antecedência para lembrete (armazenado como JSON)
    dias_antecedencia   TEXT DEFAULT '[1,3,7]',  -- JSON array
    alerta_atraso       INTEGER DEFAULT 1,
    alerta_doc_pendente INTEGER DEFAULT 1,
    alerta_certidoes    INTEGER DEFAULT 1,
    hora_envio          TEXT DEFAULT '08:00',
    atualizado_em       TEXT DEFAULT (datetime('now')),
    UNIQUE(usuario_id)
);

CREATE TABLE IF NOT EXISTS notificacoes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo            TEXT NOT NULL CHECK(tipo IN ('atraso','vencendo','documento','sistema','certidao')),
    titulo          TEXT NOT NULL,
    mensagem        TEXT NOT NULL,
    lida            INTEGER DEFAULT 0,
    -- Referência opcional
    obrigacao_cliente_id INTEGER REFERENCES obrigacoes_clientes(id),
    cliente_id      INTEGER REFERENCES clientes(id),
    criado_em       TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notif_usuario ON notificacoes(usuario_id, lida);

-- ============================================================
-- MÓDULO 7: CALENDÁRIO FISCAL PERSONALIZADO
-- ============================================================

CREATE TABLE IF NOT EXISTS calendario_fiscal (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    obrigacao_id        INTEGER NOT NULL REFERENCES obrigacoes_catalogo(id),
    ano                 INTEGER NOT NULL,
    mes                 INTEGER NOT NULL CHECK(mes BETWEEN 1 AND 12),
    data_vencimento     TEXT NOT NULL,
    data_vencimento_real TEXT,  -- ajuste por feriado/fim de semana
    observacao          TEXT,
    UNIQUE(obrigacao_id, ano, mes)
);

-- ============================================================
-- MÓDULO 8: AUDITORIA
-- ============================================================

CREATE TABLE IF NOT EXISTS log_auditoria (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER REFERENCES usuarios(id),
    acao            TEXT NOT NULL,          -- 'INSERT','UPDATE','DELETE','LOGIN','LOGOUT'
    tabela          TEXT,
    registro_id     INTEGER,
    dados_antes     TEXT,                   -- JSON
    dados_depois    TEXT,                   -- JSON
    ip              TEXT,
    data_hora       TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_usuario ON log_auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_audit_tabela  ON log_auditoria(tabela, registro_id);

-- ============================================================
-- MÓDULO 9: CONFIGURAÇÕES DO SISTEMA (MULTIEMPRESA)
-- ============================================================

CREATE TABLE IF NOT EXISTS escritorios (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    razao_social    TEXT NOT NULL,
    cnpj            TEXT UNIQUE,
    plano           TEXT DEFAULT 'Básico'
                    CHECK(plano IN ('Básico','Profissional','Enterprise')),
    max_clientes    INTEGER DEFAULT 10,
    max_usuarios    INTEGER DEFAULT 3,
    ativo           INTEGER DEFAULT 1,
    trial_ate       TEXT,
    criado_em       TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS configuracoes_sistema (
    chave       TEXT PRIMARY KEY,
    valor       TEXT NOT NULL,
    descricao   TEXT,
    atualizado_em TEXT DEFAULT (datetime('now'))
);

-- ============================================================
-- VIEWS ÚTEIS
-- ============================================================

-- View: obrigações com todos os dados relacionados
CREATE VIEW IF NOT EXISTS vw_obrigacoes_completas AS
SELECT
    oc.id,
    oc.cliente_id,
    c.razao_social          AS cliente_nome,
    c.cnpj                  AS cliente_cnpj,
    rt.nome                 AS regime,
    cat.nome                AS sigla,
    ob.nome_completo        AS obrigacao_nome,
    e.nome                  AS esfera,
    oc.competencia_mes,
    oc.competencia_ano,
    printf('%02d/%04d', oc.competencia_mes, oc.competencia_ano) AS competencia,
    oc.data_vencimento,
    CAST(julianday(oc.data_vencimento) - julianday('now','localtime') AS INTEGER) AS dias_para_vencer,
    oc.status,
    oc.prioridade,
    u.nome                  AS responsavel,
    oc.data_entrega,
    oc.numero_recibo,
    oc.observacoes,
    oc.criado_em,
    oc.atualizado_em
FROM obrigacoes_clientes oc
JOIN clientes           c   ON c.id  = oc.cliente_id
JOIN obrigacoes_catalogo ob ON ob.id = oc.obrigacao_id
JOIN esferas            e   ON e.id  = ob.esfera_id
JOIN categorias_obrigacao cat ON cat.id = ob.categoria_id
JOIN regimes_tributarios rt ON rt.id = c.regime_id
LEFT JOIN usuarios      u   ON u.id  = oc.responsavel_id;

-- View: dashboard KPIs
CREATE VIEW IF NOT EXISTS vw_kpis_dashboard AS
SELECT
    COUNT(*)                                        AS total,
    SUM(CASE WHEN status = 'Pendente'   THEN 1 ELSE 0 END) AS pendentes,
    SUM(CASE WHEN status = 'Entregue'   THEN 1 ELSE 0 END) AS entregues,
    SUM(CASE WHEN status = 'Atrasada'   THEN 1 ELSE 0 END) AS atrasadas,
    SUM(CASE WHEN CAST(julianday(data_vencimento)-julianday('now','localtime') AS INTEGER) = 0
             AND status IN ('Pendente','Atrasada') THEN 1 ELSE 0 END) AS vencem_hoje,
    SUM(CASE WHEN CAST(julianday(data_vencimento)-julianday('now','localtime') AS INTEGER) BETWEEN 1 AND 7
             AND status = 'Pendente'    THEN 1 ELSE 0 END) AS vencem_semana,
    ROUND(100.0 * SUM(CASE WHEN status = 'Entregue' THEN 1 ELSE 0 END) / COUNT(*), 1) AS taxa_compliance
FROM obrigacoes_clientes;

-- View: ranking de risco por cliente
CREATE VIEW IF NOT EXISTS vw_ranking_risco AS
SELECT
    c.id,
    c.razao_social,
    c.classificacao_risco,
    rt.nome                 AS regime,
    COUNT(oc.id)            AS total_obrigacoes,
    SUM(CASE WHEN oc.status = 'Atrasada' THEN 1 ELSE 0 END)  AS qtd_atrasadas,
    SUM(CASE WHEN oc.status = 'Pendente' THEN 1 ELSE 0 END)  AS qtd_pendentes,
    SUM(CASE WHEN oc.status = 'Entregue' THEN 1 ELSE 0 END)  AS qtd_entregues,
    ROUND(100.0 * SUM(CASE WHEN oc.status = 'Entregue' THEN 1 ELSE 0 END)
          / NULLIF(COUNT(oc.id),0), 1)                        AS taxa_compliance
FROM clientes c
JOIN regimes_tributarios rt ON rt.id = c.regime_id
LEFT JOIN obrigacoes_clientes oc ON oc.cliente_id = c.id
GROUP BY c.id
ORDER BY qtd_atrasadas DESC, qtd_pendentes DESC;

-- View: vencimentos por dia (calendário)
CREATE VIEW IF NOT EXISTS vw_calendario_mensal AS
SELECT
    strftime('%Y-%m', data_vencimento)                    AS ano_mes,
    strftime('%d', data_vencimento)                       AS dia,
    data_vencimento,
    COUNT(*)                                              AS total,
    SUM(CASE WHEN status = 'Atrasada' THEN 1 ELSE 0 END) AS atrasadas,
    SUM(CASE WHEN status = 'Pendente' THEN 1 ELSE 0 END) AS pendentes,
    SUM(CASE WHEN status = 'Entregue' THEN 1 ELSE 0 END) AS entregues
FROM obrigacoes_clientes
GROUP BY data_vencimento
ORDER BY data_vencimento;

-- ============================================================
-- TRIGGERS AUTOMÁTICOS
-- ============================================================

-- Atualiza status para 'Atrasada' automaticamente (simulado; na prática usar job)
-- Trigger: registra histórico ao mudar status
CREATE TRIGGER IF NOT EXISTS trg_historico_status
AFTER UPDATE OF status ON obrigacoes_clientes
WHEN OLD.status <> NEW.status
BEGIN
    INSERT INTO historico_entregas(obrigacao_cliente_id, status_anterior, status_novo)
    VALUES (NEW.id, OLD.status, NEW.status);

    UPDATE obrigacoes_clientes
    SET atualizado_em = datetime('now')
    WHERE id = NEW.id;
END;

-- Trigger: atualiza timestamp ao editar cliente
CREATE TRIGGER IF NOT EXISTS trg_cliente_updated
AFTER UPDATE ON clientes
BEGIN
    UPDATE clientes SET atualizado_em = datetime('now') WHERE id = NEW.id;
END;

-- Trigger: marca data_entrega ao mudar para 'Entregue'
CREATE TRIGGER IF NOT EXISTS trg_data_entrega
AFTER UPDATE OF status ON obrigacoes_clientes
WHEN NEW.status = 'Entregue' AND OLD.data_entrega IS NULL
BEGIN
    UPDATE obrigacoes_clientes
    SET data_entrega = datetime('now')
    WHERE id = NEW.id;
END;

-- ============================================================
-- FIM DO SCHEMA
-- ============================================================
