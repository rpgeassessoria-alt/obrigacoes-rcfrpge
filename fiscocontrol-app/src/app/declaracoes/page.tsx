"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ExternalLink, Search } from "lucide-react";

const ESTADOS = [
    { uf: "AC", nome: "Acre", url: "http://www.sefaz.ac.gov.br/" },
    { uf: "AL", nome: "Alagoas", url: "http://www.sefaz.al.gov.br/" },
    { uf: "AP", nome: "Amapá", url: "http://www.sefaz.ap.gov.br/" },
    { uf: "AM", nome: "Amazonas", url: "http://www.sefaz.am.gov.br/" },
    { uf: "BA", nome: "Bahia", url: "http://www.sefaz.ba.gov.br/" },
    { uf: "CE", nome: "Ceará", url: "http://www.sefaz.ce.gov.br/" },
    { uf: "DF", nome: "Distrito Federal", url: "http://www.fazenda.df.gov.br/" },
    { uf: "ES", nome: "Espírito Santo", url: "http://www.sefaz.es.gov.br/" },
    { uf: "GO", nome: "Goiás", url: "http://www.sefaz.go.gov.br/" },
    { uf: "MA", nome: "Maranhão", url: "http://www.sefaz.ma.gov.br/" },
    { uf: "MT", nome: "Mato Grosso", url: "http://www.sefaz.mt.gov.br/" },
    { uf: "MS", nome: "Mato Grosso do Sul", url: "http://www.sefaz.ms.gov.br/" },
    { uf: "MG", nome: "Minas Gerais", url: "http://www.fazenda.mg.gov.br/" },
    { uf: "PA", nome: "Pará", url: "http://www.sefa.pa.gov.br/" },
    { uf: "PB", nome: "Paraíba", url: "http://www.receita.pb.gov.br/" },
    { uf: "PR", nome: "Paraná", url: "http://www.fazenda.pr.gov.br/" },
    { uf: "PE", nome: "Pernambuco", url: "http://www.sefaz.pe.gov.br/" },
    { uf: "PI", nome: "Piauí", url: "http://www.sefaz.pi.gov.br/" },
    { uf: "RJ", nome: "Rio de Janeiro", url: "http://www.fazenda.rj.gov.br/" },
    { uf: "RN", nome: "Rio Grande do Norte", url: "http://www.set.rn.gov.br/" },
    { uf: "RS", nome: "Rio Grande do Sul", url: "http://www.sefaz.rs.gov.br/" },
    { uf: "RO", nome: "Rondônia", url: "http://www.sefin.ro.gov.br/" },
    { uf: "RR", nome: "Roraima", url: "http://www.sefaz.rr.gov.br/" },
    { uf: "SC", nome: "Santa Catarina", url: "http://www.sef.sc.gov.br/" },
    { uf: "SP", nome: "São Paulo", url: "https://www.cadesp.fazenda.sp.gov.br/" },
    { uf: "SE", nome: "Sergipe", url: "http://www.sefaz.se.gov.br/" },
    { uf: "TO", nome: "Tocantins", url: "http://www.sefaz.to.gov.br/" },
];

export default function AgenteSintegraPage() {
    const [busca, setBusca] = useState("");

    const estadosFiltrados = ESTADOS.filter(
        e => e.nome.toLowerCase().includes(busca.toLowerCase()) || 
             e.uf.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">🤖 Agente SINTEGRA</h1>
                    <p className="page-sub">Acesso rápido aos portais estaduais (SEFAZ)</p>
                </div>
            </div>

            <Card>
                <div style={{ marginBottom: 20 }}>
                    <div style={{ position: "relative", maxWidth: 400 }}>
                        <Search style={{ position: "absolute", left: 10, top: 10, color: "var(--text3)" }} size={16} />
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Buscar estado..." 
                            style={{ paddingLeft: 36 }}
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                    {estadosFiltrados.map((estado) => (
                        <a 
                            key={estado.uf} 
                            href={estado.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div className="card" style={{ 
                                height: "100%", 
                                display: "flex", 
                                flexDirection: "column", 
                                alignItems: "center", 
                                justifyContent: "center",
                                textAlign: "center",
                                padding: 24,
                                border: "1px solid var(--border)",
                                transition: "all 0.2s"
                            }}>
                                <div style={{ 
                                    fontSize: 24, 
                                    fontWeight: 800, 
                                    color: "var(--accent)", 
                                    marginBottom: 8 
                                }}>
                                    {estado.uf}
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 500 }}>{estado.nome}</div>
                                <div style={{ marginTop: 12, fontSize: 11, color: "var(--text3)", display: "flex", alignItems: "center", gap: 4 }}>
                                    Acessar Portal <ExternalLink size={10} />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </Card>
        </div>
    );
}
