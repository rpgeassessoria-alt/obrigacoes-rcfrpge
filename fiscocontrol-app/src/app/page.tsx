"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    ListTodo, 
    Building2, 
    BarChart,
    Download,
    Plus
} from 'lucide-react';

interface KpiData {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
}

interface Obligation {
    id: number;
    clienteNome: string;
    obrigacao: string;
    vencimento: string;
    status: string;
    tipo: string;
}

export default function DashboardPage() {
    const [kpis, setKpis] = useState<KpiData[]>([]);
    const [recentObligations, setRecentObligations] = useState<Obligation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/dashboard");
                if (!res.ok) throw new Error("Falha ao buscar dados");
                const data = await res.json();
                setKpis(data.kpis);
                setRecentObligations(data.recentObligations);
            } catch {
                // mock data for dev
                setKpis([
                    { label: "Vencendo Hoje", value: 3, icon: <Clock size={24} />, color: "var(--orange)" },
                    { label: "Atrasadas", value: 7, icon: <AlertCircle size={24} />, color: "var(--red)" },
                    { label: "Entregues", value: 142, icon: <CheckCircle2 size={24} />, color: "var(--green)" },
                    { label: "Pendentes", value: 24, icon: <ListTodo size={24} />, color: "var(--accent)" },
                    { label: "Clientes", value: 5, icon: <Building2 size={24} />, color: "#7239ea" },
                    { label: "Total", value: 173, icon: <BarChart size={24} />, color: "#06bbe9" },
                ]);
                setRecentObligations([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--text3)" }}>
                Carregando painel...
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Painel de Controle</h1>
                    <p className="page-sub">Visão geral das obrigações fiscais e monitoramento de clientes</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Download size={16} /> Exportar
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Plus size={16} /> Nova Obrigação
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                {kpis.map((kpi, i) => (
                    <div key={i} className="kpi-card" style={{ borderLeft: `3px solid ${kpi.color}` }}>
                        <span className="kpi-icon">{kpi.icon}</span>
                        <div>
                            <span className="kpi-num" style={{ color: kpi.color }}>{kpi.value}</span>
                            <span className="kpi-label">{kpi.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Obrigações Recentes */}
            <Card title="📋 Obrigações com Vencimento Próximo">
                {recentObligations.length === 0 ? (
                    <p className="empty-msg">Nenhuma obrigação próxima do vencimento.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Obrigação</th>
                                <th>Vencimento</th>
                                <th>Tipo</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentObligations.map((ob) => (
                                <tr key={ob.id}>
                                    <td>{ob.clienteNome}</td>
                                    <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{ob.obrigacao}</td>
                                    <td>{new Date(ob.vencimento).toLocaleDateString("pt-BR")}</td>
                                    <td>
                                        <span className={`tipo-tag tipo-${ob.tipo?.toLowerCase() || "federal"}`}>{ob.tipo}</span>
                                    </td>
                                    <td>
                                        <Badge variant={ob.status === "Entregue" ? "done" : ob.status === "Atrasada" ? "late" : "pending"}>
                                            {ob.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
}
