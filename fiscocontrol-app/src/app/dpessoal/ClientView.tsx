"use client";
import React, { useState } from "react";
import { CATALOGO_PREV } from "@/lib/catalogoPrev";

function StatusBadge({ status }: { status: string }) {
    const map: any = { Pendente: "badge-pending", Entregue: "badge-done", Atrasada: "badge-late", Ativo: "badge-done", Suspenso: "badge-pending", Encerrado: "badge-late", Alto: "badge-late", Médio: "badge-pending", Baixo: "badge-done" };
    return <span className={`badge ${map[status] || "badge-pending"}`}>{status}</span>;
}

const PRAZO_COR: any = { Mensal: "#0ea5e9", Anual: "#7c3aed", Eventual: "#94a3b8", Trimestral: "#22c55e" };
const PRAZO_ICON: any = { Mensal: "📅", Anual: "📆", Eventual: "⚡", Trimestral: "📋" };

export function DPessoalView({ clientes }: { clientes: any[] }) {
    const [abaSel, setAbaSel] = useState("visao");
    const [clienteSel, setClienteSel] = useState("todos");
    const [catAberta, setCatAberta] = useState<any>({});
    const [statusMap, setStatusMap] = useState<any>({});
    const [filtroStatus, setFiltroStatus] = useState("Todos");
    const [busca, setBusca] = useState("");

    const toggleCat = (cat: string) => setCatAberta((s: any) => ({ ...s, [cat]: !s[cat] }));
    const toggleStatus = (id: string) => setStatusMap((s: any) => ({
        ...s, [id]: s[id] === "Entregue" ? "Pendente" : "Entregue"
    }));

    const todasObs = Object.entries(CATALOGO_PREV).flatMap(([cat, obs]: any) =>
        obs.map((o: any) => ({ ...o, categoria: cat }))
    );

    const totalObs = todasObs.length;
    const entregues = todasObs.filter(o => statusMap[o.id] === "Entregue").length;
    const pendentes = totalObs - entregues;

    const kpis = [
        { label: "eSocial", count: CATALOGO_PREV["eSocial — Escrituração Digital"].length, icon: "💻", cor: "#0ea5e9" },
        { label: "DCTFWeb", count: CATALOGO_PREV["DCTFWeb — Declaração de Débitos"].length, icon: "📄", cor: "#7c3aed" },
        { label: "FGTS", count: CATALOGO_PREV["FGTS — Fundo de Garantia"].length, icon: "🏦", cor: "#f59e0b" },
        { label: "Folha/DP", count: CATALOGO_PREV["Folha de Pagamento e Obrigações Acessórias"].length, icon: "📋", cor: "#22c55e" },
        { label: "INSS/Prev.", count: CATALOGO_PREV["Previdência Social — INSS"].length, icon: "🏛️", cor: "#ef4444" },
        { label: "Entregues", count: entregues, icon: "✅", cor: "#22c55e" },
    ];

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">D.Pessoal / Previdenciário</h1>
                    <p className="page-sub">Obrigações trabalhistas, previdenciárias e FGTS — {totalObs} obrigações cadastradas</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-secondary">📥 Exportar</button>
                    <button className="btn-primary">+ Nova Obrigação</button>
                </div>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(6,1fr)" }}>
                {kpis.map((k, i) => (
                    <div key={i} className="kpi-card" style={{ borderLeftColor: k.cor, borderLeftWidth: 3, borderLeftStyle: "solid" }}>
                        <div className="kpi-icon">{k.icon}</div>
                        <div className="kpi-info">
                            <span className="kpi-num" style={{ color: k.cor }}>{k.count}</span>
                            <span className="kpi-label">{k.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
                {[["visao", "📊 Visão Geral"], ["calendario", "📅 Por Vencimento"], ["clientes", "🏢 Por Cliente"]].map(([k, l]) => (
                    <button key={k} onClick={() => setAbaSel(k)} style={{
                        background: "none", border: "none", borderBottom: abaSel === k ? "2px solid var(--accent)" : "2px solid transparent",
                        color: abaSel === k ? "var(--accent)" : "var(--text3)", padding: "10px 18px",
                        fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)"
                    }}>{l}</button>
                ))}
            </div>

            {abaSel === "visao" && (
                <div className="fade-in">
                    <div className="card" style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <h3 className="card-title" style={{ margin: 0 }}>Progresso Geral de Conformidade</h3>
                            <span style={{ fontSize: 22, fontWeight: 800, color: entregues / totalObs > 0.7 ? "var(--green)" : entregues / totalObs > 0.4 ? "var(--orange)" : "var(--red)" }}>
                                {Math.round(entregues / totalObs * 100)}%
                            </span>
                        </div>
                        <div style={{ height: 10, background: "var(--bg4)", borderRadius: 5, overflow: "hidden", marginBottom: 8 }}>
                            <div style={{ height: "100%", width: `${entregues / totalObs * 100}%`, background: `linear-gradient(90deg,#22c55e,#0ea5e9)`, borderRadius: 5, transition: "width .5s" }} />
                        </div>
                        <div style={{ display: "flex", gap: 20, fontSize: 12, color: "var(--text3)" }}>
                            <span>✅ {entregues} entregues</span>
                            <span>⏳ {pendentes} pendentes</span>
                            <span>📋 {totalObs} total</span>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                        <input className="search-input" style={{ flex: 1, minWidth: 200 }} placeholder="Buscar por sigla ou nome da obrigação..." value={busca} onChange={e => setBusca(e.target.value)} />
                        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                            <option>Todos</option><option>Pendente</option><option>Entregue</option>
                        </select>
                    </div>

                    {Object.entries(CATALOGO_PREV).map(([cat, obs]: any) => {
                        const obsFiltCat = obs.filter((o: any) => {
                            const mB = o.nome.toLowerCase().includes(busca.toLowerCase()) || o.sigla.toLowerCase().includes(busca.toLowerCase());
                            const mS = filtroStatus === "Todos" || (statusMap[o.id] || "Pendente") === filtroStatus;
                            return mB && mS;
                        });
                        if (!obsFiltCat.length) return null;
                        const entCat = obs.filter((o: any) => statusMap[o.id] === "Entregue").length;
                        const isAberta = catAberta[cat] !== false; // aberta por padrão
                        const corCat = cat.includes("eSocial") ? "#0ea5e9" : cat.includes("DCTF") ? "#7c3aed" : cat.includes("FGTS") ? "#f59e0b" : cat.includes("Folha") ? "#22c55e" : "#ef4444";

                        return (
                            <div key={cat} style={{ marginBottom: 12, border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                                <div onClick={() => toggleCat(cat)} style={{
                                    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                                    background: `${corCat}0d`, borderBottom: `1px solid ${corCat}33`, cursor: "pointer"
                                }}>
                                    <div style={{ width: 4, height: 20, borderRadius: 2, background: corCat, flexShrink: 0 }} />
                                    <span style={{ flex: 1, fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{cat}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ fontSize: 11, color: corCat, background: `${corCat}22`, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>
                                            {entCat}/{obs.length} entregues
                                        </span>
                                        <span style={{ color: "var(--text3)", fontSize: 12 }}>{isAberta ? "▲" : "▼"}</span>
                                    </div>
                                </div>

                                {isAberta && (
                                    <div>
                                        {obsFiltCat.map((ob: any) => {
                                            const st = statusMap[ob.id] || "Pendente";
                                            const isEntregue = st === "Entregue";
                                            return (
                                                <div key={ob.id} style={{
                                                    display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
                                                    borderBottom: "1px solid var(--border)",
                                                    background: isEntregue ? "rgba(34,197,94,0.03)" : "transparent"
                                                }}>
                                                    <button onClick={() => toggleStatus(ob.id)} style={{
                                                        width: 20, height: 20, borderRadius: 5, border: `2px solid ${isEntregue ? "var(--green)" : "var(--border2)"}`,
                                                        background: isEntregue ? "var(--green)" : "var(--bg4)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        cursor: "pointer", flexShrink: 0, fontSize: 12, color: "white", fontWeight: 700, padding: 0
                                                    }}>{isEntregue ? "✓" : ""}</button>

                                                    <span style={{
                                                        fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700,
                                                        color: corCat, background: `${corCat}15`,
                                                        padding: "3px 8px", borderRadius: 4, minWidth: 80, textAlign: "center", flexShrink: 0
                                                    }}>{ob.sigla}</span>

                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ display: "block", fontSize: 13, fontWeight: 500, color: isEntregue ? "var(--text3)" : "var(--text)", textDecoration: isEntregue ? "line-through" : "none" }}>{ob.nome}</span>
                                                        <span style={{ display: "block", fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{ob.desc}</span>
                                                    </div>

                                                    <span style={{
                                                        fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 5, whiteSpace: "nowrap", flexShrink: 0,
                                                        color: PRAZO_COR[ob.prazo] || "#94a3b8", background: `${PRAZO_COR[ob.prazo] || "#94a3b8"}18`
                                                    }}>{PRAZO_ICON[ob.prazo] || "⚡"} {ob.prazo}</span>

                                                    <span style={{
                                                        fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 5, flexShrink: 0,
                                                        background: isEntregue ? "var(--green-dim)" : "var(--orange-dim)",
                                                        color: isEntregue ? "var(--green)" : "var(--orange)"
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
                <div className="card fade-in">
                    <h3 className="card-title">📅 Vencimentos Trabalhistas</h3>
                    <p className="form-hint">Principais prazos das obrigações previdenciárias e trabalhistas.</p>
                    <table className="data-table">
                        <thead><tr><th>Vencimento</th><th>Obrigação</th><th>Descrição</th><th>Periodicidade</th><th>Status</th></tr></thead>
                        <tbody>
                            {[
                                { dia: 7, sigla: "FGTS", nome: "Recolhimento mensal do FGTS", prazo: "Mensal" },
                                { dia: 7, sigla: "eSocial", nome: "Fechamento da folha — S-1200/S-1202", prazo: "Mensal" },
                                { dia: 15, sigla: "DCTFWeb", nome: "DCTFWeb — Contribuições Previdenciárias", prazo: "Mensal" },
                                { dia: 20, sigla: "GPS", nome: "GPS — Guia da Previdência Social", prazo: "Mensal" },
                                { dia: 20, sigla: "DCTFWeb 13°", nome: "DCTFWeb 13° Salário (dezembro)", prazo: "Anual" },
                                { dia: 28, sigla: "RAIS", nome: "RAIS — Relação Anual de Informações Sociais", prazo: "Anual" },
                            ].map((item, i) => (
                                <tr key={i}>
                                    <td><div style={{
                                        width: 36, height: 36, borderRadius: 8, background: "var(--bg3)", border: "1px solid var(--border)",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "var(--accent)"
                                    }}>d{item.dia}</div></td>
                                    <td><span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "var(--orange)", background: "rgba(245,158,11,0.12)", padding: "3px 8px", borderRadius: 4 }}>{item.sigla}</span></td>
                                    <td style={{ fontSize: 13 }}>{item.nome}</td>
                                    <td><span style={{ fontSize: 11, color: PRAZO_COR[item.prazo], background: `${PRAZO_COR[item.prazo]}18`, padding: "2px 8px", borderRadius: 5, fontWeight: 600 }}>{item.prazo}</span></td>
                                    <td><span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "var(--orange-dim)", color: "var(--orange)" }}>Pendente</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {abaSel === "clientes" && (
                <div className="fade-in">
                    <div style={{ marginBottom: 16 }}>
                        <select style={{ minWidth: 280 }} value={clienteSel} onChange={e => setClienteSel(e.target.value)}>
                            <option value="todos">Todos os clientes</option>
                            {clientes.filter(c => c.status === "Ativo").map(c => <option key={c.id} value={c.id}>{c.razaoSocial}</option>)}
                        </select>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                        {clientes.filter(c => clienteSel === "todos" || c.id === clienteSel).map(c => {
                            const totalC = 5;
                            const entC = 3;
                            return (
                                <div key={c.id} className="card" style={{ margin: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                        <div>
                                            <span style={{ fontSize: 14, fontWeight: 700 }}>{c.razaoSocial}</span>
                                            <span className="regime-tag" style={{ marginLeft: 8 }}>{c.regime}</span>
                                        </div>
                                        <StatusBadge status={c.status} />
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
                                        {[["eSocial", "💻", "#0ea5e9"], [" FGTS", "🏦", "#f59e0b"], ["DCTFWeb", "📄", "#7c3aed"]].map(([l, ic, cor]) => (
                                            <div key={l} style={{ background: `${cor}10`, borderRadius: 7, padding: "8px 10px", textAlign: "center", border: `1px solid ${cor}25` }}>
                                                <span style={{ fontSize: 16 }}>{ic}</span>
                                                <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: cor, marginTop: 3 }}>{l}</span>
                                                <span style={{ display: "block", fontSize: 10, color: "var(--text3)" }}>Mensal</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6 }}>Conformidade previdenciária</div>
                                    <div style={{ height: 6, background: "var(--bg4)", borderRadius: 3, overflow: "hidden" }}>
                                        <div style={{ height: "100%", width: `${entC / totalC * 100}%`, background: "var(--green)", borderRadius: 3 }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginTop: 5 }}>
                                        <span>{entC} entregues</span>
                                        <span style={{ fontWeight: 600, color: "var(--green)" }}>{Math.round(entC / totalC * 100)}%</span>
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
