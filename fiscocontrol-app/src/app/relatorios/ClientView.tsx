"use client";
import React from "react";

export function RelatoriosView({ clientes, obrigacoes }: { clientes: any[], obrigacoes: any[] }) {
    const normOb = obrigacoes.map(o => ({
        ...o,
        status: o.status === "ATRASADA" ? "Atrasada" : (o.status === "ENTREGUE" ? "Entregue" : "Pendente"),
        tipo: o.esfera?.charAt(0).toUpperCase() + o.esfera?.slice(1).toLowerCase() || "Federal"
    }));

    const total = normOb.length;
    const entregues = normOb.filter(o => o.status === "Entregue").length;
    const atrasadas = normOb.filter(o => o.status === "Atrasada").length;
    const pendentes = normOb.filter(o => o.status === "Pendente").length;

    const compliance = total > 0 ? Math.round(entregues / total * 100) : 100;

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Relatórios e Análises</h1>
                    <p className="page-sub">Indicadores de compliance e desempenho</p>
                </div>
                <button className="btn-primary">📥 Exportar PDF</button>
            </div>

            <div className="dash-row">
                <div className="card">
                    <h3 className="card-title">Análise de Compliance</h3>
                    {total > 0 ? (
                        <div className="compliance-circle-wrap">
                            <svg viewBox="0 0 120 120" className="donut-svg">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="12" />
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#22c55e" strokeWidth="12" strokeDasharray={`${(entregues / total) * 314} 314`} strokeDashoffset="78.5" strokeLinecap="round" />
                                <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="12" strokeDasharray={`${(atrasadas / total) * 314} 314`} strokeDashoffset={`${78.5 - (entregues / total) * 314}`} strokeLinecap="round" />
                                <text x="60" y="55" textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="bold">{Math.round(entregues / total * 100)}%</text>
                                <text x="60" y="73" textAnchor="middle" fill="#94a3b8" fontSize="9">compliance</text>
                            </svg>
                        </div>
                    ) : (
                        <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>Sem dados suficientes</div>
                    )}
                    <div className="compliance-stats">
                        <div className="cs-item"><span className="cs-dot" style={{ background: "#22c55e" }} /><span>Entregues</span><strong>{entregues}</strong></div>
                        <div className="cs-item"><span className="cs-dot" style={{ background: "#f59e0b" }} /><span>Pendentes</span><strong>{pendentes}</strong></div>
                        <div className="cs-item"><span className="cs-dot" style={{ background: "#ef4444" }} /><span>Atrasadas</span><strong>{atrasadas}</strong></div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">Por Regime Tributário</h3>
                    {["Simples Nacional", "Lucro Presumido", "Lucro Real", "MEI"].map(r => {
                        // Em nosso sistema atual a obligation nao tem 'regime', a gente deduz do cliente
                        const obsDoRegime = normOb.filter(o => {
                            const cli = clientes.find(c => c.id === o.clientId);
                            return cli && cli.regime === r;
                        });
                        const t = obsDoRegime.length;
                        const ok = obsDoRegime.filter(o => o.status === "Entregue").length;
                        if (!t) return null;
                        const pct = Math.round(ok / t * 100);
                        return (
                            <div key={r} className="regime-bar-item">
                                <div className="regime-bar-label"><span>{r}</span><span>{pct}%</span></div>
                                <div className="regime-bar-track">
                                    <div className="regime-bar-fill" style={{ width: `${pct}%`, background: pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444" }} />
                                </div>
                                <span className="regime-bar-total">{ok}/{t}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="card">
                    <h3 className="card-title">Por Esfera</h3>
                    {["Federal", "Estadual", "Municipal"].map(tipo => {
                        const t = normOb.filter(o => o.tipo === tipo).length;
                        const ok = normOb.filter(o => o.tipo === tipo && o.status === "Entregue").length;
                        const atr = normOb.filter(o => o.tipo === tipo && o.status === "Atrasada").length;
                        if (!t) return null;
                        return (
                            <div key={tipo} className="tipo-stat-item">
                                <div className="tipo-ico">{tipo === "Federal" ? "🏛️" : tipo === "Estadual" ? "🏢" : "🏙️"}</div>
                                <div className="tipo-stat-body">
                                    <strong>{tipo}</strong>
                                    <div className="tipo-stat-bar-wrap">
                                        <div className="tipo-stat-bar" style={{ width: `${ok / t * 100}%`, background: "#22c55e" }} />
                                        <div className="tipo-stat-bar" style={{ width: `${atr / t * 100}%`, background: "#ef4444" }} />
                                    </div>
                                </div>
                                <div className="tipo-stat-nums"><span>{ok} ok</span><span className="text-red">{atr} atr</span></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="card">
                <h3 className="card-title">Relatório por Cliente</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Regime</th>
                            <th>Total</th>
                            <th>Entregues</th>
                            <th>Pendentes</th>
                            <th>Atrasadas</th>
                            <th>Compliance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(c => {
                            const obs = normOb.filter(o => o.clientId === c.id);
                            if (obs.length === 0) return null; // Só mostrar clientes com obrigações geradas no periodo
                            const ent = obs.filter(o => o.status === "Entregue").length;
                            const pend = obs.filter(o => o.status === "Pendente").length;
                            const atr = obs.filter(o => o.status === "Atrasada").length;
                            const comp = obs.length ? Math.round(ent / obs.length * 100) : 0;
                            return (
                                <tr key={c.id}>
                                    <td><strong>{c.razaoSocial.split(" ").slice(0, 3).join(" ")}</strong></td>
                                    <td><span className="regime-tag">{c.regime}</span></td>
                                    <td>{obs.length}</td>
                                    <td className="text-green">{ent}</td>
                                    <td className="text-orange">{pend}</td>
                                    <td className="text-red">{atr}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div className="mini-bar-track">
                                                <div className="mini-bar-fill" style={{ width: `${comp}%`, background: comp >= 80 ? "#22c55e" : comp >= 50 ? "#f59e0b" : "#ef4444" }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 600 }}>{comp}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
