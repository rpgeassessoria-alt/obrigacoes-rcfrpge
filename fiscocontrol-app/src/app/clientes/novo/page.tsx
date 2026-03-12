"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Search, Loader2 } from "lucide-react";
import { createClient } from "@/app/actions/clientes";

export default function NovoClientePage() {
    const [cnpj, setCnpj] = useState("");
    const [loading, setLoading] = useState(false);
    const [dados, setDados] = useState<any>(null);

    const buscarCnpj = async () => {
        if (!cnpj || cnpj.length < 14) return;
        setLoading(true);
        try {
            const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj.replace(/\D/g, "")}`);
            if (!res.ok) throw new Error("CNPJ não encontrado");
            const data = await res.json();
            setDados({
                razaoSocial: data.razao_social,
                nomeFantasia: data.nome_fantasia,
                cnae: data.cnae_fiscal_descricao,
                logradouro: `${data.logradouro}, ${data.numero}`,
                bairro: data.bairro,
                cidade: data.municipio,
                uf: data.uf,
                cep: data.cep
            });
        } catch (error) {
            alert("Erro ao buscar CNPJ. Preencha manualmente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div className="page-header">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Link href="/clientes">
                        <button className="btn-icon"><ChevronLeft size={20} /></button>
                    </Link>
                    <div>
                        <h1 className="page-title">Novo Cliente</h1>
                        <p className="page-sub">Cadastro de empresa no sistema</p>
                    </div>
                </div>
            </div>

            <form action={createClient} className="card">
                <div className="form-grid">
                    <div className="form-group span-2">
                        <label>CNPJ (Somente Números)</label>
                        <div style={{ display: "flex", gap: 8 }}>
                            <input 
                                name="cnpj" 
                                type="text" 
                                value={cnpj}
                                onChange={(e) => setCnpj(e.target.value)}
                                placeholder="00.000.000/0001-91" 
                                maxLength={18}
                            />
                            <button 
                                type="button" 
                                className="btn-secondary" 
                                onClick={buscarCnpj}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                            </button>
                        </div>
                        <p className="form-hint">Clique na lupa para preencher automaticamente.</p>
                    </div>

                    <div className="form-group span-2">
                        <label>Razão Social</label>
                        <input 
                            name="razaoSocial" 
                            type="text" 
                            required 
                            defaultValue={dados?.razaoSocial || ""}
                        />
                    </div>

                    <div className="form-group">
                        <label>Regime Tributário</label>
                        <select name="regime" required>
                            <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                            <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                            <option value="LUCRO_REAL">Lucro Real</option>
                            <option value="MEI">MEI</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Risco Fiscal</label>
                        <select name="risco" defaultValue="Médio">
                            <option value="Baixo">Baixo</option>
                            <option value="Médio">Médio</option>
                            <option value="Alto">Alto</option>
                        </select>
                    </div>

                    <div className="form-group span-2">
                        <label>Atividade Principal (CNAE)</label>
                        <input 
                            name="cnae" 
                            type="text" 
                            placeholder="Ex: Desenvolvimento de Software"
                            defaultValue={dados?.cnae || ""}
                        />
                    </div>

                    {/* Campos ocultos ou adicionais se necessário */}
                </div>

                <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    <Link href="/clientes">
                        <button type="button" className="btn-secondary">Cancelar</button>
                    </Link>
                    <button type="submit" className="btn-primary">
                        Salvar Cliente
                    </button>
                </div>
            </form>
        </div>
    );
}
