"use client";

import React, { useState } from "react";
import { marcarComoEntregue } from "./actions";

function StatusBadge({ status }: { status: string }) {
    const map: any = {
        Pendente: "badge-pending", PENDENTE: "badge-pending",
        Entregue: "badge-done", ENTREGUE: "badge-done",
        Atrasada: "badge-late", ATRASADA: "badge-late"
    };
    return <span className={`badge ${map[status] || "badge-pending"}`}>{status}</span>;
}

function diasRestantes(dataVenc: string | Date | number) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diffTs = new Date(dataVenc).getTime() - hoje.getTime();
    return Math.ceil(diffTs / (1000 * 60 * 60 * 24));
}

function fmt(data: Date) {
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function ObrigacoesView({ initialObrigacoes, clientes }: { initialObrigacoes: any[], clientes: any[] }) {
    const [filtroStatus, setFiltroStatus] = useState("Todos");
    const [filtroTipo, setFiltroTipo] = useState("Todos");
    const [filtroCliente, setFiltroCliente] = useState("Todos");
    const [busca, setBusca] = useState("");
    const [modal, setModal] = useState(false);
    const [selecionada, setSelecionada] = useState<any>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const filtradas = initialObrigacoes.filter(o => {
        // Normalizar status
        const oStatus = o.status === "ATRASADA" ? "Atrasada" : (o.status === "ENTREGUE" ? "Entregue" : "Pendente");
        const mS = filtroStatus === "Todos" || oStatus === filtroStatus;
        const mT = filtroTipo === "Todos" || o.esfera === filtroTipo.toUpperCase() || o.esfera === filtroTipo; // O banco usa MUNICIPAL, ESTADUAL, FEDERAL
        const mC = filtroCliente === "Todos" || o.clientId === filtroCliente;
        const clientName = o.client?.razaoSocial || "";
        const mB = o.nome.toLowerCase().includes(busca.toLowerCase()) || clientName.toLowerCase().includes(busca.toLowerCase());
        return mS && mT && mC && mB;
    });

    const handleMarcarEntregue = async (id: string) => {
        setLoadingId(id);
        await marcarComoEntregue(id);
        setLoadingId(null);
        if (selecionada && selecionada.id === id) {
            setModal(false);
        }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Controle de Obrigações</h1>
                    <p className="page-sub">{filtradas.length} obrigações encontradas</p>
                </div>
            </div>

            <div className="card">
                <div className="table-toolbar flex-wrap">
                    <input className="search-input" placeholder="Buscar por termo..." value={busca} onChange={e => setBusca(e.target.value)} />
                    <div className="filter-group">
                        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                            <option>Todos</option><option>Pendente</option><option>Entregue</option><option>Atrasada</option>
                        </select>
                        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                            <option>Todos</option><option>FEDERAL</option><option>ESTADUAL</option><option>MUNICIPAL</option>
                        </select>
                        <select value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)}>
                            <option value="Todos">Todos os clientes</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.razaoSocial.split(" ").slice(0, 3).join(" ")}</option>)}
                        </select>
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Obrigação</th>
                            <th>Esfera</th>
                            <th>Competência</th>
                            <th>Vencimento</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtradas.slice(0, 60).map(o => {
                            const oStatus = o.status === "ATRASADA" ? "Atrasada" : (o.status === "ENTREGUE" ? "Entregue" : "Pendente");
                            const dias = diasRestantes(o.vencimento);
                            const cliNome = o.client?.razaoSocial || "";

                            return (
                                <tr key={o.id} className={oStatus === "Atrasada" ? "row-late" : (dias <= 3 && oStatus === "Pendente" ? "row-urgent" : "")}>
                                    <td><strong>{cliNome.split(" ").slice(0, 2).join(" ")}</strong></td>
                                    <td><span className="ob-nome">{o.nome}</span></td>
                                    <td><span className={`tipo-tag tipo-${o.esfera.toLowerCase()}`}>{o.esfera}</span></td>
                                    <td className="mono">{o.competencia}</td>
                                    <td>
                                        <span className={dias < 0 && oStatus !== "Entregue" ? "text-red" : (dias <= 3 && oStatus !== "Entregue" ? "text-orange" : "")}>
                                            {fmt(new Date(o.vencimento))}
                                        </span>
                                        {oStatus !== "Entregue" && (
                                            <span className="dias-hint">
                                                {dias < 0 ? ` (${Math.abs(dias)}d atr.)` : (dias === 0 ? " (Hoje)" : `(${dias}d)`)}
                                            </span>
                                        )}
                                    </td>
                                    <td><StatusBadge status={oStatus} /></td>
                                    <td>
                                        <button className="btn-icon" onClick={() => { setSelecionada(o); setModal(true); }} title="Detalhes">📋</button>
                                        {oStatus !== "Entregue" && (
                                            <button
                                                className="btn-icon btn-check"
                                                onClick={() => handleMarcarEntregue(o.id)}
                                                disabled={loadingId === o.id}
                                                title="Marcar como entregue"
                                            >
                                                {loadingId === o.id ? "⏳" : "✓"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filtradas.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text3)" }}>
                        <p>Nenhuma obrigação encontrada com os filtros atuais.</p>
                    </div>
                )}
            </div>

            {modal && selecionada && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Detalhes da Obrigação</h2>
                            <button className="modal-close" onClick={() => setModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="detalhe-grid">
                                <div className="detalhe-item">
                                    <span className="detalhe-label">Obrigação</span>
                                    <strong>{selecionada.nome}</strong>
                                </div>
                                <div className="detalhe-item">
                                    <span className="detalhe-label">Cliente</span>
                                    <span>{selecionada.client?.razaoSocial}</span>
                                </div>
                                <div className="detalhe-item">
                                    <span className="detalhe-label">Esfera</span>
                                    <span className={`tipo-tag tipo-${selecionada.esfera.toLowerCase()}`}>{selecionada.esfera}</span>
                                </div>
                                <div className="detalhe-item">
                                    <span className="detalhe-label">Regime</span>
                                    <span>{selecionada.client?.regime}</span>
                                </div>
                                <div className="detalhe-item">
                                    <span className="detalhe-label">Competência</span>
                                    <span className="mono">{selecionada.competencia}</span>
                                </div>
                                <div className="detalhe-item">
                                    <span className="detalhe-label">Vencimento</span>
                                    <span>{fmt(new Date(selecionada.vencimento))}</span>
                                </div>
                            </div>
                            <div className="upload-zone">
                                <span>📎 Anexo de recibo temporariamente indisponível no mock local</span>
                            </div>
                            {selecionada.status !== "Entregue" && selecionada.status !== "ENTREGUE" && (
                                <button
                                    className="btn-primary btn-full"
                                    onClick={() => handleMarcarEntregue(selecionada.id)}
                                    disabled={loadingId === selecionada.id}
                                >
                                    {loadingId === selecionada.id ? "Marcando..." : "✓ Marcar como Entregue"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
