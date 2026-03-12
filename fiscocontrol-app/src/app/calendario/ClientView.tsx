"use client";
import React, { useState } from "react";

function StatusBadge({ status }: { status: string }) {
    const map: any = {
        Pendente: "badge-pending", PENDENTE: "badge-pending",
        Entregue: "badge-done", ENTREGUE: "badge-done",
        Atrasada: "badge-late", ATRASADA: "badge-late"
    };
    return <span className={`badge ${map[status] || "badge-pending"}`}>{status}</span>;
}

export function CalendarioView({ initialObrigacoes }: { initialObrigacoes: any[] }) {
    const hoje = new Date();
    const [mesVis, setMesVis] = useState(hoje.getMonth());
    const [anoVis, setAnoVis] = useState(hoje.getFullYear());
    const [diaModal, setDiaModal] = useState<any>(null);

    const primeiroDia = new Date(anoVis, mesVis, 1).getDay();
    const diasNoMes = new Date(anoVis, mesVis + 1, 0).getDate();

    const obPorDia: any = {};

    initialObrigacoes.forEach(o => {
        // Normalizar status
        o.statusNormalizado = o.status === "ATRASADA" ? "Atrasada" : (o.status === "ENTREGUE" ? "Entregue" : "Pendente");
        const v = new Date(o.vencimento);
        if (v.getMonth() === mesVis && v.getFullYear() === anoVis) {
            const d = v.getDate();
            if (!obPorDia[d]) obPorDia[d] = [];
            obPorDia[d].push({
                ...o,
                clienteNome: o.client?.razaoSocial || "Desconhecido",
                obrigacao: o.nome,
                tipo: o.esfera
            });
        }
    });

    const nomeMes = new Date(anoVis, mesVis, 1).toLocaleString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });

    const dias = [
        ...Array.from({ length: primeiroDia }, (_, i) => ({ vazio: true, dia: i })),
        ...Array.from({ length: diasNoMes }, (_, i) => ({ dia: i + 1, obs: obPorDia[i + 1] || [] }))
    ];

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Calendário Fiscal</h1>
                    <p className="page-sub">Vencimentos e competências centralizados</p>
                </div>
                <div className="cal-nav">
                    <button className="btn-nav" onClick={() => { if (mesVis === 0) { setMesVis(11); setAnoVis(anoVis - 1); } else setMesVis(mesVis - 1); }}>‹</button>
                    <span className="cal-mes" style={{ textTransform: "capitalize" }}>{nomeMes}</span>
                    <button className="btn-nav" onClick={() => { if (mesVis === 11) { setMesVis(0); setAnoVis(anoVis + 1); } else setMesVis(mesVis + 1); }}>›</button>
                </div>
            </div>

            <div className="card">
                <div className="cal-grid-header">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => <span key={d} className="cal-dow">{d}</span>)}
                </div>
                <div className="cal-grid">
                    {dias.map((item: any, i: number) => {
                        if (item.vazio) return <div key={`v${i}`} className="cal-cell cal-empty" />;
                        const isHoje = item.dia === hoje.getDate() && mesVis === hoje.getMonth() && anoVis === hoje.getFullYear();
                        const temAtr = item.obs.some((o: any) => o.statusNormalizado === "Atrasada");
                        const temPend = item.obs.some((o: any) => o.statusNormalizado === "Pendente");

                        return (
                            <div
                                key={`d${item.dia}`}
                                className={`cal-cell ${isHoje ? "cal-today" : ""} ${item.obs.length ? "cal-has-obs" : ""}`}
                                onClick={() => item.obs.length && setDiaModal({ dia: item.dia, obs: item.obs })}
                            >
                                <span className="cal-day-num">{item.dia}</span>
                                {temAtr && <span className="cal-dot cal-dot-red" />}
                                {temPend && !temAtr && <span className="cal-dot cal-dot-orange" />}
                                {item.obs.length > 0 && !temAtr && !temPend && <span className="cal-dot cal-dot-green" />}
                                {item.obs.length > 0 && <span className="cal-count">{item.obs.length}</span>}
                            </div>
                        );
                    })}
                </div>
                <div className="cal-legend">
                    <span><span className="leg-dot" style={{ background: "#ef4444" }} />Em atraso</span>
                    <span><span className="leg-dot" style={{ background: "#f59e0b" }} />Pendente</span>
                    <span><span className="leg-dot" style={{ background: "#22c55e" }} />Entregue</span>
                </div>
            </div>

            {diaModal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDiaModal(null)}>
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Obrigações — {String(diaModal.dia).padStart(2, "0")}/{String(mesVis + 1).padStart(2, "0")}/{anoVis}</h2>
                            <button className="modal-close" onClick={() => setDiaModal(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {diaModal.obs.map((o: any) => (
                                <div key={o.id} className="cal-ob-item">
                                    <StatusBadge status={o.statusNormalizado} />
                                    <div>
                                        <strong>{o.obrigacao}</strong>
                                        <span className="text-muted"> — {o.clienteNome.split(" ").slice(0, 2).join(" ")}</span>
                                    </div>
                                    <span className={`tipo-tag tipo-${o.tipo?.toLowerCase()}`}>{o.tipo}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
