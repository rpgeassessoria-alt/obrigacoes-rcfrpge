import React from "react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Filter } from "lucide-react";

export default async function ObrigacoesPage() {
    const obligations = await prisma.obligation.findMany({
        orderBy: { vencimento: "asc" },
        include: { client: true },
        take: 50 // Paginação simplificada
    });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">📋 Obrigações Fiscais</h1>
                    <p className="page-sub">Controle de entregas e vencimentos</p>
                </div>
            </div>

            <Card>
                <div className="table-toolbar">
                    <div className="filter-group" style={{ flex: 1 }}>
                         <button className="btn-secondary" style={{ display: 'flex', gap: 6 }}>
                            <Filter size={14} /> Filtros Avançados
                         </button>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text3)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)' }}></div> Atrasadas
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)' }}></div> Vencendo
                        </span>
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Vencimento</th>
                            <th>Obrigação</th>
                            <th>Cliente</th>
                            <th>Competência</th>
                            <th>Esfera</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {obligations.map((ob) => (
                            <tr key={ob.id}>
                                <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <Calendar size={14} color="var(--text3)" />
                                        <span style={{ 
                                            fontWeight: 600,
                                            color: ob.vencimento.getTime() < Date.now() && ob.status !== "ENTREGUE" ? "var(--red)" : "var(--text)"
                                        }}>
                                            {ob.vencimento.toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{ob.nome}</div>
                                    <div style={{ fontSize: 11, color: "var(--text3)" }}>ID: {ob.identifier}</div>
                                </td>
                                <td>{ob.client.razaoSocial}</td>
                                <td style={{ fontFamily: "var(--mono)" }}>{ob.competencia}</td>
                                <td>
                                    <span className={`tipo-tag tipo-${ob.esfera.toLowerCase()}`}>{ob.esfera}</span>
                                </td>
                                <td>
                                    <Badge variant={
                                        ob.status === "ENTREGUE" ? "done" : 
                                        ob.vencimento.getTime() < Date.now() ? "late" : "pending"
                                    }>
                                        {ob.status === "PENDENTE" && ob.vencimento.getTime() < Date.now() ? "ATRASADA" : ob.status}
                                    </Badge>
                                </td>
                                <td>
                                    <button className="btn-icon">👁️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
