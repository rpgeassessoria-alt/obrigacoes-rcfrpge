import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Plus } from "lucide-react";

async function getClientes() {
    return await prisma.client.findMany({
        orderBy: {
            razaoSocial: 'asc'
        },
        include: {
            group: true,
            responsible: true
        }
    });
}

export default async function ClientesPage() {
    const clientes = await getClientes();

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">👥 Clientes</h1>
                    <p className="page-sub">Gestão de empresas e inquilinos fiscais</p>
                </div>
                <Link href="/clientes/novo">
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Plus size={16} /> Novo Cliente
                    </button>
                </Link>
            </div>

            <Card>
                <div className="table-toolbar">
                    <input type="text" placeholder="Buscar por nome, CNPJ..." className="search-input" />
                    <div className="filter-group">
                        <select>
                            <option>Todos os Regimes</option>
                            <option>Simples Nacional</option>
                            <option>Lucro Presumido</option>
                            <option>Lucro Real</option>
                        </select>
                        <select>
                            <option>Status: Ativo</option>
                            <option>Inativo</option>
                        </select>
                    </div>
                </div>

                {clientes.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text3)" }}>
                        <Users size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
                        <p>Nenhum cliente cadastrado.</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Razão Social / Fantasia</th>
                                <th>CNPJ</th>
                                <th>Regime</th>
                                <th>Grupo</th>
                                <th>Responsável</th>
                                <th>Risco</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{cliente.razaoSocial}</div>
                                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{cliente.cnae}</div>
                                    </td>
                                    <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
                                        {cliente.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}
                                    </td>
                                    <td>
                                        <span className="regime-tag">{cliente.regime.replace("_", " ")}</span>
                                    </td>
                                    <td>{cliente.group?.name || "-"}</td>
                                    <td>
                                        {cliente.responsible ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <div className="avatar-sm" style={{ width: 20, height: 20, fontSize: 9 }}>
                                                    {cliente.responsible.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span style={{ fontSize: 12 }}>{cliente.responsible.name.split(" ")[0]}</span>
                                            </div>
                                        ) : "-"}
                                    </td>
                                    <td>
                                        <span style={{ 
                                            color: cliente.risco === "Alto" ? "var(--red)" : 
                                                   cliente.risco === "Médio" ? "var(--orange)" : "var(--green)",
                                            fontWeight: 600,
                                            fontSize: 11
                                        }}>
                                            {cliente.risco}
                                        </span>
                                    </td>
                                    <td>
                                        <Badge variant={cliente.status === "Ativo" ? "done" : "late"}>
                                            {cliente.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Link href={`/clientes/${cliente.id}`}>
                                            <button className="btn-icon">✏️</button>
                                        </Link>
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
