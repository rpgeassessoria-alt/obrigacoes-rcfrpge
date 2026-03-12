"use client";
import React, { useState, useEffect } from "react";
import { salvarCliente, excluirCliente, salvarGrupoEconomico, excluirGrupoEconomico, consultarCNPJ } from "./actions";
import { OBRIGACOES_CATALOG, SUGGESTIONS_BY_REGIME } from "@/lib/obrigacoesCatalog";
import { Users, Building2, Briefcase, ShieldAlert, CheckCircle2, X, ClipboardList, Scale, HardHat, LandPlot, Wand2, Search, ChevronDown, ChevronRight, Eraser } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
    const map: any = {
        Pendente: "badge-pending", Entregue: "badge-done", Atrasada: "badge-late",
        Ativo: "badge-done", Suspenso: "badge-pending", Encerrado: "badge-late",
        Alto: "badge-late", Médio: "badge-pending", Baixo: "badge-done"
    };
    return <span className={`badge ${map[status] || "badge-pending"}`}>{status}</span>;
}

export function ClientView({ initialClientes, usuarios, gruposEconomicos, tenantId }: { initialClientes: any[], usuarios: any[], gruposEconomicos: any[], tenantId: string | null }) {
    const [busca, setBusca] = useState("");
    const [modal, setModal] = useState(false);
    const [modalGrupos, setModalGrupos] = useState(false);
    const [editando, setEditando] = useState<any>(null);
    const [confirmExcluir, setConfirmExcluir] = useState<any>(null);
    const [msgSalvo, setMsgSalvo] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchingCnpj, setSearchingCnpj] = useState(false);

    // Relacionado ao novo formulário multi-aba
    const [activeTab, setActiveTab] = useState("dados");
    const [selectedObligations, setSelectedObligations] = useState<Set<string>>(new Set());
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const [form, setForm] = useState({
        id: "", razaoSocial: "", cnpj: "", regime: "Simples Nacional", cnae: "",
        inscricaoEstadual: "", inscricaoMunicipal: "", status: "Ativo", risco: "Baixo",
        responsibleId: "", economicGroupId: "", tenantId: tenantId,
        nomeFantasia: "", eMail: "", telefone: ""
    });

    // Inicializa categorias expandidas
    useEffect(() => {
        const cats = new Set(OBRIGACOES_CATALOG.map(o => o.categoria));
        setExpandedCategories(cats);
    }, []);

    const handleCnpjChange = async (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 14);
        let masked = digits;
        if (digits.length > 2) masked = digits.slice(0, 2) + "." + digits.slice(2);
        if (digits.length > 5) masked = masked.slice(0, 6) + "." + masked.slice(6);
        if (digits.length > 8) masked = masked.slice(0, 10) + "/" + masked.slice(10);
        if (digits.length > 12) masked = masked.slice(0, 15) + "-" + masked.slice(15);

        setForm(prev => ({ ...prev, cnpj: masked }));

        if (digits.length === 14 && !editando) {
            setSearchingCnpj(true);
            const res = await consultarCNPJ(digits);
            setSearchingCnpj(false);

            if (res.success && res.data) {
                const d = res.data;
                setForm(prev => ({
                    ...prev,
                    razaoSocial: d.razao_social || prev.razaoSocial,
                    nomeFantasia: d.nome_fantasia || prev.nomeFantasia,
                    cnae: d.cnae_fiscal || prev.cnae,
                    eMail: d.email || prev.eMail,
                    telefone: d.ddd_telefone_1 || prev.telefone,
                }));
            }
        }
    };

    const filtrados = initialClientes.filter(c =>
        (c.razaoSocial && c.razaoSocial.toLowerCase().includes(busca.toLowerCase())) ||
        (c.cnpj && c.cnpj.includes(busca))
    );

    const abrirNovo = () => {
        setEditando(null);
        setForm({
            id: "", razaoSocial: "", cnpj: "", regime: "Simples Nacional", cnae: "",
            inscricaoEstadual: "", inscricaoMunicipal: "", status: "Ativo", risco: "Baixo",
            responsibleId: "", economicGroupId: "", tenantId: tenantId,
            nomeFantasia: "", eMail: "", telefone: ""
        });
        setSelectedObligations(new Set());
        setActiveTab("dados");
        setModal(true);
    };

    const handleSugerir = () => {
        const suggested = SUGGESTIONS_BY_REGIME[form.regime] || [];
        setSelectedObligations(new Set(suggested));
    };

    const toggleObligation = (id: string) => {
        const next = new Set(selectedObligations);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedObligations(next);
    };

    const toggleCategory = (cat: string) => {
        const next = new Set(expandedCategories);
        if (next.has(cat)) next.delete(cat);
        else next.add(cat);
        setExpandedCategories(next);
    };

    const limparTudo = () => {
        const currentSphereObs = OBRIGACOES_CATALOG.filter(o => o.esfera === activeTab).map(o => o.id);
        const next = new Set(selectedObligations);
        currentSphereObs.forEach(id => next.delete(id));
        setSelectedObligations(next);
    };

    const countByEsfera = (esfera: string) => {
        return OBRIGACOES_CATALOG.filter(ob => ob.esfera === esfera && selectedObligations.has(ob.id)).length;
    };

    const handleSalvar = async () => {
        if (!form.razaoSocial || !form.cnpj) {
            setActiveTab("dados");
            return;
        }
        setLoading(true);
        const res = await salvarCliente(form, !!editando, Array.from(selectedObligations));
        setLoading(false);

        if (res.success) {
            setModal(false);
            setMsgSalvo(editando ? "✅ Cliente atualizado!" : "✅ Cliente cadastrado!");
            setTimeout(() => setMsgSalvo(""), 3500);
        } else {
            alert("Erro ao salvar: " + res.error);
        }
    };

    const deletar = async () => {
        if (!confirmExcluir) return;
        setLoading(true);
        const res = await excluirCliente(confirmExcluir.id);
        setLoading(false);

        if (res.success) {
            setMsgSalvo("🗑️ Excluído com sucesso.");
            setConfirmExcluir(null);
            setTimeout(() => setMsgSalvo(""), 3500);
        } else {
            alert("Erro ao excluir.");
            setConfirmExcluir(null);
        }
    };

    const renderObligationsTab = (esfera: string) => {
        const sphereObs = OBRIGACOES_CATALOG.filter(o => o.esfera === esfera);
        const categories = Array.from(new Set(sphereObs.map(o => o.categoria)));
        const totalInSphere = sphereObs.length;
        const selectedInSphere = countByEsfera(esfera);

        const esferaClass = esfera.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        return (
            <div className="sphere-container">
                <div className="sphere-summary-bar">
                    <span>{selectedObligations.size} obrigações selecionadas no total</span>
                    <button className="btn-link-action" onClick={limparTudo}>Limpar tudo</button>
                </div>

                <div className={`sphere-card-header sphere-${esferaClass}`}>
                    <div className="sphere-icon-text">
                        {esfera === 'Federal' && <Building2 size={22} />}
                        {esfera === 'Previdenciária' && <Users size={22} />}
                        {esfera === 'Estadual' && <LandPlot size={22} />}
                        {esfera === 'Municipal' && <LandPlot size={22} />}
                        <h3>{esfera}s</h3>
                    </div>
                    <div className="sphere-counter-badge-pill">{selectedInSphere} de {totalInSphere} selecionadas</div>
                </div>

                {categories.map(cat => {
                    const catObs = sphereObs.filter(o => o.categoria === cat);
                    const selectedInCat = catObs.filter(o => selectedObligations.has(o.id)).length;
                    const isExpanded = expandedCategories.has(cat);

                    return (
                        <div key={cat} className="category-group-premium">
                            <div className="category-header-premium" onClick={() => toggleCategory(cat)}>
                                <div className="category-title-premium">
                                    <div className={`cat-toggle-icon ${isExpanded ? 'active' : ''}`}>
                                        {isExpanded ? <Eraser size={14} /> : <ChevronRight size={14} />}
                                    </div>
                                    <span>{cat}</span>
                                </div>
                                <div className="category-meta-premium">{selectedInCat}/{catObs.length}</div>
                            </div>

                            {isExpanded && (
                                <div className="category-items-premium">
                                    {catObs.map(ob => {
                                        const isSelected = selectedObligations.has(ob.id);
                                        const periodClass = ob.periodo === 'Anual' ? 'period-annual' : 'period-monthly';
                                        return (
                                            <div key={ob.id} className={`ob-row-premium ${isSelected ? 'selected' : ''}`} onClick={() => toggleObligation(ob.id)}>
                                                <div className="ob-check-premium">
                                                    <div className={`ob-box ${isSelected ? 'checked' : ''}`}>
                                                        {isSelected && <CheckCircle2 size={16} />}
                                                    </div>
                                                </div>
                                                <div className="ob-text">
                                                    <div className="ob-name-premium">{ob.nome}</div>
                                                    {ob.subtitulo && <div className="ob-sub-premium">{ob.subtitulo}</div>}
                                                </div>
                                                <div className={`ob-period-badge ${periodClass}`}>{ob.periodo}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">🏦 Módulo de Clientes</h1>
                    <p className="page-sub">{initialClientes.length} empresas sob gestão ativa</p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {msgSalvo && <span className="badge badge-done">{msgSalvo}</span>}
                    <button className="btn-secondary" onClick={() => setModalGrupos(true)}>📂 Grupos Econômicos</button>
                    <button className="btn-primary" onClick={abrirNovo}>+ Novo Cliente</button>
                </div>
            </div>

            <div className="card">
                <div className="table-toolbar">
                    <input className="search-input" placeholder="Buscar por razão social ou CNPJ..." value={busca} onChange={e => setBusca(e.target.value)} />
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Razão Social / Grupo</th>
                            <th>CNPJ</th>
                            <th>Regime</th>
                            <th>Responsável</th>
                            <th>Status</th>
                            <th style={{ textAlign: "center" }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>{filtrados.map(c => (
                        <tr key={c.id}>
                            <td>
                                <div><strong>{c.razaoSocial}</strong></div>
                                <div style={{ fontSize: 10, color: "var(--primary)", marginTop: 2 }}>{c.group?.name || "Sem Grupo"}</div>
                            </td>
                            <td className="mono">{c.cnpj}</td>
                            <td><span className="regime-tag">{c.regime}</span></td>
                            <td>{c.responsible?.name || "-"}</td>
                            <td><StatusBadge status={c.status} /></td>
                            <td style={{ textAlign: "center" }}>
                                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                    <button className="btn-icon" title="Editar">✏️</button>
                                    <button className="btn-icon" style={{ color: "var(--danger)" }} onClick={() => setConfirmExcluir(c)}>🗑️</button>
                                </div>
                            </td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>

            {/* Modal Cliente Multi-aba (Protótipo Fiel) */}
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal modal-xl" onClick={e => e.stopPropagation()} style={{ height: '90vh' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ fontSize: 21, fontWeight: 800 }}>{editando ? "Editar Cliente" : "Novo Cliente"}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                    <ClipboardList size={14} color="var(--text3)" />
                                    <span style={{ fontSize: 12, color: "var(--text3)" }}>
                                        {selectedObligations.size} obrigações selecionadas no total
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <button className="btn-sugerir-premium" onClick={handleSugerir}>
                                    <Wand2 size={16} /> Sugerir pelo Regime
                                </button>
                                <button className="modal-close" onClick={() => setModal(false)}><X size={24} /></button>
                            </div>
                        </div>

                        {/* Navegação por Abas Premium */}
                        <div className="modal-tabs">
                            <div className={`modal-tab ${activeTab === 'dados' ? 'active' : ''}`} onClick={() => setActiveTab('dados')}>
                                <Building2 size={18} /> Dados Cadastrais
                            </div>
                            <div className={`modal-tab ${activeTab === 'Federal' ? 'active' : ''}`} onClick={() => setActiveTab('Federal')}>
                                <Building2 size={18} /> Federais {countByEsfera('Federal') > 0 && <span className="tab-badge badge-blue">{countByEsfera('Federal')}</span>}
                            </div>
                            <div className={`modal-tab ${activeTab === 'Previdenciária' ? 'active' : ''}`} onClick={() => setActiveTab('Previdenciária')}>
                                <Users size={18} /> Previdenciárias {countByEsfera('Previdenciária') > 0 && <span className="tab-badge badge-orange">{countByEsfera('Previdenciária')}</span>}
                            </div>
                            <div className={`modal-tab ${activeTab === 'Estadual' ? 'active' : ''}`} onClick={() => setActiveTab('Estadual')}>
                                <LandPlot size={18} /> Estaduais {countByEsfera('Estadual') > 0 && <span className="tab-badge badge-purple">{countByEsfera('Estadual')}</span>}
                            </div>
                            <div className={`modal-tab ${activeTab === 'Municipal' ? 'active' : ''}`} onClick={() => setActiveTab('Municipal')}>
                                <LandPlot size={18} /> Municipais {countByEsfera('Municipal') > 0 && <span className="tab-badge badge-cyan">{countByEsfera('Municipal')}</span>}
                            </div>
                            <div className={`modal-tab ${activeTab === 'enquadramento' ? 'active' : ''}`} onClick={() => setActiveTab('enquadramento')}>
                                <Scale size={18} /> Enquadramento
                            </div>
                        </div>

                        <div className="modal-body">
                            {activeTab === 'dados' && (
                                <div className="form-grid">
                                    <div className="form-group span-2">
                                        <label>RAZÃO SOCIAL *</label>
                                        <input placeholder="Nome completo da empresa" value={form.razaoSocial} onChange={e => setForm({ ...form, razaoSocial: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>STATUS</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                            <option>Ativo</option><option>Suspenso</option><option>Encerrado</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>CNPJ *</label>
                                        <div style={{ position: "relative" }}>
                                            <input placeholder="00.000.000/0000-00" value={form.cnpj} onChange={e => handleCnpjChange(e.target.value)} className={searchingCnpj ? "loading-input" : ""} />
                                            {searchingCnpj && <div style={{ position: "absolute", right: 10, top: 10, animation: "spin 1s linear infinite" }}><Search size={16} color="var(--accent)" /></div>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>INSCRIÇÃO ESTADUAL</label>
                                        <input placeholder="Número IE" value={form.inscricaoEstadual} onChange={e => setForm({ ...form, inscricaoEstadual: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>INSCRIÇÃO MUNICIPAL</label>
                                        <input placeholder="Número IM" value={form.inscricaoMunicipal} onChange={e => setForm({ ...form, inscricaoMunicipal: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>CNAE PRINCIPAL</label>
                                        <input placeholder="0000-0/00" value={form.cnae} onChange={e => setForm({ ...form, cnae: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>NOME FANTASIA</label>
                                        <input placeholder="Nome fantasia (se houver)" value={form.nomeFantasia} onChange={e => setForm({ ...form, nomeFantasia: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>TELEFONE</label>
                                        <input placeholder="(00) 00000-0000" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>E-MAIL</label>
                                        <input placeholder="empresa@email.com" value={form.eMail} onChange={e => setForm({ ...form, eMail: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>REGIME TRIBUTÁRIO</label>
                                        <select value={form.regime} onChange={e => setForm({ ...form, regime: e.target.value })}>
                                            <option>Simples Nacional</option><option>Lucro Presumido</option><option>Lucro Real</option><option>MEI</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>RESPONSÁVEL</label>
                                        <select value={form.responsibleId} onChange={e => setForm({ ...form, responsibleId: e.target.value })}>
                                            <option value="">Selecione um consultor...</option>
                                            {usuarios.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>CLASSIFICAÇÃO DE RISCO</label>
                                        <select value={form.risco} onChange={e => setForm({ ...form, risco: e.target.value })}>
                                            <option>Baixo</option><option>Médio</option><option>Alto</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {['Federal', 'Previdenciária', 'Estadual', 'Municipal'].includes(activeTab) && renderObligationsTab(activeTab)}

                            {activeTab === 'enquadramento' && (
                                <div className="form-grid">
                                    <div className="form-group span-2">
                                        <label>GRUPO ECONÔMICO *</label>
                                        <select value={form.economicGroupId} onChange={e => setForm({ ...form, economicGroupId: e.target.value })}>
                                            <option value="">Selecione um grupo...</option>
                                            {gruposEconomicos.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                            <button className="btn-primary-action" onClick={handleSalvar} disabled={loading}>
                                {loading ? "Salvando..." : (editando ? "Salvar Alterações" : "Cadastrar Cliente")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Grupos Econômicos */}
            {modalGrupos && (
                <div className="modal-overlay" onClick={() => setModalGrupos(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Gestão de Grupos Econômicos</h2>
                            <button className="modal-close" onClick={() => setModalGrupos(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ marginBottom: 8, display: "block", fontSize: 12, fontWeight: 600 }}>CRIAR NOVO GRUPO</label>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <input id="newGroupName" className="search-input" placeholder="Nome do Grupo (ex: Grupo ABC)" />
                                    <button className="btn-primary" onClick={async () => {
                                        const el = document.getElementById("newGroupName") as HTMLInputElement;
                                        if (!el.value) return;
                                        await salvarGrupoEconomico({ name: el.value, tenantId }, false);
                                        el.value = "";
                                    }}>Adicionar</button>
                                </div>
                            </div>
                            <ul className="group-list">
                                {gruposEconomicos.map(g => (
                                    <li key={g.id} className="group-item">
                                        <div>
                                            <div className="group-name">{g.name}</div>
                                            <div className="group-meta">{g._count?.clients || 0} empresas vinculadas</div>
                                        </div>
                                        <button className="btn-icon" style={{ color: "var(--danger)" }} onClick={() => excluirGrupoEconomico(g.id)}>🗑️</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmação Exclusão */}
            {confirmExcluir && (
                <div className="modal-overlay" onClick={() => setConfirmExcluir(null)}>
                    <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Confirmar Exclusão</h2>
                            <ShieldAlert size={24} color="var(--red)" />
                        </div>
                        <div className="modal-body" style={{ textAlign: 'center', padding: '10px 24px 24px' }}>
                            <p style={{ marginBottom: 12 }}>Tem certeza que deseja excluir o cliente <strong>{confirmExcluir.razaoSocial}</strong>?</p>
                            <p style={{ fontSize: 12, color: "var(--text3)" }}>Todas as obrigações e históricos deste cliente serão removidos permanentemente.</p>
                        </div>
                        <div className="modal-footer" style={{ justifyContent: 'center', gap: 16 }}>
                            <button className="btn-secondary" onClick={() => setConfirmExcluir(null)} style={{ width: 120 }}>Não</button>
                            <button className="btn-primary" style={{ background: "var(--red)", width: 120 }} onClick={deletar}>Sim, Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
