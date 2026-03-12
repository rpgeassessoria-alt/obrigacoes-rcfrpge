"use client";

import React, { useState } from "react";
import { marcarComoEntregueAgenda } from "./actions";

function diasRestantes(dataVenc: string | Date | number) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diffTs = new Date(dataVenc).getTime() - hoje.getTime();
    return Math.ceil(diffTs / (1000 * 60 * 60 * 24));
}

function fmt(data: Date) {
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function AgendaView({ initialObrigacoes, clientes }: { initialObrigacoes: any[], clientes: any[] }) {
    const [busca, setBusca] = useState("");
    const [filtroEsfera, setFiltroEsfera] = useState("TODAS");
    const [filtroUrgencia, setFiltroUrgencia] = useState("TODOS");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const filtradas = initialObrigacoes.filter(o => {
        const clientName = o.client?.razaoSocial || "";
        const matchesBusca = o.nome.toLowerCase().includes(busca.toLowerCase()) || clientName.toLowerCase().includes(busca.toLowerCase());

        const matchesEsfera = filtroEsfera === "TODAS" || o.esfera.toUpperCase() === filtroEsfera;

        const dias = diasRestantes(o.vencimento);
        let matchesUrgencia = true;
        if (filtroUrgencia === "ATRASADOS") matchesUrgencia = dias < 0;
        else if (filtroUrgencia === "HOJE") matchesUrgencia = dias === 0;
        else if (filtroUrgencia === "PROXIMOS") matchesUrgencia = dias > 0 && dias <= 3;

        return matchesBusca && matchesEsfera && matchesUrgencia;
    });

    const agruparPorData = () => {
        const grupos: Record<string, any[]> = {};
        filtradas.forEach(o => {
            const dateStr = fmt(new Date(o.vencimento));
            if (!grupos[dateStr]) grupos[dateStr] = [];
            grupos[dateStr].push(o);
        });
        return grupos;
    };

    const grupos = agruparPorData();
    const datas = Object.keys(grupos);

    const handleMarcarEntregue = async (id: string) => {
        setLoadingId(id);
        await marcarComoEntregueAgenda(id);
        setLoadingId(null);
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Agenda Fiscal</h1>
                    <p className="page-sub">Próximos vencimentos: {filtradas.length} pendências filtered</p>
                </div>
            </div>

            <div className="card" style={{ padding: "20px" }}>
                <div className="table-toolbar" style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    <input
                        className="search-input"
                        placeholder="Buscar por cliente ou obrigação..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        style={{ flex: 1, minWidth: "250px" }}
                    />

                    <select
                        className="search-input"
                        style={{ width: "auto" }}
                        value={filtroEsfera}
                        onChange={e => setFiltroEsfera(e.target.value)}
                    >
                        <option value="TODAS">Todas as Esferas</option>
                        <option value="FEDERAL">Federal</option>
                        <option value="ESTADUAL">Estadual</option>
                        <option value="MUNICIPAL">Municipal</option>
                    </select>

                    <select
                        className="search-input"
                        style={{ width: "auto" }}
                        value={filtroUrgencia}
                        onChange={e => setFiltroUrgencia(e.target.value)}
                    >
                        <option value="TODOS">Todos os Prazos</option>
                        <option value="ATRASADOS">Atrasados 🔴</option>
                        <option value="HOJE">Vencem Hoje 🟠</option>
                        <option value="PROXIMOS">Próximos 3 dias 🟡</option>
                    </select>
                </div>

                {datas.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text3)" }}>
                        <p>Nenhuma obrigação pendente encontrada com esses filtros.</p>
                    </div>
                ) : (
                    <div className="timeline-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {datas.map(data => (
                            <div key={data} className="timeline-group" style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
                                <div className="timeline-date" style={{ minWidth: "120px", fontWeight: "bold", fontSize: "1.1rem", color: "var(--primary)" }}>
                                    {data}
                                    <div style={{ fontSize: "0.85rem", color: "var(--text3)", fontWeight: "normal", marginTop: "4px" }}>
                                        {diasRestantes(grupos[data][0].vencimento) === 0 ? "Hoje" :
                                            diasRestantes(grupos[data][0].vencimento) < 0 ? "Atrasado" :
                                                `Daqui a ${diasRestantes(grupos[data][0].vencimento)} dias`}
                                    </div>
                                </div>

                                <div className="timeline-items" style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                                    {grupos[data].map(o => {
                                        const dias = diasRestantes(o.vencimento);
                                        const isUrgent = dias <= 3 && dias >= 0;
                                        const isLate = dias < 0;

                                        return (
                                            <div key={o.id} style={{
                                                border: "1px solid var(--border)",
                                                borderRadius: "8px",
                                                padding: "16px",
                                                backgroundColor: "var(--bg-card)",
                                                borderLeft: `4px solid ${isLate ? "var(--danger)" : isUrgent ? "var(--warning)" : "var(--primary)"}`
                                            }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                                    <strong>{o.client?.razaoSocial.split(" ").slice(0, 2).join(" ")}</strong>
                                                    <span className={`tipo-tag tipo-${o.esfera.toLowerCase()}`}>{o.esfera}</span>
                                                </div>
                                                <div style={{ marginBottom: "12px", color: "var(--text2)" }}>
                                                    {o.nome} (Ref: <span className="mono">{o.competencia}</span>)
                                                </div>

                                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                    <button
                                                        className="btn-primary"
                                                        style={{ padding: "6px 12px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}
                                                        onClick={() => handleMarcarEntregue(o.id)}
                                                        disabled={loadingId === o.id}
                                                    >
                                                        {loadingId === o.id ? "⏳ Marcando..." : "✓ Marcar Entregue"}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
