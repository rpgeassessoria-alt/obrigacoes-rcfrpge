"""
FiscoControl - Database Builder
Cria o banco SQLite, aplica o schema e popula com dados reais de obrigações fiscais brasileiras.
"""

import sqlite3
import json
import os
import hashlib
import random
from datetime import date, timedelta, datetime

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
DB_PATH     = os.path.join(BASE_DIR, "fiscocontrol.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "schema.sql")

def hash_senha(senha):
    return hashlib.sha256(senha.encode()).hexdigest()

def date_str(d):
    return d.strftime("%Y-%m-%d")

def criar_banco():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        conn.executescript(f.read())
    print("✅ Schema aplicado com sucesso.")
    return conn

def seed_dados_base(conn):
    c = conn.cursor()

    # --- PERFIS DE ACESSO ---
    perfis = [
        (1, "Administrador", "Acesso total ao sistema"),
        (2, "Contador",      "Acesso a clientes e obrigações, sem gestão de usuários"),
        (3, "Assistente",    "Acesso somente leitura e registro de entregas"),
    ]
    c.executemany("INSERT INTO perfis_acesso(id,nome,descricao) VALUES(?,?,?)", perfis)

    # --- USUÁRIOS ---
    usuarios = [
        (1, "Ana Lima",     "ana@fiscocontrol.com.br",     hash_senha("Admin@2026"),   1),
        (2, "Carlos Souza", "carlos@fiscocontrol.com.br",  hash_senha("Carlos@2026"),  2),
        (3, "Pedro Costa",  "pedro@fiscocontrol.com.br",   hash_senha("Pedro@2026"),   3),
        (4, "Mariana Reis", "mariana@fiscocontrol.com.br", hash_senha("Mariana@2026"), 2),
    ]
    c.executemany("""INSERT INTO usuarios(id,nome,email,senha_hash,perfil_id,dois_fatores)
                     VALUES(?,?,?,?,?,1)""", usuarios)

    # --- REGIMES TRIBUTÁRIOS ---
    regimes = [
        (1, "SN",  "Simples Nacional",  "Regime simplificado para MPEs - LC 123/2006"),
        (2, "LP",  "Lucro Presumido",   "Tributação com base em percentual presumido de lucro"),
        (3, "LR",  "Lucro Real",        "Tributação com base no lucro contábil ajustado"),
        (4, "MEI", "MEI",               "Microempreendedor Individual - faturamento até R$81k/ano"),
        (5, "IMU", "Imune/Isento",      "Entidades imunes ou isentas"),
    ]
    c.executemany("INSERT INTO regimes_tributarios(id,codigo,nome,descricao) VALUES(?,?,?,?)", regimes)

    # --- ESFERAS ---
    c.executemany("INSERT INTO esferas(id,codigo,nome) VALUES(?,?,?)", [
        (1, "FED", "Federal"),
        (2, "EST", "Estadual"),
        (3, "MUN", "Municipal"),
    ])

    # --- PERIODICIDADES ---
    c.executemany("INSERT INTO periodicidades(id,codigo,nome,dias_ciclo) VALUES(?,?,?,?)", [
        (1, "MEN", "Mensal",       30),
        (2, "TRI", "Trimestral",   90),
        (3, "SEM", "Semestral",   180),
        (4, "ANU", "Anual",       365),
        (5, "EVE", "Eventual",   None),
        (6, "QUI", "Quinzenal",   15),
        (7, "DEC", "Decendial",   10),
    ])

    # --- CATEGORIAS ---
    c.executemany("INSERT INTO categorias_obrigacao(id,nome) VALUES(?,?)", [
        (1,  "SPED / Escrituração Digital"),
        (2,  "Declaração Federal"),
        (3,  "Previdenciária / Trabalhista"),
        (4,  "ICMS / Estadual"),
        (5,  "ISS / Municipal"),
        (6,  "Simples Nacional"),
        (7,  "Importação / Exportação"),
        (8,  "Financeiro / Cambial"),
        (9,  "Certidão / Parcelamento"),
        (10, "Nota Fiscal Eletrônica"),
    ])

    print("✅ Dados base inseridos.")
    return c

def seed_catalogo_obrigacoes(c):
    """
    Catálogo completo de obrigações fiscais brasileiras.
    Colunas: (id, sigla, nome_completo, descricao, esfera_id, categoria_id, periodicidade_id,
              dia_vencimento, mes_referencia, observacao_legal)
    """
    # esfera: 1=Federal, 2=Estadual, 3=Municipal
    # categoria: 1=SPED, 2=DeclFed, 3=Prev/Trab, 4=ICMS, 5=ISS, 6=SN, 7=Imp/Exp, 8=Fin, 9=Cert, 10=NF-e
    # periodicidade: 1=Mensal, 2=Trimestral, 3=Semestral, 4=Anual, 5=Eventual
    # dia_venc: dia padrão do mês | mes_ref: 0=mesmo mês, 1=mês seguinte

    obrigacoes = [
        # ── FEDERAIS ── SPED ─────────────────────────────────────────────────
        (1,  "ECD",               "Escrituração Contábil Digital",
             "Livros contábeis em formato digital - SPED. Substitui o LALUR.",
             1, 1, 4, 31, 5,  "IN RFB 1.420/2013 e atualizações"),

        (2,  "ECF",               "Escrituração Contábil Fiscal",
             "Apuração do IRPJ e CSLL. Substitui a DIPJ.",
             1, 1, 4, 31, 7,  "IN RFB 1.422/2013 e atualizações. Entrega até 31/07 do ano seguinte."),

        (3,  "EFD-Contribuições", "EFD PIS/COFINS",
             "Escrituração das contribuições PIS e COFINS.",
             1, 1, 1, 10, 1,  "IN RFB 1.252/2012"),

        (4,  "EFD ICMS/IPI",     "EFD ICMS/IPI (SPED Fiscal)",
             "Escrituração fiscal do ICMS e IPI.",
             1, 1, 1, 15, 1,  "Ajuste SINIEF 02/2009"),

        (5,  "EFD-Reinf",        "Escrituração Fiscal Digital de Retenções e Outras Informações Fiscais",
             "Informações de retenções na fonte, rendimentos de serviços.",
             1, 3, 1, 15, 1,  "IN RFB 1.701/2017"),

        (6,  "EFD-PIS/COFINS",   "EFD PIS/COFINS Importação",
             "Escrituração específica para importações.",
             1, 1, 1, 10, 1,  "Portaria Conjunta RFB/SRFB"),

        # ── FEDERAIS ── DECLARAÇÕES ──────────────────────────────────────────
        (7,  "DCTF",             "Declaração de Débitos e Créditos Tributários Federais",
             "Declaração mensal de tributos federais devidos.",
             1, 2, 1, 15, 1,  "IN RFB 1.599/2015"),

        (8,  "DCTFWeb",          "DCTF Web",
             "Versão digital/online da DCTF. Gerada a partir do eSocial e EFD-Reinf.",
             1, 2, 1, 15, 1,  "IN RFB 1.787/2018"),

        (9,  "DIRF",             "Declaração do Imposto sobre a Renda Retido na Fonte",
             "Declaração anual de rendimentos pagos e retenções. Substituída gradualmente pelo EFD-Reinf.",
             1, 2, 4, 28, 1,  "IN RFB. Entrega em fevereiro do ano seguinte."),

        (10, "PER/DCOMP",        "Pedido de Restituição/Declaração de Compensação",
             "Pedido eletrônico de restituição, ressarcimento ou compensação.",
             1, 2, 5, None, 0, "IN RFB 1.300/2012"),

        (11, "DOI",              "Declaração sobre Operações Imobiliárias",
             "Declaração de operações imobiliárias acima de R$30k.",
             1, 2, 5, None, 0, "IN RFB 1.112/2010"),

        (12, "DIMOB",            "Declaração de Informações sobre Atividades Imobiliárias",
             "Para empresas do setor imobiliário.",
             1, 2, 4, 28, 1,  "IN RFB 694/2006"),

        (13, "DECRED",           "Declaração de Operações com Cartões de Crédito",
             "Administradoras de cartões.",
             1, 2, 2, 25, 1,  "IN RFB 341/2003"),

        (14, "DEREX",            "Declaração sobre a Utilização dos Recursos em Moeda Estrangeira",
             "Exportadores que mantêm recursos no exterior.",
             1, 2, 4, 31, 1,  "IN RFB 726/2007"),

        (15, "e-Financeira",     "e-Financeira",
             "Informações de operações financeiras das instituições.",
             1, 8, 3, 28, 1,  "IN RFB 1.571/2015"),

        (16, "SISCOSERV",        "Sistema Integrado de Comércio Exterior de Serviços",
             "Registro de operações de serviços com exterior.",
             1, 7, 1, 15, 1,  "Instrução Normativa RFB/SCS"),

        (17, "CBE",              "Declaração de Capitais Brasileiros no Exterior",
             "Declaração ao Banco Central de capitais mantidos no exterior.",
             1, 8, 4, 5, 3,   "Circular BCB 3.624/2013. Prazo: abril do ano seguinte."),

        # ── SIMPLES NACIONAL ─────────────────────────────────────────────────
        (18, "PGDAS-D",          "Programa Gerador do Documento de Arrecadação do Simples Nacional",
             "Declaração e apuração mensal do Simples Nacional.",
             1, 6, 1, 20, 1,  "LC 123/2006 - Resolução CGSN 140/2018"),

        (19, "DEFIS",            "Declaração de Informações Socioeconômicas e Fiscais",
             "Declaração anual do Simples Nacional.",
             1, 6, 4, 31, 3,  "Resolução CGSN. Entrega até 31/03 do ano seguinte."),

        (20, "DASN-SIMEI",       "Declaração Anual do MEI",
             "Declaração anual simplificada para o MEI.",
             1, 6, 4, 31, 3,  "Resolução CGSN. Entrega até 31/05 do ano seguinte."),

        # ── PREVIDENCIÁRIAS / TRABALHISTAS ───────────────────────────────────
        (21, "eSocial",          "eSocial",
             "Sistema de escrituração de obrigações fiscais, previdenciárias e trabalhistas.",
             1, 3, 1, 7, 1,   "Dec. 8.373/2014. Grupos de empregadores."),

        (22, "GFIP/SEFIP",       "Guia de Recolhimento do FGTS e Informações à Previdência",
             "Casos residuais não migrados para eSocial.",
             1, 3, 1, 7, 1,   "Lei 9.802/1999. Em extinção gradual."),

        # ── ESTADUAIS ─────────────────────────────────────────────────────────
        (23, "GIA",              "Guia de Informação e Apuração do ICMS",
             "Declaração estadual mensal de ICMS. Nome varia por estado.",
             2, 4, 1, 20, 1,  "Legislação estadual específica (SEFAZ)"),

        (24, "GIA-ST",           "GIA de Substituição Tributária",
             "Declaração de ICMS-ST para contribuintes substitutos.",
             2, 4, 1, 20, 1,  "Legislação estadual"),

        (25, "SINTEGRA",         "Sistema Integrado de Informações sobre Operações Interestaduais",
             "Arquivo eletrônico de operações com mercadorias (ainda exigido em alguns estados).",
             2, 4, 1, 15, 1,  "Conv. ICMS 57/1995"),

        (26, "DeSTDA",           "Declaração de Substituição Tributária, Diferencial de Alíquota e Antecipação",
             "Para empresas do Simples Nacional com obrigações de ICMS.",
             2, 4, 1, 20, 1,  "Conv. ICMS 93/2015"),

        (27, "DIME",             "Declaração de Informações do ICMS e Movimento Econômico",
             "Específica de Santa Catarina.",
             2, 4, 1, 10, 1,  "Portaria SEF/SC"),

        (28, "DAPI",             "Declaração de Apuração e Informação do ICMS",
             "Específica de Minas Gerais.",
             2, 4, 1, 15, 1,  "RICMS/MG"),

        (29, "DIEF",             "Declaração de Informações Econômico-Fiscais",
             "Específica do Piauí e outros estados.",
             2, 4, 1, 15, 1,  "Legislação estadual"),

        # ── MUNICIPAIS ────────────────────────────────────────────────────────
        (30, "DES",              "Declaração Eletrônica de Serviços",
             "Declaração mensal de serviços prestados. Nome varia por município.",
             3, 5, 1, 10, 1,  "Legislação municipal"),

        (31, "DMS",              "Declaração Mensal de Serviços",
             "Declaração mensal de tomadores e prestadores de serviços.",
             3, 5, 1, 15, 1,  "Legislação municipal"),

        (32, "NFS-e",            "Nota Fiscal de Serviços Eletrônica",
             "Emissão de NFS-e para prestadores de serviços.",
             3, 10, 1, None, 0, "Lei Complementar 116/2003"),

        (33, "ISS Retido",       "Declaração de ISS Retido na Fonte",
             "Tomadores de serviços com obrigação de retenção.",
             3, 5, 1, 10, 1,  "Legislação municipal"),

        (34, "DES-IF",           "Declaração de Instituições Financeiras",
             "Específica para bancos e financeiras.",
             3, 5, 1, 15, 1,  "Legislação municipal"),
    ]

    c.executemany("""
        INSERT INTO obrigacoes_catalogo
            (id, sigla, nome_completo, descricao, esfera_id, categoria_id,
             periodicidade_id, dia_vencimento, mes_referencia, observacao_legal)
        VALUES (?,?,?,?,?,?,?,?,?,?)
    """, obrigacoes)

    # --- OBRIGAÇÃO × REGIME ---
    # (obrigacao_id, regime_id, obrigatorio, condicao)
    # regime: 1=SN, 2=LP, 3=LR, 4=MEI
    obrigacao_regimes = [
        # ECD: LP quando obrigado, LR sempre
        (1,  2, 0, "Obrigatório quando receita > R$78M ou outros critérios"),
        (1,  3, 1, "Obrigatório para todas as empresas do Lucro Real"),
        # ECF: LP e LR
        (2,  2, 1, None),
        (2,  3, 1, None),
        # EFD-Contribuições: LP e LR
        (3,  2, 1, None),
        (3,  3, 1, None),
        # EFD ICMS/IPI: contribuintes ICMS (LP, LR, SN com IE)
        (4,  2, 1, "Contribuintes do ICMS/IPI"),
        (4,  3, 1, "Contribuintes do ICMS/IPI"),
        (4,  1, 0, "Simples Nacional - quando contribuinte ICMS obrigado"),
        # EFD-Reinf
        (5,  2, 1, None),
        (5,  3, 1, None),
        (5,  1, 0, "Obrigatório quando há retenções"),
        # DCTF
        (7,  2, 1, None),
        (7,  3, 1, None),
        # DCTFWeb
        (8,  2, 1, None),
        (8,  3, 1, None),
        # DIRF
        (9,  2, 1, None),
        (9,  3, 1, None),
        (9,  1, 0, "Quando há rendimentos pagos"),
        # PGDAS-D
        (18, 1, 1, None),
        # DEFIS
        (19, 1, 1, None),
        # DASN-SIMEI
        (20, 4, 1, None),
        # eSocial
        (21, 1, 1, None),
        (21, 2, 1, None),
        (21, 3, 1, None),
        (21, 4, 1, "MEI com empregado"),
        # GIA
        (23, 2, 1, "Contribuintes do ICMS"),
        (23, 3, 1, "Contribuintes do ICMS"),
        (23, 1, 0, "Quando houver operações com ICMS"),
        # DeSTDA
        (26, 1, 1, "Quando houver ICMS-ST, Difal ou antecipação"),
        # NFS-e
        (32, 1, 1, "Prestadores de serviços"),
        (32, 2, 1, "Prestadores de serviços"),
        (32, 3, 1, "Prestadores de serviços"),
        (32, 4, 1, "Prestadores de serviços MEI"),
        # DMS
        (31, 1, 1, None),
        (31, 2, 1, None),
        (31, 3, 1, None),
        # ISS Retido
        (33, 2, 0, "Tomadores de serviços"),
        (33, 3, 1, "Tomadores de serviços"),
    ]

    c.executemany("""
        INSERT OR IGNORE INTO obrigacao_regimes(obrigacao_id, regime_id, obrigatorio, condicao)
        VALUES (?,?,?,?)
    """, obrigacao_regimes)

    print("✅ Catálogo de obrigações inserido ({} obrigações, {} vínculos regime).".format(
        len(obrigacoes), len(obrigacao_regimes)))

def seed_clientes(c):
    clientes = [
        (1,  "Tech Solutions Ltda",        "TechSol",         "12.345.678/0001-90", "123456789",  "9876",   "6201-5/01", "Desenvolvimento de software", 3, 1, "Ativo", "Alto",  "Av. Paulista", "1000", "15º andar",  "Bela Vista", "São Paulo",         "SP", "01311-100", "(11) 3000-1234", "fiscal@techsol.com.br",  "2010-03-15", None),
        (2,  "Padaria Pão Quente ME",       "Pão Quente",      "98.765.432/0001-10", "-",          "456123", "1091-1/01", "Fabricação de pão",           1, 2, "Ativo", "Baixo", "Rua das Flores", "42", None,        "Centro",     "Campinas",          "SP", "13010-040", "(19) 3200-5678", "padariapaoquente@gmail.com", "2015-06-10", None),
        (3,  "Consultoria ABC S/A",         "Consultoria ABC", "11.222.333/0001-44", "555666",     "112233", "7020-4/00", "Consultoria empresarial",     2, 3, "Ativo", "Médio", "Rua XV de Novembro", "500", "8º andar", "Centro", "Curitiba",        "PR", "80020-310", "(41) 3100-9012", "fiscal@abcconsult.com.br",  "2008-11-20", None),
        (4,  "Indústria Metalúrgica XYZ",   "Metal XYZ",       "44.555.666/0001-77", "777888",     "334455", "2512-8/00", "Fabricação de esquadrias",    3, 4, "Ativo", "Alto",  "Rod. Anhanguera", "Km 45", "Galpão B", "Industrial", "Jundiaí",        "SP", "13212-000", "(11) 4500-6789", "fiscal@metalxyz.com.br",    "2002-07-01", None),
        (5,  "Farmácia Saúde Total",        "Saúde Total",     "55.666.777/0001-88", "999000",     "556677", "4771-7/01", "Comércio varejista farmácia", 2, 2, "Suspenso", "Médio", "Rua da Saúde", "88", None, "Centro", "Ribeirão Preto",  "SP", "14010-060", "(16) 3300-2345", "saude.total@email.com",     "2012-04-18", None),
        (6,  "Comércio Digital Ltda",       "ComDigital",      "66.777.888/0001-99", "111222",     "667788", "4791-1/00", "Comércio eletrônico",         1, 2, "Ativo", "Baixo", "Av. Brigadeiro", "2200", "3º andar", "Jardins", "São Paulo",      "SP", "01452-000", "(11) 5500-3456", "financeiro@comdigital.com.br", "2019-01-05", None),
        (7,  "Construtora Horizonte S/A",   "Horizonte",       "77.888.999/0001-11", "222333",     "778899", "4120-4/00", "Construção de edifícios",     3, 1, "Ativo", "Alto",  "Av. Engenheiro Luís Carlos", "3000", None, "Butantã", "São Paulo", "SP", "05601-000", "(11) 2900-4567", "fiscal@horizonte.com.br",   "1998-08-22", None),
        (8,  "Restaurante Bom Sabor ME",    "Bom Sabor",       "88.999.000/0001-22", "-",          "889900", "5611-2/01", "Restaurante e similar",       1, 3, "Ativo", "Baixo", "Rua do Comércio", "155", None, "Liberdade", "São Paulo",     "SP", "01514-000", "(11) 3300-5678", "bomsaborme@gmail.com",      "2017-09-30", None),
        (9,  "Importadora Alfa Ltda",       "Alfa Import",     "33.444.555/0001-66", "333444",     "990011", "4649-4/09", "Importação de mercadorias",   2, 2, "Ativo", "Médio", "Porto de Santos", "Armazém 7", None, "Vila Industrial", "Santos", "SP", "11010-000", "(13) 3400-6789", "fiscal@alfaimport.com.br",  "2005-02-14", None),
        (10, "Clínica Vida Saudável Ltda",  "Vida Saudável",   "22.333.444/0001-55", "444555",     "001122", "8630-5/02", "Atividades médicas",          2, 4, "Ativo", "Médio", "Av. São Luís", "78", "Sala 302", "República", "São Paulo",   "SP", "01046-000", "(11) 3600-7890", "fiscal@vidasaudavel.com.br", "2011-05-07", None),
    ]

    c.executemany("""
        INSERT INTO clientes(id, razao_social, nome_fantasia, cnpj, inscricao_estadual,
            inscricao_municipal, cnae_principal, cnae_descricao, regime_id, responsavel_id,
            status, classificacao_risco, logradouro, numero, complemento, bairro, cidade,
            uf, cep, telefone, email_contato, data_abertura, data_encerramento)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, clientes)

    print(f"✅ {len(clientes)} clientes inseridos.")

def seed_obrigacoes_instancias(c):
    """
    Gera as instâncias de obrigações para cada cliente nos últimos 6 meses
    e nos próximos 2 meses, baseado no regime tributário de cada cliente.
    """
    hoje = date.today()

    # Mapeamento regime_id → obrigações obrigatórias
    obrigacoes_por_regime = {
        1: [18, 19, 21, 26, 32, 31],                # Simples Nacional
        2: [2, 3, 5, 7, 8, 9, 21, 23, 32, 31, 33],  # Lucro Presumido
        3: [1, 2, 3, 4, 5, 7, 8, 9, 21, 23, 24, 32, 31, 33],  # Lucro Real
        4: [20, 32],                                  # MEI
    }

    # Vencimentos padrão por obrigação {ob_id: (dia_venc, meses_depois)}
    vencimentos = {
        1: (31, 7),   # ECD - até julho
        2: (31, 7),   # ECF - até julho
        3: (10, 1),   # EFD-Contrib
        4: (15, 1),   # EFD ICMS
        5: (15, 1),   # EFD-Reinf
        7: (15, 1),   # DCTF
        8: (15, 1),   # DCTFWeb
        9: (28, 1),   # DIRF
        18: (20, 1),  # PGDAS-D
        19: (31, 3),  # DEFIS
        20: (31, 5),  # DASN-SIMEI
        21: (7, 1),   # eSocial
        22: (7, 1),   # GFIP
        23: (20, 1),  # GIA
        24: (20, 1),  # GIA-ST
        26: (20, 1),  # DeSTDA
        31: (15, 1),  # DMS
        32: (10, 0),  # NFS-e (eventual, mock mensal)
        33: (10, 1),  # ISS Retido
    }

    # Obter clientes
    c.execute("SELECT id, regime_id, responsavel_id FROM clientes WHERE status != 'Encerrado'")
    clientes = c.fetchall()

    instancias = []
    historico  = []
    inst_id    = 1

    for (cliente_id, regime_id, resp_id) in clientes:
        obs_ids = obrigacoes_por_regime.get(regime_id, [])

        for ob_id in obs_ids:
            dia_venc, meses_depois = vencimentos.get(ob_id, (15, 1))

            # Obrigações anuais: só gerar para o ano corrente
            if ob_id in [1, 2, 9, 19, 20]:
                periodos = [(hoje.year - 1, 12)]
                if ob_id in [19, 20]:
                    periodos = [(hoje.year - 1, 12)]
            else:
                # Últimos 6 meses + 2 futuros
                periodos = []
                for delta in range(-5, 3):
                    mes_ref = hoje.month + delta
                    ano_ref = hoje.year + (mes_ref - 1) // 12
                    mes_ref = ((mes_ref - 1) % 12) + 1
                    periodos.append((ano_ref, mes_ref))

            for (comp_ano, comp_mes) in periodos:
                # Calcular data de vencimento
                venc_mes = comp_mes + meses_depois
                venc_ano = comp_ano + (venc_mes - 1) // 12
                venc_mes = ((venc_mes - 1) % 12) + 1

                import calendar
                max_dia = calendar.monthrange(venc_ano, venc_mes)[1]
                dia_real = min(dia_venc, max_dia)
                data_venc = date(venc_ano, venc_mes, dia_real)

                # Definir status com base na data
                dias_diff = (data_venc - hoje).days
                # Calcular dias_para_vencer explicitamente para inserção
                dias_para_vencer = dias_diff
                if dias_diff < 0:
                    # Passado: maioria entregue, alguns atrasados
                    rand = random.random()
                    if rand < 0.78:
                        status = "Entregue"
                        data_entrega = date_str(data_venc - timedelta(days=random.randint(0, 3)))
                        recibo = f"REC{cliente_id:03d}{ob_id:03d}{comp_ano}{comp_mes:02d}"
                    elif rand < 0.92:
                        status = "Atrasada"
                        data_entrega = None
                        recibo = None
                    else:
                        status = "Dispensada"
                        data_entrega = None
                        recibo = None
                elif dias_diff <= 7:
                    # Vence em breve
                    status = "Pendente"
                    data_entrega = None
                    recibo = None
                else:
                    # Futuro
                    status = "Pendente"
                    data_entrega = None
                    recibo = None

                prioridade = "Crítica" if dias_diff < 0 and status == "Atrasada" else \
                             "Alta"    if 0 <= dias_diff <= 3 else "Normal"

                instancias.append((
                    inst_id, cliente_id, ob_id,
                    comp_mes, comp_ano,
                    date_str(data_venc),
                    dias_para_vencer,
                    status,
                    resp_id,
                    data_entrega,
                    recibo,
                    None,                # protocolo
                    None,                # observacoes
                    prioridade,
                ))

                # Histórico para os entregues
                if status == "Entregue":
                    historico.append((
                        inst_id, "Pendente", "Entregue",
                        resp_id,
                        f"Transmitido com sucesso. Recibo: {recibo}"
                    ))

                inst_id += 1

    c.executemany("""
        INSERT INTO obrigacoes_clientes
            (id, cliente_id, obrigacao_id, competencia_mes, competencia_ano,
             data_vencimento, dias_para_vencer, status, responsavel_id, data_entrega,
             numero_recibo, protocolo, observacoes, prioridade)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, instancias)

    c.executemany("""
        INSERT INTO historico_entregas
            (obrigacao_cliente_id, status_anterior, status_novo, usuario_id, observacao)
        VALUES (?,?,?,?,?)
    """, historico)

    print(f"✅ {len(instancias)} instâncias de obrigações geradas.")
    print(f"✅ {len(historico)} registros de histórico gerados.")

def seed_alertas(c):
    notificacoes = [
        (1, 1, "atraso",   "DCTF em atraso",     "DCTF de Tech Solutions Ltda venceu há 3 dias sem entrega.", 0, None, 1),
        (2, 1, "vencendo", "ECF vence em breve",  "ECF de Consultoria ABC S/A vence em 2 dias.", 0, None, 3),
        (3, 2, "documento","Documentos pendentes", "Documentos para EFD-Contribuições ainda não foram enviados pelo cliente.", 1, None, 2),
        (4, 1, "vencendo", "eSocial urgente",     "eSocial de Indústria Metalúrgica XYZ vence amanhã.", 0, None, 4),
        (5, 1, "sistema",  "Backup concluído",    "Backup automático diário concluído com sucesso. 847 registros salvos.", 1, None, None),
        (6, 2, "atraso",   "EFD-Reinf atrasada",  "EFD-Reinf de Consultoria ABC S/A está em atraso há 5 dias.", 0, None, 3),
        (7, 3, "vencendo", "GIA vence em 3 dias", "GIA de Indústria Metalúrgica XYZ vence em 3 dias.", 0, None, 4),
    ]
    c.executemany("""
        INSERT INTO notificacoes(id, usuario_id, tipo, titulo, mensagem, lida, obrigacao_cliente_id, cliente_id)
        VALUES (?,?,?,?,?,?,?,?)
    """, notificacoes)

    for uid in [1, 2, 3, 4]:
        c.execute("""INSERT OR IGNORE INTO configuracoes_alerta
                     (usuario_id, canal_email, canal_whatsapp, dias_antecedencia,
                      alerta_atraso, alerta_doc_pendente)
                     VALUES (?, 1, 0, '[1,3,7]', 1, 1)""", (uid,))

def seed_documentos(c):
    docs = [
        (1, 1, 1, "DCTF_Jan2026_Recibo.pdf",         "PDF", 250880,  None, "a1b2c3", "01/2026", "Recibo",     1),
        (2, 5, 1, "ECF_2025_Transmissão.pdf",         "PDF", 1258291, None, "d4e5f6", "12/2025", "Declaração", 1),
        (3, 1, 2, "PGDAS-D_Dez2025.pdf",              "PDF", 193536,  None, "g7h8i9", "12/2025", "Recibo",     2),
        (4, 3, 3, "EFD_Contrib_Nov2025.txt",          "TXT", 5033164, None, "j0k1l2", "11/2025", "SPED",       2),
        (5, 1, 4, "NFS-e_Jan2026_Lote.xml",           "XML", 57344,   None, "m3n4o5", "01/2026", "NotaFiscal", 3),
        (6, 7, 4, "EFD_ICMS_IPI_Out2025.txt",        "TXT", 8912384, None, "p6q7r8", "10/2025", "SPED",       4),
        (7, 8, 1, "DCTF_Fev2026_Recibo.pdf",         "PDF", 238592,  None, "s9t0u1", "02/2026", "Recibo",     1),
        (8, 2, 5, "EFD-Reinf_Jan2026.xml",           "XML", 128000,  None, "v2w3x4", "01/2026", "SPED",       2),
    ]
    c.executemany("""
        INSERT INTO documentos(id, cliente_id, obrigacao_cliente_id, nome_arquivo, tipo_arquivo,
            tamanho_bytes, caminho_storage, hash_md5, competencia, tipo_documento, usuario_upload_id)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
    """, docs)
    print(f"✅ {len(docs)} documentos inseridos.")

def seed_config(c):
    c.execute("""INSERT INTO escritorios(razao_social, cnpj, plano, max_clientes, max_usuarios)
                 VALUES ('Escritório Modelo Contabilidade Ltda','00.000.000/0001-00','Profissional',50,10)""")

    configs = [
        ("app.nome",             "FiscoControl",      "Nome da plataforma"),
        ("app.versao",           "1.0.0",             "Versão do sistema"),
        ("backup.horario",       "02:00",             "Horário do backup automático diário"),
        ("alert.email_remetente","noreply@fiscocontrol.com.br", "E-mail remetente"),
        ("lgpd.retencao_dias",   "2557",              "Dias de retenção de dados (7 anos)"),
        ("auth.session_horas",   "8",                 "Duração da sessão em horas"),
        ("auth.max_tentativas",  "5",                 "Tentativas máximas de login"),
    ]
    c.executemany("INSERT INTO configuracoes_sistema(chave,valor,descricao) VALUES(?,?,?)", configs)

def gerar_relatorio(conn):
    """Imprime estatísticas do banco gerado."""
    c = conn.cursor()
    print("\n" + "═"*55)
    print("  FISCOCONTROL - RELATÓRIO DO BANCO DE DADOS")
    print("═"*55)

    tabelas = [
        "usuarios", "clientes", "obrigacoes_catalogo",
        "obrigacoes_clientes", "historico_entregas",
        "documentos", "notificacoes", "log_auditoria"
    ]
    for t in tabelas:
        c.execute(f"SELECT COUNT(*) FROM {t}")
        n = c.fetchone()[0]
        print(f"  {t:<30} {n:>6} registros")

    print("\n  📊 KPIs (vw_kpis_dashboard):")
    c.execute("SELECT * FROM vw_kpis_dashboard")
    row = c.fetchone()
    if row:
        labels = ["Total","Pendentes","Entregues","Atrasadas","Vencem Hoje","Vencem Semana","% Compliance"]
        for l, v in zip(labels, row):
            print(f"     {l:<20} {v}")

    print("\n  🏆 Top 5 Clientes por Risco:")
    c.execute("SELECT razao_social, regime, qtd_atrasadas, taxa_compliance FROM vw_ranking_risco LIMIT 5")
    for row in c.fetchall():
        print(f"     {row[0][:30]:<32} atr:{row[2]:>3}  compliance:{row[3]}%")

    print("\n  📅 Próximos vencimentos (7 dias):")
    c.execute("""
        SELECT data_vencimento, sigla, cliente_nome, status
        FROM vw_obrigacoes_completas
        WHERE dias_para_vencer BETWEEN 0 AND 7
          AND status = 'Pendente'
        ORDER BY data_vencimento
        LIMIT 8
    """)
    for row in c.fetchall():
        print(f"     {row[0]}  {row[1]:<20} {row[2][:25]}")

    print("\n  💾 Tamanho do banco:", end=" ")
    size = os.path.getsize(DB_PATH)
    print(f"{size/1024:.1f} KB")
    print("═"*55)

def main():
    print("🚀 Iniciando criação do banco FiscoControl...\n")
    conn = criar_banco()
    c = seed_dados_base(conn)
    seed_catalogo_obrigacoes(c)
    seed_clientes(c)
    seed_obrigacoes_instancias(c)
    seed_alertas(c)
    seed_documentos(c)
    seed_config(c)
    conn.commit()
    gerar_relatorio(conn)
    conn.close()
    print(f"\n✅ Banco criado em: {DB_PATH}")

if __name__ == "__main__":
    main()
