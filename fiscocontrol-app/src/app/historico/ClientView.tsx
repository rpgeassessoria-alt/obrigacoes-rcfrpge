"use client";

import React, { useState } from "react";

function fmtDate(data: Date) {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function fmtDateTime(data: Date) {
    if (!data) return "";
    return new Date(data).toLocaleString("pt-BR", { timeZone: "UTC" });
}

export function HistoricoView({ initialEntregas, clientes }: { initialEntregas: any[], clientes: any[] }) {
    const [filtroCliente, setFiltroCliente] = useState("Todos");
    const [filtroMesAno, setFiltroMesAno] = useState("");
    const [busca, setBusca] = useState("");

    // Configurações de paginação
    const [pagina, setPagina] = useState(1);
    const itensPorPagina = 20;

    const filtradas = initialEntregas.filter(e => {
        const mC = filtroCliente === "Todos" || e.clientId === filtroCliente;
        const clientName = e.client?.razaoSocial || "";
        const mB = e.nome.toLowerCase().includes(busca.toLowerCase()) || clientName.toLowerCase().includes(busca.toLowerCase());

        let mM = true;
        if (filtroMesAno) {
            // e.updatedAt ou e.vencimento? Vamos filtrar por data de entrega (updatedAt)
            const dt = new Date(e.updatedAt);
            const mesAno = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}`;
            mM = mesAno === filtroMesAno;
        }

        return mC && mB && mM;
    });

    // Calcular paginação
    const totalPaginas = Math.ceil(filtradas.length / itensPorPagina);
    const inicioId = (pagina - 1) * itensPorPagina;
    const paginadas = filtradas.slice(inicioId, inicioId + itensPorPagina);

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Histórico de Entregas</h1>
                    <p className="page-sub">{filtradas.length} entregas registradas no histórico</p>
                </div>
            </div>

            <div className="card">
                <div className="table-toolbar flex-wrap">
                    <input
                        className="search-input"
                        placeholder="Buscar obrigação ou cliente..."
                        value={busca}
                        onChange={e => { setBusca(e.target.value); setPagina(1); }}
                    />
                    <div className="filter-group">
                        <select value={filtroCliente} onChange={e => { setFiltroCliente(e.target.value); setPagina(1); }}>
                            <option value="Todos">Todos os clientes</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.razaoSocial.split(" ").slice(0, 3).join(" ")}</option>)}
                        </select>
                        <input
                            type="month"
                            className="search-input"
                            value={filtroMesAno}
                            onChange={e => { setFiltroMesAno(e.target.value); setPagina(1); }}
                            title="Filtrar por Mês de Entrega"
                        />
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Obrigação</th>
                            <th>Esfera</th>
                            <th>Competência</th>
                            <th>Vencimento Original</th>
                            <th>Data/Hora de Entrega</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginadas.map(e => (
                            <tr key={e.id}>
                                <td><strong>{e.client?.razaoSocial.split(" ").slice(0, 2).join(" ")}</strong></td>
                                <td><span className="ob-nome">{e.nome}</span></td>
                                <td><span className={`tipo-tag tipo-${e.esfera?.toLowerCase()}`}>{e.esfera}</span></td>
                                <td className="mono">{e.competencia}</td>
                                <td>{fmtDate(e.vencimento)}</td>
                                <td style={{ color: "var(--primary)", fontWeight: "500" }}>{fmtDateTime(e.updatedAt)}</td>
                                <td><span className="badge badge-done">Entregue</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtradas.length > 0 && totalPaginas > 1 && (
                    <div className="pagination" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderTop: "1px solid var(--border)" }}>
                        <span style={{ fontSize: "0.9rem", color: "var(--text3)" }}>
                            Mostrando {inicioId + 1} a {Math.min(inicioId + itensPorPagina, filtradas.length)} de {filtradas.length}
                        </span>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button
                                className="btn-secondary"
                                disabled={pagina === 1}
                                onClick={() => setPagina(p => p - 1)}
                                style={{ padding: "6px 12px" }}
                            >
                                Anterior
                            </button>
                            <span style={{ padding: "6px 12px", background: "var(--bg-app)", borderRadius: "6px", border: "1px solid var(--border)" }}>
                                {pagina} / {totalPaginas}
                            </span>
                            <button
                                className="btn-secondary"
                                disabled={pagina === totalPaginas}
                                onClick={() => setPagina(p => p + 1)}
                                style={{ padding: "6px 12px" }}
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                )}

                {filtradas.length === 0 && (
                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text3)" }}>
                        <p>Nenhuma entrega encontrada para os filtros selecionados.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
