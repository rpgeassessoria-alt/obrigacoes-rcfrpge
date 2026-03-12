import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════
// CATÁLOGO COMPLETO DE OBRIGAÇÕES FISCAIS
// ═══════════════════════════════════════════════════════

const CATALOGO_OBRIGACOES = {
  "FEDERAIS — SPED / Escrituração Digital": [
    { id:"ECD",            nome:"ECD — Escrituração Contábil Digital",               periodicidade:"Anual",    base:"IN RFB 1.420/2013" },
    { id:"ECF",            nome:"ECF — Escrituração Contábil Fiscal",                periodicidade:"Anual",    base:"IN RFB 1.422/2013" },
    { id:"EFD-Contrib",    nome:"EFD-Contribuições (PIS/COFINS)",                    periodicidade:"Mensal",   base:"IN RFB 1.252/2012" },
    { id:"EFD-ICMS-IPI",   nome:"EFD ICMS/IPI — SPED Fiscal",                       periodicidade:"Mensal",   base:"Ajuste SINIEF 02/2009" },
    { id:"EFD-Reinf",      nome:"EFD-Reinf — Retenções e Informações Fiscais",       periodicidade:"Mensal",   base:"IN RFB 1.701/2017" },
    { id:"EFD-Import",     nome:"EFD PIS/COFINS Importação",                         periodicidade:"Mensal",   base:"Portaria Conjunta RFB" },
  ],
  "FEDERAIS — Declarações": [
    { id:"DCTF",           nome:"DCTF — Débitos e Créditos Tributários Federais",    periodicidade:"Mensal",   base:"IN RFB 1.599/2015" },
    { id:"DCTFWeb",        nome:"DCTFWeb — Versão Digital",                          periodicidade:"Mensal",   base:"IN RFB 1.787/2018" },
    { id:"DIRF",           nome:"DIRF — Imposto de Renda Retido na Fonte",           periodicidade:"Anual",    base:"IN RFB vigente" },
    { id:"PERDCOMP",       nome:"PER/DCOMP Web — Restituição/Compensação",           periodicidade:"Eventual", base:"IN RFB 1.300/2012" },
    { id:"DOI",            nome:"DOI — Declaração sobre Operações Imobiliárias",     periodicidade:"Eventual", base:"IN RFB 1.112/2010" },
    { id:"DIMOB",          nome:"DIMOB — Atividades Imobiliárias",                   periodicidade:"Anual",    base:"IN RFB 694/2006" },
    { id:"DECRED",         nome:"DECRED — Operações com Cartões de Crédito",         periodicidade:"Semestral",base:"IN RFB 341/2003" },
    { id:"DEREX",          nome:"DEREX — Recursos em Moeda Estrangeira",             periodicidade:"Anual",    base:"IN RFB 726/2007" },
    { id:"DTTA",           nome:"DTTA — Transferência de Titularidade de Ações",     periodicidade:"Eventual", base:"IN RFB vigente" },
    { id:"DBF",            nome:"DBF — Declaração de Benefícios Fiscais",            periodicidade:"Anual",    base:"IN RFB vigente" },
    { id:"eFinanceira",    nome:"e-Financeira — Operações Financeiras",              periodicidade:"Semestral",base:"IN RFB 1.571/2015" },
    { id:"SISCOSERV",      nome:"SISCOSERV — Comércio Exterior de Serviços",         periodicidade:"Mensal",   base:"IN RFB/SCS vigente" },
    { id:"CBE",            nome:"CBE — Capitais Brasileiros no Exterior (Bacen)",    periodicidade:"Anual",    base:"Circular BCB 3.624/2013" },
  ],
  "FEDERAIS — Simples Nacional": [
    { id:"PGDAS-D",        nome:"PGDAS-D — Apuração Mensal Simples Nacional",        periodicidade:"Mensal",   base:"Resolução CGSN 140/2018" },
    { id:"DEFIS",          nome:"DEFIS — Informações Socioeconômicas e Fiscais",     periodicidade:"Anual",    base:"Resolução CGSN vigente" },
    { id:"DASN-SIMEI",     nome:"DASN-SIMEI — Declaração Anual do MEI",              periodicidade:"Anual",    base:"Resolução CGSN vigente" },
  ],
  "FEDERAIS — Previdenciárias e Trabalhistas": [
    { id:"eSocial",        nome:"eSocial — Obrigações Trabalhistas e Previdenciárias",periodicidade:"Mensal",  base:"Dec. 8.373/2014" },
    { id:"DCTFWebPrev",    nome:"DCTFWeb Previdenciária",                             periodicidade:"Mensal",  base:"IN RFB 1.787/2018" },
    { id:"GFIP-SEFIP",     nome:"GFIP/SEFIP — Casos Residuais",                      periodicidade:"Mensal",  base:"Lei 9.802/1999" },
  ],
  "ESTADUAIS — ICMS": [
    { id:"GIA",            nome:"GIA — Guia de Informação e Apuração do ICMS",       periodicidade:"Mensal",   base:"Legislação estadual (SEFAZ)" },
    { id:"GIA-ST",         nome:"GIA-ST — Substituição Tributária Interestadual",    periodicidade:"Mensal",   base:"Legislação estadual" },
    { id:"SINTEGRA",       nome:"SINTEGRA — Operações Interestaduais",               periodicidade:"Mensal",   base:"Conv. ICMS 57/1995" },
    { id:"DeSTDA",         nome:"DeSTDA — ST, Difal e Antecipação (Simples Nac.)",   periodicidade:"Mensal",   base:"Conv. ICMS 93/2015" },
    { id:"DIME",           nome:"DIME — Informação ICMS e Mov. Econômico (SC)",      periodicidade:"Mensal",   base:"Portaria SEF/SC" },
    { id:"DAPI",           nome:"DAPI — Apuração e Informação ICMS (MG)",            periodicidade:"Mensal",   base:"RICMS/MG" },
    { id:"DIEF",           nome:"DIEF — Informações Econômico-Fiscais (PI/outros)",  periodicidade:"Mensal",   base:"Legislação estadual" },
    { id:"EFD-Fronteira",  nome:"EFD-Fronteira — Operações de Fronteira",            periodicidade:"Mensal",   base:"Legislação estadual" },
    { id:"CIAP",           nome:"CIAP — Controle de Crédito de ICMS do Ativo Perm.", periodicidade:"Mensal",   base:"Convênio ICMS" },
  ],
  "MUNICIPAIS — ISS": [
    { id:"DES",            nome:"DES — Declaração Eletrônica de Serviços",           periodicidade:"Mensal",   base:"Legislação municipal" },
    { id:"DMS",            nome:"DMS — Declaração Mensal de Serviços",               periodicidade:"Mensal",   base:"Legislação municipal" },
    { id:"NFS-e",          nome:"NFS-e — Nota Fiscal de Serviços Eletrônica",        periodicidade:"Eventual", base:"LC 116/2003" },
    { id:"ISSRetido",      nome:"Declaração de ISS Retido na Fonte",                 periodicidade:"Mensal",   base:"Legislação municipal" },
    { id:"LivroISS",       nome:"Livro Eletrônico do ISS",                           periodicidade:"Mensal",   base:"Legislação municipal" },
    { id:"DES-IF",         nome:"DES-IF — Declaração de Instituições Financeiras",   periodicidade:"Mensal",   base:"Legislação municipal" },
    { id:"DeclCartorio",   nome:"Declaração de Cartórios",                            periodicidade:"Mensal",   base:"Legislação municipal" },
    { id:"DeclConstrCivil",nome:"Declaração de Construção Civil",                     periodicidade:"Mensal",   base:"Legislação municipal" },
    { id:"DeclTomador",    nome:"Declaração de Tomador de Serviços",                  periodicidade:"Mensal",   base:"Legislação municipal" },
  ],
};

const TODAS_OBRIGACOES_LISTA = Object.entries(CATALOGO_OBRIGACOES).flatMap(([cat, obs]) =>
  obs.map(o => ({ ...o, categoria: cat }))
);

const OBRIGACOES_POR_REGIME = {
  "Simples Nacional":  ["PGDAS-D","DEFIS","DeSTDA","NFS-e","DMS","eSocial","EFD-Reinf","ISSRetido"],
  "Lucro Presumido":   ["ECD","ECF","EFD-Contrib","DCTF","DCTFWeb","EFD-Reinf","eSocial","DIRF","NFS-e","GIA","EFD-ICMS-IPI","DMS","ISSRetido","DCTFWebPrev"],
  "Lucro Real":        ["ECD","ECF","EFD-Contrib","EFD-ICMS-IPI","DCTF","DCTFWeb","eSocial","EFD-Reinf","DIRF","NFS-e","GIA","GIA-ST","CIAP","PERDCOMP","eFinanceira","DMS","ISSRetido","DCTFWebPrev"],
  "MEI":               ["DASN-SIMEI","NFS-e","eSocial"],
};

const MODULOS = ["Dashboard","Clientes","Obrigações","Calendário","Alertas","Documentos","Equipe","Declarações","Relatórios"];

const hoje = new Date();
const mesAtual = hoje.getMonth();
const anoAtual = hoje.getFullYear();

// ── DADOS MOCK ─────────────────────────────────────────

const usuarios_mock_init = [
  { id:1, nome:"Ana Lima",     email:"ana@fiscocontrol.com.br",     perfil:"Administrador", ativo:true,  telefone:"(11) 99999-0001", cargo:"Sócia-Contadora",  clientesIds:[1,3,7], modulos:MODULOS, entregas:142 },
  { id:2, nome:"Carlos Souza", email:"carlos@fiscocontrol.com.br",  perfil:"Contador",      ativo:true,  telefone:"(11) 99999-0002", cargo:"Contador Senior",  clientesIds:[2,5],   modulos:["Dashboard","Clientes","Obrigações","Calendário","Alertas","Documentos","Declarações"], entregas:98 },
  { id:3, nome:"Pedro Costa",  email:"pedro@fiscocontrol.com.br",   perfil:"Assistente",    ativo:true,  telefone:"(11) 99999-0003", cargo:"Assistente Fiscal",clientesIds:[4],     modulos:["Dashboard","Obrigações","Calendário","Declarações"], entregas:67 },
  { id:4, nome:"Mariana Reis", email:"mariana@fiscocontrol.com.br", perfil:"Contador",      ativo:false, telefone:"(11) 99999-0004", cargo:"Contadora Pleno",  clientesIds:[],      modulos:["Dashboard","Clientes","Obrigações","Calendário","Alertas","Documentos","Declarações"], entregas:23 },
];

const clientes_mock_init = [
  { id:1, razaoSocial:"Tech Solutions Ltda",       cnpj:"12.345.678/0001-90", regime:"Lucro Real",        cnae:"6201-5/01", responsavel:"Ana Lima",     status:"Ativo",    risco:"Alto",  inscricaoEstadual:"123456789", inscricaoMunicipal:"987654",  obrigacoesSelecionadas: OBRIGACOES_POR_REGIME["Lucro Real"] },
  { id:2, razaoSocial:"Padaria Pão Quente ME",     cnpj:"98.765.432/0001-10", regime:"Simples Nacional",  cnae:"1091-1/01", responsavel:"Carlos Souza", status:"Ativo",    risco:"Baixo", inscricaoEstadual:"-",         inscricaoMunicipal:"456123",  obrigacoesSelecionadas: OBRIGACOES_POR_REGIME["Simples Nacional"] },
  { id:3, razaoSocial:"Consultoria ABC S/A",       cnpj:"11.222.333/0001-44", regime:"Lucro Presumido",   cnae:"7020-4/00", responsavel:"Ana Lima",     status:"Ativo",    risco:"Médio", inscricaoEstadual:"555666",    inscricaoMunicipal:"112233",  obrigacoesSelecionadas: OBRIGACOES_POR_REGIME["Lucro Presumido"] },
  { id:4, razaoSocial:"Indústria Metalúrgica XYZ", cnpj:"44.555.666/0001-77", regime:"Lucro Real",        cnae:"2512-8/00", responsavel:"Pedro Costa",  status:"Ativo",    risco:"Alto",  inscricaoEstadual:"777888",    inscricaoMunicipal:"334455",  obrigacoesSelecionadas: OBRIGACOES_POR_REGIME["Lucro Real"] },
  { id:5, razaoSocial:"Farmácia Saúde Total",      cnpj:"55.666.777/0001-88", regime:"Lucro Presumido",   cnae:"4771-7/01", responsavel:"Carlos Souza", status:"Suspenso", risco:"Médio", inscricaoEstadual:"999000",    inscricaoMunicipal:"556677",  obrigacoesSelecionadas: OBRIGACOES_POR_REGIME["Lucro Presumido"] },
];

// Tabela de vencimentos fixos por obrigação (dia do mês)
const VENCIMENTOS_FIXOS = {
  // Federais
  "ECD":          { dia: 31, mes: 5  }, // maio do ano seguinte — anual
  "ECF":          { dia: 31, mes: 7  }, // julho do ano seguinte — anual
  "EFD-Contrib":  { dia: 13, mes: -1 }, // dia 13 do mês seguinte
  "EFD-ICMS-IPI": { dia: 15, mes: -1 },
  "EFD-Reinf":    { dia: 15, mes: -1 },
  "EFD-Import":   { dia: 13, mes: -1 },
  "DCTF":         { dia: 25, mes: -1 },
  "DCTFWeb":      { dia: 15, mes: -1 },
  "DCTFWebPrev":  { dia: 15, mes: -1 },
  "DIRF":         { dia: 28, mes: 2  }, // fevereiro — anual
  "PERDCOMP":     { dia: 30, mes: -1 },
  "DOI":          { dia: 31, mes: -1 },
  "DIMOB":        { dia: 28, mes: 2  },
  "DECRED":       { dia: 28, mes: -1 },
  "DEREX":        { dia: 31, mes: 7  },
  "DTTA":         { dia: 30, mes: -1 },
  "DBF":          { dia: 28, mes: 3  },
  "eFinanceira":  { dia: 28, mes: -1 },
  "SISCOSERV":    { dia: 31, mes: -1 },
  "CBE":          { dia: 5,  mes: 4  },
  // Simples / MEI
  "PGDAS-D":      { dia: 20, mes: -1 },
  "DEFIS":        { dia: 31, mes: 3  },
  "DASN-SIMEI":   { dia: 31, mes: 5  },
  // Trabalhistas
  "eSocial":      { dia: 7,  mes: -1 },
  "GFIP-SEFIP":   { dia: 7,  mes: -1 },
  // Estaduais
  "GIA":          { dia: 10, mes: -1 },
  "GIA-ST":       { dia: 10, mes: -1 },
  "SINTEGRA":     { dia: 15, mes: -1 },
  "DeSTDA":       { dia: 20, mes: -1 },
  "DIME":         { dia: 10, mes: -1 },
  "DAPI":         { dia: 15, mes: -1 },
  "DIEF":         { dia: 15, mes: -1 },
  "EFD-Fronteira":{ dia: 15, mes: -1 },
  "CIAP":         { dia: 15, mes: -1 },
  // Municipais
  "DES":          { dia: 10, mes: -1 },
  "DMS":          { dia: 10, mes: -1 },
  "NFS-e":        { dia: 10, mes: -1 },
  "ISSRetido":    { dia: 10, mes: -1 },
  "LivroISS":     { dia: 15, mes: -1 },
  "DES-IF":       { dia: 15, mes: -1 },
  "DeclCartorio": { dia: 15, mes: -1 },
  "DeclConstrCivil":{ dia: 15, mes: -1 },
  "DeclTomador":  { dia: 10, mes: -1 },
};

function calcularVencimento(obId) {
  const v = VENCIMENTOS_FIXOS[obId];
  if (!v) return new Date(anoAtual, mesAtual, 20); // fallback dia 20
  // mes: -1 = próximo mês, número fixo = mês específico (0-based)
  if (v.mes === -1) {
    // mês seguinte ao atual
    return new Date(anoAtual, mesAtual + 1, v.dia);
  } else {
    // mês fixo no ano atual (ou próximo)
    const ano = v.mes < mesAtual ? anoAtual + 1 : anoAtual;
    return new Date(ano, v.mes, v.dia);
  }
}

function calcularEsfera(categoria) {
  if (!categoria) return "Federal";
  const c = categoria.toUpperCase();
  if (c.includes("FEDERAL")) return "Federal";
  if (c.includes("ESTADUAL")) return "Estadual";
  if (c.includes("MUNICIPAL")) return "Municipal";
  return "Federal";
}

function gerarObrigacoesClientes(clientes) {
  const lista = []; let id = 1;
  clientes.forEach(cliente => {
    const obs = cliente.obrigacoesSelecionadas || [];
    obs.forEach(obId => {
      const ob = TODAS_OBRIGACOES_LISTA.find(o => o.id === obId);
      if (!ob) return;
      const dataVenc = calcularVencimento(obId);
      const status = dataVenc < hoje ? "Atrasada" : "Pendente";
      const esfera = calcularEsfera(ob.categoria);
      lista.push({
        id: id++,
        clienteId: cliente.id,
        clienteNome: cliente.razaoSocial,
        obrigacao: ob.nome.split("—")[0].trim(),
        obrigacaoId: obId,
        competencia: `${String(mesAtual+1).padStart(2,"0")}/${anoAtual}`,
        vencimento: dataVenc,
        status,
        responsavel: cliente.responsavel,
        regime: cliente.regime,
        tipo: esfera,
      });
    });
  });
  return lista;
}

const alertas_mock = [
  { id:1, tipo:"atraso",    mensagem:"DCTF de Tech Solutions Ltda venceu há 3 dias",           data:"Hoje 09:15",  lido:false },
  { id:2, tipo:"vencendo",  mensagem:"ECF de Consultoria ABC S/A vence em 2 dias",              data:"Hoje 08:00",  lido:false },
  { id:3, tipo:"documento", mensagem:"Documentos pendentes EFD-Contribuições — Padaria Pão Quente", data:"Ontem 16:30", lido:true },
  { id:4, tipo:"vencendo",  mensagem:"eSocial de Indústria Metalúrgica XYZ vence amanhã",      data:"Ontem 09:00", lido:false },
  { id:5, tipo:"sistema",   mensagem:"Backup automático concluído com sucesso. 847 registros.", data:"28/02 02:00", lido:true },
];

const fmt = d => d?.toLocaleDateString("pt-BR") || "-";
const diasRestantes = d => Math.ceil((new Date(d)-hoje)/86400000);

// ── COMPONENTES UTILITÁRIOS ──────────────────────────────

function StatusBadge({ status }) {
  const map = { Pendente:"badge-pending", Entregue:"badge-done", Atrasada:"badge-late", Ativo:"badge-done", Suspenso:"badge-pending", Encerrado:"badge-late", Alto:"badge-late", Médio:"badge-pending", Baixo:"badge-done" };
  return <span className={`badge ${map[status]||"badge-pending"}`}>{status}</span>;
}

function SectionTitle({ children }) {
  return <div className="section-title">{children}</div>;
}

// ── MODAL NOVO/EDITAR USUÁRIO ────────────────────────────

function ModalUsuario({ onClose, onSalvar, clientes, usuarios, editando }) {
  const [form, setForm] = useState(editando || {
    nome:"", email:"", telefone:"", cargo:"", perfil:"Assistente",
    ativo:true, clientesIds:[], modulos:[]
  });
  const [abaAtiva, setAbaAtiva] = useState("dados");

  const toggleCliente = (id) => setForm(f => ({ ...f, clientesIds: f.clientesIds.includes(id) ? f.clientesIds.filter(x=>x!==id) : [...f.clientesIds, id] }));
  const toggleModulo = (m) => setForm(f => ({ ...f, modulos: f.modulos.includes(m) ? f.modulos.filter(x=>x!==m) : [...f.modulos, m] }));
  const toggleTodosModulos = () => setForm(f => ({ ...f, modulos: f.modulos.length === MODULOS.length ? [] : [...MODULOS] }));

  const clientesDoUsuario = clientes.filter(c => form.clientesIds.includes(c.id));

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2>{editando ? "Editar Usuário" : "Novo Usuário"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-tabs">
          {[["dados","👤 Dados"],["clientes","🏢 Empresas"],["permissoes","🔒 Permissões"]].map(([k,l]) => (
            <button key={k} className={`modal-tab ${abaAtiva===k?"active":""}`} onClick={()=>setAbaAtiva(k)}>{l}</button>
          ))}
        </div>

        <div className="modal-body">
          {abaAtiva === "dados" && (
            <div className="form-grid form-grid-3">
              <div className="form-group span-2"><label>Nome Completo *</label><input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Ex: João Silva" /></div>
              <div className="form-group"><label>Status</label>
                <select value={form.ativo?"Ativo":"Inativo"} onChange={e=>setForm({...form,ativo:e.target.value==="Ativo"})}>
                  <option>Ativo</option><option>Inativo</option>
                </select>
              </div>
              <div className="form-group span-2"><label>E-mail *</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="usuario@escritorio.com.br" /></div>
              <div className="form-group"><label>Telefone</label><input value={form.telefone||""} onChange={e=>setForm({...form,telefone:e.target.value})} placeholder="(00) 99999-0000" /></div>
              <div className="form-group span-2"><label>Cargo / Função</label><input value={form.cargo||""} onChange={e=>setForm({...form,cargo:e.target.value})} placeholder="Ex: Contador Sênior, Assistente Fiscal..." /></div>
              <div className="form-group"><label>Perfil de Acesso</label>
                <select value={form.perfil} onChange={e=>setForm({...form,perfil:e.target.value})}>
                  <option>Administrador</option><option>Contador</option><option>Assistente</option>
                </select>
              </div>
            </div>
          )}

          {abaAtiva === "clientes" && (
            <div>
              <p className="form-hint">Selecione as empresas pelas quais este usuário é <strong>responsável</strong>. Ele receberá alertas e terá acesso às obrigações dessas empresas.</p>
              <div className="cliente-vinculo-grid">
                {clientes.map(c => {
                  const sel = form.clientesIds.includes(c.id);
                  return (
                    <div key={c.id} className={`cliente-vinculo-card ${sel?"selected":""}`} onClick={()=>toggleCliente(c.id)}>
                      <div className="cv-check">{sel ? "✓" : ""}</div>
                      <div className="cv-info">
                        <span className="cv-nome">{c.razaoSocial}</span>
                        <span className="cv-cnpj">{c.cnpj}</span>
                        <div className="cv-tags">
                          <span className="regime-tag">{c.regime}</span>
                          <StatusBadge status={c.status}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {form.clientesIds.length > 0 && (
                <div className="vinculo-resumo">
                  <strong>✅ {form.clientesIds.length} empresa(s) vinculada(s):</strong>{" "}
                  {clientesDoUsuario.map(c=>c.razaoSocial.split(" ").slice(0,2).join(" ")).join(", ")}
                </div>
              )}
            </div>
          )}

          {abaAtiva === "permissoes" && (
            <div>
              <p className="form-hint">Defina quais módulos do sistema este usuário pode acessar.</p>
              <div className="perm-header">
                <strong>Módulos Disponíveis</strong>
                <button className="btn-link" onClick={toggleTodosModulos}>
                  {form.modulos.length === MODULOS.length ? "Desmarcar todos" : "Marcar todos"}
                </button>
              </div>
              <div className="perm-grid-full">
                {MODULOS.map(m => {
                  const sel = form.modulos.includes(m);
                  return (
                    <label key={m} className={`perm-card ${sel?"perm-selected":""}`} onClick={()=>toggleModulo(m)}>
                      <div className="perm-check">{sel?"✓":""}</div>
                      <span>{m}</span>
                    </label>
                  );
                })}
              </div>
              <div className="perm-info-box">
                <strong>Perfil selecionado: {form.perfil}</strong>
                <p>{form.perfil==="Administrador"?"Acesso total — pode gerenciar usuários, configurações e todos os módulos.":form.perfil==="Contador"?"Acesso operacional — pode cadastrar clientes, lançar e consultar obrigações.":"Acesso limitado — apenas visualiza e registra entregas de obrigações."}</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={()=>onSalvar(form)}>
            {editando ? "Salvar Alterações" : "Criar Usuário"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL NOVO/EDITAR CLIENTE ────────────────────────────

// Mapeamento de abas para categorias do catálogo
const ABAS_OBRIGACOES = {
  federais: {
    label: "🏛️ Federais",
    cor: "#0ea5e9",
    categorias: ["FEDERAIS — SPED / Escrituração Digital", "FEDERAIS — Declarações", "FEDERAIS — Simples Nacional"],
  },
  previdenciarias: {
    label: "👷 Previdenciárias",
    cor: "#f59e0b",
    categorias: ["FEDERAIS — Previdenciárias e Trabalhistas"],
  },
  estaduais: {
    label: "🏢 Estaduais",
    cor: "#a78bfa",
    categorias: ["ESTADUAIS — ICMS"],
  },
  municipais: {
    label: "🏙️ Municipais",
    cor: "#22d3ee",
    categorias: ["MUNICIPAIS — ISS"],
  },
};

function PainelObrigacoesAba({ abaKey, form, setForm, periodoColor }) {
  const grupo = ABAS_OBRIGACOES[abaKey];

  const toggleOb = (id) => setForm(f => ({
    ...f,
    obrigacoesSelecionadas: f.obrigacoesSelecionadas.includes(id)
      ? f.obrigacoesSelecionadas.filter(x => x !== id)
      : [...f.obrigacoesSelecionadas, id]
  }));

  const toggleCat = (cat) => {
    const ids = CATALOGO_OBRIGACOES[cat].map(o => o.id);
    const todas = ids.every(id => form.obrigacoesSelecionadas.includes(id));
    setForm(f => ({
      ...f,
      obrigacoesSelecionadas: todas
        ? f.obrigacoesSelecionadas.filter(id => !ids.includes(id))
        : [...new Set([...f.obrigacoesSelecionadas, ...ids])]
    }));
  };

  const idsGrupo = grupo.categorias.flatMap(c => (CATALOGO_OBRIGACOES[c]||[]).map(o=>o.id));
  const selGrupo = idsGrupo.filter(id => form.obrigacoesSelecionadas.includes(id)).length;

  return (
    <div>
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"10px 14px", borderRadius:8, marginBottom:12,
        background:`${grupo.cor}11`, borderLeft:`3px solid ${grupo.cor}`
      }}>
        <span style={{color:grupo.cor, fontWeight:700, fontSize:14}}>{grupo.label}</span>
        <span style={{
          background:`${grupo.cor}22`, color:grupo.cor,
          fontSize:12, fontWeight:600, padding:"3px 10px", borderRadius:20
        }}>{selGrupo} de {idsGrupo.length} selecionadas</span>
      </div>

      {grupo.categorias.map(cat => {
        const obs = CATALOGO_OBRIGACOES[cat] || [];
        if (!obs.length) return null;
        const idsCat = obs.map(o => o.id);
        const qtdSel = idsCat.filter(id => form.obrigacoesSelecionadas.includes(id)).length;
        const todas = qtdSel === obs.length;
        return (
          <div key={cat} className="ob-categoria">
            <div className="ob-cat-header" onClick={() => toggleCat(cat)}>
              <div className={`ob-cat-check ${todas?"checked":qtdSel>0?"partial":""}`}>
                {todas ? "✓" : qtdSel > 0 ? "−" : ""}
              </div>
              <span className="ob-cat-nome">{cat.split("—").pop().trim()}</span>
              <span className="ob-cat-count">{qtdSel}/{obs.length}</span>
            </div>
            <div className="ob-lista">
              {obs.map(ob => {
                const sel = form.obrigacoesSelecionadas.includes(ob.id);
                return (
                  <label key={ob.id} className={`ob-item ${sel?"ob-selected":""}`} onClick={() => toggleOb(ob.id)}>
                    <div className={`ob-check ${sel?"checked":""}`}>{sel ? "✓" : ""}</div>
                    <div className="ob-item-info">
                      <span className="ob-item-nome">{ob.nome}</span>
                      <span className="ob-item-base">{ob.base}</span>
                    </div>
                    <span className="ob-periodo" style={{color:periodoColor[ob.periodicidade]||"#6b7280"}}>{ob.periodicidade}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// AGENTE IA — CONSULTA SINTEGRA / IE ESTADUAL
// Versão 3.0 — Automação real: CAPTCHA via Claude Vision
// ═══════════════════════════════════════════════════════

const SEFAZ_DB = {
  AC:{n:"Acre",             url:"https://www.sefaz.ac.gov.br/"},
  AL:{n:"Alagoas",          url:"https://www.sefaz.al.gov.br/"},
  AM:{n:"Amazonas",         url:"https://sistemas.sefaz.am.gov.br/sintegra/"},
  AP:{n:"Amapá",            url:"https://www.sefaz.ap.gov.br/"},
  BA:{n:"Bahia",            url:"https://www.sefaz.ba.gov.br/sicad/"},
  CE:{n:"Ceará",            url:"https://cagec.sefaz.ce.gov.br/cagec/"},
  DF:{n:"Distrito Federal", url:"https://www.fazenda.df.gov.br/"},
  ES:{n:"Espírito Santo",   url:"https://internet.sefaz.es.gov.br/"},
  GO:{n:"Goiás",            url:"https://www.sefaz.go.gov.br/InscricaoEstadual/ConsultaInscricaoEstadual.aspx"},
  MA:{n:"Maranhão",         url:"https://sistemas1.sefaz.ma.gov.br/sintegrama/"},
  MG:{n:"Minas Gerais",     url:"https://siare.fazenda.mg.gov.br/siare/public/"},
  MS:{n:"Mato Grosso Sul",  url:"https://www.sefaz.ms.gov.br/"},
  MT:{n:"Mato Grosso",      url:"https://appw.sefaz.mt.gov.br/nfe-portal-contribuinte/"},
  PA:{n:"Pará",             url:"https://app.sefa.pa.gov.br/"},
  PB:{n:"Paraíba",          url:"https://www.sefaz.pb.gov.br/"},
  PE:{n:"Pernambuco",       url:"https://sintegra.sefaz.pe.gov.br/"},
  PI:{n:"Piauí",            url:"https://www.sefaz.pi.gov.br/"},
  PR:{n:"Paraná",           url:"https://www.fazenda.pr.gov.br/"},
  RJ:{n:"Rio de Janeiro",   url:"https://www.fazenda.rj.gov.br/"},
  RN:{n:"Rio G. Norte",     url:"https://www.set.rn.gov.br/"},
  RO:{n:"Rondônia",         url:"https://apps.sefin.ro.gov.br/sintegra/"},
  RR:{n:"Roraima",          url:"https://www.sefaz.rr.gov.br/"},
  RS:{n:"Rio G. Sul",       url:"https://www.sefaz.rs.gov.br/ASP/cx_cons_cnpj_new.asp"},
  SC:{n:"Santa Catarina",   url:"http://www.sef.sc.gov.br/servicos-e-informacoes/servicos/sintegra"},
  SE:{n:"Sergipe",          url:"https://www.sefaz.se.gov.br/"},
  SP:{n:"São Paulo",        url:"https://www.fazenda.sp.gov.br/nfep/consulta.aspx"},
  TO:{n:"Tocantins",        url:"https://sintegra.sefaz.to.gov.br/sintegra/servlet/wpsico01"},
};

// ── Tentar ReceitaWS (IE disponível em alguns CNPJs) ─────────────────────
async function buscaReceitaWS(cnpjLimpo) {
  try {
    const r = await fetch("https://receitaws.com.br/v1/cnpj/" + cnpjLimpo, {signal: AbortSignal.timeout(7000)});
    if (!r.ok) return null;
    const d = await r.json();
    const ie = d.inscricao_estadual || d.ie || "";
    if (ie && ie.length > 3 && ie !== "NAO CONTRIBUINTE" && ie !== "ISENTO") return ie;
  } catch {}
  return null;
}

// ── Tentar CNPJA API (base IE estadual) ─────────────────────────────────
async function buscaCNPJA(cnpjLimpo) {
  try {
    const r = await fetch("https://api.cnpja.com/office/" + cnpjLimpo + "?authorization=", {signal: AbortSignal.timeout(7000)});
    if (!r.ok) return null;
    const d = await r.json();
    return d?.registrations?.[0]?.number || null;
  } catch {}
  return null;
}

// ── Chamar Claude API ────────────────────────────────────────────────────
async function chamarClaude(mensagem, imagemBase64) {
  try {
    const content = imagemBase64
      ? [
          {type:"image", source:{type:"base64", media_type:"image/png", data: imagemBase64}},
          {type:"text", text: mensagem}
        ]
      : mensagem;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: "Você é um agente fiscal especializado em tributação brasileira e automação de consultas SINTEGRA. Responda sempre em português, de forma objetiva e direta.",
        messages: [{role:"user", content}]
      })
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.content?.[0]?.text?.trim() || null;
  } catch { return null; }
}

// ── Converter URL de imagem para base64 (para Claude Vision) ────────────
async function urlParaBase64(url) {
  try {
    const proxies = ["https://corsproxy.io/?", "https://api.allorigins.win/raw?url="];
    for (const proxy of proxies) {
      try {
        const r = await fetch(proxy + encodeURIComponent(url), {signal: AbortSignal.timeout(10000)});
        if (!r.ok) continue;
        const blob = await r.blob();
        return await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result.split(",")[1]);
          reader.onerror = rej;
          reader.readAsDataURL(blob);
        });
      } catch {}
    }
  } catch {}
  return null;
}

// ── Carregar página do SINTEGRA-TO via proxy e extrair HTML + CAPTCHA ───
async function carregarSintegraTO(cnpjLimpo, addLog) {
  const URL_TO = "https://sintegra.sefaz.to.gov.br/sintegra/servlet/wpsico01";
  const proxies = [
    "https://corsproxy.io/?",
    "https://api.allorigins.win/raw?url=",
    "https://thingproxy.freeboard.io/fetch/",
  ];

  for (const proxy of proxies) {
    try {
      addLog("🔄 Tentando proxy: " + proxy.split("//")[1].split("/")[0] + "...", "info");
      const urlProxy = proxy + encodeURIComponent(URL_TO);
      const r = await fetch(urlProxy, {
        signal: AbortSignal.timeout(15000),
        headers: {"Accept": "text/html,application/xhtml+xml"}
      });

      if (!r.ok) { addLog("⚠️ Proxy retornou status " + r.status, "warn"); continue; }
      const html = await r.text();
      addLog("✅ Página carregada (" + Math.round(html.length/1024) + "KB)", "ok");

      // Extrair URL da imagem do CAPTCHA
      const captchaPatterns = [
        new RegExp('src="([^"]*captcha[^"]*)"', "gi"),
        new RegExp('src="([^"]*imagem[^"]*)"', "gi"),
        new RegExp('src="([^"]*codigo[^"]*[.](png|jpg|gif))"', "gi"),
        new RegExp('img[^>]+class="[^"]*captcha[^"]*"[^>]+src="([^"]+)"', "gi"),
      ];

      let captchaUrl = null;
      for (const pat of captchaPatterns) {
        const m = html.match(pat);
        if (m) {
          const srcM = m[0].match(new RegExp('src="([^"]+)"'));
          if (srcM) {
            captchaUrl = srcM[1];
            if (!captchaUrl.startsWith("http")) {
              captchaUrl = "https://sintegra.sefaz.to.gov.br" + (captchaUrl.startsWith("/") ? "" : "/") + captchaUrl;
            }
            break;
          }
        }
      }

      // Extrair campos do formulário
      const inputsMatch = html.match(new RegExp("<input[^>]+>", "gi")) || [];
      const fields = {};
      inputsMatch.forEach(inp => {
        const nameM = inp.match(new RegExp('name="([^"]+)"', "i"));
        const valM  = inp.match(new RegExp('value="([^"]*)"', "i"));
        if (nameM) fields[nameM[1]] = valM ? valM[1] : "";
      });

      const actionM = html.match(new RegExp('action="([^"]+)"', "i"));
      const formAction = actionM ? actionM[1] : URL_TO;

      return { html, captchaUrl, fields, formAction, proxy };
    } catch (e) {
      addLog("⚠️ Proxy falhou: " + e.message, "warn");
    }
  }
  return null;
}

// ── Enviar formulário com CNPJ + solução do CAPTCHA ─────────────────────
async function enviarFormularioTO(proxy, formAction, fields, cnpjLimpo, captchaSolucao, addLog) {
  const URL_BASE = "https://sintegra.sefaz.to.gov.br";
  const urlEnvio = formAction.startsWith("http") ? formAction : URL_BASE + formAction;

  const params = new URLSearchParams();
  Object.entries(fields).forEach(([k, v]) => params.append(k, v));

  // Campos CNPJ — tentar nomes comuns
  const cnpjKeys = Object.keys(fields).filter(k =>
    k.toLowerCase().includes("cnpj") || k.toLowerCase().includes("doc") || k.toLowerCase().includes("cpf")
  );
  if (cnpjKeys.length > 0) {
    params.set(cnpjKeys[0], cnpjLimpo);
  } else {
    params.set("CNPJ", cnpjLimpo);
    params.set("cnpj", cnpjLimpo);
  }

  // Campo CAPTCHA — tentar nomes comuns
  const capKeys = Object.keys(fields).filter(k =>
    k.toLowerCase().includes("captcha") || k.toLowerCase().includes("codigo") || k.toLowerCase().includes("imagem") || k.toLowerCase().includes("seguranca")
  );
  if (capKeys.length > 0) {
    params.set(capKeys[0], captchaSolucao);
  } else {
    params.set("captcha", captchaSolucao);
    params.set("txtCaptcha", captchaSolucao);
    params.set("codigoSeguranca", captchaSolucao);
  }

  addLog("📤 Enviando formulário: CNPJ=" + cnpjLimpo + " CAPTCHA=" + captchaSolucao, "info");

  try {
    const proxies = ["https://corsproxy.io/?", "https://api.allorigins.win/raw?url="];
    for (const p of proxies) {
      try {
        const r = await fetch(p + encodeURIComponent(urlEnvio), {
          method: "POST",
          headers: {"Content-Type": "application/x-www-form-urlencoded"},
          body: params.toString(),
          signal: AbortSignal.timeout(15000)
        });
        if (r.ok) {
          const html = await r.text();
          return html;
        }
      } catch {}
    }
  } catch {}
  return null;
}

// ── Extrair IE do HTML de resultado ─────────────────────────────────────
function extrairIEDoHTML(html) {
  if (!html) return null;
  const pats = [
    new RegExp("IE[^:]*:[^0-9]*([0-9][0-9./\\-]{4,20})", "gi"),
    new RegExp("Inscri[^:]+:[^0-9]*([0-9][0-9./\\-]{4,20})", "gi"),
    new RegExp("([0-9]{2}[.][0-9]{3}[.][0-9]{3}[-][0-9])", "g"),
    new RegExp("([0-9]{9,14})", "g"),
  ];
  for (const pat of pats) {
    const m = html.match(pat);
    if (m) {
      const ie = m[0].replace(/^[^0-9]+/, "").trim();
      if (ie.length >= 5) return ie;
    }
  }
  return null;
}

// ════════════════════════════════════════════════════════════
// COMPONENTE AGENTE IE — AUTOMAÇÃO SINTEGRA-TO COM IFRAME
// ════════════════════════════════════════════════════════════

// URL oficial SINTEGRA-TO
const URL_SINTEGRA_TO = "https://sintegra.sefaz.to.gov.br/sintegra/servlet/wpsico01";

function AgenteIE({ cnpj, uf, razaoSocial, onIeEncontrada, onClose }) {
  const cnpjLimpo = (cnpj || "").replace(/\D/g, "");
  const sefaz = SEFAZ_DB[uf] || {n: uf || "?", url: ""};

  const [fase, setFase] = useState("idle");
  // idle | apis | carregando_site | aguardando_captcha | resolvendo_captcha | preenchendo | resultado | concluido | manual
  const [progresso, setProgresso] = useState(0);
  const [logs, setLogs] = useState([]);
  const [iaMensagem, setIaMensagem] = useState("");
  const [ieAchada, setIeAchada] = useState("");
  const [ieManual, setIeManual] = useState("");
  const [fonteSucesso, setFonteSucesso] = useState("");
  const [ufConsulta, setUfConsulta] = useState(uf || "TO");
  const [cnpjCopiado, setCnpjCopiado] = useState(false);

  // Estados do iframe/captcha
  const [captchaImgB64, setCaptchaImgB64] = useState("");
  const [captchaLido, setCaptchaLido]     = useState("");
  const [captchaManual, setCaptchaManual] = useState("");
  const [mostrarIframe, setMostrarIframe] = useState(false);
  const [captchaResolvido, setCaptchaResolvido] = useState(false);

  const logEndRef  = useRef(null);
  const iframeRef  = useRef(null);
  const abortRef   = useRef(false);

  useEffect(() => { logEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [logs]);
  useEffect(() => { return () => { abortRef.current = true; }; }, []);

  const log = (msg, tipo = "info") => setLogs(p => [
    ...p, {msg, tipo, ts: new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
  ]);

  const copiarCNPJ = () => {
    navigator.clipboard?.writeText(cnpjLimpo)
      .then(() => { setCnpjCopiado(true); setTimeout(()=>setCnpjCopiado(false),2500); log("📋 CNPJ " + cnpjLimpo + " copiado!", "ok"); })
      .catch(() => log("⚠️ Copie manualmente: " + cnpjLimpo, "warn"));
  };

  // ── Capturar screenshot do iframe via Canvas ─────────────────────────────
  const capturarIframe = async () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return null;
      // Tentar acessar o conteúdo do iframe (apenas se mesma origem)
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return null;
      // Capturar a imagem do captcha diretamente pelo DOM do iframe
      const imgEl = doc.querySelector("img[src*='captcha'], img[src*='imagem'], img[src*='codigo'], img[src*='seguranca']");
      if (imgEl) {
        const canvas = document.createElement("canvas");
        canvas.width = imgEl.naturalWidth || imgEl.width || 200;
        canvas.height = imgEl.naturalHeight || imgEl.height || 60;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imgEl, 0, 0);
        return canvas.toDataURL("image/png").split(",")[1];
      }
    } catch {}
    return null;
  };

  // ── Fluxo principal ────────────────────────────────────────────────────
  const iniciarAgente = async () => {
    abortRef.current = false;
    setFase("apis");
    setLogs([]); setIeAchada(""); setIaMensagem(""); setCaptchaImgB64(""); setCaptchaLido("");
    setCaptchaResolvido(false); setMostrarIframe(false);
    setProgresso(5);

    const ufAlvo = ufConsulta || "TO";
    const sefazAlvo = SEFAZ_DB[ufAlvo] || sefaz;
    log("🚀 Agente iniciado — " + sefazAlvo.n + " · CNPJ: " + cnpjLimpo, "ia");

    // Etapa 1: ReceitaWS
    log("🔍 Consultando ReceitaWS...", "info");
    setProgresso(15);
    const ieRWS = await buscaReceitaWS(cnpjLimpo);
    if (ieRWS) {
      log("✅ IE encontrada via ReceitaWS: " + ieRWS, "ok");
      setIeAchada(ieRWS); setFonteSucesso("ReceitaWS"); setProgresso(100); setFase("concluido"); return;
    }
    log("⚠️ ReceitaWS: IE não retornada para este CNPJ.", "warn");
    setProgresso(30);

    // Etapa 2: CNPJA
    log("🔍 Consultando CNPJA API...", "info");
    const ieCNPJA = await buscaCNPJA(cnpjLimpo);
    if (ieCNPJA) {
      log("✅ IE encontrada via CNPJA: " + ieCNPJA, "ok");
      setIeAchada(ieCNPJA); setFonteSucesso("CNPJA"); setProgresso(100); setFase("concluido"); return;
    }
    log("⚠️ CNPJA: IE não retornada.", "warn");
    setProgresso(50);

    // Etapa 3: SINTEGRA-TO — portal usa Google reCAPTCHA v2
    // Não é possível automatizar reCAPTCHA; abrimos o portal e guiamos o usuário
    log("🔒 SINTEGRA-TO usa Google reCAPTCHA — não automatizável.", "warn");
    log("🤖 IA preparando roteiro de consulta assistida...", "ia");
    setProgresso(70);

    // Copiar CNPJ automaticamente para facilitar
    try {
      await navigator.clipboard.writeText(cnpjLimpo);
      log("📋 CNPJ " + cnpjLimpo + " copiado automaticamente para área de transferência!", "ok");
      setCnpjCopiado(true);
      setTimeout(() => setCnpjCopiado(false), 5000);
    } catch {
      log("⚠️ Não foi possível copiar automaticamente — use o botão Copiar.", "warn");
    }

    // Claude gera roteiro específico para o SINTEGRA-TO
    const roteiro = await chamarClaude(
      "O portal SINTEGRA-TO em https://sintegra.sefaz.to.gov.br/sintegra/servlet/wpsico01 " +
      "tem 3 campos: CPF, CNPJ e Inscricao Estadual, com botoes separados para cada um, " +
      "e um Google reCAPTCHA (checkbox Nao sou um robo). " +
      "Crie EXATAMENTE 5 passos numerados (maximo 14 palavras cada) para consultar a IE " +
      "usando o CNPJ " + cnpjLimpo + ". Mencione: colar o CNPJ, marcar o reCAPTCHA, " +
      "clicar em Consulta por CNPJ, e copiar a IE do resultado."
    );

    setProgresso(100);
    setFase("manual");
    setIaMensagem(roteiro || [
      "1. Clique em Abrir SINTEGRA-TO — portal abrirá em nova aba",
      "2. Cole o CNPJ " + cnpjLimpo + " no campo CNPJ do portal",
      "3. Marque check Nao sou um robo (Google reCAPTCHA)",
      "4. Clique no botao Consulta por CNPJ",
      "5. Localize a Inscricao Estadual no resultado e cole abaixo"
    ].join("\n"));
    log("👆 Portal pronto. Siga os passos e cole a IE abaixo.", "info");
  };

  const confirmarManual = async () => {
    if (!ieManual.trim()) return;
    const validacao = await chamarClaude(
      "A IE '" + ieManual + "' é válida para o estado " + (ufConsulta||uf) + "? Responda em 1 frase curta."
    );
    if (validacao) setIaMensagem(validacao);
    log("✅ IE confirmada: " + ieManual, "ok");
    setIeAchada(ieManual); setFonteSucesso("Manual — SEFAZ-" + (ufConsulta||uf));
    setFase("concluido");
  };

  const LC = {info:"#64748b",ia:"#a78bfa",ok:"#22c55e",warn:"#f59e0b",erro:"#ef4444"};
  const LI = {info:"›",ia:"🤖",ok:"✓",warn:"⚠",erro:"✗"};
  const sefazAlvo = SEFAZ_DB[ufConsulta||uf] || sefaz;
  const isTO = (ufConsulta||uf) === "TO";

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-xl" style={{maxHeight:"94vh",display:"flex",flexDirection:"column"}}>

        {/* HEADER */}
        <div style={{
          background:"linear-gradient(135deg,#07101d,#0e0924,#07101d)",
          borderBottom:"1px solid rgba(124,58,237,0.3)",padding:"16px 22px",flexShrink:0,
          position:"relative",overflow:"hidden"
        }}>
          <div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:"rgba(124,58,237,0.05)",pointerEvents:"none"}}/>
          <div style={{display:"flex",alignItems:"center",gap:14,position:"relative"}}>
            <div style={{
              width:48,height:48,borderRadius:"50%",flexShrink:0,
              background:"linear-gradient(135deg,#7c3aed,#0ea5e9)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:24,boxShadow:"0 0 20px rgba(124,58,237,0.5)",
              animation:"logo-float 3s ease-in-out infinite"
            }}>🤖</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:2}}>
                <h2 style={{fontSize:16,fontWeight:800,color:"#e2eaf5",margin:0}}>
                  Agente IA — Consulta SINTEGRA
                </h2>
                <span style={{
                  fontSize:10,fontWeight:700,padding:"2px 9px",borderRadius:10,
                  border:"1px solid currentColor",textTransform:"uppercase",letterSpacing:".5px",
                  background: fase==="concluido"?"rgba(34,197,94,0.12)":
                               ["apis","carregando_site","resolvendo_captcha","preenchendo"].includes(fase)?"rgba(14,165,233,0.12)":
                               ["aguardando_captcha","manual"].includes(fase)?"rgba(245,158,11,0.12)":"rgba(100,116,139,0.1)",
                  color: fase==="concluido"?"#22c55e":
                         ["apis","carregando_site","resolvendo_captcha","preenchendo"].includes(fase)?"#0ea5e9":
                         ["aguardando_captcha","manual"].includes(fase)?"#f59e0b":"#64748b"
                }}>
                  {fase==="idle"&&"Pronto"}
                  {fase==="apis"&&"⏳ Consultando APIs"}
                  {fase==="carregando_site"&&"🌐 Carregando portal"}
                  {fase==="aguardando_captcha"&&"🔍 CAPTCHA detectado"}
                  {fase==="resolvendo_captcha"&&"🤖 IA resolvendo CAPTCHA"}
                  {fase==="preenchendo"&&"⌨️ Preenchendo formulário"}
                  {fase==="resultado"&&"📄 Lendo resultado"}
                  {fase==="manual"&&"👆 Consulta manual"}
                  {fase==="concluido"&&"✅ Concluído"}
                </span>
              </div>
              <p style={{fontSize:11,color:"#475569",margin:0}}>
                {razaoSocial} · <span style={{color:"#a78bfa",fontFamily:"monospace",fontWeight:700}}>{cnpj}</span> · SEFAZ-{ufConsulta||uf}
              </p>
            </div>
            <button onClick={onClose} style={{
              background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,
              color:"#64748b",width:32,height:32,cursor:"pointer",fontSize:17,
              display:"flex",alignItems:"center",justifyContent:"center"
            }}>✕</button>
          </div>
        </div>

        {/* BODY */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 22px",display:"flex",flexDirection:"column",gap:12}}>

          {/* Barra de progresso */}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:11}}>
              <span style={{color:"#a78bfa",fontWeight:700}}>
                {fase==="idle"&&"Pronto para iniciar"}
                {fase==="apis"&&"🔄 Consultando ReceitaWS e CNPJA..."}
                {fase==="carregando_site"&&"🌐 Carregando portal SINTEGRA-TO..."}
                {fase==="aguardando_captcha"&&"🖼️ Aguardando análise do CAPTCHA..."}
                {fase==="resolvendo_captcha"&&"🤖 Claude Vision decifrando CAPTCHA..."}
                {fase==="preenchendo"&&"⌨️ Preenchendo CNPJ + CAPTCHA no portal..."}
                {fase==="resultado"&&"📄 Extraindo IE do resultado..."}
                {fase==="manual"&&"👆 Consulta manual assistida"}
                {fase==="concluido"&&"✅ IE obtida com sucesso!"}
              </span>
              <span style={{fontWeight:800,color:progresso===100?"#22c55e":"#0ea5e9"}}>{progresso}%</span>
            </div>
            <div style={{height:5,background:"rgba(255,255,255,0.05)",borderRadius:3,overflow:"hidden"}}>
              <div style={{
                height:"100%",borderRadius:3,transition:"width 0.6s cubic-bezier(.4,0,.2,1)",
                width:progresso+"%",
                background:progresso===100?"linear-gradient(90deg,#16a34a,#22c55e)":"linear-gradient(90deg,#7c3aed,#0ea5e9)",
                animation:["apis","carregando_site","resolvendo_captcha","preenchendo"].includes(fase)?"shimmer 1.5s infinite linear":"none",
                backgroundSize:"200% 100%"
              }}/>
            </div>
          </div>

          {/* Grid 2 col */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,flex:1}}>

            {/* ── COLUNA ESQUERDA ──────────────────────────────────── */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>

              {/* Config */}
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"13px 15px"}}>
                <span style={{fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:9}}>Configuração</span>
                <div style={{marginBottom:9}}>
                  <label style={{fontSize:10,color:"#475569",display:"block",marginBottom:3}}>Estado / UF</label>
                  <select value={ufConsulta} onChange={e=>setUfConsulta(e.target.value)}
                    disabled={!["idle","manual"].includes(fase)}
                    style={{width:"100%",fontSize:13,fontWeight:700}}>
                    <option value="">— Selecione —</option>
                    {Object.entries(SEFAZ_DB).sort().map(([k,v])=>(<option key={k} value={k}>{k} — {v.n}</option>))}
                  </select>
                </div>
                <div style={{
                  background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.15)",
                  borderRadius:8,padding:"9px 13px",marginBottom:10,
                  display:"flex",alignItems:"center",justifyContent:"space-between",gap:8
                }}>
                  <div>
                    <span style={{fontSize:9,color:"#a78bfa",fontWeight:700,textTransform:"uppercase",display:"block"}}>CNPJ</span>
                    <span style={{fontSize:14,fontFamily:"monospace",fontWeight:800,color:"#e2eaf5",letterSpacing:"1px"}}>{cnpj}</span>
                  </div>
                  <button onClick={copiarCNPJ} style={{
                    padding:"6px 13px",borderRadius:7,cursor:"pointer",fontFamily:"var(--font)",
                    fontWeight:700,fontSize:11,border:"1px solid",transition:"all .2s",
                    background:cnpjCopiado?"rgba(34,197,94,0.12)":"rgba(167,139,250,0.1)",
                    color:cnpjCopiado?"#22c55e":"#a78bfa",
                    borderColor:cnpjCopiado?"rgba(34,197,94,0.4)":"rgba(167,139,250,0.3)"
                  }}>{cnpjCopiado?"✓ Copiado!":"📋 Copiar"}</button>
                </div>
                {["idle","manual"].includes(fase) ? (
                  <button onClick={iniciarAgente} disabled={!ufConsulta} style={{
                    width:"100%",padding:"11px",borderRadius:9,border:"none",
                    cursor:ufConsulta?"pointer":"not-allowed",fontFamily:"var(--font)",
                    fontWeight:800,fontSize:13,
                    background:ufConsulta?"linear-gradient(135deg,#7c3aed,#0ea5e9)":"var(--bg4)",
                    color:ufConsulta?"white":"var(--text3)",
                    boxShadow:ufConsulta?"0 4px 18px rgba(124,58,237,0.35)":"none"
                  }}>
                    {fase==="idle"?"🚀 Iniciar Automação":"🔄 Tentar Novamente"}
                  </button>
                ) : !["concluido"].includes(fase) ? (
                  <div style={{
                    width:"100%",padding:"11px",borderRadius:9,textAlign:"center",
                    background:"rgba(14,165,233,0.07)",border:"1px solid rgba(14,165,233,0.2)",
                    color:"#0ea5e9",fontWeight:700,fontSize:12
                  }}>
                    {fase==="carregando_site"?"🌐 Carregando portal...":
                     fase==="resolvendo_captcha"?"🤖 IA decifrando CAPTCHA...":
                     fase==="preenchendo"?"⌨️ Preenchendo formulário...":
                     fase==="apis"?"🔍 Consultando APIs...":"⏳ Aguarde..."}
                  </div>
                ) : null}
              </div>

              {/* Mensagem IA */}
              {iaMensagem && (
                <div style={{
                  background:"linear-gradient(135deg,rgba(124,58,237,0.07),rgba(14,165,233,0.05))",
                  border:"1px solid rgba(124,58,237,0.18)",borderRadius:11,padding:"13px 15px",flex:1
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
                    <div style={{
                      width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#0ea5e9)",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0
                    }}>🤖</div>
                    <span style={{fontSize:10,color:"#a78bfa",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Claude — Agente Fiscal IA</span>
                  </div>
                  <pre style={{fontSize:12,color:"#94a3b8",lineHeight:1.8,whiteSpace:"pre-wrap",wordBreak:"break-word",fontFamily:"var(--font)",margin:0}}>{iaMensagem}</pre>
                </div>
              )}

              {/* Imagem do CAPTCHA capturado */}
              {captchaImgB64 && (
                <div style={{background:"rgba(14,165,233,0.06)",border:"1px solid rgba(14,165,233,0.2)",borderRadius:11,padding:"12px 15px"}}>
                  <span style={{fontSize:10,color:"#0ea5e9",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:8}}>
                    🖼️ CAPTCHA capturado pelo agente
                  </span>
                  <img src={"data:image/png;base64," + captchaImgB64} alt="CAPTCHA" style={{
                    maxWidth:"100%",borderRadius:6,border:"1px solid rgba(14,165,233,0.25)",
                    background:"white",padding:4
                  }}/>
                  {captchaLido && (
                    <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:10,color:"#64748b"}}>Claude leu:</span>
                      <span style={{
                        fontFamily:"monospace",fontWeight:900,fontSize:18,color:"#0ea5e9",
                        background:"rgba(14,165,233,0.1)",padding:"3px 10px",borderRadius:6,letterSpacing:"3px"
                      }}>{captchaLido}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Portais SEFAZ */}
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:9,padding:"10px 12px"}}>
                <span style={{fontSize:10,color:"#334155",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:7}}>🔗 Portais SEFAZ</span>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {Object.entries(SEFAZ_DB).sort().map(([k,v])=>(
                    <a key={k} href={v.url} target="_blank" rel="noreferrer" style={{
                      padding:"3px 7px",borderRadius:4,fontSize:10,fontWeight:700,textDecoration:"none",
                      background:k===(ufConsulta||uf)?"rgba(167,139,250,0.15)":"rgba(255,255,255,0.03)",
                      color:k===(ufConsulta||uf)?"#a78bfa":"#334155",
                      border:k===(ufConsulta||uf)?"1px solid rgba(167,139,250,0.4)":"1px solid rgba(255,255,255,0.05)"
                    }}>{k}</a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── COLUNA DIREITA ────────────────────────────────────── */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>

              {/* Log terminal */}
              <div style={{
                background:"#060c14",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,
                padding:"11px 13px",minHeight:180,maxHeight:240,overflowY:"auto",fontFamily:"monospace",flex:"0 0 auto"
              }}>
                <span style={{fontSize:10,color:"#1e3a5f",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:8}}>▶ Log</span>
                {logs.length===0 && <span style={{fontSize:11,color:"#1e3a5f"}}>Aguardando...</span>}
                {logs.map((l,i)=>(
                  <div key={i} style={{display:"flex",gap:7,marginBottom:4,alignItems:"flex-start"}}>
                    <span style={{color:"#1e3248",fontSize:10,flexShrink:0,paddingTop:1}}>{l.ts}</span>
                    <span style={{fontSize:11,color:LC[l.tipo]||"#64748b",lineHeight:1.5}}>{LI[l.tipo]||"›"} {l.msg}</span>
                  </div>
                ))}
                <div ref={logEndRef}/>
              </div>

              {/* IFRAME do portal SINTEGRA-TO */}
              {mostrarIframe && isTO && (
                <div style={{
                  background:"rgba(255,255,255,0.02)",border:"1px solid rgba(14,165,233,0.2)",
                  borderRadius:11,overflow:"hidden",flex:1,display:"flex",flexDirection:"column"
                }}>
                  <div style={{
                    padding:"8px 12px",background:"rgba(14,165,233,0.06)",
                    borderBottom:"1px solid rgba(14,165,233,0.15)",
                    display:"flex",alignItems:"center",justifyContent:"space-between"
                  }}>
                    <span style={{fontSize:11,color:"#0ea5e9",fontWeight:700}}>
                      🌐 sintegra.sefaz.to.gov.br — Portal em tempo real
                    </span>
                    <span style={{fontSize:10,color:"#334155"}}>
                      {fase==="carregando_site"?"⏳ Carregando...":
                       fase==="aguardando_captcha"?"🖼️ Aguardando CAPTCHA...":
                       fase==="resolvendo_captcha"?"🤖 IA resolvendo...":
                       fase==="preenchendo"?"⌨️ Preenchendo...":"🔒 Sessão ativa"}
                    </span>
                  </div>
                  <iframe
                    ref={iframeRef}
                    src={URL_SINTEGRA_TO}
                    title="SINTEGRA-TO"
                    sandbox="allow-scripts allow-forms allow-same-origin"
                    style={{
                      width:"100%",height:280,border:"none",
                      background:"white",borderRadius:"0 0 11px 11px"
                    }}
                    onLoad={() => {
                      log("✅ Portal SINTEGRA-TO carregado no iframe.", "ok");
                      if (fase==="carregando_site") setFase("aguardando_captcha");
                    }}
                  />
                  <div style={{
                    padding:"6px 12px",background:"rgba(245,158,11,0.05)",
                    borderTop:"1px solid rgba(245,158,11,0.1)",
                    fontSize:10,color:"#92400e",display:"flex",alignItems:"center",gap:6
                  }}>
                    <span>⚠️</span>
                    <span>Se o portal não aparecer acima, clique em "Abrir portal" para consulta manual.</span>
                  </div>
                </div>
              )}

              {/* RESULTADO — IE encontrada */}
              {fase==="concluido" && ieAchada && (
                <div style={{
                  background:"linear-gradient(135deg,rgba(34,197,94,0.1),rgba(16,185,129,0.06))",
                  border:"2px solid rgba(34,197,94,0.3)",borderRadius:13,padding:"16px 18px"
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontSize:26}}>✅</span>
                    <div>
                      <span style={{display:"block",fontSize:10,color:"#22c55e",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Inscrição Estadual Encontrada</span>
                      <span style={{fontSize:11,color:"#475569"}}>via {fonteSucesso}</span>
                    </div>
                  </div>
                  <div style={{background:"rgba(34,197,94,0.08)",borderRadius:8,padding:"12px 14px",textAlign:"center",marginBottom:12}}>
                    <span style={{display:"block",fontSize:30,fontWeight:900,color:"#22c55e",fontFamily:"monospace",letterSpacing:"3px"}}>{ieAchada}</span>
                    <span style={{fontSize:11,color:"#475569",marginTop:4,display:"block"}}>{sefazAlvo.n}</span>
                  </div>
                  <div style={{display:"flex",gap:7}}>
                    <button onClick={()=>onIeEncontrada(ieAchada,ufConsulta||uf)} style={{
                      flex:1,padding:"10px",borderRadius:8,border:"none",cursor:"pointer",
                      fontFamily:"var(--font)",fontWeight:800,fontSize:13,
                      background:"linear-gradient(135deg,#16a34a,#22c55e)",color:"white",
                      boxShadow:"0 4px 14px rgba(34,197,94,0.25)"
                    }}>✅ Aplicar no Cadastro</button>
                    <button onClick={()=>{setFase("idle");setProgresso(0);setIeAchada("");setCaptchaImgB64("");setLogs([]);setMostrarIframe(false);}} style={{
                      padding:"10px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",
                      background:"rgba(255,255,255,0.04)",color:"#64748b",cursor:"pointer",
                      fontFamily:"var(--font)",fontWeight:700,fontSize:12
                    }}>Outro estado</button>
                  </div>
                </div>
              )}

              {/* CONSULTA MANUAL — fallback */}
              {fase==="manual" && (
                <div style={{background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:11,padding:"14px 16px",flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <span style={{fontSize:20}}>🌐</span>
                    <div>
                      <span style={{display:"block",fontSize:12,fontWeight:700,color:"#f59e0b"}}>Consulta Manual Assistida — SINTEGRA-{ufConsulta||uf}</span>
                      <span style={{fontSize:11,color:"#64748b"}}>Acesse o portal, resolva o CAPTCHA e cole a IE abaixo</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}}>
                    <a href={isTO ? URL_SINTEGRA_TO : sefazAlvo.url} target="_blank" rel="noreferrer" style={{
                      flex:1,minWidth:130,padding:"9px 12px",borderRadius:7,textDecoration:"none",
                      background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",
                      color:"#f59e0b",fontWeight:700,fontSize:12,textAlign:"center",display:"block"
                    }}>🌐 Abrir {isTO?"SINTEGRA-TO":"SEFAZ-"+(ufConsulta||uf)}</a>
                    <button onClick={copiarCNPJ} style={{
                      flex:1,minWidth:110,padding:"9px 12px",borderRadius:7,cursor:"pointer",
                      background:cnpjCopiado?"rgba(34,197,94,0.1)":"rgba(14,165,233,0.08)",
                      border:cnpjCopiado?"1px solid rgba(34,197,94,0.3)":"1px solid rgba(14,165,233,0.2)",
                      color:cnpjCopiado?"#22c55e":"#0ea5e9",fontWeight:700,fontSize:12,fontFamily:"var(--font)"
                    }}>{cnpjCopiado?"✓ Copiado!":"📋 Copiar CNPJ"}</button>
                  </div>
                  <label style={{fontSize:11,color:"#64748b",fontWeight:700,display:"block",marginBottom:6}}>Cole a IE encontrada:</label>
                  <div style={{display:"flex",gap:7}}>
                    <input
                      value={ieManual} onChange={e=>setIeManual(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&confirmarManual()}
                      placeholder="Ex: 29.023.948-1" autoFocus
                      style={{flex:1,fontSize:14,fontWeight:700,letterSpacing:"1px",fontFamily:"monospace"}}
                    />
                    <button onClick={confirmarManual} disabled={!ieManual.trim()} style={{
                      padding:"0 16px",borderRadius:8,border:"none",
                      cursor:ieManual.trim()?"pointer":"not-allowed",
                      background:ieManual.trim()?"linear-gradient(135deg,#7c3aed,#0ea5e9)":"var(--bg4)",
                      color:ieManual.trim()?"white":"var(--text3)",
                      fontFamily:"var(--font)",fontWeight:700,fontSize:14
                    }}>✅</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          padding:"10px 22px",borderTop:"1px solid rgba(255,255,255,0.06)",
          display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,
          background:"rgba(0,0,0,0.2)"
        }}>
          <span style={{fontSize:11,color:"#1e3248"}}>🔗 ReceitaWS · CNPJA · Iframe · Claude Vision · IA Fiscal</span>
          <div style={{display:"flex",gap:7}}>
            {!["idle","apis","carregando_site","resolvendo_captcha","preenchendo"].includes(fase) && (
              <button onClick={()=>{abortRef.current=true;setFase("idle");setProgresso(0);setIeAchada("");setCaptchaImgB64("");setIaMensagem("");setLogs([]);setMostrarIframe(false);}} style={{
                padding:"6px 14px",borderRadius:7,border:"1px solid rgba(255,255,255,0.1)",
                background:"rgba(255,255,255,0.04)",color:"#64748b",cursor:"pointer",fontFamily:"var(--font)",fontWeight:600,fontSize:12
              }}>🔄 Nova Consulta</button>
            )}
            <button onClick={onClose} style={{
              padding:"6px 15px",borderRadius:7,border:"1px solid rgba(255,255,255,0.1)",
              background:"rgba(255,255,255,0.04)",color:"#94a3b8",cursor:"pointer",fontFamily:"var(--font)",fontWeight:700,fontSize:13
            }}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
}



// Formata CNPJ para exibição: qualquer entrada → XX.XXX.XXX/XXXX-XX
function formatarCNPJ(v) {
  const n = v.replace(/\D/g, "").slice(0, 14);
  if (n.length <= 2)  return n;
  if (n.length <= 5)  return n.slice(0,2) + "." + n.slice(2);
  if (n.length <= 8)  return n.slice(0,2) + "." + n.slice(2,5) + "." + n.slice(5);
  if (n.length <= 12) return n.slice(0,2) + "." + n.slice(2,5) + "." + n.slice(5,8) + "/" + n.slice(8);
  return n.slice(0,2) + "." + n.slice(2,5) + "." + n.slice(5,8) + "/" + n.slice(8,12) + "-" + n.slice(12);
}

// Mapeia natureza jurídica para regime sugerido
function sugerirRegimePorNatureza(natureza) {
  if (!natureza) return "Simples Nacional";
  const n = natureza.toLowerCase();
  if (n.includes("micro") || n.includes("mei") || n.includes("individual")) return "MEI";
  if (n.includes("ltda") || n.includes("eireli") || n.includes("simples")) return "Simples Nacional";
  if (n.includes("s/a") || n.includes("s.a") || n.includes("sociedade anônima")) return "Lucro Real";
  return "Simples Nacional";
}

function ModalCliente({ onClose, onSalvar, usuarios, editando }) {
  const [abaAtiva, setAbaAtiva] = useState("dados");
  const [form, setForm] = useState(editando || {
    razaoSocial:"", cnpj:"", inscricaoEstadual:"", inscricaoMunicipal:"",
    cnae:"", regime:"Simples Nacional", responsavel:"Rogério Santana",
    status:"Ativo", risco:"Baixo", obrigacoesSelecionadas: OBRIGACOES_POR_REGIME["Simples Nacional"] || [],
    // Extras da Receita Federal
    nomeFantasia:"", telefone:"", email:"", logradouro:"", numero:"",
    complemento:"", bairro:"", municipio:"", uf:"", cep:"",
    capitalSocial:"", porte:"", naturezaJuridica:"", situacao:"",
    dataAbertura:"", atividadesPrincipais:"", atividadesSecundarias:"",
    socios:[],
  });

  const [cnpjStatus, setCnpjStatus] = useState("idle"); // idle | loading | success | error
  const [cnpjMsg, setCnpjMsg] = useState("");
  const [dadosRFB, setDadosRFB] = useState(null);
  const [mostrarDadosRFB, setMostrarDadosRFB] = useState(false);
  const [statusEstadual, setStatusEstadual] = useState("idle");  // idle|loading|success|error
  const [statusMunicipal, setStatusMunicipal] = useState("idle");
  const [dadosEstadual, setDadosEstadual] = useState(null);
  const [dadosMunicipal, setDadosMunicipal] = useState(null);
  const [mostrarAgenteIE, setMostrarAgenteIE] = useState(false);

  const autoPreencherPorRegime = () => {
    setForm(f => ({ ...f, obrigacoesSelecionadas: OBRIGACOES_POR_REGIME[f.regime] || [] }));
  };

  // ── Detecta regime tributário real pelo optante Simples e porte ──────────
  const detectarRegime = (d) => {
    const optSimples  = (d.opcao_pelo_simples === true || String(d.opcao_pelo_simples) === "true");
    const optMEI      = (d.opcao_pelo_mei === true || String(d.opcao_pelo_mei) === "true");
    const capital     = parseFloat(d.capital_social || 0);
    const porteStr    = (d.porte || "").toUpperCase();
    const naturezaStr = (d.natureza_juridica || "").toUpperCase();
    if (optMEI || porteStr.includes("MEI") || naturezaStr.includes("MICRO EMPREENDEDOR INDIVIDUAL")) return "MEI";
    if (optSimples || porteStr.includes("MICRO EMPRESA") || porteStr.includes("PEQUENO PORTE")) return "Simples Nacional";
    if (capital > 78000000 || porteStr.includes("GRANDE")) return "Lucro Real";
    if (capital > 20000000 || porteStr.includes("MEDIO") || porteStr.includes("MÉDIO")) return "Lucro Presumido";
    return sugerirRegimePorNatureza(d.natureza_juridica);
  };

  // ── Busca dados estaduais via CEP → SEFAZ/ReceitaWS ──────────────────────
  const buscarDadosEstaduais = async (uf, cnpjLimpo) => {
    try {
      // ReceitaWS tem dados de inscrição estadual por UF para alguns estados
      // Tentamos a API pública de consulta estadual via ReceitaWS
      const res = await fetch("https://receitaws.com.br/v1/cnpj/" + cnpjLimpo, {
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        const d = await res.json();
        return {
          inscricaoEstadual: d.inscricao_estadual || d.ie || "",
          situacaoEstadual: d.situacao || "",
        };
      }
    } catch {}
    return { inscricaoEstadual: "", situacaoEstadual: "" };
  };

  // ── Busca dados municipais via CEP (logradouro, IBGE) ────────────────────
  const buscarDadosMunicipais = async (cep) => {
    if (!cep) return {};
    const cepLimpo = cep.replace(/\D/g, "");
    try {
      const res = await fetch("https://brasilapi.com.br/api/cep/v2/" + cepLimpo);
      if (res.ok) {
        const d = await res.json();
        return {
          codigoIBGE: d.ibge || "",
          municipio:  d.city  || "",
          uf:         d.state || "",
          bairro:     d.neighborhood || "",
          logradouro: d.street || "",
        };
      }
    } catch {}
    return {};
  };

  // ── Busca regime no Simples Nacional (CNPJ Receita via ReceitaWS fallback) ─
  const buscarRegimeSimples = async (cnpjLimpo) => {
    try {
      const res = await fetch(
        "https://www.receitaws.com.br/v1/cnpj/" + cnpjLimpo
      );
      if (res.ok) {
        const d = await res.json();
        if (d.simples === "Sim" || d.simei === "Sim") return d.simei === "Sim" ? "MEI" : "Simples Nacional";
        if (d.simples === "Não") return null; // não é optante, detectar pelo porte
      }
    } catch {}
    return null;
  };

  const consultarCNPJ = async (cnpjRaw) => {
    const cnpjLimpo = cnpjRaw.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) return;
    setCnpjStatus("loading");
    setCnpjMsg("⏳ Consultando Receita Federal (1/3)...");
    setDadosRFB(null);
    try {
      // ── ETAPA 1: Dados gerais — BrasilAPI (base RFB) ──────────────────────
      const res = await fetch("https://brasilapi.com.br/api/cnpj/v1/" + cnpjLimpo);
      if (!res.ok) throw new Error("CNPJ não encontrado ou inválido (status " + res.status + ")");
      const d = await res.json();
      setDadosRFB(d);

      // ── ETAPA 2: Regime tributário real ───────────────────────────────────
      setCnpjMsg("⏳ Identificando regime tributário (2/3)...");
      let regimeReal = detectarRegime(d);
      // Segunda tentativa: ReceitaWS (tem campo "simples")
      try {
        const resRWS = await fetch("https://receitaws.com.br/v1/cnpj/" + cnpjLimpo);
        if (resRWS.ok) {
          const dRWS = await resRWS.json();
          if (dRWS.simei === "Sim") regimeReal = "MEI";
          else if (dRWS.simples === "Sim") regimeReal = "Simples Nacional";
          else if (dRWS.simples === "Não" && regimeReal === "Simples Nacional") {
            // Não é optante Simples — refinar pelo porte/capital
            const cap = parseFloat(d.capital_social || 0);
            regimeReal = cap > 78000000 ? "Lucro Real" : cap > 20000000 ? "Lucro Presumido" : "Lucro Presumido";
          }
        }
      } catch {}

      // ── ETAPA 3: Dados municipais via CEP ────────────────────────────────
      setCnpjMsg("⏳ Buscando dados municipais (3/3)...");
      const cepRaw = d.cep || "";
      const dadosMun = await buscarDadosMunicipais(cepRaw);

      // ── Formatar campos ───────────────────────────────────────────────────
      const cnaeFormatado = d.cnae_fiscal
        ? String(d.cnae_fiscal).replace(/^(\d{4})(\d)(\d{2})$/, "$1-$2/$3")
        : "";
      const secStr = (d.cnaes_secundarios || []).slice(0,5).map(c => c.codigo + " - " + c.descricao).join(" | ");
      const sociosList = (d.qsa || []).map(s => ({
        nome: s.nome_socio || s.nome,
        qualificacao: s.qualificacao_socio || s.qualificacao,
        cpf: s.cpf_representante_legal || ""
      }));
      const telefoneFormatado = d.ddd_telefone_1
        ? "(" + d.ddd_telefone_1.slice(0,2) + ") " + d.ddd_telefone_1.slice(2).trim()
        : "";
      const cepFormatado = cepRaw.replace(/^(\d{5})(\d{3})$/, "$1-$2");

      // ── Situação estadual: a IE não vem da RFB federal ────────────────────
      // Mostramos orientação de onde obter por UF
      const ufStr = d.uf || dadosMun.uf || "";
      const ieOrientacao = ufStr ? "Consultar SEFAZ-" + ufStr + " com o CNPJ" : "Consultar SEFAZ estadual";
      const imOrientacao = d.municipio ? "Consultar Prefeitura de " + d.municipio : "Consultar prefeitura municipal";

      setForm(f => ({
        ...f,
        // ── Federal ──
        razaoSocial:           d.razao_social || f.razaoSocial,
        nomeFantasia:          d.nome_fantasia || "",
        cnpj:                  formatarCNPJ(cnpjLimpo),
        cnae:                  cnaeFormatado || f.cnae,
        regime:                regimeReal,
        situacao:              d.descricao_situacao_cadastral || "",
        dataAbertura:          d.data_inicio_atividade || "",
        naturezaJuridica:      d.natureza_juridica || "",
        porte:                 d.porte || "",
        capitalSocial:         d.capital_social
          ? "R$ " + parseFloat(d.capital_social).toLocaleString("pt-BR", {minimumFractionDigits:2})
          : "",
        optanteSimples:        d.opcao_pelo_simples === true || String(d.opcao_pelo_simples) === "true",
        optanteMEI:            d.opcao_pelo_mei === true || String(d.opcao_pelo_mei) === "true",
        // ── Contato ──
        telefone:              telefoneFormatado,
        email:                 (d.email || "").toLowerCase(),
        // ── Endereço ──
        logradouro:            d.logradouro || dadosMun.logradouro || "",
        numero:                d.numero || "",
        complemento:           d.complemento || "",
        bairro:                d.bairro || dadosMun.bairro || "",
        municipio:             d.municipio || dadosMun.municipio || "",
        uf:                    ufStr,
        cep:                   cepFormatado,
        codigoIBGE:            dadosMun.codigoIBGE || "",
        // ── Estadual / Municipal ──
        inscricaoEstadual:     f.inscricaoEstadual || "",
        inscricaoMunicipal:    f.inscricaoMunicipal || "",
        ieOrientacao,
        imOrientacao,
        // ── Atividades ──
        atividadesPrincipais:  d.cnae_fiscal_descricao || "",
        atividadesSecundarias: secStr,
        socios:                sociosList,
        // ── Obrigações ──
        obrigacoesSelecionadas: OBRIGACOES_POR_REGIME[regimeReal] || [],
      }));

      // ── Atualizar status estadual/municipal ──────────────────────────────
      if (dadosMun.codigoIBGE) {
        setDadosMunicipal(dadosMun);
        setStatusMunicipal("success");
        setForm(f => ({...f, codigoIBGE: dadosMun.codigoIBGE}));
      } else {
        setStatusMunicipal("error");
      }
      // IE não retornada por API pública — marcar como manual necessária
      setStatusEstadual("error");
      setDadosEstadual({ situacao: d.descricao_situacao_cadastral || "" });

      setCnpjStatus("success");
      setCnpjMsg("✅ RFB + Municípios consultados com sucesso!");
      setMostrarDadosRFB(true);
    } catch(err) {
      setCnpjStatus("error");
      setCnpjMsg("❌ " + (err.message || "Erro ao consultar CNPJ — verifique a conexão"));
    }
  };

  const handleCnpjChange = (val) => {
    const fmt = formatarCNPJ(val);
    setForm(f => ({...f, cnpj: fmt}));
    const limpo = val.replace(/\D/g,"");
    if (limpo.length === 14) {
      consultarCNPJ(limpo);
    } else {
      setCnpjStatus("idle");
      setCnpjMsg("");
    }
  };

  const periodoColor = { Mensal:"#0ea5e9", Anual:"#7c3aed", Semestral:"#f59e0b", Eventual:"#6b7280", Trimestral:"#22c55e" };

  const contarAba = (abaKey) => {
    const ids = ABAS_OBRIGACOES[abaKey].categorias.flatMap(c => (CATALOGO_OBRIGACOES[c]||[]).map(o=>o.id));
    return ids.filter(id => form.obrigacoesSelecionadas.includes(id)).length;
  };

  const abas = [
    { key:"dados",           label:"🏢 Dados Cadastrais" },
    { key:"federais",        label:"🏛️ Federais",        cor:"#0ea5e9" },
    { key:"previdenciarias", label:"👷 Previdenciárias", cor:"#f59e0b" },
    { key:"estaduais",       label:"🏢 Estaduais",       cor:"#a78bfa" },
    { key:"municipais",      label:"🏙️ Municipais",      cor:"#22d3ee" },
    { key:"fiscal",          label:"⚖️ Enquadramento" },
  ];

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-xl">
        <div className="modal-header">
          <div>
            <h2>{editando ? "Editar Cliente" : "Novo Cliente"}</h2>
            {form.obrigacoesSelecionadas.length > 0 &&
              <span style={{fontSize:12,color:"var(--text3)",marginTop:3,display:"block"}}>
                📋 {form.obrigacoesSelecionadas.length} obrigações selecionadas no total
              </span>
            }
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button className="btn-sugerir" onClick={autoPreencherPorRegime}>✨ Sugerir pelo Regime</button>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="modal-tabs">
          {abas.map(aba => {
            const cnt = aba.cor ? contarAba(aba.key) : 0;
            return (
              <button key={aba.key} className={`modal-tab ${abaAtiva===aba.key?"active":""}`} onClick={()=>setAbaAtiva(aba.key)}>
                {aba.label}
                {cnt > 0 && <span className="tab-count" style={{background: aba.cor}}>{cnt}</span>}
              </button>
            );
          })}
        </div>

        <div className="modal-body">
          {abaAtiva === "dados" && (
            <div className="form-grid form-grid-3">
              <div className="form-group span-2"><label>Razão Social *</label><input value={form.razaoSocial} onChange={e=>setForm({...form,razaoSocial:e.target.value})} placeholder="Nome completo da empresa" /></div>
              <div className="form-group"><label>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Ativo</option><option>Suspenso</option><option>Encerrado</option></select></div>
              <div className="form-group">
                <label style={{display:"flex",alignItems:"center",gap:8}}>
                  CNPJ *
                  {cnpjStatus==="loading" && <span style={{fontSize:10,color:"var(--accent)",fontWeight:600,animation:"pulse 1s infinite"}}>⏳ Consultando RFB...</span>}
                  {cnpjStatus==="success" && <span style={{fontSize:10,color:"var(--green)",fontWeight:600}}>✅ Receita Federal</span>}
                  {cnpjStatus==="error"   && <span style={{fontSize:10,color:"var(--red)",  fontWeight:600}}>❌ Não encontrado</span>}
                </label>
                <div style={{position:"relative"}}>
                  <input
                    value={form.cnpj}
                    onChange={e=>handleCnpjChange(e.target.value)}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    style={{paddingRight: cnpjStatus!=="idle"?36:undefined}}
                  />
                  {cnpjStatus==="loading" && (
                    <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:16}}>⏳</span>
                  )}
                  {cnpjStatus==="success" && (
                    <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:16}}>✅</span>
                  )}
                </div>
                {cnpjMsg && (
                  <span style={{
                    fontSize:11,marginTop:3,display:"block",
                    color: cnpjStatus==="success"?"var(--green)":cnpjStatus==="error"?"var(--red)":"var(--accent)",
                    fontWeight:600
                  }}>{cnpjMsg}</span>
                )}
              </div>
              {/* ── Campo IE com botão do Agente IA ── */}
              <div className="form-group">
                <label style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                  Inscrição Estadual
                  {statusEstadual==="loading" && <span style={{fontSize:9,color:"var(--accent)",fontWeight:700}}>⏳ SEFAZ...</span>}
                  {statusEstadual==="success" && <span style={{fontSize:9,color:"var(--green)",fontWeight:700}}>✅ SEFAZ-{form.uf}</span>}
                  {statusEstadual==="manual"  && <span style={{fontSize:9,color:"var(--orange)",fontWeight:700}}>✏️ Manual</span>}
                  {form.cnpj.replace(/\D/g,"").length===14 && (
                    <button
                      onClick={()=>setMostrarAgenteIE(true)}
                      style={{
                        marginLeft:"auto",padding:"2px 9px",borderRadius:6,border:"1px solid rgba(124,58,237,0.4)",
                        background:"linear-gradient(135deg,rgba(124,58,237,0.12),rgba(14,165,233,0.08))",
                        color:"#a78bfa",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"var(--font)",
                        display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap"
                      }}>
                      🤖 Consultar IE com IA
                    </button>
                  )}
                </label>
                <div style={{display:"flex",gap:6}}>
                  <input
                    value={form.inscricaoEstadual}
                    onChange={e=>{setForm({...form,inscricaoEstadual:e.target.value});setStatusEstadual("manual");}}
                    placeholder={form.uf ? "SEFAZ-"+form.uf+" — ou clique em Consultar IE" : "Número IE"}
                    style={{flex:1}}
                  />
                  {form.cnpj.replace(/\D/g,"").length===14 && (
                    <button
                      onClick={()=>setMostrarAgenteIE(true)}
                      title="Consultar IE automaticamente via Agente IA"
                      style={{
                        width:36,height:36,borderRadius:7,border:"1px solid rgba(124,58,237,0.3)",
                        background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(14,165,233,0.1))",
                        cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",
                        flexShrink:0
                      }}>🤖</button>
                  )}
                </div>
                {dadosEstadual && dadosEstadual.situacao && (
                  <span style={{fontSize:10,color:"var(--text3)",marginTop:2,display:"block"}}>
                    Situação SEFAZ: <strong style={{color:dadosEstadual.situacao==="ATIVA"?"var(--green)":"var(--orange)"}}>{dadosEstadual.situacao}</strong>
                  </span>
                )}
                {statusEstadual==="error" && !form.inscricaoEstadual && (
                  <span style={{fontSize:10,color:"var(--orange)",marginTop:3,display:"flex",alignItems:"center",gap:5}}>
                    ⚠️ IE não retornada pelas APIs — 
                    <button onClick={()=>setMostrarAgenteIE(true)} style={{background:"none",border:"none",color:"#a78bfa",cursor:"pointer",fontWeight:700,fontSize:10,padding:0,fontFamily:"var(--font)"}}>
                      usar Agente IA →
                    </button>
                  </span>
                )}
              </div>

              {/* Modal do Agente IE */}
              {mostrarAgenteIE && (
                <AgenteIE
                  cnpj={form.cnpj}
                  uf={form.uf}
                  razaoSocial={form.razaoSocial}
                  onIeEncontrada={(ie, ufRetorno) => {
                    setForm(f => ({...f, inscricaoEstadual: ie}));
                    setStatusEstadual("success");
                    setMostrarAgenteIE(false);
                  }}
                  onClose={()=>setMostrarAgenteIE(false)}
                />
              )}
              {/* ── Campo IM com status de consulta ── */}
              <div className="form-group">
                <label style={{display:"flex",alignItems:"center",gap:6}}>
                  Inscrição Municipal
                  {statusMunicipal==="loading" && <span style={{fontSize:9,color:"var(--accent)",fontWeight:700}}>⏳ Prefeitura...</span>}
                  {statusMunicipal==="success" && <span style={{fontSize:9,color:"var(--green)",fontWeight:700}}>✅ Município</span>}
                  {statusMunicipal==="manual"  && <span style={{fontSize:9,color:"var(--orange)",fontWeight:700}}>✏️ Manual</span>}
                </label>
                <input
                  value={form.inscricaoMunicipal}
                  onChange={e=>{setForm({...form,inscricaoMunicipal:e.target.value});setStatusMunicipal("manual");}}
                  placeholder={form.municipio ? "Consultar Pref. "+form.municipio : "Número IM"}
                />
                {dadosMunicipal && dadosMunicipal.codigoIBGE && (
                  <span style={{fontSize:10,color:"var(--text3)",marginTop:2,display:"block"}}>
                    IBGE: <strong style={{color:"var(--accent)"}}>{dadosMunicipal.codigoIBGE}</strong> · {dadosMunicipal.municipio}/{dadosMunicipal.uf}
                  </span>
                )}
                {statusMunicipal==="error" && (
                  <span style={{fontSize:10,color:"var(--orange)",marginTop:2,display:"block"}}>
                    ⚠️ IM não disponível via API — insira manualmente
                  </span>
                )}
              </div>
              <div className="form-group"><label>CNAE Principal</label><input value={form.cnae} onChange={e=>setForm({...form,cnae:e.target.value})} placeholder="0000-0/00" /></div>
              {form.nomeFantasia !== undefined && (
                <div className="form-group span-2"><label>Nome Fantasia</label><input value={form.nomeFantasia||""} onChange={e=>setForm({...form,nomeFantasia:e.target.value})} placeholder="Nome fantasia (se houver)" /></div>
              )}
              {form.telefone !== undefined && (
                <div className="form-group"><label>Telefone</label><input value={form.telefone||""} onChange={e=>setForm({...form,telefone:e.target.value})} placeholder="(00) 00000-0000" /></div>
              )}
              {form.email !== undefined && (
                <div className="form-group span-2"><label>E-mail</label><input value={form.email||""} onChange={e=>setForm({...form,email:e.target.value})} placeholder="empresa@email.com" /></div>
              )}
              {form.municipio && (
                <div className="form-group span-3">
                  <label>Endereço <span style={{fontSize:10,color:"var(--green)",fontWeight:600}}>✅ RFB</span></label>
                  <input readOnly value={[form.logradouro,form.numero,form.complemento,form.bairro,form.municipio+"/"+form.uf,"CEP "+form.cep].filter(Boolean).join(", ")} style={{color:"var(--text2)"}}/>
                </div>
              )}
              <div className="form-group"><label>Regime Tributário</label>
                <select value={form.regime} onChange={e => {
                  const novoRegime = e.target.value;
                  setForm({
                    ...form,
                    regime: novoRegime,
                    obrigacoesSelecionadas: OBRIGACOES_POR_REGIME[novoRegime] || []
                  });
                }}>
                  <option>Simples Nacional</option><option>Lucro Presumido</option><option>Lucro Real</option><option>MEI</option>
                </select>
              </div>
              <div className="form-group"><label>Responsável</label>
                <select value={form.responsavel} onChange={e=>setForm({...form,responsavel:e.target.value})}>
                  {usuarios.filter(u=>u.ativo).map(u=><option key={u.id}>{u.nome}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Classificação de Risco</label>
                <select value={form.risco} onChange={e=>setForm({...form,risco:e.target.value})}>
                  <option>Baixo</option><option>Médio</option><option>Alto</option>
                </select>
              </div>
              <div className="form-group span-3">
                <div style={{background:"var(--bg3)",borderRadius:8,padding:"10px 14px",fontSize:12,color:"var(--text3)",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  💡 Use as abas acima para selecionar obrigações por esfera, ou clique em
                  <button className="btn-sugerir" style={{padding:"4px 10px",fontSize:11}} onClick={autoPreencherPorRegime}>
                    ✨ Sugerir pelo Regime ({form.regime})
                  </button>
                </div>
              </div>

              {/* ── PAINEL COMPLETO: Federal + Estadual + Municipal ── */}
              {dadosRFB && mostrarDadosRFB && (
                <div className="form-group span-3">
                  <div style={{borderRadius:14,overflow:"hidden",border:"1px solid rgba(14,165,233,0.2)"}}>

                    {/* ── CABEÇALHO ── */}
                    <div style={{
                      background:"linear-gradient(135deg,rgba(14,165,233,0.12),rgba(124,58,237,0.08))",
                      padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",
                      borderBottom:"1px solid rgba(14,165,233,0.15)"
                    }}>
                      <div style={{display:"flex",gap:16,alignItems:"center"}}>
                        <span style={{fontWeight:800,fontSize:13,color:"var(--accent)"}}>🏛️ Retorno das APIs — Dados Consultados Automaticamente</span>
                        <span style={{fontSize:11,background:"var(--green-dim)",color:"var(--green)",padding:"2px 8px",borderRadius:10,fontWeight:700}}>
                          {cnpjStatus==="success" ? "✅ Atualizado" : "⏳ Carregando"}
                        </span>
                      </div>
                      <button onClick={()=>setMostrarDadosRFB(false)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:18}}>✕</button>
                    </div>

                    {/* ── SEÇÃO 1: RECEITA FEDERAL ── */}
                    <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                        <span style={{fontSize:18}}>🏛️</span>
                        <span style={{fontWeight:700,fontSize:12,color:"#0ea5e9",textTransform:"uppercase",letterSpacing:".5px"}}>Receita Federal do Brasil — CNPJ</span>
                        <span style={{marginLeft:"auto",fontSize:11,color:"var(--green)",fontWeight:600}}>✅ BrasilAPI / ReceitaWS</span>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10}}>
                        {[
                          ["Razão Social",       form.razaoSocial,                "var(--text)"],
                          ["Nome Fantasia",      form.nomeFantasia||"—",          "var(--text2)"],
                          ["Situação Cadastral", form.situacao,                   form.situacao==="ATIVA"?"var(--green)":form.situacao?"var(--orange)":"var(--text2)"],
                          ["Data de Abertura",   form.dataAbertura||"—",          "var(--text2)"],
                          ["Natureza Jurídica",  form.naturezaJuridica||"—",      "var(--text2)"],
                          ["Porte da Empresa",   form.porte||"—",                 "var(--text2)"],
                          ["Capital Social",     form.capitalSocial||"—",         "var(--green)"],
                          ["CNAE Principal",     form.cnae||"—",                  "var(--accent)"],
                          ["Atividade",          form.atividadesPrincipais||"—",  "var(--text2)"],
                        ].map(([l,v,cor])=>(
                          <div key={l} style={{background:"var(--bg3)",borderRadius:7,padding:"8px 10px"}}>
                            <span style={{display:"block",fontSize:9,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>{l}</span>
                            <span style={{display:"block",fontSize:12,fontWeight:600,marginTop:2,color:cor,wordBreak:"break-word"}}>{v}</span>
                          </div>
                        ))}
                      </div>

                      {/* Regime Tributário com badge especial */}
                      <div style={{
                        background:"linear-gradient(135deg,rgba(14,165,233,0.1),rgba(124,58,237,0.08))",
                        border:"1px solid rgba(14,165,233,0.25)",borderRadius:9,padding:"10px 14px",
                        display:"flex",alignItems:"center",gap:12,marginBottom:10
                      }}>
                        <span style={{fontSize:22}}>⚖️</span>
                        <div style={{flex:1}}>
                          <span style={{display:"block",fontSize:10,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Regime Tributário Identificado</span>
                          <span style={{display:"block",fontSize:16,fontWeight:800,color:"var(--accent)",marginTop:2}}>{form.regime}</span>
                          <span style={{fontSize:11,color:"var(--text3)"}}>
                            {form.optanteMEI   && "✅ Optante MEI  "}
                            {form.optanteSimples && !form.optanteMEI && "✅ Optante Simples Nacional  "}
                            {!form.optanteSimples && !form.optanteMEI && "📋 Regime apurado pelo porte/capital  "}
                            · Capital: {form.capitalSocial||"N/A"}
                          </span>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <span style={{
                            fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:6,
                            background: form.regime==="MEI"?"rgba(245,158,11,0.15)":
                                        form.regime==="Simples Nacional"?"rgba(34,197,94,0.12)":
                                        form.regime==="Lucro Real"?"rgba(14,165,233,0.12)":"rgba(124,58,237,0.12)",
                            color: form.regime==="MEI"?"var(--orange)":
                                   form.regime==="Simples Nacional"?"var(--green)":
                                   form.regime==="Lucro Real"?"var(--accent)":"#a78bfa",
                            border: "1px solid currentColor"
                          }}>{form.regime}</span>
                        </div>
                      </div>

                      {/* Contato + Endereço */}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                        <div style={{background:"var(--bg3)",borderRadius:7,padding:"8px 10px"}}>
                          <span style={{display:"block",fontSize:9,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>📞 Contato</span>
                          <span style={{display:"block",fontSize:12,color:"var(--text2)",marginTop:2}}>{form.telefone||"—"}</span>
                          <span style={{display:"block",fontSize:11,color:"var(--text3)"}}>{form.email||"—"}</span>
                        </div>
                        <div style={{background:"var(--bg3)",borderRadius:7,padding:"8px 10px"}}>
                          <span style={{display:"block",fontSize:9,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>📍 Endereço</span>
                          <span style={{display:"block",fontSize:11,color:"var(--text2)",marginTop:2,lineHeight:1.5}}>
                            {form.logradouro}{form.numero?", "+form.numero:""}{form.complemento?" — "+form.complemento:""}<br/>
                            {form.bairro} · {form.municipio}/{form.uf} · CEP {form.cep}
                          </span>
                        </div>
                      </div>

                      {/* QSA Sócios */}
                      {form.socios && form.socios.length > 0 && (
                        <div style={{background:"var(--bg3)",borderRadius:7,padding:"10px 12px"}}>
                          <span style={{fontSize:9,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:8}}>👥 Quadro Societário (QSA)</span>
                          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                            {form.socios.map((s,i)=>(
                              <div key={i} style={{display:"flex",alignItems:"center",gap:8,background:"var(--bg4)",borderRadius:7,padding:"6px 10px",minWidth:200}}>
                                <div style={{width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,var(--accent),#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>
                                  {(s.nome||"?").charAt(0)}
                                </div>
                                <div>
                                  <span style={{display:"block",fontWeight:700,color:"var(--text)",fontSize:12}}>{s.nome}</span>
                                  <span style={{fontSize:10,color:"var(--text3)"}}>{s.qualificacao}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── SEÇÃO 2: ESTADUAL (SEFAZ) ── */}
                    <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",background:"rgba(167,139,250,0.03)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                        <span style={{fontSize:18}}>🏢</span>
                        <span style={{fontWeight:700,fontSize:12,color:"#a78bfa",textTransform:"uppercase",letterSpacing:".5px"}}>SEFAZ Estadual — {form.uf||"UF"}</span>
                        <span style={{marginLeft:"auto",fontSize:11,
                          color: statusEstadual==="success"?"var(--green)":statusEstadual==="error"?"var(--orange)":"var(--text3)",
                          fontWeight:600
                        }}>
                          {statusEstadual==="success"?"✅ Consultado":statusEstadual==="loading"?"⏳ Consultando...":"⚠️ Inserção manual necessária"}
                        </span>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                        <div style={{background:"var(--bg3)",borderRadius:7,padding:"10px 12px",gridColumn:"span 1"}}>
                          <span style={{display:"block",fontSize:9,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Inscrição Estadual (IE)</span>
                          <span style={{display:"block",fontSize:14,fontWeight:800,color: form.inscricaoEstadual?"#a78bfa":"var(--text3)",marginTop:4}}>
                            {form.inscricaoEstadual || "Não disponível via API"}
                          </span>
                          {statusEstadual==="manual" && <span style={{fontSize:10,color:"var(--orange)"}}>✏️ Inserido manualmente</span>}
                        </div>
                        <div style={{background:"var(--bg3)",borderRadius:7,padding:"10px 12px"}}>
                          <span style={{display:"block",fontSize:9,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>UF / Estado</span>
                          <span style={{display:"block",fontSize:14,fontWeight:800,color:"#a78bfa",marginTop:4}}>{form.uf||"—"}</span>
                        </div>
                        <div style={{background:"var(--bg3)",borderRadius:7,padding:"10px 12px"}}>
                          <span style={{display:"block",fontSize:9,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Situação Estadual</span>
                          <span style={{display:"block",fontSize:12,fontWeight:700,color: dadosEstadual?.situacao==="ATIVA"?"var(--green)":dadosEstadual?.situacao?"var(--orange)":"var(--text3)",marginTop:4}}>
                            {dadosEstadual?.situacao || "Consultar SEFAZ-"+(form.uf||"UF")}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.2)",
                        borderRadius:8,padding:"10px 14px",fontSize:11,color:"var(--text3)",lineHeight:1.7
                      }}>
                        <strong style={{color:"#a78bfa",display:"block",marginBottom:4}}>ℹ️ Sobre a Inscrição Estadual</strong>
                        A IE é emitida pela SEFAZ-{form.uf||"UF"} e não está disponível nas APIs públicas federais.
                        Para obtê-la: acesse o portal da SEFAZ-{form.uf||"UF"} e consulte com o CNPJ, ou insira o número manualmente no campo acima.
                        <br/>
                        {form.uf==="GO" && <span style={{color:"#a78bfa",fontWeight:600}}>🔗 SEFAZ-GO: sefaz.go.gov.br — Consulta de IE pelo CNPJ</span>}
                        {form.uf==="SP" && <span style={{color:"#a78bfa",fontWeight:600}}>🔗 SEFAZ-SP: nfp.fazenda.sp.gov.br — Consulta de Contribuinte</span>}
                        {form.uf==="MG" && <span style={{color:"#a78bfa",fontWeight:600}}>🔗 SEFAZ-MG: siare.fazenda.mg.gov.br</span>}
                        {form.uf==="RJ" && <span style={{color:"#a78bfa",fontWeight:600}}>🔗 SEFAZ-RJ: sefaz.rj.gov.br — CADWeb</span>}
                        {form.uf==="RS" && <span style={{color:"#a78bfa",fontWeight:600}}>🔗 SEFAZ-RS: sefaz.rs.gov.br — Consulta CIC/CNPJ</span>}
                        {form.uf==="BA" && <span style={{color:"#a78bfa",fontWeight:600}}>🔗 SEFAZ-BA: sefaz.ba.gov.br — SICAD</span>}
                        {form.uf==="PR" && <span style={{color:"#a78bfa",fontWeight:600}}>🔗 SEFAZ-PR: sefaz.pr.gov.br — Cadastro de Contribuintes</span>}
                        {form.uf==="SC" && <span style={{color:"#a78bfa",fontWeight:600}}>🔗 SEF-SC: sef.sc.gov.br — SINTEGRA</span>}
                      </div>
                    </div>

                    {/* ── SEÇÃO 3: MUNICIPAL (IBGE + Prefeitura) ── */}
                    <div style={{padding:"14px 16px",background:"rgba(34,211,238,0.02)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                        <span style={{fontSize:18}}>🏙️</span>
                        <span style={{fontWeight:700,fontSize:12,color:"#22d3ee",textTransform:"uppercase",letterSpacing:".5px"}}>Município — {form.municipio||"Município"}/{form.uf||"UF"}</span>
                        <span style={{marginLeft:"auto",fontSize:11,
                          color: dadosMunicipal?.codigoIBGE?"var(--green)":"var(--text3)",fontWeight:600
                        }}>
                          {dadosMunicipal?.codigoIBGE?"✅ IBGE / BrasilAPI":"⚠️ Inserção manual necessária"}
                        </span>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                        <div style={{background:"var(--bg3)",borderRadius:7,padding:"10px 12px"}}>
                          <span style={{display:"block",fontSize:9,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Inscrição Municipal (IM)</span>
                          <span style={{display:"block",fontSize:14,fontWeight:800,color: form.inscricaoMunicipal?"#22d3ee":"var(--text3)",marginTop:4}}>
                            {form.inscricaoMunicipal || "Não disponível via API"}
                          </span>
                          {statusMunicipal==="manual" && <span style={{fontSize:10,color:"var(--orange)"}}>✏️ Inserido manualmente</span>}
                        </div>
                        <div style={{background:"var(--bg3)",borderRadius:7,padding:"10px 12px"}}>
                          <span style={{display:"block",fontSize:9,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Código IBGE</span>
                          <span style={{display:"block",fontSize:14,fontWeight:800,color:"#22d3ee",marginTop:4}}>
                            {form.codigoIBGE || dadosMunicipal?.codigoIBGE || "—"}
                          </span>
                        </div>
                        <div style={{background:"var(--bg3)",borderRadius:7,padding:"10px 12px"}}>
                          <span style={{display:"block",fontSize:9,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Município/UF</span>
                          <span style={{display:"block",fontSize:13,fontWeight:700,color:"#22d3ee",marginTop:4}}>{form.municipio||"—"}/{form.uf||"—"}</span>
                        </div>
                      </div>
                      <div style={{
                        background:"rgba(34,211,238,0.05)",border:"1px solid rgba(34,211,238,0.2)",
                        borderRadius:8,padding:"10px 14px",fontSize:11,color:"var(--text3)",lineHeight:1.7
                      }}>
                        <strong style={{color:"#22d3ee",display:"block",marginBottom:4}}>ℹ️ Sobre a Inscrição Municipal</strong>
                        A IM é emitida pela Prefeitura de {form.municipio||"seu município"} e não está disponível nas APIs públicas.
                        Código IBGE do município: <strong style={{color:"#22d3ee"}}>{form.codigoIBGE||dadosMunicipal?.codigoIBGE||"—"}</strong>.
                        Acesse o portal da prefeitura municipal com o CNPJ para obter a IM, ou insira manualmente no campo acima.
                      </div>
                    </div>

                    {/* ── RODAPÉ ── */}
                    <div style={{
                      padding:"8px 16px",background:"var(--bg3)",borderTop:"1px solid var(--border)",
                      display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"
                    }}>
                      <span style={{fontSize:10,color:"var(--text3)"}}>
                        🔗 Fontes: <span style={{color:"var(--accent)"}}>BrasilAPI</span> (CNPJ/CEP) · <span style={{color:"#a78bfa"}}>ReceitaWS</span> (Simples/MEI) · <span style={{color:"#22d3ee"}}>IBGE</span> (Municípios)
                      </span>
                      <span style={{fontSize:10,color:"var(--text3)",marginLeft:"auto"}}>
                        Campos IE e IM devem ser confirmados junto às respectivas secretarias
                      </span>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {["federais","previdenciarias","estaduais","municipais"].includes(abaAtiva) && (
            <div>
              <div className="ob-resumo-bar">
                <span>{form.obrigacoesSelecionadas.length} obrigações selecionadas no total</span>
                <button className="btn-link" onClick={()=>setForm(f=>({...f,obrigacoesSelecionadas:[]}))}>Limpar tudo</button>
              </div>
              <PainelObrigacoesAba
                abaKey={abaAtiva}
                form={form}
                setForm={setForm}
                periodoColor={periodoColor}
              />
            </div>
          )}

          {abaAtiva === "fiscal" && (
            <div>
              <p className="form-hint">Resumo do enquadramento tributário e obrigações selecionadas por esfera.</p>
              <div className="enquadramento-grid">
                <div className="enq-card"><span className="enq-label">Regime</span><strong>{form.regime}</strong></div>
                <div className="enq-card"><span className="enq-label">Total de Obrigações</span><strong>{form.obrigacoesSelecionadas.length}</strong></div>
                <div className="enq-card"><span className="enq-label">Responsável</span><strong>{form.responsavel}</strong></div>
                <div className="enq-card"><span className="enq-label">Risco Fiscal</span><StatusBadge status={form.risco}/></div>
              </div>
              <div className="enq-por-cat">
                {Object.entries(ABAS_OBRIGACOES).map(([abaKey, grupo]) => {
                  const ids = grupo.categorias.flatMap(c => (CATALOGO_OBRIGACOES[c]||[]).map(o=>o.id));
                  const selecionadas = ids.filter(id => form.obrigacoesSelecionadas.includes(id));
                  if (!selecionadas.length) return null;
                  return (
                    <div key={abaKey} style={{marginBottom:10,padding:"10px 14px",borderRadius:8,background:"var(--bg3)",borderLeft:`3px solid ${grupo.cor}`}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{color:grupo.cor,fontWeight:700,fontSize:13}}>{grupo.label}</span>
                        <span style={{fontSize:11,color:grupo.cor,background:`${grupo.cor}22`,padding:"2px 8px",borderRadius:10}}>{selecionadas.length} obrigações</span>
                      </div>
                      <div className="enq-ob-tags">
                        {selecionadas.map(id => {
                          const ob = TODAS_OBRIGACOES_LISTA.find(o=>o.id===id);
                          return <span key={id} className="enq-ob-tag" style={{color:grupo.cor,background:`${grupo.cor}15`,borderColor:`${grupo.cor}33`}}>{id}</span>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={()=>onSalvar(form)}>
            {editando ? "Salvar Alterações" : "Cadastrar Cliente"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PÁGINAS
// ═══════════════════════════════════════════════════════

function Dashboard({ obrigacoes, clientes }) {
  const hoje2 = new Date(); hoje2.setHours(0,0,0,0);
  const proxSemana = new Date(hoje2); proxSemana.setDate(proxSemana.getDate()+7);
  const obHoje = obrigacoes.filter(o=>{const v=new Date(o.vencimento);v.setHours(0,0,0,0);return v.getTime()===hoje2.getTime()&&o.status==="Pendente";});
  const obSemana = obrigacoes.filter(o=>{const v=new Date(o.vencimento);v.setHours(0,0,0,0);return v>hoje2&&v<=proxSemana&&o.status==="Pendente";});
  const obAtrasadas = obrigacoes.filter(o=>o.status==="Atrasada");
  const obEntregues = obrigacoes.filter(o=>o.status==="Entregue");
  const total = obrigacoes.length;

  const porMes = Array.from({length:6},(_,i)=>{
    const m=new Date(anoAtual,mesAtual-5+i,1);
    const label=m.toLocaleString("pt-BR",{month:"short"}).toUpperCase();
    const entregues=obrigacoes.filter(o=>{const v=new Date(o.vencimento);return v.getMonth()===m.getMonth()&&v.getFullYear()===m.getFullYear()&&o.status==="Entregue";}).length;
    const pendentes=obrigacoes.filter(o=>{const v=new Date(o.vencimento);return v.getMonth()===m.getMonth()&&v.getFullYear()===m.getFullYear()&&o.status!=="Entregue";}).length;
    return{label,entregues,pendentes};
  });
  const maxBar=Math.max(...porMes.map(m=>m.entregues+m.pendentes),1);
  const rankingRisco=clientes.map(c=>({...c,qtdAtrasadas:obrigacoes.filter(o=>o.clienteId===c.id&&o.status==="Atrasada").length,qtdPendentes:obrigacoes.filter(o=>o.clienteId===c.id&&o.status==="Pendente").length})).sort((a,b)=>b.qtdAtrasadas-a.qtdAtrasadas).slice(0,5);

  return (
    <div className="page-content">
      <div className="page-header">
        <div><h1 className="page-title">Dashboard Gerencial</h1><p className="page-sub">Visão consolidada — {hoje.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</p></div>
      </div>
      <div className="kpi-grid">
        {[[obHoje.length,"⏰","Vencem Hoje","kpi-urgent"],[obSemana.length,"📅","Esta Semana","kpi-week"],[obAtrasadas.length,"🚨","Em Atraso","kpi-late"],[obEntregues.length,"✅","Entregues","kpi-done"],[clientes.filter(c=>c.status==="Ativo").length,"🏢","Clientes Ativos","kpi-clients"],[Math.round(obEntregues.length/total*100)+"%","📊","Taxa de Entrega","kpi-total"]].map(([n,ic,l,cls],i)=>(
          <div key={i} className={`kpi-card ${cls}`}><div className="kpi-icon">{ic}</div><div className="kpi-info"><span className="kpi-num">{n}</span><span className="kpi-label">{l}</span></div></div>
        ))}
      </div>
      <div className="dash-row">
        <div className="card chart-card">
          <h3 className="card-title">Volume de Entregas — Últimos 6 Meses</h3>
          <div className="bar-chart">{porMes.map((m,i)=>(<div key={i} className="bar-group"><div className="bars"><div className="bar bar-entregue" style={{height:`${(m.entregues/maxBar)*120}px`}}/><div className="bar bar-pendente" style={{height:`${(m.pendentes/maxBar)*120}px`}}/></div><span className="bar-label">{m.label}</span></div>))}</div>
          <div className="chart-legend"><span><span className="leg-dot leg-green"/>Entregues</span><span><span className="leg-dot leg-orange"/>Pendentes</span></div>
        </div>
        <div className="card">
          <h3 className="card-title">🚨 Ranking de Risco por Cliente</h3>
          <div className="ranking-list">{rankingRisco.map((c,i)=>(<div key={c.id} className="ranking-item"><div className="ranking-pos">{i+1}</div><div className="ranking-info"><span className="ranking-nome">{c.razaoSocial}</span><span className="ranking-regime">{c.regime}</span></div><div className="ranking-stats"><span className="stat-late">{c.qtdAtrasadas} atrasadas</span><span className="stat-pend">{c.qtdPendentes} pendentes</span></div><StatusBadge status={c.risco}/></div>))}</div>
        </div>
      </div>
      <div className="card">
        <h3 className="card-title">⚡ Obrigações Urgentes</h3>
        {[...obHoje,...obAtrasadas.slice(0,5)].length===0?<p className="empty-msg">Nenhuma obrigação urgente 🎉</p>:
          <table className="data-table"><thead><tr><th>Cliente</th><th>Obrigação</th><th>Vencimento</th><th>Status</th></tr></thead>
          <tbody>{[...obHoje,...obAtrasadas.slice(0,5)].slice(0,8).map(o=>(<tr key={o.id}><td>{o.clienteNome.split(" ").slice(0,2).join(" ")}</td><td><strong>{o.obrigacao}</strong></td><td className={new Date(o.vencimento)<hoje?"text-red":""}>{fmt(new Date(o.vencimento))}</td><td><StatusBadge status={o.status}/></td></tr>))}</tbody></table>}
      </div>
    </div>
  );
}

function Clientes({ clientes, setClientes, obrigacoes, usuarios }) {
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmExcluir, setConfirmExcluir] = useState(null); // cliente a excluir
  const [msgSalvo, setMsgSalvo] = useState("");

  const limparTodosClientes = () => {
    if (!window.confirm("Tem certeza? Todos os clientes e obrigações serão removidos permanentemente.")) return;
    localStorage.removeItem(DB_CLIENTES_KEY);
    setClientes([]);
    setMsgSalvo("🗑️ Todos os clientes foram removidos.");
    setTimeout(() => setMsgSalvo(""), 3500);
  };

  const filtrados = clientes.filter(c =>
    c.razaoSocial.toLowerCase().includes(busca.toLowerCase()) || c.cnpj.includes(busca)
  );

  const abrirNovo = () => { setEditando(null); setModal(true); };
  const abrirEditar = (c) => { setEditando(c); setModal(true); };

  const salvar = (form) => {
    if (!form.razaoSocial || !form.cnpj) return;
    let nova;
    if (editando) {
      nova = clientes.map(c => c.id === editando.id ? { ...form, id: editando.id } : c);
    } else {
      nova = [...clientes, { ...form, id: Date.now() }];
    }
    setClientes(nova);
    setModal(false);
    setMsgSalvo(editando ? "✅ Cliente atualizado e salvo!" : "✅ Cliente cadastrado e salvo!");
    setTimeout(() => setMsgSalvo(""), 3500);
  };

  const excluir = (cliente) => {
    const nova = clientes.filter(c => c.id !== cliente.id);
    setClientes(nova);
    setConfirmExcluir(null);
    setMsgSalvo("🗑️ " + cliente.razaoSocial.split(" ")[0] + " excluído com sucesso.");
    setTimeout(() => setMsgSalvo(""), 3000);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestão de Clientes</h1>
          <p className="page-sub">{clientes.filter(c=>c.status==="Ativo").length} clientes ativos · {clientes.length} total</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {msgSalvo && (
            <span style={{
              fontSize:12,fontWeight:700,padding:"6px 14px",borderRadius:8,
              background: msgSalvo.startsWith("🗑️") ? "var(--red-dim)" : "var(--green-dim)",
              color: msgSalvo.startsWith("🗑️") ? "var(--red)" : "var(--green)",
              border: "1px solid " + (msgSalvo.startsWith("🗑️") ? "rgba(239,68,68,.25)" : "rgba(34,197,94,.25)"),
              animation:"fadeIn .3s"
            }}>{msgSalvo}</span>
          )}
          {clientes.length > 0 && (
            <button
              onClick={limparTodosClientes}
              style={{
                padding:"8px 14px",borderRadius:8,border:"1px solid var(--red-dim)",
                background:"rgba(239,68,68,0.07)",color:"var(--red)",fontSize:12,
                fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"
              }}>
              🗑️ Limpar todos
            </button>
          )}
          <button className="btn-primary" onClick={abrirNovo}>+ Novo Cliente</button>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input className="search-input" placeholder="Buscar por razão social ou CNPJ..." value={busca} onChange={e=>setBusca(e.target.value)}/>
          <span style={{fontSize:11,color:"var(--text3)",marginLeft:"auto"}}>
            💾 Dados salvos automaticamente no navegador
          </span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Razão Social</th><th>CNPJ</th><th>Regime</th><th>Responsável</th>
              <th>Obrigações</th><th>Risco</th><th>Status</th>
              <th style={{textAlign:"center"}}>Editar</th>
              <th style={{textAlign:"center",color:"#ef4444"}}>Excluir</th>
            </tr>
          </thead>
          <tbody>{filtrados.map(c => {
            const atr = obrigacoes.filter(o => o.clienteId === c.id && o.status === "Atrasada").length;
            return (
              <tr key={c.id}>
                <td>
                  <strong>{c.razaoSocial}</strong>
                  {c.nomeFantasia && <span style={{display:"block",fontSize:10,color:"var(--text3)"}}>{c.nomeFantasia}</span>}
                  <small className="text-muted">{c.cnae}</small>
                </td>
                <td className="mono">{c.cnpj}</td>
                <td><span className="regime-tag">{c.regime}</span></td>
                <td>{c.responsavel}</td>
                <td>
                  <span className="ob-count-badge">{c.obrigacoesSelecionadas?.length||0} obrig.</span>
                  {atr > 0 && <span className="badge-count"> {atr} atr.</span>}
                </td>
                <td><StatusBadge status={c.risco}/></td>
                <td><StatusBadge status={c.status}/></td>
                <td style={{textAlign:"center"}}>
                  <button
                    className="btn-icon"
                    title="Editar cliente"
                    onClick={() => abrirEditar(c)}>✏️</button>
                </td>
                <td style={{textAlign:"center"}}>
                  <button
                    title="Excluir cliente permanentemente"
                    onClick={() => setConfirmExcluir(c)}
                    style={{
                      width:32,height:32,borderRadius:8,
                      border:"1px solid rgba(239,68,68,0.35)",
                      background:"rgba(239,68,68,0.07)",
                      color:"#ef4444",cursor:"pointer",fontSize:15,
                      display:"inline-flex",alignItems:"center",
                      justifyContent:"center",transition:"all .2s",
                      fontFamily:"var(--font)"
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.18)";e.currentTarget.style.borderColor="rgba(239,68,68,0.6)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.07)";e.currentTarget.style.borderColor="rgba(239,68,68,0.35)";}}>
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}</tbody>
        </table>

        {filtrados.length === 0 && (
          <div style={{textAlign:"center",padding:"40px",color:"var(--text3)"}}>
            <span style={{fontSize:40,display:"block",marginBottom:10}}>🔍</span>
            <p>Nenhum cliente encontrado para "<strong>{busca}</strong>"</p>
          </div>
        )}
      </div>

      {/* Modal de edição/cadastro */}
      {modal && (
        <ModalCliente
          onClose={() => setModal(false)}
          onSalvar={salvar}
          usuarios={usuarios}
          editando={editando}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmExcluir && (
        <div className="modal-overlay" onClick={() => setConfirmExcluir(null)}>
          <div className="modal" style={{maxWidth:440}} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{borderBottom:"1px solid rgba(239,68,68,0.2)"}}>
              <h2 style={{color:"#ef4444",display:"flex",alignItems:"center",gap:10}}>
                🗑️ Excluir Cliente
              </h2>
              <button className="modal-close" onClick={() => setConfirmExcluir(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{
                background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.2)",
                borderRadius:10,padding:"16px 20px",marginBottom:16
              }}>
                <p style={{fontWeight:700,fontSize:14,color:"var(--text)",marginBottom:6}}>
                  {confirmExcluir.razaoSocial}
                </p>
                <p style={{fontSize:12,color:"var(--text3)"}}>
                  CNPJ: {confirmExcluir.cnpj} · {confirmExcluir.regime}
                </p>
                <p style={{fontSize:12,color:"var(--text3)",marginTop:4}}>
                  {confirmExcluir.obrigacoesSelecionadas?.length || 0} obrigações vinculadas
                </p>
              </div>
              <p style={{fontSize:13,color:"var(--text3)",marginBottom:6,lineHeight:1.6}}>
                ⚠️ Esta ação é permanente. O cliente e todas suas configurações serão removidos do sistema. As obrigações e histórico relacionados não serão excluídos automaticamente.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setConfirmExcluir(null)}>
                Cancelar
              </button>
              <button
                onClick={() => excluir(confirmExcluir)}
                style={{
                  padding:"9px 20px",borderRadius:8,border:"none",cursor:"pointer",
                  background:"linear-gradient(135deg,#dc2626,#ef4444)",color:"white",
                  fontWeight:700,fontSize:13,fontFamily:"var(--font)"
                }}>
                🗑️ Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Obrigacoes({ obrigacoes, setObrigacoes, clientes }) {
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroCliente, setFiltroCliente] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(false);
  const [selecionada, setSelecionada] = useState(null);
  const filtradas = obrigacoes.filter(o=>{
    const mS=filtroStatus==="Todos"||o.status===filtroStatus;
    const mT=filtroTipo==="Todos"||o.tipo===filtroTipo;
    const mC=filtroCliente==="Todos"||o.clienteId===parseInt(filtroCliente);
    const mB=o.obrigacao.toLowerCase().includes(busca.toLowerCase())||o.clienteNome.toLowerCase().includes(busca.toLowerCase());
    return mS&&mT&&mC&&mB;
  }).sort((a,b)=>new Date(a.vencimento)-new Date(b.vencimento));
  const marcarEntregue=(id)=>setObrigacoes(obrigacoes.map(o=>o.id===id?{...o,status:"Entregue"}:o));
  return (
    <div className="page-content">
      <div className="page-header"><div><h1 className="page-title">Controle de Obrigações</h1><p className="page-sub">{filtradas.length} obrigações encontradas</p></div></div>
      <div className="card">
        <div className="table-toolbar flex-wrap">
          <input className="search-input" placeholder="Buscar..." value={busca} onChange={e=>setBusca(e.target.value)}/>
          <div className="filter-group">
            <select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)}><option>Todos</option><option>Pendente</option><option>Entregue</option><option>Atrasada</option></select>
            <select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)}><option>Todos</option><option>Federal</option><option>Estadual</option><option>Municipal</option></select>
            <select value={filtroCliente} onChange={e=>setFiltroCliente(e.target.value)}><option value="Todos">Todos os clientes</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.razaoSocial.split(" ").slice(0,3).join(" ")}</option>)}</select>
          </div>
        </div>
        <table className="data-table">
          <thead><tr><th>Cliente</th><th>Obrigação</th><th>Tipo</th><th>Competência</th><th>Vencimento</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>{filtradas.slice(0,60).map(o=>{
            const dias=diasRestantes(o.vencimento);
            return(<tr key={o.id} className={o.status==="Atrasada"?"row-late":dias<=3&&o.status==="Pendente"?"row-urgent":""}><td><strong>{o.clienteNome.split(" ").slice(0,2).join(" ")}</strong></td><td><span className="ob-nome">{o.obrigacao}</span></td><td><span className={`tipo-tag tipo-${o.tipo.toLowerCase()}`}>{o.tipo}</span></td><td className="mono">{o.competencia}</td><td><span className={dias<0?"text-red":dias<=3?"text-orange":""}>{fmt(new Date(o.vencimento))}</span>{o.status!=="Entregue"&&<span className="dias-hint">{dias<0?` (${Math.abs(dias)}d atr.)`:dias===0?" (Hoje)":`(${dias}d)`}</span>}</td><td><StatusBadge status={o.status}/></td><td><button className="btn-icon" onClick={()=>{setSelecionada(o);setModal(true);}}>📋</button>{o.status!=="Entregue"&&<button className="btn-icon btn-check" onClick={()=>marcarEntregue(o.id)}>✓</button>}</td></tr>);
          })}</tbody>
        </table>
      </div>
      {modal&&selecionada&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal"><div className="modal-header"><h2>Detalhes da Obrigação</h2><button className="modal-close" onClick={()=>setModal(false)}>✕</button></div>
          <div className="modal-body"><div className="detalhe-grid"><div className="detalhe-item"><span className="detalhe-label">Obrigação</span><strong>{selecionada.obrigacao}</strong></div><div className="detalhe-item"><span className="detalhe-label">Cliente</span><span>{selecionada.clienteNome}</span></div><div className="detalhe-item"><span className="detalhe-label">Tipo</span><span className={`tipo-tag tipo-${selecionada.tipo.toLowerCase()}`}>{selecionada.tipo}</span></div><div className="detalhe-item"><span className="detalhe-label">Regime</span><span>{selecionada.regime}</span></div><div className="detalhe-item"><span className="detalhe-label">Competência</span><span className="mono">{selecionada.competencia}</span></div><div className="detalhe-item"><span className="detalhe-label">Vencimento</span><span>{fmt(new Date(selecionada.vencimento))}</span></div></div>
          <div className="upload-zone"><span>📎 Arraste o recibo de transmissão aqui</span></div>
          {selecionada.status!=="Entregue"&&<button className="btn-primary btn-full" onClick={()=>{marcarEntregue(selecionada.id);setModal(false);}}>✓ Marcar como Entregue</button>}</div></div>
        </div>
      )}
    </div>
  );
}

function Calendario({ obrigacoes }) {
  const [mesVis, setMesVis] = useState(mesAtual);
  const [anoVis, setAnoVis] = useState(anoAtual);
  const [diaModal, setDiaModal] = useState(null);
  const primeiroDia=new Date(anoVis,mesVis,1).getDay();
  const diasNoMes=new Date(anoVis,mesVis+1,0).getDate();
  const obPorDia={};
  obrigacoes.forEach(o=>{const v=new Date(o.vencimento);if(v.getMonth()===mesVis&&v.getFullYear()===anoVis){const d=v.getDate();if(!obPorDia[d])obPorDia[d]=[];obPorDia[d].push(o);}});
  const nomeMes=new Date(anoVis,mesVis,1).toLocaleString("pt-BR",{month:"long",year:"numeric"});
  const dias=[...Array.from({length:primeiroDia},(_,i)=>({vazio:true,i})),...Array.from({length:diasNoMes},(_,i)=>({dia:i+1,obs:obPorDia[i+1]||[]}))];
  return (
    <div className="page-content">
      <div className="page-header"><div><h1 className="page-title">Calendário Fiscal</h1><p className="page-sub">Vencimentos e competências</p></div>
        <div className="cal-nav"><button className="btn-nav" onClick={()=>{if(mesVis===0){setMesVis(11);setAnoVis(anoVis-1);}else setMesVis(mesVis-1);}}>‹</button><span className="cal-mes">{nomeMes.charAt(0).toUpperCase()+nomeMes.slice(1)}</span><button className="btn-nav" onClick={()=>{if(mesVis===11){setMesVis(0);setAnoVis(anoVis+1);}else setMesVis(mesVis+1);}}>›</button></div>
      </div>
      <div className="card">
        <div className="cal-grid-header">{["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d=><span key={d} className="cal-dow">{d}</span>)}</div>
        <div className="cal-grid">{dias.map((item,i)=>{
          if(item.vazio)return<div key={`v${i}`} className="cal-cell cal-empty"/>;
          const isHoje=item.dia===hoje.getDate()&&mesVis===mesAtual&&anoVis===anoAtual;
          const temAtr=item.obs.some(o=>o.status==="Atrasada");
          const temPend=item.obs.some(o=>o.status==="Pendente");
          return(<div key={item.dia} className={`cal-cell ${isHoje?"cal-today":""} ${item.obs.length?"cal-has-obs":""}`} onClick={()=>item.obs.length&&setDiaModal({dia:item.dia,obs:item.obs})}>
            <span className="cal-day-num">{item.dia}</span>
            {temAtr&&<span className="cal-dot cal-dot-red"/>}{temPend&&!temAtr&&<span className="cal-dot cal-dot-orange"/>}{item.obs.length>0&&!temAtr&&!temPend&&<span className="cal-dot cal-dot-green"/>}
            {item.obs.length>0&&<span className="cal-count">{item.obs.length}</span>}
          </div>);
        })}</div>
        <div className="cal-legend"><span><span className="leg-dot" style={{background:"#ef4444"}}/>Em atraso</span><span><span className="leg-dot" style={{background:"#f59e0b"}}/>Pendente</span><span><span className="leg-dot" style={{background:"#22c55e"}}/>Entregue</span></div>
      </div>
      {diaModal&&(<div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDiaModal(null)}><div className="modal"><div className="modal-header"><h2>Obrigações — {String(diaModal.dia).padStart(2,"0")}/{String(mesVis+1).padStart(2,"0")}/{anoVis}</h2><button className="modal-close" onClick={()=>setDiaModal(null)}>✕</button></div><div className="modal-body">{diaModal.obs.map(o=>(<div key={o.id} className="cal-ob-item"><StatusBadge status={o.status}/><div><strong>{o.obrigacao}</strong><span className="text-muted"> — {o.clienteNome.split(" ").slice(0,2).join(" ")}</span></div><span className={`tipo-tag tipo-${o.tipo.toLowerCase()}`}>{o.tipo}</span></div>))}</div></div></div>)}
    </div>
  );
}

// ── NOVA PÁGINA: DECLARAÇÕES FISCAIS ────────────────────

function Declaracoes({ clientes }) {
  const [esferaSel, setEsferaSel] = useState("Todas");
  const [periodSel, setPeriodSel] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [clienteSel, setClienteSel] = useState(null);

  const esferas = ["Todas", "FEDERAIS — SPED / Escrituração Digital", "FEDERAIS — Declarações", "FEDERAIS — Simples Nacional", "FEDERAIS — Previdenciárias e Trabalhistas", "ESTADUAIS — ICMS", "MUNICIPAIS — ISS"];
  const periodos = ["Todas", "Mensal", "Anual", "Semestral", "Trimestral", "Eventual"];

  const periodoColor = { Mensal:"#0ea5e9", Anual:"#7c3aed", Semestral:"#f59e0b", Eventual:"#94a3b8", Trimestral:"#22c55e" };
  const periodoIcon = { Mensal:"📅", Anual:"📆", Semestral:"🗓️", Eventual:"⚡", Trimestral:"📋" };

  const todasFiltradas = TODAS_OBRIGACOES_LISTA.filter(ob => {
    const matchCat = esferaSel === "Todas" || ob.categoria === esferaSel;
    const matchPer = periodSel === "Todas" || ob.periodicidade === periodSel;
    const matchBusca = ob.nome.toLowerCase().includes(busca.toLowerCase()) || ob.id.toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchPer && matchBusca;
  });

  const clientesFiltrados = clienteSel
    ? [clientes.find(c=>c.id===clienteSel)].filter(Boolean)
    : clientes;

  const totalPorCategoria = Object.entries(CATALOGO_OBRIGACOES).map(([cat,obs]) => ({
    cat, total: obs.length,
    fed: cat.startsWith("FEDERAL") ? obs.length : 0,
  }));

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Declarações Fiscais</h1>
          <p className="page-sub">Catálogo completo — {TODAS_OBRIGACOES_LISTA.length} obrigações cadastradas</p>
        </div>
      </div>

      {/* KPIs por esfera */}
      <div className="decl-kpi-row">
        {[
          { label:"Federais", count: TODAS_OBRIGACOES_LISTA.filter(o=>o.categoria.startsWith("FEDERAL")).length, icon:"🏛️", color:"#0ea5e9" },
          { label:"Estaduais", count: TODAS_OBRIGACOES_LISTA.filter(o=>o.categoria.startsWith("ESTADUAL")).length, icon:"🏢", color:"#a78bfa" },
          { label:"Municipais", count: TODAS_OBRIGACOES_LISTA.filter(o=>o.categoria.startsWith("MUNICIPAL")).length, icon:"🏙️", color:"#22d3ee" },
          { label:"Mensais", count: TODAS_OBRIGACOES_LISTA.filter(o=>o.periodicidade==="Mensal").length, icon:"📅", color:"#22c55e" },
          { label:"Anuais", count: TODAS_OBRIGACOES_LISTA.filter(o=>o.periodicidade==="Anual").length, icon:"📆", color:"#f59e0b" },
          { label:"Eventuais", count: TODAS_OBRIGACOES_LISTA.filter(o=>o.periodicidade==="Eventual").length, icon:"⚡", color:"#94a3b8" },
        ].map((k,i) => (
          <div key={i} className="decl-kpi" style={{borderLeftColor:k.color}}>
            <span className="decl-kpi-icon">{k.icon}</span>
            <span className="decl-kpi-num" style={{color:k.color}}>{k.count}</span>
            <span className="decl-kpi-label">{k.label}</span>
          </div>
        ))}
      </div>

      <div className="dash-row" style={{alignItems:"flex-start"}}>
        {/* Painel de filtros + catálogo */}
        <div style={{flex:2}}>
          <div className="card">
            <div className="table-toolbar flex-wrap">
              <input className="search-input" placeholder="Buscar por sigla ou nome..." value={busca} onChange={e=>setBusca(e.target.value)}/>
              <select value={esferaSel} onChange={e=>setEsferaSel(e.target.value)} style={{maxWidth:260}}>
                {esferas.map(e=><option key={e}>{e}</option>)}
              </select>
              <select value={periodSel} onChange={e=>setPeriodSel(e.target.value)}>
                {periodos.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>

            {Object.entries(CATALOGO_OBRIGACOES).map(([cat, obs]) => {
              const filtrado = obs.filter(ob=>{
                const matchCat = esferaSel==="Todas"||esferaSel===cat;
                const matchPer = periodSel==="Todas"||ob.periodicidade===periodSel;
                const matchBusca = ob.nome.toLowerCase().includes(busca.toLowerCase())||ob.id.toLowerCase().includes(busca.toLowerCase());
                return matchCat&&matchPer&&matchBusca;
              });
              if (!filtrado.length) return null;
              const isEsf = cat.startsWith("FEDERAL") ? "federal" : cat.startsWith("ESTADUAL") ? "estadual" : "municipal";
              return (
                <div key={cat} className="decl-categoria">
                  <div className={`decl-cat-header decl-cat-${isEsf}`}>
                    <span className="decl-cat-titulo">{cat}</span>
                    <span className="decl-cat-badge">{filtrado.length} obrigações</span>
                  </div>
                  <div className="decl-tabela">
                    {filtrado.map(ob => (
                      <div key={ob.id} className="decl-row">
                        <div className="decl-sigla">{ob.id}</div>
                        <div className="decl-info">
                          <span className="decl-nome">{ob.nome}</span>
                          <span className="decl-base">{ob.base}</span>
                        </div>
                        <div className="decl-periodo" style={{background:`${periodoColor[ob.periodicidade]}22`,color:periodoColor[ob.periodicidade]}}>
                          {periodoIcon[ob.periodicidade]} {ob.periodicidade}
                        </div>
                        <div className="decl-clientes-count">
                          {clientes.filter(c=>c.obrigacoesSelecionadas?.includes(ob.id)).length > 0 && (
                            <span className="decl-clientes-badge">
                              {clientes.filter(c=>c.obrigacoesSelecionadas?.includes(ob.id)).length} cliente(s)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel lateral: obrigações por cliente */}
        <div style={{flex:1}}>
          <div className="card">
            <h3 className="card-title">📊 Obrigações por Cliente</h3>
            <div style={{marginBottom:10}}>
              <select style={{width:"100%"}} value={clienteSel||""} onChange={e=>setClienteSel(e.target.value?parseInt(e.target.value):null)}>
                <option value="">Todos os clientes</option>
                {clientes.map(c=><option key={c.id} value={c.id}>{c.razaoSocial.split(" ").slice(0,3).join(" ")}</option>)}
              </select>
            </div>
            {clientes.filter(c=>!clienteSel||c.id===clienteSel).map(c => {
              const obs = (c.obrigacoesSelecionadas||[]).map(id=>TODAS_OBRIGACOES_LISTA.find(o=>o.id===id)).filter(Boolean);
              if (!obs.length) return null;
              const fed = obs.filter(o=>o.categoria.startsWith("FEDERAL")).length;
              const est = obs.filter(o=>o.categoria.startsWith("ESTADUAL")).length;
              const mun = obs.filter(o=>o.categoria.startsWith("MUNICIPAL")).length;
              return (
                <div key={c.id} className="decl-cliente-card">
                  <div className="decl-cli-header">
                    <div>
                      <span className="decl-cli-nome">{c.razaoSocial.split(" ").slice(0,3).join(" ")}</span>
                      <span className="regime-tag" style={{marginLeft:6}}>{c.regime}</span>
                    </div>
                    <span className="decl-cli-total">{obs.length} total</span>
                  </div>
                  <div className="decl-cli-bars">
                    {fed>0&&<div className="decl-cli-bar-item"><span style={{color:"#0ea5e9"}}>🏛️ Federal</span><strong>{fed}</strong></div>}
                    {est>0&&<div className="decl-cli-bar-item"><span style={{color:"#a78bfa"}}>🏢 Estadual</span><strong>{est}</strong></div>}
                    {mun>0&&<div className="decl-cli-bar-item"><span style={{color:"#22d3ee"}}>🏙️ Municipal</span><strong>{mun}</strong></div>}
                  </div>
                  <div className="decl-cli-tags">
                    {obs.slice(0,8).map(o=><span key={o.id} className="enq-ob-tag">{o.id}</span>)}
                    {obs.length>8&&<span className="enq-ob-tag" style={{background:"#1e3248",color:"#8ba4bf"}}>+{obs.length-8}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Alertas() {
  const [alertas, setAlertas] = useState(alertas_mock);
  const [config, setConfig] = useState({email:true,whatsapp:false,dias:[1,3,7]});
  const marcarLido=(id)=>setAlertas(alertas.map(a=>a.id===id?{...a,lido:true}:a));
  const toggleDia=(d)=>setConfig({...config,dias:config.dias.includes(d)?config.dias.filter(x=>x!==d):[...config.dias,d].sort((a,b)=>a-b)});
  const iconeTipo={atraso:"🚨",vencendo:"⚠️",documento:"📄",sistema:"⚙️"};
  return (
    <div className="page-content">
      <div className="page-header"><div><h1 className="page-title">Central de Alertas</h1><p className="page-sub">{alertas.filter(a=>!a.lido).length} não lidos</p></div></div>
      <div className="dash-row">
        <div className="card" style={{flex:2}}>
          <h3 className="card-title">Notificações Recentes</h3>
          <div className="alertas-list">{alertas.map(a=>(<div key={a.id} className={`alerta-item ${!a.lido?"alerta-unread":""}`}><span className="alerta-icon">{iconeTipo[a.tipo]}</span><div className="alerta-body"><p className="alerta-msg">{a.mensagem}</p><span className="alerta-time">{a.data}</span></div>{!a.lido&&<button className="btn-icon" onClick={()=>marcarLido(a.id)}>✓</button>}</div>))}</div>
        </div>
        <div className="card" style={{flex:1}}>
          <h3 className="card-title">⚙️ Configurar Alertas</h3>
          <div className="config-section">
            <h4 className="config-title">Canais de Notificação</h4>
            <label className="toggle-label"><input type="checkbox" checked={config.email} onChange={()=>setConfig({...config,email:!config.email})}/><span className="toggle-slider"/>📧 E-mail</label>
            <label className="toggle-label"><input type="checkbox" checked={config.whatsapp} onChange={()=>setConfig({...config,whatsapp:!config.whatsapp})}/><span className="toggle-slider"/>📱 WhatsApp</label>
          </div>
          <div className="config-section">
            <h4 className="config-title">Lembretes Antecipados</h4>
            <p className="config-sub">Avisar com quantos dias de antecedência?</p>
            <div className="dias-grid">{[1,2,3,5,7,10,15,30].map(d=>(<button key={d} className={`dia-btn ${config.dias.includes(d)?"dia-btn-active":""}`} onClick={()=>toggleDia(d)}>{d}d</button>))}</div>
          </div>
          <button className="btn-primary btn-full">Salvar Configurações</button>
        </div>
      </div>
    </div>
  );
}

function Documentos({ clientes }) {
  const [dragOver, setDragOver] = useState(false);
  const docs = [{id:1,clienteId:1,nome:"DCTF_Jan2026_Recibo.pdf",tipo:"PDF",tamanho:"245 KB",data:"15/01/2026",obrigacao:"DCTF"},{id:2,clienteId:3,nome:"ECF_2025_Transmissão.pdf",tipo:"PDF",tamanho:"1.2 MB",data:"31/07/2025",obrigacao:"ECF"},{id:3,clienteId:2,nome:"PGDAS-D_Dez2025.pdf",tipo:"PDF",tamanho:"189 KB",data:"20/12/2025",obrigacao:"PGDAS-D"},{id:4,clienteId:4,nome:"EFD_ICMS_IPI_Out2025.txt",tipo:"TXT",tamanho:"8.9 MB",data:"10/11/2025",obrigacao:"EFD ICMS/IPI"}];
  const iconeDoc=(n)=>n.endsWith(".pdf")?"📄":n.endsWith(".xml")?"📋":n.endsWith(".txt")?"📝":"📁";
  return (
    <div className="page-content">
      <div className="page-header"><div><h1 className="page-title">Gestão Documental</h1><p className="page-sub">Armazenamento organizado por cliente e competência</p></div></div>
      <div className="dash-row">
        <div className="card" style={{flex:2}}>
          <table className="data-table"><thead><tr><th>Arquivo</th><th>Cliente</th><th>Obrigação</th><th>Tipo</th><th>Tamanho</th><th>Data</th></tr></thead>
          <tbody>{docs.map(d=>{const c=clientes.find(x=>x.id===d.clienteId);return(<tr key={d.id}><td>{iconeDoc(d.nome)} <span className="doc-nome">{d.nome}</span></td><td>{c?.razaoSocial.split(" ").slice(0,2).join(" ")}</td><td><strong>{d.obrigacao}</strong></td><td><span className="tipo-tag tipo-federal">{d.tipo}</span></td><td className="mono">{d.tamanho}</td><td className="mono">{d.data}</td></tr>);})}</tbody></table>
        </div>
        <div className="card" style={{flex:1}}>
          <h3 className="card-title">Upload de Documento</h3>
          <div className={`upload-zone-lg ${dragOver?"upload-drag":""}`} onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);}}>
            <div className="upload-icon">☁️</div><p className="upload-title">Arraste arquivos aqui</p><p className="upload-sub">ou clique para selecionar</p><p className="upload-types">PDF, XML, TXT, ZIP • Máx. 50MB</p>
          </div>
          <div className="form-group" style={{marginTop:14}}><label>Cliente</label><select>{clientes.map(c=><option key={c.id}>{c.razaoSocial.split(" ").slice(0,3).join(" ")}</option>)}</select></div>
          <div className="form-group"><label>Competência</label><input type="month" defaultValue={`${anoAtual}-${String(mesAtual+1).padStart(2,"0")}`}/></div>
          <button className="btn-primary btn-full">📤 Fazer Upload</button>
        </div>
      </div>
    </div>
  );
}

function Equipe({ clientes, usuarios, setUsuarios }) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const salvar = (form) => {
    if (!form.nome||!form.email) return;
    if (editando) setUsuarios(usuarios.map(u=>u.id===editando.id?{...form,id:editando.id,entregas:editando.entregas}:u));
    else setUsuarios([...usuarios, {...form, id:Date.now(), entregas:0}]);
    setModal(false);
  };

  const logAuditoria = [
    {user:"Ana Lima",acao:"Marcou DCTF como entregue",cliente:"Tech Solutions Ltda",data:"Hoje 10:23"},
    {user:"Carlos Souza",acao:"Cadastrou novo cliente",cliente:"Farmácia Saúde Total",data:"Hoje 09:41"},
    {user:"Pedro Costa",acao:"Upload de recibo EFD-Reinf",cliente:"Indústria Metalúrgica XYZ",data:"Ontem 16:55"},
    {user:"Ana Lima",acao:"Alterou responsável da obrigação",cliente:"Consultoria ABC S/A",data:"Ontem 14:12"},
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div><h1 className="page-title">Gestão de Equipe</h1><p className="page-sub">{usuarios.filter(u=>u.ativo).length} usuários ativos</p></div>
        <button className="btn-primary" onClick={()=>{setEditando(null);setModal(true);}}>+ Novo Usuário</button>
      </div>
      <div className="dash-row">
        <div className="card" style={{flex:2}}>
          <h3 className="card-title">Usuários do Sistema</h3>
          <table className="data-table">
            <thead><tr><th>Nome</th><th>E-mail</th><th>Cargo</th><th>Perfil</th><th>Empresas</th><th>Entregas</th><th>Status</th><th></th></tr></thead>
            <tbody>{usuarios.map(u=>{
              const clientesResp = clientes.filter(c=>(u.clientesIds||[]).includes(c.id));
              return(<tr key={u.id}>
                <td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="avatar-sm">{u.nome.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><strong>{u.nome}</strong></div></td>
                <td className="mono" style={{fontSize:11}}>{u.email}</td>
                <td style={{fontSize:12,color:"var(--text2)"}}>{u.cargo||"-"}</td>
                <td><span className={`perfil-tag perfil-${u.perfil.toLowerCase()}`}>{u.perfil}</span></td>
                <td>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {clientesResp.length===0?<span className="text-muted" style={{fontSize:11}}>Nenhuma</span>:clientesResp.slice(0,2).map(c=><span key={c.id} className="enq-ob-tag" style={{fontSize:10}}>{c.razaoSocial.split(" ")[0]}</span>)}
                    {clientesResp.length>2&&<span className="enq-ob-tag" style={{fontSize:10,background:"#1e3248"}}>+{clientesResp.length-2}</span>}
                  </div>
                </td>
                <td style={{fontWeight:700,color:"var(--accent)"}}>{u.entregas}</td>
                <td><StatusBadge status={u.ativo?"Ativo":"Suspenso"}/></td>
                <td><button className="btn-icon" onClick={()=>{setEditando(u);setModal(true);}}>✏️</button></td>
              </tr>);
            })}</tbody>
          </table>
        </div>
        <div className="card" style={{flex:1}}>
          <h3 className="card-title">📋 Log de Auditoria</h3>
          <div className="audit-list">{logAuditoria.map((l,i)=>(<div key={i} className="audit-item"><div className="audit-dot"/><div className="audit-body"><span className="audit-user">{l.user}</span><span className="audit-acao">{l.acao}</span><span className="audit-cliente">→ {l.cliente}</span><span className="audit-time">{l.data}</span></div></div>))}</div>
        </div>
      </div>
      {modal && <ModalUsuario onClose={()=>setModal(false)} onSalvar={salvar} clientes={clientes} usuarios={usuarios} editando={editando}/>}
    </div>
  );
}

function Relatorios({ clientes, obrigacoes }) {
  const total=obrigacoes.length;
  const entregues=obrigacoes.filter(o=>o.status==="Entregue").length;
  const atrasadas=obrigacoes.filter(o=>o.status==="Atrasada").length;
  const pendentes=obrigacoes.filter(o=>o.status==="Pendente").length;
  return (
    <div className="page-content">
      <div className="page-header"><div><h1 className="page-title">Relatórios e Análises</h1><p className="page-sub">Indicadores de compliance e desempenho</p></div><button className="btn-primary">📥 Exportar PDF</button></div>
      <div className="dash-row">
        <div className="card">
          <h3 className="card-title">Análise de Compliance</h3>
          <div className="compliance-circle-wrap">
            <svg viewBox="0 0 120 120" className="donut-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#22c55e" strokeWidth="12" strokeDasharray={`${(entregues/total)*314} 314`} strokeDashoffset="78.5" strokeLinecap="round"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray={`${(atrasadas/total)*314} 314`} strokeDashoffset={`${78.5-(entregues/total)*314}`} strokeLinecap="round"/>
              <text x="60" y="55" textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="bold">{Math.round(entregues/total*100)}%</text>
              <text x="60" y="73" textAnchor="middle" fill="#94a3b8" fontSize="9">compliance</text>
            </svg>
          </div>
          <div className="compliance-stats">
            <div className="cs-item"><span className="cs-dot" style={{background:"#22c55e"}}/><span>Entregues</span><strong>{entregues}</strong></div>
            <div className="cs-item"><span className="cs-dot" style={{background:"#f59e0b"}}/><span>Pendentes</span><strong>{pendentes}</strong></div>
            <div className="cs-item"><span className="cs-dot" style={{background:"#ef4444"}}/><span>Atrasadas</span><strong>{atrasadas}</strong></div>
          </div>
        </div>
        <div className="card">
          <h3 className="card-title">Por Regime Tributário</h3>
          {["Simples Nacional","Lucro Presumido","Lucro Real","MEI"].map(r=>{
            const t=obrigacoes.filter(o=>o.regime===r).length;
            const ok=obrigacoes.filter(o=>o.regime===r&&o.status==="Entregue").length;
            if(!t)return null;
            const pct=Math.round(ok/t*100);
            return(<div key={r} className="regime-bar-item"><div className="regime-bar-label"><span>{r}</span><span>{pct}%</span></div><div className="regime-bar-track"><div className="regime-bar-fill" style={{width:`${pct}%`,background:pct>=80?"#22c55e":pct>=50?"#f59e0b":"#ef4444"}}/></div><span className="regime-bar-total">{ok}/{t}</span></div>);
          })}
        </div>
        <div className="card">
          <h3 className="card-title">Por Esfera</h3>
          {["Federal","Estadual","Municipal"].map(tipo=>{
            const t=obrigacoes.filter(o=>o.tipo===tipo).length;
            const ok=obrigacoes.filter(o=>o.tipo===tipo&&o.status==="Entregue").length;
            const atr=obrigacoes.filter(o=>o.tipo===tipo&&o.status==="Atrasada").length;
            return(<div key={tipo} className="tipo-stat-item"><div className="tipo-ico">{tipo==="Federal"?"🏛️":tipo==="Estadual"?"🏢":"🏙️"}</div><div className="tipo-stat-body"><strong>{tipo}</strong><div className="tipo-stat-bar-wrap"><div className="tipo-stat-bar" style={{width:`${ok/t*100}%`,background:"#22c55e"}}/><div className="tipo-stat-bar" style={{width:`${atr/t*100}%`,background:"#ef4444"}}/></div></div><div className="tipo-stat-nums"><span>{ok} ok</span><span className="text-red">{atr} atr</span></div></div>);
          })}
        </div>
      </div>
      <div className="card">
        <h3 className="card-title">Relatório por Cliente</h3>
        <table className="data-table"><thead><tr><th>Cliente</th><th>Regime</th><th>Total</th><th>Entregues</th><th>Pendentes</th><th>Atrasadas</th><th>Compliance</th></tr></thead>
        <tbody>{clientes.map(c=>{const obs=obrigacoes.filter(o=>o.clienteId===c.id);const ent=obs.filter(o=>o.status==="Entregue").length;const pend=obs.filter(o=>o.status==="Pendente").length;const atr=obs.filter(o=>o.status==="Atrasada").length;const comp=obs.length?Math.round(ent/obs.length*100):0;return(<tr key={c.id}><td><strong>{c.razaoSocial.split(" ").slice(0,3).join(" ")}</strong></td><td><span className="regime-tag">{c.regime}</span></td><td>{obs.length}</td><td className="text-green">{ent}</td><td className="text-orange">{pend}</td><td className="text-red">{atr}</td><td><div style={{display:"flex",alignItems:"center",gap:8}}><div className="mini-bar-track"><div className="mini-bar-fill" style={{width:`${comp}%`,background:comp>=80?"#22c55e":comp>=50?"#f59e0b":"#ef4444"}}/></div><span style={{fontSize:12,fontWeight:600}}>{comp}%</span></div></td></tr>);})}</tbody></table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PÁGINA: D.PESSOAL / PREVIDENCIÁRIO
// ═══════════════════════════════════════════════════════

const CATALOGO_PREV = {
  "eSocial — Escrituração Digital": [
    { id:"eSocial-S1000", sigla:"S-1000", nome:"Informações do Empregador/Contribuinte", prazo:"Eventual", desc:"Cadastro inicial ou alteração dos dados do empregador." },
    { id:"eSocial-S1200", sigla:"S-1200", nome:"Remuneração de Trabalhador vinculado ao RGPS", prazo:"Mensal", desc:"Competência até dia 7 do mês seguinte." },
    { id:"eSocial-S1202", sigla:"S-1202", nome:"Remuneração de Servidor vinculado ao RPPS", prazo:"Mensal", desc:"Órgãos públicos com regime próprio." },
    { id:"eSocial-S1207", sigla:"S-1207", nome:"Benefícios Previdenciários — INSS/RPPS", prazo:"Mensal", desc:"Compensação previdenciária." },
    { id:"eSocial-S2200", sigla:"S-2200", nome:"Cadastramento Inicial de Vínculo / Admissão", prazo:"Eventual", desc:"Até 1 dia antes do início da atividade." },
    { id:"eSocial-S2205", sigla:"S-2205", nome:"Alteração de Dados Cadastrais do Trabalhador", prazo:"Eventual", desc:"Prazo: 15 dias após a ocorrência." },
    { id:"eSocial-S2206", sigla:"S-2206", nome:"Alteração de Contrato de Trabalho", prazo:"Eventual", desc:"Prazo: até o dia 7 do mês seguinte." },
    { id:"eSocial-S2210", sigla:"S-2210", nome:"Comunicação de Acidente de Trabalho (CAT)", prazo:"Eventual", desc:"Até 1 dia útil após o acidente." },
    { id:"eSocial-S2230", sigla:"S-2230", nome:"Afastamento Temporário", prazo:"Eventual", desc:"INSS, licença, falta justificada." },
    { id:"eSocial-S2299", sigla:"S-2299", nome:"Desligamento / Rescisão Contratual", prazo:"Eventual", desc:"Até 10 dias corridos após o desligamento." },
    { id:"eSocial-S2300", sigla:"S-2300", nome:"Trabalhador Sem Vínculo — TSVE Início", prazo:"Eventual", desc:"Autônomos, diretores, estagiários." },
    { id:"eSocial-S2399", sigla:"S-2399", nome:"Trabalhador Sem Vínculo — TSVE Término", prazo:"Eventual", desc:"Encerramento de serviço prestado." },
    { id:"eSocial-S2400", sigla:"S-2400", nome:"Cadastro de Benefício Previdenciário", prazo:"Eventual", desc:"Para empregadores com RPPS." },
    { id:"eSocial-S2500", sigla:"S-2500", nome:"Processo Trabalhista", prazo:"Eventual", desc:"Decisões judiciais trabalhistas." },
    { id:"eSocial-S2501", sigla:"S-2501", nome:"Informações de Contribuições — Processo Trabalhista", prazo:"Eventual", desc:"Após decisão judicial." },
    { id:"eSocial-S3000", sigla:"S-3000", nome:"Exclusão de Eventos", prazo:"Eventual", desc:"Cancelamento de evento enviado com erro." },
  ],
  "DCTFWeb — Declaração de Débitos": [
    { id:"DCTFWeb-Mensal", sigla:"DCTFWeb", nome:"DCTFWeb Mensal — Contribuições Previdenciárias", prazo:"Mensal", desc:"Gerada automaticamente a partir do eSocial. Vence dia 15 do mês seguinte." },
    { id:"DCTFWeb-13o",    sigla:"DCTFWeb 13°", nome:"DCTFWeb 13° Salário",                        prazo:"Anual",  desc:"Competência dezembro, vence em 20/12." },
    { id:"DCTFWeb-Ferias", sigla:"DCTFWeb Férias", nome:"DCTFWeb Folha de Férias",                 prazo:"Eventual",desc:"Quando há férias no período." },
  ],
  "FGTS — Fundo de Garantia": [
    { id:"FGTS-Mensal",    sigla:"FGTS",    nome:"FGTS Mensal — Guia de Recolhimento",             prazo:"Mensal",  desc:"Vence dia 7 do mês seguinte. 8% sobre remuneração bruta." },
    { id:"FGTS-Rescisao",  sigla:"FGTS Res.",nome:"FGTS Rescisório (Multa 40%)",                  prazo:"Eventual",desc:"Deve ser recolhido até 10 dias após demissão sem justa causa." },
    { id:"FGTS-GRRF",      sigla:"GRRF",    nome:"GRRF — Guia para Rescisão do Contrato",          prazo:"Eventual",desc:"Rescisões, aposentadoria e outras hipóteses de saque." },
    { id:"FGTS-SEFIP",     sigla:"SEFIP/GFIP",nome:"SEFIP/GFIP — Casos Residuais",               prazo:"Mensal",  desc:"Ainda exigido em situações não migradas ao eSocial." },
  ],
  "Folha de Pagamento e Obrigações Acessórias": [
    { id:"FP-Folha",       sigla:"Folha",   nome:"Folha de Pagamento Mensal",                      prazo:"Mensal",  desc:"Elaboração e arquivo até o 5° dia útil do mês seguinte." },
    { id:"FP-HOLERITE",    sigla:"Holerite",nome:"Contracheque / Holerite",                        prazo:"Mensal",  desc:"Entrega ao funcionário até o dia do pagamento." },
    { id:"FP-RAIS",        sigla:"RAIS",    nome:"RAIS — Relação Anual de Informações Sociais",    prazo:"Anual",   desc:"Entrega até março do ano seguinte. Portaria MTE." },
    { id:"FP-CAGED",       sigla:"CAGED",   nome:"CAGED — Cadastro Geral de Empregados e Desempregados",prazo:"Mensal",desc:"Substituído pelo eSocial para empresas obrigadas. Prazo: dia 7." },
    { id:"FP-DIRF-Prev",   sigla:"DIRF",    nome:"DIRF — Declaração de IR Retido na Fonte (Prev.)",prazo:"Anual",   desc:"Fevereiro do ano seguinte. Rendimentos e retenções." },
    { id:"FP-PPP",         sigla:"PPP",     nome:"PPP — Perfil Profissiográfico Previdenciário",   prazo:"Eventual",desc:"Obrigatório na demissão de trabalhador exposto a agentes nocivos." },
    { id:"FP-LTCAT",       sigla:"LTCAT",   nome:"LTCAT — Laudo Técnico das Condições Ambientais", prazo:"Eventual",desc:"Obrigatório para empresas com exposição a agentes nocivos." },
    { id:"FP-PCMSOe",      sigla:"PCMSO",   nome:"PCMSO — Programa de Controle Médico de Saúde Ocupacional",prazo:"Anual",desc:"Obrigatório para toda empresa com empregados CLT." },
    { id:"FP-PPRA",        sigla:"PPRA/PGR",nome:"PPRA/PGR — Programa de Gerenciamento de Riscos", prazo:"Anual",  desc:"Substituído pelo PGR (NR-1). Revisão anual obrigatória." },
  ],
  "Previdência Social — INSS": [
    { id:"INSS-GPS",       sigla:"GPS",     nome:"GPS — Guia da Previdência Social",               prazo:"Mensal",  desc:"Vence dia 20 do mês seguinte. Contribuições sobre folha." },
    { id:"INSS-COMP",      sigla:"Comp.Prev.",nome:"Compensação Previdenciária (COMPREV)",         prazo:"Eventual",desc:"Compensação de benefícios pagos pelo empregador." },
    { id:"INSS-EFD-Reinf", sigla:"EFD-Reinf",nome:"EFD-Reinf — Retenções sobre Serviços",        prazo:"Mensal",  desc:"Retenção de 11% sobre serviços com cessão de mão de obra." },
  ],
};

const PRAZO_COR = { Mensal:"#0ea5e9", Anual:"#7c3aed", Eventual:"#94a3b8", Trimestral:"#22c55e" };
const PRAZO_ICON = { Mensal:"📅", Anual:"📆", Eventual:"⚡", Trimestral:"📋" };

function DPessoal({ clientes, obrigacoes, setObrigacoes }) {
  const [abaSel, setAbaSel] = useState("visao");
  const [clienteSel, setClienteSel] = useState("todos");
  const [catAberta, setCatAberta] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [busca, setBusca] = useState("");

  const toggleCat = (cat) => setCatAberta(s => ({ ...s, [cat]: !s[cat] }));
  const toggleStatus = (id) => setStatusMap(s => ({
    ...s, [id]: s[id] === "Entregue" ? "Pendente" : "Entregue"
  }));

  const todasObs = Object.entries(CATALOGO_PREV).flatMap(([cat, obs]) =>
    obs.map(o => ({ ...o, categoria: cat }))
  );

  const obsFiltradas = todasObs.filter(o => {
    const mB = o.nome.toLowerCase().includes(busca.toLowerCase()) || o.sigla.toLowerCase().includes(busca.toLowerCase());
    const mS = filtroStatus === "Todos" || (statusMap[o.id] || "Pendente") === filtroStatus;
    return mB && mS;
  });

  const totalObs  = todasObs.length;
  const entregues = todasObs.filter(o => statusMap[o.id] === "Entregue").length;
  const pendentes = totalObs - entregues;

  // KPIs por categoria
  const kpis = [
    { label:"eSocial",       count: CATALOGO_PREV["eSocial — Escrituração Digital"].length,             icon:"💻", cor:"#0ea5e9" },
    { label:"DCTFWeb",       count: CATALOGO_PREV["DCTFWeb — Declaração de Débitos"].length,            icon:"📄", cor:"#7c3aed" },
    { label:"FGTS",          count: CATALOGO_PREV["FGTS — Fundo de Garantia"].length,                   icon:"🏦", cor:"#f59e0b" },
    { label:"Folha/DP",      count: CATALOGO_PREV["Folha de Pagamento e Obrigações Acessórias"].length, icon:"📋", cor:"#22c55e" },
    { label:"INSS/Prev.",    count: CATALOGO_PREV["Previdência Social — INSS"].length,                  icon:"🏛️", cor:"#ef4444" },
    { label:"Entregues",     count: entregues,                                                           icon:"✅", cor:"#22c55e" },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">D.Pessoal / Previdenciário</h1>
          <p className="page-sub">Obrigações trabalhistas, previdenciárias e FGTS — {totalObs} obrigações cadastradas</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-secondary">📥 Exportar</button>
          <button className="btn-primary">+ Nova Obrigação</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{gridTemplateColumns:"repeat(6,1fr)"}}>
        {kpis.map((k,i) => (
          <div key={i} className="kpi-card" style={{borderLeftColor:k.cor,borderLeftWidth:3,borderLeftStyle:"solid"}}>
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-info">
              <span className="kpi-num" style={{color:k.cor}}>{k.count}</span>
              <span className="kpi-label">{k.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div style={{display:"flex",gap:0,borderBottom:"1px solid var(--border)",marginBottom:20}}>
        {[["visao","📊 Visão Geral"],["calendario","📅 Por Vencimento"],["clientes","🏢 Por Cliente"]].map(([k,l]) => (
          <button key={k} onClick={()=>setAbaSel(k)} style={{
            background:"none", border:"none", borderBottom: abaSel===k?"2px solid var(--accent)":"2px solid transparent",
            color: abaSel===k?"var(--accent)":"var(--text3)", padding:"10px 18px",
            fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"var(--font)"
          }}>{l}</button>
        ))}
      </div>

      {abaSel === "visao" && (
        <div>
          {/* Barra de progresso geral */}
          <div className="card" style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <h3 className="card-title" style={{margin:0}}>Progresso Geral de Conformidade</h3>
              <span style={{fontSize:22,fontWeight:800,color: entregues/totalObs > 0.7?"var(--green)":entregues/totalObs > 0.4?"var(--orange)":"var(--red)"}}>
                {Math.round(entregues/totalObs*100)}%
              </span>
            </div>
            <div style={{height:10,background:"var(--bg4)",borderRadius:5,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",width:`${entregues/totalObs*100}%`,background:`linear-gradient(90deg,#22c55e,#0ea5e9)`,borderRadius:5,transition:"width .5s"}}/>
            </div>
            <div style={{display:"flex",gap:20,fontSize:12,color:"var(--text3)"}}>
              <span>✅ {entregues} entregues</span>
              <span>⏳ {pendentes} pendentes</span>
              <span>📋 {totalObs} total</span>
            </div>
          </div>

          {/* Filtros */}
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
            <input className="search-input" style={{flex:1,minWidth:200}} placeholder="Buscar por sigla ou nome da obrigação..." value={busca} onChange={e=>setBusca(e.target.value)}/>
            <select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)}>
              <option>Todos</option><option>Pendente</option><option>Entregue</option>
            </select>
          </div>

          {/* Catálogo por categoria */}
          {Object.entries(CATALOGO_PREV).map(([cat, obs]) => {
            const obsFiltCat = obs.filter(o => {
              const mB = o.nome.toLowerCase().includes(busca.toLowerCase()) || o.sigla.toLowerCase().includes(busca.toLowerCase());
              const mS = filtroStatus === "Todos" || (statusMap[o.id] || "Pendente") === filtroStatus;
              return mB && mS;
            });
            if (!obsFiltCat.length) return null;
            const entCat = obs.filter(o => statusMap[o.id] === "Entregue").length;
            const isAberta = catAberta[cat] !== false; // aberta por padrão

            const corCat = cat.includes("eSocial")?"#0ea5e9":cat.includes("DCTF")?"#7c3aed":cat.includes("FGTS")?"#f59e0b":cat.includes("Folha")?"#22c55e":"#ef4444";

            return (
              <div key={cat} style={{marginBottom:12,border:"1px solid var(--border)",borderRadius:10,overflow:"hidden"}}>
                <div onClick={()=>toggleCat(cat)} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
                  background:`${corCat}0d`,borderBottom:`1px solid ${corCat}33`,cursor:"pointer"
                }}>
                  <div style={{width:4,height:20,borderRadius:2,background:corCat,flexShrink:0}}/>
                  <span style={{flex:1,fontWeight:700,fontSize:13,color:"var(--text)"}}>{cat}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,color:corCat,background:`${corCat}22`,padding:"2px 8px",borderRadius:10,fontWeight:600}}>
                      {entCat}/{obs.length} entregues
                    </span>
                    <span style={{color:"var(--text3)",fontSize:12}}>{isAberta?"▲":"▼"}</span>
                  </div>
                </div>

                {isAberta && (
                  <div>
                    {obsFiltCat.map(ob => {
                      const st = statusMap[ob.id] || "Pendente";
                      const isEntregue = st === "Entregue";
                      return (
                        <div key={ob.id} style={{
                          display:"flex",alignItems:"center",gap:12,padding:"11px 16px",
                          borderBottom:"1px solid var(--border)",
                          background: isEntregue?"rgba(34,197,94,0.03)":"transparent"
                        }}>
                          {/* Checkbox */}
                          <div onClick={()=>toggleStatus(ob.id)} style={{
                            width:20,height:20,borderRadius:5,border:`2px solid ${isEntregue?"var(--green)":"var(--border2)"}`,
                            background: isEntregue?"var(--green)":"var(--bg4)",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            cursor:"pointer",flexShrink:0,fontSize:12,color:"white",fontWeight:700
                          }}>{isEntregue?"✓":""}</div>

                          {/* Sigla */}
                          <span style={{
                            fontFamily:"var(--mono)",fontSize:11,fontWeight:700,
                            color:corCat,background:`${corCat}15`,
                            padding:"3px 8px",borderRadius:4,minWidth:80,textAlign:"center",flexShrink:0
                          }}>{ob.sigla}</span>

                          {/* Info */}
                          <div style={{flex:1}}>
                            <span style={{display:"block",fontSize:13,fontWeight:500,color: isEntregue?"var(--text3)":"var(--text)",textDecoration:isEntregue?"line-through":"none"}}>{ob.nome}</span>
                            <span style={{display:"block",fontSize:11,color:"var(--text3)",marginTop:2}}>{ob.desc}</span>
                          </div>

                          {/* Prazo */}
                          <span style={{
                            fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:5,whiteSpace:"nowrap",flexShrink:0,
                            color:PRAZO_COR[ob.prazo]||"#94a3b8",background:`${PRAZO_COR[ob.prazo]||"#94a3b8"}18`
                          }}>{PRAZO_ICON[ob.prazo]||"⚡"} {ob.prazo}</span>

                          {/* Status badge */}
                          <span style={{
                            fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:5,flexShrink:0,
                            background: isEntregue?"var(--green-dim)":"var(--orange-dim)",
                            color: isEntregue?"var(--green)":"var(--orange)"
                          }}>{st}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {abaSel === "calendario" && (
        <div className="card">
          <h3 className="card-title">📅 Vencimentos do Mês Atual</h3>
          <p className="form-hint">Principais prazos das obrigações previdenciárias e trabalhistas.</p>
          <table className="data-table">
            <thead><tr><th>Vencimento</th><th>Obrigação</th><th>Descrição</th><th>Periodicidade</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { dia:7,  sigla:"FGTS",      nome:"Recolhimento mensal do FGTS",                 prazo:"Mensal" },
                { dia:7,  sigla:"eSocial",   nome:"Fechamento da folha — S-1200/S-1202",         prazo:"Mensal" },
                { dia:7,  sigla:"CAGED",     nome:"CAGED (casos residuais não migrados)",         prazo:"Mensal" },
                { dia:15, sigla:"DCTFWeb",   nome:"DCTFWeb — Contribuições Previdenciárias",     prazo:"Mensal" },
                { dia:20, sigla:"GPS",       nome:"GPS — Guia da Previdência Social",            prazo:"Mensal" },
                { dia:20, sigla:"DCTFWeb 13°",nome:"DCTFWeb 13° Salário (dezembro)",            prazo:"Anual"  },
                { dia:28, sigla:"RAIS",      nome:"RAIS — Relação Anual de Informações Sociais (março)",prazo:"Anual" },
              ].map((item,i) => (
                <tr key={i}>
                  <td><div style={{
                    width:36,height:36,borderRadius:8,background:"var(--bg3)",border:"1px solid var(--border)",
                    display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"var(--accent)"
                  }}>d{item.dia}</div></td>
                  <td><span style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:700,color:"var(--orange)",background:"rgba(245,158,11,0.12)",padding:"3px 8px",borderRadius:4}}>{item.sigla}</span></td>
                  <td style={{fontSize:13}}>{item.nome}</td>
                  <td><span style={{fontSize:11,color:PRAZO_COR[item.prazo],background:`${PRAZO_COR[item.prazo]}18`,padding:"2px 8px",borderRadius:5,fontWeight:600}}>{item.prazo}</span></td>
                  <td><span style={{fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:5,background:"var(--orange-dim)",color:"var(--orange)"}}>Pendente</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {abaSel === "clientes" && (
        <div>
          <div style={{marginBottom:16}}>
            <select style={{minWidth:280}} value={clienteSel} onChange={e=>setClienteSel(e.target.value)}>
              <option value="todos">Todos os clientes</option>
              {clientes.filter(c=>c.status==="Ativo").map(c=><option key={c.id} value={c.id}>{c.razaoSocial}</option>)}
            </select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
            {clientes.filter(c => clienteSel==="todos" || c.id===parseInt(clienteSel)).map(c => {
              const obsCliente = (c.obrigacoesSelecionadas||[]).filter(id =>
                id.startsWith("eSocial") || id.startsWith("DCTFWeb") || id.startsWith("FGTS") || id.startsWith("GFIP") || id.startsWith("INSS")
              );
              const totalC = Math.max(obsCliente.length, 5); // mínimo para visual
              const entC = Math.floor(totalC * 0.6);
              return (
                <div key={c.id} className="card" style={{margin:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div>
                      <span style={{fontSize:14,fontWeight:700}}>{c.razaoSocial}</span>
                      <span className="regime-tag" style={{marginLeft:8}}>{c.regime}</span>
                    </div>
                    <StatusBadge status={c.status}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                    {[["eSocial","💻","#0ea5e9"],[" FGTS","🏦","#f59e0b"],["DCTFWeb","📄","#7c3aed"]].map(([l,ic,cor])=>(
                      <div key={l} style={{background:`${cor}10`,borderRadius:7,padding:"8px 10px",textAlign:"center",border:`1px solid ${cor}25`}}>
                        <span style={{fontSize:16}}>{ic}</span>
                        <span style={{display:"block",fontSize:11,fontWeight:600,color:cor,marginTop:3}}>{l}</span>
                        <span style={{display:"block",fontSize:10,color:"var(--text3)"}}>Mensal</span>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:12,color:"var(--text3)",marginBottom:6}}>Conformidade previdenciária</div>
                  <div style={{height:6,background:"var(--bg4)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${entC/totalC*100}%`,background:"var(--green)",borderRadius:3}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--text3)",marginTop:5}}>
                    <span>{entC} entregues</span>
                    <span style={{fontWeight:600,color:"var(--green)"}}>{Math.round(entC/totalC*100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PÁGINA: AUTOMAÇÃO WHATSAPP
// ═══════════════════════════════════════════════════════

const TEMPLATES_MENSAGEM = {
  vencimento_proximo: {
    nome: "Vencimento Próximo",
    icon: "⚠️",
    cor: "#f59e0b",
    template: `Olá {usuario}! 👋

⚠️ *Alerta de Vencimento — FiscoControl*

Você possui *{qtd_obrigacoes}* obrigação(ões) com vencimento nos próximos *{dias_antecedencia} dias* referentes às suas empresas:

{lista_obrigacoes}

📅 Acesse o sistema para mais detalhes.
_FiscoControl — Gestão Tributária_`
  },
  obrigacao_atrasada: {
    nome: "Obrigação em Atraso",
    icon: "🚨",
    cor: "#ef4444",
    template: `Olá {usuario}! 👋

🚨 *URGENTE — Obrigação em Atraso!*

A seguinte obrigação está *ATRASADA* e precisa de atenção imediata:

{lista_obrigacoes}

⚡ Entre em contato com o cliente o quanto antes.
_FiscoControl — Gestão Tributária_`
  },
  resumo_semanal: {
    nome: "Resumo Semanal",
    icon: "📊",
    cor: "#0ea5e9",
    template: `Bom dia, {usuario}! ☀️

📊 *Resumo Semanal — FiscoControl*

Suas obrigações desta semana:
✅ Entregues: {qtd_entregues}
⏳ Pendentes: {qtd_pendentes}
🚨 Atrasadas: {qtd_atrasadas}

*Empresas sob sua responsabilidade:*
{lista_empresas}

Tenha uma ótima semana! 💪
_FiscoControl — Gestão Tributária_`
  },
  lembrete_entrega: {
    nome: "Lembrete de Entrega",
    icon: "📋",
    cor: "#22c55e",
    template: `Olá {usuario}! 👋

📋 *Lembrete de Entrega — FiscoControl*

A seguinte obrigação está pendente de entrega:

{lista_obrigacoes}

Por favor, confirme a entrega no sistema assim que concluído.
_FiscoControl — Gestão Tributária_`
  },
};

const HORARIOS_ENVIO = ["07:00","08:00","09:00","10:00","14:00","15:00","16:00","17:00"];
const DIAS_SEMANA = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

const agentes_mock_init = [
  {
    id:1, nome:"Alertas de Vencimento — Ana Lima", ativo:true,
    usuariosIds:[1], templateKey:"vencimento_proximo",
    diasAntecedencia:3, horarioEnvio:"08:00",
    diasSemana:[1,2,3,4,5], ultimoDisparo:"28/02/2026 08:00",
    totalEnviados:47, taxaLeitura:92,
    condicao:"vencimento_proximo",
  },
  {
    id:2, nome:"Urgências e Atrasos — Equipe", ativo:true,
    usuariosIds:[1,2,3], templateKey:"obrigacao_atrasada",
    diasAntecedencia:0, horarioEnvio:"09:00",
    diasSemana:[1,2,3,4,5], ultimoDisparo:"27/02/2026 09:00",
    totalEnviados:23, taxaLeitura:100,
    condicao:"obrigacao_atrasada",
  },
  {
    id:3, nome:"Resumo Semanal — Carlos Souza", ativo:false,
    usuariosIds:[2], templateKey:"resumo_semanal",
    diasAntecedencia:7, horarioEnvio:"07:00",
    diasSemana:[1], ultimoDisparo:"24/02/2026 07:00",
    totalEnviados:12, taxaLeitura:83,
    condicao:"resumo_semanal",
  },
];

const historico_mock = [
  { id:1, agenteId:1, usuario:"Ana Lima", tel:"(11) 99999-0001", mensagem:"Alerta: ECD da Tech Solutions vence em 3 dias", hora:"Hoje 08:00", status:"lido" },
  { id:2, agenteId:1, usuario:"Ana Lima", tel:"(11) 99999-0001", mensagem:"Alerta: ECF da Consultoria ABC vence em 3 dias", hora:"Hoje 08:00", status:"lido" },
  { id:3, agenteId:2, usuario:"Carlos Souza", tel:"(11) 99999-0002", mensagem:"URGENTE: DCTFWeb da Farmácia Saúde está atrasada!", hora:"Ontem 09:00", status:"lido" },
  { id:4, agenteId:2, usuario:"Ana Lima", tel:"(11) 99999-0001", mensagem:"URGENTE: DIRF da Tech Solutions está atrasada!", hora:"Ontem 09:00", status:"entregue" },
  { id:5, agenteId:3, usuario:"Carlos Souza", tel:"(11) 99999-0002", mensagem:"Resumo semanal: 8 entregues, 3 pendentes, 1 atrasada", hora:"24/02 07:00", status:"lido" },
];

function ModalAgente({ onClose, onSalvar, usuarios, clientes, editando }) {
  const [aba, setAba] = useState("config");
  const [form, setForm] = useState(editando || {
    nome:"", ativo:true, usuariosIds:[], templateKey:"vencimento_proximo",
    diasAntecedencia:3, horarioEnvio:"09:00", diasSemana:[1,2,3,4,5],
    condicao:"vencimento_proximo",
  });

  const toggleUsuario = id => setForm(f => ({
    ...f, usuariosIds: f.usuariosIds.includes(id)
      ? f.usuariosIds.filter(x=>x!==id) : [...f.usuariosIds, id]
  }));
  const toggleDia = d => setForm(f => ({
    ...f, diasSemana: f.diasSemana.includes(d)
      ? f.diasSemana.filter(x=>x!==d) : [...f.diasSemana, d].sort()
  }));

  const tpl = TEMPLATES_MENSAGEM[form.templateKey];

  // Preview da mensagem com dados reais do primeiro usuário selecionado
  const usuarioPreview = usuarios.find(u => form.usuariosIds.includes(u.id)) || usuarios[0];
  const clientesUsuario = usuarioPreview ? clientes.filter(c => (usuarioPreview.clientesIds||[]).includes(c.id)) : [];
  const previewMsg = tpl ? tpl.template
    .replace(/{usuario}/g, usuarioPreview?.nome || "Nome do Usuário")
    .replace(/{qtd_obrigacoes}/g, "3")
    .replace(/{dias_antecedencia}/g, form.diasAntecedencia)
    .replace(/{lista_obrigacoes}/g, "▪️ ECD — Tech Solutions (vence 05/03)\n▪️ ECF — Consultoria ABC (vence 07/03)\n▪️ DCTF — Tech Solutions (vence 07/03)")
    .replace(/{lista_empresas}/g, clientesUsuario.map(c=>"▪️ " + c.razaoSocial).join("\n") || "▪️ Nenhuma empresa vinculada")
    .replace(/{qtd_entregues}/g, "8").replace(/{qtd_pendentes}/g, "3").replace(/{qtd_atrasadas}/g, "1")
    : "";

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-xl">
        <div className="modal-header">
          <h2>{editando?"Editar Agente":"Novo Agente WhatsApp"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-tabs">
          {[["config","⚙️ Configuração"],["usuarios","👤 Usuários"],["mensagem","💬 Mensagem"],["preview","👁️ Preview"]].map(([k,l])=>(
            <button key={k} className={`modal-tab ${aba===k?"active":""}`} onClick={()=>setAba(k)}>{l}</button>
          ))}
        </div>
        <div className="modal-body">

          {aba==="config" && (
            <div className="form-grid form-grid-3">
              <div className="form-group span-2">
                <label>Nome do Agente *</label>
                <input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Ex: Alertas de Vencimento — Equipe Fiscal"/>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.ativo?"Ativo":"Pausado"} onChange={e=>setForm({...form,ativo:e.target.value==="Ativo"})}>
                  <option>Ativo</option><option>Pausado</option>
                </select>
              </div>
              <div className="form-group span-3">
                <label>Condição de Disparo</label>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginTop:4}}>
                  {Object.entries(TEMPLATES_MENSAGEM).map(([k,t])=>(
                    <div key={k} onClick={()=>setForm({...form,condicao:k,templateKey:k})} style={{
                      padding:"12px 14px",borderRadius:9,cursor:"pointer",display:"flex",gap:10,alignItems:"center",
                      border:`2px solid ${form.condicao===k?t.cor:"var(--border)"}`,
                      background: form.condicao===k?`${t.cor}12`:"var(--bg3)"
                    }}>
                      <span style={{fontSize:22}}>{t.icon}</span>
                      <div>
                        <span style={{display:"block",fontWeight:600,fontSize:13,color:form.condicao===k?t.cor:"var(--text)"}}>{t.nome}</span>
                        <span style={{fontSize:11,color:"var(--text3)"}}>
                          {k==="vencimento_proximo"?"Dispara X dias antes do vencimento":
                           k==="obrigacao_atrasada"?"Dispara quando obrigação está em atraso":
                           k==="resumo_semanal"?"Envia resumo semanal com estatísticas":
                           "Lembra sobre obrigações pendentes"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {form.condicao==="vencimento_proximo" && (
                <div className="form-group">
                  <label>Dias de Antecedência</label>
                  <select value={form.diasAntecedencia} onChange={e=>setForm({...form,diasAntecedencia:parseInt(e.target.value)})}>
                    {[1,2,3,5,7,10,15,30].map(d=><option key={d} value={d}>{d} dia(s) antes</option>)}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Horário de Envio</label>
                <select value={form.horarioEnvio} onChange={e=>setForm({...form,horarioEnvio:e.target.value})}>
                  {HORARIOS_ENVIO.map(h=><option key={h}>{h}</option>)}
                </select>
              </div>
              <div className="form-group span-3">
                <label>Dias da Semana</label>
                <div style={{display:"flex",gap:6,marginTop:4}}>
                  {DIAS_SEMANA.map((d,i)=>(
                    <button key={i} onClick={()=>toggleDia(i)} style={{
                      padding:"6px 10px",borderRadius:6,border:`1px solid ${form.diasSemana.includes(i)?"var(--accent)":"var(--border)"}`,
                      background:form.diasSemana.includes(i)?"var(--accent-glow)":"var(--bg3)",
                      color:form.diasSemana.includes(i)?"var(--accent)":"var(--text3)",
                      fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"
                    }}>{d.slice(0,3)}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {aba==="usuarios" && (
            <div>
              <p className="form-hint">Selecione os usuários que receberão as mensagens deste agente. As mensagens incluirão automaticamente as obrigações das empresas vinculadas a cada usuário.</p>
              <div className="cliente-vinculo-grid">
                {usuarios.filter(u=>u.ativo).map(u=>{
                  const sel = form.usuariosIds.includes(u.id);
                  const clientesU = clientes.filter(c=>(u.clientesIds||[]).includes(c.id));
                  return (
                    <div key={u.id} className={`cliente-vinculo-card ${sel?"selected":""}`} onClick={()=>toggleUsuario(u.id)}>
                      <div className="cv-check">{sel?"✓":""}</div>
                      <div className="cv-info">
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <div className="user-av" style={{width:26,height:26,fontSize:10}}>{u.nome.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                          <span className="cv-nome">{u.nome}</span>
                        </div>
                        <span className="cv-cnpj">{u.email}</span>
                        <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>
                          📱 {u.telefone || "Sem telefone"} &nbsp;·&nbsp; 🏢 {clientesU.length} empresa(s)
                        </div>
                        <div className="cv-tags" style={{marginTop:5}}>
                          <span className={`perfil-tag perfil-${u.perfil.toLowerCase()}`}>{u.perfil}</span>
                          {clientesU.slice(0,2).map(c=><span key={c.id} className="enq-ob-tag" style={{fontSize:9}}>{c.razaoSocial.split(" ")[0]}</span>)}
                          {clientesU.length>2&&<span className="enq-ob-tag" style={{fontSize:9}}>+{clientesU.length-2}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {form.usuariosIds.length>0&&(
                <div className="vinculo-resumo">
                  ✅ <strong>{form.usuariosIds.length} usuário(s)</strong> receberão as mensagens deste agente.
                  As obrigações enviadas serão filtradas automaticamente por empresa.
                </div>
              )}
            </div>
          )}

          {aba==="mensagem" && (
            <div>
              <p className="form-hint">Personalize a mensagem que será enviada. As variáveis entre chaves são substituídas automaticamente no envio.</p>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Template Base</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {Object.entries(TEMPLATES_MENSAGEM).map(([k,t])=>(
                    <button key={k} onClick={()=>setForm({...form,templateKey:k})} style={{
                      padding:"6px 12px",borderRadius:6,border:`1px solid ${form.templateKey===k?t.cor:"var(--border)"}`,
                      background:form.templateKey===k?`${t.cor}15`:"var(--bg3)",
                      color:form.templateKey===k?t.cor:"var(--text2)",
                      fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"
                    }}>{t.icon} {t.nome}</button>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Variáveis Disponíveis</label>
                  <div style={{background:"var(--bg3)",borderRadius:8,padding:14,fontSize:12}}>
                    {[
                      ["{usuario}","Nome do usuário destinatário"],
                      ["{qtd_obrigacoes}","Quantidade de obrigações no alerta"],
                      ["{dias_antecedencia}","Dias configurados de antecedência"],
                      ["{lista_obrigacoes}","Lista detalhada das obrigações"],
                      ["{lista_empresas}","Empresas do usuário"],
                      ["{qtd_entregues}","Total de entregues no período"],
                      ["{qtd_pendentes}","Total de pendentes no período"],
                      ["{qtd_atrasadas}","Total de atrasadas no período"],
                    ].map(([v,d])=>(
                      <div key={v} style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid var(--border)"}}>
                        <span style={{fontFamily:"var(--mono)",color:"var(--accent)",fontSize:11,fontWeight:700}}>{v}</span>
                        <span style={{color:"var(--text3)",marginLeft:8,fontSize:11}}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{fontSize:11,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".5px",display:"block",marginBottom:6}}>Mensagem Atual</label>
                  <textarea
                    value={tpl?.template||""}
                    readOnly
                    style={{
                      width:"100%",height:280,background:"var(--bg3)",border:"1px solid var(--border)",
                      borderRadius:8,padding:12,color:"var(--text2)",fontSize:12,
                      fontFamily:"var(--mono)",resize:"none",lineHeight:1.6
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {aba==="preview" && (
            <div>
              <p className="form-hint">Visualize como a mensagem será exibida no WhatsApp para cada usuário selecionado.</p>
              {form.usuariosIds.length===0?(
                <div style={{textAlign:"center",padding:40,color:"var(--text3)"}}>
                  <span style={{fontSize:40,display:"block",marginBottom:10}}>👥</span>
                  <p>Selecione ao menos um usuário na aba "Usuários" para ver o preview.</p>
                </div>
              ):(
                <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                  {form.usuariosIds.map(uid=>{
                    const u = usuarios.find(x=>x.id===uid);
                    if(!u) return null;
                    const clientesU = clientes.filter(c=>(u.clientesIds||[]).includes(c.id));
                    const msg = tpl ? tpl.template
                      .replace(/{usuario}/g, u.nome)
                      .replace(/{qtd_obrigacoes}/g,"3")
                      .replace(/{dias_antecedencia}/g, form.diasAntecedencia)
                      .replace(/{lista_obrigacoes}/g, clientesU.slice(0,3).map(c=>"▪️ ECD — " + c.razaoSocial.split(" ")[0] + " (vence em 3 dias)").join("\n") || "▪️ Nenhuma obrigação pendente")
                      .replace(/{lista_empresas}/g, clientesU.map(c=>"▪️ " + c.razaoSocial).join("\n")||"▪️ Nenhuma empresa vinculada")
                      .replace(/{qtd_entregues}/g,"8").replace(/{qtd_pendentes}/g,"3").replace(/{qtd_atrasadas}/g,"1")
                      : "";
                    return (
                      <div key={uid} style={{flex:1,minWidth:280}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                          <div className="user-av">{u.nome.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                          <div>
                            <span style={{fontWeight:700,fontSize:13}}>{u.nome}</span>
                            <span style={{display:"block",fontSize:11,color:"var(--text3)"}}>{u.telefone||"Sem telefone"}</span>
                          </div>
                        </div>
                        {/* Simulação de tela WhatsApp */}
                        <div style={{background:"#0b141a",borderRadius:12,overflow:"hidden",border:"1px solid #1f2c34"}}>
                          <div style={{background:"#202c33",padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:32,height:32,borderRadius:"50%",background:"#25d366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💼</div>
                            <div>
                              <span style={{fontWeight:700,fontSize:13,color:"#e9edef"}}>FiscoControl</span>
                              <span style={{display:"block",fontSize:11,color:"#aebac1"}}>online</span>
                            </div>
                          </div>
                          <div style={{
                            background:"#111b21",
                            padding:16,minHeight:200
                          }}>
                            <div style={{
                              background:"#005c4b",borderRadius:"8px 8px 8px 0",padding:"10px 12px",
                              maxWidth:"85%",display:"inline-block",marginLeft:"auto",display:"block",
                              fontSize:12,color:"#e9edef",lineHeight:1.6,wordBreak:"break-word",
                              boxShadow:"0 1px 2px rgba(0,0,0,0.3)"
                            }}>
                              {msg.split("\n").map((line,i)=>(
                                <span key={i} style={{display:"block",
                                  fontWeight: line.startsWith("*")&&line.endsWith("*")?"700":"400",
                                }}>
                                  {line.replace(/\*/g,"")||" "}
                                </span>
                              ))}
                              <span style={{fontSize:10,color:"#aebac1",float:"right",marginTop:4}}>
                                {form.horarioEnvio} ✓✓
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={()=>onSalvar(form)}>
            {editando?"Salvar Agente":"🤖 Criar Agente"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Automacao({ usuarios, clientes, obrigacoes }) {
  const [agentes, setAgentes] = useState(agentes_mock_init);
  const [historico] = useState(historico_mock);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [abaPrincipal, setAbaPrincipal] = useState("agentes");
  const [testandoId, setTestandoId] = useState(null);
  const [testeSucesso, setTesteSucesso] = useState(null);

  const toggleAgente = id => setAgentes(a => a.map(ag => ag.id===id ? {...ag,ativo:!ag.ativo} : ag));
  const excluirAgente = id => setAgentes(a => a.filter(ag=>ag.id!==id));
  const salvarAgente = form => {
    if (!form.nome) return;
    if (editando) setAgentes(a => a.map(ag => ag.id===editando.id ? {...form,id:editando.id,totalEnviados:editando.totalEnviados,taxaLeitura:editando.taxaLeitura,ultimoDisparo:editando.ultimoDisparo} : ag));
    else setAgentes(a => [...a, {...form, id:Date.now(), totalEnviados:0, taxaLeitura:0, ultimoDisparo:"—"}]);
    setModal(false);
  };

  const testarEnvio = (id) => {
    setTestandoId(id);
    setTimeout(()=>{setTestandoId(null);setTesteSucesso(id);setTimeout(()=>setTesteSucesso(null),3000);}, 1800);
  };

  const ativos  = agentes.filter(a=>a.ativo).length;
  const pausados = agentes.filter(a=>!a.ativo).length;
  const totalEnviados = agentes.reduce((s,a)=>s+a.totalEnviados,0);
  const mediaLeitura  = Math.round(agentes.reduce((s,a)=>s+a.taxaLeitura,0)/agentes.length);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">🤖 Automação WhatsApp</h1>
          <p className="page-sub">Agentes inteligentes de notificação para sua equipe</p>
        </div>
        <button className="btn-primary" onClick={()=>{setEditando(null);setModal(true);}}>+ Novo Agente</button>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
        {[
          { n:ativos,        ic:"🟢", l:"Agentes Ativos",    cls:"kpi-done" },
          { n:pausados,      ic:"⏸️", l:"Agentes Pausados",  cls:"kpi-week" },
          { n:totalEnviados, ic:"📤", l:"Mensagens Enviadas", cls:"kpi-clients" },
          { n:mediaLeitura+"%", ic:"👁️", l:"Taxa de Leitura",   cls:"kpi-total" },
        ].map((k,i)=>(
          <div key={i} className={`kpi-card ${k.cls}`}>
            <div className="kpi-icon">{k.ic}</div>
            <div className="kpi-info"><span className="kpi-num">{k.n}</span><span className="kpi-label">{k.l}</span></div>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div style={{display:"flex",gap:0,borderBottom:"1px solid var(--border)",marginBottom:20}}>
        {[["agentes","🤖 Agentes"],["historico","📨 Histórico de Envios"],["configuracao","🔧 Integração WA"]].map(([k,l])=>(
          <button key={k} onClick={()=>setAbaPrincipal(k)} style={{
            background:"none",border:"none",
            borderBottom: abaPrincipal===k?"2px solid #25d366":"2px solid transparent",
            color: abaPrincipal===k?"#25d366":"var(--text3)",
            padding:"10px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"
          }}>{l}</button>
        ))}
      </div>

      {abaPrincipal==="agentes" && (
        <div>
          {agentes.length===0 ? (
            <div className="card" style={{textAlign:"center",padding:60}}>
              <span style={{fontSize:48,display:"block",marginBottom:12}}>🤖</span>
              <h3 style={{marginBottom:8}}>Nenhum agente criado</h3>
              <p style={{color:"var(--text3)",marginBottom:20}}>Crie seu primeiro agente de WhatsApp para automatizar notificações da equipe.</p>
              <button className="btn-primary" onClick={()=>{setEditando(null);setModal(true);}}>+ Criar Primeiro Agente</button>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {agentes.map(ag=>{
                const tpl = TEMPLATES_MENSAGEM[ag.templateKey];
                const usuariosAg = usuarios.filter(u=>ag.usuariosIds.includes(u.id));
                const clientesTotal = [...new Set(usuariosAg.flatMap(u=>u.clientesIds||[]))];
                const isTesting = testandoId===ag.id;
                const isSuccess = testeSucesso===ag.id;

                return (
                  <div key={ag.id} className="card" style={{
                    margin:0,borderLeft:`3px solid ${ag.ativo?"#25d366":"var(--border)"}`,
                    opacity: ag.ativo?1:0.75
                  }}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                      {/* Ícone e toggle */}
                      <div style={{flexShrink:0}}>
                        <div style={{
                          width:46,height:46,borderRadius:12,
                          background: ag.ativo?"rgba(37,211,102,0.12)":"var(--bg3)",
                          border:`1px solid ${ag.ativo?"rgba(37,211,102,0.3)":"var(--border)"}`,
                          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:8
                        }}>{tpl?.icon||"🤖"}</div>
                        {/* Toggle on/off */}
                        <div onClick={()=>toggleAgente(ag.id)} style={{
                          width:46,height:24,borderRadius:12,
                          background:ag.ativo?"#25d366":"var(--bg4)",
                          position:"relative",cursor:"pointer",transition:"background .2s"
                        }}>
                          <div style={{
                            position:"absolute",top:3,left:ag.ativo?25:3,
                            width:18,height:18,borderRadius:"50%",background:"white",transition:"left .2s"
                          }}/>
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                          <h3 style={{fontSize:15,fontWeight:700}}>{ag.nome}</h3>
                          <span style={{
                            fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:10,
                            background:ag.ativo?"rgba(37,211,102,0.12)":"var(--bg3)",
                            color:ag.ativo?"#25d366":"var(--text3)"
                          }}>{ag.ativo?"● Ativo":"⏸ Pausado"}</span>
                          <span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:`${tpl?.cor}15`,color:tpl?.cor,fontWeight:600}}>{tpl?.nome}</span>
                        </div>

                        {/* Grid de infos */}
                        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
                          {[
                            ["⏰ Horário", ag.horarioEnvio],
                            ["📅 Dias", ag.diasSemana.map(d=>DIAS_SEMANA[d].slice(0,3)).join(", ")],
                            ["👥 Usuários", `${usuariosAg.length} usuário(s)`],
                            ["🏢 Empresas", `${clientesTotal.length} empresa(s)`],
                          ].map(([l,v])=>(
                            <div key={l} style={{background:"var(--bg3)",borderRadius:7,padding:"8px 10px"}}>
                              <span style={{fontSize:10,color:"var(--text3)",display:"block"}}>{l}</span>
                              <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{v}</span>
                            </div>
                          ))}
                        </div>

                        {/* Usuários avatares */}
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                          {usuariosAg.map(u=>(
                            <div key={u.id} style={{display:"flex",alignItems:"center",gap:5,background:"var(--bg3)",padding:"3px 8px 3px 4px",borderRadius:20}}>
                              <div className="user-av" style={{width:20,height:20,fontSize:8}}>{u.nome.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                              <span style={{fontSize:11,color:"var(--text2)"}}>{u.nome.split(" ")[0]}</span>
                              <span style={{fontSize:10,color:"var(--text3)"}}>{u.telefone||"sem tel."}</span>
                            </div>
                          ))}
                        </div>

                        {/* Stats */}
                        <div style={{display:"flex",gap:16,fontSize:12,color:"var(--text3)"}}>
                          <span>📤 <strong style={{color:"var(--text)"}}>{ag.totalEnviados}</strong> enviadas</span>
                          <span>👁️ <strong style={{color:"var(--green)"}}>{ag.taxaLeitura}%</strong> lidas</span>
                          <span>🕐 Último: <strong style={{color:"var(--text)"}}>{ag.ultimoDisparo}</strong></span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                        <button
                          onClick={()=>testarEnvio(ag.id)}
                          disabled={isTesting}
                          style={{
                            padding:"7px 14px",borderRadius:7,border:`1px solid ${isSuccess?"var(--green)":"#25d366"}`,
                            background:isSuccess?"var(--green-dim)":isTesting?"var(--bg3)":"rgba(37,211,102,0.1)",
                            color:isSuccess?"var(--green)":isTesting?"var(--text3)":"#25d366",
                            fontSize:12,fontWeight:600,cursor:isTesting?"not-allowed":"pointer",fontFamily:"var(--font)",
                            display:"flex",alignItems:"center",gap:5,justifyContent:"center"
                          }}>
                          {isTesting?"⏳ Enviando...":isSuccess?"✅ Enviado!":"📱 Testar"}
                        </button>
                        <button className="btn-icon" style={{width:"100%",height:30}} onClick={()=>{setEditando(ag);setModal(true);}}>✏️ Editar</button>
                        <button className="btn-icon" style={{width:"100%",height:30,borderColor:"var(--red-dim)",color:"var(--red)"}} onClick={()=>excluirAgente(ag.id)}>🗑️ Excluir</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {abaPrincipal==="historico" && (
        <div className="card">
          <h3 className="card-title">📨 Histórico de Mensagens Enviadas</h3>
          <table className="data-table">
            <thead><tr><th>Usuário</th><th>Telefone</th><th>Mensagem</th><th>Agente</th><th>Horário</th><th>Status</th></tr></thead>
            <tbody>
              {historico.map(h=>{
                const ag = agentes.find(a=>a.id===h.agenteId);
                return (
                  <tr key={h.id}>
                    <td><div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div className="user-av" style={{width:24,height:24,fontSize:10}}>{h.usuario.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                      <strong>{h.usuario}</strong>
                    </div></td>
                    <td className="mono" style={{fontSize:11}}>{h.tel}</td>
                    <td style={{fontSize:12,maxWidth:320}}>{h.mensagem}</td>
                    <td><span style={{fontSize:11,background:"rgba(37,211,102,0.1)",color:"#25d366",padding:"2px 7px",borderRadius:4,fontWeight:600}}>
                      {ag?.nome?.split("—")[0]?.trim()||"—"}
                    </span></td>
                    <td className="mono" style={{fontSize:11}}>{h.hora}</td>
                    <td><span style={{
                      fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:5,
                      background:h.status==="lido"?"var(--green-dim)":"var(--accent-glow)",
                      color:h.status==="lido"?"var(--green)":"var(--accent)"
                    }}>{h.status==="lido"?"✓✓ Lido":"✓ Entregue"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {abaPrincipal==="configuracao" && (
        <div className="dash-row" style={{alignItems:"flex-start"}}>
          <div className="card" style={{flex:2}}>
            <h3 className="card-title">🔧 Configuração da API WhatsApp</h3>
            <div style={{background:"rgba(37,211,102,0.06)",border:"1px solid rgba(37,211,102,0.2)",borderRadius:9,padding:"14px 16px",marginBottom:20,display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:24}}>📱</span>
              <div>
                <span style={{fontWeight:700,color:"#25d366",display:"block"}}>WhatsApp Business API</span>
                <span style={{fontSize:12,color:"var(--text3)"}}>Configure abaixo a integração com sua conta para habilitar os disparos automáticos.</span>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group span-2">
                <label>Provedor de API</label>
                <select>
                  <option>Z-API (recomendado)</option>
                  <option>Evolution API</option>
                  <option>Twilio WhatsApp</option>
                  <option>360Dialog</option>
                  <option>Meta Cloud API (oficial)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Instance ID / Token</label>
                <input type="password" placeholder="••••••••••••••••••••" defaultValue="zapi_prod_1234567890"/>
              </div>
              <div className="form-group">
                <label>Client Token</label>
                <input type="password" placeholder="••••••••••••••••••••" defaultValue="cltoken_abcdef"/>
              </div>
              <div className="form-group span-2">
                <label>Número do WhatsApp (com DDI)</label>
                <input placeholder="+55 11 99999-0000" defaultValue="+55 11 99999-9999"/>
              </div>
              <div className="form-group">
                <label>Delay entre mensagens (segundos)</label>
                <select defaultValue="3">
                  {[1,2,3,5,10].map(v=><option key={v} value={v}>{v}s</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Limite diário de mensagens</label>
                <select defaultValue="100">
                  {[50,100,200,500,1000].map(v=><option key={v} value={v}>{v} mensagens/dia</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button className="btn-primary">💾 Salvar Configuração</button>
              <button className="btn-secondary">🔌 Testar Conexão</button>
            </div>
          </div>
          <div style={{flex:1}}>
            <div className="card">
              <h3 className="card-title">📊 Status da Integração</h3>
              {[
                ["Conexão API","✅ Ativa","var(--green)"],
                ["WhatsApp","✅ Conectado","var(--green)"],
                ["Fila de envio","📤 0 mensagens","var(--accent)"],
                ["Último teste","28/02 10:32","var(--text2)"],
              ].map(([l,v,c])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:13,color:"var(--text3)"}}>{l}</span>
                  <span style={{fontSize:13,fontWeight:600,color:c}}>{v}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 className="card-title">⏰ Próximos Disparos</h3>
              {agentes.filter(a=>a.ativo).map(a=>(
                <div key={a.id} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:16}}>{TEMPLATES_MENSAGEM[a.templateKey]?.icon}</span>
                  <div style={{flex:1}}>
                    <span style={{fontSize:12,fontWeight:600,display:"block"}}>{a.nome.split("—")[0].trim()}</span>
                    <span style={{fontSize:11,color:"var(--text3)"}}>Hoje às {a.horarioEnvio} · {usuarios.filter(u=>a.usuariosIds.includes(u.id)).length} destinatário(s)</span>
                  </div>
                  <span style={{fontSize:11,color:"#25d366",fontWeight:600}}>{a.horarioEnvio}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modal && <ModalAgente onClose={()=>setModal(false)} onSalvar={salvarAgente} usuarios={usuarios} clientes={clientes} editando={editando}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BANCO DE DADOS — AGENDA FISCAL (localStorage)
// ═══════════════════════════════════════════════════════

const DB_AGENDA_KEY = "fiscocontrol_agenda_v1";

function agendaDbLoad() {
  try {
    const raw = localStorage.getItem(DB_AGENDA_KEY);
    return raw ? JSON.parse(raw) : { eventos: [], version: 1 };
  } catch { return { eventos: [], version: 1 }; }
}

function agendaDbSave(data) {
  try { localStorage.setItem(DB_AGENDA_KEY, JSON.stringify(data)); return true; }
  catch { return false; }
}

function agendaDbAdd(evento) {
  const db = agendaDbLoad();
  const novo = { ...evento, id: Date.now() + Math.random(), criadoEm: new Date().toISOString() };
  db.eventos.push(novo);
  agendaDbSave(db);
  return novo;
}

function agendaDbUpdate(id, updates) {
  const db = agendaDbLoad();
  db.eventos = db.eventos.map(e => e.id === id ? { ...e, ...updates } : e);
  agendaDbSave(db);
}

function agendaDbDelete(id) {
  const db = agendaDbLoad();
  db.eventos = db.eventos.filter(e => e.id !== id);
  agendaDbSave(db);
}

// Calendário fixo de vencimentos por obrigação (dia do mês)
const VENCIMENTOS_AGENDA = {
  // FEDERAIS
  "ECD":          { dia:31, mes:"julho", ref:"Art. 5º IN RFB 1.420/2013",   esfera:"federal",   cor:"#0ea5e9" },
  "ECF":          { dia:31, mes:"julho", ref:"Art. 5º IN RFB 1.422/2013",   esfera:"federal",   cor:"#0ea5e9" },
  "EFD-Contrib":  { dia:10, mes:"seguinte", ref:"IN RFB 1.252/2012",        esfera:"federal",   cor:"#0ea5e9" },
  "EFD-ICMS-IPI": { dia:15, mes:"seguinte", ref:"Ajuste SINIEF 02/2009",    esfera:"estadual",  cor:"#a78bfa" },
  "EFD-Reinf":    { dia:15, mes:"seguinte", ref:"IN RFB 1.701/2017",        esfera:"federal",   cor:"#0ea5e9" },
  "DCTF":         { dia:15, mes:"seguinte", ref:"IN RFB 1.599/2015",        esfera:"federal",   cor:"#0ea5e9" },
  "DCTFWeb":      { dia:15, mes:"seguinte", ref:"IN RFB 1.787/2018",        esfera:"federal",   cor:"#0ea5e9" },
  "DIRF":         { dia:28, mes:"fevereiro", ref:"IN RFB vigente",          esfera:"federal",   cor:"#0ea5e9" },
  "PGDAS-D":      { dia:20, mes:"seguinte", ref:"Res. CGSN 140/2018",      esfera:"federal",   cor:"#0ea5e9" },
  "DEFIS":        { dia:31, mes:"marco", ref:"Res. CGSN vigente",           esfera:"federal",   cor:"#0ea5e9" },
  "DASN-SIMEI":   { dia:31, mes:"maio", ref:"Res. CGSN vigente",            esfera:"federal",   cor:"#0ea5e9" },
  "eSocial":      { dia:7,  mes:"seguinte", ref:"Dec. 8.373/2014",          esfera:"federal",   cor:"#0ea5e9" },
  "DCTFWebPrev":  { dia:15, mes:"seguinte", ref:"IN RFB 1.787/2018",        esfera:"federal",   cor:"#0ea5e9" },
  "GFIP-SEFIP":   { dia:7,  mes:"seguinte", ref:"Lei 9.802/1999",           esfera:"federal",   cor:"#0ea5e9" },
  "PERDCOMP":     { dia:null, mes:"eventual", ref:"IN RFB 1.300/2012",      esfera:"federal",   cor:"#0ea5e9" },
  "eFinanceira":  { dia:28, mes:"fevereiro", ref:"IN RFB 1.571/2015",       esfera:"federal",   cor:"#0ea5e9" },
  "SISCOSERV":    { dia:15, mes:"seguinte", ref:"IN RFB/SCS vigente",       esfera:"federal",   cor:"#0ea5e9" },
  // ESTADUAIS
  "GIA":          { dia:10, mes:"seguinte", ref:"SEFAZ estadual",           esfera:"estadual",  cor:"#a78bfa" },
  "GIA-ST":       { dia:10, mes:"seguinte", ref:"SEFAZ estadual",           esfera:"estadual",  cor:"#a78bfa" },
  "SINTEGRA":     { dia:15, mes:"seguinte", ref:"Conv. ICMS 57/1995",       esfera:"estadual",  cor:"#a78bfa" },
  "DeSTDA":       { dia:20, mes:"seguinte", ref:"Conv. ICMS 93/2015",       esfera:"estadual",  cor:"#a78bfa" },
  "DIME":         { dia:10, mes:"seguinte", ref:"Portaria SEF/SC",          esfera:"estadual",  cor:"#a78bfa" },
  "DAPI":         { dia:15, mes:"seguinte", ref:"RICMS/MG",                 esfera:"estadual",  cor:"#a78bfa" },
  "DIEF":         { dia:15, mes:"seguinte", ref:"Legislação estadual",      esfera:"estadual",  cor:"#a78bfa" },
  "CIAP":         { dia:20, mes:"seguinte", ref:"Convênio ICMS",            esfera:"estadual",  cor:"#a78bfa" },
  // MUNICIPAIS
  "DES":          { dia:10, mes:"seguinte", ref:"Legislação municipal",     esfera:"municipal", cor:"#22d3ee" },
  "DMS":          { dia:10, mes:"seguinte", ref:"Legislação municipal",     esfera:"municipal", cor:"#22d3ee" },
  "NFS-e":        { dia:null, mes:"eventual", ref:"LC 116/2003",            esfera:"municipal", cor:"#22d3ee" },
  "ISSRetido":    { dia:10, mes:"seguinte", ref:"Legislação municipal",     esfera:"municipal", cor:"#22d3ee" },
  "LivroISS":     { dia:15, mes:"seguinte", ref:"Legislação municipal",     esfera:"municipal", cor:"#22d3ee" },
  "DES-IF":       { dia:15, mes:"seguinte", ref:"Legislação municipal",     esfera:"municipal", cor:"#22d3ee" },
};

// Gerar eventos de agenda a partir das obrigações dos clientes
function gerarEventosAgenda(clientes) {
  const db = agendaDbLoad();
  const mesAtualN = new Date().getMonth();
  const anoAtualN = new Date().getFullYear();
  const eventos = [];

  clientes.forEach(cliente => {
    const obs = cliente.obrigacoesSelecionadas || [];
    obs.forEach(obId => {
      const venc = VENCIMENTOS_AGENDA[obId];
      if (!venc || !venc.dia) return;
      // Gerar para meses -1 a +3
      for (let delta = -1; delta <= 3; delta++) {
        let mes = mesAtualN + delta;
        let ano = anoAtualN;
        if (mes < 0) { mes += 12; ano--; }
        if (mes > 11) { mes -= 12; ano++; }
        const competencia = `${ano}-${String(mes + 1).padStart(2, "0")}`;
        const diaVenc = Math.min(venc.dia, new Date(ano, mes + 1, 0).getDate());
        const dataVenc = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(diaVenc).padStart(2, "0")}`;
        // Verificar se já existe no DB
        const jaExiste = db.eventos.some(e =>
          e.clienteId === cliente.id && e.obrigacaoId === obId && e.competencia === competencia
        );
        if (!jaExiste) {
          eventos.push({
            id: `auto_${cliente.id}_${obId}_${competencia}`,
            clienteId: cliente.id,
            clienteNome: cliente.razaoSocial,
            regime: cliente.regime,
            obrigacaoId: obId,
            obrigacaoNome: TODAS_OBRIGACOES_LISTA.find(o => o.id === obId)?.nome?.split(" — ")[0] || obId,
            esfera: venc.esfera,
            cor: venc.cor,
            competencia,
            dataVencimento: dataVenc,
            ref: venc.ref,
            status: new Date(dataVenc) < new Date() ? "Vencida" : "Pendente",
            entregue: false,
            auto: true,
          });
        }
      }
    });
  });
  return eventos;
}

// ═══════════════════════════════════════════════════════
// PÁGINA: AGENDA FISCAL
// ═══════════════════════════════════════════════════════

const NOMES_MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function AgendaFiscal({ clientes, obrigacoes }) {
  const [esfera, setEsfera] = useState("federal");
  const [mesVis, setMesVis] = useState(new Date().getMonth());
  const [anoVis, setAnoVis] = useState(new Date().getFullYear());
  const [filtroCliente, setFiltroCliente] = useState("todos");
  const [eventosSalvos, setEventosSalvos] = useState(() => agendaDbLoad().eventos);
  const [eventosAuto] = useState(() => gerarEventosAgenda(clientes));
  const [modalEvento, setModalEvento] = useState(null);
  const [viewMode, setViewMode] = useState("calendario"); // calendario | lista
  const [busca, setBusca] = useState("");

  // Todos os eventos: auto-gerados + salvos manualmente
  const todosEventos = [
    ...eventosAuto,
    ...eventosSalvos.filter(e => !e.auto),
  ];

  const toggleEntregue = (ev) => {
    const db = agendaDbLoad();
    // Se for auto, salvar no DB como override
    const existeNoDb = db.eventos.find(e => e.id === ev.id);
    if (existeNoDb) {
      agendaDbUpdate(ev.id, { entregue: !ev.entregue, status: !ev.entregue ? "Entregue" : "Pendente" });
    } else {
      agendaDbAdd({ ...ev, entregue: true, status: "Entregue" });
    }
    setEventosSalvos(agendaDbLoad().eventos);
  };

  // Filtros
  const eventosFiltrados = todosEventos.filter(ev => {
    const [ano, mes] = ev.competencia.split("-").map(Number);
    const mC = filtroCliente === "todos" || ev.clienteId === parseInt(filtroCliente);
    const mE = ev.esfera === esfera;
    const mM = ano === anoVis && mes === mesVis + 1;
    const mB = !busca || ev.clienteNome.toLowerCase().includes(busca.toLowerCase()) || ev.obrigacaoId.toLowerCase().includes(busca.toLowerCase());
    return mC && mE && mM && mB;
  }).sort((a, b) => a.dataVencimento.localeCompare(b.dataVencimento));

  // Override de status do DB
  const getStatus = (ev) => {
    const dbEv = eventosSalvos.find(e => e.id === ev.id || (e.clienteId === ev.clienteId && e.obrigacaoId === ev.obrigacaoId && e.competencia === ev.competencia));
    return dbEv ? dbEv : ev;
  };

  // KPIs do mês/esfera
  const evMes = todosEventos.filter(ev => {
    const [ano, mes] = ev.competencia.split("-").map(Number);
    return ev.esfera === esfera && ano === anoVis && mes === mesVis + 1 && (filtroCliente === "todos" || ev.clienteId === parseInt(filtroCliente));
  });
  const kpiTotal    = evMes.length;
  const kpiEntregue = evMes.filter(ev => getStatus(ev).entregue).length;
  const kpiPendente = evMes.filter(ev => !getStatus(ev).entregue && new Date(ev.dataVencimento) >= new Date()).length;
  const kpiVencida  = evMes.filter(ev => !getStatus(ev).entregue && new Date(ev.dataVencimento) < new Date()).length;

  // Calendário mensal
  const diasNoMes = new Date(anoVis, mesVis + 1, 0).getDate();
  const primeiroDia = new Date(anoVis, mesVis, 1).getDay();
  const hoje2 = new Date();

  const esferas = [
    { id:"federal",   label:"🏛️ Federal",   cor:"#0ea5e9" },
    { id:"estadual",  label:"🏢 Estadual",   cor:"#a78bfa" },
    { id:"municipal", label:"🏙️ Municipal",  cor:"#22d3ee" },
  ];
  const esferaAtual = esferas.find(e => e.id === esfera);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">📆 Agenda Fiscal</h1>
          <p className="page-sub">Vencimentos automáticos por empresa · {todosEventos.length} obrigações mapeadas</p>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <select value={filtroCliente} onChange={e=>setFiltroCliente(e.target.value)} style={{fontSize:12,minWidth:170}}>
            <option value="todos">Todas as empresas</option>
            {clientes.map(c=><option key={c.id} value={c.id}>{c.razaoSocial.split(" ").slice(0,3).join(" ")}</option>)}
          </select>
          <button onClick={()=>setViewMode(v=>v==="calendario"?"lista":"calendario")} className="btn-secondary" style={{fontSize:12}}>
            {viewMode==="calendario"?"📋 Lista":"📅 Calendário"}
          </button>
        </div>
      </div>

      {/* Sub-abas de esfera */}
      <div style={{display:"flex",gap:0,borderBottom:"1px solid var(--border)",marginBottom:20}}>
        {esferas.map(e=>(
          <button key={e.id} onClick={()=>setEsfera(e.id)} style={{
            background:"none",border:"none",fontFamily:"var(--font)",fontSize:14,fontWeight:700,
            padding:"11px 24px",cursor:"pointer",
            color: esfera===e.id ? e.cor : "var(--text3)",
            borderBottom: esfera===e.id ? `3px solid ${e.cor}` : "3px solid transparent",
          }}>{e.label}</button>
        ))}
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {n:kpiTotal,    ic:"📋",l:"Total no Mês",   cor:esferaAtual.cor},
          {n:kpiEntregue, ic:"✅",l:"Entregues",       cor:"var(--green)"},
          {n:kpiPendente, ic:"⏳",l:"Pendentes",       cor:"var(--orange)"},
          {n:kpiVencida,  ic:"🚨",l:"Vencidas",        cor:"var(--red)"},
        ].map((k,i)=>(
          <div key={i} className="kpi-card" style={{borderLeft:`3px solid ${k.cor}`}}>
            <div className="kpi-icon">{k.ic}</div>
            <div className="kpi-info">
              <span className="kpi-num" style={{color:k.cor}}>{k.n}</span>
              <span className="kpi-label">{k.l}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navegação de mês */}
      <div className="card" style={{marginBottom:16,padding:"12px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <button className="btn-nav" onClick={()=>{
            if(mesVis===0){setMesVis(11);setAnoVis(a=>a-1);}else setMesVis(m=>m-1);
          }}>◀</button>
          <span style={{fontSize:18,fontWeight:800,color:esferaAtual.cor,minWidth:200,textAlign:"center"}}>
            {NOMES_MESES[mesVis]} / {anoVis}
          </span>
          <button className="btn-nav" onClick={()=>{
            if(mesVis===11){setMesVis(0);setAnoVis(a=>a+1);}else setMesVis(m=>m+1);
          }}>▶</button>
          <button className="btn-secondary" style={{fontSize:11,marginLeft:8}} onClick={()=>{setMesVis(new Date().getMonth());setAnoVis(new Date().getFullYear());}}>
            Hoje
          </button>
          <div style={{flex:1}}/>
          <input className="search-input" style={{maxWidth:220,fontSize:12}} placeholder="Buscar empresa ou obrigação..." value={busca} onChange={e=>setBusca(e.target.value)}/>
        </div>
      </div>

      {/* MODO CALENDÁRIO */}
      {viewMode === "calendario" && (
        <div className="card">
          <div className="cal-grid-header">
            {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d=>(
              <div key={d} className="cal-dow">{d}</div>
            ))}
          </div>
          <div className="cal-grid">
            {Array.from({length:primeiroDia}).map((_,i)=>(
              <div key={"e"+i} className="cal-cell cal-empty"/>
            ))}
            {Array.from({length:diasNoMes}).map((_,i)=>{
              const dia = i+1;
              const dataStr = `${anoVis}-${String(mesVis+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
              const evsDia = eventosFiltrados.filter(ev => ev.dataVencimento === dataStr);
              const ehHoje = dia===hoje2.getDate() && mesVis===hoje2.getMonth() && anoVis===hoje2.getFullYear();
              return (
                <div key={dia} className={`cal-cell ${evsDia.length?"cal-has-obs":""} ${ehHoje?"cal-today":""}`}
                  onClick={()=>evsDia.length && setModalEvento({dia, dataStr, eventos:evsDia})}>
                  <span className="cal-day-num">{dia}</span>
                  {evsDia.slice(0,3).map((ev,idx)=>{
                    const evS = getStatus(ev);
                    return (
                      <div key={idx} style={{
                        fontSize:9,fontWeight:700,padding:"1px 4px",borderRadius:3,marginTop:2,
                        background: evS.entregue ? "var(--green-dim)" : new Date(ev.dataVencimento)<new Date() ? "var(--red-dim)" : `${ev.cor}20`,
                        color: evS.entregue ? "var(--green)" : new Date(ev.dataVencimento)<new Date() ? "var(--red)" : ev.cor,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
                      }}>
                        {evS.entregue?"✓ ":""}{ev.obrigacaoId}
                      </div>
                    );
                  })}
                  {evsDia.length>3 && <span className="cal-count">+{evsDia.length-3}</span>}
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:16,marginTop:12,fontSize:11,color:"var(--text3)",flexWrap:"wrap"}}>
            <span><span style={{color:"var(--green)",fontWeight:700}}>■</span> Entregue</span>
            <span><span style={{color:esferaAtual.cor,fontWeight:700}}>■</span> Pendente</span>
            <span><span style={{color:"var(--red)",fontWeight:700}}>■</span> Vencida</span>
            <span style={{marginLeft:"auto",fontStyle:"italic"}}>{filtroCliente==="todos"?"Todas as empresas":clientes.find(c=>c.id===parseInt(filtroCliente))?.razaoSocial}</span>
          </div>
        </div>
      )}

      {/* MODO LISTA */}
      {viewMode === "lista" && (
        <div className="card">
          <h3 className="card-title" style={{color:esferaAtual.cor}}>
            {esferaAtual.label} — {NOMES_MESES[mesVis]}/{anoVis}
          </h3>
          {eventosFiltrados.length === 0 ? (
            <div style={{textAlign:"center",padding:40,color:"var(--text3)"}}>
              <span style={{fontSize:40,display:"block",marginBottom:10}}>📭</span>
              <p>Nenhuma obrigação {esfera} neste período.</p>
              <p style={{fontSize:12,marginTop:8}}>Vincule obrigações aos clientes no cadastro de empresas.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vencimento</th>
                  <th>Obrigação</th>
                  <th>Cliente</th>
                  <th>Regime</th>
                  <th>Base Legal</th>
                  <th>Status</th>
                  <th style={{textAlign:"center"}}>Entregue</th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.map(ev=>{
                  const evS = getStatus(ev);
                  const vencida = !evS.entregue && new Date(ev.dataVencimento) < new Date();
                  const statusCor = evS.entregue ? "var(--green)" : vencida ? "var(--red)" : "var(--orange)";
                  const statusTxt = evS.entregue ? "Entregue" : vencida ? "Vencida" : "Pendente";
                  return (
                    <tr key={ev.id} className={vencida&&!evS.entregue?"row-late":""}>
                      <td>
                        <span style={{fontFamily:"var(--mono)",fontWeight:700,fontSize:12,color:statusCor}}>
                          {new Date(ev.dataVencimento+"T12:00").toLocaleDateString("pt-BR")}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontFamily:"var(--mono)",fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:4,
                          background:`${ev.cor}15`,color:ev.cor
                        }}>{ev.obrigacaoId}</span>
                        <span style={{fontSize:11,color:"var(--text3)",marginLeft:6}}>{ev.obrigacaoNome}</span>
                      </td>
                      <td style={{fontSize:12,fontWeight:600}}>{ev.clienteNome.split(" ").slice(0,3).join(" ")}</td>
                      <td><span className="regime-tag" style={{fontSize:10}}>{ev.regime?.split(" ")[0]}</span></td>
                      <td style={{fontSize:10,color:"var(--text3)",fontStyle:"italic"}}>{ev.ref}</td>
                      <td>
                        <span style={{
                          fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:5,
                          background: evS.entregue?"var(--green-dim)":vencida?"var(--red-dim)":"var(--orange-dim)",
                          color: statusCor
                        }}>{statusTxt}</span>
                      </td>
                      <td style={{textAlign:"center"}}>
                        <button
                          onClick={()=>toggleEntregue(evS.entregue?evS:ev)}
                          style={{
                            width:24,height:24,borderRadius:5,border:`2px solid ${evS.entregue?"var(--green)":"var(--border2)"}`,
                            background:evS.entregue?"var(--green-dim)":"var(--bg3)",
                            color:"var(--green)",fontSize:13,cursor:"pointer",display:"inline-flex",
                            alignItems:"center",justifyContent:"center"
                          }}>
                          {evS.entregue?"✓":""}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal de dia */}
      {modalEvento && (
        <div className="modal-overlay" onClick={()=>setModalEvento(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>📅 {new Date(modalEvento.dataStr+"T12:00").toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"})}</h2>
              <button className="modal-close" onClick={()=>setModalEvento(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{fontSize:12,color:"var(--text3)",marginBottom:14}}>{modalEvento.eventos.length} obrigação(ões) vencendo neste dia:</p>
              {modalEvento.eventos.map(ev=>{
                const evS = getStatus(ev);
                return (
                  <div key={ev.id} style={{
                    background:"var(--bg3)",borderRadius:9,padding:"12px 14px",marginBottom:10,
                    borderLeft:`3px solid ${ev.cor}`,
                    display:"flex",alignItems:"center",gap:12
                  }}>
                    <span style={{fontFamily:"var(--mono)",fontSize:12,fontWeight:700,color:ev.cor,minWidth:80}}>{ev.obrigacaoId}</span>
                    <div style={{flex:1}}>
                      <span style={{display:"block",fontSize:13,fontWeight:600}}>{ev.clienteNome.split(" ").slice(0,3).join(" ")}</span>
                      <span style={{fontSize:11,color:"var(--text3)"}}>{ev.obrigacaoNome} · {ev.regime}</span>
                    </div>
                    <button onClick={()=>{toggleEntregue(evS.entregue?evS:ev);setModalEvento(null);}} style={{
                      padding:"5px 12px",borderRadius:6,border:`1px solid ${evS.entregue?"var(--green)":"var(--border)"}`,
                      background:evS.entregue?"var(--green-dim)":"var(--bg4)",
                      color:evS.entregue?"var(--green)":"var(--text3)",
                      fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"
                    }}>{evS.entregue?"✓ Entregue":"Marcar Entregue"}</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PÁGINA: SUPORTE
// ═══════════════════════════════════════════════════════

function Suporte() {
  const [ticketForm, setTicketForm] = useState({nome:"",email:"",assunto:"",mensagem:"",prioridade:"Normal"});
  const [enviado, setEnviado] = useState(false);

  const enviar = () => {
    if (!ticketForm.nome || !ticketForm.mensagem) return;
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
    setTicketForm({nome:"",email:"",assunto:"",mensagem:"",prioridade:"Normal"});
  };

  const faqs = [
    {p:"Como registrar uma nova obrigação?", r:"Acesse a página Obrigações, clique em + Nova Obrigação, preencha os dados do cliente, tipo e prazo e salve."},
    {p:"Como vincular empresas a um usuário?", r:"Na página Equipe, edite o usuário e na aba Empresas/Clientes selecione as empresas desejadas."},
    {p:"Como configurar o agente de WhatsApp?", r:"Acesse Automação WA, crie um novo agente, selecione o template e os usuários, e configure a API na aba Integração WA."},
    {p:"Como exportar o histórico de entregas?", r:"Na página Hist. Entregas, clique em Exportar CSV no canto superior direito para baixar todos os registros."},
    {p:"Os dados ficam salvos se fechar o navegador?", r:"Sim! O Histórico de Entregas usa localStorage e fica salvo no computador. Os demais dados serão integrados a banco externo em breve."},
    {p:"Como registrar uma entrega com recibo?", r:"Na página Hist. Entregas, clique em Registrar Entrega, preencha o cliente, declaração, datas e informe o número do protocolo/recibo."},
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">🎧 Suporte</h1>
          <p className="page-sub">Central de ajuda · Monitoring R.P.G.E Assessoria</p>
        </div>
      </div>

      {/* Cartão principal do contador */}
      <div style={{
        background:"linear-gradient(135deg,#0d1e35 0%,#0a1628 50%,#0d1e35 100%)",
        border:"1px solid #1e3a5f",
        borderRadius:16,marginBottom:24,overflow:"hidden",position:"relative"
      }}>
        {/* Fundo decorativo */}
        <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
          <div style={{position:"absolute",top:-60,right:-60,width:220,height:220,borderRadius:"50%",background:"rgba(14,165,233,0.06)"}}/>
          <div style={{position:"absolute",bottom:-40,left:-40,width:180,height:180,borderRadius:"50%",background:"rgba(124,58,237,0.06)"}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:400,height:1,background:"linear-gradient(90deg,transparent,rgba(14,165,233,0.1),transparent)"}}/>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:32,padding:"32px 36px",flexWrap:"wrap",position:"relative"}}>
          {/* Avatar 3D animado */}
          <div style={{flexShrink:0}}>
            <div style={{
              width:90,height:90,borderRadius:"50%",
              background:"linear-gradient(135deg,#0ea5e9,#7c3aed)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:40,
              boxShadow:"0 0 0 3px rgba(14,165,233,0.2), 0 0 30px rgba(14,165,233,0.15), 0 8px 32px rgba(0,0,0,0.4)",
              animation:"logo-float 3s ease-in-out infinite"
            }}>👨‍💼</div>
          </div>

          {/* Info */}
          <div style={{flex:1,minWidth:200}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <h2 style={{fontSize:22,fontWeight:800,color:"#e2eaf5",letterSpacing:"-.3px"}}>Rogério</h2>
              <span style={{fontSize:12,fontWeight:600,padding:"3px 10px",borderRadius:20,background:"rgba(14,165,233,0.15)",color:"var(--accent)",border:"1px solid rgba(14,165,233,0.3)"}}>Contador Responsável</span>
            </div>
            <p style={{fontSize:14,color:"#8ba4bf",marginBottom:16,lineHeight:1.5}}>
              Monitoring R.P.G.E Assessoria · Gestão Tributária &amp; Fiscal
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {/* WhatsApp */}
              <a
                href="https://wa.me/5562991929386"
                target="_blank"
                rel="noreferrer"
                style={{
                  display:"flex",alignItems:"center",gap:10,
                  background:"rgba(37,211,102,0.12)",border:"1px solid rgba(37,211,102,0.3)",
                  borderRadius:10,padding:"12px 20px",textDecoration:"none",
                  transition:"all .2s",cursor:"pointer"
                }}
              >
                <span style={{fontSize:24}}>💬</span>
                <div>
                  <span style={{display:"block",fontSize:11,color:"#25d366",fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>WhatsApp</span>
                  <span style={{display:"block",fontSize:16,fontWeight:800,color:"#e2eaf5",letterSpacing:".5px"}}>(62) 9 9192-9386</span>
                </div>
              </a>

              {/* Telefone */}
              <a
                href="tel:+5562991929386"
                style={{
                  display:"flex",alignItems:"center",gap:10,
                  background:"rgba(14,165,233,0.08)",border:"1px solid rgba(14,165,233,0.2)",
                  borderRadius:10,padding:"12px 20px",textDecoration:"none",cursor:"pointer"
                }}
              >
                <span style={{fontSize:22}}>📞</span>
                <div>
                  <span style={{display:"block",fontSize:11,color:"var(--accent)",fontWeight:700,letterSpacing:".5px",textTransform:"uppercase"}}>Ligar</span>
                  <span style={{display:"block",fontSize:16,fontWeight:800,color:"#e2eaf5",letterSpacing:".5px"}}>(62) 9 9192-9386</span>
                </div>
              </a>
            </div>
          </div>

          {/* Badge direita */}
          <div style={{
            flexShrink:0,textAlign:"center",
            background:"rgba(14,165,233,0.06)",border:"1px solid rgba(14,165,233,0.15)",
            borderRadius:12,padding:"20px 28px"
          }}>
            <div style={{fontSize:36,marginBottom:6}}>⚖️</div>
            <div style={{fontSize:11,color:"var(--accent)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>CRC-GO 027378-6</div>
            <div style={{fontSize:11,color:"#4d6e8a",marginTop:4}}>Seg–Sex · 08h–18h</div>
          </div>
        </div>
      </div>

      <div className="dash-row" style={{alignItems:"flex-start",gap:20}}>
        {/* Coluna esquerda — canais + FAQ */}
        <div style={{flex:2,display:"flex",flexDirection:"column",gap:16}}>

          {/* Canais de atendimento */}
          <div className="card">
            <h3 className="card-title">📡 Canais de Atendimento</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {ic:"💬",label:"WhatsApp",valor:"(62) 9 9192-9386",sub:"Resposta em até 2h",cor:"#25d366",href:"https://wa.me/5562991929386"},
                {ic:"📞",label:"Telefone",valor:"(62) 9 9192-9386",sub:"Seg–Sex 08h–18h",cor:"var(--accent)",href:"tel:+5562991929386"},
                {ic:"📧",label:"E-mail",valor:"rpgeassessoria@gmail.com",sub:"Resposta em até 24h",cor:"var(--orange)",href:"mailto:rpgeassessoria@gmail.com"},
                {ic:"🕐",label:"Horário",valor:"08:00 – 18:00",sub:"Segunda a Sexta-feira",cor:"var(--text2)",href:null},
              ].map((c,i)=>(
                <div key={i} style={{
                  background:"var(--bg3)",borderRadius:10,padding:"14px 16px",
                  border:"1px solid var(--border)",
                  borderLeft:`3px solid ${c.cor}`,
                  display:"flex",gap:12,alignItems:"center"
                }}>
                  <span style={{fontSize:26,flexShrink:0}}>{c.ic}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <span style={{display:"block",fontSize:10,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>{c.label}</span>
                    <span style={{display:"block",fontSize:13,fontWeight:700,color:c.cor,marginTop:2}}>{c.valor}</span>
                    <span style={{display:"block",fontSize:11,color:"var(--text3)",marginTop:1}}>{c.sub}</span>
                  </div>
                  {c.href && (
                    <a href={c.href} target={c.href.startsWith("http")?"_blank":"_self"} rel="noreferrer" style={{
                      padding:"6px 12px",borderRadius:6,border:`1px solid ${c.cor}33`,
                      background:`${c.cor}10`,color:c.cor,fontSize:11,fontWeight:600,textDecoration:"none"
                    }}>Abrir</a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="card">
            <h3 className="card-title">❓ Perguntas Frequentes</h3>
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {faqs.map((f,i)=>(
                <FaqItem key={i} pergunta={f.p} resposta={f.r} />
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita — ticket + versão */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:16}}>
          <div className="card">
            <h3 className="card-title">📩 Enviar Mensagem</h3>
            {enviado ? (
              <div style={{
                background:"var(--green-dim)",border:"1px solid rgba(34,197,94,0.2)",
                borderRadius:9,padding:"20px",textAlign:"center"
              }}>
                <span style={{fontSize:32,display:"block",marginBottom:8}}>✅</span>
                <span style={{fontWeight:700,color:"var(--green)"}}>Mensagem enviada!</span>
                <p style={{fontSize:12,color:"var(--text3)",marginTop:6}}>Em breve Rogério entrará em contato.</p>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div className="form-group">
                  <label>Seu nome</label>
                  <input value={ticketForm.nome} onChange={e=>setTicketForm({...ticketForm,nome:e.target.value})} placeholder="Nome completo"/>
                </div>
                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" value={ticketForm.email} onChange={e=>setTicketForm({...ticketForm,email:e.target.value})} placeholder="seu@email.com"/>
                </div>
                <div className="form-group">
                  <label>Prioridade</label>
                  <select value={ticketForm.prioridade} onChange={e=>setTicketForm({...ticketForm,prioridade:e.target.value})}>
                    <option>Normal</option><option>Urgente</option><option>Crítico</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mensagem</label>
                  <textarea
                    value={ticketForm.mensagem}
                    onChange={e=>setTicketForm({...ticketForm,mensagem:e.target.value})}
                    placeholder="Descreva sua dúvida ou problema..."
                    style={{
                      width:"100%",minHeight:100,background:"var(--bg3)",border:"1px solid var(--border)",
                      borderRadius:7,padding:"10px 12px",color:"var(--text)",fontSize:13,
                      resize:"vertical",fontFamily:"var(--font)"
                    }}
                  />
                </div>
                <button className="btn-primary btn-full" onClick={enviar} style={{marginTop:4}}>
                  📤 Enviar Mensagem
                </button>
                <p style={{fontSize:11,color:"var(--text3)",textAlign:"center",marginTop:4}}>
                  Ou entre em contato diretamente pelo WhatsApp
                </p>
                <a href="https://wa.me/5562991929386" target="_blank" rel="noreferrer" style={{
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  background:"rgba(37,211,102,0.1)",border:"1px solid rgba(37,211,102,0.3)",
                  borderRadius:7,padding:"10px",textDecoration:"none",
                  color:"#25d366",fontWeight:700,fontSize:13
                }}>
                  <span style={{fontSize:18}}>💬</span> Abrir WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Sobre o sistema */}
          <div className="card">
            <h3 className="card-title">ℹ️ Sobre o Sistema</h3>
            <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.9}}>
              {[
                ["Sistema","FiscoControl"],
                ["Empresa","R.P.G.E Assessoria"],
                ["Responsável","Rogério — Contador"],
                ["CRC","CRC-GO 027378-6"],
                ["Contato","(62) 9 9192-9386"],
                ["Versão","2.0 — 2026"],
                ["Módulos","11 páginas ativas"],
              ].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--border)"}}>
                  <span>{l}</span>
                  <span style={{fontWeight:600,color:"var(--text2)"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ pergunta, resposta }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div style={{borderBottom:"1px solid var(--border)"}}>
      <div
        onClick={()=>setAberto(!aberto)}
        style={{
          display:"flex",alignItems:"center",gap:10,padding:"13px 4px",
          cursor:"pointer",userSelect:"none"
        }}
      >
        <span style={{fontSize:14,color:"var(--accent)",fontWeight:700,flexShrink:0}}>{aberto?"▼":"▶"}</span>
        <span style={{fontSize:13,fontWeight:600,color:"var(--text)",flex:1}}>{pergunta}</span>
      </div>
      {aberto && (
        <div style={{
          fontSize:12,color:"var(--text3)",lineHeight:1.7,
          padding:"0 4px 14px 24px",
          borderLeft:"2px solid var(--accent)",marginLeft:7
        }}>{resposta}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BANCO DE DADOS LOCAL — IndexedDB via localStorage
// ═══════════════════════════════════════════════════════

const DB_KEY = "fiscocontrol_entregas_v1";

function dbLoad() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : { entregas: [], version: 1 };
  } catch { return { entregas: [], version: 1 }; }
}

function dbSave(data) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(data)); return true; }
  catch { return false; }
}

function dbAddEntrega(entrega) {
  const db = dbLoad();
  const nova = { ...entrega, id: Date.now(), criadoEm: new Date().toISOString() };
  db.entregas.push(nova);
  dbSave(db);
  return nova;
}

function dbUpdateEntrega(id, updates) {
  const db = dbLoad();
  db.entregas = db.entregas.map(e => e.id === id ? { ...e, ...updates, atualizadoEm: new Date().toISOString() } : e);
  dbSave(db);
}

function dbDeleteEntrega(id) {
  const db = dbLoad();
  db.entregas = db.entregas.filter(e => e.id !== id);
  dbSave(db);
}

function dbSeedIfEmpty(clientes, obrigacoes) {
  const db = dbLoad();
  if (db.entregas.length > 0) return;
  // Popular com dados iniciais baseados nas obrigações existentes
  const semente = [];
  const meses = ["2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02"];
  const declaracoes = [
    "ECD","ECF","EFD-Contrib","DCTF","DCTFWeb","DIRF","eSocial","EFD-Reinf",
    "PGDAS-D","DEFIS","NFS-e","GIA","DeSTDA","DMS","ISSRetido","FGTS","GPS"
  ];
  clientes.forEach(cliente => {
    const obsCliente = cliente.obrigacoesSelecionadas || [];
    meses.forEach(mes => {
      obsCliente.slice(0, 6).forEach(obId => {
        const dataVenc = new Date(mes + "-15");
        const rand = Math.random();
        const entregue = dataVenc < new Date("2026-02-28");
        const diasAtraso = entregue ? Math.floor(Math.random() * 5) - 2 : null;
        const dataEntrega = entregue ? new Date(dataVenc.getTime() + diasAtraso * 86400000).toISOString().split("T")[0] : null;
        semente.push({
          id: Date.now() + Math.random(),
          criadoEm: new Date().toISOString(),
          clienteId: cliente.id,
          clienteNome: cliente.razaoSocial,
          regime: cliente.regime,
          declaracaoId: obId,
          declaracaoNome: obId,
          competencia: mes,
          dataVencimento: mes + "-15",
          dataEntrega,
          status: entregue ? (diasAtraso > 0 ? "Entregue com atraso" : "Entregue no prazo") : "Pendente",
          diasAtraso: diasAtraso || 0,
          responsavel: cliente.responsavel,
          observacao: "",
          recibo: entregue ? "REC" + Math.floor(Math.random()*900000+100000) : "",
        });
      });
    });
  });
  db.entregas = semente;
  dbSave(db);
}

// ═══════════════════════════════════════════════════════
// PÁGINA: HISTÓRICO DE ENTREGAS — COMPARATIVO MENSAL
// ═══════════════════════════════════════════════════════

const MESES_LISTA = [
  {v:"2025-07",l:"Jul/2025"},{v:"2025-08",l:"Ago/2025"},{v:"2025-09",l:"Set/2025"},
  {v:"2025-10",l:"Out/2025"},{v:"2025-11",l:"Nov/2025"},{v:"2025-12",l:"Dez/2025"},
  {v:"2026-01",l:"Jan/2026"},{v:"2026-02",l:"Fev/2026"},{v:"2026-03",l:"Mar/2026"},
  {v:"2026-04",l:"Abr/2026"},{v:"2026-05",l:"Mai/2026"},{v:"2026-06",l:"Jun/2026"},
];

function ModalRegistroEntrega({ onClose, onSalvar, clientes, usuarios, editando }) {
  const [form, setForm] = useState(editando || {
    clienteId:"", clienteNome:"", regime:"", declaracaoId:"", declaracaoNome:"",
    competencia: new Date().toISOString().slice(0,7),
    dataVencimento:"", dataEntrega:"", status:"Entregue no prazo",
    diasAtraso:0, responsavel:"", observacao:"", recibo:""
  });

  const clienteSel = clientes.find(c => c.id === parseInt(form.clienteId));
  const declaracoes = clienteSel ? (clienteSel.obrigacoesSelecionadas || []) : [];

  const calcStatus = (venc, entrega) => {
    if (!entrega) return "Pendente";
    const dv = new Date(venc), de = new Date(entrega);
    const diff = Math.ceil((de - dv) / 86400000);
    return diff > 0 ? "Entregue com atraso" : "Entregue no prazo";
  };

  const handleClienteChange = (id) => {
    const c = clientes.find(x => x.id === parseInt(id));
    setForm(f => ({ ...f, clienteId: id, clienteNome: c?.razaoSocial||"", regime: c?.regime||"", responsavel: c?.responsavel||"", declaracaoId:"", declaracaoNome:"" }));
  };

  const handleDatasChange = (field, val) => {
    const updated = { ...form, [field]: val };
    if (updated.dataVencimento && updated.dataEntrega) {
      const diff = Math.ceil((new Date(updated.dataEntrega) - new Date(updated.dataVencimento)) / 86400000);
      updated.diasAtraso = diff;
      updated.status = calcStatus(updated.dataVencimento, updated.dataEntrega);
    }
    setForm(updated);
  };

  const statusCor = { "Entregue no prazo":"var(--green)", "Entregue com atraso":"var(--orange)", "Pendente":"var(--text3)" };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2>{editando ? "Editar Registro" : "Registrar Entrega"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid form-grid-3">
            <div className="form-group span-2">
              <label>Cliente *</label>
              <select value={form.clienteId} onChange={e => handleClienteChange(e.target.value)}>
                <option value="">Selecione o cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.razaoSocial}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Competência *</label>
              <input type="month" value={form.competencia} onChange={e=>setForm({...form,competencia:e.target.value})}/>
            </div>
            <div className="form-group span-2">
              <label>Declaração / Obrigação *</label>
              <select value={form.declaracaoId} onChange={e=>setForm({...form,declaracaoId:e.target.value,declaracaoNome:e.target.value})}>
                <option value="">Selecione...</option>
                {declaracoes.length > 0
                  ? declaracoes.map(d => <option key={d} value={d}>{d}</option>)
                  : TODAS_OBRIGACOES_LISTA.map(o => <option key={o.id} value={o.id}>{o.id} — {o.nome.split("—")[0].trim()}</option>)
                }
              </select>
            </div>
            <div className="form-group">
              <label>Responsável</label>
              <select value={form.responsavel} onChange={e=>setForm({...form,responsavel:e.target.value})}>
                <option value="">Selecione...</option>
                {usuarios.filter(u=>u.ativo).map(u=><option key={u.id}>{u.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Data de Vencimento</label>
              <input type="date" value={form.dataVencimento} onChange={e=>handleDatasChange("dataVencimento",e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Data de Entrega</label>
              <input type="date" value={form.dataEntrega} onChange={e=>handleDatasChange("dataEntrega",e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Nº do Recibo / Protocolo</label>
              <input value={form.recibo} onChange={e=>setForm({...form,recibo:e.target.value})} placeholder="Ex: REC123456"/>
            </div>
            {form.dataVencimento && form.dataEntrega && (
              <div className="form-group span-3">
                <div style={{padding:"10px 14px",borderRadius:8,background:"var(--bg3)",display:"flex",gap:16,alignItems:"center"}}>
                  <span style={{fontSize:13,color:"var(--text3)"}}>Status calculado:</span>
                  <span style={{fontWeight:700,fontSize:13,color:statusCor[form.status]}}>{form.status}</span>
                  {form.diasAtraso > 0 && <span style={{fontSize:12,color:"var(--orange)"}}>({form.diasAtraso} dias de atraso)</span>}
                  {form.diasAtraso < 0 && <span style={{fontSize:12,color:"var(--green)"}}>({Math.abs(form.diasAtraso)} dias antecipado)</span>}
                </div>
              </div>
            )}
            <div className="form-group span-3">
              <label>Observações</label>
              <input value={form.observacao} onChange={e=>setForm({...form,observacao:e.target.value})} placeholder="Anotações adicionais sobre esta entrega..."/>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={()=>{
            if(!form.clienteId||!form.declaracaoId||!form.competencia){alert("Preencha cliente, declaração e competência.");return;}
            onSalvar(form);
          }}>💾 {editando?"Salvar Alterações":"Registrar Entrega"}</button>
        </div>
      </div>
    </div>
  );
}

function HistoricoEntregas({ clientes, obrigacoes, usuarios }) {
  const [entregas, setEntregas] = useState(() => {
    dbSeedIfEmpty(clientes, obrigacoes);
    return dbLoad().entregas;
  });
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("comparativo");
  const [filtroPeriodo, setFiltroPeriodo] = useState(["2026-01","2026-02"]);
  const [filtroCliente, setFiltroCliente] = useState("todos");
  const [filtroDeclaracao, setFiltroDeclaracao] = useState("todas");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [buscaTabela, setBuscaTabela] = useState("");
  const [dbStatus, setDbStatus] = useState("");

  const toggleMes = (mes) => {
    setFiltroPeriodo(prev =>
      prev.includes(mes)
        ? prev.filter(m => m !== mes)
        : [...prev, mes].sort()
    );
  };

  const recarregarDB = () => {
    const db = dbLoad();
    setEntregas(db.entregas);
    setDbStatus("✅ Banco recarregado — " + db.entregas.length + " registros");
    setTimeout(() => setDbStatus(""), 3000);
  };

  const salvarEntrega = (form) => {
    if (editando) {
      dbUpdateEntrega(editando.id, form);
    } else {
      dbAddEntrega(form);
    }
    recarregarDB();
    setModal(false);
    setEditando(null);
  };

  const excluirEntrega = (id) => {
    if (!window.confirm("Excluir este registro?")) return;
    dbDeleteEntrega(id);
    recarregarDB();
  };

  const exportarCSV = () => {
    const rows = [
      ["Cliente","Regime","Declaração","Competência","Vencimento","Data Entrega","Status","Dias Atraso","Responsável","Recibo","Observação"],
      ...entregasFiltradas.map(e => [
        e.clienteNome, e.regime, e.declaracaoId, e.competencia,
        e.dataVencimento, e.dataEntrega||"—", e.status, e.diasAtraso||0,
        e.responsavel, e.recibo||"—", e.observacao||""
      ])
    ];
    const q = String.fromCharCode(34);
    const csv = rows.map(r => r.map(v => q+String(v).replace(new RegExp(q,"g"),q+q)+q).join(",")).join("\n");
    const blob = new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "historico_entregas_fiscocontrol.csv";
    a.click();
  };

  const limparDB = () => {
    if (!window.confirm("Limpar TODO o banco de dados? Esta ação não pode ser desfeita.")) return;
    dbSave({ entregas: [], version: 1 });
    setEntregas([]);
    setDbStatus("🗑️ Banco limpo!");
    setTimeout(() => setDbStatus(""), 3000);
  };

  // ── Dados para comparativo ─────────────────────────────
  const mesesSelecionados = filtroPeriodo.sort();

  const clientesFiltrados = filtroCliente === "todos"
    ? clientes : clientes.filter(c => c.id === parseInt(filtroCliente));

  // Declarações únicas nos registros
  const declaracoesUnicas = [...new Set(entregas.map(e => e.declaracaoId))].sort();

  // Filtragem geral da tabela
  const entregasFiltradas = entregas.filter(e => {
    const mC = filtroCliente === "todos" || e.clienteId === parseInt(filtroCliente);
    const mD = filtroDeclaracao === "todas" || e.declaracaoId === filtroDeclaracao;
    const mS = filtroStatus === "Todos" || e.status === filtroStatus;
    const mP = filtroPeriodo.length === 0 || filtroPeriodo.includes(e.competencia);
    const mB = !buscaTabela || e.clienteNome.toLowerCase().includes(buscaTabela.toLowerCase()) || e.declaracaoId.toLowerCase().includes(buscaTabela.toLowerCase());
    return mC && mD && mS && mP && mB;
  }).sort((a,b) => b.competencia.localeCompare(a.competencia) || a.clienteNome.localeCompare(b.clienteNome));

  // ── Para o comparativo: agrupar por cliente × mês × declaração
  const dadosComparativo = clientesFiltrados.map(cliente => {
    const entregasCliente = entregas.filter(e => e.clienteId === cliente.id && mesesSelecionados.includes(e.competencia));
    const porMes = {};
    mesesSelecionados.forEach(mes => {
      const emMes = entregasCliente.filter(e => e.competencia === mes);
      const total = emMes.length;
      const noPrazo = emMes.filter(e => e.status === "Entregue no prazo").length;
      const comAtraso = emMes.filter(e => e.status === "Entregue com atraso").length;
      const pendentes = emMes.filter(e => e.status === "Pendente").length;
      const mediaAtraso = emMes.filter(e=>e.diasAtraso>0).length > 0
        ? Math.round(emMes.filter(e=>e.diasAtraso>0).reduce((s,e)=>s+(e.diasAtraso||0),0) / emMes.filter(e=>e.diasAtraso>0).length)
        : 0;
      porMes[mes] = { total, noPrazo, comAtraso, pendentes, mediaAtraso, pct: total > 0 ? Math.round((noPrazo+comAtraso)/total*100) : 0 };
    });
    return { cliente, porMes };
  });

  // ── KPIs gerais dos meses selecionados ────────────────
  const entregasPeriodo = entregas.filter(e => mesesSelecionados.includes(e.competencia) && (filtroCliente==="todos"||e.clienteId===parseInt(filtroCliente)));
  const kpiTotal      = entregasPeriodo.length;
  const kpiNoPrazo    = entregasPeriodo.filter(e=>e.status==="Entregue no prazo").length;
  const kpiComAtraso  = entregasPeriodo.filter(e=>e.status==="Entregue com atraso").length;
  const kpiPendente   = entregasPeriodo.filter(e=>e.status==="Pendente").length;
  const kpiCompliance = kpiTotal > 0 ? Math.round((kpiNoPrazo+kpiComAtraso)/kpiTotal*100) : 0;
  const kpiMediaAtraso= entregasPeriodo.filter(e=>e.diasAtraso>0).length > 0
    ? Math.round(entregasPeriodo.filter(e=>e.diasAtraso>0).reduce((s,e)=>s+(e.diasAtraso||0),0)/entregasPeriodo.filter(e=>e.diasAtraso>0).length)
    : 0;

  const statusCor = { "Entregue no prazo":"var(--green)", "Entregue com atraso":"var(--orange)", "Pendente":"var(--text3)" };
  const statusBg  = { "Entregue no prazo":"var(--green-dim)", "Entregue com atraso":"var(--orange-dim)", "Pendente":"var(--bg3)" };
  const nomeMes = v => MESES_LISTA.find(m=>m.v===v)?.l || v;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">🗂️ Histórico de Entregas</h1>
          <p className="page-sub">Comparativo mensal de declarações entregues · {entregas.length} registros no banco</p>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          {dbStatus && <span style={{fontSize:12,color:"var(--green)",fontWeight:600}}>{dbStatus}</span>}
          <button className="btn-secondary" onClick={exportarCSV}>📥 Exportar CSV</button>
          <button className="btn-primary" onClick={()=>{setEditando(null);setModal(true);}}>+ Registrar Entrega</button>
        </div>
      </div>

      {/* ── Seletor de meses ── */}
      <div className="card" style={{marginBottom:16,padding:"14px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:12,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".5px",flexShrink:0}}>
            📅 Período de Comparação:
          </span>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",flex:1}}>
            {MESES_LISTA.map(m => {
              const sel = filtroPeriodo.includes(m.v);
              const temDados = entregas.some(e=>e.competencia===m.v);
              return (
                <button key={m.v} onClick={()=>toggleMes(m.v)} style={{
                  padding:"5px 12px",borderRadius:20,border:`1px solid ${sel?"var(--accent)":"var(--border)"}`,
                  background: sel?"var(--accent-glow)":"var(--bg3)",
                  color: sel?"var(--accent)":"var(--text3)",
                  fontSize:12,fontWeight:sel?700:400,cursor:"pointer",fontFamily:"var(--font)",
                  position:"relative"
                }}>
                  {m.l}
                  {temDados && <span style={{
                    position:"absolute",top:-4,right:-4,width:8,height:8,
                    borderRadius:"50%",background:sel?"var(--accent)":"var(--green)",border:"2px solid var(--bg2)"
                  }}/>}
                </button>
              );
            })}
          </div>
          <div style={{display:"flex",gap:8}}>
            <select value={filtroCliente} onChange={e=>setFiltroCliente(e.target.value)} style={{fontSize:12,minWidth:160}}>
              <option value="todos">Todos os clientes</option>
              {clientes.map(c=><option key={c.id} value={c.id}>{c.razaoSocial.split(" ").slice(0,3).join(" ")}</option>)}
            </select>
          </div>
        </div>
        {filtroPeriodo.length === 0 && (
          <p style={{fontSize:12,color:"var(--orange)",marginTop:8}}>⚠️ Selecione ao menos um mês para visualizar o comparativo.</p>
        )}
      </div>

      {/* ── KPIs do período ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,marginBottom:20}}>
        {[
          {n:kpiTotal,        ic:"📋", l:"Total no Período", cor:"var(--accent)"},
          {n:kpiNoPrazo,      ic:"✅", l:"No Prazo",         cor:"var(--green)"},
          {n:kpiComAtraso,    ic:"⚠️", l:"Com Atraso",       cor:"var(--orange)"},
          {n:kpiPendente,     ic:"⏳", l:"Pendentes",        cor:"var(--text3)"},
          {n:kpiCompliance+"%",ic:"📊",l:"Compliance",       cor:"var(--accent)"},
          {n:kpiMediaAtraso+"d",ic:"⏱️",l:"Média de Atraso", cor:"var(--red)"},
        ].map((k,i)=>(
          <div key={i} className="kpi-card" style={{borderLeftColor:k.cor,borderLeftWidth:3,borderLeftStyle:"solid"}}>
            <div className="kpi-icon">{k.ic}</div>
            <div className="kpi-info"><span className="kpi-num" style={{color:k.cor,fontSize:20}}>{k.n}</span><span className="kpi-label">{k.l}</span></div>
          </div>
        ))}
      </div>

      {/* ── Abas ── */}
      <div style={{display:"flex",gap:0,borderBottom:"1px solid var(--border)",marginBottom:20}}>
        {[
          ["comparativo","📊 Comparativo Mensal"],
          ["grafico","📈 Gráfico de Barras"],
          ["tabela","📋 Tabela Detalhada"],
          ["banco","🗄️ Banco de Dados"],
        ].map(([k,l])=>(
          <button key={k} onClick={()=>setAbaAtiva(k)} style={{
            background:"none",border:"none",
            borderBottom: abaAtiva===k?"2px solid var(--accent)":"2px solid transparent",
            color: abaAtiva===k?"var(--accent)":"var(--text3)",
            padding:"10px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"
          }}>{l}</button>
        ))}
      </div>

      {/* ════════════════════════════════════
          ABA: COMPARATIVO MENSAL (tabela cruzada)
      ════════════════════════════════════ */}
      {abaAtiva === "comparativo" && filtroPeriodo.length > 0 && (
        <div className="card" style={{overflowX:"auto"}}>
          <h3 className="card-title">Comparativo por Cliente × Mês</h3>
          <table className="data-table" style={{minWidth:700}}>
            <thead>
              <tr>
                <th style={{minWidth:180}}>Cliente</th>
                <th>Regime</th>
                {mesesSelecionados.map(m=>(
                  <th key={m} style={{textAlign:"center",minWidth:110}} colSpan={1}>{nomeMes(m)}</th>
                ))}
                <th style={{textAlign:"center"}}>Média</th>
              </tr>
            </thead>
            <tbody>
              {dadosComparativo.map(({cliente, porMes}) => {
                const mediaGeral = mesesSelecionados.length > 0
                  ? Math.round(mesesSelecionados.reduce((s,m)=>s+(porMes[m]?.pct||0),0)/mesesSelecionados.length)
                  : 0;
                return (
                  <tr key={cliente.id}>
                    <td>
                      <div style={{fontWeight:700,fontSize:13}}>{cliente.razaoSocial.split(" ").slice(0,3).join(" ")}</div>
                      <div style={{fontSize:10,color:"var(--text3)"}}>{cliente.responsavel}</div>
                    </td>
                    <td><span className="regime-tag">{cliente.regime.split(" ")[0]}</span></td>
                    {mesesSelecionados.map(m => {
                      const d = porMes[m];
                      if (!d || d.total === 0) return (
                        <td key={m} style={{textAlign:"center"}}>
                          <span style={{fontSize:11,color:"var(--text3)"}}>— sem dados</span>
                        </td>
                      );
                      const cor = d.pct >= 80?"var(--green)":d.pct>=50?"var(--orange)":"var(--red)";
                      return (
                        <td key={m} style={{textAlign:"center",padding:"8px 6px"}}>
                          <div style={{
                            background:`${cor}15`,border:`1px solid ${cor}33`,
                            borderRadius:8,padding:"6px 8px",display:"inline-block",minWidth:90
                          }}>
                            <div style={{fontSize:18,fontWeight:800,color:cor,lineHeight:1}}>{d.pct}%</div>
                            <div style={{fontSize:10,color:"var(--text3)",marginTop:2,lineHeight:1.4}}>
                              ✅ {d.noPrazo} • ⚠️ {d.comAtraso} • ⏳ {d.pendentes}
                            </div>
                            {d.mediaAtraso > 0 && (
                              <div style={{fontSize:10,color:"var(--orange)",marginTop:1}}>~{d.mediaAtraso}d atr.</div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td style={{textAlign:"center"}}>
                      <span style={{
                        fontSize:15,fontWeight:800,
                        color:mediaGeral>=80?"var(--green)":mediaGeral>=50?"var(--orange)":"var(--red)"
                      }}>{mediaGeral}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{display:"flex",gap:16,marginTop:14,fontSize:12,color:"var(--text3)",flexWrap:"wrap"}}>
            <span><span style={{color:"var(--green)",fontWeight:700}}>✅ No prazo</span></span>
            <span><span style={{color:"var(--orange)",fontWeight:700}}>⚠️ Com atraso</span></span>
            <span><span style={{color:"var(--text3)",fontWeight:700}}>⏳ Pendente</span></span>
            <span style={{marginLeft:"auto"}}>Total de registros no período: <strong>{entregasPeriodo.length}</strong></span>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          ABA: GRÁFICO DE BARRAS
      ════════════════════════════════════ */}
      {abaAtiva === "grafico" && filtroPeriodo.length > 0 && (
        <div className="card">
          <h3 className="card-title">Entregas por Mês — Comparativo Visual</h3>
          <div style={{overflowX:"auto"}}>
            <div style={{display:"flex",gap:20,alignItems:"flex-end",height:220,padding:"0 8px 0",minWidth:Math.max(400,mesesSelecionados.length*120)}}>
              {mesesSelecionados.map(mes => {
                const emMes = entregasPeriodo.filter(e=>e.competencia===mes);
                const total = emMes.length || 1;
                const noPrazo   = emMes.filter(e=>e.status==="Entregue no prazo").length;
                const comAtraso = emMes.filter(e=>e.status==="Entregue com atraso").length;
                const pendente  = emMes.filter(e=>e.status==="Pendente").length;
                const maxH = 180;
                return (
                  <div key={mes} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,minWidth:80}}>
                    <span style={{fontSize:11,fontWeight:700,color:"var(--accent)",marginBottom:4}}>
                      {Math.round((noPrazo+comAtraso)/total*100)}%
                    </span>
                    <div style={{width:"100%",display:"flex",gap:4,alignItems:"flex-end",height:maxH}}>
                      {[
                        [noPrazo,"var(--green)","No prazo"],
                        [comAtraso,"var(--orange)","Com atraso"],
                        [pendente,"var(--text3)","Pendente"],
                      ].map(([val,cor,label])=>(
                        <div key={label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                          <span style={{fontSize:10,fontWeight:700,color:cor}}>{val}</span>
                          <div style={{
                            width:"100%",height:Math.round((val/total)*maxH)||2,
                            background:cor,borderRadius:"4px 4px 0 0",
                            minHeight:2,transition:"height .4s"
                          }}/>
                        </div>
                      ))}
                    </div>
                    <span style={{fontSize:11,color:"var(--text3)",fontWeight:600,marginTop:4}}>{nomeMes(mes)}</span>
                    <span style={{fontSize:10,color:"var(--text3)"}}>{emMes.length} registros</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{display:"flex",gap:16,fontSize:12,marginTop:16}}>
            {[["var(--green)","Entregue no prazo"],["var(--orange)","Entregue com atraso"],["var(--text3)","Pendente"]].map(([c,l])=>(
              <span key={l} style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:10,height:10,borderRadius:2,background:c,display:"inline-block"}}/>
                <span style={{color:"var(--text3)"}}>{l}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          ABA: TABELA DETALHADA
      ════════════════════════════════════ */}
      {abaAtiva === "tabela" && (
        <div className="card">
          <div className="table-toolbar flex-wrap" style={{marginBottom:14}}>
            <input className="search-input" placeholder="Buscar cliente ou declaração..." value={buscaTabela} onChange={e=>setBuscaTabela(e.target.value)} style={{flex:1,minWidth:180}}/>
            <select value={filtroDeclaracao} onChange={e=>setFiltroDeclaracao(e.target.value)}>
              <option value="todas">Todas as declarações</option>
              {declaracoesUnicas.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)}>
              <option>Todos</option>
              <option>Entregue no prazo</option>
              <option>Entregue com atraso</option>
              <option>Pendente</option>
            </select>
            <span style={{fontSize:12,color:"var(--text3)",whiteSpace:"nowrap"}}>{entregasFiltradas.length} registros</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Declaração</th>
                <th>Competência</th>
                <th>Vencimento</th>
                <th>Data Entrega</th>
                <th>Atraso</th>
                <th>Status</th>
                <th>Recibo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {entregasFiltradas.slice(0,100).map(e=>(
                <tr key={e.id}>
                  <td>
                    <div style={{fontWeight:600,fontSize:13}}>{e.clienteNome.split(" ").slice(0,2).join(" ")}</div>
                    <div style={{fontSize:10,color:"var(--text3)"}}>{e.responsavel}</div>
                  </td>
                  <td><span style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:700,color:"var(--accent)",background:"var(--accent-glow)",padding:"2px 7px",borderRadius:4}}>{e.declaracaoId}</span></td>
                  <td className="mono" style={{fontSize:12}}>{nomeMes(e.competencia)}</td>
                  <td className="mono" style={{fontSize:11,color:e.dataVencimento?"var(--text2)":"var(--text3)"}}>
                    {e.dataVencimento ? new Date(e.dataVencimento+"T12:00").toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="mono" style={{fontSize:11,color:e.dataEntrega?"var(--green)":"var(--text3)"}}>
                    {e.dataEntrega ? new Date(e.dataEntrega+"T12:00").toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td style={{textAlign:"center"}}>
                    {e.diasAtraso > 0
                      ? <span style={{color:"var(--orange)",fontWeight:700,fontSize:12}}>+{e.diasAtraso}d</span>
                      : e.diasAtraso < 0
                      ? <span style={{color:"var(--green)",fontSize:12}}>{e.diasAtraso}d</span>
                      : <span style={{color:"var(--text3)",fontSize:12}}>—</span>
                    }
                  </td>
                  <td>
                    <span style={{
                      fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:5,
                      background:statusBg[e.status],color:statusCor[e.status]
                    }}>{e.status}</span>
                  </td>
                  <td className="mono" style={{fontSize:10,color:"var(--text3)"}}>{e.recibo||"—"}</td>
                  <td>
                    <button className="btn-icon" title="Editar" onClick={()=>{setEditando(e);setModal(true);}}>✏️</button>
                    <button className="btn-icon" title="Excluir" style={{color:"var(--red)",borderColor:"var(--red-dim)"}} onClick={()=>excluirEntrega(e.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
              {entregasFiltradas.length === 0 && (
                <tr><td colSpan={9} style={{textAlign:"center",padding:30,color:"var(--text3)"}}>Nenhum registro encontrado com os filtros selecionados.</td></tr>
              )}
            </tbody>
          </table>
          {entregasFiltradas.length > 100 && (
            <p style={{fontSize:12,color:"var(--text3)",marginTop:10,textAlign:"center"}}>
              Exibindo 100 de {entregasFiltradas.length} registros. Use filtros para refinar.
            </p>
          )}
        </div>
      )}

      {/* ════════════════════════════════════
          ABA: BANCO DE DADOS
      ════════════════════════════════════ */}
      {abaAtiva === "banco" && (
        <div className="dash-row" style={{alignItems:"flex-start"}}>
          <div className="card" style={{flex:2}}>
            <h3 className="card-title">🗄️ Informações do Banco de Dados</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {[
                ["Total de registros", entregas.length, "var(--accent)"],
                ["Clientes com dados", [...new Set(entregas.map(e=>e.clienteId))].length, "var(--green)"],
                ["Meses cobertos", [...new Set(entregas.map(e=>e.competencia))].length, "var(--orange)"],
                ["Tamanho estimado", Math.round(JSON.stringify(entregas).length/1024) + " KB", "var(--text2)"],
              ].map(([l,v,c])=>(
                <div key={l} style={{background:"var(--bg3)",borderRadius:9,padding:"14px 16px",borderLeft:`3px solid ${c}`}}>
                  <span style={{display:"block",fontSize:11,color:"var(--text3)",marginBottom:4,textTransform:"uppercase",letterSpacing:".5px"}}>{l}</span>
                  <span style={{fontSize:22,fontWeight:800,color:c}}>{v}</span>
                </div>
              ))}
            </div>
            <h4 style={{fontSize:13,fontWeight:700,marginBottom:12,color:"var(--text2)"}}>Distribuição por Cliente</h4>
            {clientes.map(c => {
              const total = entregas.filter(e=>e.clienteId===c.id).length;
              const maxTotal = Math.max(...clientes.map(cl=>entregas.filter(e=>e.clienteId===cl.id).length),1);
              if (!total) return null;
              return (
                <div key={c.id} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                    <span style={{color:"var(--text2)",fontWeight:500}}>{c.razaoSocial.split(" ").slice(0,3).join(" ")}</span>
                    <span style={{color:"var(--text3)"}}>{total} registros</span>
                  </div>
                  <div style={{height:6,background:"var(--bg4)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${total/maxTotal*100}%`,background:"var(--accent)",borderRadius:3}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{flex:1}}>
            <div className="card">
              <h3 className="card-title">⚙️ Operações</h3>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <button className="btn-primary" onClick={()=>{setEditando(null);setModal(true);}}>➕ Novo Registro</button>
                <button className="btn-secondary" onClick={recarregarDB}>🔄 Recarregar banco</button>
                <button className="btn-secondary" onClick={exportarCSV}>📥 Exportar CSV completo</button>
                <div style={{borderTop:"1px solid var(--border)",paddingTop:10,marginTop:4}}>
                  <button
                    onClick={limparDB}
                    style={{width:"100%",padding:"9px 18px",borderRadius:7,border:"1px solid var(--red-dim)",background:"rgba(239,68,68,0.06)",color:"var(--red)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)"}}>
                    🗑️ Limpar banco de dados
                  </button>
                  <p style={{fontSize:11,color:"var(--text3)",marginTop:6,textAlign:"center"}}>Esta ação remove TODOS os registros permanentemente.</p>
                </div>
              </div>
            </div>
            <div className="card">
              <h3 className="card-title">💾 Armazenamento</h3>
              <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.8}}>
                <p>Os dados são salvos automaticamente no <strong style={{color:"var(--text2)"}}>localStorage</strong> do navegador neste computador.</p>
                <br/>
                <p>Para backup, use <strong style={{color:"var(--text2)"}}>Exportar CSV</strong> e guarde o arquivo.</p>
                <br/>
                <div style={{background:"var(--bg3)",borderRadius:7,padding:"10px 12px",marginTop:4}}>
                  <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--accent)"}}>Chave: {DB_KEY}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <ModalRegistroEntrega
          onClose={()=>{setModal(false);setEditando(null);}}
          onSalvar={salvarEntrega}
          clientes={clientes}
          usuarios={usuarios}
          editando={editando}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BANCO DE DADOS REAL — CLIENTES (localStorage)
// ═══════════════════════════════════════════════════════
const DB_CLIENTES_KEY = "fiscocontrol_clientes_v1";

function dbClientesLoad() {
  try {
    const raw = localStorage.getItem(DB_CLIENTES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Primeira vez: inicia com lista vazia (sem clientes de exemplo)
  localStorage.setItem(DB_CLIENTES_KEY, JSON.stringify([]));
  return [];
}

function dbClientesSave(lista) {
  try {
    localStorage.setItem(DB_CLIENTES_KEY, JSON.stringify(lista));
    return true;
  } catch (e) {
    console.error("Erro ao salvar clientes:", e);
    return false;
  }
}

// ═══════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════

export default function FiscoControl() {
  const [pagina, setPagina] = useState("dashboard");
  // ── Estado persistente de clientes (localStorage) ──────────────
  const [clientes, setClientesState] = useState(() => dbClientesLoad());

  const setClientes = (novaLista) => {
    const lista = typeof novaLista === "function" ? novaLista(clientes) : novaLista;
    dbClientesSave(lista);
    setClientesState(lista);
    // Regenerar obrigações: remove de clientes excluídos, adiciona de clientes novos/editados
    setObrigacoes(prev => {
      const idsExistentes = new Set(lista.map(c => c.id));
      // Remove obrigações de clientes excluídos
      const mantidas = prev.filter(o => idsExistentes.has(o.clienteId));

      // Para cada cliente na lista, verifica se precisa regerar obrigações
      // (cliente novo OU cliente editado que mudou obrigacoesSelecionadas)
      const novas = [];
      let nextId = mantidas.reduce((m, o) => Math.max(m, o.id), 0) + 1;

      lista.forEach(cliente => {
        const obsExistentes = mantidas
          .filter(o => o.clienteId === cliente.id)
          .map(o => o.obrigacaoId);

        // Obrigações que o cliente tem selecionadas mas ainda não foram geradas
        const obsFaltando = (cliente.obrigacoesSelecionadas || []).filter(
          obId => !obsExistentes.includes(obId)
        );

        // Remove obrigações que foram desmarcadas no cadastro
        const obsRemovidas = obsExistentes.filter(
          obId => !(cliente.obrigacoesSelecionadas || []).includes(obId)
        );

        if (obsRemovidas.length > 0) {
          const idsRemover = new Set(obsRemovidas);
          // Filtra fora as removidas para este cliente
          const idx = novas.length; // marcador
          mantidas.forEach((o, i) => {
            if (o.clienteId === cliente.id && idsRemover.has(o.obrigacaoId)) {
              mantidas.splice(i, 1);
            }
          });
        }

        obsFaltando.forEach(obId => {
          const ob = TODAS_OBRIGACOES_LISTA.find(o => o.id === obId);
          if (!ob) return;
          const dataVenc = calcularVencimento(obId);
          const status = dataVenc < hoje ? "Atrasada" : "Pendente";
          const esfera = calcularEsfera(ob.categoria);
          novas.push({
            id: nextId++,
            clienteId: cliente.id,
            clienteNome: cliente.razaoSocial,
            obrigacao: ob.nome.split("—")[0].trim(),
            obrigacaoId: obId,
            competencia: String(mesAtual + 1).padStart(2, "0") + "/" + anoAtual,
            vencimento: dataVenc,
            status,
            responsavel: cliente.responsavel,
            regime: cliente.regime,
            tipo: esfera,
          });
        });

        // Atualiza clienteNome nas obrigações existentes caso tenha mudado
        mantidas.forEach(o => {
          if (o.clienteId === cliente.id && o.clienteNome !== cliente.razaoSocial) {
            o.clienteNome = cliente.razaoSocial;
          }
        });
      });

      return [...mantidas, ...novas];
    });
  };

  const [usuarios, setUsuarios] = useState(usuarios_mock_init);
  const [obrigacoes, setObrigacoes] = useState(() => gerarObrigacoesClientes(dbClientesLoad()));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const alertasNaoLidos = alertas_mock.filter(a=>!a.lido).length;

  const nav = [
    { id:"clientes",    icon:"🏢", label:"Clientes" },
    { id:"obrigacoes",  icon:"📋", label:"Obrigações" },
    { id:"declaracoes", icon:"⚖️", label:"Declarações" },
    { id:"dpessoal",    icon:"👷", label:"D.Pessoal/Prev." },
    { id:"alertas",     icon:"🔔", label:"Alertas", badge: alertasNaoLidos },
    { id:"agenda",      icon:"📆", label:"Agenda Fiscal" },
    { id:"calendario",  icon:"📅", label:"Calendário" },
    { id:"documentos",  icon:"📁", label:"Documentos" },
    { id:"relatorios",  icon:"📈", label:"Relatórios" },
    { id:"historico",   icon:"🗂️", label:"Hist. Entregas" },
    { id:"dashboard",   icon:"📊", label:"Dashboard" },
    { id:"automacao",   icon:"🤖", label:"Automação WA" },
    { id:"equipe",      icon:"👥", label:"Equipe" },
    { id:"suporte",     icon:"🎧", label:"Suporte" },
  ];

  const renderPagina = () => {
    switch(pagina) {
      case "dashboard":   return <Dashboard obrigacoes={obrigacoes} clientes={clientes}/>;
      case "clientes":    return <Clientes clientes={clientes} setClientes={setClientes} obrigacoes={obrigacoes} usuarios={usuarios}/>;
      case "obrigacoes":  return <Obrigacoes obrigacoes={obrigacoes} setObrigacoes={setObrigacoes} clientes={clientes}/>;
      case "calendario":  return <Calendario obrigacoes={obrigacoes}/>;
      case "alertas":     return <Alertas/>;
      case "documentos":  return <Documentos clientes={clientes}/>;
      case "equipe":      return <Equipe clientes={clientes} usuarios={usuarios} setUsuarios={setUsuarios}/>;
      case "declaracoes": return <Declaracoes clientes={clientes}/>;
      case "dpessoal":    return <DPessoal clientes={clientes} obrigacoes={obrigacoes} setObrigacoes={setObrigacoes}/>;
      case "automacao":   return <Automacao usuarios={usuarios} clientes={clientes} obrigacoes={obrigacoes}/>;
      case "relatorios":  return <Relatorios clientes={clientes} obrigacoes={obrigacoes}/>;
      case "historico":   return <HistoricoEntregas clientes={clientes} obrigacoes={obrigacoes} usuarios={usuarios}/>;
      case "agenda":      return <AgendaFiscal clientes={clientes} obrigacoes={obrigacoes}/>;
      case "suporte":     return <Suporte/>;
      default:            return null;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#080d14;--bg2:#0d1520;--bg3:#111c2d;--bg4:#162236;
          --border:#1e3248;--border2:#243b56;
          --text:#e2eaf5;--text2:#8ba4bf;--text3:#4d6e8a;
          --accent:#0ea5e9;--accent2:#0284c7;--accent-glow:rgba(14,165,233,0.15);
          --green:#22c55e;--orange:#f59e0b;--red:#ef4444;
          --green-dim:rgba(34,197,94,0.12);--orange-dim:rgba(245,158,11,0.12);--red-dim:rgba(239,68,68,0.12);
          --radius:10px;--sidebar-w:220px;
          --font:'IBM Plex Sans',sans-serif;--mono:'IBM Plex Mono',monospace;
        }
        html,body,#root{height:100%;background:var(--bg);color:var(--text);font-family:var(--font);}
        .app{display:flex;height:100vh;overflow:hidden;}

        /* SIDEBAR */
        .sidebar{width:var(--sidebar-w);background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;transition:width .25s;}
        .sidebar.closed{width:60px;}
        .sidebar-logo{padding:20px 16px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;overflow:hidden;}
        /* LOGO 3D FLUTUANTE */
        .logo-3d-wrap{width:36px;height:36px;flex-shrink:0;perspective:120px;cursor:pointer;}
        .logo-3d{width:34px;height:34px;position:relative;transform-style:preserve-3d;animation:logo-spin 8s linear infinite,logo-float 3s ease-in-out infinite;}
        @keyframes logo-spin{0%{transform:rotateY(0deg) rotateX(10deg);}100%{transform:rotateY(360deg) rotateX(10deg);}}
        @keyframes logo-float{0%,100%{margin-top:0px;}50%{margin-top:-5px;}}
        @keyframes shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
        .logo-3d-face{position:absolute;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:16px;border-radius:6px;backface-visibility:visible;}
        .logo-3d-front {background:linear-gradient(135deg,#0ea5e9,#7c3aed);transform:translateZ(17px);}
        .logo-3d-back  {background:linear-gradient(135deg,#7c3aed,#0ea5e9);transform:rotateY(180deg) translateZ(17px);}
        .logo-3d-left  {background:linear-gradient(135deg,#0284c7,#6d28d9);transform:rotateY(-90deg) translateZ(17px);}
        .logo-3d-right {background:linear-gradient(135deg,#0369a1,#5b21b6);transform:rotateY(90deg)  translateZ(17px);}
        .logo-3d-top   {background:linear-gradient(135deg,#0ea5e9,#7c3aed);transform:rotateX(90deg)  translateZ(17px);}
        .logo-3d-bottom{background:linear-gradient(135deg,#0284c7,#6d28d9);transform:rotateX(-90deg) translateZ(17px);}
        .logo-icon{width:32px;height:32px;flex-shrink:0;background:linear-gradient(135deg,var(--accent),#7c3aed);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .logo-text{font-size:17px;font-weight:700;white-space:nowrap;letter-spacing:-.3px;}
        .logo-sub{font-size:10px;color:var(--text3);white-space:nowrap;}
        .nav{flex:1;padding:12px 8px;overflow:hidden;}
        .nav-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;cursor:pointer;white-space:nowrap;overflow:hidden;font-size:13.5px;font-weight:500;color:var(--text2);transition:all .15s;margin-bottom:2px;}
        .nav-item:hover{background:var(--bg3);color:var(--text);}
        .nav-item.active{background:var(--accent-glow);color:var(--accent);}
        .nav-icon{font-size:16px;flex-shrink:0;}
        .nav-badge{margin-left:auto;background:var(--red);color:white;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;flex-shrink:0;}
        .sidebar-footer{padding:12px 8px;border-top:1px solid var(--border);}
        .user-chip{display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;background:var(--bg3);overflow:hidden;}
        .user-av{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--accent),#7c3aed);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;}
        .user-name{font-size:12px;font-weight:600;white-space:nowrap;}
        .user-role{font-size:10px;color:var(--text3);white-space:nowrap;}

        /* MAIN */
        .main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
        .topbar{height:54px;background:var(--bg2);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 20px;gap:12px;flex-shrink:0;}
        .topbar-toggle{background:none;border:none;cursor:pointer;color:var(--text2);font-size:18px;padding:4px;}
        .topbar-breadcrumb{font-size:13px;color:var(--text3);}
        .topbar-breadcrumb strong{color:var(--text);}
        .topbar-right{margin-left:auto;display:flex;align-items:center;gap:8px;}
        .topbar-btn{background:none;border:1px solid var(--border);color:var(--text2);padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;font-family:var(--font);transition:all .15s;}
        .topbar-btn:hover{border-color:var(--accent);color:var(--accent);}
        .scroll-area{flex:1;overflow-y:auto;}
        .scroll-area::-webkit-scrollbar{width:6px;}
        .scroll-area::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}

        /* PAGE */
        .page-content{padding:24px;max-width:1440px;}
        .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;}
        .page-title{font-size:22px;font-weight:700;letter-spacing:-.4px;}
        .page-sub{font-size:13px;color:var(--text3);margin-top:3px;}

        /* KPI */
        .kpi-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px;}
        .kpi-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;display:flex;align-items:center;gap:12px;transition:transform .15s;}
        .kpi-card:hover{transform:translateY(-1px);}
        .kpi-urgent{border-left:3px solid var(--orange);}
        .kpi-week{border-left:3px solid var(--accent);}
        .kpi-late{border-left:3px solid var(--red);}
        .kpi-done{border-left:3px solid var(--green);}
        .kpi-clients{border-left:3px solid #7c3aed;}
        .kpi-total{border-left:3px solid #06b6d4;}
        .kpi-icon{font-size:22px;}
        .kpi-num{display:block;font-size:26px;font-weight:700;line-height:1;}
        .kpi-label{display:block;font-size:11px;color:var(--text3);margin-top:4px;font-weight:500;}

        /* CARDS */
        .card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;}
        .card-title{font-size:14px;font-weight:600;margin-bottom:16px;}
        .dash-row{display:flex;gap:16px;margin-bottom:0;}
        .dash-row .card{flex:1;}

        /* TABLE */
        .data-table{width:100%;border-collapse:collapse;font-size:13px;}
        .data-table th{text-align:left;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;padding:8px 10px;border-bottom:1px solid var(--border);}
        .data-table td{padding:10px;border-bottom:1px solid var(--border);vertical-align:middle;}
        .data-table tr:last-child td{border-bottom:none;}
        .data-table tr:hover td{background:var(--bg3);}
        .row-late td{background:rgba(239,68,68,0.04)!important;}
        .row-urgent td{background:rgba(245,158,11,0.04)!important;}

        /* BADGES */
        .badge{display:inline-flex;align-items:center;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600;}
        .badge-pending{background:var(--orange-dim);color:var(--orange);}
        .badge-done{background:var(--green-dim);color:var(--green);}
        .badge-late{background:var(--red-dim);color:var(--red);}
        .badge-count{font-size:10px;color:var(--red);margin-left:4px;}
        .ob-count-badge{background:var(--bg4);color:var(--text2);padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;}

        /* TIPO / REGIME */
        .tipo-tag{padding:2px 7px;border-radius:4px;font-size:11px;font-weight:600;}
        .tipo-federal{background:rgba(14,165,233,0.12);color:var(--accent);}
        .tipo-estadual{background:rgba(124,58,237,0.12);color:#a78bfa;}
        .tipo-municipal{background:rgba(6,182,212,0.12);color:#22d3ee;}
        .regime-tag{padding:2px 8px;border-radius:4px;font-size:11px;background:var(--bg4);color:var(--text2);}
        .perfil-tag{padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;}
        .perfil-administrador{background:rgba(245,158,11,0.12);color:var(--orange);}
        .perfil-contador{background:var(--accent-glow);color:var(--accent);}
        .perfil-assistente{background:var(--green-dim);color:var(--green);}

        /* BUTTONS */
        .btn-primary{background:var(--accent);color:white;border:none;padding:9px 18px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font);transition:all .15s;}
        .btn-primary:hover{background:var(--accent2);}
        .btn-secondary{background:var(--bg3);color:var(--text2);border:1px solid var(--border);padding:9px 18px;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;font-family:var(--font);}
        .btn-icon{background:none;border:1px solid var(--border);color:var(--text2);width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:13px;display:inline-flex;align-items:center;justify-content:center;transition:all .15s;margin:0 2px;}
        .btn-icon:hover{border-color:var(--accent);color:var(--accent);}
        .btn-check{color:var(--green);border-color:var(--green-dim);}
        .btn-full{width:100%;margin-top:12px;}
        .btn-link{background:none;border:none;color:var(--accent);cursor:pointer;font-size:12px;font-family:var(--font);text-decoration:underline;}
        .btn-sugerir{background:linear-gradient(135deg,#7c3aed,var(--accent));color:white;border:none;padding:8px 14px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font);white-space:nowrap;}

        /* TOOLBAR / INPUTS */
        .table-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;}
        .search-input{flex:1;min-width:200px;padding:8px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;font-family:var(--font);}
        .search-input:focus{outline:none;border-color:var(--accent);}
        .filter-group{display:flex;gap:8px;flex-wrap:wrap;}
        select,input[type=text],input[type=email],input[type=month]{background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:8px 10px;border-radius:7px;font-size:13px;font-family:var(--font);}
        select:focus,input:focus{outline:none;border-color:var(--accent);}

        /* MODAL */
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px);}
        .modal{background:var(--bg2);border:1px solid var(--border2);border-radius:14px;width:90%;max-width:580px;max-height:90vh;overflow-y:auto;display:flex;flex-direction:column;}
        .modal-lg{max-width:720px;}
        .modal-xl{max-width:900px;}
        .modal-header{padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
        .modal-header h2{font-size:17px;font-weight:700;}
        .modal-close{background:none;border:none;color:var(--text3);font-size:18px;cursor:pointer;}
        .modal-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);margin:14px 24px 0;flex-shrink:0;}
        .modal-tab{background:none;border:none;border-bottom:2px solid transparent;color:var(--text3);padding:10px 16px;font-size:13px;font-weight:500;cursor:pointer;font-family:var(--font);transition:all .15s;display:flex;align-items:center;gap:6px;}
        .modal-tab.active{color:var(--accent);border-bottom-color:var(--accent);}
        .tab-count{background:var(--accent);color:white;font-size:10px;font-weight:700;padding:1px 5px;border-radius:8px;}
        .modal-body{padding:20px 24px;flex:1;overflow-y:auto;}
        .modal-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:10px;flex-shrink:0;}

        /* FORMS */
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .form-grid-3{grid-template-columns:1fr 1fr 1fr;}
        .span-2{grid-column:span 2;}
        .form-group{display:flex;flex-direction:column;gap:5px;}
        .form-group label{font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;}
        .form-group input,.form-group select{width:100%;}
        .form-hint{font-size:12px;color:var(--text3);margin-bottom:14px;line-height:1.6;}
        .detalhe-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;}
        .detalhe-item{display:flex;flex-direction:column;gap:4px;}
        .detalhe-label{font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.4px;}

        /* CADASTRO USUÁRIO — vinculação de clientes */
        .cliente-vinculo-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
        .cliente-vinculo-card{background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:12px;cursor:pointer;display:flex;gap:10px;align-items:flex-start;transition:all .15s;}
        .cliente-vinculo-card:hover{border-color:var(--border2);}
        .cliente-vinculo-card.selected{border-color:var(--accent);background:var(--accent-glow);}
        .cv-check{width:18px;height:18px;border-radius:4px;border:1.5px solid var(--border2);background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--accent);font-weight:700;flex-shrink:0;margin-top:2px;}
        .selected .cv-check{background:var(--accent);border-color:var(--accent);color:white;}
        .cv-info{flex:1;}
        .cv-nome{display:block;font-size:13px;font-weight:600;margin-bottom:2px;}
        .cv-cnpj{display:block;font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:6px;}
        .cv-tags{display:flex;gap:5px;flex-wrap:wrap;}
        .vinculo-resumo{background:var(--green-dim);border:1px solid rgba(34,197,94,0.2);border-radius:7px;padding:10px 14px;font-size:12px;color:var(--green);}

        /* PERMISSÕES */
        .perm-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
        .perm-grid-full{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
        .perm-card{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 12px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);transition:all .15s;}
        .perm-card:hover{border-color:var(--border2);}
        .perm-selected{border-color:var(--accent);background:var(--accent-glow);color:var(--text);}
        .perm-check{width:16px;height:16px;border-radius:3px;border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--accent);font-weight:700;flex-shrink:0;}
        .perm-selected .perm-check{background:var(--accent);border-color:var(--accent);color:white;}
        .perm-info-box{background:var(--bg3);border-left:3px solid var(--accent);border-radius:0 7px 7px 0;padding:12px 14px;}
        .perm-info-box strong{display:block;margin-bottom:5px;font-size:13px;}
        .perm-info-box p{font-size:12px;color:var(--text3);line-height:1.6;}

        /* CADASTRO CLIENTE — seleção de obrigações */
        .ob-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap;}
        .ob-resumo-bar{display:flex;justify-content:space-between;align-items:center;background:var(--bg3);border-radius:7px;padding:8px 12px;font-size:12px;color:var(--text2);margin-bottom:12px;}
        .ob-categoria{margin-bottom:10px;border:1px solid var(--border);border-radius:9px;overflow:hidden;}
        .ob-cat-header{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg3);cursor:pointer;user-select:none;}
        .ob-cat-header:hover{background:var(--bg4);}
        .ob-cat-check{width:18px;height:18px;border-radius:4px;border:1.5px solid var(--border2);background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
        .ob-cat-check.checked{background:var(--accent);border-color:var(--accent);color:white;}
        .ob-cat-check.partial{background:var(--orange-dim);border-color:var(--orange);color:var(--orange);}
        .ob-cat-nome{flex:1;font-size:13px;font-weight:600;}
        .ob-cat-count{font-size:11px;color:var(--text3);}
        .ob-lista{padding:4px 0;}
        .ob-item{display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;transition:background .1s;}
        .ob-item:hover{background:var(--bg3);}
        .ob-selected{background:rgba(14,165,233,0.05);}
        .ob-check{width:16px;height:16px;border-radius:3px;border:1.5px solid var(--border2);background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;}
        .ob-check.checked{background:var(--accent);border-color:var(--accent);color:white;}
        .ob-item-info{flex:1;}
        .ob-item-nome{display:block;font-size:12px;font-weight:500;color:var(--text);}
        .ob-item-base{display:block;font-size:10px;color:var(--text3);margin-top:1px;}
        .ob-periodo{font-size:11px;font-weight:600;white-space:nowrap;}

        /* ENQUADRAMENTO */
        .enquadramento-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
        .enq-card{background:var(--bg3);border-radius:8px;padding:12px;text-align:center;}
        .enq-label{display:block;font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;}
        .enq-por-cat{display:flex;flex-direction:column;gap:8px;}
        .enq-cat-item{display:flex;align-items:flex-start;gap:10px;padding:8px;background:var(--bg3);border-radius:7px;}
        .enq-cat-nome{font-size:11px;color:var(--text3);min-width:200px;flex-shrink:0;}
        .enq-ob-tags{display:flex;flex-wrap:wrap;gap:4px;}
        .enq-ob-tag{background:var(--accent-glow);color:var(--accent);border:1px solid rgba(14,165,233,0.2);padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600;font-family:var(--mono);}

        /* DECLARAÇÕES — página */
        .decl-kpi-row{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:20px;}
        .decl-kpi{background:var(--bg2);border:1px solid var(--border);border-left:3px solid;border-radius:9px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:4px;}
        .decl-kpi-icon{font-size:20px;}
        .decl-kpi-num{font-size:24px;font-weight:700;line-height:1;}
        .decl-kpi-label{font-size:11px;color:var(--text3);font-weight:500;}
        .decl-categoria{margin-bottom:12px;border:1px solid var(--border);border-radius:9px;overflow:hidden;}
        .decl-cat-header{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;}
        .decl-cat-federal{background:rgba(14,165,233,0.08);border-bottom:1px solid rgba(14,165,233,0.2);}
        .decl-cat-estadual{background:rgba(124,58,237,0.08);border-bottom:1px solid rgba(124,58,237,0.2);}
        .decl-cat-municipal{background:rgba(6,182,212,0.08);border-bottom:1px solid rgba(6,182,212,0.2);}
        .decl-cat-titulo{font-size:13px;font-weight:700;color:var(--text);}
        .decl-cat-badge{font-size:11px;font-weight:600;color:var(--text3);}
        .decl-tabela{padding:4px 0;}
        .decl-row{display:flex;align-items:center;gap:10px;padding:9px 16px;border-bottom:1px solid var(--border);}
        .decl-row:last-child{border-bottom:none;}
        .decl-row:hover{background:var(--bg3);}
        .decl-sigla{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--accent);min-width:90px;background:var(--accent-glow);padding:3px 7px;border-radius:4px;text-align:center;flex-shrink:0;}
        .decl-info{flex:1;}
        .decl-nome{display:block;font-size:12px;font-weight:500;color:var(--text);}
        .decl-base{display:block;font-size:10px;color:var(--text3);margin-top:1px;}
        .decl-periodo{font-size:11px;font-weight:600;padding:3px 8px;border-radius:5px;white-space:nowrap;flex-shrink:0;}
        .decl-clientes-count{min-width:80px;text-align:right;}
        .decl-clientes-badge{font-size:10px;background:var(--green-dim);color:var(--green);padding:2px 6px;border-radius:4px;font-weight:600;}
        .decl-cliente-card{background:var(--bg3);border-radius:9px;padding:12px;margin-bottom:10px;}
        .decl-cli-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;}
        .decl-cli-nome{font-size:13px;font-weight:700;}
        .decl-cli-total{font-size:13px;font-weight:700;color:var(--accent);}
        .decl-cli-bars{display:flex;gap:12px;margin-bottom:8px;}
        .decl-cli-bar-item{display:flex;align-items:center;gap:5px;font-size:11px;}
        .decl-cli-bar-item strong{font-size:13px;}
        .decl-cli-tags{display:flex;flex-wrap:wrap;gap:4px;}

        /* SEÇÃO */
        .section-title{font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;margin:16px 0 8px;padding-bottom:6px;border-bottom:1px solid var(--border);}

        /* CHARTS */
        .bar-chart{display:flex;align-items:flex-end;gap:12px;height:140px;margin-bottom:12px;padding:0 8px;}
        .bar-group{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;}
        .bars{display:flex;align-items:flex-end;gap:3px;height:120px;}
        .bar{width:16px;border-radius:4px 4px 0 0;min-height:3px;transition:height .4s;}
        .bar-entregue{background:var(--green);}
        .bar-pendente{background:var(--orange);}
        .bar-label{font-size:10px;color:var(--text3);font-weight:600;}
        .chart-legend{display:flex;gap:16px;font-size:12px;color:var(--text3);}
        .leg-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;}
        .leg-green{background:var(--green);}
        .leg-orange{background:var(--orange);}

        /* RANKING */
        .ranking-list{display:flex;flex-direction:column;gap:10px;}
        .ranking-item{display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg3);border-radius:8px;}
        .ranking-pos{width:22px;height:22px;border-radius:50%;background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--text3);flex-shrink:0;}
        .ranking-info{flex:1;}
        .ranking-nome{display:block;font-size:13px;font-weight:600;}
        .ranking-regime{display:block;font-size:11px;color:var(--text3);}
        .ranking-stats{display:flex;flex-direction:column;align-items:flex-end;gap:2px;}
        .stat-late{font-size:11px;font-weight:600;color:var(--red);}
        .stat-pend{font-size:10px;color:var(--text3);}

        /* ALERTAS */
        .alertas-list{display:flex;flex-direction:column;gap:8px;}
        .alerta-item{display:flex;align-items:center;gap:12px;padding:12px;border-radius:8px;border:1px solid var(--border);}
        .alerta-unread{background:var(--bg3);border-color:var(--border2);}
        .alerta-icon{font-size:20px;flex-shrink:0;}
        .alerta-body{flex:1;}
        .alerta-msg{font-size:13px;font-weight:500;}
        .alerta-time{font-size:11px;color:var(--text3);}
        .toggle-label{display:flex;align-items:center;gap:10px;font-size:13px;cursor:pointer;margin-bottom:10px;}
        .toggle-label input{display:none;}
        .toggle-slider{width:36px;height:20px;background:var(--bg4);border-radius:10px;position:relative;transition:all .2s;flex-shrink:0;}
        .toggle-label input:checked + .toggle-slider{background:var(--accent);}
        .toggle-slider::after{content:"";position:absolute;left:3px;top:3px;width:14px;height:14px;background:white;border-radius:50%;transition:left .2s;}
        .toggle-label input:checked + .toggle-slider::after{left:19px;}
        .config-section{margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid var(--border);}
        .config-title{font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;}
        .config-sub{font-size:12px;color:var(--text3);margin-bottom:8px;}
        .dias-grid{display:flex;flex-wrap:wrap;gap:6px;}
        .dia-btn{background:var(--bg3);border:1px solid var(--border);color:var(--text2);padding:5px 10px;border-radius:6px;font-size:12px;cursor:pointer;font-family:var(--font);transition:all .15s;}
        .dia-btn-active{background:var(--accent-glow);border-color:var(--accent);color:var(--accent);}

        /* AUDITORIA */
        .audit-list{display:flex;flex-direction:column;}
        .audit-item{display:flex;gap:14px;padding:10px 0;border-bottom:1px solid var(--border);}
        .audit-item:last-child{border-bottom:none;}
        .audit-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);margin-top:5px;flex-shrink:0;}
        .audit-body{display:flex;flex-wrap:wrap;gap:4px;align-items:baseline;}
        .audit-user{font-size:13px;font-weight:700;}
        .audit-acao{font-size:12px;color:var(--text2);}
        .audit-cliente{font-size:12px;color:var(--text3);}
        .audit-time{font-size:11px;color:var(--text3);margin-left:auto;}
        .avatar-sm{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#7c3aed);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;flex-shrink:0;}

        /* DOCS */
        .upload-zone{border:2px dashed var(--border2);border-radius:8px;padding:16px;text-align:center;color:var(--text3);font-size:13px;cursor:pointer;margin:16px 0;}
        .upload-zone:hover{border-color:var(--accent);color:var(--accent);}
        .upload-zone-lg{border:2px dashed var(--border2);border-radius:10px;padding:32px 16px;text-align:center;cursor:pointer;transition:all .2s;}
        .upload-drag{border-color:var(--accent);background:var(--accent-glow);}
        .upload-icon{font-size:32px;margin-bottom:8px;}
        .upload-title{font-size:14px;font-weight:600;margin-bottom:4px;}
        .upload-sub{font-size:13px;color:var(--text3);margin-bottom:4px;}
        .upload-types{font-size:11px;color:var(--text3);}
        .doc-nome{font-size:12px;font-family:var(--mono);color:var(--text2);}

        /* CALENDÁRIO */
        .cal-nav{display:flex;align-items:center;gap:12px;}
        .btn-nav{background:var(--bg3);border:1px solid var(--border);color:var(--text);width:32px;height:32px;border-radius:7px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;}
        .cal-mes{font-size:15px;font-weight:600;min-width:160px;text-align:center;}
        .cal-grid-header{display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:4px;}
        .cal-dow{text-align:center;font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;padding:8px 0;}
        .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}
        .cal-cell{min-height:80px;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:8px;position:relative;transition:all .15s;}
        .cal-empty{background:transparent;border-color:transparent;}
        .cal-has-obs{cursor:pointer;}
        .cal-has-obs:hover{border-color:var(--accent);}
        .cal-today{border-color:var(--accent)!important;box-shadow:0 0 0 1px var(--accent);}
        .cal-day-num{font-size:13px;font-weight:700;color:var(--text2);display:block;}
        .cal-today .cal-day-num{color:var(--accent);}
        .cal-dot{width:7px;height:7px;border-radius:50%;display:inline-block;margin:2px;}
        .cal-dot-red{background:var(--red);}
        .cal-dot-orange{background:var(--orange);}
        .cal-dot-green{background:var(--green);}
        .cal-count{position:absolute;bottom:6px;right:6px;font-size:10px;font-weight:700;color:var(--text3);background:var(--bg4);padding:1px 5px;border-radius:4px;}
        .cal-legend{display:flex;gap:16px;font-size:12px;color:var(--text3);margin-top:12px;}
        .cal-ob-item{display:flex;align-items:center;gap:10px;padding:10px;border-radius:7px;background:var(--bg3);margin-bottom:8px;}

        /* RELATÓRIOS */
        .compliance-circle-wrap{display:flex;justify-content:center;padding:10px 0;}
        .donut-svg{width:140px;height:140px;}
        .compliance-stats{display:flex;flex-direction:column;gap:10px;padding-top:10px;}
        .cs-item{display:flex;align-items:center;gap:8px;font-size:13px;}
        .cs-item strong{margin-left:auto;font-size:16px;}
        .cs-dot{width:10px;height:10px;border-radius:50%;}
        .regime-bar-item{margin-bottom:12px;}
        .regime-bar-label{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px;color:var(--text2);}
        .regime-bar-track{height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;}
        .regime-bar-fill{height:100%;border-radius:3px;transition:width .5s;}
        .regime-bar-total{font-size:11px;color:var(--text3);margin-top:3px;display:block;}
        .tipo-stat-item{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
        .tipo-ico{font-size:20px;}
        .tipo-stat-body{flex:1;}
        .tipo-stat-body strong{display:block;font-size:13px;margin-bottom:5px;}
        .tipo-stat-bar-wrap{height:6px;background:var(--bg4);border-radius:3px;display:flex;overflow:hidden;}
        .tipo-stat-bar{height:100%;}
        .tipo-stat-nums{display:flex;flex-direction:column;gap:2px;font-size:11px;font-weight:600;min-width:55px;text-align:right;}
        .mini-bar-track{width:80px;height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;}
        .mini-bar-fill{height:100%;border-radius:3px;}

        /* UTILS */
        .mono{font-family:var(--mono);font-size:12px;}
        .text-red{color:var(--red);}
        .text-orange{color:var(--orange);}
        .text-green{color:var(--green);}
        .text-muted{color:var(--text3);}
        .dias-hint{font-size:10px;color:var(--text3);margin-left:3px;}
        .ob-nome{font-size:13px;font-weight:600;}
        .empty-msg{color:var(--text3);font-size:13px;text-align:center;padding:20px;}
        .flex-wrap{flex-wrap:wrap;}

        @media(max-width:900px){.kpi-grid{grid-template-columns:repeat(3,1fr);}.dash-row{flex-direction:column;}.decl-kpi-row{grid-template-columns:repeat(3,1fr);}}
        @media(max-width:600px){.kpi-grid{grid-template-columns:repeat(2,1fr);}.form-grid,.form-grid-3{grid-template-columns:1fr;}.sidebar{display:none;}.page-content{padding:14px;}.cliente-vinculo-grid{grid-template-columns:1fr;}.enquadramento-grid{grid-template-columns:1fr 1fr;}.perm-grid-full{grid-template-columns:1fr 1fr;}}
      `}</style>

      <div className="app">
        <aside className={`sidebar ${sidebarOpen?"":"closed"}`}>
          <div className="sidebar-logo">
            <div className="logo-3d-wrap">
              <div className="logo-3d">
                <div className="logo-3d-face logo-3d-front">⚖️</div>
                <div className="logo-3d-face logo-3d-back">📊</div>
                <div className="logo-3d-face logo-3d-left">📋</div>
                <div className="logo-3d-face logo-3d-right">💼</div>
                <div className="logo-3d-face logo-3d-top">🏛️</div>
                <div className="logo-3d-face logo-3d-bottom">✅</div>
              </div>
            </div>
            {sidebarOpen&&<div><div className="logo-text">FiscoControl</div><div className="logo-sub">Monitoring R.P.G.E</div></div>}
          </div>
          <nav className="nav">
            {nav.map(item=>(
              <div key={item.id} className={`nav-item ${pagina===item.id?"active":""}`} onClick={()=>setPagina(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen&&<span>{item.label}</span>}
                {sidebarOpen&&item.badge>0&&<span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="user-av">RS</div>
              {sidebarOpen&&<div><div className="user-name">Rogério Santana</div><div className="user-role">Administrador</div></div>}
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <button className="topbar-toggle" onClick={()=>setSidebarOpen(!sidebarOpen)}>☰</button>
            <span className="topbar-breadcrumb">FiscoControl / <strong>{nav.find(n=>n.id===pagina)?.label}</strong></span>
            <div className="topbar-right">
              <button className="topbar-btn">🔔 {alertasNaoLidos}</button>
              <button className="topbar-btn">🔒 2FA Ativo</button>
              <button className="topbar-btn">⚙️ Config</button>
            </div>
          </div>
          <div className="scroll-area">{renderPagina()}</div>
        </div>
      </div>
    </>
  );
}
