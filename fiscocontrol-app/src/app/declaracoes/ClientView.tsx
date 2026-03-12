"use client";

import React, { useState } from "react";
import { CATALOGO_OBRIGACOES, TODAS_OBRIGACOES_LISTA } from "@/lib/catalogoObrigacoes";

export function DeclaracoesView({ initialClientes }: { initialClientes: any[] }) {
    const [esferaSel, setEsferaSel] = useState("Todas");
    const [periodSel, setPeriodSel] = useState("Todas");
    const [busca, setBusca] = useState("");
    const [clienteSel, setClienteSel] = useState<number | null>(null);

    // Mapear "obligations" do banco para "obrigacoesSelecionadas" que a visualização original entende
    const clientes = initialClientes.map(c => ({
        ...c,
        obrigacoesSelecionadas: (c.obligations || []).map((o: any) => o.identifier || o.nome)
    }));

    const esferas = ["Todas", "FEDERAIS — SPED / Escrituração Digital", "FEDERAIS — Declarações", "FEDERAIS — Simples Nacional", "FEDERAIS — Previdenciárias e Trabalhistas", "ESTADUAIS — ICMS", "MUNICIPAIS — ISS"];
    const periodos = ["Todas", "Mensal", "Anual", "Semestral", "Trimestral", "Eventual"];

    const periodoColor: any = { Mensal: "#0ea5e9", Anual: "#7c3aed", Semestral: "#f59e0b", Eventual: "#94a3b8", Trimestral: "#22c55e" };
    const periodoIcon: any = { Mensal: "📅", Anual: "📆", Semestral: "🗓️", Eventual: "⚡", Trimestral: "📋" };

    const clientesFiltrados = clienteSel
        ? [clientes.find(c => c.id === String(clienteSel))].filter(Boolean)
        : clientes;

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Declarações Fiscais</h1>
                    <p className="page-sub">Catálogo completo — {TODAS_OBRIGACOES_LISTA.length} obrigações cadastradas</p>
                </div>
            </div>

            <div className="decl-kpi-row">
                {[
                    { label: "Federais", count: TODAS_OBRIGACOES_LISTA.filter((o: any) => o.categoria.startsWith("FEDERAL")).length, icon: "🏛️", color: "#0ea5e9" },
                    { label: "Estaduais", count: TODAS_OBRIGACOES_LISTA.filter((o: any) => o.categoria.startsWith("ESTADUAL")).length, icon: "🏢", color: "#a78bfa" },
                    { label: "Municipais", count: TODAS_OBRIGACOES_LISTA.filter((o: any) => o.categoria.startsWith("MUNICIPAL")).length, icon: "🏙️", color: "#22d3ee" },
                    { label: "Mensais", count: TODAS_OBRIGACOES_LISTA.filter((o: any) => o.periodicidade === "Mensal").length, icon: "📅", color: "#22c55e" },
                    { label: "Anuais", count: TODAS_OBRIGACOES_LISTA.filter((o: any) => o.periodicidade === "Anual").length, icon: "📆", color: "#f59e0b" },
                    { label: "Eventuais", count: TODAS_OBRIGACOES_LISTA.filter((o: any) => o.periodicidade === "Eventual").length, icon: "⚡", color: "#94a3b8" },
                ].map((k, i) => (
                    <div key={i} className="decl-kpi" style={{ borderLeftColor: k.color }}>
                        <span className="decl-kpi-icon">{k.icon}</span>
                        <span className="decl-kpi-num" style={{ color: k.color }}>{k.count}</span>
                        <span className="decl-kpi-label">{k.label}</span>
                    </div>
                ))}
            </div>

            <div className="dash-row" style={{ alignItems: "flex-start" }}>
                <div style={{ flex: 2 }}>
                    <div className="card">
                        <div className="table-toolbar flex-wrap">
                            <input className="search-input" placeholder="Buscar por sigla ou nome..." value={busca} onChange={e => setBusca(e.target.value)} />
                            <select value={esferaSel} onChange={e => setEsferaSel(e.target.value)} style={{ maxWidth: 260 }}>
                                {esferas.map(e => <option key={e}>{e}</option>)}
                            </select>
                            <select value={periodSel} onChange={e => setPeriodSel(e.target.value)}>
                                {periodos.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>

                        {Object.entries(CATALOGO_OBRIGACOES).map(([cat, obs]: any[]) => {
                            const filtrado = obs.filter((ob: any) => {
                                const matchCat = esferaSel === "Todas" || esferaSel === cat;
                                const matchPer = periodSel === "Todas" || ob.periodicidade === periodSel;
                                const matchBusca = ob.nome.toLowerCase().includes(busca.toLowerCase()) || ob.id.toLowerCase().includes(busca.toLowerCase());
                                return matchCat && matchPer && matchBusca;
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
                                        {filtrado.map((ob: any) => (
                                            <div key={ob.id} className="decl-row">
                                                <div className="decl-sigla">{ob.id}</div>
                                                <div className="decl-info">
                                                    <span className="decl-nome">{ob.nome}</span>
                                                    <span className="decl-base">{ob.base}</span>
                                                </div>
                                                <div className="decl-periodo" style={{ background: `${periodoColor[ob.periodicidade]}22`, color: periodoColor[ob.periodicidade] }}>
                                                    {periodoIcon[ob.periodicidade]} {ob.periodicidade}
                                                </div>
                                                <div className="decl-clientes-count">
                                                    {clientes.filter(c => c.obrigacoesSelecionadas?.includes(ob.id)).length > 0 && (
                                                        <span className="decl-clientes-badge">
                                                            {clientes.filter(c => c.obrigacoesSelecionadas?.includes(ob.id)).length} cliente(s)
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

                <div style={{ flex: 1 }}>
                    <div className="card">
                        <h3 className="card-title">📊 Obrigações por Cliente</h3>
                        <div style={{ marginBottom: 10 }}>
                            <select style={{ width: "100%" }} value={clienteSel || ""} onChange={e => setClienteSel(e.target.value ? parseInt(e.target.value) : null)}>
                                <option value="">Todos os clientes</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.razaoSocial.split(" ").slice(0, 3).join(" ")}</option>)}
                            </select>
                        </div>
                        {clientes.filter(c => !clienteSel || c.id === String(clienteSel)).map(c => {
                            const obs = (c.obrigacoesSelecionadas || []).map((id: string) => TODAS_OBRIGACOES_LISTA.find((o: any) => o.id === id)).filter(Boolean);
                            if (!obs.length) return null;
                            const fed = obs.filter((o: any) => o.categoria.startsWith("FEDERAL")).length;
                            const est = obs.filter((o: any) => o.categoria.startsWith("ESTADUAL")).length;
                            const mun = obs.filter((o: any) => o.categoria.startsWith("MUNICIPAL")).length;
                            return (
                                <div key={c.id} className="decl-cliente-card">
                                    <div className="decl-cli-header">
                                        <div>
                                            <span className="decl-cli-nome">{c.razaoSocial.split(" ").slice(0, 3).join(" ")}</span>
                                            <span className="regime-tag" style={{ marginLeft: 6 }}>{c.regime}</span>
                                        </div>
                                        <span className="decl-cli-total">{obs.length} total</span>
                                    </div>
                                    <div className="decl-cli-bars">
                                        {fed > 0 && <div className="decl-cli-bar-item"><span style={{ color: "#0ea5e9" }}>🏛️ Federal</span><strong>{fed}</strong></div>}
                                        {est > 0 && <div className="decl-cli-bar-item"><span style={{ color: "#a78bfa" }}>🏢 Estadual</span><strong>{est}</strong></div>}
                                        {mun > 0 && <div className="decl-cli-bar-item"><span style={{ color: "#22d3ee" }}>🏙️ Municipal</span><strong>{mun}</strong></div>}
                                    </div>
                                    <div className="decl-cli-tags">
                                        {obs.slice(0, 8).map((o: any) => <span key={o.id} className="enq-ob-tag">{o.id}</span>)}
                                        {obs.length > 8 && <span className="enq-ob-tag" style={{ background: "#1e3248", color: "#8ba4bf" }}>+{obs.length - 8}</span>}
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
